# 📱 TILI - Application Mobile-First

## ✨ Caractéristiques

### 🎯 Design Mobile-First
- Interface optimisée pour mobile en priorité
- Navigation hamburger sur mobile, sidebar sur desktop
- Cartes sur mobile, tableaux sur desktop
- Touch targets ≥ 44px pour une meilleure UX tactile

### 🎨 Technologies
- **React** - Framework UI
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Navigation
- **Axios** - API calls

### 📐 Responsive Breakpoints
```
📱 Mobile:  < 640px  (default)
📱 Tablet:  ≥ 640px  (sm:)
💻 Desktop: ≥ 1024px (lg:)
🖥️  Large:   ≥ 1280px (xl:)
```

## 🚀 Démarrage Rapide

### Installation
```bash
cd frontend
npm install
```

### Développement
```bash
npm start
```
L'application sera accessible sur `http://localhost:3000`

### Build Production
```bash
npm run build
```

## 📱 Aperçu des Écrans

### 1. Login / Register
- **Mobile:** Formulaire centré, full-width inputs
- **Desktop:** Card centrée avec max-width
- Background gradient marron (brand colors)
- Validation inline avec messages d'erreur

### 2. Home (Dashboard)
- **Mobile:** Stack vertical avec cartes
- **Desktop:** Grid 3 colonnes pour les features
- Profil utilisateur avec avatar
- Accès rapide aux sections

### 3. Gestion Utilisateurs
- **Mobile:** Liste de cartes empilées
  - Avatar + nom + email
  - Badge de rôle coloré
  - Actions en bas de carte
- **Desktop:** Tableau complet
  - Colonnes: Utilisateur, Email, Rôle, Date, Actions
  - Hover effects
  - Actions inline

### 4. Modal Création/Édition
- **Mobile:** Bottom sheet (slide from bottom)
  - Full width
  - Rounded top corners
  - Boutons full-width
- **Desktop:** Modal centré
  - Max-width 500px
  - Fully rounded
  - Boutons inline

## 🎨 Design System

### Couleurs Principales
```css
/* Brand Colors */
--brand-brown: #8b4b44
--brand-brown-dark: #6b2e2b

/* Primary Colors */
--primary-blue: #0b5fff
--primary-cyan: #06b6d4

/* Role Colors */
--role-responsable: #dc2626 (red)
--role-chef: #0b5fff (blue)
--role-consultant: #059669 (green)
```

### Typography
```css
/* Headings */
text-3xl md:text-4xl lg:text-5xl  /* Responsive heading */
font-serif                         /* Playfair Display for titles */

/* Body */
text-sm md:text-base              /* Responsive body text */
text-gray-900                     /* Primary text */
text-gray-600                     /* Secondary text */
```

### Spacing
```css
/* Mobile-first spacing */
p-4 md:p-6 lg:p-8                /* Responsive padding */
gap-3 md:gap-4 lg:gap-6          /* Responsive gaps */
space-y-3 md:space-y-4           /* Vertical spacing */
```

## 🎯 Composants Réutilisables

### Button Primary
```jsx
<button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-xl font-semibold shadow-lg 
                   hover:shadow-xl transition-all active:scale-95">
  Texte du bouton
</button>
```

### Card
```jsx
<div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg 
                transition-shadow">
  {/* Contenu */}
</div>
```

### Input
```jsx
<input className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  transition-all" />
```

### Badge de Rôle
```jsx
<span className="inline-block px-4 py-2 rounded-full text-white 
                 text-sm font-semibold bg-blue-600">
  Chef de projet
</span>
```

## 📱 UX Mobile Best Practices Implémentées

### ✅ Navigation
- Hamburger menu accessible en haut à droite
- Overlay semi-transparent pour fermer
- Animations fluides (300ms transitions)
- Menu se ferme automatiquement après navigation

### ✅ Touch Targets
- Tous les boutons ≥ 44px de hauteur
- Espacement suffisant entre éléments cliquables
- Zones de touch étendues pour les petits icons

### ✅ Formulaires
- Labels clairs au-dessus des inputs
- Inputs full-width sur mobile
- Validation inline avec messages d'erreur
- Boutons d'action full-width sur mobile

### ✅ Listes & Tableaux
- Cartes sur mobile (plus faciles à scanner)
- Tableaux sur desktop (plus d'informations)
- Scroll horizontal si nécessaire
- Actions groupées et accessibles

### ✅ Modals
- Bottom sheet sur mobile (plus naturel)
- Modal centré sur desktop
- Backdrop pour fermer
- Scroll interne si contenu long

## 🎭 Animations & Transitions

```css
/* Hover effects */
hover:shadow-xl
hover:scale-[1.02]
hover:bg-blue-700

/* Active states (touch feedback) */
active:scale-95
active:scale-[0.98]

/* Transitions */
transition-all
transition-colors
transition-transform
transition-shadow
```

## ♿ Accessibilité

### Focus States
Tous les éléments interactifs ont des focus states visibles:
```css
focus:ring-2 focus:ring-blue-500 focus:border-transparent
```

### Contraste
- Ratio de contraste ≥ 4.5:1 pour le texte
- Couleurs testées pour l'accessibilité

### Navigation Clavier
- Tab navigation fonctionnelle
- Enter/Space pour activer les boutons
- Escape pour fermer les modals

## 📊 Performance

### Optimisations
- Tailwind JIT mode (génération à la demande)
- PurgeCSS automatique en production
- Lazy loading des routes (si implémenté)
- Transitions CSS (pas JavaScript)

### Bundle Size
```bash
# Analyser le bundle
npm run build
```

## 🔧 Configuration Tailwind

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        brand: { /* ... */ }
      }
    }
  }
}
```

## 📝 Structure des Fichiers

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.js          # Navigation responsive
│   │   └── ProtectedRoute.js   # Route guard
│   ├── pages/
│   │   ├── Home.js             # Dashboard
│   │   ├── UserList.js         # Gestion utilisateurs
│   │   ├── Login.js            # Connexion
│   │   └── Register.js         # Inscription
│   ├── layouts/
│   │   ├── AdminLayout.js      # Layout authentifié
│   │   └── PublicLayout.js     # Layout public
│   ├── context/
│   │   └── AuthContext.js      # Gestion auth
│   ├── services/
│   │   └── api.js              # Axios config
│   ├── App.js                  # Root component
│   └── index.css               # Tailwind + customs
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎯 Checklist de Qualité

- ✅ Mobile-first design
- ✅ Responsive sur tous les breakpoints
- ✅ Touch targets ≥ 44px
- ✅ Pas de largeurs fixes
- ✅ Grids flexibles
- ✅ Typography responsive
- ✅ Navigation adaptative
- ✅ Cartes sur mobile, tableaux sur desktop
- ✅ Bottom sheets pour modals mobile
- ✅ Animations fluides
- ✅ Focus states accessibles
- ✅ Contraste suffisant
- ✅ Messages d'erreur clairs

## 🐛 Debugging

### Voir les breakpoints actifs
Ajoutez temporairement en bas de page:
```jsx
<div className="fixed bottom-0 right-0 bg-black text-white p-2 text-xs">
  <span className="sm:hidden">Mobile</span>
  <span className="hidden sm:inline md:hidden">Tablet</span>
  <span className="hidden md:inline lg:hidden">Desktop</span>
  <span className="hidden lg:inline">Large</span>
</div>
```

## 📚 Ressources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Mobile UX Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/principles)

---

**Version:** 1.0.0  
**Date:** 2026-02-07  
**Auteur:** TILI Team
