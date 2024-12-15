import React, { useState, useEffect } from "react";

// Define the type for Achievement
type AchievementType = {
  id: number;
  name: string;
  description: string;
  points: number;
  date: string;
};

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [popup, setPopup] = useState<"add" | "edit" | "delete" | "alert" | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementType | null>(null);
  const [newAchievement, setNewAchievement] = useState({
    name: "",
    description: "",
    points: 0,
    date: "",
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Mock data fetch
  useEffect(() => {
    setAchievements([
      { id: 1, name: "Pirmas žingsnis", description: "Baigtas pirmas pasiekimas", points: 10, date: "2024-01-01" },
      { id: 2, name: "Ekspertas", description: "Pasiekta 100 taškų", points: 100, date: "2024-06-15" },
    ]);
  }, []);

  const createAchievement = () => {
    if (!newAchievement.name || !newAchievement.description || newAchievement.points <= 0 || !newAchievement.date) {
      return alert("Užpildykite visus laukus su teisingais duomenimis.");
    }
    const newId = achievements.length ? Math.max(...achievements.map((a) => a.id)) + 1 : 1;
    const newAchievementEntry = { id: newId, ...newAchievement };
    setAchievements([...achievements, newAchievementEntry]);
    setNewAchievement({ name: "", description: "", points: 0, date: "" });
    setPopup(null);
  };

  const deleteAchievement = () => {
    if (!selectedAchievement) {
      setAlertMessage("Pasirinkite pasiekimą pirmiausia!"); // Show alert if no achievement is selected
      setPopup("alert");
      return;
    }
    setAchievements(achievements.filter((a) => a.id !== selectedAchievement.id));
    setSelectedAchievement(null);
    setPopup(null);
    setAlertMessage(null); // Clear the alert message after action
  };

  const updateAchievement = () => {
    if (!selectedAchievement) {
      setAlertMessage("Pasirinkite pasiekimą pirmiausia!"); // Show alert if no achievement is selected
      setPopup("alert");
      return;
    }
    setAchievements(achievements.map((a) => (a.id === selectedAchievement.id ? selectedAchievement : a)));
    setSelectedAchievement(null);
    setPopup(null);
    setAlertMessage(null); // Clear the alert message after action
  };

  // Inline CSS
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
            <th style={thStyle}>Pavadinimas</th>
            <th style={thStyle}>Aprašymas</th>
            <th style={thStyle}>Taškai</th>
            <th style={thStyle}>Data</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((a) => (
            <tr
              key={a.id}
              style={selectedAchievement?.id === a.id ? selectedRowStyle : tdStyle}
              onClick={() => setSelectedAchievement(a)}
            >
              <td>{a.id}</td>
              <td>{a.name}</td>
              <td>{a.description}</td>
              <td>{a.points}</td>
              <td>{a.date}</td>
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
            type="text"
            placeholder="Pavadinimas"
            value={newAchievement.name}
            onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Aprašymas"
            value={newAchievement.description}
            onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Taškai"
            value={newAchievement.points}
            onChange={(e) => setNewAchievement({ ...newAchievement, points: +e.target.value })}
            style={inputStyle}
          />
          <input
            type="date"
            placeholder="Data"
            value={newAchievement.date}
            onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
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
          <h3>Ar tikrai norite ištrinti “{selectedAchievement.name}”?</h3>
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
            type="text"
            value={selectedAchievement.name}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, name: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="text"
            value={selectedAchievement.description}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, description: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            value={selectedAchievement.points}
            onChange={(e) =>
              setSelectedAchievement({ ...selectedAchievement, points: +e.target.value })
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
