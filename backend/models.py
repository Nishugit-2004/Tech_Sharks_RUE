from pydantic import BaseModel, Field
from typing import List, Optional

class ConceptExtraction(BaseModel):
    term: str = Field(description="The extracted key conceptual term")
    context_id: str = Field(description="A generated short unique slug/ID for the term without spaces")

class AnswerResponse(BaseModel):
    answer: str = Field(description="The generated clear structured explanation.")
    concepts: List[ConceptExtraction] = Field(default=[], description="List of extracted meaningful conceptual terms from the answer.")

class AskRequest(BaseModel):
    query: str
    level: str = "Intermediate"

class ExplainRequest(BaseModel):
    session_id: str
    terms: List[str]
    parent_node_id: str
    context: str
    level: str = "Intermediate"

class NodeData(BaseModel):
    id: str
    session_id: str
    term: str
    content: str
    parent_id: Optional[str] = None
    concepts: List[dict]
    mastered: bool = False

class VerifyRequest(BaseModel):
    term: str
    explanation: str
    context: str

class VerifyResponse(BaseModel):
    status: str  # "MASTERED" | "LEARNING" | "NOVICE"
    feedback: str
    score: int  # 0-100
