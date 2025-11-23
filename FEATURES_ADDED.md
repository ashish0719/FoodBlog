# Features Added to Food Recipe Application

This document summarizes all the new features and improvements added to the Food Recipe application.

## ✅ Completed Features

### 1. Environment Variables Setup
- **Backend**: All configuration now uses environment variables
- **Frontend**: Created `src/config/api.js` to centralize API base URL
- **All localhost URLs replaced** with environment variable references
- Created `ENV_SETUP.md` with detailed setup instructions

**Files Modified:**
- `Frontend/Food-blog-Web/src/config/api.js` (new)
- All frontend components updated to use `API_BASE_URL`
- Backend already uses `process.env` for configuration

### 2. Follow/Unfollow Feature
Users can now follow and unfollow other users.

**Backend:**
- Updated `User` model with `followers` and `following` arrays
- Created `backend/models/message.js` (for chat feature)
- Created `backend/controller/follow.js` with:
  - `followUser` - Follow a user
  - `unfollowUser` - Unfollow a user
  - `getFollowers` - Get list of followers
  - `getFollowing` - Get list of following
  - `getAllUsers` - Get all users with follow status
- Created `backend/routes/follow.js`
- Added route in `backend/app.js`: `/user`

**Frontend:**
- Created `Frontend/Food-blog-Web/src/pages/Users.jsx` - User discovery page
- Created `Frontend/Food-blog-Web/src/pages/Users.css` - Styling
- Added "Users" link in Navbar (visible when logged in)
- Route: `/users`

**Features:**
- View all users
- See follower/following counts
- Follow/Unfollow buttons
- Direct chat button from user card

### 3. Chat Feature
Real-time messaging between users.

**Backend:**
- Created `backend/models/message.js` - Message schema
- Created `backend/controller/message.js` with:
  - `sendMessage` - Send a message
  - `getMessages` - Get conversation between two users
  - `getConversations` - Get all conversations for current user
- Created `backend/routes/message.js`
- Added route in `backend/app.js`: `/message`

**Frontend:**
- Created `Frontend/Food-blog-Web/src/pages/Chat.jsx` - Chat interface
- Created `Frontend/Food-blog-Web/src/pages/Chat.css` - Styling
- Route: `/chat/:userId`
- Features:
  - Real-time message display (polls every 2 seconds)
  - Message bubbles (own vs other)
  - Timestamps
  - Auto-scroll to latest message
  - Mark messages as read

### 4. Improved Blog Feature
Enhanced blog functionality with create, view, and detail pages.

**Backend:**
- Updated `backend/controller/blog.js`:
  - Improved `createBlog` - Better tag parsing
  - Added `getBlogById` - Get single blog with author details
  - Improved `getAllBlogs` - Sorted by date
- Updated `backend/routes/blog.js`:
  - Fixed image upload path to use `./public/images`
  - Added route for single blog: `GET /blog/:id`

**Frontend:**
- Created `Frontend/Food-blog-Web/src/pages/CreateBlog.jsx` - Blog creation form
- Created `Frontend/Food-blog-Web/src/pages/CreateBlog.css` - Styling
- Created `Frontend/Food-blog-Web/src/pages/BlogDetail.jsx` - Blog detail page
- Created `Frontend/Food-blog-Web/src/pages/BlogDetail.css` - Styling
- Updated `Frontend/Food-blog-Web/src/pages/blogingCard.jsx`:
  - Added "Create Blog" button
  - Clickable blog cards that navigate to detail page
  - Better author display with profile icons
  - Improved layout and styling
- Routes:
  - `/blogs` - List all blogs
  - `/blogs/create` - Create new blog
  - `/blogs/:id` - View blog detail

**Features:**
- Create blogs with title, content, tags, and cover image
- View all blogs in a grid layout
- Click on blog to see full content
- Author information with profile pictures
- Tag display
- Responsive design

## 📁 New Files Created

### Backend
- `backend/models/message.js`
- `backend/controller/follow.js`
- `backend/controller/message.js`
- `backend/routes/follow.js`
- `backend/routes/message.js`

### Frontend
- `Frontend/Food-blog-Web/src/config/api.js`
- `Frontend/Food-blog-Web/src/pages/Users.jsx`
- `Frontend/Food-blog-Web/src/pages/Users.css`
- `Frontend/Food-blog-Web/src/pages/Chat.jsx`
- `Frontend/Food-blog-Web/src/pages/Chat.css`
- `Frontend/Food-blog-Web/src/pages/CreateBlog.jsx`
- `Frontend/Food-blog-Web/src/pages/CreateBlog.css`
- `Frontend/Food-blog-Web/src/pages/BlogDetail.jsx`
- `Frontend/Food-blog-Web/src/pages/BlogDetail.css`

### Documentation
- `ENV_SETUP.md` - Environment variables setup guide
- `FEATURES_ADDED.md` - This file

## 🔧 Modified Files

### Backend
- `backend/models/user.js` - Added followers/following arrays
- `backend/app.js` - Added new routes
- `backend/controller/blog.js` - Improved blog functionality
- `backend/routes/blog.js` - Fixed image path, added detail route

### Frontend
- `Frontend/Food-blog-Web/src/App.jsx` - Added new routes
- `Frontend/Food-blog-Web/src/components/Navbar.jsx` - Added Users link
- `Frontend/Food-blog-Web/src/pages/blogingCard.jsx` - Improved UI
- `Frontend/Food-blog-Web/src/App.css` - Added blog styles
- All component files - Updated to use `API_BASE_URL` instead of hardcoded localhost

## 🚀 How to Use

### Follow/Unfollow
1. Navigate to `/users` (visible in navbar when logged in)
2. Browse all users
3. Click "Follow" to follow a user
4. Click "Unfollow" to unfollow
5. Click "Chat" to start a conversation

### Chat
1. Go to `/users` and click "Chat" on any user
2. Or navigate directly to `/chat/:userId`
3. Type messages and click "Send"
4. Messages auto-refresh every 2 seconds

### Create Blog
1. Navigate to `/blogs`
2. Click "+ Create Blog" button (visible when logged in)
3. Fill in title, content, tags (comma-separated), and optionally upload a cover image
4. Click "Publish Blog"
5. View your blog in the blogs list

### View Blog Details
1. Navigate to `/blogs`
2. Click on any blog card
3. View full blog content with author information

## 🔐 Environment Variables

See `ENV_SETUP.md` for detailed instructions on setting up environment variables for production deployment.

## 📝 Notes

- All API calls now use environment variables for easy production deployment
- Chat feature uses polling (2-second intervals) - can be upgraded to WebSockets for real-time
- Follow/unfollow updates are reflected immediately
- Blog images are stored in `backend/public/images/`
- Profile pictures are stored in `backend/public/profilepics/`

## 🎨 UI Improvements

- Modern, responsive design
- Consistent styling across all new pages
- Better user experience with loading states
- Improved blog card layout with hover effects
- Professional chat interface
- Clean user discovery page


