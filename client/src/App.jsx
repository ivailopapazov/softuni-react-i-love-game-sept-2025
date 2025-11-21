import { Route, Routes } from "react-router"
import { useState } from "react"

import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Home from "./components/home/Home"
import Catalog from "./components/catalog/Catalog"
import Details from "./components/details/Details"
import GameCreate from "./game-create/GameCreate"
import Register from "./components/register/Register"
import Login from "./components/login/Login"

function App() {
    const [registerdUsers, setRegisteredUsers] = useState([]);
    const [user, setUser] = useState(null);

    const registerHandler = (email, password) => {

        if (registerdUsers.some(user => user.email === email)) {
            throw new Error('Email is taken!');
        }

        setRegisteredUsers(state => [...state, { email, password }]);

        // TODO Login user after register
    };

    const loginHandler = (email, password) => {
        const user = registerdUsers.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password')
        }

        setUser(user);
    }

    return (
        <>
            <Header user={user} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Catalog />} />
                <Route path="/games/:gameId/details" element={<Details />} />
                <Route path="/games/create" element={<GameCreate />} />
                <Route path="/register" element={<Register onRegister={registerHandler} />} />
                <Route path="/login" element={<Login onLogin={loginHandler} />} />
            </Routes>

            <Footer />
        </>
    )
}

export default App
