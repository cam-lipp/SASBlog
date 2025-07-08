import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Newsletter from './Newsletter';
import WaveBackground from './WaveBackground';
import Hero from './Hero';
import { useContentful } from '../hooks/useContentful';
import { contentTypes, formatDateRange, isTripCurrent } from '../config/contentful';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const DestinationsSection = styled.section`
  padding: 4rem 0;
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  margin: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const FilterTab = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.active ? 'var(--gradient-ocean)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--navy)'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.active ? 'transparent' : 'var(--ocean-blue)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--navy);
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: var(--gradient-ocean);
    border-radius: 2px;
  }
`;

const StopsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const StopCard = styled(Link)`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  backdrop-filter: blur(5px);
  text-decoration: none;
  display: block;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
  
  ${props => props.isCurrent && `
    border: 2px solid var(--ocean-blue);
    background: rgba(135, 206, 235, 0.1);
    
    &::before {
      content: '🚢';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 2rem;
      background: white;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const StopTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--navy);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StopDate = styled.p`
  color: var(--ocean-blue);
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const StopDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
`;

const TripStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.2rem;
  color: var(--navy);
`;

const NoContentMessage = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--navy);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

// Fallback data for when Contentful has no content
const fallbackStops = [
  {
    id: 'fallback-1',
    title: "Southampton, UK",
    date: "September 9, 2024",
    shortDescription: "Departing from this historic port city, where many great voyages have begun.",
    startDate: new Date("2024-09-09"),
    isCurrent: false
  },
  {
    id: 'fallback-2',
    title: "Barcelona, Spain", 
    date: "September 15-17, 2024",
    shortDescription: "Exploring Gaudi's architecture and experiencing vibrant Spanish culture.",
    startDate: new Date("2024-09-15"),
    isCurrent: false
  },
  {
    id: 'fallback-3',
    title: "Dubrovnik, Croatia",
    date: "September 20-22, 2024", 
    shortDescription: "Walking the ancient city walls and discovering the Pearl of the Adriatic.",
    startDate: new Date("2024-09-20"),
    isCurrent: false
  }
];

const Home = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const { data: trips, loading } = useContentful(contentTypes.trip);

  useEffect(() => {
    const hasSeenNewsletter = sessionStorage.getItem('hasSeenNewsletter');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setShowNewsletter(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseNewsletter = () => {
    setShowNewsletter(false);
    sessionStorage.setItem('hasSeenNewsletter', 'true');
  };

  // Use Contentful data if available, otherwise use fallback data
  const stopsData = trips && trips.length > 0 ? trips.map(trip => {
    const startDate = trip.fields.date || trip.fields.startDate;
    const endDate = trip.fields.endDate;
    const isCurrent = isTripCurrent(startDate, endDate);
    
    return {
      id: trip.sys.id,
      title: trip.fields.title,
      date: formatDateRange(startDate, endDate),
      shortDescription: trip.fields.shortDescription,
      isCurrent,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null
    };
  }).sort((a, b) => a.startDate - b.startDate) : fallbackStops; // Sort by start date

  const filteredStops = stopsData.filter(stop => {
    if (activeFilter === 'all') return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const tripStart = new Date(stop.startDate);
    tripStart.setHours(0, 0, 0, 0);
    
    const isUpcoming = tripStart > today;
    const isPast = !isUpcoming && !stop.isCurrent;
    
    if (activeFilter === 'upcoming') return isUpcoming || stop.isCurrent;
    if (activeFilter === 'past') return isPast;
    return true;
  });

  if (loading) {
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <Hero />
          <DestinationsSection>
            <SectionTitle>Semester at Sea Destinations</SectionTitle>
            <LoadingSpinner>Loading destinations...</LoadingSpinner>
          </DestinationsSection>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <WaveBackground />
      <ContentWrapper>
        <Hero />
        <DestinationsSection>
          <SectionTitle>Semester at Sea Destinations</SectionTitle>
          
          {(!trips || trips.length === 0) && (
            <NoContentMessage>
              <h3>Content Coming Soon!</h3>
              <p>Trip destinations will appear here once you add them to Contentful.</p>
              <p>Add your first trip in Contentful to see it displayed here automatically.</p>
            </NoContentMessage>
          )}
          
          {trips && trips.length > 0 && (
            <>
              <FilterTabs>
                <FilterTab 
                  active={activeFilter === 'all'} 
                  onClick={() => setActiveFilter('all')}
                >
                  All Stops
                </FilterTab>
                <FilterTab 
                  active={activeFilter === 'upcoming'} 
                  onClick={() => setActiveFilter('upcoming')}
                >
                  Upcoming Stops
                </FilterTab>
                <FilterTab 
                  active={activeFilter === 'past'} 
                  onClick={() => setActiveFilter('past')}
                >
                  Past Stops
                </FilterTab>
              </FilterTabs>
                              <StopsContainer>
                  {filteredStops.map((stop) => (
                    <StopCard key={stop.id} to={`/trips/${stop.id}`} isCurrent={stop.isCurrent}>
                      <StopTitle>
                        {stop.title}
                        {stop.isCurrent && (
                          <TripStatus status="current">
                            🚢 Currently Here
                          </TripStatus>
                        )}
                      </StopTitle>
                      <StopDate>{stop.date}</StopDate>
                      <StopDescription>{stop.shortDescription}</StopDescription>
                    </StopCard>
                  ))}
                </StopsContainer>
            </>
          )}
        </DestinationsSection>
      </ContentWrapper>
      {showNewsletter && (
        <Newsletter isOpen={showNewsletter} onClose={handleCloseNewsletter} />
      )}
    </PageContainer>
  );
};

export default Home; 