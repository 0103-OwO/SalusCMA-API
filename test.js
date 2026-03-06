import {
  getAllEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
} from './src/models/especialidadesModel.js';

const runTest = async () => {
  try {
    console.log('--- CREANDO ESPECIALIDAD ---');
    const nueva = await createEspecialidad({ especialidad: 'UwU' });
    console.log('Creada:', nueva);

    console.log('\n--- VERIFICANDO ESPECIALIDAD POR ID ---');
    const verCreada = await getEspecialidadById(nueva.id_especialidad);
    console.log('Registro:', verCreada);

    console.log('\n--- ACTUALIZANDO ESPECIALIDAD ---');
    const actualizada = await updateEspecialidad(nueva.id_especialidad, { especialidad: 'UwU v2' });
    console.log('Actualizada:', actualizada);

    console.log('\n--- VERIFICANDO ESPECIALIDAD ACTUALIZADA ---');
    const verActualizada = await getEspecialidadById(nueva.id_especialidad);
    console.log('Registro:', verActualizada);

    console.log('\n--- ELIMINANDO ESPECIALIDAD ---');
    const eliminada = await deleteEspecialidad(nueva.id_especialidad);
    console.log(eliminada);

    console.log('\n--- VERIFICANDO LISTA FINAL ---');
    const listaFinal = await getAllEspecialidades();
    console.log(listaFinal);

  } catch (error) {
    console.error('Error en prueba:', error.message);
  }
};

runTest();