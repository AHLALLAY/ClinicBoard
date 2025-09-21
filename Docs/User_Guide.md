# Guide Utilisateur - ClinicBoard

## 📋 Introduction

Bienvenue dans ClinicBoard, votre système de gestion pour cabinet de santé. Ce guide vous accompagnera dans l'utilisation de toutes les fonctionnalités de l'application.

## 🚀 Première Utilisation

### Création du Compte Administrateur
1. **Ouvrir l'application** dans votre navigateur
2. **Cliquer sur "Sign Up"** pour créer le premier compte
3. **Remplir le formulaire** :
   - Nom d'utilisateur (minimum 3 caractères)
   - Mot de passe (minimum 8 caractères)
   - Confirmation du mot de passe
4. **Valider l'inscription**
5. **Se connecter** avec les identifiants créés

### Interface Principale
- **Navigation** : Menu en haut avec accès aux modules
- **Tableau de bord** : Vue d'ensemble avec KPIs
- **Modules** : Patients, Rendez-vous, Finances
- **Profil** : Nom d'utilisateur et déconnexion

## 👥 Gestion des Patients

### Ajouter un Patient

#### Méthode 1 : Via le Tableau de Bord
1. **Cliquer sur "Add Patient"** dans la section Patients
2. **Remplir le formulaire** :
   - **Nom complet** (obligatoire) : Prénom et nom
   - **Téléphone** (obligatoire) : 10 chiffres exactement
   - **Email** (optionnel) : Adresse email valide
   - **Notes** (optionnel) : Informations médicales
3. **Cliquer sur "Add Patient"** pour valider

#### Méthode 2 : Via le Module Patients
1. **Aller dans "Patients"** via le menu
2. **Cliquer sur "Add Patient"** en haut à droite
3. **Suivre les étapes** ci-dessus

### Rechercher un Patient

#### Recherche Simple
1. **Utiliser la barre de recherche** en haut de la liste
2. **Taper le terme de recherche** :
   - Nom complet (partiel ou complet)
   - Numéro de téléphone
   - Adresse email
3. **Les résultats s'affichent** en temps réel

#### Filtres Avancés
- **Recherche par nom** : Tapez les premières lettres du nom
- **Recherche par téléphone** : Tapez le début du numéro
- **Recherche par email** : Tapez le début de l'adresse

### Modifier un Patient

#### Via la Liste des Patients
1. **Trouver le patient** dans la liste
2. **Cliquer sur "Modifier"** sur la carte du patient
3. **Modifier les informations** souhaitées
4. **Sauvegarder** les modifications

#### Informations Modifiables
- Nom complet
- Numéro de téléphone
- Adresse email
- Notes médicales

### Supprimer un Patient

#### Suppression avec Confirmation
1. **Trouver le patient** dans la liste
2. **Cliquer sur "Supprimer"** sur la carte du patient
3. **Confirmer la suppression** dans la boîte de dialogue
4. **Le patient est supprimé** définitivement

⚠️ **Attention** : La suppression est définitive et ne peut pas être annulée.

## 📅 Gestion des Rendez-vous

### Créer un Rendez-vous

#### Étapes de Création
1. **Cliquer sur "New Appointment"** (tableau de bord ou module)
2. **Sélectionner un patient** dans la liste déroulante
3. **Choisir la date** du rendez-vous
4. **Sélectionner l'heure** du rendez-vous
5. **Définir la durée** (15-120 minutes, défaut: 30 min)
6. **Ajouter des notes** (optionnel)
7. **Valider la création**

#### Validation Automatique
- **Vérification des conflits** : L'application détecte les créneaux occupés
- **Vérification du patient** : Le patient doit exister dans la base
- **Validation des horaires** : Heures et durées cohérentes

### Gérer les Statuts des Rendez-vous

#### Statuts Disponibles
- **Scheduled** (Programmé) : Rendez-vous créé, en attente
- **Confirmed** (Confirmé) : Rendez-vous confirmé par le patient
- **Completed** (Terminé) : Rendez-vous effectué
- **Cancelled** (Annulé) : Rendez-vous annulé

#### Changer le Statut
1. **Trouver le rendez-vous** dans la liste
2. **Cliquer sur le bouton d'action** :
   - **"Confirm"** : Pour confirmer un rendez-vous programmé
   - **"Complete"** : Pour marquer comme terminé
   - **"Cancel"** : Pour annuler un rendez-vous
3. **Confirmer l'action** si demandé

### Filtrer les Rendez-vous

#### Filtres Disponibles
1. **Par statut** :
   - Tous les statuts
   - Programmé uniquement
   - Confirmé uniquement
   - Terminé uniquement
   - Annulé uniquement

2. **Par date** :
   - Toutes les dates
   - Date spécifique
   - Période définie

#### Utilisation des Filtres
1. **Sélectionner le filtre** dans les listes déroulantes
2. **Les résultats se mettent à jour** automatiquement
3. **Utiliser "Clear"** pour effacer tous les filtres

### Vue Agenda
- **Affichage chronologique** : Rendez-vous triés par date/heure
- **Groupement** : 3 premiers rendez-vous en haut, 2 suivants en bas
- **Actions rapides** : Boutons d'action directement sur les cartes

## 💰 Gestion Financière

### Enregistrer une Recette

#### Création d'une Recette
1. **Cliquer sur "Add Income"** (tableau de bord ou module)
2. **Remplir le formulaire** :
   - **Montant** (obligatoire) : Montant positif
   - **Méthode de paiement** : Espèces, Carte, Virement, Chèque, Autre
   - **Description** (optionnel) : Détails de la recette
3. **Valider l'enregistrement**

#### Méthodes de Paiement
- **Cash** (Espèces) : Paiement en liquide
- **Card** (Carte) : Paiement par carte bancaire
- **Transfer** (Virement) : Virement bancaire
- **Check** (Chèque) : Paiement par chèque
- **Other** (Autre) : Autre méthode de paiement

### Enregistrer une Dépense

#### Création d'une Dépense
1. **Cliquer sur "Add Expense"** (tableau de bord ou module)
2. **Remplir le formulaire** :
   - **Montant** (obligatoire) : Montant positif
   - **Catégorie** : Équipement, Fournitures, Personnel, etc.
   - **Description** (optionnel) : Détails de la dépense
3. **Valider l'enregistrement**

#### Catégories de Dépenses
- **Equipment** (Équipement) : Matériel médical
- **Supplies** (Fournitures) : Consommables médicaux
- **Personnel** (Personnel) : Salaires et charges
- **Utilities** (Services publics) : Électricité, eau, etc.
- **Rent** (Loyer) : Loyer et immobilier
- **Marketing** (Marketing) : Publicité et communication
- **Other** (Autre) : Autres dépenses

### Consulter les KPIs Financiers

#### Tableau de Bord
- **Chiffre d'affaires mensuel** : Total des recettes du mois
- **Dépenses mensuelles** : Total des dépenses du mois
- **Marge bénéficiaire** : CA - Dépenses
- **Nombre de patients** : Total des patients enregistrés
- **Consultations mensuelles** : Nombre de rendez-vous du mois

#### Filtrage Mensuel
1. **Utiliser le sélecteur de mois** en haut du tableau de bord
2. **Choisir le mois et l'année** souhaités
3. **Les KPIs se mettent à jour** automatiquement

#### Données Détaillées
- **Liste des recettes** : Tableau avec montants, méthodes, dates
- **Liste des dépenses** : Tableau avec montants, catégories, dates
- **Calculs automatiques** : Totaux et marges calculés en temps réel

## 📊 Tableau de Bord

### Vue d'Ensemble
Le tableau de bord centralise toutes les informations importantes :
- **KPIs financiers** : Revenus, dépenses, marge
- **Statistiques patients** : Nombre total de patients
- **Planning** : Prochains rendez-vous
- **Navigation rapide** : Accès aux modules principaux

### Navigation
- **Dashboard** : Vue d'ensemble et KPIs
- **Patients** : Gestion des patients
- **Appointments** : Gestion des rendez-vous
- **Finances** : Gestion financière
- **Logout** : Déconnexion

### Personnalisation
- **Nom d'utilisateur** : Affiché en haut à droite
- **Filtre mensuel** : Sélection de la période d'analyse
- **Mise à jour automatique** : Données actualisées en temps réel

## 🔒 Sécurité et Authentification

### Connexion
1. **Saisir le nom d'utilisateur**
2. **Saisir le mot de passe**
3. **Cliquer sur "Sign In"**

### Protection Anti-Brute Force
- **3 tentatives maximum** : Après 3 échecs, le compte est verrouillé
- **Verrouillage temporaire** : 5 minutes de blocage
- **Réinitialisation automatique** : Le compteur se remet à zéro après succès

### Déconnexion
1. **Cliquer sur "Logout"** dans le menu
2. **Confirmer la déconnexion**
3. **Retour à la page de connexion**

## 🎨 Interface Utilisateur

### Design Responsive
- **Desktop** : Interface complète avec toutes les fonctionnalités
- **Tablet** : Adaptation des colonnes et espacements
- **Mobile** : Interface optimisée pour les petits écrans

### Navigation
- **Menu principal** : Accès rapide aux modules
- **Breadcrumbs** : Indication de la page actuelle
- **Boutons d'action** : Actions contextuelles claires

### Messages et Notifications
- **Messages de succès** : Confirmation des actions réussies
- **Messages d'erreur** : Explication des problèmes rencontrés
- **Notifications** : Informations importantes

## 🔧 Fonctionnalités Avancées

### Recherche Intelligente
- **Recherche en temps réel** : Résultats instantanés
- **Recherche multi-critères** : Nom, téléphone, email
- **Recherche partielle** : Pas besoin de saisir le terme complet

### Filtrage et Tri
- **Filtres multiples** : Combinaison de plusieurs critères
- **Tri automatique** : Données organisées logiquement
- **Réinitialisation** : Bouton pour effacer tous les filtres

### Gestion des Conflits
- **Détection automatique** : Prévention des créneaux doubles
- **Messages d'erreur** : Explication des conflits
- **Suggestions** : Propositions d'alternatives

## 📱 Utilisation Mobile

### Optimisations Mobile
- **Interface tactile** : Boutons et zones de clic adaptés
- **Navigation simplifiée** : Menu hamburger sur petits écrans
- **Formulaires optimisés** : Saisie facilitée sur mobile

### Fonctionnalités Disponibles
- **Toutes les fonctionnalités** : Accès complet sur mobile
- **Performance** : Optimisé pour les connexions lentes
- **Sauvegarde** : Données synchronisées avec le desktop

## ⚠️ Bonnes Pratiques

### Gestion des Données
- **Sauvegardes régulières** : Exporter les données périodiquement
- **Validation des informations** : Vérifier les données saisies
- **Nettoyage périodique** : Supprimer les données obsolètes

### Sécurité
- **Mots de passe forts** : Utiliser des mots de passe complexes
- **Déconnexion** : Se déconnecter après utilisation
- **Navigateur sécurisé** : Utiliser un navigateur à jour

### Performance
- **Données limitées** : Éviter de stocker trop de données
- **Nettoyage régulier** : Supprimer les données inutiles
- **Connexion stable** : Utiliser une connexion internet fiable

## 🆘 Résolution des Problèmes

### Problèmes Courants

#### L'application ne se charge pas
- **Vérifier la connexion internet**
- **Actualiser la page (F5)**
- **Vider le cache du navigateur**
- **Vérifier que le serveur est lancé**

#### Les données ne se sauvegardent pas
- **Vérifier que LocalStorage est activé**
- **Désactiver le mode privé**
- **Vérifier l'espace disque disponible**

#### Erreur de connexion
- **Vérifier les identifiants**
- **Attendre la fin du verrouillage (5 min)**
- **Créer un nouveau compte si nécessaire**

#### Rendez-vous en conflit
- **Choisir un autre créneau**
- **Vérifier les rendez-vous existants**
- **Modifier l'heure ou la date**

### Support Technique
- **Console du navigateur** : F12 pour voir les erreurs
- **Documentation** : Consulter les guides techniques
- **Sauvegarde** : Toujours sauvegarder avant de faire des modifications

## 📞 Assistance

### Ressources Disponibles
- **Guide utilisateur** : Ce document
- **Documentation technique** : Guides dans le dossier Docs/
- **Code source** : Commentaires dans le code

### Contact
- **Issues GitHub** : Pour signaler des bugs
- **Documentation** : Pour les questions techniques
- **Support communautaire** : Via les discussions GitHub

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Compatibilité** : Tous navigateurs modernes
