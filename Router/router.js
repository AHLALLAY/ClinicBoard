import forms from '../Modules/forms.js';

function router(page){
    // Rendu des composants
    const components = {
        'login': forms.loginForm(),
        'register': forms.registerForm()
    };
    
    document.getElementById('root').innerHTML = components[page] || forms.loginForm();
    
    // Navigation automatique (une seule fois)
    if (!window.routerInitialized) {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[data-route]')) {
                e.preventDefault();
                router(e.target.dataset.route);
            }
        });
        window.routerInitialized = true;
    }
}

export default router;