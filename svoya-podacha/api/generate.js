import { composeDrink } from "./_text.js";
import { generateImage, imageProviderName } from "./_image.js";
import { byId, priceOf, SERVES, BASE } from "./_catalog.js";

/**
 * POST /api/generate
 * Вход:  { wish: string, min: number, max: number }
 * Выход: { name, tagline, story, serve, volumeMl, ingredients[], price, stats, image, ... }
 *
 * Ключи живут только здесь. В браузер не уходит ни один.
 */

const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map(); // best effort: память живёт, пока жив инстанс функции

function rateLimited(ip) {
  const limit = Number(process.env.RATE_LIMIT_PER_HOUR || 20);
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(ip, { start: now, n: 1 });
    return false;
  }
  rec.n += 1;
  return rec.n > limit;
}

const clean = s => String(s || "").replace(/\s+/g, " ").trim().slice(0, 200);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Только POST" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Слишком много запросов. Попробуй через час." });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  const wish = clean(body?.wish);
  const min = Math.max(150, Math.min(2000, Number(body?.min) || 300));
  const max = Math.max(min + 50, Math.min(3000, Number(body?.max) || 700));
  if (!wish) return res.status(400).json({ error: "Пустое пожелание" });

  const started = Date.now();

  try {
    const drink = await composeDrink({ wish, min, max });

    // Оставляем только то, что реально есть в каталоге, и считаем цену сами.
    const ids = [...new Set(drink.ingredient_ids)].filter(id => byId(id));
    const cold = SERVES[drink.serve]?.cold ?? false;
    const usable = cold ? ids.filter(id => id !== "latteart") : ids;

    const price = priceOf({ volumeMl: drink.volume_ml, serve: drink.serve, ingredientIds: usable });
    const dropped = ids.length - usable.length + (drink.ingredient_ids.length - ids.length);

    const payload = {
      wish,
      name: drink.name,
      tagline: drink.tagline,
      story: drink.story,
      serve: drink.serve,
      serveName: SERVES[drink.serve]?.name ?? "Навынос",
      vessel: SERVES[drink.serve]?.vessel ?? "",
      cold,
      volumeMl: drink.volume_ml,
      latteArt: cold ? "" : drink.latte_art,
      base: (cold ? BASE.cold : BASE.hot).map(b => b.name),
      ingredients: usable.map(id => {
        const i = byId(id);
        return { id: i.id, name: i.name, price: i.price, note: i.note, color: i.color };
      }),
      price: price.total,
      stats: { kcal: price.kcal, caff: price.caff, sweet: price.sweet },
      budget: { min, max },
      overBudget: price.total > max,
      dropped,
      imagePrompt: drink.image_prompt,
      provider: imageProviderName(),
      usage: drink.usage
    };

    // Картинка — отдельная точка отказа. Если провайдер упал,
    // отдаём напиток без фото: текст и цена важнее картинки.
    try {
      payload.image = await generateImage(drink.image_prompt);
    } catch (e) {
      payload.image = null;
      payload.imageError = String(e.message || e).slice(0, 200);
    }

    payload.ms = Date.now() - started;
    res.setHeader("cache-control", "no-store");
    return res.status(200).json(payload);
  } catch (e) {
    console.error("generate failed:", e);
    return res.status(502).json({ error: "Не удалось собрать напиток", detail: String(e.message || e).slice(0, 300) });
  }
}
