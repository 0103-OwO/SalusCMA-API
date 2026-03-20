import axios from 'axios';

const verifyTurnstile = async (req, res, next) => {
  try {
    //Extraer el token del body
    const token = req.body['cf-turnstile-response'];

    //Si no hay token → bloquear
    if (!token || token.trim() === '') {
      return res.status(400).json({
        ok:      false,
        message: 'Token de seguridad no recibido. Por favor recarga la página.'
      });
    }

    //Verificar con la API de Cloudflare
    //Axios es como fetch pero mas "moderno" y era mas facil de implementar ya que la conversion de JSON se hace automaticamente
    const cfResponse = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      new URLSearchParams({
        secret:   process.env.CF_TURNSTILE_SECRET,
        response: token,
        remoteip: req.ip
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    //Evaluar respuesta de Cloudflare
    const { success, 'error-codes': errorCodes, hostname } = cfResponse.data;

    //Si falló → bloquear
    if (!success) {
      console.warn(`[Turnstile] Fallido. Errores: ${(errorCodes || []).join(', ')} | IP: ${req.ip}`);
      return res.status(403).json({
        ok:      false,
        message: 'Verificación de seguridad fallida. Por favor intenta de nuevo.'
      });
    }

    //En producción: verificar que el token venga de tu dominio
    if (process.env.NODE_ENV === 'production') {
      const dominioEsperado = 'tudominio.com'; //Se cambia en clpudflare por el dominio real
      if (hostname !== dominioEsperado) {
        console.warn(`[Turnstile] Hostname sospechoso: ${hostname}`);
        return res.status(403).json({ ok: false, message: 'Origen no autorizado.' });
      }
    }

    //Todo válido → continuar al controlador
    next();

  } catch (error) {
    console.error('[Turnstile] Error al contactar Cloudflare:', error.message);
    return res.status(500).json({
      ok:      false,
      message: 'Error interno al verificar seguridad. Inténtalo más tarde.'
    });
  }
};

export { verifyTurnstile };