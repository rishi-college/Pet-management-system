import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/">
            <h1>Pet Dog Breeds</h1>
          </Link>
          <div>
            <Link to="/">All Breeds</Link>
            <Link to="/breeds/new" className="btn btn-primary">Add New Breed</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
