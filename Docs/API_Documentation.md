# Documentation API - ClinicBoard

## 📋 Vue d'ensemble

Cette documentation détaille l'API de tous les modules de l'application ClinicBoard. Chaque module expose des fonctions spécifiques pour la gestion des données et des interactions utilisateur.

## 🏗️ Architecture des Modules

```
app.js (Orchestrateur principal)
├── Modules/
│   ├── authentification.js   # Gestion de l'authentification
│   ├── patients.js           # Gestion des patients
│   ├── appointment.js        # Gestion des rendez-vous
│   ├── finance.js            # Gestion financière
│   └── component.js          # Composants UI
├── Router/
│   └── router.js             # Système de routage SPA
├── Security/
│   ├── hash.js               # Hachage des mots de passe
│   └── validator.js          # Validation des données
└── Storage/
    └── storage.js            # Gestion du LocalStorage
```

## 🔐 Module d'Authentification (`authentification.js`)

### Description
Gère l'authentification des utilisateurs, la sécurité des comptes et la gestion des sessions.

### Fonctions Principales

#### `handleLogin(username, password)`
**Description** : Authentifie un utilisateur avec vérification du hash du mot de passe.

**Paramètres** :
- `username` (string) : Nom d'utilisateur
- `password` (string) : Mot de passe en texte clair

**Retour** : `Promise<void>`

**Processus** :
1. Vérification du verrouillage du compte
2. Validation des données d'entrée
3. Hachage du mot de passe avec SHA-256
4. Recherche de l'utilisateur dans la base
5. Gestion des tentatives de connexion
6. Création de session si succès

**Exemple d'utilisation** :
```javascript
await auth.handleLogin('admin', 'motdepasse123');
```

#### `handleRegister(username, password, confirmPassword)`
**Description** : Crée un nouveau compte utilisateur avec validation complète.

**Paramètres** :
- `username` (string) : Nom d'utilisateur souhaité
- `password` (string) : Mot de passe en texte clair
- `confirmPassword` (string) : Confirmation du mot de passe

**Retour** : `Promise<void>`

**Processus** :
1. Vérification de la correspondance des mots de passe
2. Validation des données d'inscription
3. Vérification de l'unicité du nom d'utilisateur
4. Hachage sécurisé du mot de passe
5. Création du profil utilisateur
6. Sauvegarde dans LocalStorage

**Exemple d'utilisation** :
```javascript
await auth.handleRegister('admin', 'motdepasse123', 'motdepasse123');
```

#### `handleLogout()`
**Description** : Déconnecte l'utilisateur actuel et nettoie la session.

**Paramètres** : Aucun

**Retour** : `void`

**Processus** :
1. Suppression des données de session
2. Nettoyage des informations utilisateur
3. Redirection vers la page de connexion

**Exemple d'utilisation** :
```javascript
auth.handleLogout();
```

### Fonctions de Sécurité

#### `isAccountLocked(username)`
**Description** : Vérifie si un compte est temporairement verrouillé.

**Paramètres** :
- `username` (string) : Nom d'utilisateur à vérifier

**Retour** : `boolean` - true si verrouillé, false sinon

#### `addLoginAttempt(username, success)`
**Description** : Enregistre une tentative de connexion pour la sécurité.

**Paramètres** :
- `username` (string) : Nom d'utilisateur
- `success` (boolean) : Résultat de la tentative

**Retour** : `void`

## 👥 Module Patients (`patients.js`)

### Description
Gère le CRUD complet des patients avec recherche et validation.

### Fonctions Principales

#### `createPatient(patientData)`
**Description** : Crée un nouveau patient avec validation complète.

**Paramètres** :
- `patientData` (Object) : Données du patient
  - `fullName` (string) : Nom complet (obligatoire)
  - `phone` (string) : Numéro de téléphone (obligatoire, unique)
  - `email` (string) : Adresse email (optionnelle, unique)
  - `notes` (string) : Notes médicales (optionnelles)

**Retour** : `boolean` - true si succès, false sinon

**Validation** :
- Vérification des champs obligatoires
- Contrôle d'unicité du téléphone et email
- Validation des formats de données

**Exemple d'utilisation** :
```javascript
const patientData = {
    fullName: 'Jean Dupont',
    phone: '0123456789',
    email: 'jean.dupont@email.com',
    notes: 'Allergie aux pénicillines'
};

if (patients.createPatient(patientData)) {
    console.log('Patient créé avec succès');
}
```

#### `readPatient()`
**Description** : Récupère la liste complète des patients.

**Paramètres** : Aucun

**Retour** : `Array<Object>` - Liste des patients

**Exemple d'utilisation** :
```javascript
const allPatients = patients.readPatient();
console.log(`Nombre de patients : ${allPatients.length}`);
```

#### `updatePatient(patientId, patientData)`
**Description** : Met à jour les informations d'un patient existant.

**Paramètres** :
- `patientId` (number) : ID unique du patient
- `patientData` (Object) : Nouvelles données (partielles ou complètes)

**Retour** : `boolean` - true si succès, false sinon

**Exemple d'utilisation** :
```javascript
const updatedData = {
    fullName: 'Jean Dupont-Marin',
    notes: 'Nouvelles notes médicales'
};

if (patients.updatePatient(123, updatedData)) {
    console.log('Patient mis à jour');
}
```

#### `deletePatient(patientId)`
**Description** : Supprime définitivement un patient.

**Paramètres** :
- `patientId` (number) : ID unique du patient

**Retour** : `boolean` - true si succès, false sinon

**Exemple d'utilisation** :
```javascript
if (patients.deletePatient(123)) {
    console.log('Patient supprimé');
}
```

#### `searchPatient(searchTerm)`
**Description** : Recherche des patients selon un terme multi-critères.

**Paramètres** :
- `searchTerm` (string) : Terme de recherche

**Retour** : `Array<Object>` - Patients correspondants

**Critères de recherche** :
- Nom complet (recherche partielle)
- Numéro de téléphone
- Adresse email

**Exemple d'utilisation** :
```javascript
const results = patients.searchPatient('Jean');
console.log(`Trouvé ${results.length} patients`);
```

## 📅 Module Rendez-vous (`appointment.js`)

### Description
Gère la création, modification et suivi des rendez-vous avec détection de conflits.

### Fonctions Principales

#### `createAppointment(appointmentData)`
**Description** : Crée un nouveau rendez-vous avec validation et détection de conflits.

**Paramètres** :
- `appointmentData` (Object) : Données du rendez-vous
  - `patientId` (number) : ID du patient (obligatoire)
  - `date` (string) : Date du rendez-vous (obligatoire, format YYYY-MM-DD)
  - `time` (string) : Heure du rendez-vous (obligatoire, format HH:MM)
  - `duration` (number) : Durée en minutes (optionnel, défaut: 30)
  - `notes` (string) : Notes du rendez-vous (optionnelles)

**Retour** : `boolean` - true si succès, false sinon

**Validation** :
- Vérification des champs obligatoires
- Détection des conflits de créneaux
- Vérification de l'existence du patient

**Exemple d'utilisation** :
```javascript
const appointmentData = {
    patientId: 123,
    date: '2024-12-25',
    time: '14:30',
    duration: 45,
    notes: 'Consultation de contrôle'
};

if (appointments.createAppointment(appointmentData)) {
    console.log('Rendez-vous créé');
}
```

#### `readAppointment()`
**Description** : Récupère la liste complète des rendez-vous.

**Paramètres** : Aucun

**Retour** : `Array<Object>` - Liste des rendez-vous

#### `updateAppointment(appointmentId, appointmentData)`
**Description** : Met à jour les informations d'un rendez-vous.

**Paramètres** :
- `appointmentId` (number) : ID unique du rendez-vous
- `appointmentData` (Object) : Nouvelles données

**Retour** : `boolean` - true si succès, false sinon

#### `updateAppointmentStatus(appointmentId, status)`
**Description** : Met à jour uniquement le statut d'un rendez-vous.

**Paramètres** :
- `appointmentId` (number) : ID unique du rendez-vous
- `status` (string) : Nouveau statut

**Statuts possibles** :
- `'scheduled'` : Programmé
- `'confirmed'` : Confirmé
- `'completed'` : Terminé
- `'cancelled'` : Annulé

**Retour** : `boolean` - true si succès, false sinon

**Exemple d'utilisation** :
```javascript
if (appointments.updateAppointmentStatus(456, 'confirmed')) {
    console.log('Statut mis à jour');
}
```

#### `deleteAppointment(appointmentId)`
**Description** : Supprime définitivement un rendez-vous.

**Paramètres** :
- `appointmentId` (number) : ID unique du rendez-vous

**Retour** : `boolean` - true si succès, false sinon

## 💰 Module Finances (`finance.js`)

### Description
Gère l'enregistrement des recettes et dépenses avec calculs financiers.

### Fonctions Principales

#### `createIncome(incomeData)`
**Description** : Enregistre une nouvelle recette.

**Paramètres** :
- `incomeData` (Object) : Données de la recette
  - `amount` (number) : Montant (obligatoire, > 0)
  - `method` (string) : Méthode de paiement (optionnel, défaut: "cash")
  - `description` (string) : Description (optionnelle)

**Méthodes de paiement** :
- `"cash"` : Espèces
- `"card"` : Carte bancaire
- `"transfer"` : Virement
- `"check"` : Chèque
- `"other"` : Autre

**Retour** : `boolean` - true si succès, false sinon

**Exemple d'utilisation** :
```javascript
const incomeData = {
    amount: 150.00,
    method: 'card',
    description: 'Consultation Dr. Martin'
};

if (finances.createIncome(incomeData)) {
    console.log('Recette enregistrée');
}
```

#### `createExpense(expenseData)`
**Description** : Enregistre une nouvelle dépense.

**Paramètres** :
- `expenseData` (Object) : Données de la dépense
  - `amount` (number) : Montant (obligatoire, > 0)
  - `category` (string) : Catégorie (optionnel, défaut: "other")
  - `description` (string) : Description (optionnelle)

**Catégories** :
- `"equipment"` : Équipement médical
- `"supplies"` : Fournitures
- `"personnel"` : Personnel
- `"utilities"` : Services publics
- `"rent"` : Loyer
- `"marketing"` : Marketing
- `"other"` : Autre

**Retour** : `boolean` - true si succès, false sinon

**Exemple d'utilisation** :
```javascript
const expenseData = {
    amount: 75.50,
    category: 'supplies',
    description: 'Achat de matériel médical'
};

if (finances.createExpense(expenseData)) {
    console.log('Dépense enregistrée');
}
```

#### `calculateMargin()`
**Description** : Calcule la marge bénéficiaire globale.

**Paramètres** : Aucun

**Retour** : `Object` - Métriques financières
- `totalIncome` (number) : Revenus totaux
- `totalExpense` (number) : Dépenses totales
- `margin` (number) : Marge bénéficiaire

**Exemple d'utilisation** :
```javascript
const metrics = finances.calculateMargin();
console.log(`Marge: ${metrics.margin}€`);
```

#### `getMonthlyData(month, year)`
**Description** : Récupère les données financières pour un mois spécifique.

**Paramètres** :
- `month` (number) : Mois (0-11, 0 = janvier)
- `year` (number) : Année (ex: 2024)

**Retour** : `Object` - Données mensuelles
- `incomes` (Array) : Revenus du mois
- `expenses` (Array) : Dépenses du mois
- `totalIncome` (number) : Total des revenus
- `totalExpense` (number) : Total des dépenses

**Exemple d'utilisation** :
```javascript
const monthlyData = finances.getMonthlyData(11, 2024); // Décembre 2024
console.log(`CA mensuel: ${monthlyData.totalIncome}€`);
```

## 🔒 Module Sécurité (`Security/`)

### Module Hash (`hash.js`)

#### `hashPassword(password)`
**Description** : Hache un mot de passe avec SHA-256.

**Paramètres** :
- `password` (string) : Mot de passe en texte clair

**Retour** : `Promise<string>` - Hash hexadécimal

**Exemple d'utilisation** :
```javascript
const hashedPassword = await hash.hashPassword('motdepasse123');
```

### Module Validator (`validator.js`)

#### `loginValidator(username, password)`
**Description** : Valide les données de connexion.

**Paramètres** :
- `username` (string) : Nom d'utilisateur
- `password` (string) : Mot de passe

**Retour** : `Object` - Résultat de validation
- `isValid` (boolean) : true si valide
- `errors` (Array<string>) : Messages d'erreur

#### `registerValidator(username, password)`
**Description** : Valide les données d'inscription.

**Paramètres** :
- `username` (string) : Nom d'utilisateur
- `password` (string) : Mot de passe

**Retour** : `Object` - Résultat de validation

#### `patientValidator(patientData)`
**Description** : Valide les données d'un patient.

**Paramètres** :
- `patientData` (Object) : Données du patient

**Retour** : `Object` - Résultat de validation

#### `incomeValidator(incomeData)`
**Description** : Valide les données d'une recette.

**Paramètres** :
- `incomeData` (Object) : Données de la recette

**Retour** : `Object` - Résultat de validation

#### `expenseValidator(expenseData)`
**Description** : Valide les données d'une dépense.

**Paramètres** :
- `expenseData` (Object) : Données de la dépense

**Retour** : `Object` - Résultat de validation

#### `appointmentValidator(appointmentData)`
**Description** : Valide les données d'un rendez-vous.

**Paramètres** :
- `appointmentData` (Object) : Données du rendez-vous

**Retour** : `Object` - Résultat de validation

## 🗄️ Module Stockage (`storage.js`)

### Description
Gère les opérations CRUD sur le LocalStorage avec gestion d'erreurs.

### Fonctions Principales

#### `init()`
**Description** : Initialise les clés de stockage si elles n'existent pas.

**Paramètres** : Aucun

**Retour** : `void`

#### `insert(key, data)`
**Description** : Insère une nouvelle donnée dans une collection.

**Paramètres** :
- `key` (string) : Clé de la collection
- `data` (Object) : Données à insérer

**Retour** : `boolean` - true si succès, false sinon

#### `select(key)`
**Description** : Récupère toutes les données d'une collection.

**Paramètres** :
- `key` (string) : Clé de la collection

**Retour** : `Array` - Données de la collection

#### `update(key, id, newData)`
**Description** : Met à jour une donnée existante.

**Paramètres** :
- `key` (string) : Clé de la collection
- `id` (number) : ID de l'élément à modifier
- `newData` (Object) : Nouvelles données

**Retour** : `boolean` - true si succès, false sinon

#### `delete(key, id)`
**Description** : Supprime une donnée.

**Paramètres** :
- `key` (string) : Clé de la collection
- `id` (number) : ID de l'élément à supprimer

**Retour** : `boolean` - true si succès, false sinon

## 🧭 Module Router (`router.js`)

### Description
Gère la navigation dans l'application SPA.

### Fonctions Principales

#### `router(page)`
**Description** : Navigue vers une page spécifique de l'application.

**Paramètres** :
- `page` (string) : Nom de la page à afficher

**Pages disponibles** :
- `'login'` : Page de connexion
- `'register'` : Page d'inscription
- `'dashboard'` : Tableau de bord
- `'patients'` : Gestion des patients
- `'appointments'` : Gestion des rendez-vous
- `'finances'` : Gestion financière

**Retour** : `void`

**Exemple d'utilisation** :
```javascript
router('dashboard'); // Navigue vers le tableau de bord
```

## 🎨 Module Composants (`component.js`)

### Description
Génère les composants UI de l'application.

### Fonctions Principales

#### `loginForm()`
**Description** : Génère le formulaire de connexion.

**Retour** : `string` - HTML du formulaire

#### `registerForm()`
**Description** : Génère le formulaire d'inscription.

**Retour** : `string` - HTML du formulaire

#### `dashboard(username)`
**Description** : Génère le tableau de bord.

**Paramètres** :
- `username` (string) : Nom d'utilisateur connecté

**Retour** : `string` - HTML du tableau de bord

#### `patients(username)`
**Description** : Génère la page de gestion des patients.

**Paramètres** :
- `username` (string) : Nom d'utilisateur connecté

**Retour** : `string` - HTML de la page

#### `appointments(username)`
**Description** : Génère la page de gestion des rendez-vous.

**Paramètres** :
- `username` (string) : Nom d'utilisateur connecté

**Retour** : `string` - HTML de la page

#### `finances(username)`
**Description** : Génère la page de gestion financière.

**Paramètres** :
- `username` (string) : Nom d'utilisateur connecté

**Retour** : `string` - HTML de la page

#### `patientForm()`
**Description** : Génère le formulaire d'ajout de patient.

**Retour** : `string` - HTML du formulaire

#### `appointmentForm(patientsList)`
**Description** : Génère le formulaire de création de rendez-vous.

**Paramètres** :
- `patientsList` (Array) : Liste des patients pour le sélecteur

**Retour** : `string` - HTML du formulaire

#### `incomeForm()`
**Description** : Génère le formulaire d'ajout de recette.

**Retour** : `string` - HTML du formulaire

#### `expenseForm()`
**Description** : Génère le formulaire d'ajout de dépense.

**Retour** : `string` - HTML du formulaire

#### `showMessage(message, type)`
**Description** : Affiche un message à l'utilisateur.

**Paramètres** :
- `message` (string) : Message à afficher
- `type` (string) : Type de message ('success', 'error', 'info')

**Retour** : `void`

## 🔧 Utilisation des Modules

### Import des Modules
```javascript
// Dans app.js
import auth from './Modules/authentification.js';
import patients from './Modules/patients.js';
import appointments from './Modules/appointment.js';
import finances from './Modules/finance.js';
import components from './Modules/component.js';
import router from './Router/router.js';
import storage from './Storage/storage.js';
```

### Exemple d'Utilisation Complète
```javascript
// Initialisation
storage.init();

// Création d'un patient
const patientData = {
    fullName: 'Marie Martin',
    phone: '0987654321',
    email: 'marie.martin@email.com',
    notes: 'Patient régulier'
};

if (patients.createPatient(patientData)) {
    console.log('Patient créé');
    
    // Création d'un rendez-vous
    const appointmentData = {
        patientId: 123, // ID du patient créé
        date: '2024-12-25',
        time: '10:00',
        duration: 30,
        notes: 'Consultation de routine'
    };
    
    if (appointments.createAppointment(appointmentData)) {
        console.log('Rendez-vous créé');
    }
}
```

## ⚠️ Gestion des Erreurs

Tous les modules retournent des valeurs booléennes ou des objets de validation pour indiquer le succès ou l'échec des opérations. Les messages d'erreur sont affichés automatiquement via le système de composants.

## 📝 Notes Importantes

- Tous les modules utilisent le LocalStorage pour la persistance
- Les IDs sont générés automatiquement avec `Date.now()`
- La validation est effectuée côté client
- Les opérations sont synchrones sauf pour le hachage des mots de passe
- Les timestamps sont au format ISO 8601
