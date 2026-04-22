from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    video_path: str

class ResultResponse(BaseModel):
    similarity: float
    status: str