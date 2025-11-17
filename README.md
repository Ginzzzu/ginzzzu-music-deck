# 🇬🇧 Ginzzzu’s Music Deck  
A compact vertical music dock for Foundry VTT 13+

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

### ⚙ Fully Configurable
Module settings include:

- playlist button size  
- maximum expand width on hover  
- auto-collapse behavior  
- full name display for favorites  
- palette colors (with optional Color Picker UI)  
- folder-color integration  

---

## 📦 Installation

### Foundry Package Management (recommended)
Manifest URL:
```
(put your manifest URL here)
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

### ⚙ Настройки модуля

- ширина деки  
- максимальная ширина раскрытия  
- сворачивание остальных плейлистов  
- использование цвета папки  
- опции отображения избранных  
- 8 конфигурируемых цветов палитры  

---

## 📦 Установка

### Через Foundry Package Management

Manifest URL:
```
(укажите ваш manifest URL здесь)
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
