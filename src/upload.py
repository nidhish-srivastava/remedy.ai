import json
from typing import Dict, List, Optional
from pinecone import Pinecone
from langchain.schema import Document
from langchain_community.callbacks import get_openai_callback
from dotenv import load_dotenv
load_dotenv()
import os
import logging
from pinecone import Index, Pinecone, PodSpec, ServerlessSpec
import uuid
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings


hf_inference_api_key = os.getenv("HF_INFERENCE_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")
embedding_model = os.getenv("EMBEDDING_MODEL")
API_URL = "https://api-inference.huggingface.co/models/BAAI/bge-large-en-v1.5"

def embed_text(texts):
    embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key=hf_inference_api_key, model_name="BAAI/bge-large-en-v1.5",api_url=API_URL
    )
    if isinstance(texts, str):
        texts = [texts]
    embedding = embeddings.embed_documents(texts)
    return embedding


def get_or_create_index(
    client: Pinecone,
    index=pinecone_index_name,
    metric='cosine',
    embedding_model: str = embedding_model,
    dimension = 1024,
    renew=False,
):
    """
    Retrieves an existing index with the specified metric from the Pinecone client,
    or creates a new index if it doesn't exist.

    Parameters:
        index:
        client (Pinecone): A Pinecone client instance used to interact with the service.
        metric (str): The metric to be used for the index. Default is "cosine".
        model (str): The embedding model to determine the dimension of the index. Default is "text-embedding-3-small".

    Returns:
        Pinecone.Index: The retrieved or newly created Pinecone index object.

    Raises:
        PineconeException: If there is an error interacting with the Pinecone service.
    """

    logging.info(f"Creating index {index} with metric {metric} and dimension {dimension}")
    spec = ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )

    if index in client.list_indexes().names():
        if renew:
            logging.info("index already exists, therefore clearing index")
            try:
                client.delete_index(name=index)
                logging.info("Cleared index")
            except Exception as e:
                logging.error(f"Error clearing index because, {e}")

            try:
                client.create_index(
                    name=index,
                    dimension=dimension,
                    metric=metric,
                    spec=spec)
                logging.info(f"Index, {metric} created successfully ")
            except Exception as e:
                logging.error(f"Error creating index, because {e}")
    else:
        try:
            client.create_index(
                name=index,
                dimension=dimension,
                metric=metric,
                spec=spec)

            logging.info(f"Index, {metric} created successfully ")
        except Exception as e:
            logging.error(f"Error creating index, because {e}")

    index_name = client.Index(index)

    return index_name

def pinecone_upload(
    client: Pinecone,
    docs: List[Document],
    ids: Optional[List[str]] = None,
    embedding_model: str = "BAAI/bge-large-en-v1.5",
    dimension: int = 1024,
    namespace: Optional[str] = None,
    index_name: str = pinecone_index_name,
    metric: Optional[str] = 'cosine'
):
    """
    Parameters:
    client (Pinecone):
    docs (List[Document]): A list of documents to be uploaded.
    dimension (int): The dimensionality of the embeddings.
    namespace (Optional[str] | None): The namespace for the documents. Defaults to None.
    index_name (str): The name of the index. Defaults to "default".
    Behavior:
    If namespace is not None, the function uses the Pinecone.from_texts() method to upload the documents with embeddings to the index, specifying the index_name, namespace, and a batch size of 40.
    If namespace is None, the function uses the Pinecone.from_texts() method to upload the documents with embeddings to the index, specifying the index_name and a batch size of 40.
    """
    logging.info(index_name)
    indexx = get_or_create_index(client, index_name, metric, embedding_model, dimension)

    texts = [doc.page_content for doc in docs]
    metadata_list = [doc.metadata for doc in docs]

    try:
        response = indexx.query(
            vector=[0] * dimension,
            top_k=1,
            include_values=False,  # include vector values
            include_metadata=True,
            namespace=namespace,
            filter={"uid": metadata_list[0]["uid"]},
        )
        
        if len(response["matches"]) > 0:
            logging.info(f"UID already in pinecone{metadata_list[0]['uid']}")
            print("UID already exists in pinecone")
            return
    except:
        logging.debug("Metadata: {}", metadata_list)

    if not ids:
        ids = [uuid.uuid4().hex for _ in texts]
    for metadata, text in zip(metadata_list, texts):
        metadata["text"] = text

    for i in range(0, len(texts), 30):
        logging.info(f"Uploading {i} vectors")
        chunk_texts = texts[i: i + 30]
        chunk_ids = ids[i: i + 30]
        chunk_metadatas = metadata_list[i: i + 30]

        try:
            dense_values = []
            for chunk in chunk_texts:
                val=embed_text([chunk])
                dense_values.append(val)
        except Exception as e:
            logging.error(f"Error at embedding docs: {e}")
            continue

        # Get data to upsert
        data = get_vectordata(chunk_ids,
                              chunk_metadatas,
                              dense_values,)
        for i in range(0, len(data), 128):
            indexx.upsert(namespace=namespace, vectors=data[i:i + 128])

def get_vectordata(chunk_ids, chunk_metadatas, dense_values, sparse_vectors = None):
    """
    Parameters:
    chunk_ids (List[]): A list of chunk ids containing integers
    chunk_metadatas (List[Dict]): Chunk of Document Metadatas
    dense_values (List[int]): A list of dense embeddings of the passages/chunks
    sparse_values (List[Dict]) default(None): A list of Dicts (keys: indices (List[int]) , values (List[int]))
    Returns:
    data (List[Dict]): A list of Dict configured for pinecone indexing
    """
    data = []
    if sparse_vectors is None:
        for (id, metadata, dense) in zip(chunk_ids, chunk_metadatas, dense_values):
            flattened_dense = [item for sublist in dense for item in sublist]  # Flatten the dense list

            data.append(
                {'id': f'vec{id}',
                'values': flattened_dense,
                'metadata': metadata,
                }
            )
    else:

        for (id, metadata, dense, sp) in zip(chunk_ids, chunk_metadatas, dense_values, sparse_vectors):
            flattened_dense = [item for sublist in dense for item in sublist]  # Flatten the dense list

            data.append(
                {'id': f'vec{id}',
                'values': flattened_dense,
                'metadata': metadata,
                'sparse_values': {
                    'indices': sp["indices"],
                    'values': sp["values"],
                }}
            )

    return data


def upload_data(docs: List[Document],namespace: str):

    pinecone_upload(
        Pinecone(pinecone_api_key, pool_threads=20),
        docs,
        embedding_model=embedding_model,
        index_name=pinecone_index_name,
        namespace=namespace,
        metric='cosine',
        dimension=1024,
    )


    return len(docs)