-- 1. Триггер: Запрет отрицательного населения
CREATE OR REPLACE FUNCTION fn_check_population_positive()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.population < 0 THEN
        RAISE EXCEPTION 'Население района не может быть отрицательным!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_population_positive
BEFORE INSERT OR UPDATE ON district
FOR EACH ROW
EXECUTE FUNCTION fn_check_population_positive();


-- 2. Триггер: Аудит добавления или удаления района
CREATE OR REPLACE FUNCTION fn_district_audit()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO district_audit_log (district_id, action) VALUES (NEW.id, 'INSERT');
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO district_audit_log (district_id, action) VALUES (OLD.id, 'DELETE');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_district_audit
AFTER INSERT OR DELETE ON district
FOR EACH ROW
EXECUTE FUNCTION fn_district_audit();


-- 3. Триггер: Запрет создания событий в прошлом
CREATE OR REPLACE FUNCTION fn_check_event_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Дата события не может быть в прошлом!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_event_date
BEFORE INSERT OR UPDATE ON event
FOR EACH ROW
EXECUTE FUNCTION fn_check_event_date();