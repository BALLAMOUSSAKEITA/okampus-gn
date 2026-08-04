from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from app.phone import looks_like_email, normalize_phone
from app.password_policy import validate_password_strength
from app.url_validation import validate_optional_external_url


BAC_OPTIONS = (
    "Sciences Mathématiques",
    "Sciences Expérimentales",
    "Sciences Sociales",
)


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    password: str
    role: str  # "bachelier" | "etudiant"
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    bac_option: Optional[str] = None
    university: Optional[str] = None
    field: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Champ requis")
        return value

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Champ requis")
        validate_password_strength(value)
        return value

    @model_validator(mode="after")
    def validate_contact_and_role(self):
        if self.email:
            self.email = str(self.email).strip().lower()
        if self.phone:
            self.phone = normalize_phone(self.phone)
        if not self.email and not self.phone:
            raise ValueError("Email ou téléphone requis")

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
                raise ValueError("L'université est requise pour un étudiant")
            if not self.field or not self.field.strip():
                raise ValueError("La filière est requise pour un étudiant")
            self.university = self.university.strip()
            self.field = self.field.strip()
            self.city = None
            self.bac_option = None
        return self


class LoginRequest(BaseModel):
    password: str
    identifier: Optional[str] = None
    email: Optional[str] = None  # compat anciennes clients
    phone: Optional[str] = None

    @model_validator(mode="after")
    def resolve_identifier(self):
        raw = (self.identifier or self.email or self.phone or "").strip()
        if not raw:
            raise ValueError("Email ou téléphone requis")
        if looks_like_email(raw):
            self.identifier = raw.lower()
        else:
            self.identifier = normalize_phone(raw)
        return self


class TokenResponse(BaseModel):
    accèss_token: str
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
    expériences: Any = []
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
    email: Optional[str] = None
    phone: Optional[str] = None
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

    @model_validator(mode="before")
    @classmethod
    def accept_camel_case(cls, data: Any):
        """Accepte aussi isAdvisor / advisorProfile / cvProfile depuis le frontend."""
        if not isinstance(data, dict):
            return data
        normalized = dict(data)
        if "isAdvisor" in normalized and "is_advisor" not in normalized:
            normalized["is_advisor"] = normalized.pop("isAdvisor")
        if "advisorProfile" in normalized and "advisor_profile" not in normalized:
            normalized["advisor_profile"] = normalized.pop("advisorProfile")
        if "cvProfile" in normalized and "cv_profile" not in normalized:
            normalized["cv_profile"] = normalized.pop("cvProfile")
        return normalized


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

    @field_validator("website")
    @classmethod
    def validate_website(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_external_url(value)


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
    filière: Optional[str] = None
    année_en_cours: Optional[str] = None
    objectifs: Any = None
    notes: Any = None


class ParcoursOut(BaseModel):
    id: str
    user_id: str
    university: Optional[str] = None
    filière: Optional[str] = None
    année_en_cours: Optional[str] = None
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
    filière: Optional[str] = None
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
    filière: Optional[str] = None
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

class ScholarshipCreate(BaseModel):
    title: str
    type: str
    organization: str
    description: str
    content: Optional[str] = None
    eligibility: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[datetime] = None
    apply_link: Optional[str] = None
    contact_info: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None

    @field_validator("apply_link")
    @classmethod
    def validate_apply_link(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_external_url(value)


class ScholarshipOut(BaseModel):
    id: str
    title: str
    type: str
    organization: str
    description: str
    content: Optional[str] = None
    eligibility: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[datetime] = None
    apply_link: Optional[str] = None
    contact_info: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    views: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# ── Actualités ────────────────────────────────────────────────────────────────

NEWS_CATEGORIES = ("Actualité", "Événement", "Bourse", "Plateforme")


class NewsCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(min_length=10, max_length=500)
    content: Optional[str] = Field(default=None, max_length=10000)
    link: Optional[str] = Field(default=None, max_length=500)
    category: str = "Actualité"
    published_at: Optional[datetime] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in NEWS_CATEGORIES:
            raise ValueError("Catégorie invalide")
        return v

    @field_validator("link")
    @classmethod
    def validate_link(cls, value: Optional[str]) -> Optional[str]:
        if not value or not value.strip():
            return None
        value = value.strip()
        if value.startswith("/"):
            return value
        return validate_optional_external_url(value)


class NewsOut(BaseModel):
    id: str
    title: str
    summary: str
    content: Optional[str] = None
    link: Optional[str] = None
    category: str
    is_active: bool = True
    views: int = 0
    published_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class NewsUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=200)
    summary: Optional[str] = Field(default=None, min_length=10, max_length=500)
    content: Optional[str] = Field(default=None, max_length=10000)
    link: Optional[str] = Field(default=None, max_length=500)
    category: Optional[str] = None
    is_active: Optional[bool] = None
    published_at: Optional[datetime] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in NEWS_CATEGORIES:
            raise ValueError("Catégorie invalide")
        return v

    @field_validator("link")
    @classmethod
    def validate_link(cls, value: Optional[str]) -> Optional[str]:
        if value is None or not value.strip():
            return value
        value = value.strip()
        if value.startswith("/"):
            return value
        return validate_optional_external_url(value)


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

    @field_validator("external_link")
    @classmethod
    def validate_external_link(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_external_url(value)


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
    news: int = 0


class AdminUserOut(BaseModel):
    id: str
    email: Optional[str] = None
    phone: Optional[str] = None
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
    email: Optional[str] = None
    phone: Optional[str] = None
    field: str
    university: str
    year: str
    description: str
    meet_link: Optional[str] = None


class AdminAssistantUsageSummaryOut(BaseModel):
    chat_daily_limit: int
    orientation_monthly_limit: int
    chat_total_today: int
    orientation_total_month: int
    active_chat_users_today: int
    active_orientation_users_month: int
    users_at_chat_limit: int
    users_at_orientation_limit: int
    chat_period_key: str
    orientation_period_key: str


class AdminAssistantUsageUserOut(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    chat_used: int
    chat_limit: Optional[int] = None
    chat_remaining: Optional[int] = None
    orientation_used: int
    orientation_limit: Optional[int] = None
    orientation_remaining: Optional[int] = None
    chat_at_limit: bool = False
    orientation_at_limit: bool = False
    last_used_at: Optional[datetime] = None


class AdminAssistantUsageOut(BaseModel):
    summary: AdminAssistantUsageSummaryOut
    users: list[AdminAssistantUsageUserOut]


class AssistantLogMessageIn(BaseModel):
    role: str
    content: str = Field(min_length=1, max_length=4000)

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("user", "assistant"):
            raise ValueError("Rôle invalide")
        return v


class AssistantLogIn(BaseModel):
    mode: str
    messages: list[AssistantLogMessageIn] = Field(min_length=1, max_length=10)

    @field_validator("mode")
    @classmethod
    def validate_mode(cls, v: str) -> str:
        if v not in ("chat", "orientation"):
            raise ValueError("Mode assistant invalide")
        return v


class AdminAssistantConversationOut(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    message_count: int
    chat_count: int
    orientation_count: int
    last_message_at: Optional[datetime] = None
    last_preview: Optional[str] = None


class AdminAssistantMessageOut(BaseModel):
    id: str
    mode: str
    role: str
    content: str
    created_at: datetime


class AdminAssistantConversationDetailOut(BaseModel):
    user_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    messages: list[AdminAssistantMessageOut]


class MentorOut(BaseModel):
    id: str
    name: str
    field: str
    university: str
    year: str
    description: str
    meet_link: Optional[str] = None
    available_slots: list[str] = []


class PublicStatsOut(BaseModel):
    students: int
    mentors: int
    stage_offers: int
    success_stories: int
    forum_posts: int


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

    @field_validator("external_link")
    @classmethod
    def validate_external_link(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_external_url(value)


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
    content: Optional[str] = None
    eligibility: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[datetime] = None
    apply_link: Optional[str] = None
    contact_info: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("apply_link")
    @classmethod
    def validate_apply_link(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_external_url(value)


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subject: Optional[str] = None
    filière: Optional[str] = None
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

    @field_validator("website")
    @classmethod
    def validate_website(cls, value: Optional[str]) -> Optional[str]:
        return validate_optional_external_url(value)


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
    likes: int = 0
    author_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ForumPostPublicOut(ForumPostOut):
    liked_by_me: bool = False


class ForumPostCreatePublic(BaseModel):
    title: str
    content: str = ""
    category: str = "Autre"

    @field_validator("title")
    @classmethod
    def title_valid(cls, value: str) -> str:
        value = value.strip()
        if not value or len(value) > 200:
            raise ValueError("Titre invalide (1-200 caractères)")
        return value

    @field_validator("content")
    @classmethod
    def content_valid(cls, value: str) -> str:
        value = (value or "").strip()
        if len(value) > 10000:
            raise ValueError("Contenu trop long (10000 caractères max)")
        return value


class ForumCommentOut(BaseModel):
    id: str
    post_id: str
    user_id: str
    author_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ForumCommentCreate(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def content_valid(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Commentaire requis")
        if len(value) > 2000:
            raise ValueError("Commentaire trop long (2000 caractères max)")
        return value


class ForumLikeOut(BaseModel):
    liked: bool
    likes: int


class MentorMessageCreate(BaseModel):
    advisor_id: str
    content: str
    student_id: Optional[str] = None

    @field_validator("content")
    @classmethod
    def content_not_empty(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Message requis")
        if len(value) > 2000:
            raise ValueError("Message trop long (2000 caractères max)")
        return value


class MentorMessageOut(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    advisor_id: str
    student_id: Optional[str] = None
    content: str
    read: bool
    created_at: datetime


class MentorConversationOut(BaseModel):
    advisor_id: str
    student_id: str
    other_user_id: str
    other_user_name: str
    last_message: str
    last_message_at: datetime
    unread_count: int


class PushSubscriptionCreate(BaseModel):
    endpoint: str
    keys: dict[str, str]

    @model_validator(mode="after")
    def validate_keys(self):
        if not self.keys.get("p256dh") or not self.keys.get("auth"):
            raise ValueError("Clés push invalides")
        return self


# ── Assistant IA ──────────────────────────────────────────────────────────────

class AssistantModeRequest(BaseModel):
    mode: str  # "chat" | "orientation"

    @field_validator("mode")
    @classmethod
    def validate_mode(cls, value: str) -> str:
        if value not in ("chat", "orientation"):
            raise ValueError("Mode assistant invalide")
        return value


class AssistantQuotaOut(BaseModel):
    mode: str
    limit: Optional[int] = None
    used: int = 0
    remaining: Optional[int] = None
    unlimited: bool = False
    period_label: str


class AssistantConsumeOut(BaseModel):
    allowed: bool
    mode: str
    limit: Optional[int] = None
    used: int = 0
    remaining: Optional[int] = None
    unlimited: bool = False
    period_label: str


TokenResponse.model_rebuild()
