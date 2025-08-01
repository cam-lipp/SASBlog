import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: transparent;
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
  backdrop-filter: blur(8px);
  
  &.scrolled {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--navy);
  text-decoration: none;
  background: linear-gradient(135deg, var(--navy) 0%, var(--ocean-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.2rem;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  color: var(--navy);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gradient-ocean);
    transition: width 0.3s ease;
  }

  &:hover {
    color: var(--ocean-blue);
    
    &::after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    white-space: nowrap;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer className={isScrolled ? 'scrolled' : ''}>
      <HeaderContent>
        <Logo to="/">Cam's Semester at Sea</Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/itinerary">Itinerary</NavLink>
          <NavLink to="/trips">Trips</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/photos">Gallery</NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 