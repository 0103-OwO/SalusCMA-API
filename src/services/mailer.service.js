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