import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroContainer = styled.div`
  height: 85vh;
  min-height: 600px;
  background: linear-gradient(
    180deg,
    #87CEEB 0%,
    #B7E9FF 100%
  );
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    height: 80vh;
    min-height: 500px;
  }
`;

const Sun = styled.div`
  position: absolute;
  top: 50px;
  right: 100px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle at center, #FFE87C 0%, #FFD700 60%, #FFA500 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px #FFD700;
  animation: sunGlow 4s ease-in-out infinite;

  @keyframes sunGlow {
    0%, 100% { box-shadow: 0 0 60px #FFD700; }
    50% { box-shadow: 0 0 80px #FFD700; }
  }
`;

const Cloud = styled.div`
  position: absolute;
  background: #fff;
  border-radius: 50px;
  animation: floatCloud linear infinite;
  opacity: 0.9;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: #fff;
    border-radius: 50%;
  }

  &.cloud1 {
    top: 100px;
    left: 100px;
    width: 100px;
    height: 40px;
    animation-duration: 30s;

    &::before {
      width: 50px;
      height: 50px;
      top: -20px;
      left: 15px;
    }

    &::after {
      width: 40px;
      height: 40px;
      top: -15px;
      right: 15px;
    }
  }

  &.cloud2 {
    top: 150px;
    right: 200px;
    width: 120px;
    height: 45px;
    animation-duration: 35s;
    animation-delay: -15s;

    &::before {
      width: 60px;
      height: 60px;
      top: -25px;
      left: 20px;
    }

    &::after {
      width: 45px;
      height: 45px;
      top: -15px;
      right: 18px;
    }
  }

  &.cloud3 {
    top: 80px;
    left: 40%;
    width: 90px;
    height: 35px;
    animation-duration: 28s;
    animation-delay: -5s;

    &::before {
      width: 45px;
      height: 45px;
      top: -18px;
      left: 12px;
    }

    &::after {
      width: 35px;
      height: 35px;
      top: -12px;
      right: 12px;
    }
  }

  @keyframes floatCloud {
    from {
      transform: translateX(-200%);
    }
    to {
      transform: translateX(calc(100vw + 200px));
    }
  }
`;

const WaveOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231a4b6e' fill-opacity='0.8' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x bottom;
  background-size: contain;
  z-index: 1;
  animation: wave 20s linear infinite;
  opacity: 0.9;

  @media (max-width: 768px) {
    height: 120px;
  }

  @keyframes wave {
    0% { background-position-x: 0; }
    100% { background-position-x: 1440px; }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231a4b6e' fill-opacity='0.5' d='M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,192C672,192,768,160,864,154.7C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x bottom;
    background-size: contain;
    animation: wave 15s linear infinite reverse;
    opacity: 0.7;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 2rem;
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeIn 1.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: 3px;
  text-shadow: 
    3px 3px 6px rgba(0, 0, 0, 0.3),
    0 0 120px rgba(0, 70, 190, 0.4);
  background: linear-gradient(
    120deg, 
    #0046BE 0%,
    #2E7FFF 30%,
    #ffffff 60%,
    #2E7FFF 80%,
    #0046BE 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shine 8s linear infinite;
  position: relative;
  display: inline-block;
  font-family: 'Playfair Display', serif;

  @keyframes shine {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 4px;
    background: linear-gradient(90deg, 
      transparent,
      #2E7FFF,
      #ffffff,
      #2E7FFF,
      transparent
    );
    border-radius: 2px;
    animation: glow 3s ease-in-out infinite;
  }

  @keyframes glow {
    0%, 100% { 
      opacity: 0.5;
      box-shadow: 0 0 20px rgba(46, 127, 255, 0.3);
    }
    50% { 
      opacity: 1;
      box-shadow: 0 0 30px rgba(46, 127, 255, 0.6);
    }
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.3rem, 2.8vw, 2rem);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  color: #ffffff;
  opacity: 0.95;
  font-family: 'Montserrat', sans-serif;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffffff);
    transform: translateY(-50%);
  }

  &::before {
    left: -80px;
  }

  &::after {
    right: -80px;
    transform: translateY(-50%) rotate(180deg);
  }
`;

const CruiseShip = styled(motion.div)`
  position: absolute;
  bottom: 120px;
  left: -300px;
  width: 280px;
  height: 180px;
  z-index: 2;
  animation: cruiseAcross 40s linear infinite;
  transform-origin: center;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));

  @media (max-width: 768px) {
    bottom: 80px;
    width: 200px;
    height: 130px;
    left: -200px;
    animation: cruiseAcrossMobile 25s linear infinite;
  }

  /* Ship body */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 25px;
    width: 230px;
    height: 90px;
    background: linear-gradient(to bottom, #ffffff, #f5f5f5);
    border-radius: 20px 80px 0 0;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  /* Ship top */
  &::after {
    content: '';
    position: absolute;
    bottom: 90px;
    left: 55px;
    width: 170px;
    height: 65px;
    background: linear-gradient(to bottom, #f5f5f5, #e1e1e1);
    border-radius: 12px 12px 0 0;
  }

  /* Windows */
  .windows {
    position: absolute;
    bottom: 30px;
    left: 55px;
    right: 55px;
    display: flex;
    gap: 18px;

    .window {
      width: 18px;
      height: 18px;
      background: #64b5f6;
      border-radius: 50%;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3),
                  0 0 10px rgba(100, 181, 246, 0.5);
      animation: twinkle 2s ease-in-out infinite alternate;
    }

    .window:nth-child(odd) {
      animation-delay: 0.5s;
    }
  }

  /* Chimney */
  .chimney {
    position: absolute;
    bottom: 155px;
    left: 95px;
    width: 32px;
    height: 45px;
    background: linear-gradient(to right, #ff6b6b, #ff8585);
    border-radius: 4px 4px 0 0;
    transform-origin: bottom;
    animation: smoke 2s ease-in-out infinite;

    &::after {
      content: '';
      position: absolute;
      top: -12px;
      left: 0;
      width: 32px;
      height: 12px;
      background: #4a4a4a;
      border-radius: 4px 4px 0 0;
    }

    /* Smoke */
    .smoke {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      animation: rise 3s ease-out infinite;
      opacity: 0;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: rise 3s ease-out infinite;
      }

      &::before {
        left: -15px;
        top: 5px;
        animation-delay: 0.5s;
      }

      &::after {
        right: -15px;
        top: -5px;
        animation-delay: 1s;
      }
    }
  }

  @keyframes cruiseAcross {
    0% {
      transform: translateX(0) rotate(0deg) translateY(0);
    }
    25% {
      transform: translateX(calc(50vw - 140px)) rotate(2deg) translateY(-10px);
    }
    50% {
      transform: translateX(calc(100vw - 280px)) rotate(-1deg) translateY(0);
    }
    75% {
      transform: translateX(calc(150vw - 420px)) rotate(1deg) translateY(-15px);
    }
    100% {
      transform: translateX(calc(200vw - 560px)) rotate(0deg) translateY(0);
    }
  }

  @keyframes cruiseAcrossMobile {
    0% {
      transform: translateX(0) rotate(0deg) translateY(0);
    }
    25% {
      transform: translateX(calc(50vw - 100px)) rotate(2deg) translateY(-8px);
    }
    50% {
      transform: translateX(calc(100vw - 200px)) rotate(-1deg) translateY(0);
    }
    75% {
      transform: translateX(calc(150vw - 300px)) rotate(1deg) translateY(-12px);
    }
    100% {
      transform: translateX(calc(200vw - 400px)) rotate(0deg) translateY(0);
    }
  }

  @keyframes twinkle {
    0% { 
      opacity: 0.6;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3),
                  0 0 5px rgba(100, 181, 246, 0.3);
    }
    100% { 
      opacity: 1;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3),
                  0 0 15px rgba(100, 181, 246, 0.8);
    }
  }

  @keyframes smoke {
    0%, 100% { transform: rotate(-2deg) scale(1); }
    50% { transform: rotate(2deg) scale(1.05); }
  }

  @keyframes rise {
    0% {
      transform: translate(-50%, 0) scale(1);
      opacity: 0.8;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -40px) scale(2);
      opacity: 0;
    }
  }
`;

const Hero = () => {
  return (
    <HeroContainer>
      <Sun />
      <Cloud className="cloud1" />
      <Cloud className="cloud2" />
      <Cloud className="cloud3" />
      <Content>
        <Title
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: 0.2
          }}
        >
          Cam's Semester at Sea
        </Title>
        <Subtitle
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: 0.4 
          }}
        >
          Documenting my journey across the world's seas and the stories that unfold along the way
        </Subtitle>
      </Content>
      <WaveOverlay />
      <CruiseShip>
        <div className="windows">
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
        </div>
        <div className="chimney">
          <div className="smoke"></div>
        </div>
      </CruiseShip>
    </HeroContainer>
  );
};

export default Hero; 