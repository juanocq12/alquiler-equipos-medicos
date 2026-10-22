export function manejadorErrores(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  if (err && err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err?.code === 'P2002') {
    return res.status(409).json({ error: 'El recurso ya existe' });
  }
  if (err?.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  if (err?.code === 'P2003') {
    return res.status(409).json({ error: 'El recurso tiene relaciones asociadas' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}
