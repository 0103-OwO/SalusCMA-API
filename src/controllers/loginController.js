import * as model from '../models/loginModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { identificador, contrasena } = req.body;

    try {
        const user = await model.buscarUsuarioGlobal(identificador);

        if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        let nombreReal = 'Usuario';
        if (user.tipo_usuario === 'cliente' && user.id_referencia) {
            const p = await model.getNombrePaciente(user.id_referencia);
            nombreReal = p ? p.nombre : 'Paciente';
        } else if (user.tipo_usuario === 'interno' && user.id_referencia) {
            const t = await model.getNombreTrabajador(user.id_referencia);
            nombreReal = t ? t.nombre : 'Empleado';
        }

        const token = jwt.sign(
            { 
                id: user.id_interno,
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