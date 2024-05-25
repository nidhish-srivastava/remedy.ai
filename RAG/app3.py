'''
using pinecone as a vector database instead of using chromaDB
'''

# Import necessary modules
from pydantic import BaseModel
from flask import Flask, request, jsonify, render_template
import os
from pyngrok import ngrok
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.embeddings import SentenceTransformerEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import PyPDFLoader
import numpy as np
from langchain_community.vectorstores import Pinecone as PineconeVectorStore
from openai import AsyncOpenAI
import asyncio

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")

# Initialize Flask app
app = Flask(__name__)

# Initialize OpenAI
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=openai_api_key)

# Initialize Pinecone

# Declare the embeddings model and parameters
model = SentenceTransformer('BAAI/bge-large-en')

# Load Pinecone index
pc=Pinecone(api_key=pinecone_api_key)
index=pc.Index(pinecone_index_name)
def embed_text(texts):
    if isinstance(texts, str):
        texts = [texts]
    embeddings = model.encode(texts)
    if isinstance(embeddings, np.ndarray):
        return embeddings.tolist()  # Convert numpy array to list
    return embeddings

# Initialize Pinecone vector store and define text_field if using LangChain's Pinecone integration
text_field = "text"

vectorstore = PineconeVectorStore(index, embed_text, text_field)

print("Vector store successfully initialized with Pinecone and LangChain.")
# print(index.describe_index_stats())

class Query(BaseModel):
    query: str
# Define the routes

@app.route('/get_response/', methods=['POST'])
async def get_response(user_query: Query):
    try:
        user_query = Query(**request.json)

        query = user_query.query
        query_values = model.encode(query).tolist()

        query_response = index.query(
            top_k=10,
            vector=query_values,
            include_values=True,
            include_metadata=True,
            namespace= "default",
        )
        
        context = ""
        for match in query_response["matches"]:
            context += match["metadata"]["text"] + "\n"

        # Optionally, truncate the context if it's too long for GPT-3.5-turbo
        max_tokens = 4096  # GPT-3.5-turbo's maximum token limit
        context_tokens = context.split()  # Simple tokenization by spaces
        if len(context_tokens) > max_tokens:
            context = ' '.join(context_tokens[:max_tokens])
        # print(f"Context: {context}")
        # Define the prompt combining the query and the context
        prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"
        prompt_template = """
        If you don't know the answer, just say that you don't know, don't try to make up an answer.

        Context: {context}
        Question: {question}

        Only return the helpful answer below and nothing else.
        Helpful answer:
        """

        # Replace placeholders with actual context and question strings
        prompt = prompt_template.format(context=context, question=query)

        #Defining the async client for OpenAI
        client = AsyncOpenAI(api_key=OPEN_AI_KEY)

        # Call the GPT-3.5-turbo API
        completion = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ],
            max_tokens=150,  # You can adjust this value as needed
            temperature=0.7
        )

        # Extract the generated answer
        answer = completion.choices[0].message.content
        # if answer:
        #     print(f"Answer: {answer}")
        if answer is None:
            # Handle the case when query is None
            return jsonify({"answer": "Invalid query", "source_document": "", "doc": ""})

        response_data = {"answer": answer}
        # Returning the response in JSON format
        return jsonify(response_data)
    except Exception as e:
        # Handle any exceptions that might occur during processing
        return jsonify({"error": str(e)})
# Running the application
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
