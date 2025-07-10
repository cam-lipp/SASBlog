import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import WaveBackground from './WaveBackground';
import { useContentful, useSingleEntry } from '../hooks/useContentful';
import { contentTypes, formatDateRange, safeDateParse } from '../config/contentful';
import { getAllImageUrls, getImageUrl, getImageAlt, ImageGalleryComponent } from '../utils/imageUtils';
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

const BlogCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  margin-bottom: 2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BlogTitle = styled.h2`
  color: var(--navy);
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const BlogDate = styled.p`
  color: var(--ocean-blue);
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const BlogImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
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



const BlogContent = styled.div`
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
  }
`;

const BlogPreview = styled.div`
  color: var(--navy);
  line-height: 1.8;
  font-size: 1.1rem;
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





const Blog = () => {
  const { postId } = useParams();
  const { data: blogPosts, loading: postsLoading, error: postsError } = useContentful(contentTypes.blogPost);
  const { data: singlePost, loading: postLoading, error: postError } = useSingleEntry(postId);

  // Scroll to top when component mounts or postId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [postId]);

  if (postsLoading || (postId && postLoading)) {
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <LoadingSpinner>Loading...</LoadingSpinner>
        </ContentWrapper>
      </PageContainer>
    );
  }

  if (postsError || (postId && postError)) {
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

  // If we're viewing a single blog post
  if (postId && singlePost) {
    const post = singlePost.fields;
    
    // Get all images for the blog post
    const allImages = getAllImageUrls(post);
    
    return (
      <PageContainer>
        <WaveBackground />
        <ContentWrapper>
          <BackLink to="/blog">&larr; Back to Blog</BackLink>
          <BlogCard>
            <BlogTitle>{post.title}</BlogTitle>
            <BlogDate>{formatDateRange(post.date)}</BlogDate>
            
            <ImageGalleryComponent 
              images={allImages} 
              altPrefix={post.title}
            />
            
            <BlogContent>
              {renderRichText(post.content)}
            </BlogContent>
          </BlogCard>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // Display list of all blog posts
  return (
    <PageContainer>
      <WaveBackground />
      <ContentWrapper>
        <Title>Blog</Title>
        
        {(!blogPosts || blogPosts.length === 0) && (
          <NoContentMessage>
            <h3>No Blog Posts Yet!</h3>
            <p>Your blog posts will appear here once you add them to Contentful.</p>
            <p>Create your first blog post entry in Contentful to see it displayed here.</p>
          </NoContentMessage>
        )}
        
        {blogPosts && blogPosts.length > 0 && blogPosts
          .sort((a, b) => {
            const dateA = safeDateParse(a.fields.date);
            const dateB = safeDateParse(b.fields.date);
            return dateB - dateA;
          })
          .map(post => (
          <BlogCard key={post.sys.id}>
            <BlogTitle>
              <Link to={`/blog/${post.sys.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {post.fields.title}
              </Link>
            </BlogTitle>
            <BlogDate>{formatDateRange(post.fields.date)}</BlogDate>
            {(() => {
              const imageUrl = getImageUrl(post.fields.featuredImage);
              const imageAlt = getImageAlt(post.fields.featuredImage, post.fields.title);
              return imageUrl && (
                <BlogImage 
                  src={imageUrl}
                  alt={imageAlt}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.log('Failed to load image:', imageUrl);
                  }}
                />
              );
            })()}
            <BlogPreview>
              <p>{post.fields.excerpt || (typeof post.fields.content === 'string' ? post.fields.content.substring(0, 200) + '...' : 'Click to read more...')}</p>
              <Link to={`/blog/${post.sys.id}`} style={{ color: 'var(--ocean-blue)', fontWeight: '500' }}>
                Read more →
              </Link>
            </BlogPreview>
          </BlogCard>
        ))}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Blog; 