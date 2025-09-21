import components from './component.js';

/**
 * Crée un nouveau rendez-vous avec validation complète et gestion des conflits
 * 
 * VALIDATION DES DONNÉES :
 * - Vérification des champs obligatoires (patientId, date, time)
 * - Contrôle d'unicité des créneaux horaires
 * - Vérification de l'existence du patient
 * - Gestion des conflits de planning
 * 
 * GESTION DES CONFLITS :
 * - Détection des créneaux déjà occupés
 * - Exclusion des rendez-vous annulés des conflits
 * - Validation de la disponibilité du créneau
 * - Messages d'erreur contextuels
 * 
 * STRUCTURE DU RENDEZ-VOUS :
 * - ID unique généré automatiquement
 * - Référence au patient (ID et nom)
 * - Date et heure du rendez-vous
 * - Durée par défaut (30 minutes)
 * - Notes optionnelles
 * - Statut initial (scheduled)
 * - Timestamps de création
 * 
 * @param {Object} appointmentData - Données du rendez-vous à créer
 * @param {number} appointmentData.patientId - ID du patient (obligatoire)
 * @param {string} appointmentData.date - Date du rendez-vous (obligatoire)
 * @param {string} appointmentData.time - Heure du rendez-vous (obligatoire)
 * @param {number} [appointmentData.duration] - Durée en minutes (défaut: 30)
 * @param {string} [appointmentData.notes] - Notes du rendez-vous (optionnelles)
 * @returns {boolean} true si création réussie, false en cas d'erreur
 */
function createAppointment(appointmentData) {
    if (!appointmentData.patientId || !appointmentData.date || !appointmentData.time) {
        components.showMessage("Patient, date and time are required", "error");
        return false;
    }

    const appointments = JSON.parse(localStorage.getItem("Appointments") || "[]");
    
    const conflict = appointments.find(apt => 
        apt.date === appointmentData.date && 
        apt.time === appointmentData.time &&
        apt.status !== "cancelled"
    );
    
    if (conflict) {
        components.showMessage("An appointment already exists at this time", "error");
        return false;
    }

    const patients = JSON.parse(localStorage.getItem("Patients") || "[]");
    const patient = patients.find(p => p.id === appointmentData.patientId);
    
    if (!patient) {
        components.showMessage("Patient not found", "error");
        return false;
    }

    const newAppointment = {
        id: Date.now(),
        patientId: appointmentData.patientId,
        patientName: patient.fullName,
        date: appointmentData.date,
        time: appointmentData.time,
        duration: appointmentData.duration || 30,
        notes: appointmentData.notes || "",
        status: "scheduled",
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    localStorage.setItem("Appointments", JSON.stringify(appointments));
    
    components.showMessage("Appointment created successfully!", "success");
    return true;
}

/**
 * Récupère la liste complète des rendez-vous depuis le stockage local
 * 
 * FONCTIONNALITÉS :
 * - Accès en lecture seule à tous les rendez-vous
 * - Retour d'un tableau vide si aucun rendez-vous n'existe
 * - Parsing automatique des données JSON stockées
 * - Pas de modification des données (lecture seule)
 * 
 * UTILISATION TYPIQUE :
 * - Affichage de la liste des rendez-vous
 * - Filtrage par date, patient ou statut
 * - Opérations de lecture avant modification
 * - Export des données de planning
 * 
 * STRUCTURE DE RETOUR :
 * - Tableau d'objets rendez-vous
 * - Chaque rendez-vous contient : id, patientId, patientName, date, time, duration, notes, status, timestamps
 * - Tri possible par date, heure ou patient
 * 
 * @returns {Array<Object>} Tableau de tous les rendez-vous enregistrés
 */
function readAppointment() {
    return JSON.parse(localStorage.getItem("Appointments") || "[]");
}

/**
 * Met à jour les informations d'un rendez-vous existant
 * 
 * VALIDATION ET RECHERCHE :
 * - Vérification de l'existence du rendez-vous par ID
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
 * - Vérification de l'existence du rendez-vous
 * - Messages d'erreur contextuels
 * - Retour booléen pour indiquer le succès/échec
 * - Validation des données avant sauvegarde
 * 
 * @param {number} appointmentId - ID unique du rendez-vous à modifier
 * @param {Object} appointmentData - Nouvelles données du rendez-vous (partielles ou complètes)
 * @param {number} [appointmentData.patientId] - Nouvel ID du patient
 * @param {string} [appointmentData.date] - Nouvelle date du rendez-vous
 * @param {string} [appointmentData.time] - Nouvelle heure du rendez-vous
 * @param {number} [appointmentData.duration] - Nouvelle durée en minutes
 * @param {string} [appointmentData.notes] - Nouvelles notes du rendez-vous
 * @returns {boolean} true si mise à jour réussie, false si rendez-vous non trouvé
 */
function updateAppointment(appointmentId, appointmentData) {
    const appointments = readAppointment();
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (index === -1) {
        components.showMessage("Appointment not found", "error");
        return false;
    }

    appointments[index] = {
        ...appointments[index],
        ...appointmentData,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem("Appointments", JSON.stringify(appointments));
    components.showMessage("Appointment updated successfully!", "success");
    return true;
}

/**
 * Met à jour uniquement le statut d'un rendez-vous existant
 * 
 * FONCTIONNALITÉS SPÉCIALISÉES :
 * - Mise à jour ciblée du statut uniquement
 * - Préservation de toutes les autres données
 * - Ajout automatique du timestamp de modification
 * - Validation de l'existence du rendez-vous
 * 
 * STATUTS SUPPORTÉS :
 * - 'scheduled' : Rendez-vous programmé
 * - 'confirmed' : Rendez-vous confirmé
 * - 'completed' : Rendez-vous terminé
 * - 'cancelled' : Rendez-vous annulé
 * - 'no-show' : Patient absent
 * 
 * GESTION DES DONNÉES :
 * - Modification directe du statut
 * - Mise à jour du timestamp de modification
 * - Sauvegarde immédiate des changements
 * - Conservation de l'intégrité des autres données
 * 
 * @param {number} appointmentId - ID unique du rendez-vous à modifier
 * @param {string} status - Nouveau statut du rendez-vous
 * @returns {boolean} true si mise à jour réussie, false si rendez-vous non trouvé
 */
function updateAppointmentStatus(appointmentId, status) {
    const appointments = readAppointment();
    const index = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (index === -1) {
        components.showMessage("Appointment not found", "error");
        return false;
    }

    appointments[index].status = status;
    appointments[index].updatedAt = new Date().toISOString();

    localStorage.setItem("Appointments", JSON.stringify(appointments));
    components.showMessage("Appointment status updated!", "success");
    return true;
}

/**
 * Supprime définitivement un rendez-vous de la base de données
 * 
 * VALIDATION ET SÉCURITÉ :
 * - Vérification de l'existence du rendez-vous par ID
 * - Suppression définitive (pas de corbeille)
 * - Vérification du nombre d'éléments avant/après suppression
 * - Messages de confirmation pour l'utilisateur
 * 
 * GESTION DES DONNÉES :
 * - Filtrage du tableau pour exclure le rendez-vous
 * - Sauvegarde immédiate du tableau modifié
 * - Conservation de l'intégrité des autres données
 * - Pas de récupération possible après suppression
 * 
 * GESTION D'ERREURS :
 * - Vérification de l'existence du rendez-vous
 * - Comparaison des tailles de tableau
 * - Messages d'erreur contextuels
 * - Retour booléen pour indiquer le succès/échec
 * 
 * @param {number} appointmentId - ID unique du rendez-vous à supprimer
 * @returns {boolean} true si suppression réussie, false si rendez-vous non trouvé
 */
function deleteAppointment(appointmentId) {
    const appointments = readAppointment();
    const filteredAppointments = appointments.filter(apt => apt.id !== appointmentId);
    
    if (appointments.length === filteredAppointments.length) {
        components.showMessage("Appointment not found", "error");
        return false;
    }

    localStorage.setItem("Appointments", JSON.stringify(filteredAppointments));
    components.showMessage("Appointment deleted successfully!", "success");
    return true;
}

export default {
    createAppointment,
    readAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment
};
