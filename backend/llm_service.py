import os
import asyncio
import json
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
from typing import List
from models import AnswerResponse, VerifyResponse

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            _client = Groq(api_key=api_key)
    return _client

async def ask_llm(query: str, level: str = "Intermediate") -> AnswerResponse:
    client = get_client()
    if not client:
        return AnswerResponse(answer="GROQ_API_KEY is not set. Please set it in backend/.env then restart.", concepts=[])

    def do_call():
        level_instructions = {
            "Beginner": "Use simple language, relatable analogies, and absolutely no math or technical jargon. Focus on high-level intuitive understanding as if explaining to a curious 12-year-old.",
            "Intermediate": "Use key principles, real-world examples, and foundational terminology. Balance theory with application. Assume the user has basic domain familiarity.",
            "Advanced": "Include deep theory, technical formulas, nuanced academic/technical explanations, and edge cases. Assume strong prior domain knowledge."
        }

        prompt = f"""You are CUROMINDS, a Recursive Understanding Engine designed to break down complex topics into structured learning paths.

Your task is to take a complex concept from the user and recursively decompose it into smaller, learnable concepts.

Rules:
1. Always structure explanations from foundational ideas → advanced ideas.
2. Adjust explanations based on the learning level:
   - Beginner: {level_instructions["Beginner"]}
   - Intermediate: {level_instructions["Intermediate"]}
   - Advanced: {level_instructions["Advanced"]}
3. Break the topic into 5–10 core sub-concepts.
4. Each sub-concept should be concise but meaningful.
5. If the concept is still complex, note it can be recursively broken further.
6. Focus on conceptual understanding, not just definitions.
7. Output clean structured JSON only.

User Input:
Topic: {query}
Learning Level: {level}

IMPORTANT: Apply the {level} level rules stated above to flavor BOTH the explanation AND subconcept descriptions.

Output Format (respond with ONLY this JSON, no other text):
{{
  "topic": "{query}",
  "explanation": "A clear, structured, {level.lower()}-level explanation of the topic in 3-5 sentences. Use the appropriate language and depth for {level} learners.",
  "subconcepts": [
    {{
      "name": "Subconcept 1",
      "description": "Short {level.lower()}-level explanation of this subconcept",
      "children": []
    }},
    {{
      "name": "Subconcept 2",
      "description": "Short {level.lower()}-level explanation of this subconcept",
      "children": []
    }}
  ]
}}
"""
        return client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )

    try:
        response = await asyncio.to_thread(do_call)
        data = json.loads(response.choices[0].message.content)

        # Normalize: handle both "subconcepts" and "concepts" output keys
        answer_text = data.get("explanation") or data.get("answer") or ""

        raw_concepts = data.get("subconcepts") or data.get("concepts") or []
        normalized_concepts = []
        for c in raw_concepts:
            if isinstance(c, dict):
                term = c.get("name") or c.get("term") or ""
                # Generate a url-safe context_id
                context_id = c.get("context_id") or term.lower().replace(" ", "-").replace("/", "-")
                if term:
                    normalized_concepts.append({"term": term, "context_id": context_id})

        return AnswerResponse(answer=answer_text, concepts=normalized_concepts)
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return AnswerResponse(answer=f"An error occurred with Groq: {str(e)}", concepts=[])


async def explain_term_llm(terms: List[str], context: str, level: str = "Intermediate") -> AnswerResponse:
    client = get_client()
    if not client:
        return AnswerResponse(answer="GROQ_API_KEY is not set.", concepts=[])

    def do_call():
        level_instructions = {
            "Beginner": "Use simple language, relatable analogies, and absolutely no math or technical jargon. Focus on high-level intuitive understanding.",
            "Intermediate": "Use key principles, real-world examples, and foundational terminology. Balance theory with application.",
            "Advanced": "Include deep theory, technical formulas, and nuanced academic/technical explanations. Assume strong prior domain knowledge."
        }
        terms_str = ", ".join([f"'{t}'" for t in terms])

        prompt = f"""You are CUROMINDS, a Recursive Understanding Engine designed to break down complex topics into structured learning paths.

The user is recursively exploring these sub-concepts: {terms_str}.
Original context: "{context}"

Learning Level: {level}
Level Instruction: {level_instructions.get(level, level_instructions["Intermediate"])}

Rules:
1. Always structure explanations from foundational ideas → advanced ideas.
2. Apply the {level} level rules above to flavor BOTH the explanation AND subconcept descriptions.
3. Break these terms into 5–10 smaller, learnable sub-concepts.
4. Explain how these terms relate to each other within the provided context.
5. Focus on conceptual understanding, not just definitions.
6. Output clean structured JSON only.

Output Format (respond with ONLY this JSON):
{{
  "topic": {json.dumps(terms_str)},
  "explanation": "A cohesive, clear, {level.lower()}-level explanation of {terms_str} and how they relate to the context.",
  "subconcepts": [
    {{
      "name": "Subconcept Name",
      "description": "Short {level.lower()}-level description",
      "children": []
    }}
  ]
}}
"""
        return client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )

    try:
        response = await asyncio.to_thread(do_call)
        data = json.loads(response.choices[0].message.content)

        answer_text = data.get("explanation") or data.get("answer") or ""
        raw_concepts = data.get("subconcepts") or data.get("concepts") or []
        normalized_concepts = []
        for c in raw_concepts:
            if isinstance(c, dict):
                term = c.get("name") or c.get("term") or ""
                context_id = c.get("context_id") or term.lower().replace(" ", "-").replace("/", "-")
                if term:
                    normalized_concepts.append({"term": term, "context_id": context_id})

        return AnswerResponse(answer=answer_text, concepts=normalized_concepts)
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return AnswerResponse(answer=f"An error occurred with Groq: {str(e)}", concepts=[])


async def verify_understanding_llm(term: str, explanation: str, context: str) -> VerifyResponse:
    client = get_client()
    if not client:
        return VerifyResponse(status="ERROR", feedback="GROQ_API_KEY is not set.", score=0)

    def do_call():
        prompt = f"""You are a "Mastery Evaluator" for CUROMINDS, a Recursive Understanding Engine.
The user is trying to prove they understand the concept: "{term}".
Core Context: "{context}"
User's Explanation: "{explanation}"

INSTRUCTIONS:
1. Evaluate the user's explanation for accuracy, depth, and clarity relative to the context.
2. Provide constructive feedback.
3. Assign a status:
   - "MASTERED": Excellent, accurate, and covers the core idea. (Score 85-100)
   - "LEARNING": Mostly correct but missing key nuances or slightly vague. (Score 50-84)
   - "NOVICE": Significant misconceptions or too brief to judge. (Score 0-49)
4. **JSON FORMAT**: You MUST return a JSON object with the following structure:
{{
  "status": "MASTERED" | "LEARNING" | "NOVICE",
  "feedback": "Your personal feedback to the user...",
  "score": 95
}}
"""
        return client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.2
        )

    try:
        response = await asyncio.to_thread(do_call)
        data = json.loads(response.choices[0].message.content)
        return VerifyResponse(**data)
    except Exception as e:
        print(f"Error calling Groq for verification: {e}")
        return VerifyResponse(status="ERROR", feedback=f"Verification failed: {str(e)}", score=0)
