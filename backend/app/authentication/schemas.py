from fastapi_users import schemas
from fastapi_users.schemas import model_dump
from pydantic import BaseModel, EmailStr


class UserRead(schemas.BaseUser[int]):
    pass


class UserCreate(BaseModel):
    email: EmailStr
    password: str

    def create_update_dict(self):
        return model_dump(
            self,
            exclude_unset=True,
            exclude={
                "id",
                "is_superuser",
                "is_active",
                "is_verified",
                "oauth_accounts",
            },
        )

    def create_update_dict_superuser(self):
        return model_dump(self, exclude_unset=True, exclude={"id"})


class UserUpdate(schemas.BaseUserUpdate):
    pass
