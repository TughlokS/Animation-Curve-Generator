// deploy.js

import ghpages from 'gh-pages';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname and __filename are not available in ES modules, so we derive them
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ghpages.publish(
  path.join(__dirname, 'dist'), // path to your build directory
  {
    branch: 'gh-pages',
    repo: 'https://github.com/TughlokS/Animation-Curve-Generator.git', // Update with your repo URL
    user: {
      name: 'Tughloks', // Replace with your GitHub username
      email: 'tughloks@hotmail.com', // Replace with your email
    },
    cache: '.gh-pages-cache', // Specify a shorter cache directory
    dotfiles: true,
  },
  (err) => {
    if (err) {
      console.error('Deployment Error:', err);
    } else {
      console.log('Deployment Complete!');
    }
  }
);
