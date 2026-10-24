# Portfolio — Adrien Segalat

Portfolio personnel configurable construit avec **Vue 3**, **TypeScript** et **Vite**.  
Toute la personnalisation (textes, couleurs, projets, timeline…) se fait via un seul fichier JSON.

## Stack

| Couche | Technologie |
|--------|------------|
| Frontend | Vue 3 + TypeScript + Vite |
| API | Cloudflare Worker (`worker/`) — formulaire de contact (Turnstile + `send_email`) |
| Linter/Formatter | Biome |
| Dead code | Knip |
| Package manager | Bun |
| CI | GitHub Actions (Biome + Knip + Typecheck + Build) |

## Démarrage rapide

```bash
# Installer les dépendances
bun install

# Lancer le dev (frontend + Worker)
bun dev

# Build production
bun run build
```

Le frontend tourne sur `http://localhost:5173` et redirige `/api/*` vers le Worker (`wrangler dev`, `http://localhost:8787`).
En local, l'email n'est pas envoyé : Wrangler l'affiche dans la console.

## Configuration — `frontend/site.config.json`

Tout le contenu du site est piloté par le fichier **`site.config.json`** dans le dossier `frontend/`.  
Aucune connaissance en code n'est nécessaire pour le modifier : `bun run typecheck` signale toute clé manquante ou mal orthographiée.

### Structure du fichier

| Section | Description |
|---------|------------|
| `site` | Nom, titre, description, langue, URL, couleur du thème, image d'aperçu (SEO + meta, injectés dans `index.html` au build) |
| `theme.colors` | Couleurs du site (`bg`, `text`, `muted`, `success`, `error`) |
| `theme.fonts` | Polices (`title`, `mono`) + URL Google Fonts |
| `hero` | Écran d'accueil : nom affiché, labels loader/scroll, image de fond, son ambiant |
| `about` | Section À propos : titre typing, paragraphe, CV (chemin + label), image |
| `contact` | Section Contact : titre, image, labels/placeholders/erreurs du formulaire |
| `footer` | Nom auteur + template copyright (`{{year}}` et `{{name}}` sont remplacés) |
| `nav` | Liens de navigation + labels paramètres (Son, Animations) |
| `social` | Réseaux sociaux (URL + icône Iconify + label accessibilité) |
| `techMap` | Dictionnaire de toutes les technologies (clé → icône + label) |
| `technologiesBanner` | Clés du `techMap` affichées dans la bande défilante |
| `timeline` | Parcours : formations et expériences professionnelles (`type` : `formation` ou `work`) |
| `projects` | Projets : labels globaux + liste des projets avec technologies, liens, médias |

### Modifier les couleurs

Dans `frontend/site.config.json`, section `theme.colors` :

```json
"theme": {
  "colors": {
    "bg": "#151e16",
    "text": "#ecffee",
    "muted": "#808080",
    "success": "#69a47e",
    "error": "#da6a6a"
  }
}
```

Les couleurs sont appliquées automatiquement comme variables CSS au démarrage.

### Modifier les polices

```json
"theme": {
  "fonts": {
    "title": "Gluten",
    "mono": "Space Mono",
    "googleFontsUrl": "https://fonts.googleapis.com/css2?family=Gluten:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap"
  }
}
```

Pour changer de police : aller sur [Google Fonts](https://fonts.google.com), copier l'URL d'import, et mettre à jour les noms + l'URL.

### Ajouter un projet

1. Ajouter le poster dans `frontend/public/projects/poster/` (ex: `mon-projet.webp`, 1280 px de large suffisent)
2. Si vidéo : ajouter dans `frontend/public/projects/videos/` (ex: `mon-projet.mp4`)
3. Si les technologies n'existent pas encore dans `techMap`, les ajouter :
   ```json
   "techMap": {
     "react": { "icon": "devicon:react", "label": "React" }
   }
   ```
4. Ajouter le projet dans `projects.items` :
   ```json
   {
     "id": "mon-projet",
     "title": "Mon Projet",
     "description": "Description du projet...",
     "technologies": ["react", "ts", "docker"],
     "links": {
       "website": "https://mon-projet.com",
       "github": "https://github.com/user/mon-projet"
     },
     "video": "/projects/videos/mon-projet.mp4",
     "poster": "/projects/poster/mon-projet.webp"
   }
   ```

### Ajouter une technologie à la bande défilante

1. S'assurer que la clé existe dans `techMap`
2. Ajouter la clé dans le tableau `technologiesBanner`

### Icônes

Les icônes utilisent [Iconify](https://icon-sets.iconify.design/). Pour trouver une icône :
1. Aller sur https://icon-sets.iconify.design/
2. Chercher (ex: "react", "angular")
3. Copier le nom complet (ex: `devicon:react`)
4. L'utiliser dans `techMap`, `social`, etc.

### Médias

Tous les fichiers média (images, vidéos, sons, CV) sont dans `frontend/public/` :

```
frontend/public/
├── img/                    # Images de sections (hero, about, contact) en .webp
├── projects/
│   ├── poster/             # Posters des projets (.webp)
│   └── videos/             # Vidéos des projets (.mp4)
├── sound/                  # Son ambiant
├── og.jpg                  # Image d'aperçu des liens partagés (1200×630)
├── CV-Adrien.pdf           # CV téléchargeable
└── favicon.ico
```

## Architecture du code

```
frontend/src/
├── config/          # Chargement + types du site.config.json
│   ├── index.ts     # Import JSON, vérifié contre SiteConfig
│   └── types.ts     # Interface TypeScript SiteConfig
├── data/            # Données dérivées de la config (projets, technologies) + icônes
├── components/      # Composants Vue réutilisables
├── composables/     # Hooks Vue (animations au scroll, Lenis, Turnstile)
├── lib/             # Utilitaires (appel API contact, animations, templates)
├── pages/           # Pages/sections du portfolio
├── assets/          # CSS global uniquement
├── injectionKeys.ts # Clés provide/inject typées (entered, animations, son, Lenis)
└── main.ts          # Point d'entrée
```

Le titre, les meta SEO/Open Graph, les polices et les couleurs du thème sont écrits dans `index.html` au build par le plugin `siteHead` de `frontend/vite.config.ts`.

## Déploiement

Le site est déployé sur **Cloudflare Workers** (`wrangler.jsonc`) : les fichiers de `frontend/dist/` sont servis comme assets statiques et le Worker `worker/index.ts` répond à `/api/*`.

```bash
bun run deploy   # build + wrangler deploy
```

### Formulaire de contact

Le Worker vérifie le captcha [Turnstile](https://developers.cloudflare.com/turnstile/) puis envoie l'email avec le binding [`send_email`](https://developers.cloudflare.com/email-service/) de Cloudflare. Prérequis (une seule fois, dans le dashboard Cloudflare) :

1. Le domaine utilise le DNS Cloudflare et **Email Routing** est activé.
2. L'adresse `CONTACT_TO_EMAIL` est ajoutée et **vérifiée** dans Email Routing → Destination addresses.
3. `CONTACT_FROM_EMAIL` est une adresse du domaine (ex. `contact@adrien-segalat.fr`).
4. Les secrets du Worker sont définis :

```bash
bunx wrangler secret put TURNSTILE_SECRET
bunx wrangler secret put CONTACT_TO_EMAIL
bunx wrangler secret put CONTACT_FROM_EMAIL
```

### Checklist de déploiement

- [ ] Mettre à jour `site.url` dans `site.config.json`
- [ ] Définir `VITE_TURNSTILE` au moment du build
- [ ] S'assurer que le CV PDF est bien dans `frontend/public/`
- [ ] Vérifier les images et vidéos dans `frontend/public/projects/`
- [ ] Tester le formulaire de contact en production

### Variables d'environnement

Frontend (`frontend/.env`, voir `frontend/.env.example`) :

| Variable | Défaut | Description |
|----------|--------|------------|
| `VITE_TURNSTILE` | _(requis)_ | Clé de site Cloudflare Turnstile (captcha du formulaire) |

Worker (secrets Cloudflare en production, `.dev.vars` en local, voir `.dev.vars.example`) :

| Variable | Défaut | Description |
|----------|--------|------------|
| `TURNSTILE_SECRET` | _(requis)_ | Clé secrète Turnstile pour vérifier le captcha |
| `CONTACT_TO_EMAIL` | _(requis)_ | Adresse qui reçoit les messages (vérifiée dans Email Routing) |
| `CONTACT_FROM_EMAIL` | _(requis)_ | Adresse expéditrice, sur le domaine du site |
| `CONTACT_FROM_NAME` | `Portfolio Contact` | Nom de l'expéditeur (`vars` dans `wrangler.jsonc`) |

Après une modification de `wrangler.jsonc`, régénérer les types du Worker avec `bun run cf-typegen`.

## Lint & Quality

```bash
# Vérifier le code (Biome + Knip + types)
bun run check

# Vérifier uniquement les types (frontend + Worker)
bun run typecheck

# Formater
bun run format

# Lint + fix
bun run lint
```
