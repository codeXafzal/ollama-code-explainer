import ollama

print("Sending request to Ollama...")

response = ollama.chat(
    model="gemma3",
    messages=[
        {"role": "user", "content": "Explain: for i in range(3): print(i)"}
    ]
)

print("Received response")
print(response["message"]["content"])
