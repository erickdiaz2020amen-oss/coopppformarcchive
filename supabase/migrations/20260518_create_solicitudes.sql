-- Crear la tabla de solicitudes
CREATE TABLE IF NOT EXISTS public.solicitudes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    fecha_solicitud DATE NOT NULL,
    
    -- Datos Personales
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    cedula TEXT NOT NULL,
    fecha_nacimiento DATE,
    estado_civil TEXT,
    sexo TEXT,
    direccion TEXT,
    ciudad TEXT,
    provincia TEXT,
    telefonos TEXT,
    email TEXT,
    dependientes TEXT,
    
    -- Datos Laborales
    empresa TEXT,
    codigo_empleado TEXT,
    direccion_empresa TEXT,
    departamento TEXT,
    cargo TEXT,
    salario TEXT,
    fecha_ingreso DATE,
    aporte_mensual TEXT,
    
    -- Datos Cónyuge
    conyuge TEXT,
    ocupacion_conyuge TEXT,
    salario_conyuge TEXT,
    fecha_nacimiento_conyuge DATE,

    -- Enlaces a Backblaze B2
    cedula_frontal_url TEXT,
    cedula_trasera_url TEXT,
    firma_url TEXT
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad: Permitir insertar a cualquiera, solo ver a los administradores
CREATE POLICY "Permitir inserción de solicitudes a cualquier usuario anónimo"
    ON public.solicitudes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Solo roles con permisos (como service_role o un admin) podrán hacer SELECT
CREATE POLICY "Solo administradores pueden ver solicitudes"
    ON public.solicitudes
    FOR SELECT
    TO authenticated
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));
