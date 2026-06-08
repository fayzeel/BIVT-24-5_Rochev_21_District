-- Очистка таблиц в обратном порядке зависимостей (для безопасного повторного запуска)
DROP TABLE IF EXISTS district_audit_log CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS infrastructure_object CASCADE;
DROP TABLE IF EXISTS infrastructure_type CASCADE;
DROP TABLE IF EXISTS district CASCADE;

-- 1. Таблица районов
CREATE TABLE district (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    area_km2 NUMERIC(10, 2) NOT NULL,
    population INT NOT NULL,
    foundation_year INT NOT NULL,
    description TEXT
);

-- 2. Таблица типов инфраструктуры
CREATE TABLE infrastructure_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Таблица объектов инфраструктуры
CREATE TABLE infrastructure_object (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(255) NOT NULL,
    foundation_year INT,
    district_id INT REFERENCES district(id) ON DELETE CASCADE,
    type_id INT REFERENCES infrastructure_type(id) ON DELETE SET NULL
);

-- 4. Таблица событий
CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    district_id INT REFERENCES district(id) ON DELETE CASCADE
);

-- 5. Таблица аудита (для триггера)
CREATE TABLE district_audit_log (
    id SERIAL PRIMARY KEY,
    district_id INT,
    action VARCHAR(20) NOT NULL, -- 'INSERT' или 'DELETE'
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === НАПОЛНЕНИЕ ДАННЫМИ ===

-- Районы
INSERT INTO district (name, area_km2, population, foundation_year, description) VALUES
('Тверской', 12.5, 85000, 1917, 'Исторический центр города'),
('Замоскворечье', 4.8, 45000, 1917, 'Тихий район с старинной застройкой'),
('Хамовники', 10.2, 110000, 1917, 'Престижный район с парками и спортивными объектами'),
('Бауманский', 8.1, 95000, 1917, 'Студенческий и технический район'),
('Даниловский', 15.3, 130000, 1917, 'Крупный промышленный и жилой район');

-- Типы инфраструктуры
INSERT INTO infrastructure_type (name, description) VALUES
('Школа', 'Общеобразовательное учреждение'),
('Больница', 'Медицинское учреждение'),
('Парк', 'Зона отдыха и рекреации'),
('Торговый центр', 'Объект розничной торговли');

-- Объекты инфраструктуры
INSERT INTO infrastructure_object (name, address, foundation_year, district_id, type_id) VALUES
('Школа № 1234', 'ул. Тверская, д. 10', 1965, 1, 1),
('Городская больница № 5', 'ул. Щипок, д. 12', 1980, 2, 2),
('Парк Горького', 'ул. Крымский Вал, д. 9', 1928, 3, 3),
('ТЦ "Европейский"', 'пл. Киевского Вокзала, д. 2', 2006, 3, 4),
('МГТУ им. Баумана', '2-я Бауманская ул., д. 5', 1830, 4, 1),
('Парк искусств Музеон', 'Крымский вал, вл. 2', 1992, 3, 3);

-- События (некоторые в будущем, некоторые в прошлом для проверки триггеров)
INSERT INTO event (name, event_date, description, district_id) VALUES
('День района Тверской', '2026-09-15', 'Праздничные гуляния и ярмарка', 1),
('Субботник в парке', '2026-04-20', 'Уборка территории парка', 3),
('Фестиваль уличной еды', '2026-06-12', 'Гастрономический фестиваль', 2),
('День открытых дверей в МГТУ', '2026-02-10', 'Презентация факультетов', 4);