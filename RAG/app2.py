'''
This application has used a locally downloaded Mistral Instruct model to answer questions based on the context provided. The application uses the HuggingFace BGE model to encode the documents and the Chroma vector store to retrieve the most relevant document based on the query. The application is built using Flask and provides an API endpoint to get the response for a given query. The response includes the answer, source document, and document ID. The application also includes a simple HTML form to input the query and display the response.
'''
# Import necessary modules

from flask import Flask, request, jsonify, render_template
import os
from langchain.prompts import PromptTemplate
from langchain.llms.ctransformers import CTransformers
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.chroma import Chroma
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.document_loaders import PyPDFLoader

# Initialize Flask app
app = Flask(__name__)

# Initialize LLM and other components as in the original code
local_llm = "mistral-7b-instruct-v0.1.Q4_0.gguf"
config = {
    'max_new_tokens': 2048,
    'repeat_penalty': 1.1,
    'temperature': 0.4,
    'top_k': 50,
    'top_p': 0.9,
    'stream': True,
    'threads': int(os.cpu_count() / 2)
}

# Initializing the LLM
llm = CTransformers(
    model=local_llm,
    model_type="mistral",
    lib="avx2",
    **config
)

print("LLM Initialized....")

prompt_template = """
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""
#declaring the model and its parameters
model_name = "BAAI/bge-large-en"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': False}
embeddings = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)
# Declaring the prompt format
prompt = PromptTemplate(template=prompt_template, input_variables=['context', 'question'])
#laoding the chromaDB based vector store
load_vector_store = Chroma(persist_directory="stores/doc_cosine", embedding_function=embeddings)
#initializing the retriever
retriever = load_vector_store.as_retriever(search_kwargs={"k": 1})

# Define the routes
@app.route('/')
def indexx():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    query = request.form.get('query')

    # The logic to handle the query
    chain_type_kwargs = {"prompt": prompt}
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs=chain_type_kwargs,
        verbose=True
    )

    if query is None:
        # Handle the case when query is None
        return jsonify({"answer": "Invalid query", "source_document": "", "doc": ""})

    response = qa(query)
    # Extract the source document and the answer from the response
    if response['source_documents']:
        source_document = response['source_documents'][0].page_content
        doc = response['source_documents'][0].metadata['source']
    # If no source document is found, set the source document to "No source document found."
    else:
        source_document = "No source document found."
        doc = "Unknown"
    # Selecting the answer and source_doc etc. from the response
    answer = response['result']
    response_data = {"answer": answer, "source_document": source_document, "doc": doc}
    # Returning the response in JSON format
    return jsonify(response_data)

#Running the application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
