import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WaveBackground from './WaveBackground';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--light-blue) 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  padding: 100px 20px 40px;
`;

const AdminPanel = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--navy);
  margin-bottom: 2rem;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(0, 52, 98, 0.1);
  padding-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? 'var(--gradient-ocean)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--navy)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'var(--gradient-ocean)' : 'rgba(0, 52, 98, 0.1)'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid rgba(0, 52, 98, 0.2);
  border-radius: 8px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid rgba(0, 52, 98, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--gradient-ocean);
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemCard = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #ff4444;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('blog-posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [pages, setPages] = useState(() => {
    const savedPages = localStorage.getItem('blog-pages');
    return savedPages ? JSON.parse(savedPages) : [];
  });
  const [socialLinks, setSocialLinks] = useState(() => {
    const savedLinks = localStorage.getItem('social-links');
    return savedLinks ? JSON.parse(savedLinks) : {
      instagram: '',
      facebook: '',
      twitter: ''
    };
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('blog-pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('social-links', JSON.stringify(socialLinks));
  }, [socialLinks]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPost = {
      id: Date.now(),
      title: formData.get('title'),
      date: formData.get('date'),
      content: formData.get('content'),
      tripId: formData.get('tripId'),
      location: formData.get('location')
    };
    setPosts([...posts, newPost]);
    e.target.reset();
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPage = {
      id: Date.now(),
      title: formData.get('title'),
      content: formData.get('content'),
      slug: formData.get('slug')
    };
    setPages([...pages, newPage]);
    e.target.reset();
  };

  const handleSocialLinksSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSocialLinks({
      instagram: formData.get('instagram'),
      facebook: formData.get('facebook'),
      twitter: formData.get('twitter')
    });
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const deletePage = (id) => {
    setPages(pages.filter(page => page.id !== id));
  };

  return (
    <PageContainer>
      <WaveBackground />
      <AdminPanel>
        <Title>Admin Dashboard</Title>
        <TabContainer>
          <Tab 
            active={activeTab === 'posts'} 
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </Tab>
          <Tab 
            active={activeTab === 'pages'} 
            onClick={() => setActiveTab('pages')}
          >
            Pages
          </Tab>
          <Tab 
            active={activeTab === 'social'} 
            onClick={() => setActiveTab('social')}
          >
            Social Links
          </Tab>
        </TabContainer>

        {activeTab === 'posts' && (
          <>
            <Form onSubmit={handlePostSubmit}>
              <Input name="title" placeholder="Post Title" required />
              <Input name="date" type="date" required />
              <Input name="location" placeholder="Location" required />
              <Input name="tripId" placeholder="Trip ID" type="number" required />
              <TextArea name="content" placeholder="Post Content" required />
              <Button type="submit">Add Post</Button>
            </Form>
            <ItemList>
              {posts.map(post => (
                <ItemCard key={post.id}>
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.date} - {post.location}</p>
                  </div>
                  <DeleteButton onClick={() => deletePost(post.id)}>Delete</DeleteButton>
                </ItemCard>
              ))}
            </ItemList>
          </>
        )}

        {activeTab === 'pages' && (
          <>
            <Form onSubmit={handlePageSubmit}>
              <Input name="title" placeholder="Page Title" required />
              <Input name="slug" placeholder="Page Slug (e.g., about, faq)" required />
              <TextArea name="content" placeholder="Page Content" required />
              <Button type="submit">Add Page</Button>
            </Form>
            <ItemList>
              {pages.map(page => (
                <ItemCard key={page.id}>
                  <div>
                    <h3>{page.title}</h3>
                    <p>/{page.slug}</p>
                  </div>
                  <DeleteButton onClick={() => deletePage(page.id)}>Delete</DeleteButton>
                </ItemCard>
              ))}
            </ItemList>
          </>
        )}

        {activeTab === 'social' && (
          <Form onSubmit={handleSocialLinksSubmit}>
            <Input 
              name="instagram" 
              placeholder="Instagram URL" 
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
            />
            <Input 
              name="facebook" 
              placeholder="Facebook URL"
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
            />
            <Input 
              name="twitter" 
              placeholder="Twitter URL"
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
            />
            <Button type="submit">Update Social Links</Button>
          </Form>
        )}
      </AdminPanel>
    </PageContainer>
  );
};

export default Admin; 