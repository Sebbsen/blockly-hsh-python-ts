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
Der Server startet automatisch im Browser unter `http://localhost:8080`

### Projekt builden
```bash
# Production Build erstellen
npm run build
```
Das kompilierte Projekt wird im `dist/` Ordner erstellt.

## 🧩 Neue Blöcke erstellen
Für detaillierte Anleitungen zum Erstellen neuer Blöcke siehe: **[README_BLOCKS.md](./README_BLOCKS.md)**

Wenn Blöcke mit KI erstellt werden, verweise auf diese Readme

### Kurzübersicht:
- **4 Dateien** müssen geändert werden
- **Block-Definition** in `src/blocks/text.ts`
- **JavaScript-Generator** in `src/generators/javascript.ts`
- **Python-Generator** in `src/generators/python.ts`
- **Toolbox** in `src/toolbox.ts`
