from google import genai

client = genai.Client(api_key="AIzaSyAkmyZBVsyGX2EsSgmnJQ8Krjrm7zPSXJI")
print("Checking available models for your key...")

for model in client.models.list():
    print(f"-> {model.name}")