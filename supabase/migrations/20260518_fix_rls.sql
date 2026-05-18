-- Eliminar las políticas restrictivas anteriores
DROP POLICY IF EXISTS "Solo administradores pueden ver solicitudes" ON public.solicitudes;
DROP POLICY IF EXISTS "Permitir actualización a administradores" ON public.solicitudes;
DROP POLICY IF EXISTS "Permitir eliminación a administradores" ON public.solicitudes;

-- Crear nuevas políticas que permitan lectura, actualización y eliminación al panel
CREATE POLICY "Permitir ver solicitudes"
    ON public.solicitudes
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Permitir actualizar solicitudes"
    ON public.solicitudes
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Permitir eliminar solicitudes"
    ON public.solicitudes
    FOR DELETE
    TO anon, authenticated
    USING (true);
