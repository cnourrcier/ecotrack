import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetConfirm from './components/PasswordResetConfirm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/register' element={<Register />} />
                    <Route
                        path='/reset-password'
                        element={<PasswordResetRequest />}
                    />
                    <Route
                        path='/reset-password/:token'
                        element={<PasswordResetConfirm />}
                    />
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path='/dashboard'
                            element={<Dashboard />}
                        ></Route>
                        <Route path='/profile' element={<Profile />}></Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
