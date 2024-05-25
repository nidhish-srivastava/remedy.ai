from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.llms import Ollama
from langchain.callbacks.base import BaseCallbackHandler

class StreamingCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.partial_output = ""

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.partial_output += token
        print(token, end="", flush=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/invoke_llm', methods=['POST'])
def invoke_llm():
    data = request.get_json()
    prompt = data['prompt']
    
    llm = Ollama(model="mistral", callbacks=[StreamingCallbackHandler()])
    response = llm.invoke(prompt)
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
