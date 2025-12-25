# ChargerBNB - Complete Project Documentation

**Project:** EV Charging Marketplace Platform  
**Team:** Diwakar Patel (2306411530012) & Aditya Dubey (2306411530002)  
**Live:** https://chargerbnb-ev.netlify.app  
**API:** https://chargerbnb-fullstack.onrender.com  
**GitHub:** https://github.com/diwakar453t/chargerbnb-fullstack

---

## Quick Start Guide

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Local Setup (5 Minutes)

```bash
# Clone repository
git clone https://github.com/diwakar453t/chargerbnb-fullstack.git
cd chargerbnb-fullstack

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev

# Frontend setup (new terminal)
cd frontend-react
npm install
cp .env.example .env
# Edit REACT_APP_API_URL=http://localhost:5000/api
npm start
```

**Access:** http://localhost:3000

---

## Project Overview

ChargerBNB is a peer-to-peer marketplace connecting EV owners with charging station providers. Think "Airbnb for EV charging stations."

**Key Features:**
- 🔐 Secure authentication with government ID verification
- ⚡ Comprehensive charger listing (30+ specification fields)
- 📍 Location-based search with distance calculation
- 💰 Flexible pricing (hourly, per kWh, peak hours)
- 📊 Real-time dashboard analytics
- 🏠 Amenities tracking (WiFi, food, restrooms, games, security)

---

## Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Material-UI v5
- Axios for API calls
- Context API for state

**Backend:**
- Node.js + Express + TypeScript
- Sequelize ORM
- PostgreSQL database
- JWT authentication
- Nodemailer for OTP

**Deployment:**
- Frontend: Netlify
- Backend + DB: Render
- CI/CD: GitHub auto-deploy

### System Architecture

```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │ HTTPS
┌────────▼─────────────────┐
│  React App (Netlify)     │
│  - Material-UI           │
│  - JWT Token Storage     │
└────────┬─────────────────┘
         │ REST API
┌────────▼──────────────────┐
│  Express Server (Render)  │
│  - Auth Middleware        │
│  - Sequelize ORM          │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│  PostgreSQL (Render)      │
│  - Users, Chargers        │
│  - Bookings, Reviews      │
└───────────────────────────┘
```

---

## Database Schema

### Core Tables

**users**
- id, email, password (hashed)
- firstName, lastName, phoneNumber
- role (USER/HOST/ADMIN)
- aadhaarNumber, panNumber (for hosts)
- address, city, state, pincode

**chargers**
- id, hostId (FK)
- title, description, chargerType
- powerRating, chargingSpeed, numPorts
- pricePerHour, pricePerKWh
- address, city, state, latitude, longitude
- amenities (JSONB), images (ARRAY)
- isAvailable, isApproved

**bookings**
- id, userId (FK), chargerId (FK)
- startTime, endTime, totalCost
- status, paymentStatus

---

## API Documentation

### Authentication

**POST /api/auth/signup**
```json
{
  "email": "user@example.com",
  "password": "Test@12345",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "role": "USER"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "Test@12345"
}
```

Response:
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { "id": 1, "email": "...", "role": "USER" }
}
```

### Chargers

**POST /api/chargers** (HOST only)
```json
{
  "title": "Fast Charger - Mumbai",
  "chargerType": "Type-2",
  "powerRating": 7,
  "pricePerHour": 100,
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "latitude": "19.0760",
  "longitude": "72.8777",
  "amenities": {
    "food": true,
    "wifi": true,
    "available24x7": true
  }
}
```

**GET /api/chargers/public?city=Mumbai**

**GET /api/chargers/my-chargers** (HOST only)

---

## Security Features

### Password Requirements
- Minimum 10 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character (@$!%*?&#)

Example: `MyPass@2024`

### Government ID Validation (Hosts)
- **Aadhaar:** 12 digits, starts with 2-9 (e.g., 234567890123)
- **PAN:** 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)

### Token Security
- Access Token: 24 hours
- Refresh Token: 7 days
- bcrypt hashing (10 salt rounds)
- JWT with strong secret

---

## Deployment Guide

### Frontend (Netlify)

1. **Connect GitHub**
   - Login to Netlify → New Site → Import from Git
   - Select repository

2. **Build Settings**
   ```
   Build command: cd frontend-react && npm run build
   Publish directory: frontend-react/build
   ```

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://chargerbnb-fullstack.onrender.com/api
   ```

4. **Deploy**
   - Automatic deployment on git push

### Backend (Render)

1. **Create Web Service**
   - New → Web Service
   - Connect GitHub repository

2. **Settings**
   ```
   Name: chargerbnb-backend
   Environment: Node
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=<Render PostgreSQL URL>
   JWT_SECRET=<random-strong-secret>
   JWT_REFRESH_SECRET=<random-strong-secret>
   CORS_ORIGIN=https://chargerbnb-ev.netlify.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your-email>
   SMTP_PASSWORD=<app-password>
   ```

4. **Database**
   - New → PostgreSQL
   - Copy DATABASE_URL to backend env vars

---

## Features Implementation

### User Features
✅ Signup/Login with email verification
✅ Search chargers by location
✅ Filter by type, price, amenities
✅ View detailed charger profiles
✅ Book charging sessions
✅ View booking history
✅ Dashboard with statistics
✅ Favorite chargers

### Host Features
✅ Government ID verification
✅ Add charger with full specifications
✅ Set flexible pricing
✅ Manage charger availability
✅ View earnings analytics
✅ Edit/delete chargers
✅ Booking management
✅ Performance dashboard

### Admin Features (Future)
- Approve/reject charger listings
- Manage users
- Platform analytics
- Dispute resolution

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [x] Signup as USER
- [x] Signup as HOST with Aadhaar/PAN
- [x] Login with valid credentials
- [x] Login with invalid credentials (should fail)
- [x] Password reset via OTP

**Charger Management:**
- [x] Add new charger (HOST)
- [x] View charger list
- [x] Edit charger details
- [x] Delete charger
- [x] Search by location

**Dashboard:**
- [x] USER dashboard loads
- [x] HOST dashboard loads
- [x] Stats display correctly
- [x] Booking history shows

### API Testing (Postman)

```bash
# Health check
curl https://chargerbnb-fullstack.onrender.com/health

# Get public chargers
curl https://chargerbnb-fullstack.onrender.com/api/chargers/public

# Login
curl -X POST https://chargerbnb-fullstack.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@12345"}'
```

---

## Troubleshooting

### Common Issues

**1. "Validation error" during signup**
- Check password meets requirements (10+ chars, special chars)
- Ensure email/phone not already registered
- For HOST: verify Aadhaar (12 digits, starts 2-9) and PAN format

**2. "Failed to create charger"**
- Ensure logged in as HOST
- Check all required fields filled
- Verify latitude/longitude format (strings)

**3. Backend not connecting to database**
- Check DATABASE_URL in Render environment
- Ensure database is running
- Check connection limits

**4. CORS errors**
- Verify CORS_ORIGIN matches frontend URL
- Check API_URL in frontend .env

**5. Build fails**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+)
- Review build logs for specific errors

---

## Future Enhancements

### Phase 1 (Next 3 months)
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Image upload for chargers
- [ ] Google Maps integration
- [ ] Real-time availability (WebSockets)
- [ ] Review & rating system

### Phase 2 (6 months)
- [ ] Mobile apps (React Native)
- [ ] AI-based recommendations
- [ ] Route planning integration
- [ ] Dynamic pricing
- [ ] Push notifications

### Phase 3 (1 year)
- [ ] IoT charger integration
- [ ] Corporate fleet management
- [ ] Multi-language support
- [ ] Analytics dashboard (Admin)
- [ ] Subscription plans

---

## Project Structure

```
chargerbnb-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── postgres.ts
│   │   │   └── mongodb.ts
│   │   ├── models/
│   │   │   └── postgres/
│   │   │       ├── User.model.ts
│   │   │       ├── Charger.model.ts
│   │   │       ├── Booking.model.ts
│   │   │       └── OTP.model.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── charger.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   └── otp.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── services/
│   │   │   └── email.service.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend-react/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HostDashboard.tsx
│   │   │   ├── AddCharger.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
│
└── README.md (this file)
```

---

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

```
type: subject

body (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

---

## Team

**Developers:**
- Diwakar Patel - Full Stack Development
- Aditya Dubey - Full Stack Development

**Contact:**
- Email: diwakar453t@gmail.com
- GitHub: https://github.com/diwakar453t

---

## License

This project is developed as an academic project. All rights reserved.

---

## Acknowledgments

- React.js documentation and community
- Material-UI for the component library
- Node.js and Express.js ecosystems
- PostgreSQL and Sequelize teams
- Netlify and Render for hosting platforms
- Ministry of Heavy Industries (FAME India scheme) for EV adoption vision

---

## Changelog

### Version 2.0.0 (Current)
- ✅ Complete dashboard implementation
- ✅ Add Charger form with 30+ fields
- ✅ Government ID verification
- ✅ Location-based search
- ✅ Production deployment
- ✅ Professional UI/UX

### Version 1.0.0
- ✅ Basic authentication
- ✅ Simple charger listing
- ✅ Basic booking system
- ✅ Initial deployment

---

**Last Updated:** December 2024  
**Status:** ✅ Production Ready  
**Version:** 2.0.0-security-enhanced
