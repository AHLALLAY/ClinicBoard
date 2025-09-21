function init() {
    if (!localStorage.getItem("Users")) {
        localStorage.setItem("Users", JSON.stringify([]));
    }
    if (!localStorage.getItem("Patients")) {
        localStorage.setItem("Patients", JSON.stringify([]));
    }
    if (!localStorage.getItem("Appointments")) {
        localStorage.setItem("Appointments", JSON.stringify([]));
    }
    if (!localStorage.getItem("Incomes")) {
        localStorage.setItem("Incomes", JSON.stringify([]));
    }
    if (!localStorage.getItem("Expenses")) {
        localStorage.setItem("Expenses", JSON.stringify([]));
    }
    if (!localStorage.getItem("loginAttempts")) {
        localStorage.setItem("loginAttempts", JSON.stringify([]));
    }
}

function insert(key, data) {
    try {
        const existingData = JSON.parse(localStorage.getItem(key) || "[]");
        existingData.push(data);
        localStorage.setItem(key, JSON.stringify(existingData));
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'insertion:', error);
        return false;
    }
}

function select(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
        console.error('Erreur lors de la lecture:', error);
        return [];
    }
}

function update(key, id, newData) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[index] = { ...data[index], ...newData };
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        return false;
    }
}

function deleteItem(key, id) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        const filteredData = data.filter(item => item.id !== id);
        localStorage.setItem(key, JSON.stringify(filteredData));
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return false;
    }
}

export default {
    init,
    insert,
    select,
    update,
    delete: deleteItem
};