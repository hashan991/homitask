import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InventoryTable() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch inventory items from the server
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8070/api/inventory");
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      } else {
        console.error("Failed to fetch inventory");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
        await fetchInventory();
        alert("Inventory item deleted successfully");
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to delete inventory item:",
          errorData.message || errorData.error
        );
        alert(
          `Failed to delete inventory item: ${
            errorData.message || errorData.error
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("An error occurred while deleting the inventory item.");
    }
  };

  // Filter inventory based on search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to check if date is approaching expiry (within 7 days)
  const isApproachingExpiry = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const differenceInDays = Math.floor(
      (expiryDate - today) / (1000 * 60 * 60 * 24)
    );
    return differenceInDays >= 0 && differenceInDays <= 7;
  };

  // Function to check if date is expired
  const isExpired = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    return expiryDate < today;
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
        }}
      >
        Inventory Management
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
              borderTopColor: "#6366F1",
              animation: "spin 1s linear infinite",
              marginBottom: "15px",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p>Loading inventory data...</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          {filteredInventory.length === 0 ? (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                ></path>
              </svg>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>
                No inventory items found
              </p>
              <p style={{ fontSize: "14px", marginTop: "5px" }}>
                Try adjusting your search or add new items
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
                    backgroundColor: "#F1F5F9",
                    color: "#475569",
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
                {filteredInventory.map((item, index) => {
                  const isExpiringSoon = isApproachingExpiry(item.expiryDate);
                  const hasExpired = isExpired(item.expiryDate);

                  return (
                    <tr
                      key={item._id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
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
                          color: hasExpired
                            ? "#EF4444"
                            : isExpiringSoon
                            ? "#F59E0B"
                            : "#334155",
                          fontSize: "14px",
                          fontWeight:
                            hasExpired || isExpiringSoon ? "600" : "400",
                        }}
                      >
                        {new Date(item.expiryDate).toLocaleDateString()}
                        {hasExpired && (
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "11px",
                              padding: "2px 8px",
                              backgroundColor: "#FEE2E2",
                              color: "#EF4444",
                              borderRadius: "20px",
                              marginLeft: "8px",
                            }}
                          >
                            Expired
                          </span>
                        )}
                        {isExpiringSoon && !hasExpired && (
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "11px",
                              padding: "2px 8px",
                              backgroundColor: "#FEF3C7",
                              color: "#F59E0B",
                              borderRadius: "20px",
                              marginLeft: "8px",
                            }}
                          >
                            Expiring soon
                          </span>
                        )}
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
                            backgroundColor: "#EBF5FF",
                            color: "#3B82F6",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginRight: "8px",
                            fontSize: "13px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#DBEAFE")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#EBF5FF")
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
