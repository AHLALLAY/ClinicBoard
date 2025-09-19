import forms from "./forms.js";
import validator from "../Security/validator.js";

function addPatient(){
    const name = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const note = document.getElementById('note');

    // Validation des données via validator centralisé
    const validation = validator.validatePatientData(name.value, phone.value, email.value);
    if (!validation.isValid) {
        forms.displayMsg(validation.errors.join('<br>'), 'error');
        return;
    }

    const patientData = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        note: note.value.trim(),
    };

    // Récupérer les patients existants
    const existingPatients = JSON.parse(localStorage.getItem("Patients") || "[]");
    
    // Ajouter le nouveau patient
    existingPatients.push(patientData);
    
    // Sauvegarder dans localStorage
    localStorage.setItem("Patients", JSON.stringify(existingPatients));
    
    // Message de succès
    forms.displayMsg("Patient ajouté avec succès !", "success");
    
    // Vider le formulaire
    name.value = '';
    phone.value = '';
    email.value = '';
    note.value = '';
}

export default {
    addPatient,
};