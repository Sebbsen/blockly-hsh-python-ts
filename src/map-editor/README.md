# 🗺️ Map Editor

Ein visueller Editor zum Erstellen und Bearbeiten von Leveln für das Blockly-Projekt.

## 📁 Struktur

```
src/map-editor/
├── types.ts           # TypeScript Interfaces und Typen
├── MapEditor.ts       # Hauptklasse für den Map Editor
├── MapEditorUI.ts     # UI-Komponenten und Benutzeroberfläche
├── index.ts           # Hauptexport und App-Klasse
├── demo.ts            # Demo-Implementierung
└── demo.html          # HTML-Demo-Seite
```

## 🚀 Features

- **Visuelles Grid-System**: 8x8 Grid mit Canvas-basierter Darstellung
- **Objekt-Platzierung**: Einfaches Klicken zum Platzieren von Objekten
- **Live-Vorschau**: Vorschau beim Bewegen der Maus über das Grid
- **Objekt-Typen**: Auto, Ziel, Wegpunkte, Hindernisse
- **Import/Export**: JSON-basierte Speicherung und Laden von Leveln
- **Responsive UI**: Moderne, benutzerfreundliche Oberfläche

## 🎯 Verwendung

### Grundlegende Verwendung

```typescript
import { MapEditorApp } from './map-editor';

// Container-Element auswählen
const container = document.getElementById('map-editor-container');

// Map Editor App erstellen
const mapEditorApp = new MapEditorApp(container);

// Level laden
const levelData = {
  blocks: ["move_left"],
  moodleSuccessCode: "LEVEL_1",
  objects: {
    car: { emoji: "🚗", pos: { x: 0, y: 0 } },
    destination: { emoji: "🏠", pos: { x: 7, y: 7 } },
    waypoints: [],
    obstacles: []
  }
};

mapEditorApp.loadLevel(levelData);
```

### Erweiterte Verwendung

```typescript
// Aktuelles Level abrufen
const currentLevel = mapEditorApp.getCurrentLevel();

// Level exportieren
const jsonData = mapEditorApp.exportLevel();

// MapEditor direkt zugreifen
const mapEditor = mapEditorApp.getMapEditor();
mapEditor.selectObjectType('car');
```

## 🎨 Objekt-Typen

| Typ | Emoji | Beschreibung | Farbe |
|-----|-------|--------------|-------|
| `car` | 🚗 | Das spielbare Auto | Blau |
| `destination` | 🏠 | Das Ziel | Grün |
| `waypoint` | ⭐ | Wegpunkt zum Einsammeln | Gelb |
| `obstacle` | ❌ | Hindernis | Rot |

## 🖱️ Bedienung

1. **Objekt auswählen**: Klicke auf ein Objekt in der Toolbar
2. **Platzieren**: Klicke auf das Grid, um das Objekt zu platzieren
3. **Vorschau**: Bewege die Maus über das Grid für eine Vorschau
4. **Abbrechen**: Drücke `ESC` oder wähle ein anderes Objekt
5. **Exportieren**: Speichere dein Level als JSON-Datei
6. **Importieren**: Lade ein bestehendes Level

## 🔧 API-Referenz

### MapEditorApp

```typescript
class MapEditorApp {
  constructor(container: HTMLElement, initialLevel?: LevelData)
  
  getMapEditor(): MapEditor
  getMapEditorUI(): MapEditorUI
  loadLevel(level: LevelData): void
  getCurrentLevel(): LevelData
  exportLevel(): string
}
```

### MapEditor

```typescript
class MapEditor {
  constructor(canvasContainer: HTMLElement, initialLevel?: LevelData)
  
  selectObjectType(type: ObjectType | null): void
  getCurrentLevel(): LevelData
  loadLevel(level: LevelData): void
  clearLevel(): void
  removeObjectAt(position: LevelPosition): void
  getObjectTemplates(): ObjectTemplate[]
  exportLevel(): string
}
```

### MapEditorUI

```typescript
class MapEditorUI {
  constructor(container: HTMLElement, mapEditor: MapEditor)
}
```

## 📝 Level-Format

Das Level-Format entspricht dem bestehenden `LevelData` Interface:

```typescript
interface LevelData {
  blocks: string[];
  moodleSuccessCode: string;
  objects: {
    car: LevelObject;
    destination: LevelObject;
    waypoints: LevelObject[];
    obstacles: LevelObject[];
  };
}

interface LevelObject {
  emoji: string;
  pos: LevelPosition;
}

interface LevelPosition {
  x: number;
  y: number;
}
```

## 🎮 Demo

Öffne `demo.html` in einem Browser, um den Map Editor zu testen. Die Demo lädt ein Beispiel-Level und zeigt alle Funktionen.

## 🔗 Integration

Der Map Editor kann einfach in bestehende Projekte integriert werden:

1. Kopiere den `map-editor` Ordner in dein Projekt
2. Importiere die benötigten Klassen
3. Erstelle einen Container im DOM
4. Initialisiere den MapEditorApp

## 🎯 Nächste Schritte

- [ ] Drag & Drop Funktionalität
- [ ] Undo/Redo System
- [ ] Mehr Objekt-Typen
- [ ] Grid-Größe anpassbar
- [ ] Level-Validierung
- [ ] Template-System für häufige Level-Layouts
