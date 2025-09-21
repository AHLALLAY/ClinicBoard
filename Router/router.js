import components from '../Modules/component.js';

function router(page) {
    // Récupérer le nom d'utilisateur connecté
    const currentUser = localStorage.getItem("currentUser");
    const username = currentUser ? JSON.parse(currentUser).username : 'Utilisateur';
    
    const componentsList = {
        'login': components.loginForm(),
        'register': components.registerForm(),
        'dashboard': components.dashboard(username),
        'patients': components.patients(username),
        'appointments': components.appointments(username),
        'finances': components.finances(username)
    };
    
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = componentsList[page] || components.loginForm();
    }
}

export default router;