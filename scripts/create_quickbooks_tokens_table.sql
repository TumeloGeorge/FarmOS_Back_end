CREATE TABLE IF NOT EXISTS quickbooks_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    realm_id TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);
