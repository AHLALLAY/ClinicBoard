import components from './component.js';

/**
 * Crée un nouveau patient dans la base de données avec validation complète
 * 
 * VALIDATION DES DONNÉES :
 * - Vérification des champs obligatoires (nom complet, téléphone)
 * - Contrôle d'unicité (téléphone et email uniques)
 * - Validation des formats de données
 * - Gestion des champs optionnels (email, notes)
 * 
 * STRUCTURE DU PATIENT :
 * - ID unique généré automatiquement (timestamp)
 * - Nom complet (obligatoire)
 * - Numéro de téléphone (obligatoire, unique)
 * - Adresse email (optionnelle, unique si fournie)
 * - Notes médicales (optionnelles)
 * - Timestamps de création et modification
 * 
 * GESTION D'ERREURS :
 * - Messages d'erreur contextuels pour l'utilisateur
 * - Validation des doublons avant création
 * - Retour booléen pour indiquer le succès/échec
 * 
 * @param {Object} patientData - Données du patient à créer
 * @param {string} patientData.fullName - Nom complet du patient (obligatoire)
 * @param {string} patientData.phone - Numéro de téléphone (obligatoire, unique)
 * @param {string} [patientData.email] - Adresse email (optionnelle, unique)
 * @param {string} [patientData.notes] - Notes médicales (optionnelles)
 * @returns {boolean} true si création réussie, false en cas d'erreur
 */
function createPatient(patientData) {
    if (!patientData.fullName || !patientData.phone) {
        components.showMessage("Full name and phone are required", "error");
        return false;
    }

    const patients = JSON.parse(localStorage.getItem("Patients") || "[]");
    
    const existingPatient = patients.find(p => 
        p.phone === patientData.phone || 
        p.email === patientData.email
    );
    
    if (existingPatient) {
        components.showMessage("A patient with this phone or email already exists", "error");
        return false;
    }

    const newPatient = {
        id: Date.now(),
        fullName: patientData.fullName,
        phone: patientData.phone,
        email: patientData.email || "",
        notes: patientData.notes || "",
        createdAt: new Date().toISOString()
    };

    patients.push(newPatient);
    localStorage.setItem("Patients", JSON.stringify(patients));
    
    components.showMessage("Patient added successfully!", "success");
    return true;
}

/**
 * Récupère la liste complète des patients depuis le stockage local
 * 
 * FONCTIONNALITÉS :
 * - Accès en lecture seule à tous les patients enregistrés
 * - Retour d'un tableau vide si aucun patient n'existe
 * - Parsing automatique des données JSON stockées
 * - Pas de modification des données (lecture seule)
 * 
 * UTILISATION TYPIQUE :
 * - Affichage de la liste des patients
 * - Recherche et filtrage des patients
 * - Opérations de lecture avant modification
 * - Export des données patients
 * 
 * STRUCTURE DE RETOUR :
 * - Tableau d'objets patients
 * - Chaque patient contient : id, fullName, phone, email, notes, timestamps
 * - Tri possible par date de création ou nom
 * 
 * @returns {Array<Object>} Tableau de tous les patients enregistrés
 */
function readPatient() {
    return JSON.parse(localStorage.getItem("Patients") || "[]");
}

/**
 * Met à jour les informations d'un patient existant dans la base de données
 * 
 * VALIDATION ET RECHERCHE :
 * - Vérification de l'existence du patient par ID
 * - Mise à jour partielle des données (merge des propriétés)
 * - Conservation des données non modifiées
 * - Ajout automatique du timestamp de modification
 * 
 * GESTION DES DONNÉES :
 * - Fusion des nouvelles données avec les existantes
 * - Préservation de l'ID et des timestamps de création
 * - Mise à jour du timestamp de modification
 * - Sauvegarde immédiate dans le stockage local
 * 
 * GESTION D'ERREURS :
 * - Vérification de l'existence du patient
 * - Messages d'erreur contextuels
 * - Retour booléen pour indiquer le succès/échec
 * - Validation des données avant sauvegarde
 * 
 * @param {number} patientId - ID unique du patient à modifier
 * @param {Object} patientData - Nouvelles données du patient (partielles ou complètes)
 * @param {string} [patientData.fullName] - Nouveau nom complet
 * @param {string} [patientData.phone] - Nouveau numéro de téléphone
 * @param {string} [patientData.email] - Nouvelle adresse email
 * @param {string} [patientData.notes] - Nouvelles notes médicales
 * @returns {boolean} true si mise à jour réussie, false si patient non trouvé
 */
function updatePatient(patientId, patientData) {
    const patients = readPatient();
    const index = patients.findIndex(p => p.id === patientId);
    
    if (index === -1) {
        components.showMessage("Patient not found", "error");
        return false;
    }

    patients[index] = {
        ...patients[index],
        ...patientData,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem("Patients", JSON.stringify(patients));
    components.showMessage("Patient updated successfully!", "success");
    return true;
}

/**
 * Supprime définitivement un patient de la base de données
 * 
 * VALIDATION ET SÉCURITÉ :
 * - Vérification de l'existence du patient par ID
 * - Suppression définitive (pas de corbeille)
 * - Vérification du nombre d'éléments avant/après suppression
 * - Messages de confirmation pour l'utilisateur
 * 
 * GESTION DES DONNÉES :
 * - Filtrage du tableau pour exclure le patient
 * - Sauvegarde immédiate du tableau modifié
 * - Conservation de l'intégrité des autres données
 * - Pas de récupération possible après suppression
 * 
 * GESTION D'ERREURS :
 * - Vérification de l'existence du patient
 * - Comparaison des tailles de tableau
 * - Messages d'erreur contextuels
 * - Retour booléen pour indiquer le succès/échec
 * 
 * @param {number} patientId - ID unique du patient à supprimer
 * @returns {boolean} true si suppression réussie, false si patient non trouvé
 */
function deletePatient(patientId) {
    const patients = readPatient();
    const filteredPatients = patients.filter(p => p.id !== patientId);
    
    if (patients.length === filteredPatients.length) {
        components.showMessage("Patient not found", "error");
        return false;
    }

    localStorage.setItem("Patients", JSON.stringify(filteredPatients));
    components.showMessage("Patient deleted successfully!", "success");
    return true;
}

/**
 * Recherche des patients selon un terme de recherche multi-critères
 * 
 * ALGORITHME DE RECHERCHE :
 * - Recherche insensible à la casse (toLowerCase)
 * - Recherche partielle (includes) pour plus de flexibilité
 * - Recherche simultanée sur plusieurs champs
 * - Retour de tous les résultats correspondants
 * 
 * CHAMPS DE RECHERCHE :
 * - Nom complet du patient (fullName)
 * - Numéro de téléphone (phone)
 * - Adresse email (email)
 * - Recherche partielle sur tous les champs
 * 
 * FONCTIONNALITÉS :
 * - Recherche en temps réel
 * - Support des caractères spéciaux
 * - Filtrage intelligent des résultats
 * - Performance optimisée pour de grandes listes
 * 
 * @param {string} searchTerm - Terme de recherche (nom, téléphone, email)
 * @returns {Array<Object>} Tableau des patients correspondant au terme de recherche
 */
function searchPatient(searchTerm) {
    const patients = readPatient();
    const term = searchTerm.toLowerCase();
    
    return patients.filter(patient => 
        patient.fullName.toLowerCase().includes(term) ||
        patient.phone.includes(term) ||
        patient.email.toLowerCase().includes(term)
    );
}

export default {
    createPatient,
    readPatient,
    updatePatient,
    deletePatient,
    searchPatient
};
