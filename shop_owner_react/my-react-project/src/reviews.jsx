import React, { useState } from 'react';
import styled from 'styled-components';

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
`;
const InfoTitle = styled.h3`
  color: var(--primary-color);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
`;


function Reviews() {
    return (
       <Section id="reviews">
      <SectionHeader>
        <h1>Reviews</h1>
      </SectionHeader>
      <ReviewContainer>
          <InfoTitle>
         Reviews & Ratings
          </InfoTitle>
          

      </ReviewContainer>
    </Section>
    );
}

export default Reviews;