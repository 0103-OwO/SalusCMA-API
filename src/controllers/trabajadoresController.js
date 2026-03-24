import * as trabajadorModel from '../models/trabajadoresModel.js';
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
  if (!req.file) {
    return res.status(400).json({ error: 'Debe subir una foto del trabajador' });
  }

  try {
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'salus_cma/trabajadores', 
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

    const result = await uploadToCloudinary();

    const datosNuevoTrabajador = {
      ...req.body,
      foto: result.secure_url
    };

    const nuevo = await trabajadorModel.createTrabajador(datosNuevoTrabajador);

    res.status(201).json({
      success: true,
      message: 'Trabajador registrado correctamente',
      id: nuevo.id_trabajador,
      fotoUrl: result.secure_url
    });

  } catch (error) {
    console.error('Error en el proceso de creación:', error);
    res.status(400).json({
      error: error.message || 'Ocurrió un error al registrar al trabajador'
    });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;
  let datosActualizar = { ...req.body };

  try {
    if (req.file) {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'salus_cma/trabajadores' },
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

export const obtenerMedicosCitas = async (req, res) => {
    try {
        const medicos = await trabajadorModel.getMedicos(); 
        
        if (medicos.length === 0) {
            return res.status(404).json({ message: "No se encontraron médicos con rol activo" });
        }
        res.json(medicos);
    } catch (error) {
        console.error("Error en obtenerMedicosCitas:", error); 
        res.status(500).json({ error: "Error al obtener la lista de médicos" });
    }
};