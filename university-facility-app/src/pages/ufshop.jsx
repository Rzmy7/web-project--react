import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import TabNavigationComponent from "../components/shopMenuBar";
import { io } from "socket.io-client";
import LoadingScreen from "../utils/Loading";
import BackButton from "../utils/Backbutton";

const Shop = styled.div`
  margin: 2rem 0;
  border: 1px solid var(--light-gray);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;
  padding: 1rem 1.7rem;

  @media (max-width: 768px) {
    padding: 0.6rem 1.1rem;
  }
`;

const ShopHeader = styled.div`
  background-color: var(--secondary-color);
  padding-bottom: 1.5rem;
  height: fit-content;
`;

const ShopTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--primary-color);
`;

const ShopNameMain = styled.span`
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const ShopStatus = styled.span`
  background-color: ${({ $isOpen }) =>
    $isOpen ? "var(--success)" : "var(--danger)"};
  color: var(--secondary-color);
  padding: 0.3rem 0.6rem;
  font-size: 1rem;
  border-radius: 5px;
  font-weight: 500;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
`;

const ShopInfo = styled.div`
  display: flex;
  width: fit-content;
  justify-content: space-between;
  margin-top: 0.9rem;
  color: var(--dark-gray);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ShopInfoItem = styled.div`
  span {
    margin-right: 0.5rem;
  }

  &.location {
    margin-left: 4rem;

    @media (max-width: 768px) {
      margin: 0.5rem 0;
    }
  }
`;

const socket = io("http://127.0.0.1:8001");

// Utility function to format time (HH:mm:ss -> HH:mm)
const formatTime = (time) => {
  if (!time) return "";
  // Remove seconds (e.g., "12:00:00" -> "12:00")
  return time.split(":").slice(0, 2).join(":");
};

function ShopPage() {
  const { shopId } = useParams();
  const [shopData, setShopData] = useState(null);

  // Fetch shop data on mount or when shopId changes
  useEffect(() => {
    if (!shopId) return;
    fetch(`http://127.0.0.1:8001/api/shopItems/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          console.log("✅ shopData fetched:", data);
          setShopData(data);
        } else {
          console.error("Shop not found");
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;

    socket.emit("join_shop", shopId);

    socket.on("shop_updated", (updatedData) => {
      if (updatedData.id === shopId || updatedData.shopId === shopId) {
        console.log("Shop data updated via socket:", updatedData);
        setShopData(updatedData);
      }
    });

    return () => {
      socket.emit("leave_shop", shopId);
      socket.off("shop_updated");
    };
  }, [shopId]);

  if (!shopData)
    return (
      <div style={{ width: "100%", justifyContent: "center" }}>
        <LoadingScreen />
      </div>
    );

  const { shopName, status, openingTime, closingTime, location, menuData } =
    shopData;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Shop>
        <ShopHeader>
          <BackButton />
          <ShopTitle>
            <ShopNameMain>{shopName}</ShopNameMain>
            <ShopStatus $isOpen={status === "Open"}>{status}</ShopStatus>
          </ShopTitle>
          <ShopInfo>
            <ShopInfoItem>
              <span>Hours:</span>
              <span>
                {formatTime(openingTime)} - {formatTime(closingTime)}
              </span>
            </ShopInfoItem>
            <ShopInfoItem className="location">
              <span>Location:</span>
              <span>{location}</span>
            </ShopInfoItem>
          </ShopInfo>
        </ShopHeader>

        <TabNavigationComponent menuData={menuData} shopId={shopId} />
      </Shop>
    </div>
  );
}

export default ShopPage;