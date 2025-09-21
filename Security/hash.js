/**
 * Hache un mot de passe de manière sécurisée avec l'algorithme SHA-256
 * 
 * ALGORITHME DE HACHAGE :
 * - Utilisation de l'API Web Crypto (crypto.subtle)
 * - Algorithme SHA-256 pour la sécurité
 * - Conversion en hexadécimal pour le stockage
 * - Opération asynchrone pour la performance
 * 
 * SÉCURITÉ :
 * - Hachage unidirectionnel (pas de déchiffrement possible)
 * - Utilisation d'un algorithme cryptographique standard
 * - Protection contre les attaques par dictionnaire
 * - Résistance aux collisions (SHA-256)
 * 
 * PROCESSUS DE HACHAGE :
 * 1. Encodage du mot de passe en UTF-8
 * 2. Hachage avec SHA-256 via crypto.subtle
 * 3. Conversion du buffer en tableau d'octets
 * 4. Conversion en chaîne hexadécimale
 * 5. Retour du hash final
 * 
 * PERFORMANCE :
 * - Opération asynchrone pour éviter le blocage
 * - Utilisation de l'API native du navigateur
 * - Optimisé pour les mots de passe de taille normale
 * 
 * @param {string} password - Mot de passe en texte clair à hacher
 * @returns {Promise<string>} Promise qui se résout avec le hash hexadécimal
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default {
    hashPassword
};
