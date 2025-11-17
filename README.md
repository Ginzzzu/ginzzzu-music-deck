[![Downloads](https://img.shields.io/github/downloads/Ginzzzu/ginzzzu-music-deck/total)](https://github.com/Ginzzzu/ginzzzu-music-deck/releases)
 ![Downloads Latest](https://img.shields.io/github/downloads/Ginzzzu/ginzzzu-music-deck/latest/total)

> 🇷🇺 Русская версия ниже

# 🇬🇧 Ginzzzu’s Music Deck  
A compact vertical music dock for Foundry VTT 13+

![Music Deck Preview](https://github.com/Ginzzzu/ginzzzu-music-deck/blob/af75485923f47a003079aa1a17da12f68995222d/images/preview.jpg)

Fast access to playlists and tracks.  
Favorites.  
Custom colors.  
Search.  
Volume slider.  
Track aliases.

A modern and clean “music deck” UI designed for fast in-game audio control.

---

## ✨ Features

### 🎵 Vertical Music Deck
A slim vertical panel on the right side of the screen:

- always visible during gameplay  
- automatically shifts when the Foundry sidebar is opened  
- behaves similarly to a portrait dock  
- playlist buttons expand leftward on hover  

---

### 🔍 Smart Search
Search field at the top of the deck filters:

- playlists by name  
- tracks by name  
- favorite track aliases  

Matching playlists automatically expand while search is active.

---

### ⭐ Favorite Playlists
Middle-click on any playlist:

- toggles it as favorite  
- favorite playlists appear at the top of the deck  
- automatically sorted alphabetically  
- get a gold border and highlight  

---

### ❤️ Favorite Tracks (“Virtual Favorites Playlist”)
Middle-click on any track:

- adds it to the **Favorites** virtual playlist  
- favorite tracks from all playlists are collected in one place  
- removing a favorite track updates both the virtual playlist and the original playlist highlight  
- adding a track automatically opens the Favorites playlist  

The “Favorites” playlist shows:

- ✔ only the tracks you chose  
- ✔ golden highlight for favorited tracks  
- ✔ per-track aliases / custom names  

---

### ✏ Track Aliases / Renaming (Favorites Only)
In the “Favorites” playlist:

- hover over a track → edit icon (✎) appears  
- click ✎ to rename the track **only inside Favorites**  
- original track name is preserved in the playlist  
- aliases are shown in UI and used in search  
- tooltip shows both alias and original name  

Examples:

- “Main Theme”  
- “City Ambience”  
- “Romance”  
- “Battle (light)”  

---

### 🔈 Per-track Volume Slider
Right-click any track → shows a mini volume slider:

- real-time volume adjustment  
- synchronized with Foundry’s internal playlist volume  
- stays open while dragging  
- closes only when clicking away  
- smooth, compact UI  

Works for:

- normal playlist tracks  
- favorite tracks  

---

### 🎨 Playlist Color Picker
Right-click on any playlist:

- opens a color palette popup  
- choose a custom background color  
- “remove color” button  
- “reset all colors” button  

Palette colors themselves can be configured in module settings.

---

### 🟦 Colored Playlist Grouping
If enabled in settings, playlists with a custom color assigned through the Deck’s palette are automatically:

- placed **above normal playlists**
- but still **below favorites**
- sorted alphabetically inside their group

This allows useful visual grouping of curated or thematic playlists.

---

### 🚫 Playlist Filtering by Prefix
A new setting **“Hide playlists starting with…”** allows excluding certain playlists from the Music Deck.

Examples:

- `!Scene – Cave`
- `!GM Only`
- `#cutscene`

If a playlist’s name begins with the specified prefix, it will be **hidden from the Deck**  
(but still fully available in Foundry's native Playlist panel).

Leave the setting empty to disable the filter.

---

### 🧭 Layout Customization
The Music Deck panel now has three adjustable offsets:

- **Top offset (px)**
- **Bottom offset (%)**
- **Right offset (px)**

These help avoid conflicts with other UI modules or custom layouts, making the Deck fully adaptable to any table setup.

---

### ⚙ Fully Configurable
Module settings include:

- playlist button width  
- maximum expand width on hover  
- auto-collapse behavior  
- folder-color integration  
- favorite playlist name truncation  
- 9 configurable palette colors  
- **colored playlist grouping (on/off)**  
- **playlist filtering by prefix**  
- **top / bottom / right deck offsets for full layout control**

---

## 📦 Installation

### Foundry Package Management (recommended)
Manifest URL:
```
https://raw.githubusercontent.com/Ginzzzu/ginzzzu-music-deck/main/module.json
```

### Manual Installation

1. Download the latest release from GitHub.  
2. Extract into:
```
Data/modules/ginzzzu-music-deck/
```
3. Enable module in **Manage Modules**.

---

## 💡 Usage Tips

- **Middle-click** = favorite playlist or favorite track  
- **Right-click** track = volume slider  
- **Right-click** playlist = color menu  
- Aliases help organize background moods, themes, emotional markers  
- Search is extremely fast and works across all playlists and favorites  

---

## 🧩 Compatibility
- Designed for Foundry VTT **13+**  
- Works with all playlist/audio modules  
- Compatible with Color Picker (optional enhancement)  

---

## 📘 Roadmap
- Optional auto-scroll to Favorites when adding a track  
- Folder grouping mode  
- Quick tags for tracks  
- Integration with ambient sounds  

---

# 🇷🇺 Ginzzzu’s Music Deck  
Компактная вертикальная музыкальная дека для Foundry VTT 13+

Быстрый доступ к плейлистам и трекам.  
Избранное.  
Настраиваемые цвета.  
Поиск по всему аудио.  
Ползунок громкости.  
Алиасы треков.

Современный удобный интерфейс для оперативного управления музыкой прямо во время игры.

---

## ✨ Возможности

### 🎵 Вертикальная музыкальная панель
Тонкая панель справа:

- всегда под рукой  
- отодвигается при открытии стандартного сайдбара  
- кнопки плейлистов расширяются влево при наведении  
- занимает минимум места  

---

### 🔍 Умный поиск
Поле «Поиск…» фильтрует:

- плейлисты  
- треки  
- алиасы треков в «Избранном»  

Подходящие плейлисты автоматически раскрываются.

---

### ⭐ Избранные плейлисты
Средняя кнопка мыши по плейлисту:

- делает его избранным / обычным  
- выносит наверх  
- сортирует по алфавиту  
- добавляет золотую обводку  

---

### ❤️ Избранные треки (виртуальный плейлист)
Средний клик по треку:

- добавляет в виртуальный плейлист «Избранное»  
- «Избранное» автоматически раскрывается  
- в родном плейлисте избранные треки помечаются рамкой  

Можно быстро собрать:

- боевые темы  
- атмосферные фоны  
- звуки NPC  
- музыкальные маркеры сцен  

---

### ✏ Алиасы треков (только в «Избранном»)
В «Избранном»:

- наведите на трек → появляется ✎  
- нажмите — можно переименовать трек  
- имя меняется только в «Избранном»  
- оригинальное имя остаётся в плейлисте  
- алиасы участвуют в поиске  

---

### 🔈 Ползунок громкости трека
ПКМ по треку:

- показывает мини-панель громкости  
- изменение громкости в реальном времени  
- панель не закрывается при перетаскивании  
- закрывается при клике вне  

Работает в любых плейлистах.

---

### 🎨 Цветовые палитры
ПКМ по плейлисту:

- открывает палитру  
- можно задать цвет  
- убрать цвет  
- сбросить цвета у всех плейлистов  

Палитра редактируется в настройках модуля.

---

### 🟦 Группировка покрашенных плейлистов
Если опция включена, плейлисты, которым назначен пользовательский цвет, автоматически:

- поднимаются **выше обычных плейлистов**  
- но остаются **ниже избранных**  
- сортируются по алфавиту внутри своей группы  

Это помогает визуально выделять тематические или важные плейлисты.

---

### 🚫 Фильтрация плейлистов по префиксу
Новая настройка **«Скрывать плейлисты по префиксу»** позволяет исключать определённые плейлисты из музыкальной деки.

Примеры:

- `!Сцена – Пещера`
- `!Только ГМ`
- `#катсцена`

Если имя плейлиста начинается с указанного символа или строки, он **не будет показываться** в деке  
(но останется доступным в панели плейлистов Foundry).

Чтобы отключить фильтр, оставьте поле пустым.

---

### 🧭 Настройки положения деки
Теперь можно настраивать размещение музыкальной деки:

- **Отступ сверху (px)**
- **Отступ снизу (%)**
- **Отступ справа (px)**

Это позволяет избежать перекрытия других элементов интерфейса и удобнее организовать рабочее пространство.

---

### ⚙ Настройки модуля
Включают:

- ширину кнопок плейлистов  
- максимальную ширину раскрытия при наведении  
- автосворачивание других плейлистов  
- использование цвета папки  
- обрезание длинных названий избранных  
- 9 настраиваемых цветов палитры  
- **группировку покрашенных плейлистов**  
- **фильтрацию по префиксу имени плейлиста**  
- **отступ сверху / снизу / справа для точной настройки расположения деки**

---

## 📦 Установка

### Через Foundry Package Management

Manifest URL:
```
https://raw.githubusercontent.com/Ginzzzu/ginzzzu-music-deck/main/module.json
```

### Вручную

1. Скачать release с GitHub  
2. Разместить в:
```
Data/modules/ginzzzu-music-deck/
```
3. Активировать модуль в **Manage Modules**

---

## 🧩 Совместимость

- Foundry VTT **13+**  
- Полностью работает с Color Picker  
- Не конфликтует с другими модулями аудио  

---

## 🙌 Credits

Module by **Ginzzzu**  
Design & system integration assisted by **ChatGPT**
