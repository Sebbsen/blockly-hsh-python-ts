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

## Block-Generatoren

Jeder Block muss **zweimal** registriert werden:

### 1. JavaScript-Generator (`src/generators/javascript.ts`)
- **Zweck:** Ausführung der Funktionalität
- **Wird ausgeführt:** `eval(jsCode)` - unsichtbar im Hintergrund
- **Beispiel:**
```typescript
forBlock['move_up'] = function (block, generator) {
  return "window.maze.moveUp();\n";
};
```

### 2. Python-Generator (`src/generators/python.ts`)
- **Zweck:** Anzeige des Python-Codes
- **Wird angezeigt:** In `id="generatedCode"` - sichtbar für den Benutzer
- **Beispiel:**
```typescript
forBlock['move_up'] = function (block, generator) {
  return "maze.move_up()\n";
};
```

## Workflow
1. **Python-Code** wird in `generatedCode` angezeigt
2. **JavaScript-Code** wird im Hintergrund ausgeführt
3. Benutzer sieht Python-Syntax, aber JavaScript-Funktionalität
