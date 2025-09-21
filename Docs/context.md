# Contexte du projet

Aujourd'hui, le cabinet de santé gère ses patients, rendez-vous et finances avec Excel, entraînant erreurs, doublons et manque de sécurité. Le projet vise à créer une application web monopage (SPA), 100 % locale, qui centralise toutes ces fonctions dans une interface fluide, ergonomique et sécurisée, avec persistance en LocalStorage et accès protégé par mot de passe hashé.

## Fonctionnalités principales

### 🔐 Authentification & sécurité
- Initialisation de l'application avec création du mot de passe (si première utilisation).
- Connexion avec vérification du hash.
- Compteur d'échecs et verrouillage temporaire après plusieurs tentatives.
- Bonus : Chiffrer le JSON stocké dans le LocalStorage.

### 👥 Gestion des patients
- CRUD patient (ajouter, modifier, supprimer).
- Champs : nom complet, téléphone, e-mail, notes.
- Recherche simple (nom ou téléphone).
- Historique des rendez-vous liés.

### 📅 Gestion des rendez-vous
- Création de rendez-vous avec patient, praticien, salle, type, durée.
- Modification (horaire, durée, statut).
- Annulation ou statut no-show.
- Filtrage par praticien / statut.
- Vue Jour (agenda simple).

### 💰 Gestion des recettes & dépenses
- Enregistrer une recette (montant, méthode de paiement, libellé).
- Enregistrer une dépense (montant, catégorie, libellé, date).
- Suivi du budget mensuel (objectif vs réalisé).

### 📊 Tableau de bord
- KPIs: Chiffre d'affaires mensuel, Total dépenses, Marge (recettes – dépenses), nombre de patients, nombre de consultations.
- Navigation centralisée vers les modules (Patients, RDV, Recettes/Dépenses).

### 📂 Données & persistance
- Données stockées en LocalStorage JSON (clé unique : clinicApp:data).
- Schéma clair avec patients, appointments, cash, auth.
- Réinitialisation automatique si pas de mot de passe défini.

## Modalités pédagogiques

Travail individuel.

**Date Limite:** 19/09/2025 à minuit.

## Modalités d'évaluation

Une durée de 25 min organisée comme suit :
- **5 minutes** pour Démontrer le contenu et la fonctionnalité du site Web (très rapidement)
- Montrez le code source et expliquez brièvement comment il fonctionne. **(5 minutes)**
- Mise en situation **(10minutes)**
- Code Review \ Questions culture Web **(5 minutes)**

## Livrables

- **Code Source :** Lien GitHub de l'application
- **Planification :** Lien de la planification JIRA
- **Documentation Technique :** Description de l'application dans un fichier README
- **Maquette Figma**

## Critères de performance

- Planification sur JIRA : inclure l'utilisation des epics, user stories/tasks et sub-tasks.
- Maquettage : responsive et il doit contenir une charte graphique.
- Sécurité : garantir un accès protégé par mot de passe avec un mot de passe haché.
- Expérience utilisateur : assurer une navigation fluide grâce à une architecture SPA (Single Page Application).
- Stockage local : utiliser uniquement LocalStorage avec une modélisation adaptée pour faciliter la gestion.
- Structure HTML minimale : un fichier index.html contenant uniquement la balise `<div id="root"></div>`.
- Organisation du projet : structuré en modules ES (components/, router/, storage/, security/, styles/), ou bien importation de tous les scripts JavaScript dans index.html.
- Implémenter les opérations en utilisant innerHTML ou appendChild.
- Créer les éléments soit avec createElement, soit via une chaîne de caractères (string).
- Nettoyer les event listeners inutilisés avec removeEventListener afin d'éviter les fuites mémoire.
- Assurez-vous que le code soit modulaire et respecte les bonnes pratiques de codage.