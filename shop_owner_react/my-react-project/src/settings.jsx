import React from 'react';
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

function Settings() {
  return (
    <Section id="Settings">
            <SectionHeader>
                <h1>Settings</h1>
            </SectionHeader>
        </Section>

  );
}

export default Settings;