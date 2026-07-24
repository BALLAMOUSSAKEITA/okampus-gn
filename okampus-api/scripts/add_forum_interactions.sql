-- Migration forum : likes, author_id, commentaires
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS "authorId" VARCHAR REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS forum_comments (
    id VARCHAR PRIMARY KEY,
    "postId" VARCHAR NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    "userId" VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "authorName" VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forum_likes (
    id VARCHAR PRIMARY KEY,
    "postId" VARCHAR NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    "userId" VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE ("postId", "userId")
);
