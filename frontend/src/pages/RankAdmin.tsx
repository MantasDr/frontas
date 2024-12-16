import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the type for Rank
type RankType = {
  id_Rank: number;
  name: string;
  exp: number;
};

const RankPage: React.FC = () => {
  const [ranks, setRanks] = useState<RankType[]>([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const response = await axios.get("http://localhost:8081/ranks");
        setRanks(response.data);
      } catch (error) {
        console.error("Error fetching ranks:", error);
      }
    };

    fetchRanks();
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

  return (
    <div>
      <h1>Rangų valdymas</h1>

      {/* Table of Ranks */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Rangas</th>
            <th style={thStyle}>EXP</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((rank) => (
            <tr key={rank.id_Rank}>
              <td>{rank.id_Rank}</td>
              <td>{rank.name}</td>
              <td>{rank.exp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankPage;
