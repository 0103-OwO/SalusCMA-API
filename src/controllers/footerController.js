import * as model from '../models/footerModelo.js';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: `salus_cma/footer/${folder}` },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};

export const obtenerFooter = async (req, res) => {
    try {
        const data = await model.getFooter();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos del footer' });
    }
};

export const actualizarFooter = async (req, res) => {
    try {
        const id = req.body.id_footer || 1;
        const camposRequeridos = ['facebook', 'instagram', 'x', 'mapa'];

        for (const campo of camposRequeridos) {
            if (!req.body[campo] || req.body[campo].trim() === "") {
                const nombreFormateado = campo.charAt(0).toUpperCase() + campo.slice(1);
                return res.status(400).json({ 
                    success: false, 
                    error: `El campo ${nombreFormateado} no puede quedarse vacío` 
                });
            }
        }
        const { facebook, instagram, x, mapa } = req.body;

        let urls = { img_facebook: null, img_instagram: null, img_x: null };

        if (req.files) {
            if (req.files['img_facebook']) {
                urls.img_facebook = await uploadToCloudinary(req.files['img_facebook'][0].buffer, 'redes');
            }
            if (req.files['img_instagram']) {
                urls.img_instagram = await uploadToCloudinary(req.files['img_instagram'][0].buffer, 'redes');
            }
            if (req.files['img_x']) {
                urls.img_x = await uploadToCloudinary(req.files['img_x'][0].buffer, 'redes');
            }
        }

        await model.updateFooter({
            facebook, instagram, x, mapa, id,
            ...urls
        });

        res.json({ success: true, message: 'Footer actualizado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al actualizar el footer' });
    }
};