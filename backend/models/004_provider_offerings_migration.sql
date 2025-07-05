CREATE TABLE provider_offerings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    img TEXT,
    offering_type TEXT NOT NULL,
    category TEXT,
    pricing_model TEXT,
    price REAL,
    rating REAL,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id)
);