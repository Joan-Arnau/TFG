ALTER TABLE municipality_config
    ADD COLUMN IF NOT EXISTS municipality_name VARCHAR(100) NOT NULL DEFAULT 'Ajuntament de Fontserena';
