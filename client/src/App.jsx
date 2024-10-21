import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Profile = lazy(() => import('./components/Profile'));
const PasswordResetRequest = lazy(() => import('./components/PasswordResetRequest'));
const PasswordResetConfirm = lazy(() => import('./components/PasswordResetConfirm'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const PressPage = lazy(() => import('./components/PressPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const GalleryPage = lazy(() => import('./components/GalleryPage'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const LocationPage = lazy(() => import('./components/LocationPage'));
const EnvironmentDashboard = lazy(() => import('./components/EnvironmentDashboard'));
const DashboardNavigation = lazy(() => import('./components/DashboardNavigation'));
const CarbonFootprintDashboard = lazy(() => import('./components/CarbonFootprintDashboard'));

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Suspense fallback={<div>Loading...</div>}>
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
                    </Suspense>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
