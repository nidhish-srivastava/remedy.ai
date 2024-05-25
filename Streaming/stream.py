from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
from fastapi import FastAPI, Request
import asyncio
app=FastAPI()
async def generate_response(prompt):
    client = AsyncOpenAI(api_key='')

    # Call the GPT-3.5-turbo API
    completion = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,  # You can adjust this value as needed
        temperature=0.7
    )
    return completion.choices[0].text

@app.post("/generate")
async def generate_response(prompt):
    client = AsyncOpenAI(api_key='')
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,  # You can adjust this value as needed
        temperature=0.7
    )

    async for chunk in response:
        content = chunk["choices"][0]["text"]
        yield content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.1.1", port=8000)
