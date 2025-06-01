import React, { useState } from "react";
import { Star, MapPin, Clock, AlertCircle, User, Send } from "lucide-react";
import styled from "styled-components";
import BackButton from "../utils/Backbutton";

// Sample data - replace with real data from your backend
const facilityData = {
  id: 1,
  name: "Central Canteen",
  photo:
    "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=400&fit=crop",
  isOpen: true,
  currentStatus: "Open until 8:00 PM",
  weeklySchedule: [
    { day: "Monday", hours: "7:00 AM - 8:00 PM", isOpen: true },
    { day: "Tuesday", hours: "7:00 AM - 8:00 PM", isOpen: true },
    { day: "Wednesday", hours: "7:00 AM - 8:00 PM", isOpen: true },
    { day: "Thursday", hours: "7:00 AM - 8:00 PM", isOpen: true },
    { day: "Friday", hours: "7:00 AM - 6:00 PM", isOpen: true },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM", isOpen: true },
    { day: "Sunday", hours: "Closed", isOpen: false },
  ],
  specialNotice:
    "🎉 New menu items available! Try our signature pasta and fresh salads.",
  location: "Building A, Ground Floor, Room 101",
  coordinates: { lat: 1.3521, lng: 103.8198 },
  ownerName: "Sarah Chen",
  rating: 4.2,
  totalReviews: 156,
  reviews: [
    {
      id: 1,
      userName: "Alex Wong",
      rating: 5,
      comment: "Great food and friendly staff! The chicken rice is amazing.",
      date: "2 days ago",
    },
    {
      id: 2,
      userName: "Maria Santos",
      rating: 4,
      comment:
        "Good variety of food options. Sometimes gets crowded during lunch hours.",
      date: "1 week ago",
    },
    {
      id: 3,
      userName: "David Lim",
      rating: 4,
      comment:
        "Fresh ingredients and reasonable prices. The laksa is my favorite!",
      date: "2 weeks ago",
    },
  ],
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--secondary-color);
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FacilityImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FacilityName = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 12px 0;
  color: var(--primary-color);
  font-weight: 700;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: ${(props) =>
    props.isOpen ? "var(--success)" : "var(--danger)"};
  color: white;
  margin-bottom: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
`;

const ScheduleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--light-gray);

  &:last-child {
    border-bottom: none;
  }
`;

const DayName = styled.span`
  font-weight: 600;
  color: ${(props) =>
    props.isToday ? "var(--accent-color)" : "var(--text-color)"};
`;

const Hours = styled.span`
  color: ${(props) => (props.isOpen ? "var(--success)" : "var(--danger)")};
  font-weight: 500;
`;

const SpecialNotice = styled.div`
  background: linear-gradient(
    135deg,
    var(--accent-color),
    var(--hover-accent-color)
  );
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  font-weight: 500;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  background: var(--light-gray);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dark-gray);
  margin-top: 12px;
`;

const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--light-gray);
  border-radius: 8px;
`;

const ReviewsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

const AddReviewForm = styled.div`
  background: var(--light-gray);
  padding: 20px;
  border-radius: 8px;
  margin-top: 24px;
`;

const FormTitle = styled.h4`
  margin: 0 0 16px 0;
  color: var(--primary-color);
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

const FacilityDetails = () => {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const handleSubmitReview = () => {
    if (newReview.trim() && newRating > 0) {
      // In real app, send to backend
      console.log("Submitting review:", {
        rating: newRating,
        comment: newReview,
      });
      setNewReview("");
      setNewRating(0);
      alert("Review submitted successfully!");
    }
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

  return (
    <Container>
      <Header>
        <BackButton />
        <FacilityImage src={facilityData.photo} alt={facilityData.name} />
        <FacilityName>{facilityData.name}</FacilityName>
        <StatusBadge isOpen={facilityData.isOpen}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
            }}
          />
          {facilityData.currentStatus}
        </StatusBadge>

        {facilityData.specialNotice && (
          <SpecialNotice>
            <AlertCircle
              size={16}
              style={{ display: "inline", marginRight: "8px" }}
            />
            {facilityData.specialNotice}
          </SpecialNotice>
        )}
      </Header>

      <InfoGrid>
        <InfoCard>
          <InfoTitle>
            <Clock size={20} />
            Weekly Schedule
          </InfoTitle>
          {facilityData.weeklySchedule.map((schedule, index) => (
            <ScheduleItem key={index}>
              <DayName isToday={schedule.day === today}>{schedule.day}</DayName>
              <Hours isOpen={schedule.isOpen}>{schedule.hours}</Hours>
            </ScheduleItem>
          ))}
        </InfoCard>

        <InfoCard>
          <InfoTitle>
            <MapPin size={20} />
            Location & Contact
          </InfoTitle>
          <p style={{ margin: "0 0 12px 0", color: "var(--text-color)" }}>
            {facilityData.location}
          </p>
          <MapContainer>
            📍 Interactive Map View
            <br />
            <small>
              (Lat: {facilityData.coordinates.lat}, Lng:{" "}
              {facilityData.coordinates.lng})
            </small>
          </MapContainer>

          <OwnerInfo>
            <User size={20} color="var(--primary-color)" />
            <div>
              <div style={{ fontWeight: "600" }}>Shop Owner</div>
              <div style={{ color: "var(--dark-gray)" }}>
                {facilityData.ownerName}
              </div>
            </div>
          </OwnerInfo>
        </InfoCard>
      </InfoGrid>

      <ReviewsSection>
        <InfoTitle>
          <Star size={20} />
          Reviews & Ratings
        </InfoTitle>

        <RatingOverview>
          <RatingNumber>{facilityData.rating}</RatingNumber>
          <div>
            <StarsContainer>
              {renderStars(Math.floor(facilityData.rating))}
            </StarsContainer>
            <div style={{ color: "var(--dark-gray)", fontSize: "0.9rem" }}>
              Based on {facilityData.totalReviews} reviews
            </div>
          </div>
        </RatingOverview>

        {facilityData.reviews.map((review) => (
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

        <AddReviewForm>
          <FormTitle>Add Your Review</FormTitle>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Rating:
            </label>
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
                      index < (hoverRating || newRating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </StarButton>
              ))}
            </StarRating>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Your Review:
            </label>
            <TextArea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your experience with this facility..."
            />
          </div>
          <SubmitButton
            onClick={handleSubmitReview}
            style={{ marginTop: "12px" }}
          >
            <Send size={16} />
            Submit Review
          </SubmitButton>
        </AddReviewForm>
      </ReviewsSection>
    </Container>
  );
};

export default FacilityDetails;
