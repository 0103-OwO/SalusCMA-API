import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Formato de token inválido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);

        // Si el token es válido pero no tiene id_referencia, el login está mal
        if (!verificado.id_referencia) {
            return res.status(403).json({
                error: 'Token corrupto: No contiene id_referencia. Re-inicie sesión.'
            });
        }

        req.usuario = verificado;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token no válido o expirado.' });
    }
};