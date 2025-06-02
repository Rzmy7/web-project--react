import React from 'react';
import styled from "styled-components";

// Styled components
const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height:100% ;
`;

const InfoTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 16px 0;
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
  color: ${(props) => (props.isToday ? "var(--accent-color)" : "var(--text-color)")};
`;

const Hours = styled.span`
  color: ${(props) => (props.isOpen ? "var(--success)" : "var(--danger)")};
  font-weight: 500;
`;

// WeeklySchedule Component
const WeeklySchedule = ({ schedule = [] }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <InfoCard>
      <InfoTitle>Weekly Schedule</InfoTitle>
      {Array.isArray(schedule) && schedule.length > 0 ? (
        schedule.map((day, index) => (
          <ScheduleItem key={index}>
            <DayName isToday={day.day === today}>{day.day}</DayName>
            <Hours isOpen={day.isOpen}>{day.hours}</Hours>
          </ScheduleItem>
        ))
      ) : (
        <p>No schedule available.</p>
      )}
    </InfoCard>
  );
};

export default WeeklySchedule;
