// API de Conversões do Facebook (server-side).
// O token NUNCA fica na página: vem da variável de ambiente FB_CAPI_TOKEN,
// configurada no painel da Vercel em Settings > Environment Variables.

const PIXEL_ID = '1673948757736761';
const VERSAO_API = 'v21.0';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Use POST' });
  }

  const token = process.env.FB_CAPI_TOKEN;
  if (!token) {
    // Sem token configurado o site continua normal; só não envia pelo servidor.
    return res.status(200).json({ enviado: false, motivo: 'FB_CAPI_TOKEN não configurado' });
  }

  try {
    const corpo = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const nome = String(corpo.event_name || '').slice(0, 60);
    if (!['PageView', 'InitiateCheckout', 'ViewContent'].includes(nome)) {
      return res.status(400).json({ erro: 'Evento não permitido' });
    }

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ua = req.headers['user-agent'] || '';

    const dadosUsuario = { client_user_agent: ua };
    if (ip) dadosUsuario.client_ip_address = ip;
    if (corpo.fbp) dadosUsuario.fbp = String(corpo.fbp).slice(0, 120);
    if (corpo.fbc) dadosUsuario.fbc = String(corpo.fbc).slice(0, 200);

    const evento = {
      event_name: nome,
      event_time: Math.floor(Date.now() / 1000),
      event_id: String(corpo.event_id || '').slice(0, 80),   // casa com o evento do navegador
      event_source_url: String(corpo.event_source_url || '').slice(0, 500),
      action_source: 'website',
      user_data: dadosUsuario
    };
    if (corpo.value && corpo.currency) {
      evento.custom_data = { value: Number(corpo.value), currency: String(corpo.currency).slice(0, 3) };
    }

    const resposta = await fetch(
      `https://graph.facebook.com/${VERSAO_API}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [evento] })
      }
    );

    const retorno = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      console.error('[CAPI]', resposta.status, retorno);
      return res.status(200).json({ enviado: false });
    }
    return res.status(200).json({ enviado: true, recebidos: retorno.events_received });
  } catch (e) {
    console.error('[CAPI]', e);
    return res.status(200).json({ enviado: false });
  }
}
