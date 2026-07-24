-- Ajoute le telephone comme identifiant de compte (email optionnel)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_phone ON users (phone);
