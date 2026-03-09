import * as model from '../models/logoModelo.js';
import cloudinary from '../config/cloudinary.js';

export const mostrarLogo = async (req, res) => {
  try {
    const data = await model.getLogo();
    
    if (!data || !data.logo) {
      return res.status(404).json({ error: 'No se encontró un logo configurado' });
    }

    res.json({ logo: data.logo });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el logo: ' + error.message });
  }
};

export const actualizarLogo = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No se seleccionó ninguna imagen' });
  }

  try {

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'salus_cma/branding',
            public_id: 'logo_principal' 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    await model.updateLogoUrl(result.secure_url);

    res.json({
      success: true,
      message: 'Logo institucional actualizado correctamente',
      url: result.secure_url
    });

  } catch (error) {
    console.error('Error en Cloudinary:', error);
    res.status(500).json({ error: 'Error al subir la imagen a la nube' });
  }
};