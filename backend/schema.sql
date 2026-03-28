-- AvatarGov SQL Schema (Neon PostgreSQL)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE leaders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    state TEXT,
    language TEXT DEFAULT 'hindi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
    phone_verified BOOLEAN DEFAULT FALSE,
    consent_given_at TIMESTAMP,
    consent_token TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE avatar_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
    video_hash TEXT NOT NULL,
    signed_token TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS message_translations (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    translated_text TEXT,
    audio_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, language)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    scope TEXT NOT NULL,
    granted_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mcc_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
    content_hash TEXT NOT NULL,
    flag_reason TEXT NOT NULL,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    language TEXT NOT NULL,
    region TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_check (
    id INTEGER PRIMARY KEY DEFAULT 1,
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial health_check row
INSERT INTO health_check (id, last_ping) VALUES (1, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;
