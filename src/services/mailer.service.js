import { Resend } from 'resend'; //Permite hablar con la API de resend

const resend = new Resend(process.env.RESEND_API_KEY); //permite enviar todos los emails
const FROM = process.env.EMAIL_FROM;

// Función base privada
// Recibe un objeto con tres propiedades: to (destinatario), subject (asunto), html (cuerpo)
async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject,
      html
    });
    // Si Resend nos devuelve un error, lo mostramos en consola y lanzamos excepción
    if (error) {
      console.error(`[Mailer] Error de Resend → ${error.message}`);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log(`[Mailer] Email enviado → ID: ${data.id}`);
    return data;

  } catch (err) {
    console.error('[Mailer] Error al enviar email:', err.message);
    throw err;
  }
}

// Función pública
// Recibe los datos que viene del formulario: nombre, email y mensaje
export async function emailContacto({ nombre, telefono, email, mensaje }) {
  return sendEmail({
    to: process.env.EMAIL_ADMIN,
    subject: `Nuevo mensaje de contacto — ${nombre}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;padding:20px">
        <h2 style="color:#333">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="background:#f4f4f4;padding:12px;border-radius:6px">${mensaje}</p>
      </div>
    `
  });
}

export async function emailRecuperacion({ email, nombre, link }) {
  return sendEmail({
    to: email,
    subject: "Restablecer tu contraseña — Salus CMA",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;padding:20px;border:1px solid #eee;border-radius:10px">
        <h2 style="color:#333">Hola, ${nombre}</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
        <div style="text-align:center;margin:30px 0">
          <a href="${link}" style="background-color:#007bff;color:white;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:bold">Restablecer Contraseña</a>
        </div>
        <p style="font-size:12px;color:#777">Este enlace expirará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `
  });
}