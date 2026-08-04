"""initial

Revision ID: 1ea851bb3937
Revises:
Create Date: 2026-03-29 12:16:48.302195

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '1ea851bb3937'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- users ---
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )

    # --- cv_profiles ---
    op.create_table(
        'cv_profiles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('userId', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('headline', sa.String(), nullable=True),
        sa.Column('about', sa.String(), nullable=True),
        sa.Column('skills', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('languages', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('education', sa.JSON(), nullable=True),
        sa.Column('experiences', sa.JSON(), nullable=True),
        sa.Column('projects', sa.JSON(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('userId'),
    )

    # --- advisor_profiles ---
    op.create_table(
        'advisor_profiles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('userId', sa.String(), nullable=False),
        sa.Column('field', sa.String(), nullable=False),
        sa.Column('university', sa.String(), nullable=False),
        sa.Column('year', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('meetLink', sa.String(), nullable=True),
        sa.Column('availableSlots', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('userId'),
    )

    # --- appointments ---
    op.create_table(
        'appointments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('userId', sa.String(), nullable=False),
        sa.Column('advisorId', sa.String(), nullable=False),
        sa.Column('date', sa.String(), nullable=False),
        sa.Column('time', sa.String(), nullable=False),
        sa.Column('meetLink', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['advisorId'], ['advisor_profiles.userId'], ondelete='CASCADE'),
    )

    # --- forum_posts ---
    op.create_table(
        'forum_posts',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('author', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('replies', sa.Integer(), nullable=False),
        sa.Column('views', sa.Integer(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # --- parcours ---
    op.create_table(
        'parcours',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('userId', sa.String(), nullable=False),
        sa.Column('university', sa.String(), nullable=True),
        sa.Column('filiere', sa.String(), nullable=True),
        sa.Column('anneeEnCours', sa.String(), nullable=True),
        sa.Column('objectifs', sa.JSON(), nullable=True),
        sa.Column('notes', sa.JSON(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('userId'),
    )

    # --- stage_offers ---
    op.create_table(
        'stage_offers',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('company', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('domain', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('requirements', sa.String(), nullable=True),
        sa.Column('duration', sa.String(), nullable=True),
        sa.Column('remuneration', sa.String(), nullable=True),
        sa.Column('contactEmail', sa.String(), nullable=True),
        sa.Column('contactPhone', sa.String(), nullable=True),
        sa.Column('externalLink', sa.String(), nullable=True),
        sa.Column('isActive', sa.Boolean(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # --- stage_applications ---
    op.create_table(
        'stage_applications',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('userId', sa.String(), nullable=False),
        sa.Column('offerId', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('message', sa.String(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['offerId'], ['stage_offers.id'], ondelete='CASCADE'),
    )

    # --- resources ---
    op.create_table(
        'resources',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('subject', sa.String(), nullable=False),
        sa.Column('filiere', sa.String(), nullable=True),
        sa.Column('university', sa.String(), nullable=True),
        sa.Column('year', sa.String(), nullable=True),
        sa.Column('fileUrl', sa.String(), nullable=False),
        sa.Column('fileType', sa.String(), nullable=False),
        sa.Column('fileSize', sa.Integer(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('isPremium', sa.Boolean(), nullable=False),
        sa.Column('downloads', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Float(), nullable=False),
        sa.Column('authorId', sa.String(), nullable=False),
        sa.Column('isActive', sa.Boolean(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['authorId'], ['users.id'], ondelete='CASCADE'),
    )

    # --- resource_purchases ---
    op.create_table(
        'resource_purchases',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('userId', sa.String(), nullable=False),
        sa.Column('resourceId', sa.String(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['userId'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['resourceId'], ['resources.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('userId', 'resourceId'),
    )

    # --- calendar_events ---
    op.create_table(
        'calendar_events',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('startDate', sa.DateTime(timezone=True), nullable=False),
        sa.Column('endDate', sa.DateTime(timezone=True), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('university', sa.String(), nullable=True),
        sa.Column('isRecurrent', sa.Boolean(), nullable=False),
        sa.Column('color', sa.String(), nullable=True),
        sa.Column('isActive', sa.Boolean(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # --- entrepreneur_projects ---
    op.create_table(
        'entrepreneur_projects',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('teamSize', sa.Integer(), nullable=False),
        sa.Column('seeking', sa.String(), nullable=True),
        sa.Column('website', sa.String(), nullable=True),
        sa.Column('contactInfo', sa.String(), nullable=True),
        sa.Column('authorId', sa.String(), nullable=False),
        sa.Column('likes', sa.Integer(), nullable=False),
        sa.Column('views', sa.Integer(), nullable=False),
        sa.Column('isActive', sa.Boolean(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['authorId'], ['users.id'], ondelete='CASCADE'),
    )

    # --- scholarships ---
    op.create_table(
        'scholarships',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('organization', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('eligibility', sa.String(), nullable=True),
        sa.Column('amount', sa.String(), nullable=True),
        sa.Column('deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('applyLink', sa.String(), nullable=True),
        sa.Column('contactInfo', sa.String(), nullable=True),
        sa.Column('domain', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('isActive', sa.Boolean(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # --- success_stories ---
    op.create_table(
        'success_stories',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('authorId', sa.String(), nullable=False),
        sa.Column('authorName', sa.String(), nullable=False),
        sa.Column('authorRole', sa.String(), nullable=True),
        sa.Column('university', sa.String(), nullable=True),
        sa.Column('graduationYear', sa.String(), nullable=True),
        sa.Column('imageUrl', sa.String(), nullable=True),
        sa.Column('likes', sa.Integer(), nullable=False),
        sa.Column('views', sa.Integer(), nullable=False),
        sa.Column('isFeatured', sa.Boolean(), nullable=False),
        sa.Column('isActive', sa.Boolean(), nullable=False),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['authorId'], ['users.id'], ondelete='CASCADE'),
    )


def downgrade() -> None:
    op.drop_table('success_stories')
    op.drop_table('scholarships')
    op.drop_table('entrepreneur_projects')
    op.drop_table('calendar_events')
    op.drop_table('resource_purchases')
    op.drop_table('resources')
    op.drop_table('stage_applications')
    op.drop_table('stage_offers')
    op.drop_table('parcours')
    op.drop_table('forum_posts')
    op.drop_table('appointments')
    op.drop_table('advisor_profiles')
    op.drop_table('cv_profiles')
    op.drop_table('users')
