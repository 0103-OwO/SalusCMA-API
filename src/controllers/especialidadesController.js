import * as especialidadModel from '../models/especialidadesModel.js';

// Controladores para manejar las solicitudes relacionadas con especialidades
export const obtenerTodas = async (req, res) => {
  try {
    const especialidades = await especialidadModel.getAllEspecialidades();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};

//Busca una especialidad por su ID, si no se encuentra devuelve un error 404. Si ocurre un error en la consulta, devuelve un error 500.
export const obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await especialidadModel.getEspecialidadById(id);

    if (!data) return res.status(404).json({ error: 'No existe' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error server' });
  }
};

//Crea las especialidades, se valida que no exista una con el mismo nombre para evitar duplicados. El nombre de la especialidad es obligatorio.
export const crear = async (req, res) => {
  const { especialidad } = req.body;

  if (!especialidad) {
    return res.status(400).json({ error: 'El nombre de la especialidad es obligatorio' });
  }

  try {
    const existeDuplicado = await especialidadModel.checkDuplicateName(especialidad, 0);

    if (existeDuplicado) {
      return res.status(400).json({
        error: 'No puedes usar ese nombre porque ya pertenece a otra especialidad'
      });
    }

    const nueva = await especialidadModel.createEspecialidad({ especialidad });
    res.status(201).json({ success: true, data: nueva });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la especialidad' });
  }
};

// Es para actualizar el nombre de la especialidad, se valida que el nuevo nombre no exista en otra especialidad para evitar duplicados. El nombre de la especialidad es obligatorio.
export const actualizar = async (req, res) => {
  const { id } = req.params;
  const { especialidad } = req.body;

  if (!especialidad) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    const existeDuplicado = await especialidadModel.checkDuplicateName(especialidad, id);

    if (existeDuplicado) {
      return res.status(400).json({
        error: 'No puedes usar ese nombre porque ya pertenece a otra especialidad'
      });
    }
    const actualizada = await especialidadModel.updateEspecialidad(id, { especialidad });

    res.json({
      success: true,
      message: 'Especialidad actualizada correctamente',
      data: actualizada
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la especialidad' });
  }
};

export const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    await especialidadModel.deleteEspecialidad(id);
    res.json({ success: true, message: 'Especialidad eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};