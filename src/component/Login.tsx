import { useState, useEffect } from 'react';
import { API_BASE_URL } from './util';

const Login: React.FC<{ onLogin: () => void, setUserInfo: (userInfo: { name: string; email: string }) => void; }> = ({ onLogin, setUserInfo }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
            credentials: "include",
        });

        if (response.ok) {
            setUserInfo({ name, email });
            onLogin();
        } else {
            setError("Login failed. Please try again.");
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                handleLogin();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [name, email]);
    return (
        <div className="login-container">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input className="login-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="login-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="view-favorite-button" style={{ width: '200px', display: "flex", justifyContent: 'center' }} onClick={handleLogin}>
                Login
            </div>
        </div>
    );
};

export default Login;