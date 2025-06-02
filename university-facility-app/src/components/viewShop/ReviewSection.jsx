import React from 'react';
import styled from "styled-components";
import { Star } from 'lucide-react';
import AddReviewForm from './AddReviewForm';

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
const InfoTitle = styled.h3`
  color: var(--primary-color);
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
  border-bottom: 1px solid var(--light-gray);
`;
const RatingNumber = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
`;const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`;



// ReviewsSection Component
const ReviewsSection = ({rating, reviews = [] ,totalReviews}) => {

  // Check if reviews is an array and has items
  const handleReviewSubmit = (review) => {
    console.log("Submitting review:", review);
    alert("Review submitted successfully!");
  };

  const renderStars = (rating) => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={20}
          fill={index < rating ? "var(--accent-color)" : "none"}
          color={index < rating ? "var(--accent-color)" : "var(--medium-gray)"}
        />
      ));
    };

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <NoReviewsMessage>No reviews available.</NoReviewsMessage>;
  }

  return (
    <div style={{borderRadius:"12px" , backgroundColor:"white", padding:"1rem",boxShadow:"1px 1px 3px 1px rgba(0,0,0,0.1)"}}>
      <InfoTitle>
          <Star size={20} />
          Reviews & Ratings
        </InfoTitle>
         <RatingOverview>
          <RatingNumber>{rating}</RatingNumber>
          <div>
            <StarsContainer>
              {renderStars(Math.floor(rating))}
            </StarsContainer>
            <div style={{ color: "var(--dark-gray)", fontSize: "0.9rem" }}>
              Based on {totalReviews} reviews
            </div>
          </div>
        </RatingOverview>
      {reviews.map((review) => (
        <ReviewItem key={review.id}>
            <ReviewHeader>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <ReviewerName>{review.userName}</ReviewerName>
                <StarsContainer>{renderStars(review.rating)}</StarsContainer>
              </div>
              <ReviewDate>{review.date}</ReviewDate>
            </ReviewHeader>
            <ReviewText>{review.comment}</ReviewText>
          </ReviewItem>
      ))}
      <AddReviewForm onSubmit={handleReviewSubmit}/>
    </div>
  );
};

export default ReviewsSection;
