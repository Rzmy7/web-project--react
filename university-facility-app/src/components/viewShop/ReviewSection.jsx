import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star } from 'lucide-react';
import AddReviewForm from './AddReviewForm';
import axios from 'axios';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


// Styled components
const ReviewItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid var(--light-gray);

  &:last-child {
    border-bottom: none;
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
  color: var(--primary-color, #2c3e50);
`;

const ReviewDate = styled.span`
  color: var(--dark-gray, #555);
  font-size: 0.9rem;
`;

const ReviewText = styled.p`
  margin: 8px 0 0 0;
  line-height: 1.5;
`;

const NoReviewsMessage = styled.p`
  color: var(--dark-gray, #555);
  font-style: italic;
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h3`
  color: var(--primary-color, #2c3e50);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
`;

const RatingOverview = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--light-gray, #ccc);
`;

const RatingNumber = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color, #2c3e50);
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 15rem;
  overflow-y: auto;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  color: var(--danger, #e74c3c);
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

// ReviewsSection Component
// const ReviewsSection = ({ facilityId = 1}) => {
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [totalReviews, setTotalReviews] = useState(0);
//   const [error, setError] = useState('');
//   const storedUser = localStorage.getItem('user');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   // Fetch reviews and calculate rating
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         console.log(`Fetching reviews for facilityId: ${facilityId}`);
//         const response = await axios.get(`http://127.0.0.1:8001/api/facility/${facilityId}`);
//         console.log('API GET response:', response.data);
//         const fetchedReviews = Array.isArray(response.data) ? response.data : 
//                               response.data.reviews || [];
//         setReviews(fetchedReviews);
//         const totalStars = fetchedReviews.reduce((sum, review) => sum + (Number(review.stars) || 0), 0);
//         const avgRating = fetchedReviews.length > 0 ? (totalStars / fetchedReviews.length).toFixed(1) : 0;
//         setRating(avgRating);
//         setTotalReviews(fetchedReviews.length);
//         setError('');
//       } catch (err) {
//         setError('Failed to fetch reviews. Please try again.');
//         console.error('Error fetching reviews:', err.message, err.response?.data);
//       }
//     };

//     fetchReviews();
//   }, [facilityId]);

//   // Submit handler
//   const handleReviewSubmit = async (review) => {
//     console.log('Received review from AddReviewForm:', review);
//     if (!user || !user.full_name) {
//       setError('You must be logged in to submit a review.');
//       console.error('User not logged in or missing full_name:', user);
//       return;
//     }

//     if (!review || !review.comment || !review.rating) {
//       setError('Review must include a comment and rating.');
//       console.error('Invalid review data:', review);
//       return;
//     }

//     const now = new Date();
//     const isoTimestamp = now.toISOString();
//     const reviewData = {
//       userName: user.full_name,
//       comment: review.comment,
//       stars: Number(review.rating),
//       timestamp: isoTimestamp,
//       time: 'Just Now',
//       id: `${facilityId}-${Date.now()}`,
//     };
//     console.log('Submitting review to backend:', reviewData);

//     // Optimistically update UI
//     setReviews((prevReviews) => {
//       const updatedReviews = [...prevReviews, reviewData];
//       const totalStars = updatedReviews.reduce((sum, r) => sum + (Number(r.stars) || 0), 0);
//       const avgRating = updatedReviews.length > 0 ? (totalStars / updatedReviews.length).toFixed(1) : 0;
//       setRating(avgRating);
//       setTotalReviews(updatedReviews.length);
//       setError('');
//       console.log('Optimistically updated reviews:', updatedReviews);
//       return updatedReviews;
//     });

//     try {
//       // Replace with the correct POST endpoint
//       const response = await axios.post(`http://127.0.0.1:8001/api/reviews`, reviewData);
//       console.log('API POST response:', response.data);
//       // Update ID if provided by backend
//       if (response.data.id) {
//         setReviews((prevReviews) =>
//           prevReviews.map((r) =>
//             r.id === reviewData.id ? { ...r, id: response.data.id } : r
//           )
//         );
//       }
//     } catch (err) {
//       setError('Failed to save review to backend. It’s still shown locally.');
//       console.error('Error submitting review:', err.message, err.response?.data);
//       // Optional: Rollback optimistic update if needed
//       // setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewData.id));
//     }
//   };

//   // Render stars
//   const renderStars = (rating) => {
//     const safeRating = Number(rating) || 0;
//     return Array.from({ length: 5 }, (_, index) => (
//       <Star
//         key={index}
//         size={20}
//         fill={index < Math.floor(safeRating) ? 'var(--accent-color, #e74c3c)' : 'none'}
//         color={index < Math.floor(safeRating) ? 'var(--accent-color, #e74c3c)' : 'var(--medium-gray, #ddd)'}
//       />
//     ));
//   };

//   return (
//     <div
//       style={{
//         borderRadius: '12px',
//         backgroundColor: 'white',
//         padding: '1rem',
//         boxShadow: '1px 1px 3px 1px rgba(0,0,0,0.1)',
//       }}
//     >
//       <InfoTitle>
//         <Star size={20} />
//         Reviews & Ratings
//       </InfoTitle>

//       <RatingOverview>
//         <RatingNumber>{rating}</RatingNumber>
//         <div>
//           <StarsContainer>{renderStars(rating)}</StarsContainer>
//           <div style={{ color: 'var(--dark-gray, #555)', fontSize: '0.9rem' }}>
//             Based on {totalReviews} reviews
//           </div>
//         </div>
//       </RatingOverview>

//       {error && <ErrorMessage>{error}</ErrorMessage>}

//       {reviews.length === 0 ? (
//         <NoReviewsMessage>No reviews yet. Be the first!</NoReviewsMessage>
//       ) : (
//         <ReviewContainer>
//           {reviews.map((review) => (
//             <ReviewItem key={review.id}>
//               <ReviewHeader>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <ReviewerName>{review.userName || 'Anonymous'}</ReviewerName>
//                   <StarsContainer>{renderStars(review.stars)}</StarsContainer>
//                 </div>
//                 <ReviewDate>{review.time || new Date(review.timestamp).toLocaleString()}</ReviewDate>
//               </ReviewHeader>
//               <ReviewText>{review.comment}</ReviewText>
//             </ReviewItem>
//           ))}
//         </ReviewContainer>
//       )}

//       <AddReviewForm onSubmit={handleReviewSubmit} />
//     </div>
//   );
// };

const ReviewsSection = ({ facilityId, reviews: initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(initialReviews.length);
  const [error, setError] = useState('');

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const updateRatingAndCount = (reviewsList) => {
  const totalStars = reviewsList.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  const avg = reviewsList.length > 0 ? (totalStars / reviewsList.length).toFixed(1) : '0';
  setRating(avg);
  setTotalReviews(reviewsList.length);
};

useEffect(() => {
  setReviews(initialReviews);
  updateRatingAndCount(initialReviews);
}, [initialReviews]);



  // useEffect(() => {
  //   setReviews(initialReviews);
  //   const totalStars = initialReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  //   const avg = initialReviews.length > 0 ? (totalStars / initialReviews.length).toFixed(1) : '0';
  //   setRating(avg);
  //   setTotalReviews(initialReviews.length);
  // }, [initialReviews]); // run once

  const handleReviewSubmit = async (reviewData) => {
  try {
    const res = await axios.post(`http://127.0.0.1:8001/reviews`, reviewData);
    console.log('Review submitted:', res.data);

    // Optimistically add to local state
    const formattedReview = {
  id: `${reviewData.shop_id}-${Date.now()}`,
  userName: user.full_name,
  dateTime: new Date().toISOString(),
  comment: reviewData.review,           // normalize field name
  rating: reviewData.star_mark,         // normalize field name
};

    setReviews((prev) => {
  const updated = [...prev, formattedReview];
  updateRatingAndCount(updated);
  return updated;
});


  } catch (err) {
    setError('Failed to submit review. Please try again.');
    console.error('Submit error:', err.message, err.response?.data);
  }
};


  const renderStars = (rating) => {
    const safeRating = Number(rating) || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        fill={index < Math.floor(safeRating) ? 'var(--accent-color, #e74c3c)' : 'none'}
        color={index < Math.floor(safeRating) ? 'var(--accent-color, #e74c3c)' : 'var(--medium-gray, #ddd)'}
      />
    ));
  };

  return (
    <div
      style={{
        borderRadius: '12px',
        backgroundColor: 'white',
        padding: '1rem',
        boxShadow: '1px 1px 3px 1px rgba(0,0,0,0.1)',
      }}
    >
      <InfoTitle>
        <Star size={20} />
        Reviews & Ratings
      </InfoTitle>

      <RatingOverview>
        <RatingNumber>{rating}</RatingNumber>
        <div>
          <StarsContainer>{renderStars(rating)}</StarsContainer>
          <div style={{ color: 'var(--dark-gray, #555)', fontSize: '0.9rem' }}>
            Based on {totalReviews} reviews
          </div>
        </div>
      </RatingOverview>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {reviews.length === 0 ? (
        <NoReviewsMessage>No reviews yet. Be the first!</NoReviewsMessage>
      ) : (
        <ReviewContainer>
          {reviews.map((review) => (
            <ReviewItem key={review.id}>
              <ReviewHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ReviewerName>{review.userName || 'Anonymous'}</ReviewerName>
                  <StarsContainer>{renderStars(review.rating)}</StarsContainer>
                </div>
                <ReviewDate>
                  {review.dateTime
                    ? dayjs(review.dateTime).fromNow()
                    : 'Just now'}
                </ReviewDate>
              </ReviewHeader>
              <ReviewText>{review.comment}</ReviewText>
            </ReviewItem>
          ))}
        </ReviewContainer>
      )}

      <AddReviewForm
  onSubmit={handleReviewSubmit}
  clientId={user?.user_id}
  shopId={facilityId}
/>

    </div>
  );
};

export default ReviewsSection;