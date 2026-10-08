import { COMPANY } from '../src/data.js';
import { validateInquiry, inquiryBodyByteLimit } from '../src/inquiry-validation.js';

const limits = new Map();
const windowMs = 10 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ available: true, provider: 'formsubmit' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ error: 'JSON required' });
  if (Number(req.headers['content-length'] || 0) > inquiryBodyByteLimit) return res.status(413).json({ error: 'Request too large' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body; }
  catch { return res.status(400).json({ error: 'Invalid request' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid request' });
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > inquiryBodyByteLimit) return res.status(413).json({ error: 'Request too large' });
  if (body.website) return res.status(200).json({ ok: false });

  const zh = body.language === 'zh';
  const { values, errors } = validateInquiry(body);
  if (Object.keys(errors).length) return res.status(400).json({ error: zh ? '请检查标出的填写项。' : 'Please review the highlighted fields.', fields: errors });
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  for (const [key, entry] of limits) if (now - entry.start > windowMs) limits.delete(key);
  const entry = limits.get(ip);
  if (entry?.count >= 5) { res.setHeader('Retry-After', '600'); return res.status(429).json({ error: zh ? '提交次数较多，请稍后重试。' : 'Please try again later.' }); }
  limits.set(ip, entry ? { ...entry, count: entry.count + 1 } : { start: now, count: 1 });
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${COMPANY.email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: 'https://stardotsbags.com', Referer: 'https://stardotsbags.com/contact' },
      body: JSON.stringify({ ...values, email: values.email, _replyto: values.email,
        _subject: `STARDOTS bag inquiry — ${values.company.replace(/[\r\n]/g, ' ')}`,
        _template: 'table', _url: 'https://stardotsbags.com/contact',
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Email service returned ${response.status}`);
    const provider = await response.json();
    if (/activat|confirm.{0,30}(email|form)|check.{0,30}inbox/i.test(String(provider.message || ''))) {
      return res.status(503).json({ error: zh ? '在线发送正在等待收件邮箱激活。请使用邮件或 WhatsApp 联系，本次询盘尚未确认送达。' : 'Online sending is awaiting mailbox activation. Please use email or WhatsApp; your inquiry has not been confirmed.' });
    }
    if (provider.success !== true && provider.success !== 'true') {
      return res.status(502).json({ error: zh ? '邮件服务未接受本次询盘，请使用邮件或 WhatsApp 联系。' : 'The email service did not accept your inquiry. Please use email or WhatsApp.' });
    }
    return res.status(202).json({ accepted: true, notification: 'provider-accepted' });
  } catch (error) {
    console.error('Inquiry delivery failed:', error.message);
    return res.status(502).json({ error: zh ? '本次询盘发送失败，请使用邮件或 WhatsApp 联系。' : 'We could not deliver your inquiry. Please use email or WhatsApp.' });
  }
}
