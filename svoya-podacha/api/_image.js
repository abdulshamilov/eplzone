/**
 * Генерация фото напитка.
 *
 * Провайдер выбирается переменной IMAGE_PROVIDER. Каждый адаптер — десять строк:
 * один запрос и разбор ответа. Провайдеры меняют параметры чаще, чем выходят
 * релизы, поэтому перед запуском сверь тело запроса с документацией своего
 * провайдера — менять придётся только внутри одной функции.
 *
 * Возвращает строку, которую можно положить в src картинки:
 * либо https-ссылку, либо data:image/...;base64,...
 */

const TIMEOUT_MS = 45000;

async function post(url, { headers, body }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 300)}`);
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

/* --- OpenAI Images --- */
async function openai(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Нет OPENAI_API_KEY");
  const data = await post("https://api.openai.com/v1/images/generations", {
    headers: { authorization: `Bearer ${key}` },
    body: { model: "gpt-image-1", prompt, n: 1, size: "1024x1024", quality: "medium" }
  });
  const item = data?.data?.[0];
  if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (item?.url) return item.url;
  throw new Error("Провайдер не вернул изображение");
}

/* --- Replicate --- */
async function replicate(prompt) {
  const key = process.env.REPLICATE_API_TOKEN;
  if (!key) throw new Error("Нет REPLICATE_API_TOKEN");
  const model = process.env.REPLICATE_MODEL || "black-forest-labs/flux-schnell";
  const data = await post(`https://api.replicate.com/v1/models/${model}/predictions`, {
    headers: { authorization: `Bearer ${key}`, prefer: "wait" },
    body: { input: { prompt, aspect_ratio: "1:1", output_format: "webp", output_quality: 90 } }
  });
  const out = data?.output;
  const url = Array.isArray(out) ? out[0] : out;
  if (typeof url === "string") return url;
  throw new Error("Провайдер не вернул изображение");
}

/* --- fal.ai --- */
async function fal(prompt) {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("Нет FAL_KEY");
  const model = process.env.FAL_MODEL || "fal-ai/flux/schnell";
  const data = await post(`https://fal.run/${model}`, {
    headers: { authorization: `Key ${key}` },
    body: { prompt, image_size: "square_hd", num_images: 1 }
  });
  const url = data?.images?.[0]?.url;
  if (url) return url;
  throw new Error("Провайдер не вернул изображение");
}

const PROVIDERS = { openai, replicate, fal };

export async function generateImage(prompt) {
  const name = (process.env.IMAGE_PROVIDER || "openai").toLowerCase();
  const fn = PROVIDERS[name];
  if (!fn) throw new Error(`Неизвестный IMAGE_PROVIDER: ${name}`);
  return fn(prompt);
}

export const imageProviderName = () => (process.env.IMAGE_PROVIDER || "openai").toLowerCase();
