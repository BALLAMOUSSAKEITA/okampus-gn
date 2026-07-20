from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, field_validator, model_validator


BAC_OPTIONS = (
    "Sciences Mathématiques",
    "Sciences Expérimentales",
    "Sciences Sociales",
)


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "bachelier" | "etudiant"
    city: Optional[str] = None
    bac_option: Optional[str] = None
    university: Optional[str] = None
    field: Optional[str] = None

    @field_validator("name", "password")
    @classmethod
    def not_empty(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Champ requis")
        return value

    @model_validator(mode="after")
    def validate_role_fields(self):
        if self.role == "bachelier":
            if not self.city or not self.city.strip():
                raise ValueError("La ville est requise pour un nouveau bachelier")
            if self.bac_option not in BAC_OPTIONS:
                raise ValueError("Option du bac invalide")
            self.city = self.city.strip()
            self.university = None
            self.field = None
        elif self.role == "etudiant":
            if not self.university or not self.university.strip():
                raise ValueError("L'universite est requise pour un etudiant")
            if not self.field or not self.field.strip():
                raise ValueError("La filiere est requise pour un etudiant")
            self.university = self.university.strip()
            self.field = self.field.strip()
            self.city = None
            self.bac_option = None
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


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
    city: Optional[str] = None
    bac_option: Optional[str] = None
    university: Optional[str] = None
    field: Optional[str] = None
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

class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    start_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    university: Optional[str] = None
    is_recurrent: bool = False
    color: Optional[str] = None


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
    name: str
    email: str
    role_label: Optional[str] = None
    cv_profile: dict


# ── Entrepreneur ──────────────────────────────────────────────────────────────

class EntrepreneurProjectCreate(BaseModel):
    title: str
    description: str
    category: str
    status: str
    team_size: int = 1
    seeking: Optional[str] = None
    website: Optional[str] = None
    contact_info: Optional[str] = None
    author_id: str


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

class ParcoursUpsert(BaseModel):
    university: Optional[str] = None
    filiere: Optional[str] = None
    annee_en_cours: Optional[str] = None
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

class ResourceCreate(BaseModel):
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
    price: float = 0
    is_premium: bool = False
    author_id: str


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
    user_id: str


# ── Scholarships ──────────────────────────────────────────────────────────────

class ScholarshipCreate(BaseModel):
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

class StageOfferCreate(BaseModel):
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


class ApplyRequest(BaseModel):
    user_id: str
    message: Optional[str] = None


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

class SuccessStoryCreate(BaseModel):
    title: str
    content: str
    category: str
    author_id: str
    author_name: str
    author_role: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    image_url: Optional[str] = None


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
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


# ── Admin ─────────────────────────────────────────────────────────────────────

class AdminStatsOut(BaseModel):
    users: int
    mentors: int
    stages: int
    stories: int
    scholarships: int
    resources: int
    calendar_events: int
    entrepreneur_projects: int
    forum_posts: int


class AdminUserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    city: Optional[str] = None
    bac_option: Optional[str] = None
    university: Optional[str] = None
    field: Optional[str] = None
    is_advisor: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    name: Optional[str] = None


class AdminMentorOut(BaseModel):
    user_id: str
    name: str
    email: str
    field: str
    university: str
    year: str
    description: str
    meet_link: Optional[str] = None


class StageOfferUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    domain: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    duration: Optional[str] = None
    remuneration: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    external_link: Optional[str] = None
    is_active: Optional[bool] = None


class SuccessStoryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class ScholarshipUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    organization: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[datetime] = None
    apply_link: Optional[str] = None
    contact_info: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subject: Optional[str] = None
    filiere: Optional[str] = None
    university: Optional[str] = None
    year: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    price: Optional[float] = None
    is_premium: Optional[bool] = None
    is_active: Optional[bool] = None


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    university: Optional[str] = None
    is_recurrent: Optional[bool] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None


class EntrepreneurProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    team_size: Optional[int] = None
    seeking: Optional[str] = None
    website: Optional[str] = None
    contact_info: Optional[str] = None
    is_active: Optional[bool] = None


class ForumPostCreate(BaseModel):
    title: str
    content: str
    author: str
    category: str


class ForumPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None


class ForumPostOut(BaseModel):
    id: str
    title: str
    content: str
    author: str
    category: str
    replies: int
    views: int
    created_at: datetime

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()
