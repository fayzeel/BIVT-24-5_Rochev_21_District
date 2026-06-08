-- 1. Статистика по районам (количество объектов и событий)
CREATE OR REPLACE VIEW view_district_stats AS
SELECT 
    d.id,
    d.name AS district_name,
    d.population,
    COUNT(DISTINCT io.id) AS object_count,
    COUNT(DISTINCT e.id) AS event_count
FROM district d
LEFT JOIN infrastructure_object io ON d.id = io.district_id
LEFT JOIN event e ON d.id = e.district_id
GROUP BY d.id, d.name, d.population;

-- 2. Полная информация об объектах инфраструктуры
CREATE OR REPLACE VIEW view_infrastructure_full AS
SELECT 
    io.id,
    io.name AS object_name,
    io.address,
    io.foundation_year,
    d.name AS district_name,
    it.name AS type_name
FROM infrastructure_object io
JOIN district d ON io.district_id = d.id
JOIN infrastructure_type it ON io.type_id = it.id;

-- 3. Предстоящие события (дата >= сегодня)
CREATE OR REPLACE VIEW view_events_upcoming AS
SELECT 
    e.id,
    e.name AS event_name,
    e.event_date,
    e.description,
    d.name AS district_name
FROM event e
JOIN district d ON e.district_id = d.id
WHERE e.event_date >= CURRENT_DATE
ORDER BY e.event_date ASC;