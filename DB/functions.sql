-- 1. Получить объекты конкретного района
CREATE OR REPLACE FUNCTION get_objects_by_district(p_district_id INT)
RETURNS TABLE (
    object_name VARCHAR,
    address VARCHAR,
    type_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT io.name, io.address, it.name
    FROM infrastructure_object io
    JOIN infrastructure_type it ON io.type_id = it.id
    WHERE io.district_id = p_district_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Рейтинг районов по населению (с использованием оконной функции)
CREATE OR REPLACE FUNCTION get_district_population_rank()
RETURNS TABLE (
    district_name VARCHAR,
    population INT,
    population_rank BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT d.name, d.population, RANK() OVER (ORDER BY d.population DESC)
    FROM district d;
END;
$$ LANGUAGE plpgsql;

-- 3. Получить события конкретного района
CREATE OR REPLACE FUNCTION get_events_by_district(p_district_id INT)
RETURNS TABLE (
    event_name VARCHAR,
    event_date DATE,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT e.name, e.event_date, e.description
    FROM event e
    WHERE e.district_id = p_district_id
    ORDER BY e.event_date ASC;
END;
$$ LANGUAGE plpgsql;