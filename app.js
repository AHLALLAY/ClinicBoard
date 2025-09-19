import router from './Router/router.js';

function init() {
    if (!localStorage.getItem("Users")) localStorage.setItem("Users", JSON.stringify([]));
    if (!localStorage.getItem("Patients")) localStorage.setItem("Patients", JSON.stringify([]));
    if (!localStorage.getItem("Recipes")) localStorage.setItem("Recipes", JSON.stringify([]));
    if (!localStorage.getItem("Appointments")) localStorage.setItem("Appointments", JSON.stringify([]));
    
    const root = document.getElementById('root');
    const currentUser = localStorage.getItem("currentUser");
    
    if (currentUser) {
        router("dashboard");
    } else {
        router("login");
    }
}
init();

export default init;