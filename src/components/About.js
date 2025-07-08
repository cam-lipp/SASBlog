import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import WaveBackground from './WaveBackground';

const AboutContainer = styled.div`
  min-height: 100vh;
  position: relative;
  padding: 7rem 0 2rem; /* Top padding to account for fixed header */

  @media (max-width: 768px) {
    padding: 9rem 0 2rem; /* Extra padding for mobile header */
  }
`;

const AboutContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: var(--navy);
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: var(--navy);
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.8;
`;

const ContentSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--navy);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Paragraph = styled.p`
  color: #333;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  text-align: justify;
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border-left: 4px solid var(--ocean-blue);
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 10px;
  font-style: italic;
  color: var(--navy);
`;

const About = () => {
  useEffect(() => {
    // Simple scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <AboutContainer>
      <WaveBackground />
      <AboutContent>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Cam
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Engineering Student, Runner, Explorer
        </Subtitle>

        <ContentSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>My Journey</SectionTitle>
          <Paragraph>
            Hey there! I'm Cam, a junior electrical engineering student at Santa Clara University. This website is my way of sharing my incredible Semester at Sea adventure with my family, extended family, friends, and everyone else who finds their way here along the journey.
          </Paragraph>
          <Paragraph>
            When I'm not buried in circuit analysis or coding projects, you can find me running around campus, hitting the trails for a good hike, or doing anything social with friends. When I heard about Semester at Sea, I knew it was the perfect opportunity to combine my love for adventure with learning in a completely new way - studying while sailing around the world!
          </Paragraph>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SectionTitle>What You'll Find Here</SectionTitle>
          <Paragraph>
            This website is my way of keeping everyone back home updated on my adventures! You'll find detailed trip reports from the amazing ports we visit, authentic glimpses into cabin life aboard the ship, and honest reflections about what it's really like to live and study at sea.
          </Paragraph>
          <HighlightBox>
            "The world is a book and those who do not travel read only one page." - Saint Augustine
          </HighlightBox>
          <Paragraph>
            Whether you're family checking in on me, friends living vicariously through my adventures, or someone considering Semester at Sea yourself, I hope you'll find something here that makes you smile and maybe inspires your own next adventure.
          </Paragraph>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SectionTitle>Stay Connected</SectionTitle>
          <Paragraph>
            I love hearing from everyone back home! Whether you're family wanting updates, friends missing our adventures together, or someone thinking about doing Semester at Sea yourself, feel free to reach out through my social media or drop me an email.
          </Paragraph>
          <Paragraph>
            Thanks for following along on this incredible journey with me. I can't wait to share all these stories in person when I get back – and who knows, maybe I'll convince some of you to book your own adventure!
          </Paragraph>
          <HighlightBox>
            Want to stay updated? Subscribe below for the latest updates from my Semester at Sea adventure! 🌊
          </HighlightBox>
        </ContentSection>
      </AboutContent>
    </AboutContainer>
  );
};

export default About; 