import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";

const Main = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const navigate = useNavigate();

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
    console.log(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className={styles.main_container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Smith Hire</h1>
        {/* <img src="/robert-h-smith-school-of-business-logo.png" alt="Robert H. Smith School of Business" className="smith-logo" /> */}
        <nav className={styles.navbar}>
          <ul className={styles.nav_links}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {/* <li><Link to="/faculty">Faculty View</Link></li> */}
            <li><Link to="/wishlist">Wishlist</Link></li> 
          </ul>
          <div className={styles.user_menu}>
            <span>{`${user.firstName} ${user.lastName} `}<span className={styles.down_arrow}>&#9660;</span></span>
            <div className={styles.dropdown_content}>
              <p>{user.email}</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Main;
