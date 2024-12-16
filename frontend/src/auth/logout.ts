import axios from "axios";

export const handleLogout = async () => {
  try {
    const response = await axios.get("http://localhost:8081/logout", {
      withCredentials: true,
    });

    if (response.status === 200) {
      console.log("Logout successful");
      window.location.href = "/login"; // Redirect to login page
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};