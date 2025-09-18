
function initializeStorage(){
    if(!localStorage.getItem("Users")){
        localStorage.setItem("Users", JSON.stringify([]));
    }
    if(!localStorage.getItem("Patients")){
        localStorage.setItem("Patients", JSON.stringify([]));
    }
    if(!localStorage.getItem("Recette")){
        localStorage.setItem("Recette", JSON.stringify([]));
    }
    if(!localStorage.getItem("RDV")){
        localStorage.setItem("RDV", JSON.stringify([]));
    }
}

function init(){
    try{
        initializeStorage();
    }catch(error){
        console.log("Initialized with error : ", error);
    }
}

export default init;