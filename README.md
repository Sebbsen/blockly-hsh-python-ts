# blockly-hsh-python-ts

## Installation & Start

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm

### Projekt starten
```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start
```
Der Server startet automatisch im Browser unter `http://localhost:8080`.

Wichtige Routen:
- `/` und `/overview` zeigen die Level-Overview
- `/editor` öffnet den Level Editor
- `/{level-slug}` öffnet ein einzelnes Level, z. B. `/level-1`

Im Production Build liegen dieselben Seiten als flache Dateien vor:
- `index.html`
- `overview.html`
- `editor.html`
- `level-1.html`

### Projekt builden
```bash
# Production Build erstellen
npm run build
```
Das kompilierte Projekt wird im `dist/` Ordner erstellt. Alle Dateien liegen direkt in `dist/`, ohne Unterordner. Der Build enthält nur die Live-Level aus `src/level/live/`.

## Level erstellen

Live-Level werden in `src/level/live/` gepflegt und über `src/level/live/manifest.json` veröffentlicht. Test-Level bleiben in `src/level/test/` und `src/level/test/manifest.json`; sie erscheinen nur bei `npm start`.

Kurzablauf:
- Editor unter `/editor` oder `editor.html` öffnen
- Level exportieren
- Live-Level in `src/level/live/` ablegen und `src/level/live/manifest.json` ergänzen
- Test-Level in `src/level/test/` ablegen und `src/level/test/manifest.json` ergänzen
- `npm run build` ausführen

Details stehen in **[README-LEVELS](./README-LEVELS)**.

## 🧩 Neue Blöcke erstellen
Für detaillierte Anleitungen zum Erstellen neuer Blöcke siehe: **[README_BLOCKS.md](./README_BLOCKS.md)**

Wenn Blöcke mit KI erstellt werden, verweise auf diese Readme

### Kurzübersicht:
- **4 Dateien** müssen geändert werden
- **Block-Definition** in `src/blocks/text.ts`
- **JavaScript-Generator** in `src/generators/javascript.ts`
- **Python-Generator** in `src/generators/python.ts`
- **Toolbox** in `src/toolbox.ts`
