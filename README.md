# WaveStay — Démo booking

POC de site de réservation de chambres pour la démo Accor (Wavestone).

V1 manuelle servant de base aux itérations live via la plateforme agentique
**waveagentdev**.

## Stack

- Vite 8 + React 19 (JS)
- Tailwind CSS 4 (config CSS-first)
- React Router 7 (Data Router)

## Lancer en local

```bash
pnpm install
pnpm dev
```

Ouvrir http://localhost:5173

## Build production

```bash
pnpm build
pnpm preview
```

## Structure

```
src/
├── main.jsx              # entrée + RouterProvider
├── routes.jsx            # createBrowserRouter + RootLayout
├── index.css             # @import "tailwindcss" + tokens @theme
├── data/rooms.js         # 3 chambres (données en dur)
├── data/availability.js  # périodes d'occupation mock (déc. 2026 – fév. 2027)
├── components/           # Header, Footer, RoomCard, RoomGallery, BookingWidget
└── pages/                # HomePage, RoomDetailPage, BookingPage, ConfirmationPage,
                          # AvailabilityPage
```

## Page Disponibilités

Accessible via le lien **"Disponibilités"** dans le Header ou directement sur
`http://localhost:5173/availability`.

Tableau interactif permettant de :
- Choisir une plage d'arrivée / départ (deux `<input type="date">`) ;
- Visualiser en temps réel la disponibilité de chaque chambre (badge vert / rouge) ;
- Trier par Chambre, Surface ou Prix/nuit (clic sur l'en-tête de colonne) ;
- Filtrer pour n'afficher que les chambres disponibles ;
- Réserver directement depuis le tableau — les dates sont pré-remplies dans la page de réservation.

Les disponibilités sont calculées à partir de données mock fixes dans `src/data/availability.js`
(périodes d'occupation de décembre 2026 à février 2027).

## Hors-scope (à ajouter via waveagentdev pendant la démo)

- Filtres / recherche avancée
- i18n FR/EN
- Pages Contact / À propos
- Avis clients
- Backend mock / persistance
- Tests Vitest
