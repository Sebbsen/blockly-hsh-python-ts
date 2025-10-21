# 🧩 Blockly Blöcke erstellen - Anleitung

Diese Anleitung erklärt, wie du neue Blöcke für das Blockly-Projekt erstellst.

## 📁 Dateien, die geändert werden müssen

Für jeden neuen Block musst du **4 Dateien** bearbeiten:

1. **`src/blocks/text.ts`** - Block-Definition
2. **`src/generators/javascript.ts`** - JavaScript-Code-Generator
3. **`src/generators/python.ts`** - Python-Code-Generator
4. **`src/toolbox.ts`** - Toolbox (damit Block verfügbar ist)

## 🚀 Schritt-für-Schritt Anleitung

### 1. Block-Definition erstellen (`src/blocks/text.ts`)

```typescript
const meinNeuerBlock = {
  type: 'mein_neuer_block',           // Eindeutiger Name
  message0: 'Mein neuer Block',        // Text auf dem Block
  previousStatement: null,            // Kann vor anderen Blöcken stehen
  nextStatement: null,                // Kann vor anderen Blöcken stehen
  colour: 200,                        // Farbe (0-360)
  tooltip: 'Beschreibung des Blocks', // Tooltip beim Hover
  helpUrl: '',                        // Hilfe-URL (optional)
};

// Block zum blocks Array hinzufügen:
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  addText,
  moveUp,
  moveRight,
  moveLeft,
  moveDown,
  meinNeuerBlock  // ← Hier hinzufügen
]);
```

### 2. JavaScript-Generator hinzufügen (`src/generators/javascript.ts`)

```typescript
forBlock['mein_neuer_block'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "maze.meineNeueMethode();\n";  // JavaScript-Code
};
```

### 3. Python-Generator hinzufügen (`src/generators/python.ts`)

```typescript
forBlock['mein_neuer_block'] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return "meine_neue_funktion()\n";  // Python-Code
};
```

### 4. Block zur Toolbox hinzufügen (`src/toolbox.ts`)

```typescript
export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Drive',
      expanded: true,
      contents: [
        { kind: 'block', type: 'move_up' },
        { kind: 'block', type: 'move_right' },
        { kind: 'block', type: 'move_left' },
        { kind: 'block', type: 'move_down' },
        { kind: 'block', type: 'mein_neuer_block' },  // ← Hier hinzufügen
      ],
    },
  ],
};
```

## 🎨 Block-Eigenschaften

### **Block-Typen:**
- `type: 'block_name'` - Eindeutiger Name (snake_case)

### **Block-Text:**
- `message0: 'Text %1'` - Text mit Platzhalter %1, %2, etc.
- `message1: 'Zweite Zeile'` - Mehrere Zeilen möglich

### **Verbindungen:**
- `previousStatement: null` - Kann vor anderen Blöcken stehen
- `nextStatement: null` - Kann vor anderen Blöcken stehen
- `output: 'Number'` - Hat einen Ausgabewert
- `inputsInline: true` - Eingaben in einer Zeile

### **Eingaben:**
```typescript
args0: [
  {
    type: 'input_value',     // Wert-Eingabe
    name: 'VALUE',           // Name für Generator
    check: 'String',         // Datentyp
  },
  {
    type: 'input_dummy',     // Dummy-Eingabe (nur Spacing)
  },
  {
    type: 'field_dropdown',  // Dropdown-Menü
    name: 'OPTION',
    options: [['Option 1', 'VALUE1'], ['Option 2', 'VALUE2']]
  }
]
```

### **Farben:**
- `colour: 0` - Rot
- `colour: 60` - Gelb  
- `colour: 120` - Grün
- `colour: 180` - Cyan
- `colour: 240` - Blau
- `colour: 300` - Magenta

## 🔧 Generator-Funktionen

### **JavaScript-Generator:**
```typescript
forBlock['block_name'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
  return `console.log(${value});\n`;
};
```

### **Python-Generator:**
```typescript
forBlock['block_name'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
  return `print(${value})\n`;
};
```

## 📝 Beispiel: "Say Hello" Block

### 1. Block-Definition:
```typescript
const sayHello = {
  type: 'say_hello',
  message0: 'Say hello to %1',
  args0: [
    {
      type: 'input_value',
      name: 'NAME',
      check: 'String',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: 'Sagt Hallo zu jemandem',
};
```

### 2. JavaScript-Generator:
```typescript
forBlock['say_hello'] = function (block, generator) {
  const name = generator.valueToCode(block, 'NAME', Order.NONE) || "''";
  return `console.log('Hallo ' + ${name});\n`;
};
```

### 3. Python-Generator:
```typescript
forBlock['say_hello'] = function (block, generator) {
  const name = generator.valueToCode(block, 'NAME', Order.NONE) || "''";
  return `print('Hallo ' + ${name})\n`;
};
```

## 🎯 Best Practices

1. **Namen**: Verwende `snake_case` für Block-Namen
2. **Konsistenz**: Gleiche Logik in JS und Python
3. **Tooltips**: Hilfreiche Beschreibungen hinzufügen
4. **Farben**: Logische Farbgruppen für ähnliche Blöcke
5. **Testing**: Teste beide Generatoren nach Änderungen

## 🚨 Häufige Fehler

- ❌ Block nicht zur Toolbox hinzugefügt
- ❌ Generator für eine Sprache vergessen
- ❌ Falsche Block-Namen in Generatoren
- ❌ Fehlende `break;` in switch-Statements
- ❌ Vergessen, Block zum `blocks` Array hinzuzufügen

## 🔍 Debugging

1. **Browser-Konsole** prüfen auf Fehler
2. **Blockly-Entwicklertools** verwenden
3. **Generierter Code** in beiden Sprachen testen
4. **Block-Definition** auf Syntax-Fehler prüfen

---

**Viel Erfolg beim Erstellen neuer Blöcke! 🚀**
