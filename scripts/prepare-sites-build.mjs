import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const serverDirectory = resolve(projectRoot, 'dist', 'server');

mkdirSync(serverDirectory, { recursive: true });
copyFileSync(resolve(projectRoot, 'worker', 'index.js'), resolve(serverDirectory, 'index.js'));
