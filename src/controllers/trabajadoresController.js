import * as trabajadorModel from '../models/trabajadorModel.js';
import cloudinary from '../config/cloudinary.js';

export const listar = async (req, res) => {
  try {
    const trabajadores = await trabajadorModel.getAllTrabajadores();
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener trabajadores' });
  }
};

export const obtenerUno = async (req, res) => {
  try {
    const trabajador = await trabajadorModel.getTrabajadorById(req.params.id);
    if (!trabajador) return res.status(404).json({ error: 'No encontrado' });
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const crear = async (req, res) => {
  // 1. Verificación de imagen obligatoria
  if (!req.file) {
    return res.status(400).json({ error: 'Debe subir una foto del trabajador' });
  }

  try {
    // 2. Función para subir a la carpeta específica en Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'trabajadores', // Carpeta solicitada
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    // Ejecutamos la subida
    const result = await uploadToCloudinary();

    // 3. Preparamos los datos para el Modelo
    // Combinamos el req.body con la URL que nos dio Cloudinary
    const datosNuevoTrabajador = {
      ...req.body,
      foto: result.secure_url
    };

    // 4. Intentamos insertar en la base de datos
    // Aquí es donde saltará el TRIGGER si el RFC, Cédula o Correo están repetidos
    const nuevo = await trabajadorModel.createTrabajador(datosNuevoTrabajador);

    res.status(201).json({
      success: true,
      message: 'Trabajador registrado correctamente',
      id: nuevo.id_trabajador,
      fotoUrl: result.secure_url
    });

  } catch (error) {
    // Log para el desarrollador
    console.error('Error en el proceso de creación:', error);

    // Si el Trigger de MySQL lanza un error, vendrá en error.message
    // Ejemplo: "Error: El RFC ya está registrado"
    res.status(400).json({
      error: error.message || 'Ocurrió un error al registrar al trabajador'
    });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;
  let datosActualizar = { ...req.body };

  try {
    // Si el usuario subió una nueva foto, la procesamos
    if (req.file) {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'trabajadores' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };
      const result = await uploadToCloudinary();
      datosActualizar.foto = result.secure_url;
    }

    // El modelo ejecutará el UPDATE y el Trigger validará los 5 puntos críticos
    await trabajadorModel.updateTrabajador(id, datosActualizar);

    res.json({
      success: true,
      message: 'Datos del trabajador actualizados correctamente'
    });

  } catch (error) {
    res.status(400).json({
      error: error.message || 'Error al actualizar los datos'
    });
  }
};

export const eliminar = async (req, res) => {
  try {
    await trabajadorModel.deleteTrabajador(req.params.id);
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};