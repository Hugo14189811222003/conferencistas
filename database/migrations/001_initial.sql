-- Migration: 001_initial
-- Description: Create initial schema for Conferencistas

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Table: usuarios (hosts)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    bio TEXT,
    gmail VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL DEFAULT 2 REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Table: lugares (placeholders for Hugo)
CREATE TABLE lugares (
    id SERIAL PRIMARY KEY,
    direccion TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    place_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    host_id INTEGER NOT NULL REFERENCES usuarios(id),
    capacidad INTEGER NOT NULL DEFAULT 0,
    horario TIME,
    fecha DATE NOT NULL,
    costo_entrada DECIMAL(10, 2) DEFAULT 0,
    lugar_id INTEGER REFERENCES lugares(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: evento_categorias (many-to-many)
CREATE TABLE evento_categorias (
    evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, categoria_id)
);

-- Table: asistentes
CREATE TABLE asistentes (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evento_id, email)
);

-- Table: password_reset_tokens
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_usuarios_gmail ON usuarios(gmail);
CREATE INDEX idx_eventos_host ON eventos(host_id);
CREATE INDEX idx_eventos_fecha ON eventos(fecha);
CREATE INDEX idx_asistentes_evento ON asistentes(evento_id);
CREATE INDEX idx_asistentes_email ON asistentes(email);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
