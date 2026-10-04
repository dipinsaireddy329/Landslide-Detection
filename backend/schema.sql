-- SQLite Schema for Landslide Detection Platform

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Geospatial Analyst',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    image_name TEXT NOT NULL,
    image_path TEXT NOT NULL,
    image_size INTEGER,
    prediction TEXT NOT NULL CHECK(prediction IN ('landslide', 'non-landslide')),
    confidence REAL NOT NULL,
    risk_level TEXT NOT NULL CHECK(risk_level IN ('critical', 'high', 'moderate', 'low')),
    processing_time_ms INTEGER NOT NULL,
    location_name TEXT,
    terrain_roughness REAL,
    gabor_energy REAL,
    vegetation_ndvi REAL,
    soil_displacement REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    prediction_id TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'acknowledged', 'resolved')),
    severity TEXT NOT NULL CHECK(severity IN ('critical', 'high', 'warning')),
    location_name TEXT,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(prediction_id) REFERENCES predictions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
