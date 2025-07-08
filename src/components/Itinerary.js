import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import WaveBackground from './WaveBackground';
import { useContentful } from '../hooks/useContentful';
import { contentTypes, formatDateRange, isTripCurrent } from '../config/contentful';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  padding-top: 100px;
  scroll-behavior: smooth;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--navy);
  margin-bottom: 3rem;
  text-align: center;
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

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, var(--ocean-blue), var(--light-blue));
    transform: translateX(-50%);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    &::before {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    @media (max-width: 768px) {
      flex-direction: row;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: row;
    margin-left: 60px;
  }
`;

const TimelineMarker = styled.div`
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => 
    props.isCurrent 
      ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
      : 'linear-gradient(135deg, #9E9E9E, #757575)'
  };
  transform: translateX(-50%);
  z-index: 2;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  ${props => props.isCurrent && `
    animation: pulse 2s infinite;
    
    &::after {
      content: '🚢';
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.5rem;
      background: white;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
  `}
  
  @keyframes pulse {
    0% { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 10px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(76, 175, 80, 0); }
  }
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineCard = styled(Link)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  text-decoration: none;
  display: block;
  width: 45%;
  margin: 0 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.isCurrent && `
    border: 2px solid var(--ocean-blue);
    background: rgba(135, 206, 235, 0.1);
  `}
  
  @media (max-width: 768px) {
    width: calc(100% - 2rem);
    margin: 0 1rem;
  }
`;

const TripTitle = styled.h3`
  font-size: 1.4rem;
  color: var(--navy);
  margin-bottom: 0.5rem;
`;

const TripDate = styled.p`
  color: var(--ocean-blue);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const TripDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
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

const AtSeaIndicator = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  z-index: 3;
`;

const AtSeaMarker = styled.div`
  position: relative;
  font-size: 2rem;
  background: white;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: float 3s ease-in-out infinite;
  z-index: 4;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: radial-gradient(circle, rgba(135, 206, 235, 0.3) 0%, rgba(135, 206, 235, 0.1) 70%, transparent 100%);
    border-radius: 50%;
    z-index: -1;
    animation: ripple 2s infinite;
  }
  
  @keyframes ripple {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }
`;

const AtSeaText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--ocean-blue);
  font-weight: 600;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

const Itinerary = () => {
  const { data: trips, loading, error } = useContentful(contentTypes.trip);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <LoadingSpinner>Loading itinerary...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <Title>Travel Itinerary</Title>
          <NoContentMessage>
            <h3>Error loading itinerary</h3>
            <p>Please try again later.</p>
          </NoContentMessage>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // Process and sort trips by date
  const sortedTrips = trips && trips.length > 0 ? trips.map(trip => {
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
  }).sort((a, b) => a.startDate - b.startDate) : [];

  return (
    <PageContainer>
      <WaveBackground />
      <ContentWrapper>
        <Title>Travel Itinerary</Title>
        
        {(!trips || trips.length === 0) && (
          <NoContentMessage>
            <h3>No Trips Planned Yet!</h3>
            <p>Your travel itinerary will appear here once you add trips to Contentful.</p>
            <p>Add your first trip to see your journey timeline!</p>
          </NoContentMessage>
        )}
        
        {sortedTrips.length > 0 && (
          <Timeline>
            {sortedTrips.map((trip, index) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              // Check if we're between this trip and the next trip
              const nextTrip = sortedTrips[index + 1];
              let isAtSea = false;
              
              if (nextTrip) {
                const currentTripEnd = new Date(trip.endDate || trip.startDate);
                currentTripEnd.setHours(0, 0, 0, 0);
                const nextTripStart = new Date(nextTrip.startDate);
                nextTripStart.setHours(0, 0, 0, 0);
                
                // We're at sea if today is after current trip ends and before next trip starts
                isAtSea = today > currentTripEnd && today < nextTripStart;
              }
              
              return (
                <React.Fragment key={trip.id}>
                  <TimelineItem>
                    <TimelineMarker 
                      isCurrent={trip.isCurrent}
                    />
                    <TimelineCard to={`/trips/${trip.id}`} isCurrent={trip.isCurrent}>
                      <TripTitle>
                        {trip.title}
                        {trip.isCurrent && (
                          <TripStatus status="current">
                            🚢 Currently Here
                          </TripStatus>
                        )}
                      </TripTitle>
                      <TripDate>{trip.date}</TripDate>
                      <TripDescription>{trip.shortDescription}</TripDescription>
                    </TimelineCard>
                  </TimelineItem>
                  
                  {isAtSea && (
                    <AtSeaIndicator>
                      <AtSeaMarker>
                        🚢
                      </AtSeaMarker>
                      <AtSeaText>Currently at Sea</AtSeaText>
                    </AtSeaIndicator>
                  )}
                </React.Fragment>
              );
            })}
          </Timeline>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Itinerary; 