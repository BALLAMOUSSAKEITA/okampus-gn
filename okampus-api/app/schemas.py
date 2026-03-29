from datetime import datetime
from typing import Annotated, Any, Literal, Optional

import bleach
from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Sanitisation HTML ────────────────────────────────────────────────────────

def strip_html(value: str) -> str:
    """Supprime tous les tags HTML pour éviter les injections XSS."""
    return bleach.clean(value, tags=[], strip=True).strip()


# Type réutilisable pour champs texte sanitisés
SafeStr = Annotated[str, Field()]


def _sanitize_str_fields(cls, v: Any, field_name: str) -> Any:  # noqa: N805
    if isinstance(v, str):
        return strip_html(v)
    return v


class SanitizedModel(BaseModel):
    """Base model qui sanitise automatiquement tous les champs str."""

    @field_validator("*", mode="before")
    @classmethod
    def sanitize_strings(cls, v: Any) -> Any:
        if isinstance(v, str):
            return strip_html(v)
        return v


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["bachelier", "etudiant"]

    @field_validator("name", mode="before")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        return strip_html(v)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# ── User ──────────────────────────────────────────────────────────────────────

class CvProfileOut(BaseModel):
    id: str
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    about: Optional[str] = None
    skills: list[str] = []
    languages: list[str] = []
    education: Any = []
    experiences: Any = []
    projects: Any = []

    class Config:
        from_attributes = True


class AdvisorProfileOut(BaseModel):
    id: str
    field: str
    university: str
    year: str
    description: str
    meet_link: Optional[str] = None
    available_slots: list[str] = []

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    is_advisor: bool = False
    advisor_profile: Optional[AdvisorProfileOut] = None
    cv_profile: Optional[CvProfileOut] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UpdateUserRequest(BaseModel):
    is_advisor: Optional[bool] = None
    advisor_profile: Optional[dict] = None
    cv_profile: Optional[dict] = None


# ── Calendar ──────────────────────────────────────────────────────────────────

class CalendarEventCreate(SanitizedModel):
    title: str = Field(min_length=2, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    type: str = Field(max_length=50)
    start_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = Field(default=None, max_length=200)
    university: Optional[str] = Field(default=None, max_length=200)
    is_recurrent: bool = False
    color: Optional[str] = Field(default=None, max_length=20)


class CalendarEventOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    type: str
    start_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    university: Optional[str] = None
    is_recurrent: bool
    color: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── CV ────────────────────────────────────────────────────────────────────────

class GenerateCvRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=200)
    role_label: Optional[str] = Field(default=None, max_length=100)
    cv_profile: dict


# ── Entrepreneur ──────────────────────────────────────────────────────────────

class EntrepreneurProjectCreate(SanitizedModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10, max_length=10000)
    category: str = Field(max_length=50)
    status: str = Field(max_length=50)
    team_size: int = Field(default=1, ge=1, le=100)
    seeking: Optional[str] = Field(default=None, max_length=500)
    website: Optional[str] = Field(default=None, max_length=500)
    contact_info: Optional[str] = Field(default=None, max_length=500)


class EntrepreneurProjectOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    status: str
    team_size: int
    seeking: Optional[str] = None
    website: Optional[str] = None
    contact_info: Optional[str] = None
    likes: int
    views: int
    author_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Parcours ──────────────────────────────────────────────────────────────────

class ParcoursUpsert(SanitizedModel):
    university: Optional[str] = Field(default=None, max_length=200)
    filiere: Optional[str] = Field(default=None, max_length=200)
    annee_en_cours: Optional[str] = Field(default=None, max_length=20)
    objectifs: Any = None
    notes: Any = None


class ParcoursOut(BaseModel):
    id: str
    user_id: str
    university: Optional[str] = None
    filiere: Optional[str] = None
    annee_en_cours: Optional[str] = None
    objectifs: Any = None
    notes: Any = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Resources ─────────────────────────────────────────────────────────────────

class ResourceCreate(SanitizedModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10, max_length=10000)
    category: str = Field(max_length=50)
    subject: str = Field(max_length=100)
    filiere: Optional[str] = Field(default=None, max_length=200)
    university: Optional[str] = Field(default=None, max_length=200)
    year: Optional[str] = Field(default=None, max_length=20)
    file_url: str = Field(max_length=1000)
    file_type: str = Field(max_length=50)
    file_size: int = Field(ge=0, le=104857600)  # max 100 MB
    price: float = Field(default=0, ge=0)
    is_premium: bool = False


class ResourceOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    subject: str
    filiere: Optional[str] = None
    university: Optional[str] = None
    year: Optional[str] = None
    file_url: str
    file_type: str
    file_size: int
    price: float
    is_premium: bool
    downloads: int
    rating: float
    author_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseRequest(BaseModel):
    pass


# ── Scholarships ──────────────────────────────────────────────────────────────

class ScholarshipCreate(SanitizedModel):
    title: str = Field(min_length=2, max_length=200)
    type: str = Field(max_length=50)
    organization: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10, max_length=10000)
    eligibility: Optional[str] = Field(default=None, max_length=5000)
    amount: Optional[str] = Field(default=None, max_length=100)
    deadline: Optional[datetime] = None
    apply_link: Optional[str] = Field(default=None, max_length=1000)
    contact_info: Optional[str] = Field(default=None, max_length=500)
    domain: Optional[str] = Field(default=None, max_length=100)
    location: Optional[str] = Field(default=None, max_length=200)


class ScholarshipOut(BaseModel):
    id: str
    title: str
    type: str
    organization: str
    description: str
    eligibility: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[datetime] = None
    apply_link: Optional[str] = None
    contact_info: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Stages ────────────────────────────────────────────────────────────────────

class StageOfferCreate(SanitizedModel):
    title: str = Field(min_length=2, max_length=200)
    company: str = Field(min_length=2, max_length=200)
    location: str = Field(max_length=200)
    type: str = Field(max_length=50)
    domain: str = Field(max_length=100)
    description: str = Field(min_length=10, max_length=10000)
    requirements: Optional[str] = Field(default=None, max_length=5000)
    duration: Optional[str] = Field(default=None, max_length=100)
    remuneration: Optional[str] = Field(default=None, max_length=100)
    contact_email: Optional[str] = Field(default=None, max_length=200)
    contact_phone: Optional[str] = Field(default=None, max_length=30)
    external_link: Optional[str] = Field(default=None, max_length=1000)


class StageOfferOut(BaseModel):
    id: str
    title: str
    company: str
    location: str
    type: str
    domain: str
    description: str
    requirements: Optional[str] = None
    duration: Optional[str] = None
    remuneration: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    external_link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ApplyRequest(SanitizedModel):
    message: Optional[str] = Field(default=None, max_length=5000)


class ApplicationOut(BaseModel):
    id: str
    user_id: str
    offer_id: str
    status: str
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Success Stories ───────────────────────────────────────────────────────────

class SuccessStoryCreate(SanitizedModel):
    title: str = Field(min_length=2, max_length=200)
    content: str = Field(min_length=10, max_length=10000)
    category: str = Field(max_length=50)
    author_name: str = Field(min_length=2, max_length=100)
    author_role: Optional[str] = Field(default=None, max_length=100)
    university: Optional[str] = Field(default=None, max_length=200)
    graduation_year: Optional[str] = Field(default=None, max_length=10)
    image_url: Optional[str] = Field(default=None, max_length=1000)


class SuccessStoryOut(BaseModel):
    id: str
    title: str
    content: str
    category: str
    author_id: str
    author_name: str
    author_role: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    image_url: Optional[str] = None
    likes: int
    views: int
    is_featured: bool
    created_at: datetime

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()
