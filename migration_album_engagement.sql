-- Migration: Add engagement tracking to Albums
-- Run: npx wrangler d1 execute shotbyhamadi-db --file=./migration_album_engagement.sql --remote

ALTER TABLE Albums ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE Albums ADD COLUMN like_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS AlbumEngagement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER NOT NULL,
    fingerprint TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('view', 'like')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(album_id) REFERENCES Albums(id) ON DELETE CASCADE,
    UNIQUE(album_id, fingerprint, action)
);
