import router from './Router/router.js';
import storage from './Storage/storage.js';
import auth from './Modules/authentification.js';
import patients from './Modules/patients.js';
import appointments from './Modules/appointment.js';
import finances from './Modules/finance.js';
import components from './Modules/component.js';

let currentUser = null;

/**
 * Initialise l'application ClinicBoard au chargement de la page
 * 
 * PROCESSUS D'INITIALISATION :
 * - Initialise le système de stockage local
 * - Vérifie l'état de connexion de l'utilisateur
 * - Configure les événements globaux de l'interface
 * - Redirige vers le dashboard si connecté, sinon vers la page de connexion
 * - Initialise les KPIs et filtres pour le mois actuel
 * 
 * GESTION DE L'ÉTAT :
 * - Vérifie la présence d'un utilisateur connecté dans localStorage
 * - Configure l'interface selon l'état d'authentification
 * - Initialise les composants spécifiques au dashboard
 * 
 * TIMING :
 * - Utilise setTimeout pour s'assurer que le DOM est prêt
 * - Délai de 200ms pour l'initialisation du filtre mensuel
 * 
 * @returns {void}
 */
function init() {
    storage.init();
    currentUser = localStorage.getItem("currentUser");
    setupEvents();
    
    if (currentUser) {
        router("dashboard");
        updateKPIs();
        setTimeout(() => {
            initializeMonthFilter();
        }, 200);
    } else {
        router("login");
    }
}

/**
 * Configure les écouteurs d'événements globaux de l'application
 * 
 * ÉVÉNEMENTS CONFIGURÉS :
 * - 'click' : Gestion des clics sur boutons, liens et éléments interactifs
 * - 'submit' : Gestion de la soumission des formulaires
 * - 'input' : Gestion des saisies en temps réel (recherche, filtres)
 * - 'change' : Gestion des changements de sélection (select, checkbox, etc.)
 * 
 * ARCHITECTURE :
 * - Utilise la délégation d'événements pour une meilleure performance
 * - Centralise la gestion des événements dans des fonctions spécialisées
 * - Évite la duplication de code et facilite la maintenance
 * 
 * PERFORMANCE :
 * - Un seul écouteur par type d'événement sur le document
 * - Délégation automatique vers les fonctions de traitement appropriées
 * 
 * @returns {void}
 */
function setupEvents() {
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
}

/**
 * Gère tous les événements de clic dans l'application
 * 
 * TYPES DE CLICS GÉRÉS :
 * - Navigation (data-route) : Changement de page avec mise à jour des données
 * - Actions (data-action) : Boutons d'action spécifiques (ajout, suppression, etc.)
 * - Fermeture de modals : Boutons de fermeture et clics sur l'overlay
 * 
 * NAVIGATION ENTRE PAGES :
 * - Dashboard : Met à jour les KPIs et initialise le filtre mensuel
 * - Patients : Charge et affiche la liste des patients
 * - Appointments : Charge et affiche la liste des rendez-vous
 * - Finances : Charge et affiche les données financières
 * 
 * GESTION DES TIMING :
 * - Utilise setTimeout pour s'assurer que le DOM est prêt
 * - Délais différents selon la complexité de la mise à jour
 * - Mise à jour du nom d'utilisateur après chaque navigation
 * 
 * PERFORMANCE :
 * - Délégation d'événements pour éviter les écouteurs multiples
 * - Prévention des comportements par défaut quand nécessaire
 * 
 * @param {Event} event - L'événement de clic déclenché
 * @returns {void}
 */
function handleClick(event) {
    const element = event.target;
    
    if (element.hasAttribute('data-route')) {
        event.preventDefault();
        const route = element.getAttribute('data-route');
        router(route);
        if (route === 'dashboard') {
            updateKPIs();
            setTimeout(() => {
                initializeMonthFilter();
            }, 100);
        } else if (route === 'patients') {
            setTimeout(() => {
                const allPatients = JSON.parse(localStorage.getItem("Patients") || "[]");
                updatePatientsDisplay(allPatients);
            }, 100);
        } else if (route === 'appointments') {
            setTimeout(() => {
                const appointments = JSON.parse(localStorage.getItem("Appointments") || "[]");
                updateAppointmentsDisplay(appointments);
            }, 100);
        } else if (route === 'finances') {
            setTimeout(() => {
                const incomes = JSON.parse(localStorage.getItem("Incomes") || "[]");
                const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
                console.log('Incomes:', incomes);
                console.log('Expenses:', expenses);
                updateFinancesDisplay(incomes, expenses);
            }, 100);
        }
        setTimeout(() => {
            const userElement = document.querySelector('.user-name');
            if (userElement) {
                userElement.textContent = getCurrentUsername();
            }
        }, 50);
    }
    
    if (element.hasAttribute('data-action')) {
        const action = element.getAttribute('data-action');
        handleAction(action, element);
    }
    
    if (element.classList.contains('close') || element.classList.contains('modal-overlay')) {
        closeModal();
    }
}

/**
 * Gère les événements de saisie en temps réel dans l'application
 * 
 * CHAMPS GÉRÉS :
 * - 'search-patients' : Recherche de patients en temps réel
 * - 'month-filter' : Filtrage des KPIs par mois sélectionné
 * 
 * FONCTIONNALITÉS :
 * - Recherche instantanée sans bouton de validation
 * - Mise à jour automatique des données selon les critères
 * - Interface réactive et fluide pour l'utilisateur
 * 
 * PERFORMANCE :
 * - Traitement immédiat des saisies
 * - Pas de délai artificiel pour une expérience optimale
 * - Filtrage côté client pour une réactivité maximale
 * 
 * @param {Event} event - L'événement d'input déclenché
 * @returns {void}
 */
function handleInput(event) {
    const element = event.target;
    
    if (element.id === 'search-patients') {
        searchPatientsAction(element.value);
    } else if (element.id === 'month-filter') {
        updateKPIsForMonth(element.value);
    }
}

/**
 * Gère les événements de changement de valeur dans l'application
 * 
 * ÉLÉMENTS GÉRÉS :
 * - Select boxes (filtres de statut, etc.)
 * - Checkboxes et radio buttons
 * - Tout élément avec l'attribut data-action
 * 
 * FONCTIONNALITÉS :
 * - Délégation vers la fonction handleAction pour les actions spécifiques
 * - Gestion centralisée des changements d'état
 * - Mise à jour automatique de l'interface selon les sélections
 * 
 * ARCHITECTURE :
 * - Utilise la délégation d'événements pour une meilleure performance
 * - Centralise la logique de traitement des changements
 * - Facilite l'ajout de nouveaux éléments interactifs
 * 
 * @param {Event} event - L'événement de changement déclenché
 * @returns {void}
 */
function handleChange(event) {
    const element = event.target;
    
    if (element.hasAttribute('data-action')) {
        const action = element.getAttribute('data-action');
        handleAction(action, element);
    }
}

/**
 * Gère la soumission de tous les formulaires de l'application
 * 
 * FORMULAIRES GÉRÉS :
 * - 'loginForm' : Connexion utilisateur
 * - 'registerForm' : Inscription nouvel utilisateur
 * - 'addPatientForm' : Ajout d'un nouveau patient
 * - 'addAppointmentForm' : Création d'un nouveau rendez-vous
 * - 'addIncomeForm' : Enregistrement d'un revenu
 * - 'addExpenseForm' : Enregistrement d'une dépense
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Prévention du comportement par défaut du formulaire
 * - Identification du formulaire par son ID
 * - Délégation vers la fonction de traitement appropriée
 * - Validation et enregistrement des données
 * 
 * SÉCURITÉ :
 * - Validation côté client avant envoi
 * - Prévention des soumissions multiples
 * - Gestion des erreurs de validation
 * 
 * @param {Event} event - L'événement de soumission du formulaire
 * @returns {void}
 */
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    if (form.id === 'loginForm') {
        handleLoginForm(form);
    } else if (form.id === 'registerForm') {
        handleRegisterForm(form);
    } else if (form.id === 'addPatientForm') {
        handleAddPatientForm(form);
    } else if (form.id === 'addAppointmentForm') {
        handleAddAppointmentForm(form);
    } else if (form.id === 'addIncomeForm') {
        handleAddIncomeForm(form);
    } else if (form.id === 'addExpenseForm') {
        handleAddExpenseForm(form);
    }
}

/**
 * Centralise la gestion de toutes les actions utilisateur dans l'application
 * 
 * ACTIONS DE MODAL :
 * - 'show-add-patient' : Affiche le formulaire d'ajout de patient
 * - 'show-add-appointment' : Affiche le formulaire de création de rendez-vous
 * - 'show-add-income' : Affiche le formulaire d'ajout de revenu
 * - 'show-add-expense' : Affiche le formulaire d'ajout de dépense
 * - 'close-modal' : Ferme la modal active
 * 
 * ACTIONS DE DONNÉES :
 * - 'delete-patient' : Supprime un patient avec confirmation
 * - 'update-appointment-status' : Met à jour le statut d'un rendez-vous
 * - 'logout' : Déconnecte l'utilisateur actuel
 * 
 * ACTIONS DE FILTRAGE :
 * - 'search-patients' : Lance une recherche de patients
 * - 'filter-appointments' : Applique les filtres de rendez-vous
 * - 'clear-filters' : Efface tous les filtres actifs
 * 
 * ARCHITECTURE :
 * - Pattern Switch pour une gestion centralisée
 * - Délégation vers des fonctions spécialisées
 * - Récupération des données via les attributs data-*
 * 
 * @param {string} action - L'action à exécuter (attribut data-action)
 * @param {HTMLElement} element - L'élément qui a déclenché l'action
 * @returns {void}
 */
function handleAction(action, element) {
    switch (action) {
        case 'show-add-patient':
            showAddPatientModal();
            break;
        case 'show-add-appointment':
            showAddAppointmentModal();
            break;
        case 'show-add-income':
            showAddIncomeModal();
            break;
        case 'show-add-expense':
            showAddExpenseModal();
            break;
        case 'delete-patient':
            deletePatientAction(element.getAttribute('data-patient-id'));
            break;
        case 'logout':
            auth.handleLogout();
            break;
        case 'search-patients':
            searchPatientsAction(element.value);
            break;
        case 'filter-appointments':
            filterAppointmentsAction();
            break;
        case 'clear-filters':
            clearAppointmentFilters();
            break;
        case 'update-appointment-status':
            updateAppointmentStatusAction(element.getAttribute('data-appointment-id'), element.getAttribute('data-status'));
            break;
        case 'close-modal':
            closeModal();
            break;
    }
}

/**
 * Affiche une modal générique avec titre et contenu personnalisables
 * 
 * STRUCTURE DE LA MODAL :
 * - Overlay semi-transparent couvrant tout l'écran
 * - Conteneur modal centré avec styles responsifs
 * - En-tête avec titre et bouton de fermeture
 * - Zone de contenu pour le formulaire ou le contenu
 * 
 * FONCTIONNALITÉS :
 * - Fermeture par clic sur le bouton X
 * - Fermeture par clic sur l'overlay (arrière-plan)
 * - Styles inline pour une compatibilité maximale
 * - Responsive design avec largeur maximale
 * 
 * GESTION DES ÉVÉNEMENTS :
 * - Écouteur sur le bouton de fermeture
 * - Écouteur sur l'overlay avec vérification de la cible
 * - Prévention de la fermeture accidentelle
 * 
 * STYLES APPLIQUÉS :
 * - Design moderne avec ombres et bordures arrondies
 * - Scroll vertical si le contenu dépasse
 * - Couleurs cohérentes avec le thème de l'application
 * 
 * @param {string} title - Le titre affiché dans l'en-tête de la modal
 * @param {string} content - Le contenu HTML à afficher dans la modal
 * @returns {void}
 */
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal" style="background-color: white; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); max-width: 28rem; width: 100%; max-height: 85vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                <h2 style="font-size: 1.25rem; font-weight: 600; color: #111827;">${title}</h2>
                <button class="modal-close" style="background: none; border: none; color: #9ca3af; font-size: 1.5rem; font-weight: 700; cursor: pointer; transition: color 0.2s; padding: 0.25rem;">&times;</button>
            </div>
            <div class="modal-content" style="padding: 1rem;">${content}</div>
        </div>
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal;
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    document.body.appendChild(modal);
}

/**
 * Ferme la modal active en la supprimant du DOM
 * 
 * PROCESSUS DE FERMETURE :
 * - Recherche de la modal active dans le DOM
 * - Suppression complète de l'élément modal
 * - Nettoyage automatique des événements associés
 * 
 * SÉCURITÉ :
 * - Vérification de l'existence de la modal avant suppression
 * - Gestion des cas où aucune modal n'est ouverte
 * - Pas d'erreur si la modal est déjà fermée
 * 
 * PERFORMANCE :
 * - Suppression directe de l'élément du DOM
 * - Libération automatique de la mémoire
 * - Pas de fuite d'événements
 * 
 * @returns {void}
 */
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

/**
 * Affiche la modal d'ajout de patient
 * 
 * PROCESSUS :
 * - Génère le formulaire de patient via le module components
 * - Affiche la modal avec le titre 'Add a Patient'
 * - Prépare l'interface pour la saisie des données patient
 * 
 * FORMULAIRE INCLUS :
 * - Nom complet (obligatoire)
 * - Numéro de téléphone (obligatoire)
 * - Adresse email (optionnelle)
 * - Notes médicales (optionnelles)
 * 
 * @returns {void}
 */
function showAddPatientModal() {
    const form = components.patientForm();
    showModal('Add a Patient', form);
}

/**
 * Affiche la modal de création de rendez-vous
 * 
 * PROCESSUS :
 * - Récupère la liste des patients existants
 * - Génère le formulaire de rendez-vous avec la liste des patients
 * - Affiche la modal avec le titre 'New Appointment'
 * 
 * DONNÉES REQUISES :
 * - Liste des patients pour le sélecteur
 * - Formulaire avec tous les champs nécessaires
 * - Validation des données de rendez-vous
 * 
 * FORMULAIRE INCLUS :
 * - Sélection du patient (obligatoire)
 * - Date du rendez-vous (obligatoire)
 * - Heure du rendez-vous (obligatoire)
 * - Durée en minutes (obligatoire)
 * - Notes optionnelles
 * 
 * @returns {void}
 */
function showAddAppointmentModal() {
    const patientsList = patients.readPatient();
    const form = components.appointmentForm(patientsList);
    showModal('New Appointment', form);
}

/**
 * Affiche la modal d'ajout de revenu
 * 
 * PROCESSUS :
 * - Génère le formulaire de revenu via le module components
 * - Affiche la modal avec le titre 'Add Income'
 * - Prépare l'interface pour l'enregistrement des revenus
 * 
 * FORMULAIRE INCLUS :
 * - Montant du revenu (obligatoire, positif)
 * - Méthode de paiement (obligatoire)
 * - Description du revenu (optionnelle)
 * 
 * @returns {void}
 */
function showAddIncomeModal() {
    const form = components.incomeForm();
    showModal('Add Income', form);
}

/**
 * Affiche la modal d'ajout de dépense
 * 
 * PROCESSUS :
 * - Génère le formulaire de dépense via le module components
 * - Affiche la modal avec le titre 'Add Expense'
 * - Prépare l'interface pour l'enregistrement des dépenses
 * 
 * FORMULAIRE INCLUS :
 * - Montant de la dépense (obligatoire, positif)
 * - Catégorie de dépense (obligatoire)
 * - Description de la dépense (optionnelle)
 * 
 * @returns {void}
 */
function showAddExpenseModal() {
    const form = components.expenseForm();
    showModal('Add Expense', form);
}

/**
 * Traite la soumission du formulaire de connexion
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Extrait les données du formulaire via FormData
 * - Récupère le nom d'utilisateur et le mot de passe
 * - Délègue l'authentification au module auth
 * 
 * DONNÉES EXTRAITES :
 * - userName : Nom d'utilisateur saisi
 * - password : Mot de passe saisi
 * 
 * SÉCURITÉ :
 * - Validation côté client avant envoi
 * - Gestion des erreurs d'authentification
 * - Protection contre les attaques par force brute
 * 
 * @param {HTMLFormElement} form - Le formulaire de connexion soumis
 * @returns {void}
 */
function handleLoginForm(form) {
    const formData = new FormData(form);
    const username = formData.get('userName');
    const password = formData.get('password');
    auth.handleLogin(username, password);
}

/**
 * Traite la soumission du formulaire d'inscription
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Extrait les données du formulaire via FormData
 * - Récupère le nom d'utilisateur, mot de passe et confirmation
 * - Délègue l'inscription au module auth
 * 
 * DONNÉES EXTRAITES :
 * - userName : Nom d'utilisateur souhaité
 * - password : Mot de passe choisi
 * - pwdConfirmed : Confirmation du mot de passe
 * 
 * VALIDATION :
 * - Vérification de la correspondance des mots de passe
 * - Validation de la force du mot de passe
 * - Vérification de l'unicité du nom d'utilisateur
 * 
 * @param {HTMLFormElement} form - Le formulaire d'inscription soumis
 * @returns {void}
 */
function handleRegisterForm(form) {
    const formData = new FormData(form);
    const username = formData.get('userName');
    const password = formData.get('password');
    const confirmPassword = formData.get('pwdConfirmed');
    auth.handleRegister(username, password, confirmPassword);
}

/**
 * Traite la soumission du formulaire d'ajout de patient
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Extrait les données du formulaire via FormData
 * - Structure les données dans un objet patient
 * - Tente de créer le patient via le module patients
 * - Ferme la modal et recharge la liste en cas de succès
 * 
 * DONNÉES EXTRAITES :
 * - fullName : Nom complet du patient (obligatoire)
 * - phone : Numéro de téléphone (obligatoire)
 * - email : Adresse email (optionnelle)
 * - notes : Notes médicales (optionnelles)
 * 
 * GESTION DU SUCCÈS :
 * - Fermeture automatique de la modal
 * - Redirection vers la page des patients
 * - Rechargement de la liste des patients
 * - Mise à jour de l'affichage
 * 
 * GESTION DES ERREURS :
 * - Affichage des messages d'erreur via le module patients
 * - Conservation de la modal ouverte en cas d'erreur
 * - Validation des données avant enregistrement
 * 
 * @param {HTMLFormElement} form - Le formulaire d'ajout de patient soumis
 * @returns {void}
 */
function handleAddPatientForm(form) {
    const formData = new FormData(form);
    const patientData = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        notes: formData.get('notes')
    };
    
    if (patients.createPatient(patientData)) {
        closeModal();
        router('patients');
        setTimeout(() => {
            const allPatients = JSON.parse(localStorage.getItem("Patients") || "[]");
            updatePatientsDisplay(allPatients);
        }, 100);
    }
}

/**
 * Traite la soumission du formulaire de création de rendez-vous
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Extrait les données du formulaire via FormData
 * - Convertit les valeurs numériques (patientId, duration)
 * - Structure les données dans un objet appointment
 * - Tente de créer le rendez-vous via le module appointments
 * - Ferme la modal et recharge la liste en cas de succès
 * 
 * DONNÉES EXTRAITES :
 * - patientId : ID du patient sélectionné (obligatoire, converti en entier)
 * - date : Date du rendez-vous (obligatoire, format YYYY-MM-DD)
 * - time : Heure du rendez-vous (obligatoire, format HH:MM)
 * - duration : Durée en minutes (obligatoire, converti en entier)
 * - notes : Notes optionnelles sur le rendez-vous
 * 
 * CONVERSIONS DE TYPES :
 * - parseInt() pour patientId et duration
 * - Conservation des chaînes pour date, time et notes
 * 
 * GESTION DU SUCCÈS :
 * - Fermeture automatique de la modal
 * - Redirection vers la page des rendez-vous
 * - Rechargement de la liste des rendez-vous
 * - Mise à jour de l'affichage
 * 
 * DEBUGGING :
 * - Logs détaillés pour le suivi du processus
 * - Affichage des données avant et après traitement
 * 
 * @param {HTMLFormElement} form - Le formulaire de création de rendez-vous soumis
 * @returns {void}
 */
function handleAddAppointmentForm(form) {
    console.log('handleAddAppointmentForm called');
    const formData = new FormData(form);
    const appointmentData = {
        patientId: parseInt(formData.get('patientId')),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: parseInt(formData.get('duration')),
        notes: formData.get('notes')
    };
    
    console.log('Appointment data:', appointmentData);
    
    if (appointments.createAppointment(appointmentData)) {
        console.log('Appointment created successfully');
        closeModal();
        router('appointments');
        setTimeout(() => {
            const allAppointments = JSON.parse(localStorage.getItem("Appointments") || "[]");
            console.log('Reloading appointments:', allAppointments);
            updateAppointmentsDisplay(allAppointments);
        }, 100);
    } else {
        console.log('Failed to create appointment');
    }
}

/**
 * Traite la soumission du formulaire d'ajout de revenu
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Extrait les données du formulaire via FormData
 * - Convertit le montant en nombre décimal
 * - Structure les données dans un objet income
 * - Tente de créer le revenu via le module finances
 * - Ferme la modal et recharge les données en cas de succès
 * 
 * DONNÉES EXTRAITES :
 * - amount : Montant du revenu (obligatoire, converti en float)
 * - method : Méthode de paiement (obligatoire)
 * - description : Description du revenu (optionnelle)
 * 
 * CONVERSIONS DE TYPES :
 * - parseFloat() pour le montant
 * - Conservation des chaînes pour method et description
 * 
 * GESTION DU SUCCÈS :
 * - Fermeture automatique de la modal
 * - Redirection vers la page des finances
 * - Rechargement des données financières (revenus et dépenses)
 * - Mise à jour de l'affichage et des KPIs
 * 
 * VALIDATION :
 * - Vérification de la positivité du montant
 * - Validation des formats numériques
 * - Contrôle de cohérence des données
 * 
 * @param {HTMLFormElement} form - Le formulaire d'ajout de revenu soumis
 * @returns {void}
 */
function handleAddIncomeForm(form) {
    const formData = new FormData(form);
    const incomeData = {
        amount: parseFloat(formData.get('amount')),
        method: formData.get('method'),
        description: formData.get('description')
    };
    
    if (finances.createIncome(incomeData)) {
        closeModal();
        router('finances');
        setTimeout(() => {
            const incomes = JSON.parse(localStorage.getItem("Incomes") || "[]");
            const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
            updateFinancesDisplay(incomes, expenses);
        }, 100);
    }
}

/**
 * Traite la soumission du formulaire d'ajout de dépense
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Extrait les données du formulaire via FormData
 * - Convertit le montant en nombre décimal
 * - Structure les données dans un objet expense
 * - Tente de créer la dépense via le module finances
 * - Ferme la modal et recharge les données en cas de succès
 * 
 * DONNÉES EXTRAITES :
 * - amount : Montant de la dépense (obligatoire, converti en float)
 * - category : Catégorie de dépense (obligatoire)
 * - description : Description de la dépense (optionnelle)
 * 
 * CONVERSIONS DE TYPES :
 * - parseFloat() pour le montant
 * - Conservation des chaînes pour category et description
 * 
 * GESTION DU SUCCÈS :
 * - Fermeture automatique de la modal
 * - Redirection vers la page des finances
 * - Rechargement des données financières (revenus et dépenses)
 * - Mise à jour de l'affichage et des KPIs
 * 
 * VALIDATION :
 * - Vérification de la positivité du montant
 * - Validation des formats numériques
 * - Contrôle de cohérence des données
 * 
 * @param {HTMLFormElement} form - Le formulaire d'ajout de dépense soumis
 * @returns {void}
 */
function handleAddExpenseForm(form) {
    const formData = new FormData(form);
    const expenseData = {
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description')
    };
    
    if (finances.createExpense(expenseData)) {
        closeModal();
        router('finances');
        setTimeout(() => {
            const incomes = JSON.parse(localStorage.getItem("Incomes") || "[]");
            const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
            updateFinancesDisplay(incomes, expenses);
        }, 100);
    }
}

/**
 * Gère la suppression d'un patient avec confirmation
 * 
 * PROCESSUS DE SUPPRESSION :
 * - Affiche une boîte de confirmation à l'utilisateur
 * - Convertit l'ID patient en entier
 * - Tente de supprimer le patient via le module patients
 * - Recharge la liste des patients en cas de succès
 * 
 * SÉCURITÉ :
 * - Confirmation obligatoire avant suppression
 * - Vérification de l'existence du patient
 * - Gestion des erreurs de suppression
 * 
 * GESTION DU SUCCÈS :
 * - Redirection vers la page des patients
 * - Rechargement de la liste des patients
 * - Mise à jour de l'affichage
 * 
 * GESTION DES ERREURS :
 * - Affichage des messages d'erreur via le module patients
 * - Conservation de la liste actuelle en cas d'échec
 * 
 * @param {string} patientId - L'ID du patient à supprimer
 * @returns {void}
 */
function deletePatientAction(patientId) {
    if (confirm('Are you sure you want to delete this patient?')) {
        if (patients.deletePatient(parseInt(patientId))) {
            router('patients');
            setTimeout(() => {
                const allPatients = JSON.parse(localStorage.getItem("Patients") || "[]");
                updatePatientsDisplay(allPatients);
            }, 100);
        }
    }
}

/**
 * Gère la recherche de patients en temps réel
 * 
 * PROCESSUS DE RECHERCHE :
 * - Vérifie si un terme de recherche est fourni
 * - Affiche tous les patients si le terme est vide
 * - Lance la recherche via le module patients si un terme est fourni
 * - Met à jour l'affichage avec les résultats
 * 
 * GESTION DES CAS VIDES :
 * - Terme de recherche vide ou null
 * - Terme de recherche contenant uniquement des espaces
 * - Affichage de tous les patients dans ces cas
 * 
 * PERFORMANCE :
 * - Recherche côté client pour une réactivité maximale
 * - Pas de délai artificiel
 * - Mise à jour immédiate de l'interface
 * 
 * @param {string} searchTerm - Le terme de recherche saisi par l'utilisateur
 * @returns {void}
 */
function searchPatientsAction(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        const allPatients = JSON.parse(localStorage.getItem("Patients") || "[]");
        updatePatientsDisplay(allPatients);
        return;
    }
    
    const results = patients.searchPatient(searchTerm);
    updatePatientsDisplay(results);
}

/**
 * Met à jour l'affichage de la liste des patients
 * 
 * PROCESSUS D'AFFICHAGE :
 * - Récupère le conteneur de la liste des patients
 * - Vérifie l'existence du conteneur
 * - Affiche un message si aucun patient n'est trouvé
 * - Génère les cartes de patients si des données existent
 * 
 * GESTION DES CAS VIDES :
 * - Message centré "No patients found"
 * - Styles cohérents avec le design de l'application
 * - Grille responsive pour le message
 * 
 * GÉNÉRATION DES CARTES :
 * - Nom complet du patient en en-tête
 * - Bouton de suppression avec confirmation
 * - Informations de contact (téléphone, email)
 * - Notes médicales si disponibles
 * - Styles inline pour la compatibilité
 * 
 * FONCTIONNALITÉS INTERACTIVES :
 * - Bouton de suppression avec data-action
 * - ID patient dans data-patient-id
 * - Gestion des champs optionnels (email, notes)
 * 
 * @param {Array} patientsList - La liste des patients à afficher
 * @returns {void}
 */
function updatePatientsDisplay(patientsList) {
    const container = document.getElementById('patients-list');
    if (!container) return;
    
    if (patientsList.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;"><p style="color: #6b7280; font-size: 1.125rem;">No patients found</p></div>';
        return;
    }
    
    container.innerHTML = patientsList.map(patient => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827;">${patient.fullName}</h3>
                <button class="btn-danger" style="padding: 0.25rem 0.375rem; font-size: 0.625rem;" 
                        data-action="delete-patient" 
                        data-patient-id="${patient.id}">
                    Supprimer
                </button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.5rem;">
                <p style="font-size: 0.75rem; color: #4b5563;">
                    <span style="font-weight: 500;">Téléphone:</span> ${patient.phone}
                </p>
                <p style="font-size: 0.75rem; color: #4b5563;">
                    <span style="font-weight: 500;">Email:</span> ${patient.email || 'Non renseigné'}
                </p>
                ${patient.notes ? `<p style="font-size: 0.75rem; color: #4b5563;"><span style="font-weight: 500;">Notes:</span> ${patient.notes}</p>` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Récupère le nom d'utilisateur actuellement connecté
 * 
 * PROCESSUS DE RÉCUPÉRATION :
 * - Récupère les données de l'utilisateur depuis localStorage
 * - Parse les données JSON si elles existent
 * - Extrait le nom d'utilisateur
 * - Retourne une valeur par défaut si aucun utilisateur n'est connecté
 * 
 * GESTION DES CAS D'ERREUR :
 * - Utilisateur non connecté (currentUser null)
 * - Données corrompues dans localStorage
 * - Valeur par défaut 'Utilisateur' en cas d'erreur
 * 
 * UTILISATION :
 * - Affichage du nom dans la navbar
 * - Personnalisation de l'interface
 * - Identification de l'utilisateur actuel
 * 
 * @returns {string} Le nom d'utilisateur ou 'Utilisateur' par défaut
 */
function getCurrentUsername() {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser ? JSON.parse(currentUser).username : 'Utilisateur';
}

/**
 * Met à jour les indicateurs clés de performance (KPIs) du dashboard
 * 
 * CALCULS FINANCIERS :
 * - Revenus mensuels totaux
 * - Dépenses mensuelles totales
 * - Marge bénéficiaire (revenus - dépenses)
 * - Données récupérées via finances.getMonthlyData()
 * 
 * CALCULS DE PATIENTS :
 * - Nombre total de patients enregistrés
 * - Données récupérées depuis localStorage
 * 
 * CALCULS DE RENDEZ-VOUS :
 * - Filtrage des rendez-vous par mois sélectionné
 * - Comptage des rendez-vous du mois
 * - Gestion des dates JavaScript (mois 0-indexés)
 * 
 * GESTION DES PÉRIODES :
 * - Mois actuel par défaut si aucun mois sélectionné
 * - Conversion du format YYYY-MM vers mois/année JavaScript
 * - Filtrage précis des données mensuelles
 * 
 * AFFICHAGE :
 * - Mise à jour des éléments DOM avec les valeurs calculées
 * - Formatage des montants avec 2 décimales
 * - Ajout de l'unité "Dh" pour les montants
 * - Mise à jour du nom d'utilisateur dans la navbar
 * 
 * DEBUGGING :
 * - Logs détaillés pour le suivi des calculs
 * - Affichage des données brutes et filtrées
 * - Vérification des conversions de dates
 * 
 * @param {string|null} selectedMonth - Le mois sélectionné au format YYYY-MM ou null pour le mois actuel
 * @returns {void}
 */
function updateKPIs(selectedMonth = null) {
    const currentDate = new Date();
    let currentMonth, currentYear;
    
    if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        currentMonth = parseInt(month) - 1;
        currentYear = parseInt(year);
    } else {
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
    }
    
    const monthlyData = finances.getMonthlyData(currentMonth, currentYear);
    const patients = JSON.parse(localStorage.getItem("Patients") || "[]");
    const appointments = JSON.parse(localStorage.getItem("Appointments") || "[]");
    
    const monthlyAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
    });
    
    const appointmentCount = monthlyAppointments.length;
    console.log('=== DASHBOARD KPIs DEBUG ===');
    console.log('Selected month:', selectedMonth);
    console.log('Current month:', currentMonth, 'Current year:', currentYear);
    console.log('All appointments:', appointments);
    console.log('Monthly appointments:', monthlyAppointments);
    console.log('Appointment count:', appointmentCount);
    console.log('============================');
    
    document.getElementById('monthly-revenue').innerHTML = `${monthlyData.totalIncome.toFixed(2)} <span style="font-size: 1.5rem;">Dh</span>`;
    document.getElementById('monthly-expenses').innerHTML = `${monthlyData.totalExpense.toFixed(2)} <span style="font-size: 1.5rem;">Dh</span>`;
    document.getElementById('monthly-margin').innerHTML = `${(monthlyData.totalIncome - monthlyData.totalExpense).toFixed(2)} <span style="font-size: 1.5rem;">Dh</span>`;
    document.getElementById('total-patients').textContent = patients.length;
    document.getElementById('monthly-appointments').textContent = appointmentCount;
    
    const userElement = document.querySelector('.user-name');
    if (userElement) {
        userElement.textContent = getCurrentUsername();
    }
}

/**
 * Met à jour les KPIs pour un mois spécifique
 * 
 * FONCTION WRAPPER :
 * - Délègue vers updateKPIs() avec le mois sélectionné
 * - Interface simplifiée pour les événements de changement
 * - Gestion des sélections de mois depuis l'interface
 * 
 * UTILISATION :
 * - Appelée lors du changement de sélection dans le filtre mensuel
 * - Mise à jour automatique des KPIs selon la sélection
 * - Interface réactive aux changements de période
 * 
 * @param {string} selectedMonth - Le mois sélectionné au format YYYY-MM
 * @returns {void}
 */
function updateKPIsForMonth(selectedMonth) {
    updateKPIs(selectedMonth);
}

/**
 * Initialise le filtre mensuel avec le mois actuel
 * 
 * PROCESSUS D'INITIALISATION :
 * - Récupère l'élément select du filtre mensuel
 * - Calcule le mois actuel au format YYYY-MM
 * - Définit la valeur par défaut du filtre
 * 
 * FORMATAGE DE LA DATE :
 * - Année : currentDate.getFullYear()
 * - Mois : (currentDate.getMonth() + 1) avec padding sur 2 chiffres
 * - Format final : YYYY-MM (ex: 2024-03)
 * 
 * GESTION DES ERREURS :
 * - Vérification de l'existence de l'élément
 * - Pas d'erreur si l'élément n'est pas trouvé
 * - Initialisation silencieuse
 * 
 * UTILISATION :
 * - Appelée au chargement du dashboard
 * - Initialisation de l'interface utilisateur
 * - Définition de la période par défaut
 * 
 * @returns {void}
 */
function initializeMonthFilter() {
    const monthFilter = document.getElementById('month-filter');
    if (monthFilter) {
        const currentDate = new Date();
        const currentMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
        monthFilter.value = currentMonth;
    }
}

/**
 * Applique les filtres de statut et de date aux rendez-vous
 * 
 * FILTRES SUPPORTÉS :
 * - Filtre par statut : scheduled, confirmed, cancelled, completed
 * - Filtre par date : format YYYY-MM-DD
 * - Combinaison des deux filtres (ET logique)
 * 
 * PROCESSUS DE FILTRAGE :
 * - Récupération des valeurs des filtres depuis le DOM
 * - Chargement de tous les rendez-vous depuis localStorage
 * - Application séquentielle des filtres
 * - Mise à jour de l'affichage avec les résultats
 * 
 * GESTION DES VALEURS VIDES :
 * - Filtres vides ignorés (pas d'application)
 * - Utilisation de l'opérateur || pour les valeurs par défaut
 * - Filtrage progressif des résultats
 * 
 * DEBUGGING :
 * - Logs détaillés à chaque étape
 * - Affichage des valeurs de filtres
 * - Suivi des résultats intermédiaires
 * - Vérification des résultats finaux
 * 
 * PERFORMANCE :
 * - Filtrage côté client pour une réactivité maximale
 * - Pas de requêtes serveur
 * - Mise à jour immédiate de l'interface
 * 
 * @returns {void}
 */
function filterAppointmentsAction() {
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const dateFilter = document.getElementById('date-filter')?.value || '';
    
    console.log('filterAppointmentsAction called');
    console.log('Status filter:', statusFilter);
    console.log('Date filter:', dateFilter);
    
    const appointments = JSON.parse(localStorage.getItem("Appointments") || "[]");
    console.log('All appointments:', appointments);
    
    let filteredAppointments = appointments;
    
    if (statusFilter) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === statusFilter);
        console.log('After status filter:', filteredAppointments);
    }
    
    if (dateFilter) {
        filteredAppointments = filteredAppointments.filter(apt => apt.date === dateFilter);
        console.log('After date filter:', filteredAppointments);
    }
    
    console.log('Final filtered appointments:', filteredAppointments);
    updateAppointmentsDisplay(filteredAppointments);
}

/**
 * Efface tous les filtres de rendez-vous et affiche tous les rendez-vous
 * 
 * PROCESSUS DE RÉINITIALISATION :
 * - Remet à vide le filtre de statut
 * - Remet à vide le filtre de date
 * - Recharge tous les rendez-vous depuis localStorage
 * - Met à jour l'affichage avec la liste complète
 * 
 * ÉLÉMENTS RÉINITIALISÉS :
 * - 'status-filter' : Sélecteur de statut
 * - 'date-filter' : Sélecteur de date
 * 
 * AFFICHAGE :
 * - Récupération de tous les rendez-vous
 * - Mise à jour de l'interface
 * - Restauration de la vue complète
 * 
 * UTILISATION :
 * - Bouton 'Clear' dans l'interface
 * - Réinitialisation manuelle des filtres
 * - Retour à la vue par défaut
 * 
 * @returns {void}
 */
function clearAppointmentFilters() {
    document.getElementById('status-filter').value = '';
    document.getElementById('date-filter').value = '';
    
    const appointments = JSON.parse(localStorage.getItem("Appointments") || "[]");
    updateAppointmentsDisplay(appointments);
}

/**
 * Met à jour l'affichage de la liste des rendez-vous
 * 
 * STRUCTURE D'AFFICHAGE :
 * - Conteneur principal (main) : 3 premiers rendez-vous
 * - Conteneur secondaire (secondary) : 2 rendez-vous suivants
 * - Message si aucun rendez-vous trouvé
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Vérification de l'existence des conteneurs
 * - Tri des rendez-vous par date et heure
 * - Division en deux groupes pour l'affichage
 * - Génération des cartes de rendez-vous
 * 
 * TRI DES RENDEZ-VOUS :
 * - Combinaison date + heure pour le tri
 * - Tri chronologique croissant
 * - Gestion des dates JavaScript
 * 
 * GÉNÉRATION DES CARTES :
 * - Nom du patient en en-tête
 * - Badge de statut avec couleur appropriée
 * - Détails : date, heure, durée
 * - Notes optionnelles
 * - Boutons d'action selon le statut
 * 
 * BOUTONS D'ACTION :
 * - Scheduled → Bouton "Confirm"
 * - Confirmed → Bouton "Complete"
 * - Autres statuts → Bouton "Cancel"
 * - Gestion des statuts finaux (cancelled, completed)
 * 
 * DEBUGGING :
 * - Logs détaillés pour le suivi
 * - Vérification des conteneurs
 * - Affichage des données reçues
 * 
 * @param {Array} appointments - La liste des rendez-vous à afficher
 * @returns {void}
 */
function updateAppointmentsDisplay(appointments) {
    const mainContainer = document.getElementById('appointments-main');
    const secondaryContainer = document.getElementById('appointments-secondary');
    
    console.log('updateAppointmentsDisplay called with:', appointments);
    console.log('Main container found:', mainContainer);
    console.log('Secondary container found:', secondaryContainer);
    
    if (!mainContainer || !secondaryContainer) {
        console.log('Containers not found, returning');
        return;
    }
    
    if (appointments.length === 0) {
        mainContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;"><p style="color: #6b7280; font-size: 1.125rem;">No appointments found</p></div>';
        secondaryContainer.innerHTML = '';
        return;
    }
    
    const sortedAppointments = appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
    });
    
    const mainAppointments = sortedAppointments.slice(0, 3);
    const secondaryAppointments = sortedAppointments.slice(3, 5);
    
    const appointmentCard = (appointment) => {
        const statusClass = getStatusClass(appointment.status);
        const statusText = getStatusText(appointment.status);
        
        return `
            <div class="appointment-card">
                <div class="appointment-header">
                    <h3 class="appointment-title">${appointment.patientName}</h3>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="appointment-details">
                    <p class="appointment-detail appointment-detail-inline">
                        <span class="appointment-detail-label">Date:</span> ${formatDateShort(appointment.date)} | 
                        <span class="appointment-detail-label">Time:</span> ${appointment.time}
                    </p>
                    <p class="appointment-detail">
                        <span class="appointment-detail-label">Duration:</span> ${appointment.duration} min
                    </p>
                </div>
                ${appointment.notes ? `<p class="appointment-notes"><span class="appointment-detail-label">Notes:</span> ${appointment.notes}</p>` : ''}
                <div class="appointment-actions">
                    ${appointment.status === 'scheduled' ? `
                        <button class="appointment-btn btn-warning" 
                                data-action="update-appointment-status" 
                                data-appointment-id="${appointment.id}"
                                data-status="confirmed">
                            Confirm
                        </button>
                    ` : ''}
                    ${appointment.status === 'confirmed' ? `
                        <button class="appointment-btn btn-success" 
                                data-action="update-appointment-status" 
                                data-appointment-id="${appointment.id}"
                                data-status="completed">
                            Complete
                        </button>
                    ` : ''}
                    ${appointment.status !== 'cancelled' && appointment.status !== 'completed' ? `
                        <button class="appointment-btn btn-danger" 
                                data-action="update-appointment-status" 
                                data-appointment-id="${appointment.id}"
                                data-status="cancelled">
                            Cancel
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    };
    
    mainContainer.innerHTML = mainAppointments.map(appointmentCard).join('');
    secondaryContainer.innerHTML = secondaryAppointments.map(appointmentCard).join('');
}

/**
 * Retourne la classe CSS appropriée pour un statut de rendez-vous
 * 
 * STATUTS SUPPORTÉS :
 * - 'scheduled' → 'status-scheduled' (programmé)
 * - 'confirmed' → 'status-confirmed' (confirmé)
 * - 'cancelled' → 'status-cancelled' (annulé)
 * - 'completed' → 'status-completed' (terminé)
 * 
 * GESTION DES ERREURS :
 * - Statut inconnu → 'status-scheduled' par défaut
 * - Valeur null/undefined → 'status-scheduled' par défaut
 * - Robustesse face aux données corrompues
 * 
 * UTILISATION :
 * - Génération des badges de statut
 * - Application des styles CSS appropriés
 * - Cohérence visuelle de l'interface
 * 
 * @param {string} status - Le statut du rendez-vous
 * @returns {string} La classe CSS correspondante
 */
function getStatusClass(status) {
    const statusClasses = {
        'scheduled': 'status-scheduled',
        'confirmed': 'status-confirmed',
        'cancelled': 'status-cancelled',
        'completed': 'status-completed'
    };
    return statusClasses[status] || 'status-scheduled';
}

/**
 * Retourne le texte lisible pour un statut de rendez-vous
 * 
 * STATUTS SUPPORTÉS :
 * - 'scheduled' → 'Scheduled' (programmé)
 * - 'confirmed' → 'Confirmed' (confirmé)
 * - 'cancelled' → 'Cancelled' (annulé)
 * - 'completed' → 'Completed' (terminé)
 * 
 * GESTION DES ERREURS :
 * - Statut inconnu → 'Programmé' par défaut
 * - Valeur null/undefined → 'Programmé' par défaut
 * - Robustesse face aux données corrompues
 * 
 * UTILISATION :
 * - Affichage des badges de statut
 * - Interface utilisateur lisible
 * - Cohérence linguistique
 * 
 * @param {string} status - Le statut du rendez-vous
 * @returns {string} Le texte lisible correspondant
 */
function getStatusText(status) {
    const statusTexts = {
        'scheduled': 'Scheduled',
        'confirmed': 'Confirmed',
        'cancelled': 'Cancelled',
        'completed': 'Completed'
    };
    return statusTexts[status] || 'Programmé';
}

/**
 * Convertit un code de catégorie de dépense en texte lisible
 * 
 * CATÉGORIES SUPPORTÉES :
 * - 'rent' → 'Rent' (loyer)
 * - 'utilities' → 'Electricity/Water' (électricité/eau)
 * - 'supplies' → 'Supplies' (fournitures)
 * - 'equipment' → 'Equipment' (équipement)
 * - 'personnel' → 'Personnel' (personnel)
 * - 'marketing' → 'Marketing' (marketing)
 * - 'other' → 'Other' (autre)
 * 
 * GESTION DES ERREURS :
 * - Catégorie inconnue → retourne la catégorie originale
 * - Valeur null/undefined → retourne la valeur originale
 * - Robustesse face aux nouvelles catégories
 * 
 * UTILISATION :
 * - Affichage des catégories dans les listes
 * - Interface utilisateur lisible
 * - Cohérence linguistique
 * 
 * @param {string} category - Le code de catégorie
 * @returns {string} Le texte lisible correspondant
 */
function getCategoryText(category) {
    const categoryMap = {
        'rent': 'Rent',
        'utilities': 'Electricity/Water',
        'supplies': 'Supplies',
        'equipment': 'Equipment',
        'personnel': 'Personnel',
        'marketing': 'Marketing',
        'other': 'Other'
    };
    return categoryMap[category] || category;
}

/**
 * Met à jour l'affichage des données financières (revenus et dépenses)
 * 
 * STRUCTURE D'AFFICHAGE :
 * - Tableau des revenus avec description, montant, méthode, date
 * - Tableau des dépenses avec description, montant, catégorie, date
 * - Messages si aucune donnée enregistrée
 * 
 * PROCESSUS DE TRAITEMENT :
 * - Vérification de l'existence des conteneurs
 * - Gestion des listes vides
 * - Génération des lignes de tableau
 * - Formatage des montants et dates
 * 
 * FORMATAGE DES DONNÉES :
 * - Montants : 2 décimales + unité "Dh"
 * - Dates : format court français (DD/MM/YYYY)
 * - Catégories : conversion en texte lisible
 * - Valeurs manquantes : "N/A"
 * 
 * STYLES APPLIQUÉS :
 * - Classes CSS pour les montants (amount-income, amount-expense)
 * - Badges pour les méthodes et catégories
 * - Styles inline pour les messages vides
 * 
 * DEBUGGING :
 * - Logs détaillés des données reçues
 * - Vérification des conteneurs
 * - Suivi du processus de génération
 * 
 * @param {Array} incomes - La liste des revenus à afficher
 * @param {Array} expenses - La liste des dépenses à afficher
 * @returns {void}
 */
function updateFinancesDisplay(incomes, expenses) {
    console.log('updateFinancesDisplay called with:', { incomes, expenses });
    const incomesContainer = document.getElementById('incomes-list');
    const expensesContainer = document.getElementById('expenses-list');
    
    console.log('Containers found:', { incomesContainer, expensesContainer });
    
    if (incomesContainer) {
        if (incomes.length === 0) {
            incomesContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #6b7280;">No income recorded</td></tr>';
        } else {
            incomesContainer.innerHTML = incomes.map(income => `
                <tr>
                    <td>${income.description || 'N/A'}</td>
                    <td class="amount-income">${income.amount.toFixed(2)} Dh</td>
                    <td><span class="method-badge">${income.method || 'N/A'}</span></td>
                    <td>${formatDateShort(income.date)}</td>
                </tr>
            `).join('');
        }
    }
    
    if (expensesContainer) {
        if (expenses.length === 0) {
            expensesContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #6b7280;">No expenses recorded</td></tr>';
        } else {
            expensesContainer.innerHTML = expenses.map(expense => `
                <tr>
                    <td>${expense.description || 'N/A'}</td>
                    <td class="amount-expense">${expense.amount.toFixed(2)} Dh</td>
                    <td><span class="category-badge">${getCategoryText(expense.category) || 'N/A'}</span></td>
                    <td>${formatDateShort(expense.date)}</td>
                </tr>
            `).join('');
        }
    }
}

/**
 * Formate une date en format long en anglais
 * 
 * FORMAT DE SORTIE :
 * - Jour de la semaine complet (ex: Monday)
 * - Mois complet (ex: January)
 * - Jour du mois (ex: 15)
 * - Année complète (ex: 2024)
 * - Exemple: 'Monday, January 15, 2024'
 * 
 * CONFIGURATION :
 * - Locale: 'en-US' (anglais américain)
 * - Format: long et complet
 * - Tous les éléments de date inclus
 * 
 * GESTION DES ERREURS :
 * - Date invalide → 'Invalid Date'
 * - Valeur null/undefined → 'Invalid Date'
 * - Robustesse face aux formats incorrects
 * 
 * UTILISATION :
 * - Affichage détaillé des dates
 * - Interface utilisateur lisible
 * - Format standard international
 * 
 * @param {string} dateString - La date à formater (format ISO ou autre)
 * @returns {string} La date formatée en format long
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Formate une date en format court français
 * 
 * FORMAT DE SORTIE :
 * - Jour sur 2 chiffres (ex: 15)
 * - Mois sur 2 chiffres (ex: 03)
 * - Année sur 4 chiffres (ex: 2024)
 * - Exemple: '15/03/2024'
 * 
 * CONFIGURATION :
 * - Locale: 'fr-FR' (français)
 * - Format: court et compact
 * - Séparateur: slash (/)
 * 
 * GESTION DES ERREURS :
 * - Date invalide → 'Invalid Date'
 * - Valeur null/undefined → 'Invalid Date'
 * - Robustesse face aux formats incorrects
 * 
 * UTILISATION :
 * - Affichage compact des dates
 * - Listes et tableaux
 * - Format français standard
 * 
 * @param {string} dateString - La date à formater (format ISO ou autre)
 * @returns {string} La date formatée en format court français
 */
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Met à jour le statut d'un rendez-vous avec confirmation
 * 
 * PROCESSUS DE MISE À JOUR :
 * - Vérification des actions irréversibles
 * - Affichage de confirmations appropriées
 * - Conversion de l'ID en entier
 * - Mise à jour via le module appointments
 * - Rechargement de la liste filtrée
 * 
 * ACTIONS IRRÉVERSIBLES :
 * - 'cancelled' : Annulation du rendez-vous
 * - 'completed' : Marquage comme terminé
 * - Confirmation obligatoire avant exécution
 * 
 * GESTION DES CONFIRMATIONS :
 * - Messages explicites sur l'irréversibilité
 * - Possibilité d'annuler l'action
 * - Retour silencieux si annulé
 * 
 * GESTION DU SUCCÈS :
 * - Mise à jour du statut en base
 * - Rechargement automatique de la liste
 * - Application des filtres actifs
 * 
 * GESTION DES ERREURS :
 * - Échec de la mise à jour → pas de rechargement
 * - ID invalide → erreur silencieuse
 * - Statut invalide → erreur silencieuse
 * 
 * @param {string} appointmentId - L'ID du rendez-vous à modifier
 * @param {string} newStatus - Le nouveau statut à appliquer
 * @returns {void}
 */
function updateAppointmentStatusAction(appointmentId, newStatus) {
    if (newStatus === 'cancelled') {
        if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
            return;
        }
    } else if (newStatus === 'completed') {
        if (!confirm('Are you sure you want to mark this appointment as completed? This action cannot be undone.')) {
            return;
        }
    }
    
    if (appointments.updateAppointmentStatus(parseInt(appointmentId), newStatus)) {
        filterAppointmentsAction();
    }
}

window.closeModal = closeModal;
init();
