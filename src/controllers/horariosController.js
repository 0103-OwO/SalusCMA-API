import * as model from '../models/horariosModel.js';

export const obtenerHorarios = async (req, res) => {
  try {
    const data = await model.getAllHorarios();
    res.json(data || []);
  } catch (error) {
    console.error("Error en obtenerHorarios:", error);
    res.status(500).json({ error: 'Error al obtener los horarios' });
  }
};

export const getHorario = async (req, res) => {
  try {
    const data = await model.getHorarioById(req.params.id);
    if (!data) return res.status(404).json({ msg: "Horario no encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createHorario = async (req, res) => {
  try {
    const datos = req.body;

    const camposHoras = [
      'lunes_ent', 'lunes_sal', 'martes_ent', 'martes_sal',
      'miercoles_ent', 'miercoles_sal', 'jueves_ent', 'jueves_sal',
      'viernes_ent', 'viernes_sal'
    ];

    camposHoras.forEach(campo => {
      if (datos[campo] === "") datos[campo] = null;
    });

    const nuevo = await model.createHorario(datos);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear horario:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateHorario = async (req, res) => {
  try {
    const datos = req.body;

    const camposHoras = [
      'lunes_ent', 'lunes_sal', 'martes_ent', 'martes_sal',
      'miercoles_ent', 'miercoles_sal', 'jueves_ent', 'jueves_sal',
      'viernes_ent', 'viernes_sal'
    ];

    camposHoras.forEach(campo => {
      if (datos[campo] === "") datos[campo] = null;
    });

    const updated = await model.updateHorario(req.params.id, datos);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHorario = async (req, res) => {
  try {
    const result = await model.deleteHorario(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHorarioMedico = async (req, res) => {
  try {
    const id_trabajador = req.usuario.id;

    if (!id_trabajador) {
      return res.status(400).json({ error: "No se encontró el ID del trabajador en el token." });
    }

    const horarios = await model.getHorarioByMedico(id_trabajador);

    if (!horarios || horarios.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(horarios);

  } catch (error) {
    console.error("Error en getHorarioMedico:", error);
    res.status(500).json({ error: "Error interno al obtener el horario laboral." });
  }
};