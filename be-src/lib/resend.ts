import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRecoveryPasswordEmail({ email, token }) {
  return resend.emails.send({
    from: "Pet Finder <contacto@alejoiglesias.dev>",
    to: email,
    subject: "Recuperación de contraseña",
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Hemos recibido una solicitud para restablecer la contraseña asociada a esta dirección de correo electrónico.</p>
      <p>Para continuar con el proceso de recuperación, por favor haga clic en el siguiente enlace:</p>
      <a href="${process.env.BASE_URL}/reset-password?token=${token}">Recuperar Contraseña</a>
      <p>Si usted no realizó esta solicitud, puede ignorar este correo y su cuenta permanecerá segura.</p>
      <p>¡Gracias!</p>
    `,
  });
}

export async function sendReportEmail({ name, phone, message, email }) {
  return resend.emails.send({
    from: "Pet Finder <contacto@alejoiglesias.dev>",
    to: email,
    subject: "Reporte de mascota perdida",
    html: `
        <h1>Reporte de mascota perdida</h1>
        <p>Hemos recibido un reporte de mascota perdida.</p>
        <p>Nombre: ${name}</p>
        <p>Teléfono: ${phone}</p>
        <p>Mensaje: ${message}</p>`,
  });
}
