# TaskFlow - Intellisqr

## Tech Stack

### Frontend
- **React 18** (Vite + TypeScript)
- **State Management:** Zustand & TanStack Query
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios

### Backend
- **Node.js & Express** (TypeScript)
- **Database:** MongoDB Atlas (Cloud)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs (Password Hashing), CORS

---

## Features

1. **Authentication System**
   - User Registration & Login.
   - **Forgot Password flow:** For security/demo purposes, the password reset token is logged to the **Backend Console** (Terminal) instead of sending an email.
   - JWT-based protected routes.

2. **Todo Management**
   - Create, Read, Update, and Delete (CRUD) tasks.
   - Mark tasks as Completed/Pending.
   - Data persists in MongoDB Atlas.

3. **Error Handling**
   - Backend errors are logged into a separate MongoDB collection (`errorlogs`) as per requirements.

---

## How to Run Locally

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend folder and add your MongoDB connection string:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login a user |
| POST | `/api/auth/forgot-password` | Initiate password reset (Token logs to console) |
| POST | `/api/auth/reset-password` | Reset password using the token |

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all tasks for logged-in user |
| POST | `/api/todos` | Create a new task |
| PUT | `/api/todos/:id` | Update task (Title or Status) |
| DELETE | `/api/todos/:id` | Delete a task |

---

## Notes

- The password reset token is logged to the backend console for security/demo purposes instead of being sent via email.
- All todo endpoints require JWT authentication.
- Error logs are automatically stored in the `errorlogs` collection in MongoDB.