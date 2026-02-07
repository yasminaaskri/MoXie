# TILI - Design System Documentation

## 🎨 Mobile-First Design Philosophy

Cette application suit une approche **mobile-first** avec Tailwind CSS, garantissant une expérience optimale sur tous les appareils.

## 📱 Breakpoints Responsifs

```
Mobile:  < 640px  (default, no prefix)
Tablet:  ≥ 640px  (sm:)
Desktop: ≥ 1024px (lg:)
Large:   ≥ 1280px (xl:)
```

## 🎯 Composants Principaux

### 1. Sidebar Navigation
**Mobile:** 
- Hamburger menu en haut
- Overlay avec slide-in animation
- Touch-friendly (44px+ targets)

**Desktop:**
- Sidebar fixe à gauche (256px)
- Navigation verticale
- Profil utilisateur en bas

**Classes Tailwind:**
```jsx
// Mobile header
className="lg:hidden fixed top-0 left-0 right-0 z-50"

// Desktop sidebar
className="hidden lg:flex lg:flex-col lg:w-64"
```

### 2. Page d'Accueil (Home)

**Layout:**
- Mobile: Stack vertical, padding 16px
- Desktop: Centré, max-width 1200px

**Cartes de fonctionnalités:**
```jsx
// Grid responsive
className="grid grid-cols-1 md:grid-cols-3 gap-4"

// Carte avec gradient
className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6"
```

### 3. Liste Utilisateurs (UserList)

**Mobile:** Cartes empilées
```jsx
<div className="lg:hidden space-y-3">
  {/* Card layout */}
</div>
```

**Desktop:** Tableau complet
```jsx
<div className="hidden lg:block">
  <table className="w-full">
    {/* Table layout */}
  </table>
</div>
```

**Stats Grid:**
```jsx
className="grid grid-cols-2 lg:grid-cols-4 gap-3"
```

### 4. Modal (Création/Édition)

**Mobile:**
- Bottom sheet (slide-up from bottom)
- Full width
- Rounded top corners

**Desktop:**
- Centered modal
- Max-width 500px
- Fully rounded

```jsx
// Modal container
className="fixed inset-0 z-50 flex items-end sm:items-center"

// Modal content
className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl"
```

### 5. Formulaires (Login/Register)

**Layout:**
- Centré verticalement et horizontalement
- Max-width 448px (md)
- Background gradient

**Inputs:**
```jsx
className="w-full px-4 py-3 border border-gray-300 rounded-xl 
           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
```

**Buttons:**
```jsx
// Primary button
className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 
           text-white rounded-xl font-semibold shadow-lg 
           hover:shadow-xl active:scale-95"
```

## 🎨 Palette de Couleurs

### Couleurs Principales
```js
primary: {
  500: '#0b5fff', // Blue primary
  600: '#0847cc', // Blue hover
}

brand: {
  brown: '#8b4b44',
  'brown-dark': '#6b2e2b',
}
```

### Rôles Utilisateurs
```js
responsable: 'bg-red-600'    // Rouge
chef:        'bg-blue-600'   // Bleu
consultant:  'bg-green-600'  // Vert
```

## 📐 Spacing Scale

```
gap-2  = 8px   // Petit espacement
gap-3  = 12px  // Espacement moyen
gap-4  = 16px  // Espacement standard
gap-6  = 24px  // Grand espacement
gap-8  = 32px  // Très grand espacement

p-4    = 16px  // Padding standard
p-6    = 24px  // Padding large
p-8    = 32px  // Padding extra-large
```

## 🔘 Touch Targets

Tous les éléments interactifs respectent la règle des **44px minimum**:

```jsx
// Boutons
className="px-6 py-3"  // ≥ 44px height

// Icons buttons
className="w-12 h-12"  // 48px × 48px
```

## 📱 UX Mobile Best Practices

### 1. Navigation
- ✅ Hamburger menu accessible
- ✅ Overlay pour fermer le menu
- ✅ Animations fluides (300ms)

### 2. Formulaires
- ✅ Inputs full-width sur mobile
- ✅ Labels clairs au-dessus
- ✅ Validation inline
- ✅ Boutons full-width

### 3. Listes
- ✅ Cartes au lieu de tableaux
- ✅ Swipe-friendly spacing
- ✅ Actions groupées en bas

### 4. Modals
- ✅ Bottom sheet sur mobile
- ✅ Scroll interne si contenu long
- ✅ Bouton fermeture accessible

## 🎭 Animations

```css
/* Slide up (modal mobile) */
animate-slide-up

/* Transitions */
transition-all
transition-colors
transition-transform

/* Hover effects */
hover:shadow-xl
hover:scale-[1.02]

/* Active states */
active:scale-95
active:scale-[0.98]
```

## ♿ Accessibilité

### Focus States
```jsx
focus:ring-2 focus:ring-blue-500 focus:border-transparent
```

### Contraste
- Texte principal: `text-gray-900`
- Texte secondaire: `text-gray-600`
- Background: `bg-gray-50`

### ARIA Labels
```jsx
<button aria-label="Toggle menu">
```

## 🚀 Performance

### Optimisations
- Lazy loading des images
- Transitions CSS (pas JS)
- Tailwind JIT mode
- PurgeCSS automatique

## 📦 Structure des Composants

```
src/
├── components/
│   └── Sidebar.js          # Navigation responsive
├── pages/
│   ├── Home.js             # Dashboard
│   ├── UserList.js         # Gestion utilisateurs
│   ├── Login.js            # Authentification
│   └── Register.js         # Inscription
├── layouts/
│   ├── AdminLayout.js      # Layout authentifié
│   └── PublicLayout.js     # Layout public
└── styles/
    └── index.css           # Tailwind + customs
```

## 🎯 Checklist Responsive

- ✅ Mobile-first approach
- ✅ Touch targets ≥ 44px
- ✅ No fixed widths
- ✅ Flexible grids
- ✅ Responsive typography
- ✅ Adaptive navigation
- ✅ Cards over tables on mobile
- ✅ Bottom sheets for modals
- ✅ Smooth animations
- ✅ Accessible focus states

## 🔧 Commandes Utiles

```bash
# Démarrer le dev server
npm start

# Build production
npm run build

# Analyser le bundle
npm run build -- --stats
```

---

**Design System Version:** 1.0.0  
**Last Updated:** 2026-02-07  
**Framework:** React + Tailwind CSS
