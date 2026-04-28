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

Im Production Build heißen die flachen Dateien `overview.html`, `editor.html` und z. B. `level-1.html`.

### Editor direkt starten
```bash
npm run editor
```

Startet denselben Development-Server und öffnet direkt `/editor`.

### Production Build erstellen
```bash
npm run build
```

Erstellt den kompletten Build in `dist/`: Overview, Editor, Live-Level-Seiten und Live-Level-JSON-Dateien. Alle Dateien liegen direkt in `dist/`, ohne Unterordner. Test-Level aus `src/level/test/manifest.json` werden nicht veröffentlicht.

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

4. Exportierte Datei ablegen:
   - Live-Level nach `src/level/live/`
   - Test-Level nach `src/level/test/`

5. Passendes Manifest ergänzen:
   - Live-Level: `src/level/live/manifest.json`
   - Test-Level: `src/level/test/manifest.json`

   Beispiel:
   ```json
   {
     "slug": "level-2",
     "title": "Level 2",
     "file": "level-2.json"
   }
   ```

6. Level über `/level-2` testen. Nur Live-Level werden mit `npm run build` als `level-2.html` in den Production Build aufgenommen.

Mehr Details stehen in `README-LEVELS`.
