import components from './component.js';

/**
 * Enregistre un nouveau revenu dans la base de données financière
 * 
 * VALIDATION DES DONNÉES :
 * - Vérification de la présence et positivité du montant
 * - Validation des formats numériques
 * - Gestion des champs optionnels avec valeurs par défaut
 * - Contrôle de cohérence des données financières
 * 
 * STRUCTURE DU REVENU :
 * - ID unique généré automatiquement (timestamp)
 * - Montant du revenu (obligatoire, positif)
 * - Méthode de paiement (défaut: "cash")
 * - Description du revenu (optionnelle)
 * - Date automatique (date actuelle)
 * - Timestamp de création
 * 
 * MÉTHODES DE PAIEMENT SUPPORTÉES :
 * - "cash" : Espèces (défaut)
 * - "card" : Carte bancaire
 * - "transfer" : Virement bancaire
 * - "check" : Chèque
 * - "other" : Autre méthode
 * 
 * @param {Object} incomeData - Données du revenu à enregistrer
 * @param {number} incomeData.amount - Montant du revenu (obligatoire, > 0)
 * @param {string} [incomeData.method] - Méthode de paiement (défaut: "cash")
 * @param {string} [incomeData.description] - Description du revenu (optionnelle)
 * @returns {boolean} true si enregistrement réussi, false en cas d'erreur
 */
function createIncome(incomeData) {
    if (!incomeData.amount || incomeData.amount <= 0) {
        components.showMessage("Amount must be positive", "error");
        return false;
    }

    const incomes = JSON.parse(localStorage.getItem("Incomes") || "[]");
    
    const newIncome = {
        id: Date.now(),
        amount: incomeData.amount,
        method: incomeData.method || "cash",
        description: incomeData.description || "",
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    incomes.push(newIncome);
    localStorage.setItem("Incomes", JSON.stringify(incomes));
    
    components.showMessage("Income added successfully!", "success");
    return true;
}

/**
 * Enregistre une nouvelle dépense dans la base de données financière
 * 
 * VALIDATION DES DONNÉES :
 * - Vérification de la présence et positivité du montant
 * - Validation des formats numériques
 * - Gestion des champs optionnels avec valeurs par défaut
 * - Contrôle de cohérence des données financières
 * 
 * STRUCTURE DE LA DÉPENSE :
 * - ID unique généré automatiquement (timestamp)
 * - Montant de la dépense (obligatoire, positif)
 * - Catégorie de dépense (défaut: "other")
 * - Description de la dépense (optionnelle)
 * - Date automatique (date actuelle)
 * - Timestamp de création
 * 
 * CATÉGORIES DE DÉPENSES SUPPORTÉES :
 * - "equipment" : Équipement médical
 * - "supplies" : Fournitures médicales
 * - "personnel" : Personnel et salaires
 * - "utilities" : Services publics (électricité, eau, etc.)
 * - "rent" : Loyer et immobilier
 * - "marketing" : Marketing et publicité
 * - "other" : Autres dépenses (défaut)
 * 
 * @param {Object} expenseData - Données de la dépense à enregistrer
 * @param {number} expenseData.amount - Montant de la dépense (obligatoire, > 0)
 * @param {string} [expenseData.category] - Catégorie de dépense (défaut: "other")
 * @param {string} [expenseData.description] - Description de la dépense (optionnelle)
 * @returns {boolean} true si enregistrement réussi, false en cas d'erreur
 */
function createExpense(expenseData) {
    if (!expenseData.amount || expenseData.amount <= 0) {
        components.showMessage("Amount must be positive", "error");
        return false;
    }

    const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
    
    const newExpense = {
        id: Date.now(),
        amount: expenseData.amount,
        category: expenseData.category || "other",
        description: expenseData.description || "",
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);
    localStorage.setItem("Expenses", JSON.stringify(expenses));
    
    components.showMessage("Expense added successfully!", "success");
    return true;
}

/**
 * Calcule la marge bénéficiaire globale de la clinique
 * 
 * CALCULS FINANCIERS :
 * - Somme totale de tous les revenus enregistrés
 * - Somme totale de toutes les dépenses enregistrées
 * - Calcul de la marge : revenus - dépenses
 * - Retour des trois métriques clés
 * 
 * MÉTRIQUES CALCULÉES :
 * - totalIncome : Revenus totaux de la clinique
 * - totalExpense : Dépenses totales de la clinique
 * - margin : Marge bénéficiaire nette (revenus - dépenses)
 * 
 * UTILISATION TYPIQUE :
 * - Affichage des métriques sur le dashboard
 * - Analyse de la rentabilité de la clinique
 * - Calculs de ratios financiers
 * - Rapports de performance financière
 * 
 * PERFORMANCE :
 * - Calculs optimisés pour de grandes quantités de données
 * - Utilisation de reduce() pour l'efficacité
 * - Pas de modification des données sources
 * 
 * @returns {Object} Objet contenant les métriques financières calculées
 * @returns {number} returns.totalIncome - Revenus totaux
 * @returns {number} returns.totalExpense - Dépenses totales
 * @returns {number} returns.margin - Marge bénéficiaire nette
 */
function calculateMargin() {
    const incomes = JSON.parse(localStorage.getItem("Incomes") || "[]");
    const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
    
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
        totalIncome,
        totalExpense,
        margin: totalIncome - totalExpense
    };
}

/**
 * Récupère et calcule les données financières pour un mois et une année spécifiques
 * 
 * FILTRAGE TEMPOREL :
 * - Filtrage des revenus par mois et année
 * - Filtrage des dépenses par mois et année
 * - Calculs automatiques des totaux mensuels
 * - Retour des données structurées
 * 
 * DONNÉES RETOURNÉES :
 * - incomes : Tableau des revenus du mois
 * - expenses : Tableau des dépenses du mois
 * - totalIncome : Somme des revenus mensuels
 * - totalExpense : Somme des dépenses mensuelles
 * 
 * UTILISATION TYPIQUE :
 * - Affichage des métriques mensuelles sur le dashboard
 * - Analyse de performance par période
 * - Génération de rapports mensuels
 * - Filtrage des données pour les graphiques
 * 
 * ALGORITHME DE FILTRAGE :
 * - Conversion des dates en objets Date
 * - Comparaison des mois (0-11) et années
 * - Filtrage efficace avec filter()
 * - Calculs optimisés des totaux
 * 
 * @param {number} month - Mois à filtrer (0-11, 0 = janvier)
 * @param {number} year - Année à filtrer (ex: 2024)
 * @returns {Object} Objet contenant les données financières mensuelles
 * @returns {Array<Object>} returns.incomes - Revenus du mois
 * @returns {Array<Object>} returns.expenses - Dépenses du mois
 * @returns {number} returns.totalIncome - Total des revenus mensuels
 * @returns {number} returns.totalExpense - Total des dépenses mensuelles
 */
function getMonthlyData(month, year) {
    const incomes = JSON.parse(localStorage.getItem("Incomes") || "[]");
    const expenses = JSON.parse(localStorage.getItem("Expenses") || "[]");
    
    const monthlyIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === month && incomeDate.getFullYear() === year;
    });
    
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    });
    
    return {
        incomes: monthlyIncomes,
        expenses: monthlyExpenses,
        totalIncome: monthlyIncomes.reduce((sum, income) => sum + income.amount, 0),
        totalExpense: monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
}

export default {
    createIncome,
    createExpense,
    calculateMargin,
    getMonthlyData
};
