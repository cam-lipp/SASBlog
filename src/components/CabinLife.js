import React from 'react';
import styled from 'styled-components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import WaveBackground from './WaveBackground';
import { useContentful } from '../hooks/useContentful';
import { contentTypes } from '../config/contentful';
import { ImageGalleryComponent } from '../utils/imageUtils';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
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

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  margin-bottom: 2rem;
`;

const Text = styled.div`
  color: var(--navy);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;

  p {
    margin-bottom: 1.5rem;
  }
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
const renderRichText = (richTextDocument) => {
  if (!richTextDocument) return null;
  
  // If it's already a string (plain text), return it
  if (typeof richTextDocument === 'string') {
    return <p>{richTextDocument}</p>;
  }
  
  // If it's a rich text document object, render it properly
  try {
    return documentToReactComponents(richTextDocument, richTextOptions);
  } catch (error) {
    console.error('Error rendering rich text:', error);
    console.log('Rich text document:', richTextDocument);
    return <p>Content could not be displayed</p>;
  }
};

const CabinLife = () => {
  const { data: cabinContent, loading, error } = useContentful(contentTypes.cabinLife, {
    limit: 1,
  });

  if (loading) {
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (error) {
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

  const content = cabinContent?.[0]?.fields;

  return (
    <PageContainer>
      <WaveBackground />
      <ContentWrapper>
        <Title>Cabin Life</Title>
        
        {(!cabinContent || cabinContent.length === 0 || !content) && (
          <ContentCard>
            <Text>
              <h3 style={{ color: 'var(--navy)', marginBottom: '1rem' }}>Content Coming Soon!</h3>
              <p>My cabin life stories and photos will appear here once I add them to Contentful.</p>
              <p>Check back soon for updates about life aboard the ship!</p>
            </Text>
          </ContentCard>
        )}
        
        {content && (
          <ContentCard>
            {content.content && (
              <Text>
                {renderRichText(content.content)}
              </Text>
            )}
            
            <ImageGalleryComponent 
              images={content.images} 
              altPrefix="Cabin life"
            />
          </ContentCard>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default CabinLife; 