import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { contentfulClient, contentTypes } from '../config/contentful';
import WaveBackground from './WaveBackground';

const GalleryContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 7rem 0 2rem; /* Top padding to account for fixed header */
  background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 100%);

  @media (max-width: 768px) {
    padding: 9rem 0 2rem; /* Extra padding for mobile header */
  }
`;

const GalleryContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: var(--navy);
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: var(--navy);
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
`;

const FilterButtons = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-bottom: 2rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: 2px solid var(--ocean-blue);
  background: ${props => props.active ? 'var(--ocean-blue)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--ocean-blue)'};
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: var(--ocean-blue);
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

const ImageGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ImageCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    &:active {
      transform: scale(0.98);
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 180px;
  }
`;

const ImageInfo = styled.div`
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const ImageTitle = styled.h3`
  color: var(--navy);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }
`;

const ImageSource = styled.p`
  color: var(--ocean-blue);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }
`;

const ImageDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.3;
  }
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: var(--navy);
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 10px;

  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 85%;
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    font-size: 1.8rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }
`;

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    // Simple scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchAllImages();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.source === filter));
    }
  }, [filter, images]);

  const fetchAllImages = async () => {
    try {
      const allImages = [];

      // Fetch from all content types
      const contentTypesToFetch = [
        { type: contentTypes.trip, sourceName: 'Trips' },
        { type: contentTypes.blogPost, sourceName: 'Blog' }
      ];

      // Fetch images from all content types

      for (const { type, sourceName } of contentTypesToFetch) {
        try {
          const response = await contentfulClient.getEntries({
            content_type: type,
            limit: 1000,
            include: 2
          });

          response.items.forEach(item => {
            const fields = item.fields;
            
            // Extract featured image(s) - handle both single image and array
            if (fields.featuredImage) {
              // Handle array of featured images
              if (Array.isArray(fields.featuredImage)) {
                fields.featuredImage.forEach((image, index) => {
                  if (image && image.fields && image.fields.file && image.fields.file.url) {
                    allImages.push({
                      id: `${item.sys.id}-featured-${index}`,
                      url: image.fields.file.url,
                      title: fields.title || 'Untitled',
                      description: `Featured image from ${fields.title || 'post'}`,
                      source: sourceName.toLowerCase().replace(' ', ''),
                      sourceName: sourceName,
                      alt: image.fields.title || image.fields.description || fields.title || 'Image'
                    });
                  }
                });
              } else {
                // Handle single featured image
                if (fields.featuredImage.fields && fields.featuredImage.fields.file && fields.featuredImage.fields.file.url) {
                  allImages.push({
                    id: `${item.sys.id}-featured`,
                    url: fields.featuredImage.fields.file.url,
                    title: fields.title || 'Untitled',
                    description: `Featured image from ${fields.title || 'post'}`,
                    source: sourceName.toLowerCase().replace(' ', ''),
                    sourceName: sourceName,
                    alt: fields.featuredImage.fields.title || fields.title || 'Image'
                  });
                }
              }
            }

            // Extract gallery images
            if (fields.gallery && Array.isArray(fields.gallery)) {
              fields.gallery.forEach((image, index) => {
                if (image && image.fields && image.fields.file && image.fields.file.url) {
                  allImages.push({
                    id: `${item.sys.id}-gallery-${index}`,
                    url: image.fields.file.url,
                    title: fields.title || 'Untitled',
                    description: image.fields.description || `Gallery image ${index + 1} from ${fields.title || 'post'}`,
                    source: sourceName.toLowerCase().replace(' ', ''),
                    sourceName: sourceName,
                    alt: image.fields.title || image.fields.description || 'Gallery image'
                  });
                }
              });
            }

            // Extract any other image fields
            Object.entries(fields).forEach(([key, value]) => {
              if (key !== 'featuredImage' && key !== 'gallery' && value && value.fields && value.fields.file && value.fields.file.url) {
                allImages.push({
                  id: `${item.sys.id}-${key}`,
                  url: value.fields.file.url,
                  title: fields.title || 'Untitled',
                  description: value.fields.description || `${key} from ${fields.title || 'post'}`,
                  source: sourceName.toLowerCase().replace(' ', ''),
                  sourceName: sourceName,
                  alt: value.fields.title || value.fields.description || 'Image'
                });
              }
            });
          });
        } catch (error) {
          console.error(`Failed to fetch images from ${type}:`, error);
        }
      }

      // Remove duplicates and add https if needed
      const uniqueImages = allImages
        .filter((img, index, self) => img.url && self.findIndex(i => i.url === img.url) === index)
        .map(img => ({
          ...img,
          url: img.url.startsWith('//') ? `https:${img.url}` : img.url
        }));

      setImages(uniqueImages);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setLoading(false);
    }
  };

  const filters = [
    { key: 'all', label: 'All Photos', count: images.length },
    { key: 'trips', label: 'Trips', count: images.filter(img => img.source === 'trips').length },
    { key: 'blog', label: 'Blog', count: images.filter(img => img.source === 'blog').length }
  ];

  return (
    <GalleryContainer>
      <WaveBackground />
      <GalleryContent>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Photo Gallery
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A collection of memories from my Semester at Sea adventure
        </Subtitle>

        <FilterButtons
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filters.map(filterOption => (
            <FilterButton
              key={filterOption.key}
              active={filter === filterOption.key}
              onClick={() => setFilter(filterOption.key)}
            >
              {filterOption.label} ({filterOption.count})
            </FilterButton>
          ))}
        </FilterButtons>

        {loading ? (
          <LoadingSpinner
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading photos... 📸
          </LoadingSpinner>
        ) : filteredImages.length === 0 ? (
          <LoadingSpinner
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No photos found yet. Check back after adding some images to your Contentful entries! 🏝️
          </LoadingSpinner>
        ) : (
          <ImageGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <ImageCard
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setLightboxImage(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    onError={(e) => {
                      console.log('Failed to load image:', image.url);
                      e.target.style.display = 'none';
                    }}
                  />
                  <ImageInfo>
                    <ImageSource>{image.sourceName}</ImageSource>
                    <ImageTitle>{image.title}</ImageTitle>
                    <ImageDescription>{image.description}</ImageDescription>
                  </ImageInfo>
                </ImageCard>
              ))}
            </AnimatePresence>
          </ImageGrid>
        )}
      </GalleryContent>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <CloseButton onClick={() => setLightboxImage(null)}>
              ×
            </CloseButton>
            <LightboxImage
              src={lightboxImage.url}
              alt={lightboxImage.alt}
              onClick={(e) => e.stopPropagation()}
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
};

export default PhotoGallery; 