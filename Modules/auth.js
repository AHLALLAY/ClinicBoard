import validator from '../Security/validator.js';
import hash from '../Security/hashage.js';
import forms from '../Modules/forms.js';
import router from '../Router/router.js';

async function handleLogin(username, password){
    try{
        // 1. Validation des données
        const validation = validator.validateLoginData(username, password);
        if (!validation.isValid) {
            forms.displayMsg(validation.errors.join('<br>'), 'error');
            return;
        }

        // 2. Hachage du mot de passe
        const hashedPwd = await hash.hashPwd(password);
        
        // 3. Récupération des utilisateurs
        const users = JSON.parse(localStorage.getItem("Users") || "[]");
        
        if(users.length === 0){
            forms.displayMsg("Aucun utilisateur enregistré", "error");
            return;
        }

        // 4. Recherche de l'utilisateur
        const user = users.find(u => u.username === username && u.password === hashedPwd);

        if(user){
            // 5. Connexion réussie
            forms.displayMsg("Connexion en cours...", "success");
            
            setTimeout(() => {
                // Stocker la session utilisateur
                localStorage.setItem("currentUser", JSON.stringify({
                    id: Date.now(),
                    username: user.username,
                    loginTime: new Date().toISOString()
                }));
                
                forms.displayMsg("Connexion réussie !", "success");
                
                // Redirection vers le dashboard via le router
                router('dashboard');
            }, 1000);

        } else {
            forms.displayMsg("Nom d'utilisateur ou mot de passe incorrect", "error");               
        }
    } catch(error) {
        console.error('Erreur de connexion:', error);
        forms.displayMsg("Erreur de connexion. Veuillez réessayer.", "error"); 
    }
}

export default {
    handleLogin,
};