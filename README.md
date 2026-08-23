# StudyNotion EdTech Platform

A full-stack **MERN EdTech platform** for creating, managing, and selling online courses. StudyNotion enables students to discover and consume high-quality learning content, instructors to build and publish structured courses, and admins to manage categories and platform-level operations.

## Features

- JWT-based authentication with email/password and Google login
- Role-based access control for **Student**, **Instructor**, and **Admin**
- Course lifecycle management (create, edit, structure with sections/subsections, publish flow)
- Course catalog and detailed course pages
- Student enrollment, progress tracking, and protected video learning routes
- Ratings and reviews for courses
- Razorpay payment integration for checkout and payment verification
- Profile management (details, display picture, password, enrolled courses)
- Contact form endpoint for user inquiries

## User Roles & Core Flows

### Student
- Sign up/login, browse catalog, view course details
- Purchase courses via payment flow
- Access enrolled courses and continue content from protected video routes
- Track lecture completion and leave ratings/reviews

### Instructor
- Create and edit courses
- Add/manage sections and subsections
- View instructor dashboard metrics and owned courses

### Admin
- Create and manage course categories
- Govern platform taxonomy and catalog organization

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Redux Toolkit + React Redux
- Tailwind CSS
- Axios
- Chart.js + react-chartjs-2

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Razorpay payments
- Cloudinary media handling
- Nodemailer for transactional emails

## Project Structure

```text
study-notion-edtech/
├── src/                  # React frontend (pages, components, redux, services)
├── public/
├── server/               # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── middlewares/
├── tailwind.config.js
├── package.json          # Frontend scripts + combined dev script
└── README.md
```

## Frontend Routes

### Public Routes
- `/`
- `/catalog/:catalogName`
- `/courses/:courseId`
- `/forgot-password`
- `/update-password/:token`
- `/about`
- `/contact`
- `/verify-email`
- `/login`
- `/signup`

### Protected Dashboard Routes
- `/dashboard/my-profile`
- `/dashboard/settings` *(defined in code as `/dashboard/Settings`, navigated as lowercase in UI)*
- `/dashboard/cart` *(student)*
- `/dashboard/enrolled-courses` *(student)*
- `/dashboard/instructor` *(instructor)*
- `/dashboard/add-course` *(instructor)*
- `/dashboard/my-courses` *(instructor)*
- `/dashboard/edit-course/:courseId` *(instructor)*

### Protected Course Player Route
- `/view-course/:courseId/section/:sectionId/sub-section/:subSectionId` *(student)*

## Backend API Endpoints

Base API prefix in server: `/api/v1`

### Auth/User Routes (`/api/v1/auth`)
- `POST /login`
- `POST /google-login`
- `POST /signup`
- `POST /sendotp`
- `POST /changepassword` *(auth required)*
- `POST /reset-password-token`
- `POST /reset-password`

### Course Routes (`/api/v1/course`)
- `POST /createCourse` *(instructor)*
- `POST /addSection` *(instructor)*
- `POST /updateSection` *(instructor)*
- `POST /deleteSection` *(instructor)*
- `POST /addSubSection` *(instructor)*
- `POST /updateSubSection` *(instructor)*
- `POST /deleteSubSection` *(instructor)*
- `GET /getAllCourses`
- `POST /getCourseDetails`
- `POST /getFullCourseDetails` *(auth required)*
- `POST /editCourse` *(instructor)*
- `GET /getInstructorCourses` *(instructor)*
- `DELETE /deleteCourse`
- `POST /updateCourseProgress` *(student)*
- `GET /get-all-courses`
- `POST /createCategory` *(admin)*
- `GET /showAllCategories`
- `POST /getCategoryPageDetails`
- `POST /createRating` *(student)*
- `GET /getAverageRating`
- `GET /getReviews`

### Payment Routes (`/api/v1/payment`)
- `POST /capturePayment` *(student)*
- `POST /verifyPayment` *(student)*
- `POST /sendPaymentSuccessEmail` *(student)*

### Contact Route (`/api/v1/reach`)
- `POST /contact`

> Note: Profile-related APIs are available under `/api/v1/profile` for account/profile operations.

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB instance
- Razorpay account (for payments)
- Cloudinary account (for media)

### 1) Install dependencies

From repository root:

```bash
npm install
cd server && npm install
```

### 2) Configure environment variables

Create environment files:
- Root frontend: `.env`
- Backend: `server/.env`

See [Environment Variables](#environment-variables) below for placeholders.

### 3) Run the application

From repository root:

```bash
# Frontend only
npm start

# Backend only (runs server/dev script via root)
npm run server

# Frontend + backend concurrently
npm run dev
```

## Environment Variables

Use placeholders below and replace with your real values.

### Frontend (`.env`)

```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_RAZORPAY_KEY=your_razorpay_key_id
```

### Backend (`server/.env`)

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_cloudinary_folder

RAZORPAY_KEY=your_razorpay_key_id
KEY_SECRET=your_razorpay_key_secret

MAIL_HOST=your_smtp_host
MAIL_USER=your_smtp_user
MAIL_PASS=your_smtp_password
```

## Available Scripts

### Root (`package.json`)
- `npm start` – Run frontend (React)
- `npm run build` – Build frontend for production
- `npm test` – Run frontend tests
- `npm run server` – Run backend dev server (`cd server && npm run dev`)
- `npm run dev` – Run frontend and backend together with `concurrently`

### Backend (`server/package.json`)
- `npm run start` – Start backend server with Node
- `npm run dev` – Start backend with Nodemon

## License

This project is licensed under the **MIT License**. See the [`LICENSE`](./LICENSE) file for details.
