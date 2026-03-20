-- Seed: Initial data for Conferencistas
-- Password for all test users: password123

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
    (1, 1), (1, 2),  -- Tech Conference: Tecnología, Negocios
    (2, 2), (2, 4),  -- Startup Summit: Negocios, Marketing
    (3, 4), (3, 2),  -- Marketing Digital: Marketing, Negocios
    (4, 3),          -- Diseño: Diseño
    (5, 5), (5, 6);  -- Ciencia: Ciencia, Arte

-- Insert test asistentes
INSERT INTO asistentes (evento_id, email, nombre, telefono) VALUES 
    (1, 'asistente1@email.com', 'Pedro Sánchez', '5551234567'),
    (1, 'asistente2@email.com', 'Ana Martínez', '5559876543'),
    (2, 'emprendedor@email.com', 'Roberto Díaz', '5554567890'),
    (3, 'marketer@email.com', 'Laura Torres', '5553216549');
