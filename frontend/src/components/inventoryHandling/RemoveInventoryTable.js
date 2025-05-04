import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RemoveInventoryTable() {
  const [removedInventory, setRemovedInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch removed inventory items from the server
  const fetchRemovedInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8070/api/removeinventory");
      if (response.ok) {
        const data = await response.json();
        setRemovedInventory(data);
      } else {
        console.error("Failed to fetch removed inventory");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch removed inventory when the component mounts
  useEffect(() => {
    fetchRemovedInventory();
  }, []);

  // Function to handle updating a removed inventory item
  const handleUpdate = (item) => {
    navigate("/dashremoveinventoryform", { state: { item } });
  };

  // Function to handle deleting a removed inventory item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8070/api/removeinventory/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchRemovedInventory();
        alert("Removed inventory item deleted successfully");
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to delete removed inventory item:",
          errorData.message || errorData.error
        );
        alert(
          `Failed to delete removed inventory item: ${
            errorData.message || errorData.error
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting removed inventory item:", error);
      alert("An error occurred while deleting the removed inventory item.");
    }
  };

  // Filter removed inventory based on search query
  const filteredRemovedInventory = removedInventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date function
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#F8FAFC",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#334155",
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "600",
          position: "relative",
        }}
      >
        Removed Inventory
      </h1>

      {/* Search Bar */}
      <div
        style={{
          marginBottom: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "350px",
          }}
        >
          <input
            type="text"
            placeholder="Search by Item Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "12px 20px 12px 45px",
              fontSize: "14px",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              width: "100%",
              backgroundColor: "white",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          />
          <svg
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
              width: "18px",
              height: "18px",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "#64748B",
          }}
        >
          <div
            style={{
              display: "inline-block",
              width: "30px",
              height: "30px",
              border: "3px solid #E2E8F0",
              borderRadius: "50%",
              borderTopColor: "#A78BFA", // Purple spinner color
              animation: "spin 1s linear infinite",
              marginBottom: "15px",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p>Loading removed inventory data...</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          {filteredRemovedInventory.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#64748B",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
              }}
            >
              <svg
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "0 auto 15px",
                  color: "#94A3B8",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>
                No removed inventory items found
              </p>
              <p style={{ fontSize: "14px", marginTop: "5px" }}>
                Any removed items will appear here
              </p>
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0",
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F5F3FF", // Light purple background for header
                    color: "#6D28D9", // Purple text for header
                  }}
                >
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Item Name
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "left",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Expiry Date
                  </th>
                  <th
                    style={{
                      padding: "14px 20px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRemovedInventory.map((item, index) => (
                  <tr
                    key={item._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #E2E8F0",
                        color: "#334155",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #E2E8F0",
                        color: "#334155",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #E2E8F0",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      {item.category}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #E2E8F0",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      {item.quantityType}
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #E2E8F0",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      {formatDate(item.expiryDate)}
                    </td>
                    <td
                      style={{
                        padding: "10px 20px",
                        borderBottom: "1px solid #E2E8F0",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => handleUpdate(item)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#F5F3FF", // Light purple bg
                          color: "#7C3AED", // Purple text
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                          fontSize: "13px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#EDE9FE")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#F5F3FF")
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#FEE2E2",
                          color: "#EF4444",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#FECACA")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#FEE2E2")
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
