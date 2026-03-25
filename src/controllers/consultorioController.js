import * as consultorioModel from '../models/consultorioModel.js';

export const obtenerTodos = async (req, res) => {
  try {
    const datos = await consultorioModel.getAllConsultorios();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener consultorios' });
  }
};

export const obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await consultorioModel.getConsultorioById(id);

    if (!data) return res.status(404).json({ error: 'No existe' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error server' });
  }
};

export const crear = async (req, res) => {
  const { nombre, descripcion, area, piso } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  if (!area || area.trim() === '') {
    return res.status(400).json({ error: 'El área es obligatoria' });
  }
  if (!piso || piso.trim() === '') {
    return res.status(400).json({ error: 'El piso es obligatorio' });
  }

  try {
    const existe = await consultorioModel.verificarDuplicado(nombre);
    if (existe) {
      return res.status(400).json({ error: 'El nombre del consultorio ya existe' });
    }

    const nuevo = await consultorioModel.createConsultorio({ descripcion, nombre, area, piso });
    res.status(201).json({ success: true, message: 'Consultorio agregado correctamente', id: nuevo.id_consultorio });

  } catch (error) {
    res.status(500).json({ error: 'Error al agregar consultorio' });
  }
};

export const actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, area, piso } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  if (!area || area.trim() === '') {
    return res.status(400).json({ error: 'El área es obligatoria' });
  }
  if (!piso || piso.trim() === '') {
    return res.status(400).json({ error: 'El piso es obligatorio' });
  }
  try {
    const existe = await consultorioModel.verificarDuplicado(nombre, id);
    if (existe) {
      return res.status(400).json({ error: 'Ese nombre ya está en uso por otro consultorio' });
    }

    await consultorioModel.updateConsultorio(id, { nombre, descripcion, area, piso });
    res.json({ success: true, message: 'Consultorio actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

export const eliminar = async (req, res) => {
  const { id } = req.params;

  try {
    await consultorioModel.deleteConsultorio(id);

    return res.status(200).json({
      success: true,
      message: 'Consultorio eliminado correctamente'
    });

  } catch (error) {
    console.error("Error en DB:", error.errno, error.sqlMessage);

    if (error.errno === 1644) {
      return res.status(400).json({
        success: false,
        error: error.sqlMessage
      });
    }

    if (error.errno === 1451) {
      return res.status(400).json({
        success: false,
        error: 'No se puede eliminar: este registro está vinculado a otra tabla.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Ocurrió un error inesperado en el servidor.'
    });
  }
};