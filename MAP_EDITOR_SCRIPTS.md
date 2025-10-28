# 🗺️ Map Editor - npm Scripts

## Verfügbare Befehle

### Map Editor starten
```bash
npm run editor
```
Startet den Map Editor im Development-Modus auf Port 3001.

### Map Editor bauen
```bash
npm run build-editor
```
Erstellt eine Production-Version des Map Editors im `dist-editor` Ordner.

### Hauptprojekt starten
```bash
npm start
```
Startet das Haupt-Blockly-Projekt im Development-Modus.

### Hauptprojekt bauen
```bash
npm run build
```
Erstellt eine Production-Version des Hauptprojekts.

## Map Editor verwenden

1. **Starten:**
   ```bash
   npm run editor
   ```

2. **Browser öffnet automatisch** auf `http://localhost:3001`

3. **Objekt auswählen:** Klicke auf ein Objekt in der Toolbar (Auto 🚗, Ziel 🏠, Wegpunkt ⭐, Hindernis ❌)

4. **Platzieren:** Klicke auf das Grid, um das ausgewählte Objekt zu platzieren

5. **Exportieren:** Speichere dein Level als JSON-Datei

6. **Importieren:** Lade ein bestehendes Level

## Technische Details

- **Port:** 3001 (unterschiedlich zum Hauptprojekt auf Port 8080)
- **Build-Ordner:** `build-editor/` (Development) oder `dist-editor/` (Production)
- **Entry-Point:** `src/map-editor/demo.ts`
- **Template:** `src/map-editor/demo.html`

## Integration in Hauptprojekt

Der Map Editor kann auch in das Hauptprojekt integriert werden:

```typescript
import { MapEditorIntegration } from './src/map-editor/integration';

// Automatisch verfügbar - Button erscheint oben rechts
new MapEditorIntegration();
```

## Troubleshooting

**Port bereits belegt?**
```bash
# Anderen Port verwenden
npm run editor -- --port 3002
```

**Build-Fehler?**
```bash
# Dependencies neu installieren
npm install

# Cache leeren
npm run build-editor -- --no-cache
```
