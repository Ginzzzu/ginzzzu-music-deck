// scripts/settings.js
export const MODULE_ID = "ginzzzu-music-deck";

const DEFAULT_PALETTE_COLORS = [
  "#ed2424ff", // 1 — красный
  "#ffb347",   // 2 — оранжевый
  "#2c964aff", // 3 — зелёный
  "#3191afff", // 4 — бирюзовый/синий
  "#5b5bff",   // 5 — синий
  "#b96bff",   // 6 — фиолетовый
  "#d4d4d4ff",   // 7 — почти белый
  "#1e1e1e",   // 8 — тёмно-серый
  "#000000ff"  // 9 — ЧЁРНЫЙ (новый цвет)
];

export function registerMusicDeckSettings() {
   // Сворачивать остальные плейлисты при разворачивании одного
  game.settings.register(MODULE_ID, "collapseOthers", {
    name: game.i18n.localize(`${MODULE_ID}.settings.collapseOthers.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.collapseOthers.hint`),
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  // Обрезать названия избранных плейлистов
  game.settings.register(MODULE_ID, "truncateFavoritePlaylists", {
    name: game.i18n.localize(`${MODULE_ID}.settings.truncateFavoritePlaylists.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.truncateFavoritePlaylists.hint`),
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

    // Поднимать покрашенные плейлисты выше обычных
  game.settings.register(MODULE_ID, "sortColoredPlaylists", {
    name: game.i18n.localize(`${MODULE_ID}.settings.sortColoredPlaylists.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.sortColoredPlaylists.hint`),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
  
  // Размер квадратной кнопки плейлиста
  game.settings.register(MODULE_ID, "playlistButtonSize", {
    name: game.i18n.localize(`${MODULE_ID}.settings.playlistButtonSize.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.playlistButtonSize.hint`),
    scope: "client",
    config: true,
    type: Number,
    default: 80,
    range: { min: 32, max: 200, step: 2 },
    requiresReload: true
  });
  
  // Максимальная ширина разворота кнопок
  game.settings.register(MODULE_ID, "maxExpandWidth", {
    name: game.i18n.localize(`${MODULE_ID}.settings.maxExpandWidth.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.maxExpandWidth.hint`),
    scope: "client",
    config: true,
    type: Number,
    default: 260,
    range: { min: 120, max: 600, step: 10 }
  });

  // Отступ деки сверху (px)
  game.settings.register(MODULE_ID, "deckTopOffset", {
    name: game.i18n.localize(`${MODULE_ID}.settings.deckTopOffset.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.deckTopOffset.hint`),
    scope: "client",
    config: true,
    type: Number,
    default: 10,
    range: { min: 0, max: 300, step: 1 },
    requiresReload: true
  });

  // Отступ деки снизу (%)
  game.settings.register(MODULE_ID, "deckBottomOffset", {
    name: game.i18n.localize(`${MODULE_ID}.settings.deckBottomOffset.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.deckBottomOffset.hint`),
    scope: "client",
    config: true,
    type: Number,
    default: 8,
    range: { min: 0, max: 50, step: 1 },
    requiresReload: true
  });

  // Дополнительный отступ справа (px)
  game.settings.register(MODULE_ID, "deckRightOffset", {
    name: game.i18n.localize(`${MODULE_ID}.settings.deckRightOffset.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.deckRightOffset.hint`),
    scope: "client",
    config: true,
    type: Number,
    default: 0,
    range: { min: 0, max: 300, step: 1 },
    requiresReload: true
  });

    // Маркер для скрытия плейлистов (по началу имени)
  game.settings.register(MODULE_ID, "hidePlaylistMarker", {
    name: game.i18n.localize(`${MODULE_ID}.settings.hidePlaylistMarker.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.hidePlaylistMarker.hint`),
    scope: "client",
    config: true,
    type: String,
    default: "#",
    requiresReload: true,
  });

  // Использовать цвет папки как фон
  game.settings.register(MODULE_ID, "useFolderColor", {
    name: game.i18n.localize(`${MODULE_ID}.settings.useFolderColor.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.useFolderColor.hint`),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  // Цвета в палитре деки
  const hasColorPicker = game.colorPicker?.ColorPickerField;
  const paletteFieldType = hasColorPicker
    ? new game.colorPicker.ColorPickerField({
        format: "hexa",
        alphaChannel: false
      })
    : String;

  DEFAULT_PALETTE_COLORS.forEach((color, index) => {
    const n = index + 1;
    game.settings.register(MODULE_ID, `paletteColor${n}`, {
      name: game.i18n.localize(`${MODULE_ID}.settings.paletteColor${n}.name`),
      hint: game.i18n.localize(`${MODULE_ID}.settings.paletteColor.hint`),
      scope: "client",
      config: true,
      type: paletteFieldType,
      default: color
    });
  });  

  // Остальные настройки без UI можно оставить как есть:
  game.settings.register(MODULE_ID, "favoritePlaylists", {
    name: "Favorite playlists",
    scope: "world",
    config: false,
    type: Object,
    default: []
  });

  game.settings.register(MODULE_ID, "favoriteSounds", {
    name: "Favorite sounds",
    scope: "world",
    config: false,
    type: Object,
    default: []
  });

  game.settings.register(MODULE_ID, "playlistColors", {
    name: "Playlist colors (internal)",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  game.settings.register(MODULE_ID, "favoriteSoundAliases", {
    name: "Favorite sound aliases (internal)",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
}

export function getMusicDeckSettings() {
  return {
    playlistButtonSize: game.settings.get(MODULE_ID, "playlistButtonSize"),
    maxExpandWidth: game.settings.get(MODULE_ID, "maxExpandWidth"),
    useFolderColor: game.settings.get(MODULE_ID, "useFolderColor"),
    collapseOthers: game.settings.get(MODULE_ID, "collapseOthers"),
    truncateFavoritePlaylists: game.settings.get(MODULE_ID, "truncateFavoritePlaylists"),

    deckTopOffset: game.settings.get(MODULE_ID, "deckTopOffset"),
    deckBottomOffset: game.settings.get(MODULE_ID, "deckBottomOffset"),
    deckRightOffset: game.settings.get(MODULE_ID, "deckRightOffset"),
    sortColoredPlaylists: game.settings.get(MODULE_ID, "sortColoredPlaylists"),

    hidePlaylistMarker: game.settings.get(MODULE_ID, "hidePlaylistMarker")
  };
}

// ----- Избранные плейлисты -----

export function getFavoritePlaylists() {
  const value = game.settings.get(MODULE_ID, "favoritePlaylists");
  if (Array.isArray(value)) return value;
  // На всякий случай, если там что-то сломалось
  return [];
}

export async function setFavoritePlaylists(ids) {
  // Убираем дубликаты
  const unique = Array.from(new Set(ids));
  await game.settings.set(MODULE_ID, "favoritePlaylists", unique);
}

// ----- Избранные треки -----

export function getFavoriteSounds() {
  const value = game.settings.get(MODULE_ID, "favoriteSounds");
  if (Array.isArray(value)) {
    // фильтруем странные элементы
    return value.filter(
      (v) => v && typeof v.playlistId === "string" && typeof v.soundId === "string"
    );
  }
  return [];
}

export async function setFavoriteSounds(entries) {
  // entries: массив { playlistId, soundId }
  const norm = entries
    .filter((v) => v && typeof v.playlistId === "string" && typeof v.soundId === "string");

  // дедуп по паре playlistId+soundId
  const seen = new Set();
  const unique = [];
  for (const e of norm) {
    const key = `${e.playlistId}:${e.soundId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ playlistId: e.playlistId, soundId: e.soundId });
  }

  await game.settings.set(MODULE_ID, "favoriteSounds", unique);
}

// ----- Цвета плейлистов ----- //

export function getPlaylistColors() {
  const value = game.settings.get(MODULE_ID, "playlistColors");
  if (value && typeof value === "object") return value;
  return {};
}

export async function setPlaylistColors(colors) {
  // colors: объект { [playlistId]: cssColor }
  const clean = {};
  for (const [id, color] of Object.entries(colors)) {
    if (typeof id !== "string") continue;
    if (typeof color !== "string" || !color.trim()) continue;
    clean[id] = color;
  }
  await game.settings.set(MODULE_ID, "playlistColors", clean);
}

// ----- Алиасы избранных треков -----

export function getFavoriteSoundAliases() {
  const value = game.settings.get(MODULE_ID, "favoriteSoundAliases");
  if (value && typeof value === "object") return value;
  return {};
}

export async function setFavoriteSoundAliases(aliases) {
  const clean = {};
  for (const [key, label] of Object.entries(aliases || {})) {
    if (typeof key !== "string") continue;
    if (typeof label !== "string") continue;
    const trimmed = label.trim();
    if (!trimmed) continue;
    clean[key] = trimmed;
  }
  await game.settings.set(MODULE_ID, "favoriteSoundAliases", clean);
}

// ----- Палитра цветов деки ----- //

export function getPaletteColors() {
  const result = [];
  for (let i = 1; i <= DEFAULT_PALETTE_COLORS.length; i++) {
    const key = `paletteColor${i}`;
    let value;
    try {
      value = game.settings.get(MODULE_ID, key);
    } catch (err) {
      value = null;
    }
    result.push(value || DEFAULT_PALETTE_COLORS[i - 1]);
  }
  return result;
}

