-- 1. Добавить район с двумя событиями по умолчанию
CREATE OR REPLACE PROCEDURE add_district_with_default_events(
    p_name VARCHAR,
    p_area NUMERIC,
    p_population INT,
    p_foundation_year INT,
    p_description TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_district_id INT;
BEGIN
    -- Вставляем район и получаем его ID
    INSERT INTO district (name, area_km2, population, foundation_year, description)
    VALUES (p_name, p_area, p_population, p_foundation_year, p_description)
    RETURNING id INTO v_new_district_id;

    -- Добавляем два стандартных события
    INSERT INTO event (name, event_date, description, district_id) VALUES
    ('День нового района', CURRENT_DATE + INTERVAL '30 days', 'Празднование основания', v_new_district_id),
    ('Общественные слушания', CURRENT_DATE + INTERVAL '45 days', 'Обсуждение развития территории', v_new_district_id);
    
    COMMIT;
END;
$$;

-- 2. Удаление района со всеми связанными данными (демонстрация транзакции)
CREATE OR REPLACE PROCEDURE delete_district_cascade(p_district_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Явное удаление связанных записей (даже если есть ON DELETE CASCADE, это показывает логику процедуры)
    DELETE FROM event WHERE district_id = p_district_id;
    DELETE FROM infrastructure_object WHERE district_id = p_district_id;
    DELETE FROM district WHERE id = p_district_id;
    
    COMMIT;
END;
$$;

-- 3. Перенос объектов инфраструктуры из одного района в другой
CREATE OR REPLACE PROCEDURE transfer_objects(p_old_district_id INT, p_new_district_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE infrastructure_object
    SET district_id = p_new_district_id
    WHERE district_id = p_old_district_id;
    
    COMMIT;
END;
$$;