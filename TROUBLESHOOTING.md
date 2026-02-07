# 🔧 Guide de Dépannage - Assistant Vocal IA

## L'IA ne génère rien

### 1. Vérifier que le serveur backend est démarré

```bash
cd backend
npm start
```

Vous devriez voir :
```
Serveur démarré sur le port 5000
MongoDB connecté avec succès
```

### 2. Tester l'endpoint AI manuellement

```bash
cd backend
node test-ai-endpoint.js
```

Si ça fonctionne, vous verrez :
```
✅ Succès!
📄 Titre: Document sur Rapport sur les ventes de février
📝 Contenu: ...
```

### 3. Vérifier la console du navigateur

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Parlez dans le micro
4. Vous devriez voir :
   - `🎤 Commande vocale reçue: [votre texte]`
   - `✅ Traitement du sujet: [votre texte]`
   - `🎯 Génération du contenu pour: [votre texte]`
   - `📡 Réponse reçue: 200`
   - `✅ Contenu généré: {...}`

### 4. Problèmes courants

#### Erreur: "Failed to fetch"
- ✅ Le serveur backend n'est pas démarré
- ✅ Le port 5000 est utilisé par une autre application
- ✅ CORS n'est pas configuré correctement

**Solution:**
```bash
cd backend
npm start
```

#### Erreur: "Commande trop courte"
- ✅ Vous n'avez pas parlé assez longtemps
- ✅ Le micro n'a pas capté votre voix

**Solution:** Parlez plus fort et plus clairement

#### Le micro ne fonctionne pas
- ✅ Vérifiez les permissions du navigateur
- ✅ Testez votre micro dans les paramètres système

#### Le PDF n'est pas créé
- ✅ Vérifiez que MongoDB est démarré
- ✅ Vérifiez que le dossier `uploads` existe

**Solution:**
```bash
cd backend
mkdir uploads
```

### 5. Test manuel complet

1. Démarrer MongoDB:
```bash
mongod
```

2. Démarrer le backend:
```bash
cd backend
npm start
```

3. Démarrer le frontend:
```bash
cd frontend
npm start
```

4. Ouvrir http://localhost:3000
5. Cliquer sur "🎤 Assistant Vocal IA"
6. Cliquer sur "Commencer à parler"
7. Dire: "Rapport sur les ventes"
8. Attendre la génération

### 6. Logs utiles

Dans le backend, ajoutez des logs:
```javascript
console.log('Topic reçu:', topic);
console.log('Contenu généré:', generatedContent);
```

### 7. Contacter le support

Si le problème persiste:
1. Copiez les logs de la console
2. Copiez les logs du serveur
3. Décrivez exactement ce que vous avez dit
4. Décrivez ce qui s'est passé (ou pas)
