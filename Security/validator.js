function validateLoginData(username, password) {
    const errors = [];
    
    // Validation des champs requis
    if (!username || username.trim() === '') errors.push('Le nom d\'utilisateur est requis');
    if (!password || password.trim() === '') errors.push('Le mot de passe est requis');
    
    // Validation de la longueur
    if (username && username.length < 3) errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    if (password && password.length < 6) errors.push('Le mot de passe doit contenir au moins 6 caractères');
    
    return { isValid: !errors.length, errors };
}

export default { validateLoginData };