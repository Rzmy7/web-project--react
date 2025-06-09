import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";

// Styled Components
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
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const ErrorMessage = styled.div`
  color: var(--error-color, red);
  font-size: small;
  margin-top: 0.5rem;
`;

const AlertBox = ({ alerts, shopId }) => {
  const [alertList, setAlertList] = useState([]);
  const [newAlert, setNewAlert] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null); // Store socket instance
  const alertListRef = useRef(null); // For auto-scrolling

  // Initialize socket once
  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:8001", { reconnect: true });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Format initial alerts
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const formatted = alerts.map((a) => {
        try {
          const date = new Date(a.time); // Parse RFC 2822
          if (isNaN(date.getTime())) throw new Error("Invalid date");
          // Convert to Asia/Kolkata
          const kolkataTime = date.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
          return {
            id: `${a.alert}-${a.time}`, // Fallback ID
            info: a.alert,
            time: `Reported at ${kolkataTime}`,
            shop_id: a.shop_id,
            isOptimistic: false,
          };
        } catch (err) {
          console.error("Invalid date format:", a.time,"Error",err);
          return null;
        }
      }).filter(Boolean);

      setAlertList((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        // Prepend new alerts to top
        return [...formatted.filter((a) => !existingIds.has(a.id)), ...prev.filter((a) => !a.isOptimistic)];
      });
    }
  }, [alerts]);

  // Auto-scroll to top for new alerts
  useEffect(() => {
    alertListRef.current?.scrollTo(0, 0);
  }, [alertList]);

  // Listen for real-time alerts
  useEffect(() => {
    const handleNewAlert = (data) => {
      try {
        const date = new Date(data.time); // Parse RFC 2822
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        // Convert to Asia/Kolkata
        const kolkataTime = date.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        const formatted = {
          id: `${data.alert}-${data.time}`, // Fallback ID
          info: data.alert,
          time: `Reported at ${kolkataTime}`,
          shop_id: data.shop_id,
          isOptimistic: false,
        };
        setAlertList((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          if (existingIds.has(formatted.id)) return prev;
          // Prepend to top
          return [formatted, ...prev.filter((a) => !a.isOptimistic)];
        });
      } catch (err) {
        console.error("Invalid date format:", data.time,"Error",err);
      }
    };

    socketRef.current.on("new_alert", handleNewAlert);
    return () => socketRef.current.off("new_alert", handleNewAlert);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAlert.trim()) {
      setError("Alert cannot be empty");
      return;
    }

    // Optimistic update in Asia/Kolkata time
    const tempId = `temp-${Date.now()}`;
    const now = new Date();
    const kolkataTime = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const optimisticAlert = {
      id: tempId,
      info: newAlert.trim(),
      time: `Reported at ${kolkataTime}`,
      shop_id: shopId,
      isOptimistic: true,
    };
    setAlertList((prev) => [optimisticAlert, ...prev]); // Prepend to top
    setNewAlert("");
    setError("");
    setIsLoading(true);

    const alertData = {
      alert: newAlert.trim(),
      shop_id: shopId,
    };

    try {
      const response = await fetch("http://127.0.0.1:8001/api/add_alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Alert submitted successfully:", result);
      } else {
        setError(result.error || "Failed to submit alert");
        setAlertList((prev) => prev.filter((a) => a.id !== tempId));
      }
    } catch (err) {
      setError("Network error submitting alert");
      console.error("❌ Network error:", err);
      setAlertList((prev) => prev.filter((a) => a.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <RealTimeAlert>Real Time Alert</RealTimeAlert>
      <AlertList ref={alertListRef}>
        {alertList.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--medium-gray)" }}>
            No alerts to display
          </p>
        ) : (
          alertList.map((alert) => (
            <AlertItem key={alert.id} style={{ opacity: alert.isOptimistic ? 0.7 : 1 }}>
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
            disabled={isLoading}
          />
          <AlertSubmitBtn type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit"}
          </AlertSubmitBtn>
        </AddAlertForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SubmitAlertCont>
    </div>
  );
};

export default AlertBox;