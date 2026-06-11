// api/enviar-codigo.js
import { Resend } from 'resend';

// A Vercel vai injetar a chave secreta de forma oculta usando esta variável de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Só aceita requisições do tipo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { email, codigo } = req.body;

    if (!email || !codigo) {
        return res.status(400).json({ error: 'E-mail e código são obrigatórios.' });
    }

    try {
        // Dispara o e-mail pelo Resend
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Domínio de testes padrão do Resend
            to: email,
            subject: 'Seu Código de Verificação',
            html: `
                <div style="font-family: sans-serif; text-align: center; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Recuperação de Senha</h2>
                    <p style="color: #666;">Use o código numérico abaixo para redefinir a sua senha no site:</p>
                    <div style="background: #2D4F2B; padding: 15px; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #D28F01; border-radius: 4px; margin: 20px 0;">
                        ${codigo}
                    </div>
                    <p style="font-size: 12px; color: #999;">Se você não solicitou esta alteração, ignore este e-mail.</p>
                </div>
            `,
        });

        return res.status(200).json({ success: true, message: 'E-mail enviado!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}