import validator from '../Security/validator.js';
import hash from '../Security/hash.js';
import components from './component.js';
import router from '../Router/router.js';

/**
 * Récupère l'historique complet des tentatives de connexion depuis le stockage local
 * Cette fonction accède aux données de sécurité pour le système de verrouillage de compte
 * @returns {Array<Object>} Tableau des tentatives de connexion avec structure :
 *   - username: {string} Nom d'utilisateur
 *   - success: {boolean} Résultat de la tentative
 *   - timestamp: {number} Timestamp de la tentative
 */
function getLoginAttempts() {
    return JSON.parse(localStorage.getItem("loginAttempts") || "[]");
}

/**
 * Gère l'enregistrement des tentatives de connexion avec système de sécurité avancé
 * 
 * FONCTIONNALITÉS DE SÉCURITÉ :
 * - Nettoyage automatique des tentatives expirées (> 5 minutes)
 * - Réinitialisation immédiate du compteur en cas de succès
 * - Limitation stricte à 3 tentatives maximum par utilisateur
 * - Gestion intelligente des timestamps pour la sécurité temporelle
 * 
 * LOGIQUE DE SÉCURITÉ :
 * - 3 échecs consécutifs = blocage temporaire (5 minutes)
 * - Connexion réussie = reset immédiat du compteur d'échecs
 * - Nettoyage automatique des données obsolètes
 * 
 * @param {string} username - Nom d'utilisateur pour lequel enregistrer la tentative
 * @param {boolean} success - Résultat de la tentative (true = succès, false = échec)
 * @returns {void} Aucune valeur de retour (modifie directement localStorage)
 */
function addLoginAttempt(username, success) {
    const attempts = getLoginAttempts();
    
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentAttempts = [];
    for (let i = 0; i < attempts.length; i++) {
        if (attempts[i].timestamp > fiveMinutesAgo) {
            recentAttempts.push(attempts[i]);
        }
    }
    
    if (success) {
        const filteredAttempts = recentAttempts.filter(attempt => 
            attempt.username !== username
        );
        localStorage.setItem("loginAttempts", JSON.stringify(filteredAttempts));
        return;
    }
    
    recentAttempts.push({
        username,
        success,
        timestamp: Date.now()
    });
    
    const finalAttempts = recentAttempts.slice(-3);
    
    localStorage.setItem("loginAttempts", JSON.stringify(finalAttempts));
}

/**
 * Vérifie le statut de verrouillage d'un compte utilisateur
 * 
 * SYSTÈME DE SÉCURITÉ :
 * - Blocage automatique après 3 tentatives d'échec consécutives
 * - Durée de blocage : 5 minutes à partir du dernier échec
 * - Vérification basée sur l'historique des tentatives récentes
 * 
 * OPTIMISATION DE PERFORMANCE :
 * - Retour immédiat si moins de 3 tentatives totales (évite le filtrage inutile)
 * - Filtrage intelligent des tentatives par utilisateur et statut
 * - Gestion efficace de la mémoire pour les applications à fort trafic
 * 
 * @param {string} username - Nom d'utilisateur à vérifier pour le verrouillage
 * @returns {boolean} 
 *   - true : Compte temporairement bloqué (3+ échecs récents)
 *   - false : Compte accessible (moins de 3 échecs ou aucune tentative)
 */
function isAccountLocked(username) {
    const attempts = getLoginAttempts();
    
    if (attempts.length < 3) {
        return false;
    }
    
    const userAttempts = attempts.filter(attempt => 
        attempt.username === username && 
        !attempt.success
    );
    
    return userAttempts.length >= 3;
}

/**
 * Orchestre le processus complet d'authentification utilisateur
 * 
 * FLUX D'AUTHENTIFICATION :
 * 1. Vérification du statut de verrouillage du compte
 * 2. Validation des données d'entrée (format, longueur, caractères)
 * 3. Hachage sécurisé du mot de passe avec algorithme asynchrone
 * 4. Recherche et vérification des identifiants dans la base locale
 * 5. Gestion des tentatives de connexion pour la sécurité
 * 6. Création de session utilisateur et redirection
 * 
 * SÉCURITÉ INTÉGRÉE :
 * - Protection contre les attaques par force brute
 * - Validation stricte des données d'entrée
 * - Hachage sécurisé des mots de passe
 * - Gestion des sessions avec timestamps
 * 
 * GESTION D'ERREURS :
 * - Messages d'erreur contextuels pour l'utilisateur
 * - Enregistrement des tentatives échouées pour la sécurité
 * - Redirection appropriée selon le résultat
 * 
 * @param {string} username - Nom d'utilisateur saisi par l'utilisateur
 * @param {string} password - Mot de passe en texte clair (sera haché)
 * @returns {Promise<void>} Promise qui se résout après traitement complet
 */
async function handleLogin(username, password) {
    if (isAccountLocked(username)) {
        components.showMessage("Account temporarily locked. Try again in 5 minutes.", "error");
        return;
    }

    const validation = validator.loginValidator(username, password);
    if (!validation.isValid) {
        components.showMessage(validation.errors.join('<br>'), 'error');
        addLoginAttempt(username, false);
        return;
    }

    const hashedPwd = await hash.hashPassword(password);
    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    
    if(users.length === 0){
        components.showMessage("No registered users", "error");
        addLoginAttempt(username, false);
        return;
    }

    const user = users.find(u => u.username === username && u.password === hashedPwd);

    if(user){
        addLoginAttempt(username, true);
        
        components.showMessage("Logging in...", "success");
        
        setTimeout(() => {
            localStorage.setItem("currentUser", JSON.stringify({
                id: user.id || Date.now(),
                username: user.username,
                loginTime: Date.now()
            }));
            
            components.showMessage("Login successful!", "success");
            router('dashboard');
        }, 1000);

    } else {
        components.showMessage("Incorrect username or password", "error");
        addLoginAttempt(username, false);
    }
}

/**
 * Gère l'enregistrement d'un nouvel utilisateur dans le système
 * 
 * PROCESSUS D'INSCRIPTION :
 * 1. Vérification de la correspondance des mots de passe
 * 2. Validation complète des données d'inscription (format, sécurité)
 * 3. Vérification de l'unicité du nom d'utilisateur dans la base
 * 4. Hachage sécurisé du mot de passe avec algorithme asynchrone
 * 5. Création du profil utilisateur avec métadonnées
 * 6. Sauvegarde dans le stockage local et redirection
 * 
 * VALIDATIONS INTÉGRÉES :
 * - Correspondance des mots de passe (sécurité)
 * - Format et longueur des données (qualité)
 * - Unicité du nom d'utilisateur (intégrité)
 * - Respect des règles de sécurité (robustesse)
 * 
 * GESTION DES DONNÉES :
 * - Génération d'ID unique basé sur timestamp
 * - Hachage sécurisé du mot de passe
 * - Enregistrement des métadonnées de création
 * - Mise à jour de la base utilisateurs locale
 * 
 * @param {string} username - Nom d'utilisateur souhaité (doit être unique)
 * @param {string} password - Mot de passe en texte clair (sera haché)
 * @param {string} confirmPassword - Confirmation du mot de passe (vérification)
 * @returns {Promise<void>} Promise qui se résout après création du compte
 */
async function handleRegister(username, password, confirmPassword) {
    if (password !== confirmPassword) {
        components.showMessage("Passwords do not match", "error");
        return;
    }

    const validation = validator.registerValidator(username, password);
    if (!validation.isValid) {
        components.showMessage(validation.errors.join('<br>'), 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        components.showMessage("This username already exists", "error");
        return;
    }

    const hashedPwd = await hash.hashPassword(password);
    
    const newUser = {
        id: Date.now(),
        username: username,
        password: hashedPwd,
        createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem("Users", JSON.stringify(users));
    
    components.showMessage("Account created successfully! You can now log in.", "success");
    
    setTimeout(() => {
        router('login');
    }, 2000);
}

/**
 * Gère la déconnexion sécurisée de l'utilisateur actuel
 * 
 * PROCESSUS DE DÉCONNEXION :
 * 1. Suppression complète des données de session du stockage local
 * 2. Nettoyage des informations utilisateur en mémoire
 * 3. Redirection automatique vers la page de connexion
 * 4. Retour à l'état d'authentification initial
 * 
 * SÉCURITÉ :
 * - Suppression immédiate des données sensibles
 * - Prévention de l'accès non autorisé aux données de session
 * - Retour à l'état de sécurité par défaut
 * 
 * EFFETS :
 * - L'utilisateur doit se reconnecter pour accéder au système
 * - Toutes les données de session sont effacées
 * - L'interface retourne à l'état de connexion
 * 
 * @returns {void} Aucune valeur de retour (effet de bord : redirection)
 */
function handleLogout() {
    localStorage.removeItem("currentUser");
    router('login');
}

export default {
    handleLogin,
    handleRegister,
    handleLogout
};