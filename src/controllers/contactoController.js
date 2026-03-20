import * as model from '../models/contactoModelo.js';
import { emailContacto } from '../services/mailer.service.js';

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

export const enviarMensaje = async (req, res ) => {
    try {
        const { nombre, telefono, email, mensaje } = req.body;

        // Validamos que llegaron los tres campos
        if (!nombre || !telefono || !email || !mensaje) {
        return res.status(400).json({ 
            success: false, 
            error: 'Todos los campos son requeridos' 
        });
        }

        // Llamamos al servicio para enviar el email
        await emailContacto({ nombre, telefono, email, mensaje });

        res.status(200).json({ 
        success: true, 
        message: '¡Mensaje enviado correctamente!' 
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            error: 'Hubo un error al enviar el mensaje' 
        });
    }
};