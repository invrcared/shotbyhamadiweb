-- Cloudflare D1 Database Schema
-- Run this using: npx wrangler d1 execute shotbyhamadi-db --file=./schema.sql

DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Media;

CREATE TABLE Services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL,
    features TEXT,                      -- JSON-stringified array e.g. ["15 Edited Photos"]
    category TEXT DEFAULT 'General',    -- e.g. Portraits, Events, Sports
    travel_fee REAL DEFAULT 0,          -- flat travel surcharge in dollars
    policy_note TEXT DEFAULT '',        -- short policy sentence shown under price
    is_active INTEGER DEFAULT 1         -- 1 = visible on public /services, 0 = hidden
);

CREATE TABLE Projects (
    id TEXT PRIMARY KEY, -- UUID or similar
    project_code TEXT UNIQUE NOT NULL, -- The unique login code for the client
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    folder_path TEXT NOT NULL, -- The R2 bucket prefix/folder holding their media
    location TEXT, -- Project Location String
    project_password TEXT, -- Auth Password
    base_price REAL DEFAULT 0,
    travel_surcharge REAL DEFAULT 0,
    notes TEXT
);

CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE Media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    category_id INTEGER,
    project_id TEXT,
    alt_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY(project_id) REFERENCES Projects(id) ON DELETE CASCADE
);

-- Insert dummy data for initial setup
INSERT INTO Services (title, description, price, features) 
VALUES 
('Essential Portraits', '1 Hour Session • 15 Edited Photos • Online Gallery', 250.00, '["1 Hour Session", "15 Edited Photos", "Online Gallery"]'),
('Event Coverage', '4 Hour Event • Highlight Video • 100+ Edited Photos', 1200.00, '["4 Hour Coverage", "Highlight Video", "100+ Edited Photos"]');

INSERT INTO Categories (name, slug) 
VALUES 
('All', 'all'),
('Weddings', 'weddings'),
('Automotive', 'automotive'),
('Portraits', 'portraits'),
('Events', 'events');

