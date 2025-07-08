import React from 'react';
import styled, { keyframes } from 'styled-components';

const waveAnimation = keyframes`
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: 1000px;
  }
`;

const WaveContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
`;

const Wave = styled.div`
  position: absolute;
  width: 200%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23003462'/%3E%3C/svg%3E");
  background-repeat: repeat-x;
  background-position: 0 bottom;
  background-size: 50% auto;
  animation: ${waveAnimation} 20s linear infinite;
  opacity: 0.2;

  &:nth-child(2) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%232a6f97'/%3E%3C/svg%3E");
    animation-duration: 15s;
    opacity: 0.3;
    top: 10px;
  }

  &:nth-child(3) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%234a95bf'/%3E%3C/svg%3E");
    animation-duration: 25s;
    opacity: 0.2;
    top: 20px;
  }
`;

const WaveBackground = () => {
  return (
    <WaveContainer>
      <Wave />
      <Wave />
      <Wave />
    </WaveContainer>
  );
};

export default WaveBackground; 