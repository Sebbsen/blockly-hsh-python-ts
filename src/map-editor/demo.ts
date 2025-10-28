// Map Editor Demo - Einfache HTML-Seite zum Testen des Map Editors
import { MapEditorApp } from './index';

// Warten bis DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('map-editor-container');
  
  if (container) {
    // Map Editor App erstellen
    const mapEditorApp = new MapEditorApp(container);
    
    // Beispiel-Level laden (optional)
    const exampleLevel = {
      blocks: ["move_left"],
      moodleSuccessCode: "DEMO_LEVEL",
      objects: {
        car: {
          emoji: "🚗",
          pos: { x: 0, y: 0 }
        },
        destination: {
          emoji: "🏠",
          pos: { x: 7, y: 7 }
        },
        waypoints: [
          {
            emoji: "⭐",
            pos: { x: 3, y: 3 }
          }
        ],
        obstacles: [
          {
            emoji: "❌",
            pos: { x: 2, y: 2 }
          }
        ]
      }
    };
    
    // Beispiel-Level laden
    mapEditorApp.loadLevel(exampleLevel);
    
    console.log('Map Editor erfolgreich initialisiert!');
  } else {
    console.error('Container mit ID "map-editor-container" nicht gefunden!');
  }
});
