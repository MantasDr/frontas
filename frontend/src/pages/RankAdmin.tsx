import React, { useState, useEffect } from "react";

// Define the type for Rank
type RankType = {
  id: number;
  name: string;
  description: string;
  points: number;
  date: string;
};

const RankPage: React.FC = () => {
  const [ranks, setRanks] = useState<RankType[]>([]);

  // Mock data fetch
  useEffect(() => {
    setRanks([
      { id: 1, name: "Naujokas", description: "Pirmas žingsnis", points: 10, date: "2024-01-01" },
      { id: 2, name: "Patyręs", description: "Pasiekta 50 taškų", points: 50, date: "2024-03-15" },
      { id: 3, name: "Ekspertas", description: "Pasiekta 100 taškų", points: 100, date: "2024-06-15" },
    ]);
  }, []);

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
  };

  // Button styles (optional, can be added if necessary)
  const buttonStyle: React.CSSProperties = {
    margin: "5px",
    padding: "8px 12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div>
      <h1>Rangų valdymas</h1>

      {/* Table of Ranks */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Rangas</th>
            <th style={thStyle}>Aprašymas</th>
            <th style={thStyle}>Taškai</th>
            <th style={thStyle}>Data</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td>{r.points}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankPage;