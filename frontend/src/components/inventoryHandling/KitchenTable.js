import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KitchenTable() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const THRESHOLD = 10; // Permanent threshold value

  // Function to fetch inventory items from the server
  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:8070/api/inventory");
      if (response.ok) {
        const data = await response.json();

        // Group items by name and sum their quantities
        const groupedInventory = data.reduce((acc, item) => {
          const key = item.name.toLowerCase(); // Use lowercase name as key
          if (acc[key]) {
            acc[key].quantity += item.quantity; // Sum the quantity
          } else {
            acc[key] = { ...item }; // Store the first occurrence
          }
          return acc;
        }, {});

        // Convert grouped object to an array
        setInventory(Object.values(groupedInventory));
      } else {
        console.error("Failed to fetch inventory");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch inventory when the component mounts
  useEffect(() => {
    fetchInventory();
  }, []);

  // Function to handle updating an inventory item
  const handleUpdate = (item) => {
    navigate("/dashinventoryform", { state: { item } });
  };

  // Function to handle deleting an inventory item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8070/api/inventory/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchInventory(); // Refresh the table after deletion
        alert("Inventory item deleted successfully");
      } else {
        console.error("Failed to delete inventory item");
        alert("Failed to delete inventory item.");
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("An error occurred while deleting the inventory item.");
    }
  };

  // Filter inventory based on search query and category "kitchen"
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.category.toLowerCase() === "kitchen"
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000", textAlign: "center" }}>
        Kitchen Inventory
      </h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by Item Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "300px",
            marginRight: "20px",
          }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000000" }}>
        <thead>
          <tr style={{ backgroundColor: "#7D2CE0", color: "#fff" }}>
            <th style={{ border: "1px solid #000000", padding: "12px" }}>Item Name</th>
            <th style={{ border: "1px solid #000000", padding: "12px" }}>Quantity</th>
            <th style={{ border: "1px solid #000000", padding: "12px" }}>Category</th>
            <th style={{ border: "1px solid #000000", padding: "12px" }}>Quantity Type</th> {/* Added Quantity Type */}
            <th style={{ border: "1px solid #000000", padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item._id} style={{ backgroundColor: "#fff" }}>
              <td style={{ border: "1px solid #000000", padding: "12px" }}>{item.name}</td>
              <td
                style={{
                  border: "1px solid #000000",
                  padding: "12px",
                  color: item.quantity < THRESHOLD ? "red" : "black", // Red color for low stock
                  fontWeight: item.quantity < THRESHOLD ? "bold" : "normal",
                }}
              >
                {item.quantity} {item.quantity < THRESHOLD ? "🔴 😞" : ""}
              </td>
              <td style={{ border: "1px solid #000000", padding: "12px" }}>{item.category}</td>
              <td style={{ border: "1px solid #000000", padding: "12px" }}>{item.quantityType}</td> {/* Displaying Quantity Type */}
              <td style={{ border: "1px solid #000000", padding: "12px", textAlign: "center" }}>
                <button
                  onClick={() => handleUpdate(item)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
