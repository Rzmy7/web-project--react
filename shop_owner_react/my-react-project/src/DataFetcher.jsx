import Dashboard from './dashboard';
import Products from './products';
import Preorder from './preorder';
import Reviews from './reviews';
import Settings from './Settings';

const DataFetcher = ({ activeSection, shopOwner, handleLogout }) => {
  return (
    <div>
      {activeSection === "dashboard" && (
        <Dashboard shopOwner={shopOwner} onLogout={handleLogout} />
      )}
      {activeSection === "products" && <Products />}
      {activeSection === "preorder" && <Preorder />}
      {activeSection === "reviews" && <Reviews />}
      {activeSection === "settings" && <Settings />}
    </div>
  );
};

export default DataFetcher;
