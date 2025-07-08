import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Newsletter from './Newsletter';

const FooterContainer = styled.footer`
  position: relative;
  padding: 3rem 0 2rem;
  background: transparent;
  color: var(--navy);
  z-index: 1;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  position: relative;
  z-index: 2;
  justify-content: center;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: var(--navy);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 2px;
      background: var(--gradient-ocean);
      border-radius: 2px;
    }
  }
`;

const FooterLink = styled.a`
  display: block;
  color: var(--navy);
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    color: var(--ocean-blue);
  }
`;

const FooterButton = styled.button`
  display: block;
  color: var(--navy);
  background: none;
  border: none;
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  text-align: center;
  padding: 0;

  &:hover {
    color: var(--ocean-blue);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  justify-content: center;
`;

const SocialIcon = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: var(--navy);
  transition: color 0.3s ease;

  &:hover {
    color: var(--ocean-blue);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 52, 98, 0.1);
  color: var(--navy);
  position: relative;
  z-index: 2;
`;

const Footer = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const navigate = useNavigate();

  const handleContactClick = () => {
    const email = 'cameronclipp@gmail.com';
    
    // Copy email to clipboard (more reliable than mailto)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        alert(`📧 Email copied to clipboard!\n${email}\n\nPaste it into your email app.`);
      }).catch(() => {
        alert(`📧 Contact me at: ${email}`);
      });
    } else {
      // Fallback for older browsers
      alert(`📧 Contact me at: ${email}`);
    }
  };

  const handleSubscribeClick = () => {
    setShowNewsletter(true);
  };

  return (
    <>
      <FooterContainer>
        <FooterContent>
          <FooterSection>
            <h3>About</h3>
            <FooterButton onClick={() => navigate('/about')}>About Me</FooterButton>
            <FooterButton onClick={() => navigate('/itinerary')}>Travel Itinerary</FooterButton>
            <FooterButton onClick={() => navigate('/photos')}>Photo Gallery</FooterButton>
          </FooterSection>
          <FooterSection>
            <h3>Connect</h3>
            <FooterButton onClick={handleContactClick}>Contact Me</FooterButton>
            <FooterButton onClick={handleSubscribeClick}>Subscribe</FooterButton>
            <SocialLinks>
              <FooterLink href="https://instagram.com/cam.lipp" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <SocialIcon icon={faInstagram} />
              </FooterLink>
              <FooterLink href="https://www.linkedin.com/in/cameron-lipp" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <SocialIcon icon={faLinkedin} />
              </FooterLink>
            </SocialLinks>
          </FooterSection>
          <FooterSection>
            <h3>Resources</h3>
            <FooterLink href="https://www.semesteratsea.org/top-ten-things-sas-alumni-wish-they-knew-before-sailing/" target="_blank" rel="noopener noreferrer">Travel Tips</FooterLink>
            <FooterLink href="https://www.semesteratsea.org/experience/ship/packing-list/" target="_blank" rel="noopener noreferrer">Packing List</FooterLink>
            <FooterLink href="https://www.semesteratsea.org/resource/faq-admissions/" target="_blank" rel="noopener noreferrer">SAS FAQs</FooterLink>
          </FooterSection>
        </FooterContent>
        <Copyright>
          © {new Date().getFullYear()} Cam's Semester at Sea. All rights reserved.
        </Copyright>
      </FooterContainer>
      
      {/* Newsletter component outside footer for better z-index */}
      <Newsletter isOpen={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </>
  );
};

export default Footer; 