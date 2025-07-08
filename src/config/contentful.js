import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

export const contentfulClient = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

// Create management client for adding subscribers
export const managementClient = process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN 
  ? createManagementClient({
      accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN,
    })
  : null;

export const contentTypes = {
  trip: 'trip',
  blogPost: 'blogPost',
  cabinLife: 'cabinLife',
  emailSubscriber: 'emailSubscriber', // New content type for email subscribers
};

// Function to save email subscriber to Contentful
export const saveEmailSubscriber = async (email) => {
  if (!managementClient) {
    throw new Error('Management client not available - check REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN');
  }

  try {
    const space = await managementClient.getSpace(process.env.REACT_APP_CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Create new subscriber entry
    const entry = await environment.createEntry('emailSubscriber', {
      fields: {
        email: { 'en-US': email },
        subscribedAt: { 'en-US': new Date().toISOString() },
        status: { 'en-US': 'active' }
      }
    });

    // Publish the entry
    await entry.publish();
    
    return entry;
  } catch (error) {
    console.error('Failed to save subscriber to Contentful:', error);
    throw error;
  }
};

// Function to check if email already exists
export const checkEmailExists = async (email) => {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'emailSubscriber',
      'fields.email': email,
      limit: 1
    });
    
    return response.items.length > 0;
  } catch (error) {
    console.error('Failed to check email existence:', error);
    return false;
  }
};

// Helper function to format date ranges
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const options = { 
    month: 'short', 
    day: 'numeric',
    year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  };
  
  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options);
  }
  
  // If same month, show "Sep 15-17, 2024"
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.getDate()}, ${start.getFullYear()}`;
  }
  
  // Different months: "Sep 15 - Oct 2, 2024"
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

// Helper function to check if a trip is currently happening
export const isTripCurrent = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;
  
  // Set time to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tripStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const tripEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  return today >= tripStart && today <= tripEnd;
};

 