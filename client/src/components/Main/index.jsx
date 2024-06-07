// Updated JSX for Main component
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const Main = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`http://localhost:8080/api/users`, {
        headers: {
          "x-auth-token": token
        }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <div className={styles.nav_links}>
          <a href="/">Home</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/hired">Hired</a>
        </div>
        <div className={styles.user_menu}>
          <span>{`${user.firstName} ${user.lastName} `}<span className="down_arrow">&#9660;</span></span>
          <div className={styles.dropdown_content}>
            <p>{user.email}</p>
            <p onClick={handleLogout}>
              Logout
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Main;