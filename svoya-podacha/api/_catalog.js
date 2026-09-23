// Каталог партнёрской кофейни. Модель обязана собирать напиток только из этих позиций.
// В продакшене это уезжает в базу, и каждая кофейня ведёт свой список с остатками.
//
// kcal/prot/fat/carb — на порцию позиции, как в меню сети: гость видит те же
// четыре цифры, что на любой карточке напитка.

export const VOLUMES = [
  { ml: 250, price: 170, kcal: 90,  caff: 80,  prot: 4.6,  fat: 3.4, carb: 9.5  },
  { ml: 400, price: 210, kcal: 140, caff: 120, prot: 7.2,  fat: 5.3, carb: 14.8 },
  { ml: 600, price: 250, kcal: 200, caff: 165, prot: 10.2, fat: 7.6, carb: 21.0 }
];

export const SERVES = {
  togo:    { id: "togo",    name: "Навынос", vessel: "бумажный стакан с держателем", price: 0,  cold: false },
  ceramic: { id: "ceramic", name: "В зале",  vessel: "керамическая чашка на блюдце", price: 30, cold: false },
  iced:    { id: "iced",    name: "На льду", vessel: "стеклянный бокал со льдом",    price: 50, cold: true  }
};

// Основа входит в цену объёма и не выключается.
export const BASE = {
  hot:  [{ id: "espresso", name: "Эспрессо двойной" }, { id: "milk", name: "Молоко 3.2%" }],
  cold: [{ id: "coldbrew", name: "Колд брю" },         { id: "ice",  name: "Лёд и вода"  }]
};

export const CATALOG = [
  { id: "cherry",    name: "Вишнёвый сироп",     price: 60, kcal: 60,  caff: 0,  sweet: 2, prot: 0,   fat: 0,   carb: 15.0, color: "#B3153C", note: "кислая ягодная вспышка, красит напиток" },
  { id: "raspberry", name: "Малиновая пудра",    price: 60, kcal: 20,  caff: 0,  sweet: 1, prot: 0.2, fat: 0,   carb: 4.6,  color: "#E86A7C", note: "розовый тон и лёгкая кислота" },
  { id: "blueberry", name: "Черничный сироп",    price: 70, kcal: 65,  caff: 0,  sweet: 2, prot: 0,   fat: 0,   carb: 16.0, color: "#3B3BA8", note: "глубокий синий цвет, ягодная глубина" },
  { id: "darkchoc",  name: "Тёмный шоколад",     price: 70, kcal: 90,  caff: 10, sweet: 1, prot: 1.2, fat: 5.4, carb: 8.5,  color: "#3B2116", note: "плотный корпус и горечь" },
  { id: "whitechoc", name: "Белый шоколад",      price: 70, kcal: 110, caff: 0,  sweet: 3, prot: 1.4, fat: 6.2, carb: 12.0, color: "#EFDFC8", note: "кремовая сладкая база" },
  { id: "caramel",   name: "Солёная карамель",   price: 50, kcal: 80,  caff: 0,  sweet: 2, prot: 0.3, fat: 2.1, carb: 14.0, color: "#C98A3A", note: "солёный акцент в финале" },
  { id: "molasses",  name: "Патока",             price: 60, kcal: 85,  caff: 0,  sweet: 3, prot: 0,   fat: 0,   carb: 21.0, color: "#43281A", note: "тёмная густая сладость" },
  { id: "honey",     name: "Мёд",                price: 50, kcal: 70,  caff: 0,  sweet: 3, prot: 0.1, fat: 0,   carb: 17.0, color: "#E0B34A", note: "мягкая сладость вместо сахара" },
  { id: "vanilla",   name: "Ваниль",             price: 45, kcal: 40,  caff: 0,  sweet: 2, prot: 0,   fat: 0,   carb: 9.8,  color: "#EBD9B4", note: "округляет вкус, убирает резкость" },
  { id: "lychee",    name: "Сироп личи",         price: 65, kcal: 70,  caff: 0,  sweet: 3, prot: 0,   fat: 0,   carb: 17.5, color: "#E2568D", note: "цветочный тон, розовая пенка" },
  { id: "lavender",  name: "Лаванда",            price: 65, kcal: 10,  caff: 0,  sweet: 1, prot: 0,   fat: 0,   carb: 2.4,  color: "#7B5BD6", note: "фиолетовый край и аромат" },
  { id: "matcha",    name: "Матча",              price: 90, kcal: 20,  caff: 35, sweet: 0, prot: 1.4, fat: 0.4, carb: 2.2,  color: "#17C6A3", note: "травяная база, плюс кофеин" },
  { id: "mint",      name: "Мята",               price: 45, kcal: 5,   caff: 0,  sweet: 0, prot: 0.1, fat: 0,   carb: 1.0,  color: "#4FA86B", note: "холодная свежесть в конце" },
  { id: "orange",    name: "Апельсиновая цедра", price: 45, kcal: 10,  caff: 0,  sweet: 0, prot: 0.2, fat: 0,   carb: 2.2,  color: "#E2731B", note: "горький цитрусовый хвост" },
  { id: "lime",      name: "Лайм",               price: 45, kcal: 10,  caff: 0,  sweet: 0, prot: 0.1, fat: 0,   carb: 2.4,  color: "#C8D94A", note: "короткий кислый финал" },
  { id: "cinnamon",  name: "Корица и бадьян",    price: 45, kcal: 10,  caff: 0,  sweet: 0, prot: 0.2, fat: 0.2, carb: 2.0,  color: "#8A5A32", note: "пряный сухой аромат" },
  { id: "ginger",    name: "Имбирь",             price: 55, kcal: 15,  caff: 0,  sweet: 0, prot: 0.1, fat: 0,   carb: 3.4,  color: "#D8A855", note: "согревающая острота" },
  { id: "coconut",   name: "Кокосовое молоко",   price: 75, kcal: 95,  caff: 0,  sweet: 2, prot: 0.9, fat: 9.2, carb: 2.6,  color: "#EFE3CB", note: "песочный слой, мягкая текстура" },
  { id: "nut",       name: "Ореховая паста",     price: 70, kcal: 110, caff: 0,  sweet: 1, prot: 3.6, fat: 9.4, carb: 3.2,  color: "#9C7346", note: "густая ореховая текстура" },
  { id: "seasalt",   name: "Морская соль",       price: 40, kcal: 0,   caff: 0,  sweet: 0, prot: 0,   fat: 0,   carb: 0,    color: "#DCE9EF", note: "удлиняет послевкусие" },
  { id: "smoke",     name: "Дымный лапсанг",     price: 70, kcal: 5,   caff: 15, sweet: 0, prot: 0,   fat: 0,   carb: 0.8,  color: "#4A3A2A", note: "запах костра" },
  { id: "shot2",     name: "Дополнительный шот", price: 70, kcal: 5,   caff: 70, sweet: 0, prot: 0.3, fat: 0.1, carb: 0.6,  color: "#2B170E", note: "плюс 70 мг кофеина" },
  { id: "oatmilk",   name: "Овсяное молоко",     price: 60, kcal: 40,  caff: 0,  sweet: 1, prot: 1.1, fat: 1.4, carb: 5.8,  color: "#E6D9C2", note: "замена коровьего молока" },
  { id: "gold",      name: "Съедобная пудра",    price: 90, kcal: 20,  caff: 0,  sweet: 1, prot: 0,   fat: 0,   carb: 5.0,  color: "#E2B33C", note: "блеск на пенке для фото" },
  { id: "latteart",  name: "Рисунок на пенке",   price: 90, kcal: 0,   caff: 0,  sweet: 0, prot: 0,   fat: 0,   carb: 0,    color: null,      note: "тематический латте-арт, только для горячей подачи" }
];

export const byId = id => CATALOG.find(x => x.id === id) || null;

/** Компактный список для модели: id, название, цена, что даёт. */
export const catalogForModel = () =>
  CATALOG.map(i => `${i.id} | ${i.name} | ${i.price} ₽ | ${i.note}`).join("\n");

const round1 = n => Math.round(n * 10) / 10;

/**
 * Цена считается на сервере, а не берётся из ответа модели.
 * Модель может ошибиться в арифметике, а деньги — не то место, где это допустимо.
 * Здесь же считается и пищевая ценность: те же четыре цифры, что видит гость.
 */
export function priceOf({ volumeMl, serve, ingredientIds }) {
  const vol = VOLUMES.find(v => v.ml === Number(volumeMl)) || VOLUMES[1];
  const srv = SERVES[serve] || SERVES.togo;
  const items = ingredientIds.map(byId).filter(Boolean);
  const sum = k => items.reduce((s, i) => s + (i[k] || 0), 0);
  return {
    total: vol.price + srv.price + sum("price"),
    base: vol.price,
    servePrice: srv.price,
    extras: sum("price"),
    kcal: Math.round(vol.kcal + sum("kcal")),
    caff: Math.round(vol.caff + sum("caff")),
    sweet: Math.min(5, sum("sweet")),
    prot: round1(vol.prot + sum("prot")),
    fat:  round1(vol.fat  + sum("fat")),
    carb: round1(vol.carb + sum("carb"))
  };
}
