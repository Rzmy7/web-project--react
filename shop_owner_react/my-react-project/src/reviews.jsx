import React from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';

// Styled components
const Section = styled.section`
  padding: 2rem;
  scroll-margin-top: 50px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    text-transform: uppercase;
    margin-bottom: 30px;
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 20px;
    justify-content: first baseline;
  }
`;

const ReviewContainer = styled.div`
  border-radius: 12px;
  background-color: white;
  padding: 1rem;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
`;

const InfoTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
`;

const ReviewItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--light-gray);
  border-radius: 8px;
  background-color: white;
  box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: var(--primary-color);
`;

const ReviewDate = styled.span`
  color: var(--dark-gray);
  font-size: 0.9rem;
`;

const ReviewText = styled.p`
  margin: 8px 0 0 0;
  line-height: 1.5;
`;

const NoReviewsMessage = styled.p`
  color: var(--dark-gray);
  font-style: italic;
`;

const RatingOverview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--light-gray);
`;

const RatingNumber = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const StarFallback = styled.span`
  font-size: 20px;
  line-height: 20px;
`;

// Reviews Component
const Reviews = ({ rating = 4.5, reviews = [], totalReviews = 3 }) => {
  // Sample reviews to display when no reviews are provided
  const sampleReviews = [
    {
      id: 1,
      userName: 'John Doe',
      rating: 4,
      date: '2025-06-01',
      comment: 'Great product quality and fast delivery!'
    },
    {
      id: 2,
      userName: 'Jane Smith',
      rating: 5,
      date: '2025-06-02',
      comment: 'Excellent service, highly recommend!'
    },
    {
      id: 3,
      userName: 'Alex Johnson',
      rating: 3,
      date: '2025-06-03',
      comment: 'Good product, but shipping took longer than expected.'
    }
  ];

  // Use provided reviews if available, otherwise use sample reviews
  const displayReviews = Array.isArray(reviews) && reviews.length > 0 ? reviews : sampleReviews;

  const renderStars = (rating) => {
    try {
      // Try using lucide-react Star component
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={20}
          fill={index < rating ? 'var(--accent-color)' : 'none'}
          color={index < rating ? 'var(--accent-color)' : 'var(--medium-gray)'}
        />
      ));
    } catch (error) {
      // Fallback to Unicode stars if lucide-react fails
      console.warn('lucide-react Star component failed, using fallback:', error);
      return Array.from({ length: 5 }, (_, index) => (
        <StarFallback key={index} style={{ color: index < rating ? 'var(--accent-color)' : 'var(--medium-gray)' }}>
          {index < rating ? '★' : '☆'}
        </StarFallback>
      ));
    }
  };

  return (
    <Section id="reviews">
      <SectionHeader>
        <h1>Reviews</h1>
      </SectionHeader>
      <ReviewContainer>
        <InfoTitle>
          <Star size={20} />
          Reviews & Ratings
        </InfoTitle>
        <RatingOverview>
          <RatingNumber>{rating.toFixed(1)}</RatingNumber>
          <div>
            <StarsContainer>{renderStars(Math.floor(rating))}</StarsContainer>
            <div style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>
              Based on {totalReviews} reviews
            </div>
          </div>
        </RatingOverview>
        {displayReviews.map((review) => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ReviewerName>{review.userName}</ReviewerName>
                <StarsContainer>{renderStars(review.rating)}</StarsContainer>
              </div>
              <ReviewDate>{review.date}</ReviewDate>
            </ReviewHeader>
            <ReviewText>{review.comment}</ReviewText>
          </ReviewItem>
        ))}
      </ReviewContainer>
    </Section>
  );
};

export default Reviews;










// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { Star } from 'lucide-react';
// import io from 'socket.io-client';
// import axios from 'axios';

// // Styled components
// const Section = styled.section`
//   padding: 2rem;
//   scroll-margin-top: 50px;
// `;

// const SectionHeader = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;

//   h1 {
//     font-size: 2.5rem;
//     text-transform: uppercase;
//     margin-bottom: 30px;
//     color: var(--primary-color);
//     border-bottom: 2px solid var(--primary-color);
//     padding-bottom: 20px;
//     justify-content: first baseline;
//   }
// `;

// const ReviewContainer = styled.div`
//   border-radius: 12px;
//   background-color: white;
//   padding: 1rem;
//   box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   margin: 2rem 0;
// `;

// const InfoTitle = styled.h3`
//   color: var(--primary-color);
//   margin: 0 0 16px 0;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   font-size: 1.2rem;
// `;

// const ReviewItem = styled.div`
//   padding: 16px;
//   border-bottom: 1px solid var(--light-gray);
//   border-radius: 8px;
//   background-color: white;
//   box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
//   margin-bottom: 16px;

//   &:last-child {
//     border-bottom: none;
//     margin-bottom: 0;
//   }
// `;

// const ReviewHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 8px;
// `;

// const ReviewerName = styled.span`
//   font-weight: 600;
//   color: var(--primary-color);
// `;

// const ReviewDate = styled.span`
//   color: var(--dark-gray);
//   font-size: 0.9rem;
// `;

// const ReviewText = styled.p`
//   margin: 8px 0 0 0;
//   line-height: 1.5;
// `;

// const NoReviewsMessage = styled.p`
//   color: var(--dark-gray);
//   font-style: italic;
// `;

// const RatingOverview = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
//   margin-bottom: 24px;
//   padding-bottom: 16px;
//   border-bottom: 1px solid var(--light-gray);
// `;

// const RatingNumber = styled.span`
//   font-size: 2rem;
//   font-weight: 700;
//   color: var(--primary-color);
// `;

// const StarsContainer = styled.div`
//   display: flex;
//   gap: 2px;
// `;

// const StarFallback = styled.span`
//   font-size: 20px;
//   line-height: 20px;
// `;

// const ErrorMessage = styled.p`
//   color: var(--error-color, #ff0000);
//   font-style: italic;
//   text-align: center;
// `;

// const LoadingMessage = styled.p`
//   color: var(--dark-gray);
//   font-style: italic;
//   text-align: center;
// `;

// // Reviews Component
// const Reviews = () => {
//   const [rating, setRating] = useState(0);
//   const [reviews, setReviews] = useState([]);
//   const [totalReviews, setTotalReviews] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Initialize Socket.IO
//   useEffect(() => {
//     const socket = io('http://localhost:3001'); // Replace with your backend URL

//     // Listen for new review events
//     socket.on('newReview', (newReview) => {
//       setReviews((prevReviews) => [newReview, ...prevReviews]);
//       setTotalReviews((prev) => prev + 1);
//       // Recalculate average rating
//       setRating((prevRating) => {
//         const totalRating = prevReviews.reduce((sum, r) => sum + r.rating, 0) + newReview.rating;
//         return totalRating / (prevReviews.length + 1);
//       });
//     });

//     // Listen for review updates
//     socket.on('updateReview', (updatedReview) => {
//       setReviews((prevReviews) =>
//         prevReviews.map((review) =>
//           review.id === updatedReview.id ? updatedReview : review
//         )
//       );
//       // Recalculate average rating
//       setRating((prevRating) => {
//         const totalRating = reviews
//           .map((r) => (r.id === updatedReview.id ? updatedReview.rating : r.rating))
//           .reduce((sum, r) => sum + r, 0);
//         return totalRating / reviews.length;
//       });
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, [reviews]);

//   // Fetch initial reviews from API
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:3001/api/reviews'); // Replace with your API endpoint
//         const data = response.data;
//         setReviews(data.reviews || []);
//         setRating(data.averageRating || 0);
//         setTotalReviews(data.totalReviews || 0);
//         setError(null);
//       } catch (err) {
//         setError('Failed to load reviews. Please try again later.');
//         console.error('Error fetching reviews:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   const renderStars = (rating) => {
//     try {
//       return Array.from({ length: 5 }, (_, index) => (
//         <Star
//           key={index}
//           size={20}
//           fill={index < rating ? 'var(--accent-color)' : 'none'}
//           color={index < rating ? 'var(--accent-color)' : 'var(--medium-gray)'}
//         />
//       ));
//     } catch (error) {
//       console.warn('lucide-react Star component failed, using fallback:', error);
//       return Array.from({ length: 5 }, (_, index) => (
//         <StarFallback key={index} style={{ color: index < rating ? 'var(--accent-color)' : 'var(--medium-gray)' }}>
//           {index < rating ? '★' : '☆'}
//         </StarFallback>
//       ));
//     }
//   };

//   return (
//     <Section id="reviews">
//       <SectionHeader>
//         <h1>Reviews</h1>
//       </SectionHeader>
//       <ReviewContainer>
//         <InfoTitle>
//           <Star size={20} />
//           Reviews & Ratings
//         </InfoTitle>
//         {loading && <LoadingMessage>Loading reviews...</LoadingMessage>}
//         {error && <ErrorMessage>{error}</ErrorMessage>}
//         {!loading && !error && (
//           <>
//             <RatingOverview>
//               <RatingNumber>{rating.toFixed(1)}</RatingNumber>
//               <div>
//                 <StarsContainer>{renderStars(Math.floor(rating))}</StarsContainer>
//                 <div style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>
//                   Based on {totalReviews} reviews
//                 </div>
//               </div>
//             </RatingOverview>
//             {reviews.length === 0 ? (
//               <NoReviewsMessage>No reviews available.</NoReviewsMessage>
//             ) : (
//               reviews.map((review) => (
//                 <ReviewItem key={review.id}>
//                   <ReviewHeader>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                       <ReviewerName>{review.userName}</ReviewerName>
//                       <StarsContainer>{renderStars(review.rating)}</StarsContainer>
//                     </div>
//                     <ReviewDate>{review.date}</ReviewDate>
//                   </ReviewHeader>
//                   <ReviewText>{review.comment}</ReviewText>
//                 </ReviewItem>
//               ))
//             )}
//           </>
//         )}
//       </ReviewContainer>
//     </Section>
//   );
// };

// export default Reviews;