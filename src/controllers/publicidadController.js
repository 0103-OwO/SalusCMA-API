import * as model from '../models/publicidadModel.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'salus_cma/publicidad' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

export const obtenerPublicidad = async (req, res) => {
    try {
        const data = await model.getPublicidad();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener publicidad' });
    }
};

export const actualizarPublicidad = async (req, res) => {
    try {
        const id = 1;
        let urls = {};

        if (req.files) {
            if (req.files['img_uno']) urls.img_uno = await uploadToCloudinary(req.files['img_uno'][0].buffer);
            if (req.files['img_dos']) urls.img_dos = await uploadToCloudinary(req.files['img_dos'][0].buffer);
            if (req.files['img_tres']) urls.img_tres = await uploadToCloudinary(req.files['img_tres'][0].buffer);
        }

        if (Object.keys(urls).length === 0) {
            return res.status(400).json({ error: 'No se seleccionó ninguna imagen para actualizar' });
        }

        await model.updatePublicidad(id, urls);
        res.json({ success: true, message: 'Publicidad actualizada correctamente', urls });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir las imágenes de publicidad' });
    }
};