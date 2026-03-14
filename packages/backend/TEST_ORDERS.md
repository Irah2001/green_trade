# Test du système de commandes avec emails

## Prérequis
- Backend en cours d'exécution sur http://localhost:4000
- MongoDB en cours d'exécution
- Un utilisateur inscrit (acheteur)
- Un utilisateur vendeur avec un produit

## Étapes de test

### 1. Inscription d'un acheteur
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "acheteur@test.com",
    "password": "Test1234!",
    "firstName": "Jean",
    "lastName": "Acheteur",
    "role": "buyer"
  }'
```
**Attendu :** Email de bienvenue envoyé à acheteur@test.com

### 2. Inscription d'un vendeur
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendeur@test.com",
    "password": "Test1234!",
    "firstName": "Marie",
    "lastName": "Productrice",
    "role": "seller"
  }'
```
**Attendu :** Email de bienvenue envoyé à vendeur@test.com

### 3. Connexion du vendeur
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendeur@test.com",
    "password": "Test1234!"
  }'
```
**Récupérer le token JWT** pour créer un produit

### 4. Créer un produit (avec le token du vendeur)
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_VENDEUR>" \
  -d '{
    "title": "Tomates Bio",
    "description": "Tomates fraîches du jardin",
    "price": 5.99,
    "category": "légumes",
    "condition": "new",
    "images": ["https://example.com/tomate.jpg"]
  }'
```
**Récupérer l'ID du produit créé**

### 5. Connexion de l'acheteur
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "acheteur@test.com",
    "password": "Test1234!"
  }'
```
**Récupérer le token JWT** pour passer une commande

### 6. Créer une commande (avec le token de l'acheteur)
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ACHETEUR>" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "quantity": 3
  }'
```

**Attendu :**
- ✅ Commande créée avec succès
- ✅ Email de confirmation envoyé à **acheteur@test.com**
- ✅ Email de notification envoyé à **vendeur@test.com**

### 7. Vérifier les emails dans Mailtrap
1. Allez sur https://mailtrap.io
2. Connectez-vous à votre compte
3. Ouvrez votre inbox
4. Vous devriez voir :
   - 2 emails de bienvenue (acheteur + vendeur)
   - 1 email de confirmation de commande (pour l'acheteur)
   - 1 email de notification de nouvelle commande (pour le vendeur)

### 8. Récupérer mes commandes
```bash
curl -X GET http://localhost:4000/api/orders \
  -H "Authorization: Bearer <TOKEN_ACHETEUR>"
```

### 9. Mettre à jour le statut de la commande (vendeur uniquement)
```bash
curl -X PATCH http://localhost:4000/api/orders/<ORDER_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_VENDEUR>" \
  -d '{
    "status": "confirmed"
  }'
```

## Vérification des templates d'emails

### Email de confirmation (acheteur)
- Sujet : "Confirmation de votre commande"
- Contenu : Prénom, nom du produit, quantité, montant total
- Style : Vert GreenTrade (#22c55e)

### Email de notification (vendeur)
- Sujet : "Nouvelle commande reçue"
- Contenu : Nom producteur, produit commandé, quantité, nom acheteur
- Style : Vert GreenTrade (#22c55e)

## Swagger Documentation
Consultez http://localhost:4000/api-docs pour tester directement dans l'interface Swagger.

## Résolution de problèmes

### Erreur "Non authentifié"
- Vérifiez que le token JWT est bien inclus dans l'en-tête Authorization
- Format : `Authorization: Bearer <votre_token>`

### Erreur "Produit non trouvé"
- Vérifiez que l'ID du produit est correct
- Assurez-vous que le produit existe et est actif

### Emails non reçus
- Vérifiez les logs du backend pour voir si les emails ont été envoyés
- Consultez votre inbox Mailtrap
- Vérifiez que EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD sont corrects dans .env
