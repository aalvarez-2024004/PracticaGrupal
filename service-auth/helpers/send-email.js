import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para usar SSL en el puerto 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

export const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter()
  const verificationLink = `http://localhost:5173/verify/${token}`

  await transporter.sendMail({
    from: `"Servicio de Autenticación" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifica tu cuenta',
    html: `
      <h2>Verifica tu cuenta</h2>
      <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
      <br>
      <a href="${verificationLink}">${verificationLink}</a>
    `
  })
}

export const sendResetPasswordEmail = async (email, name, token) => {
  const transporter = createTransporter()
  const resetLink = `http://localhost:5173/reset-password/${token}`

  await transporter.sendMail({
    from: `"Servicio de Autenticación" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Restablece tu contraseña',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto;">
        <h2>Restablecer Contraseña</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <a href="${resetLink}" style="display:inline-block; padding:10px 20px; background:#e8602c; color:#fff; text-decoration:none; border-radius:5px;">
          Restablecer contraseña
        </a>
        <p style="color:#999; font-size:0.85rem; margin-top:20px;">
          Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `
  })
}