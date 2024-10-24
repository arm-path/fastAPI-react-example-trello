from pydantic import BaseModel


class FileSchema(BaseModel):
    task_id: int