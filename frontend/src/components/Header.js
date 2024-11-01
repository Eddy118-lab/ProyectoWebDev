import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './pictures/logos.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = ({ onLikeClick, onSaveClick }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const handleHomeClick = () => navigate('/home');
    const handleProfileClick = () => navigate('/profile/user/info');
    const handleCreateClick = () => navigate('/post/user');
    const handleFriendsClick = () => navigate('/amigos');
    const handleListClick = () => navigate('/list/friends');
    const handleChatClick = () => navigate('/chat');
    const handleLikedClick = () => navigate('/liked');
    const handleSavedClick = () => navigate('/saved');
    const toggleMenu = () => setShowMenu(!showMenu);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login/form');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar navbar-light bg-white border-bottom fixed-top" style={{ width: '100%' }}>
            <div className="container d-flex justify-content-between">
                <button className="navbar-brand btn p-0" onClick={handleHomeClick} style={{ border: 'none', background: 'none' }}>
                    <img src={logo} alt="Logo" style={{ height: '60px' }} />
                </button>
                <div>
                    <button className="btn text-dark" onClick={handleHomeClick}>
                        <i className="fas fa-home"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleCreateClick}>
                        <i className="fas fa-plus-square"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleFriendsClick}>
                        <i className="fas fa-users"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleListClick}>
                        <i className="fas fa-list"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleChatClick}>
                        <i className="fas fa-comments"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleLikedClick}>
                        <i className="fas fa-heart"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleSavedClick}>
                        <i className="fas fa-bookmark"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleProfileClick}>
                        <i className="fas fa-user-circle"></i>
                    </button>
                    <button className="btn text-dark" onClick={toggleMenu}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>

            {showMenu && (
                <div className="position-absolute bg-white border rounded shadow-sm p-2" style={{ top: '70px', right: '10px', zIndex: 1000 }}>
                    <button className="btn text-dark w-100 text-start" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Header;
