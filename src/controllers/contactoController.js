import * as model from '../models/contactoModelo.js';

export const obtenerContacto = async (req, res) => {
    try {
        const data = await model.getContacto();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos de contacto' });
    }
};

export const actualizarContacto = async (req, res) => {
    try {
        const id = req.body.id_contacto || 1;
        const datos = {
            direccion: req.body.direccion,
            correo: req.body.correo,
            telefono: req.body.telefono
        };

        await model.updateContacto(datos, id);
        res.json({ success: true, message: 'Contacto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar contacto' });
    }
};