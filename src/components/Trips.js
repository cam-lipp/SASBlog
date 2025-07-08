import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import WaveBackground from './WaveBackground';
import { useContentful, useSingleEntry } from '../hooks/useContentful';
import { contentTypes, formatDateRange, isTripCurrent } from '../config/contentful';
import { getAllImageUrls, ImageGalleryComponent } from '../utils/imageUtils';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  padding-top: 100px;
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    padding-top: 140px; /* Extra padding for mobile header */
  }
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
  margin-bottom: 2rem;
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

const TripCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.isCurrent && `
    border: 2px solid var(--ocean-blue);
    background: rgba(135, 206, 235, 0.1);
    
    &::before {
      content: '🚢';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 1.5rem;
      background: white;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const TripTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--navy);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const TripDate = styled.p`
  color: var(--ocean-blue);
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const SingleImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 10px;
  margin: 1.5rem 0;
  background: #f8f9fa;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: block;
  
  @media (max-width: 768px) {
    max-height: 400px;
  }
`;

const TripDescription = styled.div`
  color: var(--navy);
  line-height: 1.8;
  font-size: 1.1rem;

  p {
    margin-bottom: 1.5rem;
  }

  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    margin: 1rem 0;
    background: #f8f9fa;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: block;
  }
  
  /* Handle images in rich text content */
  figure {
    margin: 1.5rem 0;
    text-align: center;
    
    img {
      max-width: 100%;
      height: auto;
    }
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--navy);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: var(--ocean-blue);
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

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  padding: 2rem;
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





// Rich text rendering options
const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2>{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3>{children}</h3>,
    [BLOCKS.HEADING_4]: (node, children) => <h4>{children}</h4>,
    [BLOCKS.HEADING_5]: (node, children) => <h5>{children}</h5>,
    [BLOCKS.HEADING_6]: (node, children) => <h6>{children}</h6>,
    [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => <blockquote>{children}</blockquote>,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title } = node.data.target.fields;
      const imageUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url;
      return (
        <SingleImage
          src={imageUrl} 
          alt={title || 'Embedded image'} 
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load embedded image:', imageUrl);
          }}
        />
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

// Helper function to render rich text content
const Trips = () => {
  const { tripId } = useParams();
  console.log('Trips component - tripId from URL:', tripId);
  
  const { data: trips, loading: tripsLoading, error: tripsError } = useContentful(contentTypes.trip);
  const { data: singleTrip, loading: tripLoading, error: tripError } = useSingleEntry(tripId);

  console.log('All trips:', trips);
  console.log('Single trip:', singleTrip);

  // Scroll to top when component mounts or tripId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tripId]);

  if (tripsLoading || (tripId && tripLoading)) {
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (tripsError || (tripId && tripError)) {
    console.error('Trip error:', tripsError || tripError);
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <ErrorMessage>
            Error loading content. Please try again later.
          </ErrorMessage>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // Process trips data with date ranges and status
  const processedTrips = trips && trips.length > 0 ? trips.map(trip => {
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

  // If we're viewing a single trip
  if (tripId) {
    if (tripLoading) {
      return (
        <PageContainer>
          <WaveBackground />
          <ContentWrapper>
            <LoadingSpinner>Loading trip...</LoadingSpinner>
          </ContentWrapper>
        </PageContainer>
      );
    }

    if (!singleTrip) {
      return (
        <PageContainer>
          <WaveBackground />
          <ContentWrapper>
            <Title>Trip Not Found</Title>
            <NoContentMessage>
              <h3>Sorry, this trip doesn't exist.</h3>
              <p>The trip you're looking for might have been removed or the URL might be incorrect.</p>
              <BackLink to="/trips">&larr; Back to All Trips</BackLink>
            </NoContentMessage>
          </ContentWrapper>
        </PageContainer>
      );
    }

          // Process single trip data
      const startDate = singleTrip.fields.date || singleTrip.fields.startDate;
      const endDate = singleTrip.fields.endDate;
      const isCurrent = isTripCurrent(startDate, endDate);
      
      const singleTripData = {
        id: singleTrip.sys.id,
        title: singleTrip.fields.title,
        date: formatDateRange(startDate, endDate),
        shortDescription: singleTrip.fields.shortDescription,
        description: singleTrip.fields.description,
        isCurrent,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      };

    // Get all images for the trip
    const allImages = getAllImageUrls(singleTrip.fields);

    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <BackLink to="/trips">&larr; Back to All Trips</BackLink>
                      <TripCard isCurrent={singleTripData.isCurrent}>
              <TripTitle>
                {singleTripData.title}
                {singleTripData.isCurrent && (
                  <TripStatus status="current">
                    🚢 Currently Here
                  </TripStatus>
                )}
              </TripTitle>
            <TripDate>{singleTripData.date}</TripDate>
            
            <ImageGalleryComponent 
              images={allImages} 
              altPrefix={singleTripData.title}
            />
            
            <TripDescription>
              {singleTripData.description ? (
                documentToReactComponents(singleTripData.description, richTextOptions)
              ) : (
                <p>No detailed description available yet.</p>
              )}
            </TripDescription>
          </TripCard>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // Display list of all trips
  return (
    <PageContainer>
      <WaveBackground />
      <ContentWrapper>
        <Title>My Ocean Adventures</Title>
        
        {(!trips || trips.length === 0) && (
          <NoContentMessage>
            <h3>No Trips Yet!</h3>
            <p>Your trip adventures will appear here once you add them to Contentful.</p>
            <p>Create your first trip entry in Contentful to see it displayed here.</p>
          </NoContentMessage>
        )}
        
                  {trips && trips.length > 0 && processedTrips.map(trip => (
            <TripCard key={trip.id} isCurrent={trip.isCurrent}>
              <TripTitle>
                <Link to={`/trips/${trip.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {trip.title}
                </Link>
                {trip.isCurrent && (
                  <TripStatus status="current">
                    🚢 Currently Here
                  </TripStatus>
                )}
              </TripTitle>
            <TripDate>{trip.date}</TripDate>
            <TripDescription>
              <p>{trip.shortDescription}</p>
              <Link to={`/trips/${trip.id}`} style={{ color: 'var(--ocean-blue)', fontWeight: '500' }}>
                Read more →
              </Link>
            </TripDescription>
          </TripCard>
        ))}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Trips; 