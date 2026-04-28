# Map Editor und npm Scripts

Der Map Editor ist Teil der Haupt-App und wird gemeinsam mit Overview und Leveln gebaut.

## Verfügbare Befehle

### App starten
```bash
npm start
```

Startet den Development-Server unter `http://localhost:8080`.

Wichtige Routen:
- `http://localhost:8080/overview`
- `http://localhost:8080/editor`
- `http://localhost:8080/level-1`

### Editor direkt starten
```bash
npm run editor
```

Startet denselben Development-Server und öffnet direkt `/editor`.

### Production Build erstellen
```bash
npm run build
```

Erstellt den kompletten Build in `dist/`: Overview, Editor, Level-Routen und Level-JSON-Dateien.

### Kompatibilitäts-Script
```bash
npm run build-editor
```

Dieses Script ruft ebenfalls `npm run build` auf. Einen separaten `dist-editor` Build gibt es nicht mehr.

## Level mit dem Editor erstellen

1. Editor öffnen:
   ```text
   http://localhost:8080/editor
   ```

2. Objekte, verfügbare Blocks und fixierte Blocks konfigurieren.

3. JSON exportieren.

4. Exportierte Datei in `src/level/` ablegen, z. B. `level-2.json`.

5. `src/level/manifest.json` ergänzen:
   ```json
   {
     "slug": "level-2",
     "title": "Level 2",
     "file": "level-2.json"
   }
   ```

6. Level über `/level-2` testen und mit `npm run build` in den Production Build aufnehmen.

Mehr Details stehen in `README-LEVELS`.
