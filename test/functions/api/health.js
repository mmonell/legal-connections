import { json } from '../_shared/rateLimit.js';

export async function onRequestGet() {
  return json({ ok: true });
}
