# Guide d'Installation - ClinicBoard

## 📋 Prérequis

### Navigateur Web
- **Chrome** : Version 80 ou supérieure
- **Firefox** : Version 75 ou supérieure
- **Safari** : Version 13 ou supérieure
- **Edge** : Version 80 ou supérieure

### Système d'Exploitation
- **Windows** : 10 ou supérieur
- **macOS** : 10.14 ou supérieur
- **Linux** : Ubuntu 18.04+ ou distribution équivalente

### Serveur Web (Recommandé)
- **Python** : 3.6 ou supérieur (pour serveur local)
- **Node.js** : 14 ou supérieur (optionnel)
- **Apache/Nginx** : Pour déploiement en production

## 🚀 Installation Rapide

### Étape 1 : Téléchargement
```bash
# Cloner le repository
git clone [URL_DU_REPOSITORY]
cd ClinicBoard

# Ou télécharger et extraire l'archive ZIP
```

### Étape 2 : Lancement Simple
```bash
# Option 1: Ouverture directe (limitations CORS)
# Double-clic sur index.html

# Option 2: Serveur local Python (recommandé)
python -m http.server 8000

# Option 3: Serveur local Node.js
npx http-server
```

### Étape 3 : Accès à l'Application
- **URL** : `http://localhost:8000`
- **Première utilisation** : Créer un compte administrateur

## 🔧 Installation Détaillée

### Méthode 1 : Serveur Python (Recommandée)

#### Installation de Python
```bash
# Windows (via Microsoft Store ou python.org)
# macOS (via Homebrew)
brew install python3

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install python3 python3-pip
```

#### Lancement du Serveur
```bash
# Naviguer vers le dossier du projet
cd ClinicBoard

# Lancer le serveur HTTP
python3 -m http.server 8000

# Ou avec Python 2 (si Python 3 n'est pas disponible)
python -m SimpleHTTPServer 8000
```

#### Vérification
- Ouvrir le navigateur
- Aller à `http://localhost:8000`
- Vérifier que l'application se charge correctement

### Méthode 2 : Serveur Node.js

#### Installation de Node.js
```bash
# Télécharger depuis nodejs.org
# Ou via gestionnaire de paquets

# Windows (via Chocolatey)
choco install nodejs

# macOS (via Homebrew)
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Installation d'http-server
```bash
# Installation globale
npm install -g http-server

# Ou installation locale
npm init -y
npm install http-server
```

#### Lancement du Serveur
```bash
# Depuis le dossier ClinicBoard
http-server -p 8000

# Ou avec npx (sans installation globale)
npx http-server -p 8000
```

### Méthode 3 : Serveur Apache/Nginx

#### Configuration Apache
```apache
# Dans le fichier de configuration Apache
<VirtualHost *:80>
    DocumentRoot /chemin/vers/ClinicBoard
    ServerName clinicboard.local
    
    <Directory /chemin/vers/ClinicBoard>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Configuration Nginx
```nginx
# Dans le fichier de configuration Nginx
server {
    listen 80;
    server_name clinicboard.local;
    root /chemin/vers/ClinicBoard;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 🔒 Configuration de Sécurité

### HTTPS (Recommandé pour la Production)

#### Certificat Auto-signé (Développement)
```bash
# Générer un certificat auto-signé
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Lancer le serveur avec HTTPS
python3 -m http.server 8000 --bind 127.0.0.1
# Puis configurer le proxy HTTPS
```

#### Certificat Let's Encrypt (Production)
```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-apache

# Génération du certificat
sudo certbot --apache -d votre-domaine.com
```

### Configuration des Headers de Sécurité
```apache
# Headers de sécurité Apache
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

## 🗄️ Configuration du Stockage

### LocalStorage
L'application utilise le LocalStorage du navigateur. Aucune configuration supplémentaire n'est nécessaire.

### Sauvegarde des Données
```javascript
// Script de sauvegarde (à exécuter dans la console du navigateur)
function backupData() {
    const data = {
        users: JSON.parse(localStorage.getItem('Users') || '[]'),
        patients: JSON.parse(localStorage.getItem('Patients') || '[]'),
        appointments: JSON.parse(localStorage.getItem('Appointments') || '[]'),
        incomes: JSON.parse(localStorage.getItem('Incomes') || '[]'),
        expenses: JSON.parse(localStorage.getItem('Expenses') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinicboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}
```

### Restauration des Données
```javascript
// Script de restauration (à exécuter dans la console du navigateur)
function restoreData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(data[key]));
        });
        alert('Données restaurées avec succès');
    };
    reader.readAsText(file);
}
```

## 🐛 Résolution des Problèmes

### Problème : CORS (Cross-Origin Resource Sharing)
**Symptôme** : Erreur CORS dans la console du navigateur
**Solution** : Utiliser un serveur web local au lieu d'ouvrir directement le fichier

### Problème : LocalStorage non disponible
**Symptôme** : Données non sauvegardées
**Solution** : 
- Vérifier que le navigateur supporte LocalStorage
- S'assurer que le mode privé n'est pas activé
- Vérifier les paramètres de confidentialité du navigateur

### Problème : Module non trouvé
**Symptôme** : Erreur "Module not found"
**Solution** :
- Vérifier que tous les fichiers sont présents
- S'assurer que le serveur web est lancé
- Vérifier les chemins des imports

### Problème : Performance lente
**Symptôme** : Application lente ou qui se bloque
**Solution** :
- Vérifier la quantité de données dans LocalStorage
- Nettoyer les données obsolètes
- Vérifier les ressources système

## 📊 Vérification de l'Installation

### Checklist de Vérification
- [ ] L'application se charge sans erreur
- [ ] La page de connexion s'affiche
- [ ] La création de compte fonctionne
- [ ] La connexion fonctionne
- [ ] Le tableau de bord s'affiche
- [ ] Les modules Patients, Rendez-vous et Finances sont accessibles
- [ ] Les données sont sauvegardées dans LocalStorage
- [ ] Les données persistent après rechargement

### Test de Fonctionnalités
```javascript
// Test dans la console du navigateur
console.log('Test de l\'installation ClinicBoard');

// Vérifier les modules
console.log('Modules disponibles:', {
    auth: typeof auth !== 'undefined',
    patients: typeof patients !== 'undefined',
    appointments: typeof appointments !== 'undefined',
    finances: typeof finances !== 'undefined'
});

// Vérifier le stockage
console.log('LocalStorage initialisé:', {
    users: localStorage.getItem('Users') !== null,
    patients: localStorage.getItem('Patients') !== null,
    appointments: localStorage.getItem('Appointments') !== null
});
```

## 🔄 Mise à Jour

### Mise à Jour du Code
```bash
# Sauvegarder les données existantes
# (Utiliser le script de sauvegarde ci-dessus)

# Mettre à jour le code
git pull origin main

# Restaurer les données
# (Utiliser le script de restauration ci-dessus)
```

### Mise à Jour des Données
L'application gère automatiquement la migration des données. Aucune action manuelle n'est nécessaire.

## 🚀 Déploiement en Production

### Préparation
1. **Sauvegarder les données** existantes
2. **Tester l'application** en local
3. **Configurer HTTPS** pour la sécurité
4. **Configurer les sauvegardes** automatiques

### Déploiement
1. **Uploader les fichiers** sur le serveur
2. **Configurer le serveur web** (Apache/Nginx)
3. **Configurer HTTPS** avec certificat SSL
4. **Tester l'application** en production
5. **Configurer les sauvegardes** régulières

### Configuration de Production
```apache
# Configuration Apache pour la production
<VirtualHost *:443>
    DocumentRoot /var/www/clinicboard
    ServerName clinicboard.votre-domaine.com
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # Headers de sécurité
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
    # Cache pour les fichiers statiques
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 month"
    </LocationMatch>
</VirtualHost>
```

## 📞 Support et Assistance

### Problèmes Courants
- Consulter la section "Résolution des Problèmes" ci-dessus
- Vérifier les logs de la console du navigateur
- Tester avec un autre navigateur

### Support Technique
- **Documentation** : Consulter les autres guides dans le dossier Docs/
- **Code source** : Commentaires JSDoc dans le code
- **Issues** : Créer une issue sur GitHub si nécessaire

### Maintenance
- **Sauvegardes** : Effectuer des sauvegardes régulières
- **Mises à jour** : Surveiller les mises à jour de sécurité
- **Monitoring** : Surveiller les performances et l'utilisation

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Compatibilité** : Navigateurs modernes, serveurs web standards
