/**
 * Génère le formulaire de connexion utilisateur avec interface moderne
 * 
 * INTERFACE UTILISATEUR :
 * - Design responsive avec centrage vertical et horizontal
 * - Formulaire de connexion avec validation HTML5
 * - Messages d'erreur intégrés pour le feedback utilisateur
 * - Navigation vers l'inscription pour les nouveaux utilisateurs
 * 
 * ÉLÉMENTS DU FORMULAIRE :
 * - Champ nom d'utilisateur (obligatoire)
 * - Champ mot de passe (obligatoire, masqué)
 * - Bouton de soumission avec style primaire
 * - Lien de redirection vers l'inscription
 * 
 * STYLING :
 * - Utilise Tailwind CSS pour le design moderne
 * - Couleurs cohérentes avec la charte graphique
 * - Transitions fluides pour les interactions
 * - Responsive design pour tous les écrans
 * 
 * @returns {string} HTML complet du formulaire de connexion
 */
function loginForm() {
    return `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; padding: 3rem 1rem;">
            <div style="max-width: 28rem; width: 100%; display: flex; flex-direction: column; gap: 2rem;">
                <div style="text-align: center;">
                    <h2 style="margin-top: 1.5rem; font-size: 1.875rem; font-weight: 800; color: #111827;">Login</h2>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #4b5563;">Access your ClinicBoard account</p>
                </div>
                <form id="loginForm" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    <div id="msg" style="display: none;"></div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="form-group">
                            <label for="userName" class="form-label" style="font-size: 0.875rem;">Username</label>
                            <input type="text" name="userName" id="userName" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label" style="font-size: 0.875rem;">Password</label>
                            <input type="password" name="password" id="password" required class="form-input">
                        </div>
                    </div>
                    <div>
                          <button type="submit" class="btn-primary" style="width: 100%;">
                            Sign In
                        </button>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 0.875rem; color: #4b5563;">
                            No account? 
                            <a href="#" data-route="register" style="font-weight: 500; color: #33CC77; transition: color 0.3s;">Sign Up</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Génère le formulaire d'inscription utilisateur avec validation complète
 * 
 * INTERFACE D'INSCRIPTION :
 * - Design cohérent avec le formulaire de connexion
 * - Formulaire d'inscription avec validation HTML5
 * - Vérification de correspondance des mots de passe
 * - Navigation vers la connexion pour les utilisateurs existants
 * 
 * ÉLÉMENTS DU FORMULAIRE :
 * - Champ nom d'utilisateur (obligatoire, unique)
 * - Champ mot de passe (obligatoire, masqué)
 * - Champ confirmation mot de passe (obligatoire, validation)
 * - Bouton de soumission avec style primaire
 * - Lien de redirection vers la connexion
 * 
 * VALIDATION INTÉGRÉE :
 * - Validation côté client avec HTML5
 * - Vérification de correspondance des mots de passe
 * - Messages d'erreur contextuels
 * - Feedback visuel pour l'utilisateur
 * 
 * @returns {string} HTML complet du formulaire d'inscription
 */
function registerForm() {
    return `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; padding: 3rem 1rem;">
            <div style="max-width: 28rem; width: 100%; display: flex; flex-direction: column; gap: 2rem;">
                <div style="text-align: center;">
                    <h2 style="margin-top: 1.5rem; font-size: 1.875rem; font-weight: 800; color: #111827;">Registration</h2>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #4b5563;">Create your ClinicBoard account</p>
                </div>
                <form id="registerForm" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
                    <div id="msg" style="display: none;"></div>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="form-group">
                            <label for="userName" class="form-label" style="font-size: 0.875rem;">Username</label>
                            <input type="text" name="userName" id="userName" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label" style="font-size: 0.875rem;">Password</label>
                            <input type="password" name="password" id="password" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="pwdConfirmed" class="form-label" style="font-size: 0.875rem;">Confirm Password</label>
                            <input type="password" name="pwdConfirmed" id="pwdConfirmed" required class="form-input">
                        </div>
                    </div>
                    <div>
                          <button type="submit" class="btn-primary" style="width: 100%;">
                            Sign Up
                        </button>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 0.875rem; color: #4b5563;">
                            Already have an account? 
                            <a href="#" data-route="login" style="font-weight: 500; color: #33CC77; transition: color 0.3s;">Sign In</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Génère la page principale du tableau de bord avec métriques et navigation
 * 
 * INTERFACE DU DASHBOARD :
 * - Vue d'ensemble des métriques clés de la clinique
 * - Navigation intégrée avec barre de menu
 * - Filtrage par mois pour l'analyse temporelle
 * - Cartes de statistiques avec indicateurs visuels
 * 
 * MÉTRIQUES AFFICHÉES :
 * - Revenus totaux du mois sélectionné
 * - Dépenses totales du mois sélectionné
 * - Marge bénéficiaire calculée automatiquement
 * - Nombre total de patients enregistrés
 * - Nombre de rendez-vous du mois
 * - Graphiques et visualisations des données
 * 
 * FONCTIONNALITÉS :
 * - Filtre par mois avec sélecteur de date
 * - Mise à jour dynamique des métriques
 * - Navigation rapide vers les modules spécialisés
 * - Interface responsive pour tous les écrans
 * 
 * @param {string} username - Nom d'utilisateur connecté (défaut: 'User')
 * @returns {string} HTML complet de la page dashboard
 */
function dashboard(username = 'User') {
    return `
        <div class="page-container">
            ${navbar(username)}
            <div class="dashboard-content-wrapper">
                <header style="margin-bottom: 1rem;">
                    <div class="dashboard-header flex-header">
                        <div>
                            <h1 style="font-size: 1.5rem; font-weight: 700; color: #111827;">Dashboard</h1>
                            <p style="margin-top: 0.25rem; font-size: 0.875rem; color: #4b5563;">Overview of your medical practice</p>
                        </div>
                        <div>
                            <div class="month-filter-container">
                                <label for="month-filter" style="font-size: 0.875rem; font-weight: 500; color: #374151;">Filter by month:</label>
                                <input type="month" id="month-filter" class="form-input" data-action="filter-dashboard" value="">
                            </div>
                        </div>
                    </div>
                </header>
                
                <div class="dashboard-content">
                    <!-- Première ligne : 3 cartes de montant -->
                    <div class="dashboard-row dashboard-row-amounts">
                        <div class="dashboard-card">
                            <div style="text-align: center;">
                                <h3 class="kpi-title">Revenue</h3>
                                <p class="kpi-value kpi-value-primary" id="monthly-revenue">0 <span style="font-size: 1.25rem;">Dh</span></p>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div style="text-align: center;">
                                <h3 class="kpi-title">Total Expenses</h3>
                                <p class="kpi-value kpi-value-red" id="monthly-expenses">0 <span style="font-size: 1.25rem;">Dh</span></p>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div style="text-align: center;">
                                <h3 class="kpi-title">Margin</h3>
                                <p class="kpi-value kpi-value-green" id="monthly-margin">0 <span style="font-size: 1.25rem;">Dh</span></p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Deuxième ligne : 2 cartes restantes -->
                    <div class="dashboard-row dashboard-row-others">
                        <div class="dashboard-card">
                            <div style="text-align: center;">
                                <h3 class="kpi-title">Patients</h3>
                                <p class="kpi-value kpi-value-blue" id="total-patients">0</p>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div style="text-align: center;">
                                <h3 class="kpi-title">Consultations</h3>
                                <p class="kpi-value kpi-value-purple" id="monthly-appointments">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${footer()}
        </div>
    `;
}

/**
 * Génère la page de gestion des patients avec interface complète
 * 
 * INTERFACE DE GESTION PATIENTS :
 * - Liste complète des patients enregistrés
 * - Boutons d'action pour ajouter/modifier/supprimer
 * - Recherche et filtrage des patients
 * - Affichage des informations détaillées
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Ajout de nouveaux patients via formulaire modal
 * - Modification des informations existantes
 * - Suppression sécurisée avec confirmation
 * - Recherche en temps réel par nom/téléphone
 * - Tri par colonnes (nom, date, téléphone)
 * 
 * DONNÉES AFFICHÉES :
 * - Nom complet du patient
 * - Numéro de téléphone
 * - Date d'inscription
 * - Actions disponibles (modifier/supprimer)
 * 
 * @param {string} username - Nom d'utilisateur connecté (défaut: 'User')
 * @returns {string} HTML complet de la page de gestion des patients
 */
function patients(username = 'User') {
    return `
        <div class="page-container">
            ${navbar(username)}
            <div class="page-content">
                <header style="margin-bottom: 1rem;">
                    <div class="page-header flex-header">
                        <div>
                            <h1 style="font-size: 1.875rem; font-weight: 700; color: #111827;">Patient Management</h1>
                            <p style="margin-top: 0.5rem; color: #4b5563;">Manage your patient database</p>
                        </div>
                        <div>
                            <div class="filters-section">
                                <button class="btn-primary btn-full-width" data-action="show-add-patient">
                                    New Patient
                                </button>
                                <div class="filters-container">
                                    <div class="filter-card" style="flex: 1;">
                                        <label for="search-patients" class="filter-label">Search</label>
                                        <input type="text" 
                                               id="search-patients" 
                                               placeholder="Search by name or phone..." 
                                               data-action="search-patients"
                                               class="filter-search">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <div id="patients-list" class="patients-grid">
                </div>
            </div>
            ${footer()}
        </div>
    `;
}

/**
 * Génère la page de gestion des rendez-vous avec calendrier intégré
 * 
 * INTERFACE DE GESTION RENDEZ-VOUS :
 * - Liste complète des rendez-vous programmés
 * - Interface de création/modification des rendez-vous
 * - Sélection des patients depuis la base existante
 * - Gestion des créneaux horaires et disponibilités
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Planification de nouveaux rendez-vous
 * - Modification des rendez-vous existants
 * - Annulation avec confirmation
 * - Association patient-rendez-vous
 * - Filtrage par date et statut
 * 
 * DONNÉES AFFICHÉES :
 * - Date et heure du rendez-vous
 * - Nom du patient associé
 * - Type de consultation
 * - Statut (confirmé, en attente, annulé)
 * - Actions disponibles (modifier/annuler)
 * 
 * @param {string} username - Nom d'utilisateur connecté (défaut: 'User')
 * @returns {string} HTML complet de la page de gestion des rendez-vous
 */
function appointments(username = 'User') {
    return `
        <div class="page-container">
            ${navbar(username)}
            <div class="page-content">
                <header style="margin-bottom: 1rem;">
                    <div class="page-header flex-header">
                        <div>
                            <h1 style="font-size: 1.875rem; font-weight: 700; color: #111827;">Appointment Management</h1>
                            <p style="margin-top: 0.5rem; color: #4b5563;">Schedule and manage your consultations</p>
                        </div>
                        <div>
                            <div class="filters-section">
                                <button class="btn-primary btn-full-width" data-action="show-add-appointment">
                                    New Appointment
                                </button>
                                <div class="filters-container">
                                    <div class="filter-card">
                                        <label for="status-filter" class="filter-label">Status</label>
                                        <select id="status-filter" data-action="filter-appointments" class="filter-select">
                                            <option value="">All</option>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                    
                                    <div class="filter-card">
                                        <label for="date-filter" class="filter-label">Date</label>
                                        <input type="date" id="date-filter" data-action="filter-appointments" class="filter-date">
                                    </div>
                                    
                                    <div class="filter-actions">
                                        <button class="btn-clear-filters" data-action="clear-filters">
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <div class="appointments-grid">
                    <div class="appointments-main" id="appointments-main">
                    </div>
                    <div class="appointments-secondary" id="appointments-secondary">
                    </div>
                </div>
            </div>
            ${footer()}
        </div>
    `;
}

/**
 * Génère la page de gestion financière avec analyse des revenus et dépenses
 * 
 * INTERFACE DE GESTION FINANCIÈRE :
 * - Vue d'ensemble des finances de la clinique
 * - Gestion séparée des revenus et dépenses
 * - Graphiques et visualisations des données financières
 * - Calculs automatiques des marges et ratios
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Enregistrement des revenus (consultations, traitements)
 * - Gestion des dépenses (équipement, personnel, fournitures)
 * - Calcul automatique de la marge bénéficiaire
 * - Filtrage par période (mois, trimestre, année)
 * - Export des données financières
 * 
 * MÉTRIQUES AFFICHÉES :
 * - Revenus totaux par période
 * - Dépenses totales par catégorie
 * - Marge bénéficiaire nette
 * - Évolution des finances dans le temps
 * - Comparaisons périodiques
 * 
 * @param {string} username - Nom d'utilisateur connecté (défaut: 'User')
 * @returns {string} HTML complet de la page de gestion financière
 */
function finances(username = 'User') {
    return `
        <div class="page-container">
            ${navbar(username)}
            <div class="page-content">
                <header style="margin-bottom: 2rem;">
                    <div class="page-header flex-header">
                        <div>
                            <h1 style="font-size: 1.875rem; font-weight: 700; color: #111827;">Financial Management</h1>
                            <p style="margin-top: 0.5rem; color: #4b5563;">Track your income and expenses</p>
                        </div>
                        <div style="margin-top: 1rem; display: flex; gap: 0.75rem;">
                            <button class="btn-success" data-action="show-add-income">
                                Add Income
                            </button>
                            <button class="btn-warning" data-action="show-add-expense">
                                Add Expense
                            </button>
                        </div>
                    </div>
                </header>
                
                <div class="finances-tables">
                    <div class="finance-section">
                        <div class="finance-header">
                            <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827;">Income</h3>
                        </div>
                        <div class="table-container">
                            <table class="finance-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody id="incomes-list">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="finance-section">
                        <div class="finance-header">
                            <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827;">Expenses</h3>
                        </div>
                        <div class="table-container">
                            <table class="finance-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody id="expenses-list">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            ${footer()}
        </div>
    `;
}

function patientForm() {
    return `
        <form id="addPatientForm" class="form-container">
            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" name="fullName" required class="form-input" placeholder="Ex: John Doe">
            </div>
            
            <div class="form-grid-2">
                <div class="form-group">
                    <label class="form-label">Phone *</label>
                    <input type="tel" name="phone" required class="form-input" placeholder="Ex: 0123456789">
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-input" placeholder="Ex: john.doe@email.com">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Medical Notes</label>
                <textarea name="notes" rows="2" class="form-textarea" placeholder="Important patient information..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary" style="flex: 1;">
                    Add Patient
                </button>
                <button type="button" class="btn-secondary" style="flex: 1;" data-action="close-modal">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

function appointmentForm(patientsList) {
    const patientsOptions = patientsList.map(p => 
        `<option value="${p.id}">${p.fullName}</option>`
    ).join('');
    
    return `
        <form id="addAppointmentForm" class="form-container">
            <div class="form-group">
                <label class="form-label">Select Patient *</label>
                <select name="patientId" required class="form-select">
                    <option value="">Choose a patient</option>
                    ${patientsOptions}
                </select>
            </div>
            
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Date *</label>
                    <input type="date" name="date" required class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Time *</label>
                    <input type="time" name="time" required class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Duration (min)</label>
                    <input type="number" name="duration" value="30" min="15" max="120" class="form-input" placeholder="30">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Appointment Notes</label>
                <textarea name="notes" rows="2" class="form-textarea" placeholder="Consultation reason, symptoms..."></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary" style="flex: 1;">
                    Schedule
                </button>
                <button type="button" class="btn-secondary" style="flex: 1;" data-action="close-modal">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

function incomeForm() {
    return `
        <form id="addIncomeForm" class="form-container">
            <div class="form-group">
                <label class="form-label">Amount (DH) *</label>
                <input type="number" name="amount" step="0.01" required class="form-input" placeholder="Ex: 500.00">
            </div>
            
            <div class="form-group">
                <label class="form-label">Payment Method *</label>
                <select name="method" required class="form-select">
                    <option value="">Choose a method</option>
                    <option value="cash">Cash</option>
                    <option value="card">Credit Card</option>
                    <option value="check">Check</option>
                    <option value="transfer">Transfer</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <input type="text" name="description" placeholder="Ex: Dr. Martin consultation" class="form-input">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-success" style="flex: 1;">
                    Add Income
                </button>
                <button type="button" class="btn-secondary" style="flex: 1;" data-action="close-modal">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

function expenseForm() {
    return `
        <form id="addExpenseForm" class="form-container">
            <div class="form-group">
                <label class="form-label">Amount (DH) *</label>
                <input type="number" name="amount" step="0.01" required class="form-input" placeholder="Ex: 1500.00">
            </div>
            
            <div class="form-group">
                <label class="form-label">Expense Category *</label>
                <select name="category" required class="form-select">
                    <option value="">Choose a category</option>
                    <option value="rent">Rent</option>
                    <option value="utilities">Electricity/Water</option>
                    <option value="supplies">Supplies</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <input type="text" name="description" placeholder="Ex: Medical equipment purchase" class="form-input">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-warning" style="flex: 1;">
                    Add Expense
                </button>
                <button type="button" class="btn-secondary" style="flex: 1;" data-action="close-modal">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

function navbar(username = 'User') {
    return `
        <nav class="navbar">
            <div class="navbar-container">
                <div class="navbar-brand">
                    <div style="font-size: 1.5rem;">🏥</div>
                    <div>
                        <h2 class="navbar-logo">ClinicBoard</h2>
                        <span class="navbar-subtitle">Clinic Management</span>
                    </div>
                </div>
                
                <div class="navbar-nav">
                    <a href="#" class="navbar-link" data-route="dashboard">Dashboard</a>
                    <a href="#" class="navbar-link" data-route="patients">Patients</a>
                    <a href="#" class="navbar-link" data-route="appointments">Appointments</a>
                    <a href="#" class="navbar-link" data-route="finances">Finances</a>
                </div>
                
                <div class="navbar-actions">
                    <div class="navbar-user-section">
                        <button class="logout-btn" data-action="logout">Logout</button>
                        <span class="user-badge">${username}</span>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

function footer() {
    return `
        <footer class="footer">
            <div class="footer-container">
                <p class="footer-text">ClinicBoard &copy; 2025</p>
            </div>
        </footer>
    `;
}

/**
 * Affiche un message de notification à l'utilisateur avec style contextuel
 * 
 * SYSTÈME DE NOTIFICATION :
 * - Messages de succès, d'erreur, d'avertissement et d'information
 * - Affichage temporaire avec disparition automatique
 * - Styles visuels distincts selon le type de message
 * - Positionnement cohérent dans l'interface
 * 
 * TYPES DE MESSAGES SUPPORTÉS :
 * - 'success' : Messages de confirmation (vert)
 * - 'error' : Messages d'erreur (rouge)
 * - 'warning' : Messages d'avertissement (orange)
 * - 'info' : Messages informatifs (bleu)
 * 
 * FONCTIONNALITÉS :
 * - Affichage temporaire (disparition après 5 secondes)
 * - Animation d'apparition et de disparition
 * - Support HTML dans le contenu du message
 * - Gestion automatique des messages multiples
 * 
 * @param {string} message - Contenu du message à afficher (peut contenir du HTML)
 * @param {string} type - Type de message ('success', 'error', 'warning', 'info')
 * @returns {void} Aucune valeur de retour (effet de bord : affichage visuel)
 */
function showMessage(message, type) {
    const msgDiv = document.getElementById('msg');
    if (msgDiv) {
        msgDiv.innerHTML = message;
        msgDiv.className = `message message-${type}`;
    }
}

export default {
    loginForm,
    registerForm,
    dashboard,
    patients,
    appointments,
    finances,
    patientForm,
    appointmentForm,
    incomeForm,
    expenseForm,
    navbar,
    footer,
    showMessage
};
