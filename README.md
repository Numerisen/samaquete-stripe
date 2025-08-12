# SamaQuête – API Stripe (Vercel)

API serverless gratuite à déployer sur Vercel pour créer une PaymentSheet Stripe.

## Déploiement

1. **Créer un projet Vercel** (via GitHub ou import).
2. Dans *Project Settings → Environment Variables*, ajoute:
   - `STRIPE_SECRET_KEY` = `sk_test_...` (clé secrète Stripe)
   - (optionnel) `ALLOWED_ORIGINS` = `*` ou `https://<ton-domaine-expo.dev>` (séparés par virgules)
3. `vercel deploy` ou bouton *Deploy* dans le dashboard.
4. L'endpoint sera: `https://<ton-projet>.vercel.app/api/create-payment-sheet`

Dans ton app Expo, mets:
```
EXPO_PUBLIC_BACKEND_URL=https://<ton-projet>.vercel.app/api
```

## Remarque devise
Stripe **ne supporte pas XOF** nativement en Payment Intents. Utilise `usd`/`eur` en test
ou intègre PayDunya pour les paiements locaux. Le montant est exprimé en **cents** pour USD.
# samaquete-stripe
