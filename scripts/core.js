// scripts/core.js
import {
  MODULE_ID,
  registerMusicDeckSettings,
  getMusicDeckSettings,
  getFavoritePlaylists,
  setFavoritePlaylists,
  getFavoriteSounds,
  setFavoriteSounds,
  getPlaylistColors,
  setPlaylistColors,
  getPaletteColors,
  getFavoriteSoundAliases,
  setFavoriteSoundAliases
} from "./settings.js";

class GinzzzuMusicDeck {
  static instance = null;

    _loc(key) {
    return game.i18n.localize(`${MODULE_ID}.${key}`);
  }

  _untitled() {
    return this._loc("ui.untitled");
  }

  _untitledPlaylist() {
    return this._loc("ui.untitledPlaylist");
  }

  constructor() {
    this.settings = getMusicDeckSettings();
    this._expandedPlaylists = new Set(); // id плейлистов, которые сейчас развёрнуты
    this._container = null;
    this._sidebarObserver = null;

    this._colorPickerEl = null;
    this._colorPickerCloseHandler = null;

    this._searchQuery = "";

    this._volumeSliderEl = null;
    this._volumeSliderCloseHandler = null;

    this._suppressSoundChangeRender = false;   

    this._onPlaylistChange = this._onPlaylistChange.bind(this);
    this._onPlaylistSoundChange = this._onPlaylistSoundChange.bind(this);
    this._onSettingsChanged = this._onSettingsChanged.bind(this);

    this._initDOM();
    this._observeSidebar();
    this._registerHooks();
  }
  

  _playFavoriteAnimation(headerEl, willBeFavorite) {
    const cls = willBeFavorite
      ? "gmusicdeck-fav-anim-up"
      : "gmusicdeck-fav-anim-down";

    headerEl.classList.remove("gmusicdeck-fav-anim-up", "gmusicdeck-fav-anim-down");
    void headerEl.offsetWidth; // форсим перезапуск анимации

    headerEl.classList.add(cls);
    headerEl.addEventListener(
      "animationend",
      () => headerEl.classList.remove(cls),
      { once: true }
    );
  }

  /* ---------- Палитра цвета плейлиста ---------- */

    _openPlaylistColorPicker(playlist, headerEl, event) {
    this._closeColorPicker(); // закрыть, если была

    const picker = document.createElement("div");
    picker.classList.add("gmusicdeck-color-picker");

    // Чтобы клики по палитре не считались кликами "снаружи"
    picker.addEventListener("mousedown", (ev) => {
      ev.stopPropagation();
    });

    // Пресеты цветов из настроек
    const paletteColors = getPaletteColors();
    for (const color of paletteColors) {
      if (!color) continue;

      const swatch = document.createElement("div");
      swatch.classList.add("gmusicdeck-color-swatch");
      swatch.style.backgroundColor = color;

      swatch.addEventListener("click", async () => {
        await this._applyPlaylistColor(playlist.id, color);
        this._closeColorPicker();
      });

      picker.appendChild(swatch);
    }

    // Квадрат "убрать цвет этого плейлиста"
    const clearSwatch = document.createElement("div");
    clearSwatch.classList.add(
      "gmusicdeck-color-swatch",
      "gmusicdeck-color-swatch-clear"
    );
    clearSwatch.title = game.i18n.localize(`${MODULE_ID}.ui.colorPickerClearOne`);

    clearSwatch.addEventListener("click", async () => {
      await this._applyPlaylistColor(playlist.id, null);
      this._closeColorPicker();
    });

    picker.appendChild(clearSwatch);

    // Текстовая кнопка "Сбросить все цвета"
    const clearBtn = document.createElement("div");
    clearBtn.classList.add("gmusicdeck-color-clear");
    clearBtn.textContent = game.i18n.localize(`${MODULE_ID}.ui.colorPickerClearAll`);

    clearBtn.addEventListener("click", async () => {
      await this._resetAllPlaylistColors();
      this._closeColorPicker();
    });

    picker.appendChild(clearBtn);

    document.body.appendChild(picker);
    this._colorPickerEl = picker;

    // Позиционируем рядом с заголовком / курсором
    const rect = headerEl.getBoundingClientRect();
    const pickerRect = picker.getBoundingClientRect();

    let top = rect.top;
    let left = rect.left - pickerRect.width - 8; // слева от кнопки

    if (left < 0) {
      left = rect.right + 8; // если не влезает слева — ставим справа
    }
    if (top + pickerRect.height > window.innerHeight) {
      top = Math.max(0, window.innerHeight - pickerRect.height - 8);
    }

    picker.style.top = `${top}px`;
    picker.style.left = `${left}px`;

    this._colorPickerCloseHandler = (ev) => {
      if (!this._colorPickerEl) return;
      if (!this._colorPickerEl.contains(ev.target)) {
        this._closeColorPicker();
      }
    };

    document.addEventListener("mousedown", this._colorPickerCloseHandler, true);
  }

  _closeColorPicker() {
    if (this._colorPickerEl?.parentElement) {
      this._colorPickerEl.parentElement.removeChild(this._colorPickerEl);
    }
    this._colorPickerEl = null;

    if (this._colorPickerCloseHandler) {
      document.removeEventListener("mousedown", this._colorPickerCloseHandler, true);
      this._colorPickerCloseHandler = null;
    }
  }

  async _applyPlaylistColor(playlistId, color) {
    try {
      const current = getPlaylistColors();
      const updated = { ...current };

      if (color === null) {
        // сброс цвета
        delete updated[playlistId];
      } else {
        updated[playlistId] = color;
      }

      await setPlaylistColors(updated);
      this.render();
    } catch (err) {
      console.error(`${MODULE_ID} | Ошибка установки цвета плейлиста`, err);
    }
  }

  async _resetAllPlaylistColors() {
    try {
      await setPlaylistColors({});
      this.render();
    } catch (err) {
      console.error(`${MODULE_ID} | Ошибка сброса всех цветов плейлистов`, err);
    }
  }

  /* ---------- Ползунок громкости трека ---------- */

  _openVolumeSlider(playlist, sound, soundEl) {
    // закрыть предыдущий, если был
    this._closeVolumeSlider();

    // Пока открыт слайдер громкости — не перерисовываем деку на updatePlaylistSound
    this._suppressSoundChangeRender = true;

    const wrapper = document.createElement("div");
    wrapper.classList.add("gmusicdeck-volume-slider-wrapper");

    const slider = document.createElement("input");
    slider.type = "range";
    slider.classList.add("gmusicdeck-volume-slider");
    slider.min = "0";
    slider.max = "100";
    slider.step = "1";

    const currentVolume =
      typeof sound.volume === "number" ? sound.volume : 0.5; // Foundry хранит 0..1
    slider.value = String(Math.round(currentVolume * 100));

    wrapper.appendChild(slider);
    soundEl.appendChild(wrapper);

    // чтобы клики по самому слайдеру не считались "кликом вне"
    wrapper.addEventListener("mousedown", (ev) => ev.stopPropagation());
    slider.addEventListener("mousedown", (ev) => ev.stopPropagation());
    wrapper.addEventListener("click", (ev) => ev.stopPropagation());
    slider.addEventListener("click", (ev) => ev.stopPropagation());    

    // обновляем громкость трека по мере движения ползунка
    slider.addEventListener("input", async (ev) => {
      const value = Number(ev.target.value);
      const volume = Math.clamped
        ? Math.clamped(value / 100, 0, 1)
        : Math.max(0, Math.min(1, value / 100));

      try {
        await playlist.updateEmbeddedDocuments("PlaylistSound", [
          { _id: sound.id, volume }
        ]);
      } catch (err) {
        console.error(`${MODULE_ID} | Ошибка изменения громкости трека`, err);
      }
    });

    this._volumeSliderEl = wrapper;

    // клик вне слайдера — закрыть
    this._volumeSliderCloseHandler = (ev) => {
      if (!this._volumeSliderEl) return;
      if (this._volumeSliderEl.contains(ev.target)) return;
      this._closeVolumeSlider();
    };
    // слушаем в bubbling-фазе, чтобы stopPropagation на слайдере работал
    document.addEventListener("mousedown", this._volumeSliderCloseHandler);
  }

  _closeVolumeSlider() {
    if (this._volumeSliderEl?.parentElement) {
      this._volumeSliderEl.parentElement.removeChild(this._volumeSliderEl);
    }
    this._volumeSliderEl = null;

    if (this._volumeSliderCloseHandler) {
      document.removeEventListener("mousedown", this._volumeSliderCloseHandler);
      this._volumeSliderCloseHandler = null;
    }

    // 🎚 после закрытия снова разрешаем рендеры по updatePlaylistSound
    this._suppressSoundChangeRender = false;
  }

  /* ---------- Публичный метод: полный рендер ---------- */

  render() {
    if (!this._container) return;

    // если был открыт ползунок громкости — закрываем перед перерисовкой
    this._closeVolumeSlider();

    const {
      playlistButtonSize,
      useFolderColor,
      collapseOthers,
      maxExpandWidth,
      truncateFavoritePlaylists
    } = this.settings;


    // Размер квадратной кнопки плейлиста
    this._container.style.setProperty("--gmusicdeck-playlist-size", `${playlistButtonSize}px`);

    // Максимальная ширина разворота
    this._container.style.setProperty("--gmusicdeck-max-width", `${maxExpandWidth}px`);

    // Отступ сверху
    this._container.style.setProperty("--ginzzzu-music-top-offset",`${this.settings.deckTopOffset ?? 10}px`);

    // Отступ снизу
    this._container.style.setProperty("--ginzzzu-music-bottom-offset",`${this.settings.deckBottomOffset ?? 8}%`);

    // Отступ справа
    this._container.style.setProperty("--ginzzzu-music-right-offset",`${this.settings.deckRightOffset ?? 0}px`);

    const inner = this._container.querySelector(".ginzzzu-music-deck-inner");
    if (!inner) return;

    // --- сохраняем фокус и позицию каретки в строке поиска перед перерисовкой ---
    const prevSearchInput = inner.querySelector(".gmusicdeck-search-input");
    let searchHadFocus = false;
    let searchSelStart = null;
    let searchSelEnd = null;

    if (prevSearchInput) {
      searchHadFocus = (document.activeElement === prevSearchInput);
      if (searchHadFocus) {
        try {
          searchSelStart = prevSearchInput.selectionStart;
          searchSelEnd = prevSearchInput.selectionEnd;
        } catch (e) {
          // на всякий случай, если браузер не даёт прочитать выделение
          searchSelStart = searchSelEnd = prevSearchInput.value?.length ?? 0;
        }
      }
    }

    inner.innerHTML = "";

    // Поисковая строка
    const searchWrapper = document.createElement("div");
    searchWrapper.classList.add("gmusicdeck-search");

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("gmusicdeck-search-input");
    searchInput.placeholder = game.i18n.localize(`${MODULE_ID}.ui.searchPlaceholder`);

    // восстанавливаем текущее значение при перерисовке
    searchInput.value = this._searchQuery || "";

    searchInput.addEventListener("input", (event) => {
      this._searchQuery = event.target.value;
      this.render();
    });

    searchWrapper.appendChild(searchInput);
    inner.appendChild(searchWrapper);

    // --- восстанавливаем фокус и каретку, если оно было ---
    if (searchHadFocus) {
      searchInput.focus();
      if (searchSelStart !== null && searchSelEnd !== null) {
        try {
          searchInput.setSelectionRange(searchSelStart, searchSelEnd);
        } catch (e) {
          // если вдруг не получится — просто поставим каретку в конец
          const len = searchInput.value.length;
          searchInput.setSelectionRange(len, len);
        }
      }
    }

    const searchQuery = (this._searchQuery || "").trim().toLowerCase();
    const hasSearch = searchQuery.length > 0;

    const allPlaylists = game.playlists?.contents ?? [];

    // Цвета плейлистов: { [playlistId]: color }
    const playlistColors = getPlaylistColors();


        // --- ИЗБРАННЫЕ ТРЕКИ ---

    const favoriteSoundEntriesRaw = getFavoriteSounds();
    const playlistById = new Map(allPlaylists.map((p) => [p.id, p]));
    const favoriteSoundEntries = [];
    const favoriteSoundKeySet = new Set();

    for (const entry of favoriteSoundEntriesRaw) {
      const pl = playlistById.get(entry.playlistId);
      if (!pl) continue;
      const sound = (pl.sounds?.contents ?? []).find((s) => s.id === entry.soundId);
      if (!sound) continue;

      favoriteSoundEntries.push({ playlist: pl, sound });
      favoriteSoundKeySet.add(`${pl.id}:${sound.id}`);
    }

    // Алиасы для избранных треков
    const favoriteAliases = getFavoriteSoundAliases();

    // Сортируем избранные треки: по названию плейлиста, затем по названию трека
    if (favoriteSoundEntries.length > 0) {
      const collator = new Intl.Collator(game.i18n.lang ?? "en", { sensitivity: "base" });
      favoriteSoundEntries.sort((a, b) => {
        const byPl = collator.compare(a.playlist.name || "", b.playlist.name || "");
        if (byPl !== 0) return byPl;
        return collator.compare(a.sound.name || "", b.sound.name || "");
      });

      // фильтрация избранных по поиску (учитываем алиас)
      let favEntriesForRender = favoriteSoundEntries;
      if (hasSearch) {
        favEntriesForRender = favoriteSoundEntries.filter(({ playlist, sound }) => {
          const soundName = (sound.name || "").toLowerCase();
          const plName = (playlist.name || "").toLowerCase();
          const key = `${playlist.id}:${sound.id}`;
          const alias = (favoriteAliases[key] || "").toLowerCase();
          return (
            soundName.includes(searchQuery) ||
            plName.includes(searchQuery) ||
            alias.includes(searchQuery)
          );
        });
      }

      if (favEntriesForRender.length > 0) {
        this._renderFavoriteSoundsSection(inner, favEntriesForRender, hasSearch, favoriteAliases);
      }
    }

    // --- ИЗБРАННЫЕ ПЛЕЙЛИСТЫ И ОБЫЧНЫЕ ---

    const favoriteIds = getFavoritePlaylists();
    const favoriteSet = new Set(favoriteIds);

    const hideMarkerRaw = this.settings?.hidePlaylistMarker ?? "";
    const hideMarker = hideMarkerRaw.trim();    

    const collator = new Intl.Collator(game.i18n.lang ?? "en", { sensitivity: "base" });

    const sortColored = this.settings.sortColoredPlaylists;
    const playlists = allPlaylists
      .filter((p) => {
        if (!p.visible) return false;

        // Фильтрация по маркеру: если задан hideMarker и имя начинается с него — не показываем
        if (hideMarker) {
          const name = (p.name || "").trim();
          if (name.startsWith(hideMarker)) return false;
        }

        return true;
      })
      .slice()
            .sort((a, b) => {
        const aFav = favoriteSet.has(a.id);
        const bFav = favoriteSet.has(b.id);

        // 1) избранные — всегда выше
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;

        // 2) если включена опция — "покрашенные" выше обычных
        if (sortColored) {
          const aColored = !!playlistColors[a.id];
          const bColored = !!playlistColors[b.id];

          if (aColored && !bColored) return -1;
          if (!aColored && bColored) return 1;
        }

        // 3) всё остальное — по алфавиту
        return collator.compare(a.name || "", b.name || "");
      });

      for (const playlist of playlists) {
      // Все треки плейлиста и первый играющий (если есть)
      const sounds = playlist.sounds?.contents ?? [];
      const playingSound = sounds.find((s) => s.playing);

      // Фильтрация по поиску
      const soundsToRender = hasSearch
        ? sounds.filter((s) => {
            const soundName = (s.name || "").toLowerCase();
            const plName = (playlist.name || "").toLowerCase();
            return soundName.includes(searchQuery) || plName.includes(searchQuery);
          })
        : sounds;

      // Если поиск включён и в плейлисте нет совпадений — пропускаем этот плейлист
      if (hasSearch && soundsToRender.length === 0) continue;

      // Свернут / развёрнут ли плейлист
      const isExpanded = hasSearch ? true : this._expandedPlaylists.has(playlist.id);
      const isFavorite = favoriteSet.has(playlist.id);

      const playlistEl = document.createElement("div");
      playlistEl.classList.add("gmusicdeck-playlist");
      playlistEl.dataset.playlistId = playlist.id;

      // --- Хедер плейлиста ---
      const header = document.createElement("div");
      header.classList.add("gmusicdeck-playlist-header");
      if (isFavorite) header.classList.add("is-favorite");

      // Для избранных плейлистов можем отключить обрезку имени
      if (isFavorite && !truncateFavoritePlaylists) {
        header.classList.add("gmusicdeck-no-truncate");
      }

      // Статус "в плейлисте что-то играет"
      if (playlist.playing) {
        header.classList.add("is-playing");
      }

      const titleSpan = document.createElement("span");
      titleSpan.classList.add("gmusicdeck-playlist-name");
      titleSpan.textContent = playlist.name || this._untitled()
      header.appendChild(titleSpan);

      header.title = playlist.name || this._untitled()

      // Кастомный цвет плейлиста из настроек
      const customColor = playlistColors[playlist.id];
      const folderColor = playlist.folder?.color;

      if (customColor) {
        header.style.background = customColor;
      } else if (useFolderColor && folderColor) {
        header.style.background = folderColor;
      }
      // иначе останется дефолтный фон из CSS


      // Плашка "сейчас играет" только у обычных плейлистов
      if (playingSound && !isExpanded) {
        const np = document.createElement("div");
        np.classList.add("gmusicdeck-playlist-nowplaying");

        const npLabel = document.createElement("span");
        npLabel.classList.add("gmusicdeck-playlist-nowplaying-label");
        npLabel.textContent = playingSound.name || this._untitled();

        np.appendChild(npLabel);
        header.appendChild(np);
      }

      // ЛКМ по хедеру — разворачиваем / сворачиваем список треков
      header.addEventListener("click", () => {
        const expanded = this._expandedPlaylists.has(playlist.id);
        if (expanded) {
          this._expandedPlaylists.delete(playlist.id);
        } else {
          if (collapseOthers) {
            this._expandedPlaylists.clear();
          }
          this._expandedPlaylists.add(playlist.id);
        }
        this.render();
      });

      // Средняя кнопка — тумблер "избранное" плейлиста
      header.addEventListener("mousedown", (event) => {
        if (event.button === 1) {
          event.preventDefault();
          event.stopPropagation();

          const willBeFavorite = !isFavorite;
          this._playFavoriteAnimation(header, willBeFavorite);
          this._togglePlaylistFavorite(playlist.id);
        }
      });

      // ПКМ по хедеру — палитра цвета для плейлиста
      header.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._openPlaylistColorPicker(playlist, header, event);
      });

      // Маленькая кнопка Play/Stop плейлиста
      const playToggle = document.createElement("div");
      playToggle.classList.add("gmusicdeck-playlist-play-toggle");
      playToggle.title = playlist.playing
        ? this._loc("ui.playlistStopTitle")
        : this._loc("ui.playlistPlayTitle");
      playToggle.textContent = playlist.playing ? "■" : "▶";

      playToggle.addEventListener("click", async (event) => {
        event.stopPropagation();
        try {
          if (playlist.playing) {
            await playlist.stopAll();
          } else {
            await playlist.playAll();
          }
        } catch (err) {
          console.error(`${MODULE_ID} | Ошибка управления плейлистом`, err);
        }
      });

      header.appendChild(playToggle);
      playlistEl.appendChild(header);

      // --- Треки плейлиста, если он развёрнут ---
      if (isExpanded) {
        const soundsContainer = document.createElement("div");
        soundsContainer.classList.add("gmusicdeck-playlist-sounds");

        for (const sound of soundsToRender) {
          const soundEl = document.createElement("div");
          soundEl.classList.add("gmusicdeck-sound");
          soundEl.dataset.soundId = sound.id;

          // Избранный трек? (по паре playlistId:soundId)
          if (favoriteSoundKeySet.has(`${playlist.id}:${sound.id}`)) {
            soundEl.classList.add("is-favorite-sound");
          }         

          if (sound.playing) {
            soundEl.classList.add("is-playing");
          }

          const icon = document.createElement("span");
          icon.classList.add("gmusicdeck-sound-icon");
          icon.textContent = sound.playing ? "🔊" : "♪";

          const name = document.createElement("span");
          name.classList.add("gmusicdeck-sound-name");
          name.textContent = sound.name || this._untitled()
          name.title = sound.name || this._untitled()

          soundEl.appendChild(icon);
          soundEl.appendChild(name);

          // ЛКМ по треку — стандартный playSound/stopSound
          soundEl.addEventListener("click", async () => {
            try {
              if (sound.playing) {
                await playlist.stopSound(sound);
              } else {
                await playlist.playSound(sound);
              }
            } catch (err) {
              console.error(`${MODULE_ID} | Ошибка управления треком`, err);
            }
          });

          // ПКМ по треку — открыть ползунок громкости
          soundEl.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            event.stopPropagation();
            this._openVolumeSlider(playlist, sound, soundEl);
          });

          // MMB — тумблер избранного трека
          soundEl.addEventListener("mousedown", (event) => {
            if (event.button === 1) {
              event.preventDefault();
              event.stopPropagation();
              this._toggleSoundFavorite(playlist.id, sound.id);
            }
          });

          soundsContainer.appendChild(soundEl);
        }

        playlistEl.appendChild(soundsContainer);
      }

      inner.appendChild(playlistEl);
    }
  }

  /* ---------- Рендер виртуального плейлиста "Избранное" ---------- */

  _renderFavoriteSoundsSection(inner, entries, forceExpanded = false, favoriteAliases = {}) {
    const collapseOthers = this.settings.collapseOthers;
    const favId = "__favorites__";
    const isExpanded = forceExpanded || this._expandedPlaylists.has(favId);

    const playlistEl = document.createElement("div");
    playlistEl.classList.add("gmusicdeck-playlist", "gmusicdeck-playlist-favorites");

    const header = document.createElement("div");
    header.classList.add("gmusicdeck-playlist-header", "gmusicdeck-playlist-header-favorites");

    // Для "Избранного" тоже можем всегда показывать полное название
    if (!this.settings.truncateFavoritePlaylists) {
      header.classList.add("gmusicdeck-no-truncate");
    }

    const titleSpan = document.createElement("span");
    titleSpan.classList.add("gmusicdeck-playlist-name");
    titleSpan.textContent = this._loc("ui.favoritesTitle");
    header.appendChild(titleSpan);

    // Кнопка очистки избранного (крестик справа)
    const clearFavBtn = document.createElement("div");
    clearFavBtn.classList.add("gmusicdeck-fav-clear-toggle");
    clearFavBtn.title = this._loc("ui.favoritesClearTooltip");
    clearFavBtn.textContent = "✕";
    clearFavBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!entries.length) return;
      this._confirmClearAllFavoriteSounds();
    });
    header.appendChild(clearFavBtn);
   

    header.title = this._loc("ui.favoritesTooltip");

    // ЛКМ — раскрыть / свернуть список избранного
    header.addEventListener("click", () => {
      const expanded = this._expandedPlaylists.has(favId);
      if (expanded) {
        this._expandedPlaylists.delete(favId);
      } else {
        if (collapseOthers) {
          this._expandedPlaylists.clear();
        }
        this._expandedPlaylists.add(favId);
      }
      this.render();
    });

    // Для "Избранного" play/stop не делаем — там треки из разных плейлистов

    playlistEl.appendChild(header);

    if (isExpanded) {
      const soundsContainer = document.createElement("div");
      soundsContainer.classList.add("gmusicdeck-playlist-sounds");

        for (const { playlist, sound } of entries) {
        const soundEl = document.createElement("div");
        soundEl.classList.add("gmusicdeck-sound");
        soundEl.dataset.soundId = sound.id;

        if (sound.playing) {
          soundEl.classList.add("is-playing");
        }

        const key = `${playlist.id}:${sound.id}`;
        const alias = favoriteAliases[key];
        const originalName = sound.name || this._untitled()
        const labelText = alias || originalName;

        // Кнопка редактирования алиаса ( ✎ )
        const editBtn = document.createElement("div");
        editBtn.classList.add("gmusicdeck-fav-alias-edit");
        editBtn.title = alias
          ? this._loc("ui.aliasEditWithAlias")
          : this._loc("ui.aliasEditNoAlias");
        editBtn.textContent = "✎";
        editBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          this._startFavoriteAliasEdit(soundEl, playlist.id, sound.id, originalName, alias || "");
        });

        const icon = document.createElement("span");
        icon.classList.add("gmusicdeck-sound-icon");
        icon.textContent = sound.playing ? "🔊" : "♪";

        const name = document.createElement("span");
        name.classList.add("gmusicdeck-sound-name");
        name.textContent = labelText;
        name.title = alias
        ? `${alias} — ${playlist.name || this._untitledPlaylist()}\nОригинальное: ${originalName}`
        : `${originalName} — ${playlist.name || this._untitledPlaylist()}`;

        soundEl.appendChild(editBtn);
        soundEl.appendChild(icon);
        soundEl.appendChild(name);

        // ЛКМ по избранному треку — play/stop через исходный плейлист
        soundEl.addEventListener("click", async () => {
          try {
            if (sound.playing) {
              await playlist.stopSound(sound);
            } else {
              await playlist.playSound(sound);
            }
          } catch (err) {
            console.error(`${MODULE_ID} | Ошибка управления избранным треком`, err);
          }
        });

        // ПКМ — ползунок громкости...
        soundEl.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          event.stopPropagation();
          this._openVolumeSlider(playlist, sound, soundEl);
        });

        // MMB по избранному треку — убрать из избранного
        soundEl.addEventListener("mousedown", (event) => {
          if (event.button === 1) {
            event.preventDefault();
            event.stopPropagation();
            this._toggleSoundFavorite(playlist.id, sound.id);
          }
        });

        soundsContainer.appendChild(soundEl);
      }

      playlistEl.appendChild(soundsContainer);
    }

    inner.appendChild(playlistEl);
  }

  /* ---------- Тумблер избранного плейлиста ---------- */

async _togglePlaylistFavorite(playlistId) {
  try {
    const current = getFavoritePlaylists();
    const set = new Set(current);

    if (set.has(playlistId)) set.delete(playlistId);
    else set.add(playlistId);

    await setFavoritePlaylists([...set]);

    // Дадим анимации отыграть (220ms как в keyframes)
    setTimeout(() => this.render(), 220);
  } catch (err) {
    console.error(`${MODULE_ID} | Ошибка переключения избранного плейлиста`, err);
  }
}


  /* ---------- Тумблер избранного трека ---------- */

  async _toggleSoundFavorite(playlistId, soundId) {
    try {
      const current = getFavoriteSounds();
      const key = `${playlistId}:${soundId}`;

      const map = new Map(current.map((e) => [`${e.playlistId}:${e.soundId}`, e]));
      if (map.has(key)) {
        map.delete(key);
      } else {
        map.set(key, { playlistId, soundId });
        this._expandedPlaylists.add("__favorites__");
      }

      await setFavoriteSounds([...map.values()]);
      this.render();
    } catch (err) {
      console.error(`${MODULE_ID} | Ошибка переключения избранного трека`, err);
    }
  }

  _confirmClearAllFavoriteSounds() {
    Dialog.confirm({
      title: this._loc("ui.favoritesDialogTitle"),
      content: this._loc("ui.favoritesDialogContent"),
      yes: () => this._clearAllFavoriteSounds(),
      no: () => {},
      defaultYes: false
    });
  }

  async _clearAllFavoriteSounds() {
    try {
      await setFavoriteSounds([]);
      this.render();
    } catch (err) {
      console.error(`${MODULE_ID} | Ошибка очистки избранных треков`, err);
    }
  }

  _startFavoriteAliasEdit(soundEl, playlistId, soundId, originalName, currentAlias) {
    const existingInput = soundEl.querySelector(".gmusicdeck-fav-alias-input");
    if (existingInput) return; // уже в режиме редактирования

    const nameSpan = soundEl.querySelector(".gmusicdeck-sound-name");
    if (!nameSpan) return;

    const editBtn = soundEl.querySelector(".gmusicdeck-fav-alias-edit");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("gmusicdeck-fav-alias-input");
    input.value = currentAlias || originalName || "";
    input.placeholder = originalName || "";

    // Вставляем инпут вместо текста
    nameSpan.style.display = "none";
    if (editBtn && editBtn.nextSibling) {
      soundEl.insertBefore(input, editBtn.nextSibling.nextSibling || nameSpan);
    } else {
      soundEl.appendChild(input);
    }

    input.focus();
    input.select();

    const finish = async (commit) => {
      if (!input.isConnected) return;

      const aliases = getFavoriteSoundAliases();
      const key = `${playlistId}:${soundId}`;

      if (commit) {
        const value = input.value.trim();
        if (value) {
          aliases[key] = value;
        } else {
          delete aliases[key];
        }
        try {
          await setFavoriteSoundAliases(aliases);
        } catch (err) {
          console.error(`${MODULE_ID} | Ошибка сохранения алиаса избранного трека`, err);
        }
      }

      // Восстанавливаем отображение
      nameSpan.style.display = "";
      input.remove();
      this.render();
    };

    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        finish(true);
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        finish(false);
      }
    });

    input.addEventListener("blur", () => {
      finish(true);
    });
  }


  /* ---------- DOM и позиционирование Music Deck ---------- */

  _initDOM() {
    let container = document.querySelector(".ginzzzu-music-deck");
    if (!container) {
      container = document.createElement("section");
      container.classList.add("ginzzzu-music-deck");

      const inner = document.createElement("div");
      inner.classList.add("ginzzzu-music-deck-inner");
      container.appendChild(inner);

      document.body.appendChild(container);
    }

    this._container = container;
    this._updateSidebarOffset();
  }

  _observeSidebar() {
    this._updateSidebarOffset();

    const sidebarEl = ui.sidebar?.element?.[0] || document.getElementById("sidebar");
    if (sidebarEl) {
      this._sidebarObserver = new MutationObserver(() => this._updateSidebarOffset());
      this._sidebarObserver.observe(sidebarEl, {
        attributes: true,
        attributeFilter: ["class", "style"]
      });
    }

    this._sidebarInterval = setInterval(() => this._updateSidebarOffset(), 100);

    if (!this._onWindowResize) {
      this._onWindowResize = () => this._updateSidebarOffset();
      window.addEventListener("resize", this._onWindowResize);
    }
  }

  _updateSidebarOffset() {
    const sidebarEl = ui.sidebar?.element?.[0] || document.getElementById("sidebar");
    let offset = 0;

    if (sidebarEl) {
      const rect = sidebarEl.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.left >= 0 && rect.left < window.innerWidth;
      if (isVisible) {
        offset = rect.width;
      }
    }

    document.documentElement.style.setProperty(
      "--ginzzzu-music-sidebar-offset",
      `${offset}px`
    );
  }

  /* ---------- Реакция на изменения плейлистов/треков и настроек ---------- */

  _registerHooks() {
    Hooks.on("updatePlaylist", this._onPlaylistChange);
    Hooks.on("createPlaylist", this._onPlaylistChange);
    Hooks.on("deletePlaylist", this._onPlaylistChange);

    Hooks.on("createPlaylistSound", this._onPlaylistSoundChange);
    Hooks.on("updatePlaylistSound", this._onPlaylistSoundChange);
    Hooks.on("deletePlaylistSound", this._onPlaylistSoundChange);

    Hooks.on("updateSetting", this._onSettingsChanged);
  }

  _onPlaylistChange() {
    this.settings = getMusicDeckSettings();
    this.render();
  }

  _onPlaylistSoundChange() {
    this.settings = getMusicDeckSettings();

    // Если сейчас открыт ползунок громкости — не перерисовываем деку,
    // чтобы ползунок не исчезал при каждом обновлении громкости.
    if (this._suppressSoundChangeRender) return;

    this.render();
  }

  _onSettingsChanged(setting) {
    if (!setting) return;
    if (setting.key && !setting.key.startsWith(`${MODULE_ID}.`)) return;
    this.settings = getMusicDeckSettings();
    this.render();
  }

  /* ---------- Очистка ---------- */

  destroy() {
    Hooks.off("updatePlaylist", this._onPlaylistChange);
    Hooks.off("createPlaylist", this._onPlaylistChange);
    Hooks.off("deletePlaylist", this._onPlaylistChange);

    Hooks.off("createPlaylistSound", this._onPlaylistSoundChange);
    Hooks.off("updatePlaylistSound", this._onPlaylistSoundChange);
    Hooks.off("deletePlaylistSound", this._onPlaylistSoundChange);

    Hooks.off("updateSetting", this._onSettingsChanged);

    if (this._sidebarObserver) {
      this._sidebarObserver.disconnect();
      this._sidebarObserver = null;
    }

    if (this._sidebarInterval) {
      clearInterval(this._sidebarInterval);
      this._sidebarInterval = null;
    }

    if (this._onWindowResize) {
      window.removeEventListener("resize", this._onWindowResize);
      this._onWindowResize = null;
    }

    this._closeColorPicker();
    this._closeVolumeSlider();    

    if (this._container?.parentElement) {
      this._container.parentElement.removeChild(this._container);
    }

    this._container = null;
  }
}

/* ---------- Хуки инициализации модуля ---------- */

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | init`);
  registerMusicDeckSettings();
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | ready`);

  // Только для ГМа — игрокам дека не нужна
  if (!game.user?.isGM) {
    console.log(`${MODULE_ID} | skipping init for non-GM user`);
    return;
  }

  try {
    GinzzzuMusicDeck.instance = new GinzzzuMusicDeck();
    GinzzzuMusicDeck.instance.render();
  } catch (err) {
    console.error(`${MODULE_ID} | Ошибка инициализации Ginzzzu's Music Deck`, err);
  }
});
