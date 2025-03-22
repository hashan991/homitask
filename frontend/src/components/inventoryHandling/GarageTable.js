import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GarageTable() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const THRESHOLD_QUANTITY = 10; // Permanent threshold for quantity
  const THRESHOLD_KG = 1; // Threshold for kg
  const THRESHOLD_L = 1; // Threshold for liters
  const THRESHOLD_M = 1; // Threshold for meters

  // Function to fetch inventory items from the server and group by name
  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:8070/api/inventory');
      if (response.ok) {
        const data = await response.json();
        
        // Group items by name and sum their quantities
        const groupedInventory = data.reduce((acc, item) => {
          const key = item.name.toLowerCase();
          if (acc[key]) {
            acc[key].quantity += item.quantity; // Sum quantity
          } else {
            acc[key] = { ...item }; // Store first occurrence
          }
          return acc;
        }, {});

        setInventory(Object.values(groupedInventory));
      } else {
        console.error('Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch inventory when the component mounts
  useEffect(() => {
    fetchInventory();
  }, []);

  // Function to handle updating an inventory item
  const handleUpdate = (item) => {
    navigate('/dashinventoryform', { state: { item } });
  };

  // Function to handle deleting an inventory item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/api/inventory/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchInventory(); // Refresh the table after deletion
        alert('Inventory item deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete inventory item:', errorData.message || errorData.error);
        alert(`Failed to delete inventory item: ${errorData.message || errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      alert('An error occurred while deleting the inventory item.');
    }
  };

  // Filter inventory based on search query and category "garage"
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) && item.category.toLowerCase() === 'garage'
  );

  // Function to determine if the item is below the threshold based on unit
  const isBelowThreshold = (item) => {
    switch (item.quantityType.toLowerCase()) {
      case "kg":
        return item.quantity <= THRESHOLD_KG;
      case "l":
        return item.quantity <= THRESHOLD_L;
      case "m":
        return item.quantity <= THRESHOLD_M;
      case "quantity":
        return item.quantity <= THRESHOLD_QUANTITY;
      default:
        return false;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px', color: '#000000', textAlign: 'center' }}>Garage Inventory</h1>
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by Item Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '300px',
            marginRight: '20px'
          }}
        />
      </div>
      
      {/* Notes under the table */}
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#555", textAlign: "center" }}>
        <p>1kg &lt; Item = Low stock level</p>
        <p>1L &lt; Item = Low stock level</p>
        <p>10 &lt; Item = Low stock level</p>
        <p>1m &lt; Item = Low stock level</p>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
        <thead>
          <tr style={{ backgroundColor: '#7D2CE0', color: '#fff' }}>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Item Name</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Quantity</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Category</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Quantity Type</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Expiry Date</th> {/* Added Expiry Date column */}
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item._id} style={{ backgroundColor: '#fff' }}>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.name}</td>
              <td 
                style={{ 
                  border: '1px solid #000000', 
                  padding: '12px', 
                  color: isBelowThreshold(item) ? 'red' : 'black', // Red color for low stock
                  fontWeight: isBelowThreshold(item) ? 'bold' : 'normal'
                }}
              >
                {item.quantity} {isBelowThreshold(item) ? '🔴 😞' : ''}
              </td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.category}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.quantityType}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>
                {/* Display Expiry Date */}
                {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
              </td>
              <td style={{ border: '1px solid #000000', padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => handleUpdate(item)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '8px'
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
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
