import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './components/Home';
import Itinerary from './components/Itinerary';
import Trips from './components/Trips';
import Blog from './components/Blog';
import Admin from './components/Admin';
import Header from './components/Header';
import Footer from './components/Footer';
import PhotoGallery from './components/PhotoGallery';
import About from './components/About';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:tripId" element={<Trips />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/photos" element={<PhotoGallery />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App; 