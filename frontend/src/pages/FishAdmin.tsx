import React, { useState, useEffect } from "react";

// Define the type for Fish
type FishType = {
  id: number;
  name: string;
  type: string;
  size: number;
  location?: string;  // Not saved in database
  description?: string;  // Not saved in database
  picture?: string;
};

const FishPage: React.FC = () => {
  const [fishes, setFishes] = useState<FishType[]>([]);
  const [popup, setPopup] = useState<"add" | "edit" | "delete" | "alert" | null>(null);
  const [selectedFish, setSelectedFish] = useState<FishType | null>(null);
  const [newFish, setNewFish] = useState({
    name: "",
    type: "",
    size: 0,
    picture: "",
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // Fetch fish data from Wikipedia API
  //   fetchFishFromWikipedia();
  // }, []);

  const fetchFishFromWikipedia = async () => {
    setLoading(true);
    let allFish = [];
    let continueToken;
  
    try {
      do {
        const url = new URL("https://en.wikipedia.org/w/api.php");
        url.searchParams.append("action", "query");
        url.searchParams.append("format", "json");
        url.searchParams.append("list", "categorymembers");
        url.searchParams.append("cmtitle", "Category:Fish_species");
        url.searchParams.append("cmlimit", "200");
        url.searchParams.append("cmcontinue", continueToken || "");
        url.searchParams.append("origin", "*");
  
        const response = await fetch(url.toString());
        const data = await response.json();
  
        if (data.query && data.query.categorymembers) {
          const fishBatch = data.query.categorymembers.map((member) => ({
            name: member.title,
            type: "Unknown",
            size: 0,
            description: "No description available",
            picture: member.thumbnail?.source || "",
          }));
          allFish = [...allFish, ...fishBatch];
        }
  
        continueToken = data.continue?.cmcontinue;
      } while (continueToken);
  
      const enrichedFish = await Promise.all(
        allFish.map((fish) => fetchFishDetails(fish))
      );
  
      setFishes(enrichedFish);
  
      // Send the fish data to the backend
      const response = await fetch("http://localhost:8081/fishes/wikipedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedFish.map(({ id, ...rest }) => rest)),
      });
      
  
      if (response.ok) {
        setAlertMessage("Fishes successfully added to the database!");
      } else {
        setAlertMessage("Failed to save fishes to the database.");
      }
    } catch (error) {
      console.error("Error fetching data from Wikipedia:", error);
      setAlertMessage("Error occurred while fetching Wikipedia data.");
    }
    setLoading(false);
  };
  
  

  const fetchFishDetails = async (fish: FishType): Promise<FishType> => {
    try {
      const url = new URL("https://en.wikipedia.org/w/api.php");
      url.searchParams.append("action", "query");
      url.searchParams.append("format", "json");
      url.searchParams.append("prop", "description|pageimages|infobox");
      url.searchParams.append("pageids", fish.id.toString());
      url.searchParams.append("pithumbsize", "200");
      url.searchParams.append("origin", "*");
  
      const response = await fetch(url.toString());
      const data = await response.json();
  
      const page = data.query?.pages[fish.id];
      if (page) {
        const updatedFish: FishType = {
          ...fish,
          description: page.description || "No description available",
          picture: page.thumbnail?.source || "",
          size: extractSizeFromText(page.extract || ""),
          location: extractLocationFromText(page.extract || ""),
        };
        return updatedFish;
      }
    } catch (error) {
      console.error("Error fetching fish details:", error);
    }
    return fish;
  };
  

  const extractSizeFromText = (text: string): number => {
    const sizeMatch = text.match(/(length|weight):? ?(\d+\.?\d*)\s?(cm|kg)?/i);
    return sizeMatch ? parseFloat(sizeMatch[2]) : 0;
  };
  
  const extractLocationFromText = (text: string): string => {
    const locationMatch = text.match(/habitat:? ?([a-zA-Z\s,]+(?:ocean|sea|lake|river)?)/i);
    return locationMatch ? locationMatch[1] : "";
  };
  // Mock data fetch
  useEffect(() => {
    fetchFishesFromBackend();
  }, []);
  
  const fetchFishesFromBackend = async () => {
    try {
      const response = await fetch("http://localhost:8081/fishes");
      if (response.ok) {
        const data = await response.json();
        setFishes(data);  // Assuming the API returns an array of fish objects
      } else {
        console.error("Failed to fetch fish data.");
      }
    } catch (error) {
      console.error("Error fetching fish data:", error);
    }
  };

  const createFish = () => {
    if (!newFish.name || !newFish.type  || newFish.size <= 0) {
      return alert("Fill in all fields with valid data.");
    }
    const newId = fishes.length ? Math.max(...fishes.map((f) => f.id)) + 1 : 1;
    const newFishEntry = { id: newId, ...newFish };
    setFishes([...fishes, newFishEntry]);
    setNewFish({ name: "", type: "", size: 0, picture: ""});
    setPopup(null);
  };

  const deleteFish = (id: number) => {
    setFishes(fishes.filter((f) => f.id !== id));
    setSelectedFish(null);
    setPopup(null);
  };

  const updateFish = () => {
    if (!selectedFish) return;
    setFishes(fishes.map((f) => (f.id === selectedFish.id ? selectedFish : f)));
    setSelectedFish(null);
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
      <h1>Žuvų Valdymas</h1>

      {/* Buttons */}
      <div>
        <button style={buttonStyle} onClick={() => setPopup("add")}>
          Pridėti Žuvį
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

      {/* Table of Fishes */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Pavadinimas</th>
            <th style={thStyle}>Rūšis</th>
            <th style={thStyle}>Dydis</th>
            <th style={thStyle}>Lokacija</th>
            <th style={thStyle}>Nuotrauka</th>
            <th style={thStyle}>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {fishes.map((f) => (
            <tr
              key={f.id}
              style={selectedFish?.id === f.id ? selectedRowStyle : tdStyle}
              onClick={() => setSelectedFish(f)} // Set selected fish on row click
            >
              <td>{f.id}</td>
              <td>{f.name}</td>
              <td>{f.type}</td>
              <td>{f.size}</td>
              <td>{f.location}</td>
              <td>
                  {f.picture && <img src={f.picture} alt={f.name} style={{ width: "10px" }} />}
              </td>
              <td>
                <button
                  style={buttonStyle}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent the row click event from firing
                    setSelectedFish(f); // Pass the fish data
                    setPopup("edit");
                  }}
                >
                  Redaguoti
                </button>
                <button
                  style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent the row click event from firing
                    setSelectedFish(f); // Pass the fish data
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
          <h3>Pridėti Naują Žuvį</h3>
          <input
            type="text"
            placeholder="Pavadinimas"
            value={newFish.name}
            onChange={(e) => setNewFish({ ...newFish, name: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Rūšis"
            value={newFish.type}
            onChange={(e) => setNewFish({ ...newFish, type: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Dydis"
            value={newFish.size}
            onChange={(e) => setNewFish({ ...newFish, size: +e.target.value })}
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={createFish}>
            Pridėti
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Atšaukti
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {popup === "delete" && selectedFish && (
        <div style={popupStyle}>
          <h3>Ar tikrai norite ištrinti „{selectedFish.name}“?</h3>
          <button style={buttonStyle} onClick={() => deleteFish(selectedFish.id)}>
            Taip
          </button>
          <button style={cancelButtonStyle} onClick={() => setPopup(null)}>
            Ne
          </button>
        </div>
      )}

      {/* Edit Fish */}
      {popup === "edit" && selectedFish && (
        <div style={popupStyle}>
          <h3>Redaguoti Žuvį</h3>
          <input
            type="text"
            value={selectedFish.name}
            onChange={(e) =>
              setSelectedFish({ ...selectedFish, name: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="text"
            value={selectedFish.type}
            onChange={(e) =>
              setSelectedFish({ ...selectedFish, type: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            value={selectedFish.size}
            onChange={(e) =>
              setSelectedFish({ ...selectedFish, size: +e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="text"
            value={selectedFish.location}
            onChange={(e) => 
              setSelectedFish({ ...selectedFish, location: e.target.value })
            }
            style={inputStyle}
          />
          <button style={buttonStyle} onClick={updateFish}>
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

export default FishPage;
