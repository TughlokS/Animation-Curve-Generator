// deploy.js

import ghpages from 'gh-pages';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname since it's not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set a custom cache directory with a short path
const cacheDir = 'C:/gh-pages-cache';

// Ensure the cache directory exists or create it
import fs from 'fs';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

ghpages.publish(
  path.join(__dirname, 'dist'),
  {
    branch: 'gh-pages',
    repo: 'https://github.com/TughlokS/Animation-Curve-Generator.git',
    user: {
      name: 'Tughloks',
      email: 'tughloks@hotmail.com',
    },
    cache: cacheDir, // Use the custom cache directory
    dotfiles: true,
    git: 'C:/Program Files/Git/cmd/git.exe', // Ensure this path is correct
  },
  (err) => {
    if (err) {
      console.error('Deployment Error:', err);
    } else {
      console.log('Deployment Complete!');
    }
  }
);
