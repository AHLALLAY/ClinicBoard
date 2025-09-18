function login(){
    return `
        <div>
            <form>
                <div>
                    <h1>LOGIN</h1>
                </div>
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

export default {
    login,
};