# Review and Rating System Documentation

## Overview

The Review and Rating System for Durga Salon provides comprehensive customer feedback functionality including star ratings, detailed reviews, category ratings, photo uploads, moderation, and analytics.

## Features

### Customer Features
- ⭐ 5-star rating system
- 📝 Detailed review writing with titles and descriptions
- 🏷️ Category-specific ratings (cleanliness, service, staff, value, atmosphere)
- 📸 Photo upload support with captions
- 👤 Anonymous review option
- 👍 Helpful/Not helpful voting
- 🚩 Review reporting
- 📱 Responsive design for all devices

### Business Features
- 📊 Comprehensive review analytics and statistics
- 🔍 Advanced filtering and sorting
- 🛡️ Review moderation system
- 💬 Salon response capability
- 📈 Rating distribution analysis
- 🏆 Category performance tracking
- 📧 Email notifications for new reviews

### Technical Features
- 🔐 JWT authentication integration
- 📄 Pagination support
- 🔍 Full-text search capabilities
- 🏷️ Automatic tag generation
- 📊 Real-time statistics
- 🎨 Modern, responsive UI
- ⚡ Optimized database queries

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- JWT authentication system

### Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Database Setup**
   The Review model will be automatically created when the server starts.

3. **Environment Variables**
   Ensure your `.env` file includes:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start Server**
   ```bash
   npm start
   ```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get All Reviews
```http
GET /api/reviews
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Reviews per page (default: 10)
- `rating` (number): Filter by rating (1-5)
- `service` (string): Filter by service type
- `status` (string): Filter by status (default: 'approved')
- `sort` (string): Sort field (default: 'createdAt')
- `order` (string): Sort order ('asc' or 'desc', default: 'desc')

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": "review_id",
      "rating": 5,
      "title": "Amazing experience!",
      "review": "The service was excellent...",
      "service": "haircut",
      "stylist": "Sarah",
      "categories": {
        "cleanliness": 5,
        "service": 5,
        "staff": 4,
        "value": 4,
        "atmosphere": 5
      },
      "photos": [],
      "displayName": "John Doe",
      "isVerified": true,
      "helpfulCount": 3,
      "response": null,
      "createdAt": "2024-01-15T10:30:00Z",
      "appointment": {
        "date": "2024-01-10",
        "service": "haircut"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Review Statistics
```http
GET /api/reviews/stats
```

**Query Parameters:**
- `service` (string): Filter statistics by service type

**Response:**
```json
{
  "success": true,
  "stats": {
    "averageRating": 4.2,
    "totalReviews": 150,
    "ratingDistribution": {
      "1": 5,
      "2": 8,
      "3": 15,
      "4": 45,
      "5": 77
    },
    "categoryAverages": {
      "cleanliness": 4.3,
      "service": 4.1,
      "staff": 4.4,
      "value": 3.9,
      "atmosphere": 4.2
    }
  }
}
```

#### Get Recent Reviews
```http
GET /api/reviews/recent
```

**Query Parameters:**
- `limit` (number): Number of reviews (default: 5)

#### Get Top Helpful Reviews
```http
GET /api/reviews/top-helpful
```

**Query Parameters:**
- `limit` (number): Number of reviews (default: 5)

#### Get Single Review
```http
GET /api/reviews/:reviewId
```

### Authenticated Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "appointmentId": "appointment_id",
  "rating": 5,
  "title": "Amazing experience!",
  "review": "The service was excellent and the staff was very friendly.",
  "stylist": "Sarah",
  "categories": {
    "cleanliness": 5,
    "service": 5,
    "staff": 4,
    "value": 4,
    "atmosphere": 5
  },
  "photos": [
    {
      "url": "https://example.com/photo1.jpg",
      "caption": "My new haircut"
    }
  ],
  "isAnonymous": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "review": {
    "id": "review_id",
    "rating": 5,
    "title": "Amazing experience!",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Review
```http
PUT /api/reviews/:reviewId
Authorization: Bearer <jwt_token>
```

#### Delete Review
```http
DELETE /api/reviews/:reviewId
Authorization: Bearer <jwt_token>
```

#### Get User's Reviews
```http
GET /api/reviews/user/reviews
Authorization: Bearer <jwt_token>
```

#### Mark Review as Helpful
```http
POST /api/reviews/:reviewId/helpful
Authorization: Bearer <jwt_token>
```

#### Report Review
```http
POST /api/reviews/:reviewId/report
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

### Admin Endpoints

#### Get Pending Reviews (Moderation)
```http
GET /api/reviews/admin/pending
Authorization: Bearer <jwt_token>
```

#### Moderate Review
```http
POST /api/reviews/admin/:reviewId/moderate
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "action": "approve",
  "notes": "Review meets guidelines"
}
```

#### Respond to Review
```http
POST /api/reviews/admin/:reviewId/respond
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "message": "Thank you for your feedback! We're glad you enjoyed your experience.",
  "from": "Durga Salon"
}
```

## Frontend Integration

### Components

#### ReviewForm
Modal component for writing reviews with:
- Star rating system
- Category ratings
- Photo upload
- Anonymous option
- Form validation

#### ReviewList
Displays reviews with:
- Filtering and sorting
- Pagination
- Helpful/report actions
- Salon responses

#### ReviewStats
Shows review statistics:
- Average rating
- Rating distribution
- Category averages
- Summary metrics

#### Reviews (Main Component)
Integrates all review functionality:
- State management
- API calls
- Error handling
- Loading states

### Usage Examples

#### Basic Review Display
```jsx
import Reviews from './components/Review/Reviews';

function App() {
  return (
    <div>
      <Reviews />
    </div>
  );
}
```

#### Review Form for Specific Appointment
```jsx
import Reviews from './components/Review/Reviews';

function App() {
  const appointment = {
    _id: 'appointment_id',
    service: 'haircut',
    date: '2024-01-10',
    time: '10:00 AM',
    stylist: 'Sarah'
  };

  return (
    <div>
      <Reviews 
        showReviewForm={true}
        appointmentForReview={appointment}
      />
    </div>
  );
}
```

#### Individual Components
```jsx
import ReviewForm from './components/Review/ReviewForm';
import ReviewList from './components/Review/ReviewList';
import ReviewStats from './components/Review/ReviewStats';

function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);

  return (
    <div>
      <ReviewStats stats={stats} />
      <ReviewList reviews={reviews} />
      <ReviewForm onSuccess={handleReviewSubmit} />
    </div>
  );
}
```

## Database Schema

### Review Model
```javascript
{
  appointmentId: ObjectId,      // Reference to appointment
  userId: ObjectId,            // Reference to user
  customerName: String,        // Customer name
  customerEmail: String,       // Customer email
  rating: Number,              // 1-5 star rating
  title: String,               // Review title
  review: String,              // Review content
  service: String,             // Service type
  stylist: String,             // Stylist name
  categories: {                // Category ratings
    cleanliness: Number,
    service: Number,
    staff: Number,
    value: Number,
    atmosphere: Number
  },
  photos: [{                   // Review photos
    url: String,
    caption: String,
    uploadedAt: Date
  }],
  status: String,              // pending/approved/rejected/flagged
  moderationNotes: String,     // Admin notes
  helpfulCount: Number,        // Helpful votes
  reportedCount: Number,       // Report count
  isVerified: Boolean,         // Verified customer
  isAnonymous: Boolean,        // Anonymous review
  response: {                  // Salon response
    from: String,
    message: String,
    respondedAt: Date
  },
  tags: [String],              // Auto-generated tags
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Review Creation
- Rating: Required, integer 1-5
- Title: Required, max 100 characters
- Review: Required, min 10 characters, max 1000 characters
- Appointment must exist and belong to user
- Appointment must be completed
- User can only review each appointment once

### Category Ratings
- Optional
- Integer 1-5
- Null values allowed

### Photos
- Optional
- Max 5 photos per review
- URL required
- Caption optional, max 100 characters

## Moderation System

### Review Statuses
- **pending**: Awaiting moderation
- **approved**: Published and visible
- **rejected**: Not published
- **flagged**: Reported multiple times

### Moderation Process
1. New reviews start as 'pending'
2. Admin reviews and approves/rejects
3. Rejected reviews include moderation notes
4. Flagged reviews are automatically marked for review

### Auto-moderation Features
- Automatic tag generation
- Spam detection (basic)
- Duplicate review detection
- Report threshold (3 reports = flagged)

## Analytics and Reporting

### Available Metrics
- Average rating
- Total review count
- Rating distribution
- Category averages
- Review trends over time
- Service-specific statistics
- Stylist performance

### Export Capabilities
- CSV export of review data
- PDF reports
- API endpoints for external analytics

## Security Features

### Authentication
- JWT token required for user actions
- Admin role verification for moderation
- User can only modify their own reviews

### Data Protection
- Input sanitization
- XSS prevention
- SQL injection protection
- Rate limiting on review submission

### Privacy
- Anonymous review option
- GDPR compliance considerations
- Data retention policies

## Performance Optimization

### Database Indexes
- appointmentId, userId
- rating, service, status
- createdAt, helpfulCount
- Category rating fields

### Caching
- Review statistics caching
- Popular reviews caching
- CDN for photo storage

### Pagination
- Efficient pagination with skip/limit
- Cursor-based pagination for large datasets

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "rating",
      "message": "Rating must be between 1 and 5"
    }
  ]
}
```

## Testing

### API Testing
```bash
# Test review creation
curl -X POST http://localhost:5001/api/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "appointment_id",
    "rating": 5,
    "title": "Great service",
    "review": "Excellent experience"
  }'

# Test getting reviews
curl http://localhost:5001/api/reviews

# Test getting stats
curl http://localhost:5001/api/reviews/stats
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Production Considerations
- Environment variables configuration
- Database connection optimization
- Image upload service (AWS S3, Cloudinary)
- CDN setup for static assets
- Monitoring and logging
- Backup strategies

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=your_frontend_domain
IMAGE_UPLOAD_SERVICE=aws_s3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
```

## Troubleshooting

### Common Issues

1. **Review not submitting**
   - Check authentication token
   - Verify appointment exists and is completed
   - Ensure all required fields are provided

2. **Photos not uploading**
   - Check file size limits
   - Verify image format (jpg, png, gif)
   - Ensure upload service is configured

3. **Statistics not updating**
   - Check database indexes
   - Verify aggregation queries
   - Clear cache if using

4. **Moderation not working**
   - Verify admin permissions
   - Check review status values
   - Ensure moderation endpoints are accessible

### Debug Mode
Enable debug logging:
```javascript
// In server.js
app.use(morgan('dev'));
console.log('Review system debug mode enabled');
```

## Support

For technical support or questions about the review system:
- Check the logs for error messages
- Verify API endpoint responses
- Test with Postman or similar tools
- Review database connectivity

## Future Enhancements

### Planned Features
- Review sentiment analysis
- Automated response suggestions
- Advanced spam detection
- Review analytics dashboard
- Email notifications for responses
- Social media integration
- Review import/export tools
- Multi-language support

### API Versioning
Future API versions will maintain backward compatibility while adding new features.

---

**Last Updated:** January 2024
**Version:** 1.0.0 