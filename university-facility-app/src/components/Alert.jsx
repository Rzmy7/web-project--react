import React, { useState } from "react";
import styled from "styled-components";

// ---------------- Styled Components ---------------- //

// const AlertsCont = styled.div`
//   display: block;
//   background-color: var(--light-gray);
//   border-radius: 0.3rem;
//   padding: 0.8rem 0.7rem;
//   margin-top: 1.5rem;
// `;

const RealTimeAlert = styled.div`
  font-weight: 700;
  font-size: small;
  color: var(--primary-color);
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.7rem;
  margin-top: 0.8rem;
  margin-bottom: 1.5rem;
  height: 300px;
  max-height: 500px;
  overflow-y: auto;
`;

const AlertItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.3rem;
  border-left: 0.2rem solid var(--accent-color);
`;

const AlertInfo = styled.span`
  color: var(--text-color);
`;

const AlertTime = styled.span`
  font-size: small;
  color: var(--dark-gray);
`;

const SubmitAlertCont = styled.div``;

const AddAlertForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 4.5rem;
  height: 2rem;
`;

const AlertInput = styled.input`
  border: 1px solid var(--light-gray);
  border-radius: 0.3rem 0 0 0.3rem;
  padding: 0.5rem;
`;

const AlertSubmitBtn = styled.button`
  border: none;
  background-color: var(--accent-color);
  color: var(--secondary-color);
  border-radius: 0 0.3rem 0.3rem 0;
  cursor: pointer;
`;

// ---------------- React Component ---------------- //

const AlertBox = () => {
  const [alertList, setAlertList] = useState([
  ]);
  const [newAlert, setNewAlert] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newAlert.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setAlertList([
      ...alertList,
      { info: newAlert.trim(), time: `Reported at ${formattedTime}` }
    ]);
    setNewAlert("");
  };

  return (
    <div>
      <RealTimeAlert>Real Time Alert</RealTimeAlert>

      <AlertList>
  {alertList.length === 0 ? (
      <p style={{fontStyle:"italic" ,  color:"var(--medium-gray)"}}>No alerts to display</p>
  ) : (
    alertList.map((alert, index) => (
      <AlertItem key={index}>
        <AlertInfo>{alert.info}</AlertInfo>
        <AlertTime>{alert.time}</AlertTime>
      </AlertItem>
    ))
  )}
</AlertList>


      <SubmitAlertCont>
        <AddAlertForm onSubmit={handleSubmit}>
          <AlertInput
            type="text"
            placeholder="Report availability (e.g., 'Noodles gone')"
            value={newAlert}
            onChange={(e) => setNewAlert(e.target.value)}
          />
          <AlertSubmitBtn type="submit">Submit</AlertSubmitBtn>
        </AddAlertForm>
      </SubmitAlertCont>
    </div>
  );
};

export default AlertBox;
