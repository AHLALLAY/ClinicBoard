import hash from '../Security/hashage.js';
import msg from '../Modules/forms.js';

async function handleLogin(username, password){
    try{
        const hashedPwd = await hash.hashPwd(password);
        const users = JSON.parse(localStorage.getItem("Users") || "[]");
        if(users.length > 0){
            const user = users.find(u => u.username === username && u.password === hashedPwd);

            if(user){
                msg.displayMsg("Connecting ...","success");
                setTimeout(()=> {
                    msg.displayMsg("Connection successful ","success");
                    document.getElementById('root').innerHTML = `<div><h1>this is dashboard</h1></div>`;
                }, 1000);

            }else{
                msg.displayMsg("user not found","error");               
            }
        }
    }catch(error){
        msg.displayMsg("connection failed","error"); 
    }
}

export default {
    handleLogin,

};