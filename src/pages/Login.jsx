import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            navigate('/');
        } catch (err) {
            setLoading(false);
            if (err.code === 'auth/invalid-email') {
                setErr('Please enter a valid email.');
            } else if (err.code === 'auth/wrong-password') {
                setErr('Please try again.');
            } else {
                setErr('Please  enter a valid email / password.');
            }
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Chat</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" />
                    <div className="passwordWrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="eyeIcon"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    {err && <span style={{ color: "red" }}>{err}</span>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <p>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
