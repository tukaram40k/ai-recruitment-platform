from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum


class RoleEnum(str, Enum):
    ADMIN = "ROLE_ADMIN"
    CANDIDATE = "ROLE_CANDIDATE"
    RECRUITER = "ROLE_RECRUITER"


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.CANDIDATE


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    info: Optional[str] = None
    cv: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    info: Optional[str] = None
    cv: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    info: Optional[str] = None
    cv: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
