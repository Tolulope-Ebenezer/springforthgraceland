# springforthgraceland
informative static website project of the senior school of springforth

## Production setup

This project uses a local Tailwind build and Font Awesome assets.

### Build CSS

Install dependencies once:

```bash
npm install
```

Build production CSS:

```bash
npm run build
```

### GitHub deployment

Keep these files in the repo:
- `index.html`
- `dist/output.css`
- `font-awesome-4.7.0/`
- `IMG/`
- `manifest.webmanifest`
- `service-worker.js`
- `package.json`
- `package-lock.json`
- `postcss.config.js`
- `tailwind.config.js`
- `src/input.css`

Don’t commit:
- `node_modules/`
- editor folders like `.vscode/` or `.idea/`
- OS/temp files (`.DS_Store`, `Thumbs.db`, `*.log`, `*.tmp`, `*.swp`)

### PWA support

The site includes a web manifest and service worker for basic offline caching.

### Notes

If you later switch to CDN-hosted Tailwind or Font Awesome, you can remove the local vendor folders from the repo.
