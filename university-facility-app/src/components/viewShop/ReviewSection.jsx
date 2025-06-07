import React from "react";
import styled from "styled-components";
import { Star } from "lucide-react";
import AddReviewForm from "./AddReviewForm";

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
  margin-bottom: 2rem;
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

// ReviewsSection Component
const ReviewsSection = ({ rating, totalReviews, reviews }) => {
  const storedUser  = localStorage.getItem("user");
  const user = storedUser  ? JSON.parse(storedUser ) : null;

  // ✅ Submit handler
  const handleReviewSubmit = async (review) => {
    const now = new Date();
    const isoTimestamp = now.toISOString();

    const reviewData = {
      userName: user?.name,
      comment: review.comment,
      stars: review.rating,
      timestamp: isoTimestamp,
      time: "Just Now", // For frontend display, optional
    };

    console.log("Submitting review:", reviewData);
    // Here you can handle the submission logic if needed
  };

  // ✅ Render stars
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        fill={index < rating ? "var(--accent-color)" : "none"}
        color={index < rating ? "var(--accent-color)" : "var(--medium-gray)"}
      />
    ));

  return (
    <div
      style={{
        borderRadius: "12px",
        backgroundColor: "white",
        padding: "1rem",
        boxShadow: "1px 1px 3px 1px rgba(0,0,0,0.1)",
      }}
    >
      <InfoTitle>
        <Star size={20} />
        Reviews & Ratings
      </InfoTitle>

      <RatingOverview>
        <RatingNumber>{rating}</RatingNumber>
        <div>
          <StarsContainer>{renderStars(Math.floor(rating))}</StarsContainer>
          <div style={{ color: "var(--dark-gray)", fontSize: "0.9rem" }}>
            Based on {totalReviews} reviews
          </div>
        </div>
      </RatingOverview>

      {reviews.length === 0 ? (
        <NoReviewsMessage>No reviews yet. Be the first!</NoReviewsMessage>
      ) : (
        <ReviewContainer>
          {reviews.map((review, idx) => (
            <ReviewItem key={idx}>
              <ReviewHeader>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <ReviewerName>{review.userName}</ReviewerName>
                  <StarsContainer>{renderStars(review.stars)}</StarsContainer>
                </div>
                <ReviewDate>{review.time}</ReviewDate>
              </ReviewHeader>
              <ReviewText>{review.comment}</ReviewText>
            </ReviewItem>
          ))}
        </ReviewContainer>
      )}

      <AddReviewForm onSubmit={handleReviewSubmit} />
    </div>
  );
};

export default ReviewsSection;
