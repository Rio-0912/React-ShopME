import React, { useState } from "react";

import { useNavigate } from "react-router";
const SignInForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const handleLogin = () => {
        fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // Assuming you have a state for storing the token, update it here
                const authToken = data.token;
                // Save the token securely, e.g., in localStorage
                localStorage.setItem('authToken', authToken);
                if (authToken === undefined) {
                    alert('Invalid Credentials ')
                    navigate('/')
                    // Assuming you want to remove an item with the key "myKey" from local storage
                    localStorage.removeItem("authToken");

                }
                else {


                    navigate('/shop')

                }
                console.log('Login successful. Token:', authToken);

            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    return (
        <div className="form-container sign-in-container">
            <div className="formm" >
                <h1>Sign in</h1>


                <input
                    type="text"
                    placeholder="Email"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
              
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default SignInForm;
