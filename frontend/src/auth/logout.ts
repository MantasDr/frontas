import axios from "axios";

export const handleLogout = async () => {
  try {
    const response = await axios.post("auth/logout");

    if (response.status === 200) {
      console.log("Logout successful");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
