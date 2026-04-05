import { buscarUsuarioGlobal, getNombrePaciente, getNombreTrabajador } from '../models/loginModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { identificador, contrasena } = req.body;

    try {
        const user = await buscarUsuarioGlobal(identificador);

        if (!user) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        const hashCompatible = user.contrasena.replace(/^\$2y\$/, '$2a$');
        const isMatch = await bcrypt.compare(contrasena, hashCompatible);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        if (parseInt(user.activo) === 0) {
            return res.status(403).json({
                success: false,
                cuentaInactiva: true,
                error: 'Tu cuenta está desactivada.',
                identificador: identificador // Lo enviamos de vuelta para facilitar la reactivación
            });
        }

        let nombreReal = 'Usuario';

        if (user.nombre_real) {
            nombreReal = user.nombre_real;
        }
        else if (user.tipo_usuario === 'cliente' && user.id_referencia) {
            const p = await getNombrePaciente(user.id_referencia);
            nombreReal = p ? p.nombre : 'Paciente';
        } else if (user.tipo_usuario === 'interno' && user.id_referencia) {
            const t = await getNombreTrabajador(user.id_referencia);
            nombreReal = t ? t.nombre : 'Empleado';
        }

        const token = jwt.sign(
            {
                id: user.id_referencia || user.id_interno,
                rol: user.id_rol,
                nombre: nombreReal,
                tipo: user.tipo_usuario
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            rol: user.id_rol,
            nombre: nombreReal
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};