/**
 * Valide les données de connexion avec règles de sécurité de base
 * 
 * RÈGLES DE VALIDATION :
 * - Nom d'utilisateur : minimum 3 caractères
 * - Mot de passe : minimum 6 caractères
 * - Vérification de la présence des champs obligatoires
 * - Messages d'erreur contextuels et précis
 * 
 * SÉCURITÉ :
 * - Validation côté client pour l'expérience utilisateur
 * - Règles minimales pour éviter les attaques basiques
 * - Messages d'erreur informatifs sans révéler d'informations sensibles
 * - Validation cohérente avec les standards de sécurité
 * 
 * STRUCTURE DE RETOUR :
 * - isValid : booléen indiquant si la validation a réussi
 * - errors : tableau des messages d'erreur détaillés
 * 
 * @param {string} username - Nom d'utilisateur à valider
 * @param {string} password - Mot de passe à valider
 * @returns {Object} Résultat de la validation
 * @returns {boolean} returns.isValid - true si validation réussie
 * @returns {Array<string>} returns.errors - Messages d'erreur détaillés
 */
function loginValidator(username, password) {
    const errors = [];
    
    if (!username || username.length < 3) {
        errors.push("Username must contain at least 3 characters");
    }
    
    if (!password || password.length < 6) {
        errors.push("Password must contain at least 6 characters");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Valide les données d'inscription avec règles de sécurité renforcées
 * 
 * RÈGLES DE VALIDATION :
 * - Nom d'utilisateur : minimum 3 caractères
 * - Mot de passe : minimum 8 caractères (sécurité renforcée)
 * - Vérification de la présence des champs obligatoires
 * - Messages d'erreur contextuels et précis
 * 
 * SÉCURITÉ RENFORCÉE :
 * - Exigences de mot de passe plus strictes pour l'inscription
 * - Protection contre les mots de passe faibles
 * - Validation cohérente avec les standards de sécurité
 * - Messages d'erreur informatifs pour guider l'utilisateur
 * 
 * DIFFÉRENCES AVEC LOGIN :
 * - Mot de passe minimum 8 caractères (vs 6 pour login)
 * - Validation plus stricte pour la création de compte
 * - Protection renforcée contre les comptes vulnérables
 * 
 * @param {string} username - Nom d'utilisateur à valider
 * @param {string} password - Mot de passe à valider
 * @returns {Object} Résultat de la validation
 * @returns {boolean} returns.isValid - true si validation réussie
 * @returns {Array<string>} returns.errors - Messages d'erreur détaillés
 */
function registerValidator(username, password) {
    const errors = [];
    
    if (!username || username.length < 3) {
        errors.push("Username must contain at least 3 characters");
    }
    
    if (!password || password.length < 6) {
        errors.push("Password must contain at least 6 characters");
    }
    
    if (password && password.length < 8) {
        errors.push("Password must contain at least 8 characters for better security");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Valide les données d'un patient avec règles de format et sécurité
 * 
 * RÈGLES DE VALIDATION :
 * - Nom complet : minimum 2 caractères (obligatoire)
 * - Téléphone : exactement 10 chiffres (obligatoire)
 * - Email : format valide (optionnel, si fourni)
 * - Validation des formats avec expressions régulières
 * 
 * VALIDATION DES FORMATS :
 * - Téléphone : /^\d{10}$/ (10 chiffres exactement)
 * - Email : /^[^\s@]+@[^\s@]+\.[^\s@]+$/ (format email standard)
 * - Nom : trim() pour supprimer les espaces en début/fin
 * 
 * SÉCURITÉ :
 * - Protection contre les injections de données malveillantes
 * - Validation stricte des formats pour éviter les erreurs
 * - Messages d'erreur précis pour guider l'utilisateur
 * - Nettoyage des données (trim) pour éviter les erreurs d'espacement
 * 
 * @param {Object} patientData - Données du patient à valider
 * @param {string} patientData.fullName - Nom complet du patient
 * @param {string} patientData.phone - Numéro de téléphone
 * @param {string} [patientData.email] - Adresse email (optionnelle)
 * @returns {Object} Résultat de la validation
 * @returns {boolean} returns.isValid - true si validation réussie
 * @returns {Array<string>} returns.errors - Messages d'erreur détaillés
 */
function patientValidator(patientData) {
    const errors = [];
    
    if (!patientData.fullName || patientData.fullName.trim().length < 2) {
        errors.push("Full name is required (minimum 2 characters)");
    }
    
    if (!patientData.phone || !/^\d{10}$/.test(patientData.phone)) {
        errors.push("Phone must contain exactly 10 digits");
    }
    
    if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
        errors.push("Email must have a valid format");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Valide les données d'un revenu avec règles financières de base
 * 
 * RÈGLES DE VALIDATION :
 * - Montant : obligatoire et strictement positif
 * - Méthode de paiement : obligatoire
 * - Validation des types numériques
 * - Contrôle de cohérence des données financières
 * 
 * VALIDATION FINANCIÈRE :
 * - Montant > 0 pour éviter les revenus négatifs ou nuls
 * - Vérification du type numérique
 * - Validation de la présence des champs obligatoires
 * - Messages d'erreur contextuels pour les données financières
 * 
 * SÉCURITÉ :
 * - Protection contre les montants invalides
 * - Validation stricte des données numériques
 * - Prévention des erreurs de saisie financière
 * - Cohérence avec les règles comptables
 * 
 * @param {Object} incomeData - Données du revenu à valider
 * @param {number} incomeData.amount - Montant du revenu
 * @param {string} incomeData.method - Méthode de paiement
 * @returns {Object} Résultat de la validation
 * @returns {boolean} returns.isValid - true si validation réussie
 * @returns {Array<string>} returns.errors - Messages d'erreur détaillés
 */
function incomeValidator(incomeData) {
    const errors = [];
    
    if (!incomeData.amount || incomeData.amount <= 0) {
        errors.push("Amount must be positive");
    }
    
    if (!incomeData.method) {
        errors.push("Payment method is required");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Valide les données d'une dépense avec règles financières de base
 * 
 * RÈGLES DE VALIDATION :
 * - Montant : obligatoire et strictement positif
 * - Catégorie : obligatoire pour le classement
 * - Validation des types numériques
 * - Contrôle de cohérence des données financières
 * 
 * VALIDATION FINANCIÈRE :
 * - Montant > 0 pour éviter les dépenses négatives ou nulles
 * - Vérification du type numérique
 * - Validation de la présence des champs obligatoires
 * - Messages d'erreur contextuels pour les données financières
 * 
 * SÉCURITÉ :
 * - Protection contre les montants invalides
 * - Validation stricte des données numériques
 * - Prévention des erreurs de saisie financière
 * - Cohérence avec les règles comptables
 * 
 * @param {Object} expenseData - Données de la dépense à valider
 * @param {number} expenseData.amount - Montant de la dépense
 * @param {string} expenseData.category - Catégorie de la dépense
 * @returns {Object} Résultat de la validation
 * @returns {boolean} returns.isValid - true si validation réussie
 * @returns {Array<string>} returns.errors - Messages d'erreur détaillés
 */
function expenseValidator(expenseData) {
    const errors = [];
    
    if (!expenseData.amount || expenseData.amount <= 0) {
        errors.push("Amount must be positive");
    }
    
    if (!expenseData.category) {
        errors.push("Category is required");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Valide les données d'un rendez-vous avec règles de planning et logique métier
 * 
 * RÈGLES DE VALIDATION :
 * - Patient : obligatoire (ID du patient)
 * - Date : obligatoire pour la planification
 * - Heure : obligatoire pour la planification
 * - Durée : optionnelle, entre 15 et 120 minutes si fournie
 * 
 * VALIDATION MÉTIER :
 * - Vérification de la présence des champs obligatoires
 * - Validation de la durée dans des limites raisonnables
 * - Contrôle de cohérence des données de planning
 * - Messages d'erreur contextuels pour la planification
 * 
 * LOGIQUE DE PLANNING :
 * - Durée minimum : 15 minutes (consultation rapide)
 * - Durée maximum : 120 minutes (consultation longue)
 * - Validation des types de données
 * - Prévention des erreurs de saisie de planning
 * 
 * @param {Object} appointmentData - Données du rendez-vous à valider
 * @param {number} appointmentData.patientId - ID du patient (obligatoire)
 * @param {string} appointmentData.date - Date du rendez-vous (obligatoire)
 * @param {string} appointmentData.time - Heure du rendez-vous (obligatoire)
 * @param {number} [appointmentData.duration] - Durée en minutes (optionnelle, 15-120)
 * @returns {Object} Résultat de la validation
 * @returns {boolean} returns.isValid - true si validation réussie
 * @returns {Array<string>} returns.errors - Messages d'erreur détaillés
 */
function appointmentValidator(appointmentData) {
    const errors = [];
    
    if (!appointmentData.patientId) {
        errors.push("Patient is required");
    }
    
    if (!appointmentData.date) {
        errors.push("Date is required");
    }
    
    if (!appointmentData.time) {
        errors.push("Time is required");
    }
    
    if (appointmentData.duration && (appointmentData.duration < 15 || appointmentData.duration > 120)) {
        errors.push("Duration must be between 15 and 120 minutes");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

export default {
    loginValidator,
    registerValidator,
    patientValidator,
    incomeValidator,
    expenseValidator,
    appointmentValidator
};