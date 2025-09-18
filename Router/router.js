import forms from '../Modules/forms.js';
function router(page){
    let component = '';

    switch (page){
        case 'login':
            component = forms.loginForm();
            break;
        case 'register':
            component = forms.registerForm();
            break;
        default:
            component = forms.loginForm();
            break;
    }

    document.getElementById('root').innerHTML = component;
}

export default router;