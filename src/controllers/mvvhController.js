import * as model from '../models/mvvhModelo.js';
import cloudinary from '../config/cloudinary.js';

export const obtenerTodo = async (req, res) => {
    try {
        const data = await model.getMisionVision();
        if (!data) {
            return res.status(404).json({ error: 'No se encontraron datos institucionales' });
        }
        res.json(data);
    } catch (error) {
        console.error("Error en obtenerTodo:", error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};

export const actualizarSeccionInstitucional = async (req, res) => {
    try {
        const id = req.body.id_mision_vision || 1;
        let campoTexto, valorTexto, campoImg, carpeta;

        if (req.body.mision !== undefined) {
            campoTexto = 'mision';
            valorTexto = req.body.mision;
            campoImg = 'img_mision';
            carpeta = 'salus_cma/mision';
        } else if (req.body.vision !== undefined) {
            campoTexto = 'vision';
            valorTexto = req.body.vision;
            campoImg = 'img_vision';
            carpeta = 'salus_cma/vision';
        } else if (req.body.valores !== undefined) {
            campoTexto = 'valores';
            valorTexto = req.body.valores;
            campoImg = 'img_valores';
            carpeta = 'salus_cma/valores';
        } else if (req.body.historia !== undefined) {
            campoTexto = 'historia';
            valorTexto = req.body.historia;
            campoImg = 'img_historia';
            carpeta = 'salus_cma/historia';
        }

        if (!valorTexto || valorTexto.trim() === "") {
            return res.status(400).json({ error: `El campo ${campoTexto} no puede estar vacío` });
        }

        let urlImagen = null;

        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: carpeta },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };
            urlImagen = await uploadToCloudinary();
        }

        await model.updateSeccion(campoTexto, valorTexto.trim(), campoImg, urlImagen, id);

        res.json({
            success: true,
            message: `${campoTexto.charAt(0).toUpperCase() + campoTexto.slice(1)} actualizada correctamente`,
            url: urlImagen
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la sección institucional' });
    }
};