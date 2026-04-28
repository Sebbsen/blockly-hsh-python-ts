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

### Projekt builden
```bash
# Production Build erstellen
npm run build
```
Das kompilierte Projekt wird im `dist/` Ordner erstellt. Der Build enthält Overview, Editor, alle Manifest-Level-Routen und die zugehörigen Level-JSON-Dateien.

## Level erstellen

Level werden als JSON-Dateien in `src/level/` gepflegt und über `src/level/manifest.json` in der Overview freigeschaltet.

Kurzablauf:
- Editor unter `/editor` öffnen
- Level exportieren
- JSON-Datei in `src/level/` ablegen, z. B. `level-2.json`
- Eintrag in `src/level/manifest.json` ergänzen
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
