import { useState, useEffect } from 'react';
import { contentfulClient } from '../config/contentful';

export const useContentful = (contentType, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await contentfulClient.getEntries({
          content_type: contentType,
          include: 3, // Reduced from 10 to be safer
          ...options,
        });
        
        console.log('Fetched entries for content type:', contentType);
        console.log('Number of entries:', response.items.length);
        if (response.items.length > 0 && response.items[0].fields.featuredImage) {
          console.log('Sample featured image:', response.items[0].fields.featuredImage);
          console.log('Sample featured image keys:', Object.keys(response.items[0].fields.featuredImage));
        }
        
        setData(response.items);
        setError(null);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType]);

  return { data, error, loading };
};

export const useSingleEntry = (entryId) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        console.log('Fetching single entry with ID:', entryId);
        
        // Try using getEntries with sys.id filter to get better asset resolution
        const response = await contentfulClient.getEntries({
          'sys.id': entryId,
          include: 3,
          limit: 1
        });
        
        if (response.items && response.items.length > 0) {
          const entry = response.items[0];
          console.log('Fetched entry via getEntries:', entry);
          console.log('Entry fields:', entry.fields);
          
          // Check if featuredImage exists and log its structure
          if (entry.fields.featuredImage) {
            console.log('Featured image object:', entry.fields.featuredImage);
            console.log('Featured image keys:', Object.keys(entry.fields.featuredImage));
            console.log('Featured image constructor:', entry.fields.featuredImage.constructor.name);
            
            // Check if it has sys property
            if (entry.fields.featuredImage.sys) {
              console.log('Featured image sys:', entry.fields.featuredImage.sys);
            }
          }
          
          setData(entry);
          setError(null);
        } else {
          // Fallback to getEntry if getEntries doesn't work
          console.log('No items found with getEntries, trying getEntry...');
          const entry = await contentfulClient.getEntry(entryId, {
            include: 3
          });
          console.log('Fetched entry via getEntry fallback:', entry);
          setData(entry);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching single entry:', err);
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (entryId) {
      fetchEntry();
    } else {
      setLoading(false);
    }
  }, [entryId]);

  return { data, error, loading };
}; 