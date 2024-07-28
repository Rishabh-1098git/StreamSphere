// src/setupPolyfills.js
import { Buffer } from 'buffer';

window.Buffer = Buffer;
window.global = window; // This line directly assigns `window` to `global`
