# Easter Egg Library

A simple JavaScript/TypeScript library to add an easter egg (Konami Code) to your web applications.

## Features

- Detects a custom key sequence (default: Konami Code).
- Executes a callback function upon successful sequence entry.
- Basic debugger detection and code obfuscation for fun.

## Installation

To use this library in your project, you can install it via Bun:

```bash
bun add easter-egg
# Or if you're using npm/yarn
# npm install easter-egg
# yarn add easter-egg
```

## Usage

### In your JavaScript/TypeScript project

```typescript
import { createEasterEgg } from 'easter-egg';

createEasterEgg(
  document.body, // The element to listen for key events
  () => {
    alert('Easter Egg Triggered!');
    // Your custom easter egg logic here
  },
  ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'] // Konami Code
);
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
    ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
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