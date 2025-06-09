import React, { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import Products from "./products";
import Preorder from "./preorder";
import Reviews from "./reviews";
import Settings from "./Settings";

const DataFetcher = ({ activeSection, shopOwner, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [localShopOwner, setLocalShopOwner] = useState(null);
  const shopId = shopOwner.shop_id; // Fallback to 'SH01'
    const [facilityItems, setFacilityItems] = useState([]);

  useEffect(() => {
    console.log("Shop ID:", shopId);
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8001/api/shopOwnerP1/${shopId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Shop details fetched:", data);
        if (data.error) {
          throw new Error(data.details || data.error);
        }

        const response2 = await fetch(
          `http://127.0.0.1:8001/api/stats/${shopId}`
        );
        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response2.status}`);
        }
        const stats = await response2.json();
        console.log("Shop stats fetched:", stats);
        if (stats.error) {
          throw new Error(stats.details || stats.error);
        }

        const responseOpenStatus = await fetch(
          `http://127.0.0.1:8001/api/shop/${shopId}/OpenStatus`
        );
        if (!responseOpenStatus.ok) {
          throw new Error(`HTTP error! Status: ${responseOpenStatus.status}`);
        }
        const openStatus = await responseOpenStatus.json();
        console.log("Shop open status fetched:", openStatus);
        if (openStatus.error) {
          throw new Error(openStatus.details || openStatus.error);
        }

        const responseFacilityItems = await fetch(
          `http://127.0.0.1:8001/api/shop/${shopId}/FacilityItems`
        );
        if (!responseFacilityItems.ok) {
          throw new Error(`HTTP error! Status: ${responseFacilityItems.status}`);
        }
        const facilityItems = await responseFacilityItems.json();
        console.log("Shop facility items fetched:", facilityItems);
        if (facilityItems.error) {
          throw new Error(facilityItems.details || facilityItems.error);
        }
        setFacilityItems(facilityItems);

        setLocalShopOwner({ full_name: data.full_name });
        setShopData({
          shopName: data.shop_name,
          location: data.Location,
          hours: `${data.opening_time} - ${data.closing_time}`,
          open_status: openStatus.open_status,
          shopImage: data.shop_image,
          imageAlt: data.shop_name,
          imageUrl: data.shop_image,
          stats: {
            availableItems: stats.available_items, // Placeholder
            pendingOrders: stats.pending_orders,
            completedOrders: stats.completed_quantity,
            totalRevenue: stats.total_revenue,
          },
          notifications: [], // Placeholder
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
    // console.log('Shop data:', shopData);
  }, [shopId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!shopData || !localShopOwner) {
    return <div>No data available for shop ID: {shopId}</div>;
  }

  return (
    <div>
      {activeSection === "dashboard" && (
        <Dashboard
          shopOwner={localShopOwner}
          shopData={shopData}
          onLogout={onLogout}
          shopId={shopId}
        />
      )}
      {activeSection === "products" && <Products shopId={shopId} facilityItems={facilityItems}/>}
      {activeSection === "preorder" && <Preorder />}
      {activeSection === "reviews" && <Reviews />}
      {activeSection === "settings" && <Settings />}
    </div>
  );
};

export default DataFetcher;
