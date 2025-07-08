import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, isFuture } from 'date-fns';

const StopsSection = styled.section`
  padding: 4rem 0;
  background: var(--white);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled(motion.h2)`
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
`;

const Tab = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 30px;
  background: ${props => props.active ? 'var(--gradient-ocean)' : '#f5f5f5'};
  color: ${props => props.active ? '#fff' : 'var(--navy)'};
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 15px rgba(42, 111, 151, 0.2)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(42, 111, 151, 0.2);
  }
`;

const StopsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StopCard = styled(motion.div)`
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StopImage = styled.div`
  height: 200px;
  background: ${props => `url(${props.image}) center/cover`};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  }
`;

const StopContent = styled.div`
  padding: 1.5rem;
`;

const StopTitle = styled.h3`
  font-size: 1.3rem;
  color: var(--navy);
  margin-bottom: 0.5rem;
`;

const StopDate = styled.p`
  color: var(--ocean-blue);
  font-weight: 500;
  margin-bottom: 1rem;
`;

const StopDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const StopStatus = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => props.isPast ? '#e0e0e0' : 'var(--light-blue)'};
  color: ${props => props.isPast ? '#666' : 'var(--ocean-blue)'};
`;

// Using the same stops data from the Itinerary component
const stops = [
  {
    location: "Southampton, England",
    date: "2024-09-09",
    description: "Embarkation and beginning of our journey",
    image: "https://images.unsplash.com/photo-1529963183134-61a90db47eaf"
  },
  {
    location: "Lisbon, Portugal",
    date: "2024-09-15",
    description: "Exploring historic neighborhoods and enjoying Portuguese cuisine",
    image: "https://images.unsplash.com/photo-1513735492246-483525079686"
  },
  {
    location: "Barcelona, Spain",
    date: "2024-09-20",
    description: "Art, architecture, and Mediterranean culture",
    image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216"
  },
  {
    location: "Rome, Italy",
    date: "2024-09-25",
    description: "Ancient history and Italian lifestyle",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5"
  },
  {
    location: "Athens, Greece",
    date: "2024-09-30",
    description: "Classical ruins and Greek island life",
    image: "https://images.unsplash.com/photo-1503152394-c571994fd383"
  },
  {
    location: "Istanbul, Turkey",
    date: "2024-10-05",
    description: "Where East meets West - bazaars and Byzantine treasures",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200"
  },
  {
    location: "Dubai, UAE",
    date: "2024-10-15",
    description: "Modern marvels and desert adventures",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
  },
  {
    location: "Mumbai, India",
    date: "2024-10-22",
    description: "Vibrant culture and historical landmarks",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445"
  },
  {
    location: "Singapore",
    date: "2024-11-01",
    description: "City in a garden - modern Asia at its finest",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd"
  },
  {
    location: "Ho Chi Minh City, Vietnam",
    date: "2024-11-07",
    description: "Rich history and Vietnamese traditions",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482"
  },
  {
    location: "Hong Kong",
    date: "2024-11-15",
    description: "Final destination - where tradition meets innovation",
    image: "https://images.unsplash.com/photo-1536599018102-9f6700efd6a3"
  }
];

const Stops = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredStops = stops.filter(stop => {
    const stopDate = new Date(stop.date);
    switch (activeTab) {
      case 'upcoming':
        return isFuture(stopDate);
      case 'past':
        return isPast(stopDate);
      default:
        return true;
    }
  });

  return (
    <StopsSection>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Cruise Destinations
        </Title>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            All Stops
          </Tab>
          <Tab 
            active={activeTab === 'upcoming'} 
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Stops
          </Tab>
          <Tab 
            active={activeTab === 'past'} 
            onClick={() => setActiveTab('past')}
          >
            Past Stops
          </Tab>
        </TabContainer>

        <AnimatePresence mode="wait">
          <StopsGrid
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {filteredStops.map((stop, index) => (
              <StopCard
                key={stop.location}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StopImage image={stop.image} />
                <StopContent>
                  <StopTitle>{stop.location}</StopTitle>
                  <StopDate>{format(new Date(stop.date), 'MMMM d, yyyy')}</StopDate>
                  <StopDescription>{stop.description}</StopDescription>
                  <StopStatus isPast={isPast(new Date(stop.date))}>
                    {isPast(new Date(stop.date)) ? 'Visited' : 'Upcoming'}
                  </StopStatus>
                </StopContent>
              </StopCard>
            ))}
          </StopsGrid>
        </AnimatePresence>
      </Container>
    </StopsSection>
  );
};

export default Stops; 