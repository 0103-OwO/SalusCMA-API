import express from 'express';
import cors from 'cors';
import especialidadRoutes from './src/routes/especialidadesRoute.js';
import citasRoutes from './src/routes/citasRoute.js';
import consultorioRoutes from './src/routes/consultorioRoute.js';
import horariosRoutes from './src/routes/horariosRoutes.js';
import pacientesRoutes from './src/routes/pacientesRoute.js';
import trabajadoresRoutes from './src/routes/trabajadoresRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/especialidades', especialidadRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/consultorio', consultorioRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/trabajadores', trabajadoresRoutes);

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () =>
    console.log('Servidor corriendo en el puerto 3000')
  );
}