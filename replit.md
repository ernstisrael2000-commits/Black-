# Black Store — Boutique e-commerce premium en ligne (interface française)

## Run & Operate
- `npm run dev` — Démarre le serveur de développement sur port 5000
- `npm run build` — Build de production

### Variables d'environnement requises (Firebase)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_EMAILS` — emails séparés par virgule pour l'accès admin

## Stack
- **Frontend**: React 19 + Vite 8 + TypeScript 6
- **Styling**: Tailwind CSS 3 + Framer Motion (animations)
- **State**: Zustand (cart, wishlist, auth, ui) avec persistence localStorage
- **Data fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **Backend/DB**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router DOM v7

## Where things live
- `src/pages/` — Pages principales (Home, Shop, Cart, Checkout, Account, etc.)
- `src/pages/admin/` — Dashboard admin (produits, commandes, promos)
- `src/components/layout/` — Navbar, Footer, Layout
- `src/components/ui/` — Composants réutilisables (Button, Input, ProductCard, etc.)
- `src/firebase/` — Services Firebase (auth, products, orders, reviews, promos)
- `src/store/` — Stores Zustand (cart, wishlist, auth, ui)
- `src/types/index.ts` — Types TypeScript globaux
- `src/utils/format.ts` — Utilitaires de formatage

## Architecture decisions
- **Devise**: HTG (Gourdes haïtiennes) par défaut, USD disponible — toggle dans la navbar
- **Produits affiliés**: Champ `isAffiliate` + `affiliateLink` — redirection automatique vers site partenaire
- **Admin**: Accessible via `/admin` — protégé par `user.isAdmin` dans Firestore
- **Démo**: `seedDemoProducts()` appelé au chargement de l'accueil pour pré-peupler les produits si Firestore est vide
- **Panier**: Persisté en localStorage via Zustand persist middleware

## Product
- Accueil avec slider hero, catégories, produits vedettes et populaires
- Boutique avec filtres (catégorie, prix, tri) et pagination
- Fiche produit avec galerie, avis, produits similaires
- Panier intelligent avec codes promo et choix livraison
- Checkout en 3 étapes: livraison → paiement → confirmation
- Paiements: MasterCard, PayPal, MonCash, NatCash
- Compte utilisateur: profil, historique commandes, suivi
- Favoris (wishlist) persistants
- Admin: dashboard stats, gestion produits/commandes/promos
- PWA (manifest.json)

## User preferences
- Interface entièrement en français
- Thème sombre premium (noir #0A0A0A + or #C9A84C)

## Gotchas
- Firebase doit être configuré avant de tester les fonctionnalités dynamiques
- Les emails admin doivent être dans `VITE_ADMIN_EMAILS` (séparés par virgule)
- Le taux de change HTG/USD est fixé à 132 dans cartStore.ts
