import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, Integer, String,
    UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def gen_id() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    email: Mapped[str] = mapped_column("email", String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column("password", String, nullable=False)
    name: Mapped[str] = mapped_column("name", String, nullable=False)
    role: Mapped[str] = mapped_column("role", String, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    cv_profile: Mapped[Optional["CvProfile"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    advisor_profile: Mapped[Optional["AdvisorProfile"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    appointments: Mapped[list["Appointment"]] = relationship(foreign_keys="[Appointment.user_id]", back_populates="user", cascade="all, delete-orphan")
    parcours: Mapped[Optional["Parcours"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    stage_applications: Mapped[list["StageApplication"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    resources_shared: Mapped[list["Resource"]] = relationship(back_populates="author", cascade="all, delete-orphan")
    resource_purchases: Mapped[list["ResourcePurchase"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    entrepreneur_projects: Mapped[list["EntrepreneurProject"]] = relationship(back_populates="author", cascade="all, delete-orphan")
    success_stories: Mapped[list["SuccessStory"]] = relationship(back_populates="author", cascade="all, delete-orphan")


class CvProfile(Base):
    __tablename__ = "cv_profiles"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    user_id: Mapped[str] = mapped_column("userId", String, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    phone: Mapped[Optional[str]] = mapped_column("phone", String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column("location", String, nullable=True)
    headline: Mapped[Optional[str]] = mapped_column("headline", String, nullable=True)
    about: Mapped[Optional[str]] = mapped_column("about", String, nullable=True)
    skills: Mapped[Optional[list]] = mapped_column("skills", ARRAY(String), nullable=True)
    languages: Mapped[Optional[list]] = mapped_column("languages", ARRAY(String), nullable=True)
    education: Mapped[Optional[dict]] = mapped_column("education", JSON, nullable=True)
    experiences: Mapped[Optional[dict]] = mapped_column("experiences", JSON, nullable=True)
    projects: Mapped[Optional[dict]] = mapped_column("projects", JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="cv_profile")


class AdvisorProfile(Base):
    __tablename__ = "advisor_profiles"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    user_id: Mapped[str] = mapped_column("userId", String, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    field: Mapped[str] = mapped_column("field", String, nullable=False)
    university: Mapped[str] = mapped_column("university", String, nullable=False)
    year: Mapped[str] = mapped_column("year", String, nullable=False)
    description: Mapped[str] = mapped_column("description", String, nullable=False)
    meet_link: Mapped[Optional[str]] = mapped_column("meetLink", String, nullable=True)
    available_slots: Mapped[Optional[list]] = mapped_column("availableSlots", ARRAY(String), nullable=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="advisor_profile")
    appointments: Mapped[list["Appointment"]] = relationship(foreign_keys="[Appointment.advisor_id]", back_populates="advisor")


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    user_id: Mapped[str] = mapped_column("userId", String, ForeignKey("users.id", ondelete="CASCADE"))
    advisor_id: Mapped[str] = mapped_column("advisorId", String, ForeignKey("advisor_profiles.userId", ondelete="CASCADE"))
    date: Mapped[str] = mapped_column("date", String, nullable=False)
    time: Mapped[str] = mapped_column("time", String, nullable=False)
    meet_link: Mapped[str] = mapped_column("meetLink", String, nullable=False)
    status: Mapped[str] = mapped_column("status", String, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(foreign_keys=[user_id], back_populates="appointments")
    advisor: Mapped["AdvisorProfile"] = relationship(foreign_keys=[advisor_id], back_populates="appointments")


class ForumPost(Base):
    __tablename__ = "forum_posts"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    content: Mapped[str] = mapped_column("content", String, nullable=False)
    author: Mapped[str] = mapped_column("author", String, nullable=False)
    category: Mapped[str] = mapped_column("category", String, nullable=False)
    replies: Mapped[int] = mapped_column("replies", Integer, default=0)
    views: Mapped[int] = mapped_column("views", Integer, default=0)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Parcours(Base):
    __tablename__ = "parcours"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    user_id: Mapped[str] = mapped_column("userId", String, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    university: Mapped[Optional[str]] = mapped_column("university", String, nullable=True)
    filiere: Mapped[Optional[str]] = mapped_column("filiere", String, nullable=True)
    annee_en_cours: Mapped[Optional[str]] = mapped_column("anneeEnCours", String, nullable=True)
    objectifs: Mapped[Optional[dict]] = mapped_column("objectifs", JSON, nullable=True)
    notes: Mapped[Optional[dict]] = mapped_column("notes", JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="parcours")


class StageOffer(Base):
    __tablename__ = "stage_offers"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    company: Mapped[str] = mapped_column("company", String, nullable=False)
    location: Mapped[str] = mapped_column("location", String, nullable=False)
    type: Mapped[str] = mapped_column("type", String, nullable=False)
    domain: Mapped[str] = mapped_column("domain", String, nullable=False)
    description: Mapped[str] = mapped_column("description", String, nullable=False)
    requirements: Mapped[Optional[str]] = mapped_column("requirements", String, nullable=True)
    duration: Mapped[Optional[str]] = mapped_column("duration", String, nullable=True)
    remuneration: Mapped[Optional[str]] = mapped_column("remuneration", String, nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column("contactEmail", String, nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column("contactPhone", String, nullable=True)
    external_link: Mapped[Optional[str]] = mapped_column("externalLink", String, nullable=True)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    applications: Mapped[list["StageApplication"]] = relationship(back_populates="offer", cascade="all, delete-orphan")


class StageApplication(Base):
    __tablename__ = "stage_applications"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    user_id: Mapped[str] = mapped_column("userId", String, ForeignKey("users.id", ondelete="CASCADE"))
    offer_id: Mapped[str] = mapped_column("offerId", String, ForeignKey("stage_offers.id", ondelete="CASCADE"))
    status: Mapped[str] = mapped_column("status", String, default="pending")
    message: Mapped[Optional[str]] = mapped_column("message", String, nullable=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="stage_applications")
    offer: Mapped["StageOffer"] = relationship(back_populates="applications")


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    description: Mapped[str] = mapped_column("description", String, nullable=False)
    category: Mapped[str] = mapped_column("category", String, nullable=False)
    subject: Mapped[str] = mapped_column("subject", String, nullable=False)
    filiere: Mapped[Optional[str]] = mapped_column("filiere", String, nullable=True)
    university: Mapped[Optional[str]] = mapped_column("university", String, nullable=True)
    year: Mapped[Optional[str]] = mapped_column("year", String, nullable=True)
    file_url: Mapped[str] = mapped_column("fileUrl", String, nullable=False)
    file_type: Mapped[str] = mapped_column("fileType", String, nullable=False)
    file_size: Mapped[int] = mapped_column("fileSize", Integer, nullable=False)
    price: Mapped[float] = mapped_column("price", Float, default=0)
    is_premium: Mapped[bool] = mapped_column("isPremium", Boolean, default=False)
    downloads: Mapped[int] = mapped_column("downloads", Integer, default=0)
    rating: Mapped[float] = mapped_column("rating", Float, default=0)
    author_id: Mapped[str] = mapped_column("authorId", String, ForeignKey("users.id", ondelete="CASCADE"))
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    author: Mapped["User"] = relationship(back_populates="resources_shared")
    purchases: Mapped[list["ResourcePurchase"]] = relationship(back_populates="resource", cascade="all, delete-orphan")


class ResourcePurchase(Base):
    __tablename__ = "resource_purchases"
    __table_args__ = (UniqueConstraint("userId", "resourceId"),)

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    user_id: Mapped[str] = mapped_column("userId", String, ForeignKey("users.id", ondelete="CASCADE"))
    resource_id: Mapped[str] = mapped_column("resourceId", String, ForeignKey("resources.id", ondelete="CASCADE"))
    amount: Mapped[float] = mapped_column("amount", Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="resource_purchases")
    resource: Mapped["Resource"] = relationship(back_populates="purchases")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column("description", String, nullable=True)
    type: Mapped[str] = mapped_column("type", String, nullable=False)
    start_date: Mapped[datetime] = mapped_column("startDate", DateTime(timezone=True), nullable=False)
    end_date: Mapped[Optional[datetime]] = mapped_column("endDate", DateTime(timezone=True), nullable=True)
    location: Mapped[Optional[str]] = mapped_column("location", String, nullable=True)
    university: Mapped[Optional[str]] = mapped_column("university", String, nullable=True)
    is_recurrent: Mapped[bool] = mapped_column("isRecurrent", Boolean, default=False)
    color: Mapped[Optional[str]] = mapped_column("color", String, nullable=True)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class EntrepreneurProject(Base):
    __tablename__ = "entrepreneur_projects"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    description: Mapped[str] = mapped_column("description", String, nullable=False)
    category: Mapped[str] = mapped_column("category", String, nullable=False)
    status: Mapped[str] = mapped_column("status", String, nullable=False)
    team_size: Mapped[int] = mapped_column("teamSize", Integer, default=1)
    seeking: Mapped[Optional[str]] = mapped_column("seeking", String, nullable=True)
    website: Mapped[Optional[str]] = mapped_column("website", String, nullable=True)
    contact_info: Mapped[Optional[str]] = mapped_column("contactInfo", String, nullable=True)
    author_id: Mapped[str] = mapped_column("authorId", String, ForeignKey("users.id", ondelete="CASCADE"))
    likes: Mapped[int] = mapped_column("likes", Integer, default=0)
    views: Mapped[int] = mapped_column("views", Integer, default=0)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    author: Mapped["User"] = relationship(back_populates="entrepreneur_projects")


class Scholarship(Base):
    __tablename__ = "scholarships"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    type: Mapped[str] = mapped_column("type", String, nullable=False)
    organization: Mapped[str] = mapped_column("organization", String, nullable=False)
    description: Mapped[str] = mapped_column("description", String, nullable=False)
    eligibility: Mapped[Optional[str]] = mapped_column("eligibility", String, nullable=True)
    amount: Mapped[Optional[str]] = mapped_column("amount", String, nullable=True)
    deadline: Mapped[Optional[datetime]] = mapped_column("deadline", DateTime(timezone=True), nullable=True)
    apply_link: Mapped[Optional[str]] = mapped_column("applyLink", String, nullable=True)
    contact_info: Mapped[Optional[str]] = mapped_column("contactInfo", String, nullable=True)
    domain: Mapped[Optional[str]] = mapped_column("domain", String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column("location", String, nullable=True)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SuccessStory(Base):
    __tablename__ = "success_stories"

    id: Mapped[str] = mapped_column("id", String, primary_key=True, default=gen_id)
    title: Mapped[str] = mapped_column("title", String, nullable=False)
    content: Mapped[str] = mapped_column("content", String, nullable=False)
    category: Mapped[str] = mapped_column("category", String, nullable=False)
    author_id: Mapped[str] = mapped_column("authorId", String, ForeignKey("users.id", ondelete="CASCADE"))
    author_name: Mapped[str] = mapped_column("authorName", String, nullable=False)
    author_role: Mapped[Optional[str]] = mapped_column("authorRole", String, nullable=True)
    university: Mapped[Optional[str]] = mapped_column("university", String, nullable=True)
    graduation_year: Mapped[Optional[str]] = mapped_column("graduationYear", String, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column("imageUrl", String, nullable=True)
    likes: Mapped[int] = mapped_column("likes", Integer, default=0)
    views: Mapped[int] = mapped_column("views", Integer, default=0)
    is_featured: Mapped[bool] = mapped_column("isFeatured", Boolean, default=False)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    author: Mapped["User"] = relationship(back_populates="success_stories")
