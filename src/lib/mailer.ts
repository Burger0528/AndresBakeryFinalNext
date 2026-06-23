import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email failures must never block or break registration. The user record is
// already persisted in MongoDB before this runs; a mail error is non-critical
// so we log it and swallow it rather than propagating to the caller.
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject: 'Welcome to Dessert Recipes!',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;">
          <h2 style="margin:0 0 8px;color:#1E1E1E;font-size:22px;">Hi ${name}!</h2>
          <p style="color:#444;line-height:1.6;">We're so glad you joined <strong>Dessert Recipes</strong>.</p>
          <p style="color:#444;line-height:1.6;">Explore our curated collection,Save your favourites and come back any time.</p>
          <p style="color:#888;font-size:13px;margin-top:32px;">Happy baking,<br/>The Dessert Recipes team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[mailer] sendWelcomeEmail failed for', to, err);
  }
}
