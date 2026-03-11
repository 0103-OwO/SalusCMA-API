import * as model from '../models/publicidadModelo.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'salus_cma/imagenesP' }, 
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
        res.status(500).json({ error: 'Error al obtener banners' });
    }
};

export const actualizarPublicidad = async (req, res) => {
    try {
        const id = 1;
        let urls = { img_uno: null, img_dos: null, img_tres: null };

        if (req.files) {
            if (req.files['img_uno']) urls.img_uno = await uploadToCloudinary(req.files['img_uno'][0].buffer);
            if (req.files['img_dos']) urls.img_dos = await uploadToCloudinary(req.files['img_dos'][0].buffer);
            if (req.files['img_tres']) urls.img_tres = await uploadToCloudinary(req.files['img_tres'][0].buffer);
        }

        if (!urls.img_uno && !urls.img_dos && !urls.img_tres) {
            return res.status(400).json({ error: 'Debes seleccionar al menos una imagen para actualizar' });
        }

        await model.updatePublicidad({ ...urls, id });
        res.json({ success: true, message: 'Banners actualizados correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno en el servidor' });
    }
};