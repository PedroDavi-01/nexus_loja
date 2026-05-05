import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, nomeProduto } = await req.json();

    const data = await resend.emails.send({
      from: 'Nexus Gaming <onboarding@resend.dev>', // No modo grátis, use esse remetente
      to: [email],
      subject: `Oferta Exclusiva: ${nomeProduto}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #E21E26;">Nexus Gaming</h1>
          <p>Olá! Vimos que você se interessou pelo <strong>${nomeProduto}</strong>.</p>
          <p>Use o cupom <strong>NEXUS10</strong> para ganhar 10% de desconto agora mesmo!</p>
          <br />
          <a href="https://nexus-loja-xi.vercel.app/" style="background: #E21E26; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Aproveitar Oferta</a>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}