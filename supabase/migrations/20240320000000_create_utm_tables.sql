-- Crear la taula d'UTMs
CREATE TABLE utm_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    source VARCHAR(255) NOT NULL,
    medium VARCHAR(255) NOT NULL,
    campaign VARCHAR(255) NOT NULL,
    term VARCHAR(255),
    content VARCHAR(255),
    full_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    name VARCHAR(255),
    description TEXT
);

-- Crear índexs per millorar el rendiment
CREATE INDEX idx_utm_records_user_id ON utm_records(user_id);
CREATE INDEX idx_utm_records_created_at ON utm_records(created_at);

-- Crear la taula d'historial d'ús
CREATE TABLE utm_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utm_id UUID REFERENCES utm_records(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    used_count INTEGER DEFAULT 1
);

-- Crear índexs per l'historial
CREATE INDEX idx_utm_history_utm_id ON utm_history(utm_id);
CREATE INDEX idx_utm_history_user_id ON utm_history(user_id);

-- Crear RLS (Row Level Security) policies
ALTER TABLE utm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_history ENABLE ROW LEVEL SECURITY;

-- Polítiques per utm_records
CREATE POLICY "Users can view all UTMs"
    ON utm_records FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own UTMs"
    ON utm_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own UTMs"
    ON utm_records FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own UTMs"
    ON utm_records FOR DELETE
    USING (auth.uid() = user_id);

-- Polítiques per utm_history
CREATE POLICY "Users can view all history"
    ON utm_history FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own history"
    ON utm_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Funció per actualitzar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per actualitzar updated_at
CREATE TRIGGER update_utm_records_updated_at
    BEFORE UPDATE ON utm_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 