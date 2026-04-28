# 🗺️ Map Editor

Ein visueller Editor zum Erstellen und Bearbeiten von Leveln für das Blockly-Projekt.

## 📁 Struktur

```
src/map-editor/
├── types.ts           # TypeScript Interfaces und Typen
├── MapEditor.ts       # Hauptklasse für den Map Editor
├── MapEditorUI.ts     # UI-Komponenten und Benutzeroberfläche
├── index.ts           # Hauptexport und App-Klasse
├── demo.ts            # Alte Demo-Implementierung
└── demo.html          # Alte HTML-Demo-Seite
```

## 🚀 Features

- **Visuelles Grid-System**: 8x8 Grid mit Canvas-basierter Darstellung
- **Objekt-Platzierung**: Einfaches Klicken zum Platzieren von Objekten
- **Live-Vorschau**: Vorschau beim Bewegen der Maus über das Grid
- **Objekt-Typen**: Auto, Ziel, Wegpunkte, Hindernisse
- **Live JSON View**: Echtzeit-Anzeige und Bearbeitung des Level-JSON
- **Erweiterte Bearbeitung**: Emoji-Änderungen und Waypoint-Reihenfolge über JSON
- **Export**: JSON-basierte Speicherung von Leveln
- **Responsive UI**: Moderne, benutzerfreundliche Oberfläche

## 🎯 Verwendung

### In der App

Der Editor ist in die Haupt-App integriert:

```text
http://localhost:8080/editor
```

Exportierte Level-JSON-Dateien werden in `src/level/` abgelegt und über `src/level/manifest.json` in der Overview sichtbar gemacht. Der Browser-Editor schreibt keine Dateien direkt ins Projekt.

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
  fixedBlocks: [],
  moodleSuccessCode: "LEVEL_1",
  enforceWaypointOrder: false,
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

| Typ | Emoji | Beschreibung |
|-----|-------|--------------|
| `car` | 🚗 | Das spielbare Auto |
| `destination` | 🏠 | Das Ziel |
| `waypoint` | ⭐ | Wegpunkt zum Einsammeln |
| `obstacle` | ❌ | Hindernis |

## 🖱️ Bedienung

### Visueller Editor (Linke Seite)
1. **Objekt auswählen**: Klicke auf ein Objekt in der Toolbar
2. **Platzieren**: Klicke auf das Grid, um das Objekt zu platzieren
3. **Vorschau**: Bewege die Maus über das Grid für eine Vorschau
4. **Abbrechen**: Drücke `ESC` oder wähle ein anderes Objekt
5. **Entfernen**: Aktiviere den "Entfernen-Modus" und klicke auf Objekte
6. **Exportieren**: Speichere dein Level als JSON-Datei

### JSON View (Rechte Seite)
Die JSON View zeigt das aktuelle Level in Echtzeit an und ermöglicht erweiterte Bearbeitungen:

#### Live-Updates
- Das JSON wird automatisch aktualisiert, wenn du Objekte im visuellen Editor platzierst
- Status zeigt "Live" wenn alles synchron ist
- Status zeigt "Bearbeitet" wenn du das JSON manuell änderst

#### Erweiterte Bearbeitungen
**Emojis ändern:**
```json
{
  "objects": {
    "car": { "emoji": "🚙", "pos": { "x": 0, "y": 0 } },
    "destination": { "emoji": "🎯", "pos": { "x": 7, "y": 7 } }
  }
}
```

**Waypoint-Reihenfolge ändern:**
```json
{
  "objects": {
    "waypoints": [
      { "emoji": "⭐", "pos": { "x": 2, "y": 3 } },
      { "emoji": "⭐", "pos": { "x": 4, "y": 5 } },
      { "emoji": "⭐", "pos": { "x": 6, "y": 2 } }
    ]
  }
}
```
Die Reihenfolge im Array bestimmt die Reihenfolge, in der die Waypoints eingesammelt werden müssen.

#### JSON-Aktionen
- **Formatieren**: Formatiert das JSON für bessere Lesbarkeit
- **Speichern**: Validiert und übernimmt die JSON-Änderungen in den Editor
- **Fehlerbehandlung**: Zeigt Syntax-Fehler oder ungültige Level-Strukturen an

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
  fixedBlocks: string[];
  moodleSuccessCode: string;
  enforceWaypointOrder: boolean;
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

Die aktive App-Integration läuft über `/editor`. Die Dateien `demo.ts` und `demo.html` sind nur noch als ältere Standalone-Demo vorhanden.

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
