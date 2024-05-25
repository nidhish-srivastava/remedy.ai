from langchain_community.llms import Ollama
from langchain.callbacks.base import BaseCallbackHandler

class StreamingCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.partial_output = ""

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.partial_output += token
        print(token, end="", flush=True)

llm = Ollama(model="mistral", callbacks=[StreamingCallbackHandler()])

response = llm.invoke("prompt here")

print(response)