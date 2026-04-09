from google import genai
from pydantic import BaseModel

class Evaluation(BaseModel):
    score:int
    feedback: str
    improved_prompt: str

client = genai.Client(api_key="AIzaSyAkmyZBVsyGX2EsSgmnJQ8Krjrm7zPSXJI")

user_prompt_to_test = "Act as an Senior Java developer  and Explain the Multithreading to an Junior dev with code Example."

response = client.models.generate_content(
    model="gemini-2.5-flash-lite",
    config={
        "system_instruction":"You are an Prompt Quality Judge.Evaluate Users Prompt from clarity and details.",
        "response_mime_type":"application/json",
        "response_schema":Evaluation,
    },
    contents=f"Evaluate This Prompt'{user_prompt_to_test}'"
)

result = response.parsed

print("\n ---------- Evaluation Result--------------")

print(f"Score : {result.score}/10")

print(f"Feedback: {result.feedback} ")

print(f"Improved Prompt:  {result.improved_prompt}")