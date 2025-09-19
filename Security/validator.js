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

function validatePatientData(name, phone, email) {
    const errors = [];
    
    // Validation des champs requis
    if (!name || name.trim() === '') errors.push('Le nom complet est requis');
    if (!phone || phone.trim() === '') errors.push('Le numéro de téléphone est requis');
    if (!email || email.trim() === '') errors.push('L\'email est requis');
    
    // Validation des formats
    if (name && name.length < 2) errors.push('Le nom doit contenir au moins 2 caractères');
    if (phone && !/^[0-9+\-\s()]+$/.test(phone)) errors.push('Format de téléphone invalide');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Format d\'email invalide');
    
    return { isValid: !errors.length, errors };
}

export default { 
    validateLoginData,
    validatePatientData 
};