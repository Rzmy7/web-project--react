import { ClipLoader } from "react-spinners";
import "../index.css";

export default function LoadingScreen() {
  return (
    <div style={styles.container}>
      <ClipLoader size={60} color="var(--primary-color)" />
      <p style={styles.text}>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    justifyItems:"center",
    alignItems: "center",
    backgroundColor: "var(--secondary-color)",
  },
  text: {
    marginTop: "1rem",
    fontSize: "1.25rem",
    color: "var(--primary-color)",
  },
};
