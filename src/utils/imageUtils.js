import React from 'react';
import styled from 'styled-components';

// Styled components for image display
const SingleImage = styled.img`
  width: 100%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 10px;
  margin: 1rem 0;
  background: #f8f9fa;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    max-height: 400px;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 10px;
  background: #f8f9fa;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

// Helper function to get image URL from Contentful image object
export const getImageUrl = (image) => {
  if (!image) return null;
  
  // Handle array case - take first image
  if (Array.isArray(image) && image.length > 0) {
    image = image[0];
  }
  
  // Handle Contentful image object
  if (image.fields && image.fields.file && image.fields.file.url) {
    const url = image.fields.file.url;
    return url.startsWith('//') ? `https:${url}` : url;
  }
  
  // Handle direct URL
  if (typeof image === 'string') {
    return image.startsWith('//') ? `https:${image}` : image;
  }
  
  // Handle nested file structure
  if (image.file && image.file.url) {
    const url = image.file.url;
    return url.startsWith('//') ? `https:${url}` : url;
  }
  
  return null;
};

// Helper function to get all image URLs from various field types
export const getAllImageUrls = (fields) => {
  if (!fields) return [];
  
  const allImages = [];
  
  // Collect from featuredImage field
  if (fields.featuredImage) {
    const images = Array.isArray(fields.featuredImage) ? fields.featuredImage : [fields.featuredImage];
    allImages.push(...images);
  }
  
  // Collect from images field
  if (fields.images) {
    const images = Array.isArray(fields.images) ? fields.images : [fields.images];
    allImages.push(...images);
  }
  
  // Collect from additionalImages field
  if (fields.additionalImages) {
    const images = Array.isArray(fields.additionalImages) ? fields.additionalImages : [fields.additionalImages];
    allImages.push(...images);
  }
  
  // Convert to URLs and filter out nulls
  return allImages
    .map(image => getImageUrl(image))
    .filter(url => url !== null);
};

// Helper function to get image alt text
export const getImageAlt = (image, fallback = 'Image') => {
  if (!image) return fallback;
  
  // Handle array case
  if (Array.isArray(image) && image.length > 0) {
    image = image[0];
  }
  
  if (image.fields && image.fields.title) {
    return image.fields.title;
  }
  
  if (image.fields && image.fields.description) {
    return image.fields.description;
  }
  
  if (image.title) {
    return image.title;
  }
  
  return fallback;
};

// Component to render image gallery
export const ImageGalleryComponent = ({ images, altPrefix = 'Image' }) => {
  const imageUrls = Array.isArray(images) ? getAllImageUrls({ images }) : getAllImageUrls(images);
  
  if (imageUrls.length === 0) return null;
  
  if (imageUrls.length === 1) {
    return (
      <SingleImage
        src={imageUrls[0]}
        alt={`${altPrefix} 1`}
        onError={(e) => {
          e.target.style.display = 'none';
          console.error('Failed to load image:', imageUrls[0]);
        }}
      />
    );
  }
  
  return (
    <ImageGallery>
      {imageUrls.map((url, index) => (
        <GalleryImage
          key={index}
          src={url}
          alt={`${altPrefix} ${index + 1}`}
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load image:', url);
          }}
        />
      ))}
    </ImageGallery>
  );
}; 