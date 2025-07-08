# 🌊 Cam Lipp's Ocean Adventures Blog

A stunning React-based travel blog showcasing coastal destinations through beautiful photography and authentic travel stories. Built with modern web technologies for optimal performance and user experience.

## 🚀 Features

- **Personal Travel Blog**: Focused on Cam Lipp's ocean adventures and coastal photography
- **Beautiful Design**: Modern, responsive design with ocean-themed aesthetics
- **Blog Post Navigation**: Individual post pages with routing and related content
- **Newsletter Signup**: Integrated email subscription system
- **Contact Forms**: Working contact form with validation
- **Performance Optimized**: Fast loading with optimized images and animations
- **Mobile Responsive**: Fully responsive design for all devices
- **SEO Ready**: Optimized for search engines

## 🛠️ Technologies Used

- **React 18** - Modern JavaScript framework
- **React Router DOM** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **Date-fns** - Date manipulation utilities
- **Modern CSS** - Grid, Flexbox, Custom Properties
- **Performance Utilities** - Image optimization and lazy loading

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd cam-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🌐 Domain Registration & Hosting Setup

### Step 1: Register Domain with Ionos

#### 1.1 Create Ionos Account
1. Go to [ionos.com](https://www.ionos.com)
2. Click "Sign Up" or "Create Account"
3. Fill in your personal information:
   - Email address
   - Password
   - Contact information (name, address, phone)
4. Verify your email address

#### 1.2 Search and Purchase Domain
1. **Search for Domain:**
   - Use the domain search tool on Ionos homepage
   - Enter your desired domain name (e.g., `camlipp.com`)
   - Check availability and alternatives

2. **Select Domain:**
   - Choose your preferred domain extension (.com, .net, .org, etc.)
   - `.com` is recommended for personal brands
   - Add to cart

3. **Configure Domain Settings:**
   - **Privacy Protection**: Enable WHOIS privacy (recommended)
   - **Auto-renewal**: Enable to prevent accidental expiration
   - **Term**: Choose 1-2 years initially

4. **Complete Purchase:**
   - Review your order
   - Enter payment information
   - Complete the transaction
   - **Important**: Save your login credentials securely

#### 1.3 Access Domain Management
1. Login to [Ionos Control Panel](https://my.ionos.com)
2. Navigate to "Domains & SSL"
3. Click on your newly purchased domain
4. Familiarize yourself with the domain management interface

### Step 2: Prepare Website for Hosting

#### 2.1 Build the Website
```bash
# In your project directory
npm run build
```
This creates a `build` folder with optimized production files.

#### 2.2 Test the Build Locally (Optional)
```bash
# Install serve globally if you haven't
npm install -g serve

# Serve the build folder
serve -s build
```

### Step 3: Deploy to Netlify

#### 3.1 Create Netlify Account
1. Go to [netlify.com](https://www.netlify.com)
2. Click "Sign up" 
3. Choose sign-up method:
   - **Recommended**: Sign up with GitHub (easier for future deployments)
   - Or use email/password

#### 3.2 Deploy Your Site

**Option A: Drag and Drop Deployment**
1. In Netlify dashboard, scroll to "Want to deploy a new site without connecting to Git?"
2. Drag your `build` folder to the deployment area
3. Netlify will automatically deploy and provide a temporary URL
4. Note the temporary URL (e.g., `https://amazing-cupcake-123456.netlify.app`)

**Option B: Git Integration (Recommended for Updates)**
1. **Push to GitHub:**
   ```bash
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create repository on GitHub and push
   git remote add origin https://github.com/yourusername/cam-website.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - In Netlify dashboard, click "Add new site"
   - Choose "Import an existing project"
   - Select "GitHub" and authorize
   - Select your repository
   
3. **Configure Build Settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: 18 (in Environment variables: `NODE_VERSION = 18`)

4. Click "Deploy site"

#### 3.3 Configure Site Settings
1. **Change Site Name:**
   - Go to Site settings > General
   - Click "Change site name"
   - Choose something memorable (e.g., `cam-lipp-blog`)

2. **Set Environment Variables** (if needed):
   - Go to Site settings > Environment variables
   - Add any required environment variables

### Step 4: Connect Custom Domain

#### 4.1 Add Domain to Netlify
1. In your Netlify site dashboard:
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain: `camlipp.com`
   - Click "Verify"

2. **Add www subdomain** (recommended):
   - Click "Add domain alias"
   - Enter: `www.camlipp.com`

#### 4.2 Update DNS Settings in Ionos

1. **Login to Ionos Control Panel:**
   - Go to [my.ionos.com](https://my.ionos.com)
   - Navigate to "Domains & SSL"
   - Click on your domain

2. **Access DNS Management:**
   - Click "Manage DNS" or "DNS settings"
   - You'll see the DNS record management interface

3. **Configure DNS Records:**

   **For Root Domain (camlipp.com):**
   - **Type**: A Record
   - **Host**: @ (or leave blank)
   - **Value**: `75.2.60.5` (Netlify's load balancer IP)
   - **TTL**: 3600 (1 hour)

   **For WWW Subdomain:**
   - **Type**: CNAME
   - **Host**: www
   - **Value**: `your-site-name.netlify.app` (your Netlify URL)
   - **TTL**: 3600

   **Alternative Method (using Netlify DNS):**
   - In Netlify, go to Domain settings
   - Note the Netlify nameservers (e.g., `dns1.p01.nsone.net`)
   - In Ionos, change nameservers to Netlify's nameservers

4. **Save DNS Changes:**
   - Click "Save" or "Apply changes"
   - **Note**: DNS propagation can take 24-48 hours

#### 4.3 Enable HTTPS
1. In Netlify Domain settings:
   - Scroll to "HTTPS"
   - Click "Verify DNS configuration"
   - Once verified, Netlify will automatically provision SSL certificate
   - Enable "Force HTTPS redirect"

### Step 5: Configure Final Settings

#### 5.1 Set Up Redirects (Optional)
Create a `_redirects` file in your `public` folder:
```
# Redirect all traffic to HTTPS and www
http://camlipp.com/* https://www.camlipp.com/:splat 301!
https://camlipp.com/* https://www.camlipp.com/:splat 301!

# Handle React Router
/*    /index.html   200
```

#### 5.2 Add Form Handling
For the contact form to work, add to your `public/index.html`:
```html
<form name="contact" netlify hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <input type="text" name="subject" />
  <textarea name="message"></textarea>
</form>
```

#### 5.3 Set Up Analytics (Optional)
1. **Google Analytics:**
   - Create Google Analytics account
   - Add tracking code to your site
   
2. **Netlify Analytics:**
   - Go to Site settings > Analytics
   - Enable Netlify Analytics (paid feature)

### Step 6: Testing and Verification

#### 6.1 Test Your Domain
1. Wait for DNS propagation (up to 48 hours)
2. Test your domain in an incognito browser:
   - `http://camlipp.com` → should redirect to `https://www.camlipp.com`
   - `https://camlipp.com` → should redirect to `https://www.camlipp.com`
   - `https://www.camlipp.com` → should load your site

#### 6.2 Check SSL Certificate
1. Look for the padlock icon in the browser
2. Click the padlock to verify SSL certificate
3. Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test SSL configuration

#### 6.3 Test Website Functionality
- [ ] Homepage loads correctly
- [ ] Blog posts are accessible
- [ ] Contact form works
- [ ] Newsletter signup works
- [ ] All links work properly
- [ ] Mobile responsiveness
- [ ] Page loading speed

## 🔧 Maintenance and Updates

### Regular Updates
- **Content**: Add new blog posts by updating the blog data
- **Dependencies**: Regularly update npm packages
- **Security**: Monitor for security updates

### Continuous Deployment
With GitHub integration, every push to your main branch automatically deploys to Netlify.

### Monitoring
- Set up Google Search Console
- Monitor site performance with Google PageSpeed Insights
- Check Netlify analytics for traffic insights

## 🆘 Troubleshooting

### Common Issues

**DNS not propagating:**
- Wait up to 48 hours
- Use [DNS Checker](https://dnschecker.org) to monitor propagation
- Clear browser DNS cache

**SSL certificate issues:**
- Ensure DNS is properly configured
- Contact Netlify support if SSL doesn't provision automatically

**Site not updating:**
- Check Netlify deploy logs
- Ensure build command is correct
- Verify environment variables

**Contact form not working:**
- Ensure Netlify form detection is enabled
- Check form has `netlify` attribute
- Verify form name matches

### Support Resources
- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Ionos Support**: Available in your control panel
- **React Documentation**: [reactjs.org](https://reactjs.org)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a personal blog for Cam Lipp. For suggestions or improvements, please reach out directly.

---

**Built with ❤️ for ocean adventures** 🌊 