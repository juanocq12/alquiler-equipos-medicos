import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import equiposRoutes from './routes/equipos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import alquileresRoutes from './routes/alquileres.routes.js';
import { manejadorErrores } from './middlewares/errores.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    nombre: 'Alquiler Equipos Médicos API',
    version: '0.2.0',
    semana: '8',
    estado: 'auth + roles aplicado'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/alquileres', alquileresRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(manejadorErrores);

export default app;
