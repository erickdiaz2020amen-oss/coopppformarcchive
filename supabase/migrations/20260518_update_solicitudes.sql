ALTER TABLE public.solicitudes ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente';
ALTER TABLE public.solicitudes ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Para permitir actualizar el estado y pdf_url a los usuarios autenticados
CREATE POLICY "Permitir actualización a administradores"
    ON public.solicitudes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Para permitir eliminar solicitudes a administradores
CREATE POLICY "Permitir eliminación a administradores"
    ON public.solicitudes
    FOR DELETE
    TO authenticated
    USING (true);
