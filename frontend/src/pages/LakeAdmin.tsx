import React, { useState, useEffect } from "react";

type EzerasType = {
  id_Lake: number;
  name: string;
  type: string;
  depth: number;
  width: number;
  length: number;
  shores: number;
  district: string;
  x: number;
  y: number;
  recreation_area: boolean;
  fk__Map_settings: number;
};

const EzerasPage: React.FC = () => {
  const [ezeras, setEzeras] = useState<EzerasType[]>([]);
  const [popup, setPopup] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedEzeras, setSelectedEzeras] = useState<EzerasType | null>(null);
  const [newEzeras, setNewEzeras] = useState({
    name: "",
    type: "",
    depth: 0,
    width: 0,
    length: 0,
    shores: 0,
    district: "",
    x: 0,
    y: 0,
    recreation_area: false,
    fk__Map_settings: 1,
  });
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch lakes data from the backend
  useEffect(() => {
    fetch("http://localhost:8081/api/lakes")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEzeras(data);
        } else {
          setError("Failed to load lakes data.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching lakes data.");
        setLoading(false);
      });
  }, []);

  // Add a new lake
  const createEzeras = () => {
    fetch("http://localhost:8081/api/lakes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEzeras),
    })
      .then((response) => response.json())
      .then((data) => {
        setEzeras([...ezeras, { id_Lake: data.id_Lake, ...newEzeras }]);
        setNewEzeras({
          name: "",
          type: "",
          depth: 0,
          width: 0,
          length: 0,
          shores: 0,
          district: "",
          x: 0,
          y: 0,
          recreation_area: false,
          fk__Map_settings: 1,
        });
        setPopup(null); // Close the popup
      })
      .catch((error) => {
        console.error("Error adding lake:", error);
      });
  };

  // Edit an existing lake
  const editEzeras = () => {
    if (selectedEzeras) {
      fetch(`http://localhost:8081/api/lakes/${selectedEzeras.id_Lake}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedEzeras),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update lake");
          }
          return response.json();
        })
        .then((updatedLake) => {
          setEzeras((prevEzeras) =>
            prevEzeras.map((lake) =>
              lake.id_Lake === updatedLake.id_Lake ? updatedLake : lake
            )
          );
          setPopup(null); // Close the popup
        })
        .catch((error) => {
          console.error("Error updating lake:", error);
          alert("Failed to update lake. Please try again.");
        });
    }
  };

  // Delete a lake
  const deleteEzeras = (id: number) => {
    fetch(`http://localhost:8081/api/lakes/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEzeras(ezeras.filter((lake) => lake.id_Lake !== id));
        setPopup(null); // Close the popup
      })
      .catch((error) => {
        console.error("Error deleting lake:", error);
      });
  };

  return (
    <div>
      <button className="button add" onClick={() => setPopup("add")}>
        Pridėti ežerą
      </button>

      {loading ? (
        <p>Kraunasi...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="lake-table">
          <thead>
            <tr>
              <th>Pavadinimas</th>
              <th>Tipas</th>
              <th>Gylis</th>
              <th>Plotis</th>
              <th>Ilgis</th>
              <th>Krantai</th>
              <th>Rajonas</th>
              <th>X</th>
              <th>Y</th>
              <th>Poilsiavietė</th>
              <th>Nustatymai</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {ezeras.map((lake) => (
              <tr key={lake.id_Lake}>
                <td>{lake.name}</td>
                <td>{lake.type}</td>
                <td>{lake.depth}</td>
                <td>{lake.width}</td>
                <td>{lake.length}</td>
                <td>{lake.shores}</td>
                <td>{lake.district}</td>
                <td>{lake.x}</td>
                <td>{lake.y}</td>
                <td>{lake.recreation_area ? "Yes" : "No"}</td>
                <td>{lake.fk__Map_settings}</td>
                <td>
                  <button
                    className="button edit"
                    onClick={() => {
                      setSelectedEzeras(lake);
                      setPopup("edit");
                    }}
                  >
                    Keisti
                  </button>
                  <button
                    className="button delete"
                    onClick={() => {
                      setSelectedEzeras(lake);
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
      )}

      {/* Add Lake Popup */}
      {popup === "add" && (
        <div className="popup">
          <h3>Pridėti naują ežerą</h3>
          <input
            type="text"
            placeholder="Name"
            value={newEzeras.name}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Type"
            value={newEzeras.type}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, type: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Depth"
            value={newEzeras.depth}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, depth: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Width"
            value={newEzeras.width}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, width: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Length"
            value={newEzeras.length}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, length: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Shore Length"
            value={newEzeras.shores}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, shores: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="District"
            value={newEzeras.district}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, district: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="X Coordinate"
            value={newEzeras.x}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, x: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Y Coordinate"
            value={newEzeras.y}
            onChange={(e) =>
              setNewEzeras({ ...newEzeras, y: Number(e.target.value) })
            }
          />
          <label>
            Poilsiavietė
            <input
              type="checkbox"
              checked={newEzeras.recreation_area}
              onChange={(e) =>
                setNewEzeras({
                  ...newEzeras,
                  recreation_area: e.target.checked,
                })
              }
            />
          </label>
          <button onClick={createEzeras}>Pridėti</button>
          <button onClick={() => setPopup(null)}>Atšaukti</button>
        </div>
      )}

      {/* Edit Lake Popup */}
      {popup === "edit" && selectedEzeras && (
        <div className="popup">
          <h3>Keisti ežerą</h3>
          <input
            type="text"
            value={selectedEzeras.name}
            onChange={(e) =>
              setSelectedEzeras({ ...selectedEzeras, name: e.target.value })
            }
          />
          <input
            type="text"
            value={selectedEzeras.type}
            onChange={(e) =>
              setSelectedEzeras({ ...selectedEzeras, type: e.target.value })
            }
          />
          <input
            type="number"
            value={selectedEzeras.depth}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                depth: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            value={selectedEzeras.width}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                width: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            value={selectedEzeras.length}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                length: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            value={selectedEzeras.shores}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                shores: Number(e.target.value),
              })
            }
          />
          <input
            type="text"
            value={selectedEzeras.district}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                district: e.target.value,
              })
            }
          />
          <input
            type="number"
            value={selectedEzeras.x}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                x: Number(e.target.value),
              })
            }
          />
          <input
            type="number"
            value={selectedEzeras.y}
            onChange={(e) =>
              setSelectedEzeras({
                ...selectedEzeras,
                y: Number(e.target.value),
              })
            }
          />
          <label>
            Poilsiavietė
            <input
              type="checkbox"
              checked={selectedEzeras.recreation_area}
              onChange={(e) =>
                setSelectedEzeras({
                  ...selectedEzeras,
                  recreation_area: e.target.checked,
                })
              }
            />
          </label>
          <button onClick={editEzeras}>Išsaugoti</button>
          <button onClick={() => setPopup(null)}>Atšaukti</button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {popup === "delete" && selectedEzeras && (
        <div className="popup">
          <h3>Ar tikrai norite ištrinti ežerą: {selectedEzeras.name}?</h3>
          <button onClick={() => deleteEzeras(selectedEzeras.id_Lake)}>
            Taip
          </button>
          <button onClick={() => setPopup(null)}>Atšaukti</button>
        </div>

      )}
  {/* Popup Overlay */}
  {popup && <div className="popup-overlay" onClick={() => setPopup(null)} />}
  
  <style>{`
        /* General Styling */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
        }

        h3 {
          margin-bottom: 20px;
        }

        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          font-size: 16px;
          margin-right: 10px;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #45a049;
        }

        button:active {
          background-color: #3e8e41;
        }

        .lake-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .lake-table th,
        .lake-table td {
          padding: 12px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .lake-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .lake-table tr:hover {
          background-color: #f1f1f1;
        }

        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          width: 300px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .popup input,
        .popup select {
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          border: 1px solid #ddd;
        }

        .popup input[type="checkbox"] {
          margin-right: 10px;
        }

        .popup button {
          width: 100%;
        }

        .popup button:nth-child(2) {
          background-color: #f44336;
        }

        .popup button:nth-child(2):hover {
          background-color: #e53935;
        }

        .popup button:nth-child(2):active {
          background-color: #d32f2f;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .button.add {
          background-color: #008CBA;
        }

        .button.add:hover {
          background-color: #007bb5;
        }

        .button.add:active {
          background-color: #006d99;
        }

        .button.delete {
          background-color: #f44336;
        }

        .button.delete:hover {
          background-color: #e53935;
        }

        .button.delete:active {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default EzerasPage;
