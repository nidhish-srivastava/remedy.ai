import os
import json

from langchain_community.llms import Ollama
from flask import Flask, Response, request

app = Flask(__name__)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")

llm = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_BASE_URL)

def generate_tokens(question):
    for chunks in llm.stream(question):
        yield chunks

@app.route("/users/chat", methods=["POST"])
def ask_ai():
    def generate_json(question):
        # Initialize an empty list to hold the content of each chunk
        content_chunks = []

        for token in generate_tokens(question):
            json_data = {
                "content": token.strip(),
                "done": False
            }
            # Append the content of each chunk to the list
            content_chunks.append(json_data["content"])

            # Yield the concatenated content as a chunk
            yield " ".join(content_chunks)

        # Send one final JSON object to indicate the end of the response stream
        json_data = {
            "content": "End of response",
            "done": True
        }
        yield json.dumps(json_data)



    request_data = request.json
    question = request_data.get("question")
    return Response(generate_json(question), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
