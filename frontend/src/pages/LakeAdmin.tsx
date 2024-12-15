import React, { useState, useEffect } from "react";

// Define the type for Ežeras
type EzerasType = {
  id: number;
  name: string;
  type: string;
  depth: number;
  location: string;
};

const EzerasPage: React.FC = () => {
  const [ezeras, setEzeras] = useState<EzerasType[]>([]);
  const [popup, setPopup] = useState<"add" | "edit" | "delete" | "alert" | null>(null);
  const [selectedEzeras, setSelectedEzeras] = useState<EzerasType | null>(null);
  const [newEzeras, setNewEzeras] = useState({
    name: "",
    type: "",
    depth: 0,
    location: "",
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Mock data fetch
  useEffect(() => {
    setEzeras([
      { id: 1, name: "Lake A", type: "Freshwater", depth: 10, location: "Location A" },
      { id: 2, name: "Lake B", type: "Saltwater", depth: 20, location: "Location B" },
    ]);
  }, []);

  const createEzeras = () => {
    if (!newEzeras.name || !newEzeras.type || !newEzeras.location || newEzeras.depth <= 0) {
      return alert("Fill in all fields with valid data.");
    }
    const newId = ezeras.length ? Math.max(...ezeras.map((e) => e.id)) + 1 : 1;
    const newEzersEntry = { id: newId, ...newEzeras };
    setEzeras([...ezeras, newEzersEntry]);
    setNewEzeras({ name: "", type: "", depth: 0, location: "" });
    setPopup(null);
  };

  const deleteEzeras = (id: number) => {
    setEzeras(ezeras.filter((e) => e.id !== id));
    setSelectedEzeras(null);
    setPopup(null);
  };

  const updateEzeras = () => {
    if (!selectedEzeras) return;
    setEzeras(ezeras.map((e) => (e.id === selectedEzeras.id ? selectedEzeras : e)));
    setSelectedEzeras(null);
    setPopup(null);
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
      <h1>Ežerų Valdymas</h1>

      {/* Buttons */}
      <div>
        <button style={buttonStyle} onClick={() => setPopup("add")}>
          Pridėti Ežerą
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
            Užrakinti
          </button>
        </div>
      )}

      {/* Table of Ežerai */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Pavadinimas</th>
            <th style={thStyle}>Tipas</th>
            <th style={thStyle}>Gylis (m)</th>
            <th style={thStyle}>Lokacija</th>
            <th style={thStyle}>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
  {ezeras.map((e) => (
    <tr
      key={e.id}
      style={selectedEzeras?.id === e.id ? selectedRowStyle : tdStyle}
      onClick={() => setSelectedEzeras(e)} // Set selected lake on row click
    >
      <td>{e.id}</td>
      <td>{e.name}</td>
      <td>{e.type}</td>
      <td>{e.depth}</td>
      <td>{e.location}</td>
      <td>
        <button
          style={buttonStyle}
          onClick={(event) => {
            event.stopPropagation(); // Prevent the row click event from firing
            setSelectedEzeras(e); // Pass the lake data
            setPopup("edit");
          }}
        >
          Redaguoti
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
          onClick={(event) => {
            event.stopPropagation(); // Prevent the row click event from firing
            setSelectedEzeras(e); // Pass the lake data
            setPopup("delete");
          }}
        >
          Ištrinti
        </button>
      </td>
    </tr>
  ))}
</tbody>


      </table>

      {/* Popups */}
      {popup && <div style={overlayStyle} onClick={() => setPopup(null)}></div>}
      {popup === "add" && (
        <div style={popupStyle}>
          <h3>Pridėti Naują Ežerą</h3>
          <input
            type="text"
            placeholder="Pavadinimas"
            value={newEzeras.name}
            onChange={(e) => setNewEzeras({ ...newEzeras, name: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Tipas"
            value={newEzeras.type}
            onChange={(e) => setNewEzeras({ ...newEzeras, type: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Gylis"
            value={newEzeras.depth}
            onChange={(e) => setNewEzeras({ ...newEzeras, depth: +e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Lokacija"
            value={newEzeras.location}
            onChange={(e) => setNewEzeras({ ...newEzeras, location: e.target.value })}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={createEzeras}>
            Pridėti
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Atšaukti
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {popup === "delete" && selectedEzeras && (
        <div style={popupStyle}>
          <h3>Ar tikrai norite ištrinti „{selectedEzeras.name}“?</h3>
          <button style={buttonStyle} onClick={() => deleteEzeras(selectedEzeras.id)}>
            Taip
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Ne
          </button>
        </div>
      )}

      {/* Edit Ežeras */}
      {popup === "edit" && selectedEzeras && (
        <div style={popupStyle}>
          <h3>Redaguoti Ežerą</h3>
          <input
            type="text"
            value={selectedEzeras.name}
            onChange={(e) =>
              setSelectedEzeras({ ...selectedEzeras, name: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="text"
            value={selectedEzeras.type}
            onChange={(e) =>
              setSelectedEzeras({ ...selectedEzeras, type: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            value={selectedEzeras.depth}
            onChange={(e) =>
              setSelectedEzeras({ ...selectedEzeras, depth: +e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="text"
            value={selectedEzeras.location}
            onChange={(e) =>
              setSelectedEzeras({ ...selectedEzeras, location: e.target.value })
            }
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={updateEzeras}>
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

export default EzerasPage;
