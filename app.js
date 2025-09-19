import forms from './Modules/forms.js';

function init() {
    if (!localStorage.getItem("Users")) localStorage.setItem("Users", JSON.stringify([]));
    if (!localStorage.getItem("Patients")) localStorage.setItem("Patients", JSON.stringify([]));
    if (!localStorage.getItem("Recette")) localStorage.setItem("Recette", JSON.stringify([]));
    if (!localStorage.getItem("RDV")) localStorage.setItem("RDV", JSON.stringify([]));
    
    const root = document.getElementById('root');
    const currentUser = localStorage.getItem("currentUser");
    
    if (currentUser) {
        root.innerHTML = `<div><h1>this is your dashboard</h1></div>`;
    } else {
        root.innerHTML = forms.loginForm();
    }
}

export default init;