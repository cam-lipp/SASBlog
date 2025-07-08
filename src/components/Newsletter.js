import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { saveEmailSubscriber, checkEmailExists } from '../config/contentful';

const NewsletterOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
`;

const NewsletterModal = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h2`
  color: var(--navy, #1A365D);
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--ocean-blue, #2a6f97);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  background: var(--gradient-ocean, linear-gradient(135deg, #2a6f97 0%, #1a4b6e 100%));
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  color: #2ecc71;
  margin-top: 1rem;
`;

const ErrorMessage = styled(motion.div)`
  color: #e74c3c;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const Newsletter = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        setError('This email is already subscribed!');
        setIsLoading(false);
        return;
      }

      // Save email to Contentful
      await saveEmailSubscriber(email);
      
      // Mark that user has seen the newsletter
      sessionStorage.setItem('hasSeenNewsletter', 'true');
      
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        onClose();
        setSubscribed(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
        {isOpen && (
          <NewsletterOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
          <NewsletterModal
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>&times;</CloseButton>
            <Title>Subscribe for Email Notifications</Title>
            <Description>
              Stay updated with my latest adventures and travel stories!
            </Description>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </SubmitButton>
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </ErrorMessage>
              )}
            </Form>
            <AnimatePresence>
              {subscribed && (
                <SuccessMessage
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Thanks for subscribing! 🌊
                </SuccessMessage>
              )}
            </AnimatePresence>
          </NewsletterModal>
        </NewsletterOverlay>
              )}
      </AnimatePresence>
    );
};

export default Newsletter;

/*
Integration Notes:

1. Email Service Setup:
   - Choose between Mailchimp, SendGrid, or custom backend
   - Store API keys in environment variables (.env)
   - Set up email templates for welcome message and updates

2. Backend Integration:
   - Create API endpoint (/api/subscribe)
   - Validate email format
   - Store in database (MongoDB, PostgreSQL, etc.)
   - Handle duplicate subscriptions

3. Email Scheduling:
   - Use a task scheduler (e.g., node-cron, AWS Lambda)
   - Example scheduling code:
     
     // Using node-cron
     const cron = require('node-cron');
     
     // Schedule weekly updates
     cron.schedule('0 9 * * MON', async () => {
       const subscribers = await db.getSubscribers();
       for (const subscriber of subscribers) {
         await sendWeeklyUpdate(subscriber.email);
       }
     });

4. Email Content Management:
   - Store blog posts in CMS (e.g., Strapi, ContentfulAPI)
   - Generate email content from latest posts
   - Include personalization tokens

5. Analytics & Monitoring:
   - Track open rates and click-through rates
   - Monitor bounce rates and unsubscribes
   - Implement retry logic for failed sends
*/ 