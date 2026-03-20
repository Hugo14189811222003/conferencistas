-- Combined init file: migration + seed
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

-- =============================================
-- SEED DATA
-- =============================================

-- Insert roles
INSERT INTO roles (nombre) VALUES 
    ('admin'),
    ('user');

-- Insert categorias
INSERT INTO categorias (nombre) VALUES 
    ('Tecnología'),
    ('Negocios'),
    ('Diseño'),
    ('Marketing'),
    ('Ciencia'),
    ('Arte'),
    ('Música'),
    ('Educación');

-- Insert lugares (placeholders)
INSERT INTO lugares (direccion, lat, lng, place_id) VALUES 
    ('Centro de Convenciones, Ciudad de México', 19.4326, -99.1332, 'placeholder_1'),
    ('Auditorio Nacional, Ciudad de México', 19.4363, -99.0865, 'placeholder_2'),
    ('WTC, Ciudad de México', 19.4286, -99.4617, 'placeholder_3');

-- Insert test admin user (password123)
INSERT INTO usuarios (nombre, bio, gmail, password_hash, role_id) VALUES 
    ('Administrador', 'Administrador del sistema', 'admin@conferencistas.com', '$2b$10$eImiTXuWVxfM37uY4JANjO.d Weir8c0kT9EYxMGp3R3yQJk7xZ2W', 1);

-- Insert test regular users (password123)
INSERT INTO usuarios (nombre, bio, gmail, password_hash, role_id) VALUES 
    ('Juan Pérez', 'Organizador de eventos de tecnología', 'juan@perez.com', '$2b$10$eImiTXuWVxfM37uY4JANjO.d Weir8c0kT9EYxMGp3R3yQJk7xZ2W', 2),
    ('María García', 'Conferencista y emprendedora', 'maria@garcia.com', '$2b$10$eImiTXuWVxfM37uY4JANjO.d Weir8c0kT9EYxMGp3R3yQJk7xZ2W', 2),
    ('Carlos López', 'Especialista en marketing digital', 'carlos@lopez.com', '$2b$10$eImiTXuWVxfM37uY4JANjO.d Weir8c0kT9EYxMGp3R3yQJk7xZ2W', 2);

-- Insert test eventos
INSERT INTO eventos (nombre, descripcion, host_id, capacidad, horario, fecha, costo_entrada, lugar_id) VALUES 
    ('Tech Conference 2026', 'La conferencia de tecnología más grande del año. Incluye workshops, paneles y networking.', 2, 500, '09:00', '2026-04-15', 500.00, 1),
    ('Startup Summit', 'Encuentro de emprendedores y startups. Pitch competitions y mentorías.', 3, 300, '10:00', '2026-05-20', 350.00, 2),
    ('Marketing Digital Summit', 'Estrategias de marketing para el mundo digital. Casos de éxito y tendencias.', 4, 200, '14:00', '2026-06-10', 250.00, 3),
    ('Diseño UX/UI Workshop', 'Workshop práctico sobre diseño de experiencia de usuario.', 2, 50, '09:00', '2026-04-25', 800.00, 1),
    ('Ciencia y Futuro', 'Charlas sobre los avances científicos que definirán el mañana.', 3, 400, '11:00', '2026-07-01', 0.00, 2);

-- Assign categorias to eventos
INSERT INTO evento_categorias (evento_id, categoria_id) VALUES 
    (1, 1), (1, 2),
    (2, 2), (2, 4),
    (3, 4), (3, 2),
    (4, 3),
    (5, 5), (5, 6);

-- Insert test asistentes
INSERT INTO asistentes (evento_id, email, nombre, telefono) VALUES 
    (1, 'asistente1@email.com', 'Pedro Sánchez', '5551234567'),
    (1, 'asistente2@email.com', 'Ana Martínez', '5559876543'),
    (2, 'emprendedor@email.com', 'Roberto Díaz', '5554567890'),
    (3, 'marketer@email.com', 'Laura Torres', '5553216549');
