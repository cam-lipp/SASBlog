import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --dark-blue: #1a4b6e;
    --ocean-blue: #2a6f97;
    --light-blue: #E1F5FE;
    --navy: #1A365D;
    --white: #FFFFFF;
    
    /* Gradients */
    --gradient-ocean: linear-gradient(135deg, var(--dark-blue) 0%, var(--ocean-blue) 100%);
    
    /* Shadows */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--light-blue);
    overflow-x: hidden; /* Prevent horizontal scroll */
  }

  button {
    font-family: inherit;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
`;

export default GlobalStyle; 