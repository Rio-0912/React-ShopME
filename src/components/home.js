import React from 'react';

import SignInForm from './SignIn'
import "./style.css";

const LoginPage = () => {

    return (
        <div className="Apper">
            <h2>Welcome Back</h2><span style={{color: '#fffaf0', fontSize: '3vh'}}>username :kminchelle   password: 0lelplR</span>
            <div className="container " id="container">

                <SignInForm />
                <div className="overlay-container">
                    <div className="overlay">

                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
