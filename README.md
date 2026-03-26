# Swear Jar Remote App (髒話罐)

This is a **remote micro-frontend application** for tracking swear word fines. It's loaded by the shell app via Module Federation.

## Tech Stack

- **Vue 3.5.25** - Progressive JavaScript framework
- **Pinia 3.0.4** - State management
- **Axios 1.13.6** - HTTP client
- **Module Federation** - Exposes components via @module-federation/vite
- **Vite 7.3** - Build tool

## Project Structure

```
swear-jar/
├── src/
│   ├── api.js                 # Axios instance
│   ├── main.js                # Entry for standalone dev mode
│   ├── App.vue                # Main component (exposed to shell)
│   ├── stores/
│   │   └── entries.js         # Swear jar entries store (Pinia)
│   └── components/
│       ├── EntryForm.vue      # Add/edit entry form
│       ├── EntryList.vue      # List of entries
│       └── MonthlySummary.vue # Monthly summary cards
├── index.html
├── vite.config.js             # Vite + Module Federation config
└── package.json
```

## Development

### Standalone Mode
Run the app independently for development:

```bash
npm install
npm run dev   # Starts on http://localhost:5174
```

**Note**: In standalone mode, you need to be logged in via the shell app first (same localStorage token).

### Integrated Mode
1. Start the shell app: `cd ../shell && npm run dev`
2. Start this remote app: `npm run dev`
3. Access via shell at `http://localhost:5173/swear-jar`

## Build

```bash
npm run build
npm run preview
```

## Module Federation Configuration

This app exposes its main component:

```javascript
exposes: {
  './App': './src/App.vue',
}
```

Shared dependencies (singleton):
- `vue`
- `pinia`

## Components

### App.vue (exposed)
The main component loaded by the shell. Contains:
- Month selector
- Entry list
- Monthly summary
- Rules card
- Entry form modal

### EntryForm.vue
Modal form for creating/editing swear jar entries:
- Description
- Amount
- Occurred date/time

### EntryList.vue
Table displaying swear jar entries with:
- Description, amount, timestamp
- Edit and delete actions

### MonthlySummary.vue
Grid of monthly summary cards showing:
- Total amount per month
- Entry count

## Entries Store

Located at `src/stores/entries.js`, provides:

- `fetchEntries(month)` - Get entries for a month
- `createEntry(entry)` - Add new entry
- `updateEntry(id, entry)` - Update entry
- `deleteEntry(id)` - Delete entry
- `fetchSummary(year)` - Get monthly summaries

State:
- `entries` - Array of entry objects
- `summaries` - Array of monthly summary objects
- `loading` - Boolean loading state

## API Endpoints

- `GET /api/entries?month=YYYY-MM` - List entries
- `POST /api/entries` - Create entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `GET /api/entries/summary?year=YYYY` - Monthly summaries

## Styling

Uses the warm brown color scheme defined in `style.css`:
- Primary: `#a67c52`
- Background: `#faf6f1`
- Card: `#fffcf8`
- Text: `#3d2e22`

Font: Noto Sans TC

## Integration with Shell

The shell loads this app via:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const RemoteApp = defineAsyncComponent({
  loader: () => import('swearJar/App')
})
</script>
```

No routing needed - the shell handles all routing. This app is purely a component.
