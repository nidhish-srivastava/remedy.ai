import os
import traceback
from typing import Any, Dict, List, Optional
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_core.documents import Document
# import google
import google.generativeai as genai
import pathlib
import textwrap
from IPython.display import Markdown
import PIL.Image
import dotenv
import logging
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class Document:
    def __init__(self, page_content, metadata=None):
        self.page_content = page_content
        self.metadata = metadata or {}

def to_markdown(text):
    text = text.replace('•', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# Configure the Generative AI client
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-pro-vision')


def load_img(
    file_path: str,
    chunk_size: int, 
    chunk_overlap: int, 
    metadata_obj: Dict = None,
) -> List[Document]:    
    '''
    Load an image file and split its content into chunks of text.

    '''

    print("Loading Image")
    img_path = pathlib.Path(file_path)
    img = PIL.Image.open(img_path)
    prompt_template = '''
    Read all the text that you can from the given image. If the image contains handwritten text, carefully read and transcribe all the text, ensuring accuracy despite the challenging handwriting. If the image includes printed text, read and transcribe the text as accurately as possible. If the image contains a combination of handwritten and printed text, read and transcribe all the text, ensuring accuracy in both cases. Please proceed with the transcription.
    '''
    # Generate content from the image
    response = model.generate_content([prompt_template, img], stream=True)
    response.resolve()
    text = response.text
    logging.info(f"Text from image: {text}")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = text_splitter.split_text(text)

    docs = [Document(chunk) for chunk in chunks]
    if metadata_obj:
        for doc in docs:
            doc.metadata["source"] = file_path.split("/")[-1]
            doc.metadata.update(metadata_obj)

    return docs



def load_pdf(
    file_name: str,
    chunk_size: int,
    chunk_overlap: int = 100,
    metadata_obj: Optional[Dict] = None,
) -> List[Document]:
    """
    Load a PDF file and split its content into chunks of text.

    Args:
        file_name (str): The name of the PDF file to load.
        chunk_size (int): The size of each text chunk.
        chunk_overlap (int): The overlap between consecutive text chunks.

    Returns:
        List: A list of text chunks obtained from the PDF file.
    """
    print("Loading PDF")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    try:
        loader = PyMuPDFLoader(file_name)
        data = loader.load()
        docs = text_splitter.split_documents(data)
    except Exception as e2:
        raise AttributeError  # Handle the case where all loaders fail
    if metadata_obj:
        if not isinstance(metadata_obj, dict):
            raise ValueError("metadata_obj must be a dictionary")
        for doc in docs:
            doc.metadata["source"] = file_name.split("/")[-1]
            doc.metadata.update(metadata_obj)

    return docs

def load_documents(
    file_name: str,
    file_path: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 100,
    metadata_obj: Optional[Dict] = None,
) -> List[Document]:
    """
    Load documents based on the specified document type.

    Args:
        metadata_obj:
        file_path:
        file_name (str): The file_name to load the documents from.
        chunk_size (int, optional): The size of each text chunk. Defaults to 1000.
        chunk_overlap (int, optional): The number of characters to overlap between consecutive chunks. Defaults to 0.

    Returns:
        List[Document]: A list of loaded documents.

    Raises:
        ValueError: If an unsupported document type is provided.
    """

    try:
        docs = []
        if file_name.lower().endswith(".pdf"):
            docs = load_pdf(
                file_path, chunk_size, chunk_overlap, metadata_obj=metadata_obj
            )
        elif file_name.lower().endswith((".jpg", ".jpeg", ".png")):
            docs = load_img(
                file_path, 100, 10, metadata_obj=metadata_obj
            )
        else:
            print("Unknown file format. not loading: ", file_name.lower())

        try:
            os.remove(file_path)
        except FileNotFoundError:
            pass
        return docs
    except Exception as e:
        raise e
    


