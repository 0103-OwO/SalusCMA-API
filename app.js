import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import especialidadRoutes from './src/routes/especialidadesRoute.js';
import citasRoutes from './src/routes/citasRoute.js';
import consultorioRoutes from './src/routes/consultorioRoute.js';
import horariosRoutes from './src/routes/horariosRoutes.js';
import pacientesRoutes from './src/routes/pacientesRoute.js';
import trabajadoresRoutes from './src/routes/trabajadoresRoute.js';
import logoRoutes from './src/routes/logoRoute.js';
import mvvhRoutes from './src/routes/mvvhRoute.js';
import footerRoutes from './src/routes/footerRoute.js';
import publicidadRoutes from './src/routes/publicidadRoute.js';
import contactoRoutes from './src/routes/contactoRoute.js';
import loginRoutes from './src/routes/loginRoute.js';
import usuariosRoutes from './src/routes/usuariosRoute.js';
import rolRoutes from './src/routes/rolRoute.js';
import historialRoutes from './src/routes/historialRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/imagenes', logoRoutes);

app.use('/api/mvvh', mvvhRoutes);

app.use('/api/footer', footerRoutes);

app.use('/api/publicidad', publicidadRoutes);

app.use('/api/login', loginRoutes);

app.use('/api/contacto', contactoRoutes);

app.use('/api/especialidades', especialidadRoutes);

app.use('/api/consultorio', consultorioRoutes);

app.use('/api/trabajadores', trabajadoresRoutes);

app.use('/api/usuarios', usuariosRoutes);

app.use('/api/roles', rolRoutes);

app.use('/api/citas', citasRoutes);

app.use('/api/horarios', horariosRoutes);

app.use('/api/pacientes', pacientesRoutes);

app.use('/api/historial', historialRoutes);


export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () =>
    console.log('Servidor corriendo en el puerto 3000')
  );
}