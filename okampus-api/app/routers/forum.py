from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth import get_current_user, get_optional_user
from app.database import get_db
from app.models import ForumComment, ForumLike, ForumPost, User
from app.schemas import (
    ForumCommentCreate,
    ForumCommentOut,
    ForumLikeOut,
    ForumPostCreatePublic,
    ForumPostPublicOut,
)

router = APIRouter(prefix="/forum", tags=["forum"])


def _post_out(post: ForumPost, liked_by_me: bool = False) -> ForumPostPublicOut:
    return ForumPostPublicOut(
        id=post.id,
        title=post.title,
        content=post.content,
        author=post.author,
        author_id=post.author_id,
        category=post.category,
        replies=post.replies,
        views=post.views,
        likes=post.likes or 0,
        created_at=post.created_at,
        liked_by_me=liked_by_me,
    )


async def _liked_post_ids(db: AsyncSession, user_id: str | None, post_ids: list[str]) -> set[str]:
    if not user_id or not post_ids:
        return set()
    result = await db.execute(
        select(ForumLike.post_id).where(
            ForumLike.user_id == user_id,
            ForumLike.post_id.in_(post_ids),
        )
    )
    return set(result.scalars().all())


async def _get_post_or_404(db: AsyncSession, post_id: str) -> ForumPost:
    result = await db.execute(select(ForumPost).where(ForumPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Discussion introuvable")
    return post


@router.get("", response_model=list[ForumPostPublicOut])
async def list_forum_posts(
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    q = select(ForumPost).order_by(ForumPost.created_at.desc())
    if category:
        q = q.where(ForumPost.category == category)
    result = await db.execute(q)
    posts = result.scalars().all()
    liked_ids = await _liked_post_ids(db, user.id if user else None, [p.id for p in posts])
    return [_post_out(p, p.id in liked_ids) for p in posts]


@router.post("", response_model=ForumPostPublicOut, status_code=201)
async def create_forum_post(
    body: ForumPostCreatePublic,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    post = ForumPost(
        title=body.title.strip(),
        content=(body.content or body.title).strip(),
        author=user.name,
        author_id=user.id,
        category=(body.category or "Autre").strip(),
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return _post_out(post, False)


@router.get("/{post_id}", response_model=ForumPostPublicOut)
async def get_forum_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    post = await _get_post_or_404(db, post_id)
    post.views = (post.views or 0) + 1
    await db.commit()
    await db.refresh(post)
    liked_ids = await _liked_post_ids(db, user.id if user else None, [post.id])
    return _post_out(post, post.id in liked_ids)


@router.get("/{post_id}/comments", response_model=list[ForumCommentOut])
async def list_comments(post_id: str, db: AsyncSession = Depends(get_db)):
    await _get_post_or_404(db, post_id)
    result = await db.execute(
        select(ForumComment)
        .where(ForumComment.post_id == post_id)
        .order_by(ForumComment.created_at.asc())
    )
    return result.scalars().all()


@router.post("/{post_id}/comments", response_model=ForumCommentOut, status_code=201)
async def add_comment(
    post_id: str,
    body: ForumCommentCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    content = body.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Le commentaire ne peut pas etre vide")

    post = await _get_post_or_404(db, post_id)
    comment = ForumComment(
        post_id=post_id,
        user_id=user.id,
        author_name=user.name,
        content=content,
    )
    post.replies = (post.replies or 0) + 1
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment


@router.post("/{post_id}/like", response_model=ForumLikeOut)
async def toggle_like(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    post = await _get_post_or_404(db, post_id)
    existing = await db.execute(
        select(ForumLike).where(ForumLike.post_id == post_id, ForumLike.user_id == user.id)
    )
    like = existing.scalar_one_or_none()

    if like:
        await db.delete(like)
        post.likes = max((post.likes or 0) - 1, 0)
        liked = False
    else:
        db.add(ForumLike(post_id=post_id, user_id=user.id))
        post.likes = (post.likes or 0) + 1
        liked = True

    await db.commit()
    await db.refresh(post)
    return ForumLikeOut(liked=liked, likes=post.likes)
