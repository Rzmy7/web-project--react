// AddReviewForm.js
import React, { useState } from "react";
import styled from "styled-components";
import { Send, Star } from "lucide-react";

const ReviewContainer = styled.div`
  background-color: var(--light-gray);
  border-radius: 12px;
  padding: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid var(--medium-gray);
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: var(--accent-color);
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  margin: 12px 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: ${(props) =>
    props.filled ? "var(--accent-color)" : "var(--medium-gray)"};

  &:hover {
    color: var(--hover-accent-color);
  }
`;

const Lable =  styled.div`
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 0.4rem;
`;

const AddReviewForm = ({ onSubmit }) => {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (newReview.trim() && newRating > 0) {
      onSubmit({ rating: newRating, comment: newReview});
      setNewReview("");
      setNewRating(0);
    }
  };


  

  return (
    <ReviewContainer>
      <h4 style={{ color: "var(--primary-color)" }}>Add Your Review</h4>
      <div  style={{rowGap:"0.8rem" ,  marginTop:"1rem"}} >
        <div>
          <Lable>Rating:</Lable>
          <StarRating>
            {Array.from({ length: 5 }, (_, index) => (
              <StarButton
                key={index}
                filled={index < (hoverRating || newRating)}
                onClick={() => setNewRating(index + 1)}
                onMouseEnter={() => setHoverRating(index + 1)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={24}
                  fill={
                    index < (hoverRating || newRating) ? "currentColor" : "none"
                  }
                />
              </StarButton>
            ))}
          </StarRating>
        </div>
        <div>
          <Lable>Your Review:</Lable>
          <TextArea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
        </div>
      </div>
      <SubmitButton onClick={handleSubmit} style={{marginTop:"1.2rem"}}>
        <Send size={16} />
        Submit Review
      </SubmitButton>
    </ReviewContainer>
  );
};

export default AddReviewForm;
