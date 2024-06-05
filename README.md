# Remedy.ai

A comprehensive AI-powered platform designed to provide instant health-related answers, lifestyle tips, and medical resources. With a range of features tailored to assist with medical inquiries and health management, it is your go-to solution for personalized health support.

## Tech Stack

### Web
- **Frontend** - **JavaScript** , **React** , **Tailwind CSS**
- **Backend** - **Express.js** , **MongoDB**

### AI ML
 
- **Retrieval Augmented Generation (RAG)**: Implemented in a FastAPI backend to combine information retrieval from a large document corpus with generative response capabilities, enhancing accuracy and relevance.
- **Vector Embeddings**: Created using BGE models on Hugging Face and stored in Pinecone.
- **Langchain**: Used for processing and handling medical report PDFs and breaking them down into chunks.
- **Gemini 1.5 vision**: Used to perform Optical Character Recognition (OCR) when medical report images are uploaded.
- **OpenAI**: Employed to refine and organize the responses retrieved from Pinecone.
- **Groq**: Used to generate responses for the medical chatbot, exercise routines, and diet plans using the Mistral 8x22 model.
