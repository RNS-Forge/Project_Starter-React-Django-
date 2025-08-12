# React-Django Authentication System

A complete authentication system with React frontend and Django backend featuring email verification, password reset, and comprehensive security features.

## Features

### Authentication Features
- ✅ User Registration with email verification
- ✅ User Login with email verification check
- ✅ Email verification via activation link
- ✅ Forgot password functionality
- ✅ Password reset via secure token
- ✅ Resend verification email
- ✅ Secure JWT token authentication
- ✅ Protected routes
- ✅ User profile management

### Security Features
- ✅ Strong password validation (uppercase, lowercase, numbers, special characters)
- ✅ Email format validation
- ✅ Account lockout after failed login attempts
- ✅ Secure password hashing with salt
- ✅ CSRF protection
- ✅ CORS configuration
- ✅ JWT token expiration
- ✅ Secure email token generation

### UI/UX Features
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Form validation with real-time feedback
- ✅ Success/error notifications
- ✅ Professional email templates
- ✅ Accessible forms and components

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- MongoDB with PyMongo
- JWT Authentication
- SMTP Email Backend
- Python-dotenv for environment variables

### Frontend
- React 18
- TypeScript
- React Router DOM
- Axios for API calls
- Tailwind CSS
- Vite as build tool

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment variables are already configured in `.env`:**
   - Email credentials: `coesnsihub@gmail.com`
   - Email password: `drwe hiwf guea vsmc`
   - SMTP settings for Gmail
   - JWT secret key
   - Password salt
   - Frontend URL for email links

4. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```
   Server will run on: http://127.0.0.1:8000/

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Server will run on: http://localhost:5173/

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/logout/` | User logout |
| POST | `/api/auth/verify-email/` | Verify email with token |
| POST | `/api/auth/resend-verification/` | Resend verification email |
| POST | `/api/auth/forgot-password/` | Send password reset email |
| POST | `/api/auth/reset-password/` | Reset password with token |
| GET | `/api/auth/profile/` | Get user profile (protected) |

## Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect to `/home` | Root redirect |
| `/login` | Login | User login page |
| `/register` | Register | User registration page |
| `/forgot-password` | ForgotPassword | Password reset request |
| `/reset-password/:token` | ResetPassword | Password reset form |
| `/verify-email/:token` | VerifyEmail | Email verification |
| `/home` | Home | Protected dashboard |

## Email Templates

The system includes professional HTML email templates for:

1. **Email Verification**
   - Welcome message
   - Verification link button
   - 24-hour expiration notice
   - Plain text fallback

2. **Password Reset**
   - Reset request confirmation
   - Secure reset link button
   - 1-hour expiration notice
   - Plain text fallback

## Security Implementation

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Account Security
- Account lockout after 5 failed login attempts
- Password hashing with SHA-256 and salt
- JWT tokens with 7-day expiration
- Email verification required before login
- Secure token generation for email links

### Email Security
- SMTP over TLS encryption
- Secure token-based verification
- Time-limited verification tokens
- No sensitive data in email content

## Usage Examples

### Registration Flow
1. User fills registration form
2. System validates input and creates user (inactive)
3. Verification email sent with activation link
4. User clicks verification link
5. Account activated and user logged in

### Login Flow
1. User enters email/password
2. System validates credentials
3. Checks if email is verified
4. Issues JWT token on success
5. Redirects to dashboard

### Forgot Password Flow
1. User enters email address
2. System sends reset email (if email exists)
3. User clicks reset link in email
4. User enters new password
5. Password updated and user can login

### Error Handling
- Comprehensive form validation
- Clear error messages
- Loading states for async operations
- Graceful handling of network errors
- User-friendly error notifications

## Environment Variables

The `.env` file contains all necessary configuration:

```env
# Email Configuration
EMAIL_HOST_USER=coesnsihub@gmail.com
EMAIL_HOST_PASSWORD=drwe hiwf guea vsmc
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True

# Security
JWT_SECRET_KEY=your-secret-key
PASSWORD_SALT=secure-salt-value

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Testing the System

1. **Registration Test:**
   - Go to http://localhost:5173/register
   - Fill out the form with valid data
   - Check email for verification link
   - Click verification link to activate account

2. **Login Test:**
   - Go to http://localhost:5173/login
   - Enter verified account credentials
   - Should redirect to dashboard

3. **Password Reset Test:**
   - Go to http://localhost:5173/forgot-password
   - Enter registered email
   - Check email for reset link
   - Click link and set new password

## Production Considerations

1. **Security:**
   - Use environment variables for secrets
   - Enable HTTPS in production
   - Use strong JWT secret keys
   - Implement rate limiting
   - Add CAPTCHA for forms

2. **Email:**
   - Use production email service (SendGrid, AWS SES)
   - Configure proper DNS records (SPF, DKIM)
   - Monitor email delivery rates

3. **Database:**
   - Use production MongoDB cluster
   - Implement proper backup strategy
   - Monitor database performance

4. **Frontend:**
   - Build for production with `npm run build`
   - Use CDN for static assets
   - Implement proper error boundaries

## Support

For issues or questions:
1. Check the browser console for errors
2. Check Django server logs
3. Verify email configuration
4. Ensure MongoDB connection is working
5. Check network connectivity between frontend/backend

## License

This project is licensed under the MIT License.