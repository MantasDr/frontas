import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the type for Achievement
type AchievementType = {
  id_Achievement: number;
  fish_weight: number;
  prize: string;
  date: string;
  fish_count: number;
  post_count: number;
  fk_Post: number;
};

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [popup, setPopup] = useState<"add" | "edit" | "delete" | "alert" | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementType | null>(null);
  const [newAchievement, setNewAchievement] = useState({
    fish_weight: 0,
    prize: "",
    date: "",
    fish_count: 0,
    post_count: 0,
    fk_Post: 0,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fetch achievements from the backend when the component mounts
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get("http://localhost:8081/achievements"); // Adjust the URL as needed
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchAchievements();
  }, []);

  // Handle creating a new achievement
  const createAchievement = async () => {
    if (
      newAchievement.fish_weight <= 0 ||
      !newAchievement.prize ||
      !newAchievement.date ||
      newAchievement.fish_count <= 0 ||
      newAchievement.post_count <= 0 ||
      newAchievement.fk_Post <= 0
    ) {
      return alert("Užpildykite visus laukus su teisingais duomenimis.");
    }
    try {
      const response = await axios.post("http://localhost:8081/achievements", newAchievement); // Adjust the URL as needed
      setAchievements([...achievements, response.data]);
      setNewAchievement({
        fish_weight: 0,
        prize: "",
        date: "",
        fish_count: 0,
        post_count: 0,
        fk_Post: 0,
      });
      setPopup(null);
    } catch (error) {
      console.error("Error creating achievement:", error);
    }
  };

  const deleteAchievement = async () => {
    if (!selectedAchievement) {
      setAlertMessage("Pasirinkite pasiekimą pirmiausia!");
      setPopup("alert");
      return;
    }
  
    if (!selectedAchievement.id_Achievement) {
      setAlertMessage("Pasiekimas neturi galiojančio ID!");
      setPopup("alert");
      return;
    }
  
    try {
      // Siunčiame užklausą į backendą, kad pašalintume pasiekimą pagal id
      const response = await axios.delete(
        `http://localhost:8081/achievements/${selectedAchievement.id_Achievement}`
      );
  
      // Patikriname, ar sėkmingai pašalintas pasiekimas
      if (response.status === 200) {
        // Pašaliname pasiekimą iš vietinio sąrašo, kad atnaujintume UI
        setAchievements(achievements.filter((a) => a.id_Achievement !== selectedAchievement.id_Achievement));
        setSelectedAchievement(null);
        setPopup(null);
        setAlertMessage(null);
      } else {
        setAlertMessage("Nepavyko ištrinti pasiekimo");
        setPopup("alert");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      setAlertMessage("Įvyko klaida bandant ištrinti pasiekimą");
      setPopup("alert");
    }
  };

  // Handle updating an achievement
  const updateAchievement = async () => {
    if (!selectedAchievement) {
      setAlertMessage("Pasirinkite pasiekimą pirmiausia!");
      setPopup("alert");
      return;
    }
    try {
      const updatedAchievement = await axios.put(
        `http://localhost:8081/achievements/${selectedAchievement.id_Achievement}`,
        selectedAchievement // Send updated data
      );
      setAchievements(
        achievements.map((a) =>
          a.id_Achievement === updatedAchievement.data.id_Achievement ? updatedAchievement.data : a
        )
      );
      setSelectedAchievement(null);
      setPopup(null);
      setAlertMessage(null);
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  };

  // Inline CSS (no changes)
  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "20px 0",
  };

  const thStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  };

  const tdStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
    cursor: "pointer",
  };

  const selectedRowStyle: React.CSSProperties = {
    ...tdStyle,
    backgroundColor: "#f8d7da",
    boxShadow: "0px 0px 10px 2px #dc3545",
    animation: "pulse 1.5s infinite", // Neon pulsing effect
  };

  const popupStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    border: "1px solid #ccc",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    width: "300px",
    borderRadius: "8px",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  const buttonStyle: React.CSSProperties = {
    margin: "5px",
    padding: "8px 12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "#6c757d",
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    margin: "10px 0",
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  };

  const alertStyle: React.CSSProperties = {
    color: "red",
    fontWeight: "bold",
    marginTop: "20px",
  };

  // Animation for neon pulsing glow
  const pulseAnimation = `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.7);
      }
      50% {
        box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.5);
      }
      100% {
        box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.7);
      }
    }
  `;

  return (
    <div>
      <h1>Pasiekimų valdymas</h1>

      {/* Buttons */}
      <div>
        <button style={buttonStyle} onClick={() => setPopup("add")}>
          Pridėti pasiekimą
        </button>
        <button style={buttonStyle} onClick={() => setPopup("delete")}>
          Ištrinti pasiekimą
        </button>
        <button style={buttonStyle} onClick={() => setPopup("edit")}>
          Redaguoti pasiekimą
        </button>
      </div>

      {/* Alert Message Popup */}
      {popup === "alert" && (
        <div style={overlayStyle} onClick={() => setPopup(null)}></div>
      )}
      {popup === "alert" && (
        <div style={popupStyle}>
          <h3 style={alertStyle}>{alertMessage}</h3>
          <button style={buttonStyle} onClick={() => setPopup(null)}>
            Uždaryti
          </button>
        </div>
      )}

      {/* Table of Achievements */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Žuvies svoris</th>
            <th style={thStyle}>Prizas</th>
            <th style={thStyle}>Data</th>
            <th style={thStyle}>Žuvies kiekis</th>
            <th style={thStyle}>Įrašų kiekis</th>
            <th style={thStyle}>FK Post</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((a) => (
            <tr
              key={a.id_Achievement}
              style={selectedAchievement?.id_Achievement === a.id_Achievement ? selectedRowStyle : tdStyle}
              onClick={() => setSelectedAchievement(a)}
            >
              <td>{a.id_Achievement}</td>
              <td>{a.fish_weight}</td>
              <td>{a.prize}</td>
              <td>{a.date}</td>
              <td>{a.fish_count}</td>
              <td>{a.post_count}</td>
              <td>{a.fk_Post}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popups */}
      {popup && <div style={overlayStyle} onClick={() => setPopup(null)}></div>}
      {popup === "add" && (
        <div style={popupStyle}>
          <h3>Pridėti naują pasiekimą</h3>
          <input
            type="number"
            placeholder="Žuvies svoris"
            value={newAchievement.fish_weight}
            onChange={(e) => setNewAchievement({ ...newAchievement, fish_weight: +e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Prizas"
            value={newAchievement.prize}
            onChange={(e) => setNewAchievement({ ...newAchievement, prize: e.target.value })}
            style={inputStyle}
          />
          <input
            type="date"
            value={newAchievement.date}
            onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Žuvies kiekis"
            value={newAchievement.fish_count}
            onChange={(e) => setNewAchievement({ ...newAchievement, fish_count: +e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Įrašų kiekis"
            value={newAchievement.post_count}
            onChange={(e) => setNewAchievement({ ...newAchievement, post_count: +e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="FK Post"
            value={newAchievement.fk_Post}
            onChange={(e) => setNewAchievement({ ...newAchievement, fk_Post: +e.target.value })}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={createAchievement}>
            Pridėti
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Atšaukti
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {popup === "delete" && selectedAchievement && (
        <div style={popupStyle}>
          <h3>Ar tikrai norite ištrinti “{selectedAchievement.prize}”?</h3>
          <button style={buttonStyle} onClick={deleteAchievement}>
            Taip
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Ne
          </button>
        </div>
      )}

      {/* Edit Achievement */}
      {popup === "edit" && selectedAchievement && (
        <div style={popupStyle}>
          <h3>Redaguoti pasiekimą</h3>
          <input
            type="number"
            value={selectedAchievement.fish_weight}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, fish_weight: +e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="text"
            value={selectedAchievement.prize}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, prize: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="date"
            value={selectedAchievement.date}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, date: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            value={selectedAchievement.fish_count}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, fish_count: +e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            value={selectedAchievement.post_count}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, post_count: +e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            value={selectedAchievement.fk_Post}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, fk_Post: +e.target.value })
            }
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={updateAchievement}>
            Atnaujinti
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Atšaukti
          </button>
        </div>
      )}

      <style>{pulseAnimation}</style>
    </div>
  );
};

export default AchievementsPage;