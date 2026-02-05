import React from 'react';
import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">VĀKYAGUARD</h1>
        <p className="header-subtitle">Voice Authenticity Intelligence</p>
      </div>
    </header>
  );
};

export default Header;