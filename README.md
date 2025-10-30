# Easter Egg Library

[![npm version](https://img.shields.io/npm/v/@uiwwsw/easter-egg.svg)](https://www.npmjs.com/package/@uiwwsw/easter-egg)
[![Publish](https://github.com/uiwwsw/easter-egg/actions/workflows/publish.yml/badge.svg)](https://github.com/uiwwsw/easter-egg/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/uiwwsw/easter-egg)](https://github.com/uiwwsw/easter-egg/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/uiwwsw/easter-egg?style=flat)](https://github.com/uiwwsw/easter-egg/stargazers)

A simple JavaScript/TypeScript library to add an easter egg (Konami Code) to your web applications.

## Features

- Detects custom keyboard and pointer event sequences (default: Konami Code).
- Executes a callback function upon successful sequence entry.
- Basic debugger detection and code obfuscation for fun.

## Installation

To use this library in your project, you can install it via Bun:

```bash
bun add @uiwwsw/easter-egg
# Or if you're using npm/yarn
# npm install @uiwwsw/easter-egg
# yarn add @uiwwsw/easter-egg
```

## Usage

### In your JavaScript/TypeScript project

```typescript
import { createEasterEgg } from '@uiwwsw/easter-egg';

createEasterEgg(
  document.body, // The element to listen for keyboard/pointer events
  () => {
    alert('Easter Egg Triggered!');
    // Your custom easter egg logic here
  },
  [
    'keyboard:ArrowUp',
    'keyboard:ArrowUp',
    'keyboard:ArrowDown',
    'keyboard:ArrowDown',
    'keyboard:ArrowLeft',
    'keyboard:ArrowRight',
    'keyboard:ArrowLeft',
    'keyboard:ArrowRight',
    'keyboard:b',
    'keyboard:a',
  ] // Konami Code
);
```

Each entry in the array follows the format `<type>:<value>`:

- `keyboard:<event.key>` listens for keyboard events fired on `keydown`.
- `pointer:<event.type>` listens for pointer/mouse interactions such as `click`, `pointerdown`, or `dblclick`.

Need mouse interactions too? Mix and match both types:

```typescript
createEasterEgg(document.body, () => {
  console.log('Keyboard and pointer combo unlocked!');
}, [
  'keyboard:Shift',
  'pointer:click',
  'pointer:click',
  'keyboard:Enter',
]);
```

### In your HTML (for demo/direct use)

As demonstrated in `index.html`:

```html
<script type="module">
  import { createEasterEgg } from './dist/index.js'; // Adjust path if necessary

  createEasterEgg(
    document.body,
    () => {
      alert('Easter Egg Triggered!');
    },
    [
      'keyboard:ArrowUp',
      'keyboard:ArrowUp',
      'keyboard:ArrowDown',
      'keyboard:ArrowDown',
      'keyboard:ArrowLeft',
      'keyboard:ArrowRight',
      'keyboard:ArrowLeft',
      'keyboard:ArrowRight',
      'keyboard:b',
      'keyboard:a'
    ]
  );
</script>
```

## Development

### Running the Demo

To run the demo page (`index.html`), you can use a simple static file server. If you have Bun installed, you can use `bun --watch server.ts` (as defined in `package.json`'s `dev` script) or any other static server.

```bash
bun run dev
```

Then open `http://localhost:3000` in your browser.

### Building the Library

To build the distributable files (`.js` and `.d.ts`) for the library:

```bash
bun run build
```

This will output the compiled files into the `dist/` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.