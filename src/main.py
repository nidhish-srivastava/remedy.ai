from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import os
import traceback
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import numpy as np
from openai import AsyncOpenAI
from typing import Dict, List, Optional
import aiofiles
from fastapi import FastAPI, File, Form, UploadFile, Depends, HTTPException, Request
import json
from data_loader import load_documents
from upload import upload_data
import logging
# from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
logging.basicConfig(level=logging.INFO)

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")
# inference_api_key=os.getenv("HF_INFERENCE_API_KEY")

# embeddings = HuggingFaceInferenceAPIEmbeddings(
#     api_key=inference_api_key, model_name="BAAI/bge-large-en"
# )
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.5, openai_api_key=openai_api_key)
model = SentenceTransformer('BAAI/bge-large-en')
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index(pinecone_index_name)
logging.info(index.describe_index_stats())

def embed_text(texts):
    if isinstance(texts, str):
        texts = [texts]
    embeddings = model.encode(texts)
    return embeddings.tolist() if isinstance(embeddings, np.ndarray) else embeddings

text_field = "text"
logging.info("Vector store successfully initialized with Pinecone and LangChain.")

namespace = 'yashsrivastava634@gmail.com'

class Query(BaseModel):
    query: str

class Namespace(BaseModel):
    set_namespace: str

@app.post("/set_namespace")
async def set_namespace(setNamespace: Namespace):
    global namespace
    namespace = setNamespace.set_namespace
    logging.info(f"Namespace set to {namespace}")
    return {"message": "Namespace set successfully", "namespace": namespace}

@app.post("/upload/files")
async def upload_files(
    files: List[UploadFile],
    metadata: str = Form(...),
):
    total_docs = []
    save_dir = "datasets"
    os.makedirs(save_dir, exist_ok=True)

    for file in files:
        file_path = os.path.join(save_dir, file.filename)
        content = await file.read()
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        await file.close()

        if not isinstance(metadata, dict):
            metadata = json.loads(metadata)

        docs = load_documents(
            file_name=file.filename,
            file_path=file_path,
            chunk_size=1000,
            metadata_obj=metadata,
        )
        total_docs.extend(docs)

    try:
        upload_data(total_docs, namespace)
        return {"message": "Files uploaded successfully", "metadata": metadata}, 200
    except Exception as e:
        traceback.print_exc()
        logging.error(f"Error uploading files,\n {traceback.format_exc()}")
        raise e

@app.post("/get_disease")
async def get_disease():
    try:
        query = "List all the diseases and problems that the patient is suffering from"
        logging.info(f"Received query: {query}")
        query_values = model.encode(query).tolist()

        query_response = index.query(
            top_k=10,
            vector=query_values,
            include_values=True,
            include_metadata=True,
            namespace=namespace,
        )

        context = ""
        for match in query_response["matches"]:
            context += match["metadata"]["text"] + "\n"

        max_tokens = 3800
        context_tokens = context.split()
        if len(context_tokens) > max_tokens:
            context = ' '.join(context_tokens[:max_tokens])

        logging.info(f"Constructed context: {context}")
        # prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"
        prompt_template = """
        Context: {context}
        Question: {question}

        Based on the context provided, list all the diseases and problems that the patient is suffering from. 
        Do not include diseases or problems that are explicitly stated as negative or absent. 
        Return the diseases and problems as a comma-separated list in square brackets.
        
        Helpful answer:
        """
        prompt = prompt_template.format(context=context, question=query)

        client = AsyncOpenAI(api_key=openai_api_key)

        completion = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content":''' 
                You are a highly knowledgeable and specialized medical professional with expertise in interpreting and analyzing medical reports. 
                Your task is to provide precise, detailed, and helpful answers based on the provided medical context. Ensure your responses are 
                strictly confined to the medical information contained in the context and avoid any general or unrelated information.
                Focus on identifying diseases and problems that are positively indicated in the reports, and exclude any that are stated as negative or absent.
                '''},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000,
            temperature=0.7
        )

        answer = completion.choices[0].message.content
        logging.info(f"Generated answer: {answer}")

        response_data = {"answer": answer}
        return JSONResponse(response_data)
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        return JSONResponse(content={"error": str(e)})


@app.post("/get_response")
async def get_response(user_query: Query):
    try:
        query = user_query.query
        logging.info(f"Received query: {query}")
        query_values = model.encode(query).tolist()

        query_response = index.query(
            top_k=10,
            vector=query_values,
            include_values=True,
            include_metadata=True,
            namespace=namespace,
        )

        context = ""
        for match in query_response["matches"]:
            context += match["metadata"]["text"] + "\n"

        max_tokens = 3800
        context_tokens = context.split()
        if len(context_tokens) > max_tokens:
            context = ' '.join(context_tokens[:max_tokens])

        logging.info(f"Constructed context: {context}")
        # prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"
        prompt_template = """
        You are a highly knowledgeable and specialized medical professional with expertise in interpreting and analyzing medical reports. Your task is to provide precise, detailed, and helpful answers based on the provided medical context. Ensure your responses are strictly confined to the medical information contained in the context and avoid any general or unrelated information. Your answers should be long, detailed, and easy for amateurs to understand, explaining medical terms and concepts where necessary.

        Context: {context}

        Question: {question}

        Guidelines:
        1. Carefully consider the medical context provided and ensure your answer is directly derived from this context.
        2. If the context mentions multiple conditions but clarifies some as negative, exclude those from your considerations.
        3. Provide detailed medical advice or information relevant to the question, ensuring it aligns with the medical data in the context.
        4. Explain medical terms and concepts in a way that is easy for amateurs to understand.
        5. Provide long and detailed answers that are comprehensive and educational.
        6. Do not provide answers outside the medical domain or unrelated to the context.

        Answer:
        """
        prompt = prompt_template.format(context=context, question=query)

        client = AsyncOpenAI(api_key=openai_api_key)

        completion = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": '''
                 You are a highly knowledgeable and specialized medical professional with expertise in interpreting and analyzing medical reports. 
                Your task is to provide precise, detailed, and helpful answers based on the provided medical context. Ensure your responses are 
                strictly confined to the medical information contained in the context and avoid any general or unrelated information. Your answers 
                should be long, detailed, and easy for amateurs to understand, explaining medical terms and concepts where necessary.
                 '''},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000,
            temperature=0.7
        )

        answer = completion.choices[0].message.content
        logging.info(f"Generated answer: {answer}")

        response_data = {"answer": answer}
        return JSONResponse(response_data)
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        return JSONResponse(content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
