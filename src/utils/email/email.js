import nodemailer from'nodemailer'

export const sendEmail = async ({ to, subject, html , attachments =[] }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.USER_PASS
        }
    })
    await transporter.sendMail({
        to,
        from: `"<e-commerce 😁>" ${ process.env.EMAIL_USER}`,
        subject,
        html,
        attachments,
    })
}