function loginForm(){
    return `
        <div>
            <form>
                <div>
                    <h1>LOGIN</h1>
                </div>
                <div id="msg"></div>
                <div>
                    <div>
                        <label for="userName">User Name</label>
                        <input type="text" name="userName" id="userName" placeholder="User Name">
                    </div>
                    <div>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password">
                    </div>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                <p>
                    you haven't an account? <a href="">subscribe</a>
                </p>
            </form>
        </div>
    `;
}

function registerForm(){
    return `
        <div>
            <form>
                <div>
                    <h1>LOGIN</h1>
                </div>
                <div id="msg"></div>
                <div>
                    <div>
                        <label for="userName">User Name</label>
                        <input type="text" name="userName" id="userName" placeholder="User Name">
                    </div>
                    <div>
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password">
                    </div>
                    <div>
                        <label for="pwdConfirmed">Password Confirmed</label>
                        <input type="password confirmation" name="pwdConfirmed" id="pwdConfirmed" placeholder="Password Confirmed">
                    </div>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                <p>
                    you have an account? <a href="">login</a>
                </p>
            </form>
        </div>
    `;   
}

function addPatientForm(){
    return `
        <div>
            <div>
                <h2>New Patient</h2>
                <div><span>&times;</span></div>
            </div>
            <div id="msg"></div>
            <div>
                <div>
                    <label for="fullName">Full Name</label>
                    <input type="text" name="fullName" id="fullName">
                </div>
                <div>
                    <label for="phone">Phone Numbre</label>
                    <input type="text" name="phone" id="phone">
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email">
                </div>
                <div>
                    <label for="note">Note</label>
                    <textarea name="note" id="note"></textarea>
                </div>
            </div>
            <div>
                <button type="submit">Add</button>
                <button>Cancel</button>
            </div>
        </div>
    `;
}

function displayMsg(msg, type){
    const msgDiv = document.getElementById("msg");

    if(!msgDiv){
        console.error("Elément msg non trouvé");
        return;
    }

    msgDiv.innerHTML = msg;
    msgDiv.classList.remove('success-msg', 'error-msg');
    if(type === "error"){
        msgDiv.classList.add('error-msg');
    }else{
        msgDiv.classList.add('success-msg');
    }
}

export default {
    loginForm,
    registerForm,
    addPatientForm,
    displayMsg,
};