import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import EnvironmentDashboard from './components/EnvironmentDashboard';
import Profile from './components/Profile';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import PressPage from './components/PressPage';
import BlogPage from './components/BlogPage';
import GalleryPage from './components/GalleryPage';
import FAQPage from './components/FAQPage';
import ContactPage from './components/ContactPage';
import LocationPage from './components/LocationPage';
import DashboardNavigation from './components/DashboardNavigation';
import CarbonFootprintDashboard from './components/CarbonFootprintDashboard';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route
                            path='/reset-password'
                            element={<PasswordResetRequest />}
                        />
                        <Route path='/about' element={<AboutPage />} />
                        <Route path='/press' element={<PressPage />} />
                        <Route path='/blog' element={<BlogPage />} />
                        <Route path='/gallery' element={<GalleryPage />} />
                        <Route path='/faq' element={<FAQPage />} />
                        <Route path='/contact' element={<ContactPage />} />
                        <Route path='/location' element={<LocationPage />} />
                        <Route
                            path='/reset-password/:token'
                            element={<PasswordResetConfirm />}
                        />
                        <Route element={<ProtectedRoute />}>
                            <Route path='/environment-dashboard' element={<EnvironmentDashboard />} />
                            <Route path='/dashboard-navigation' element={<DashboardNavigation />} />
                            <Route path='/carbon-footprint-dashboard' element={<CarbonFootprintDashboard />} />
                            <Route path='/profile' element={<Profile />} />
                        </Route>
                    </Routes>
                    <Footer />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
