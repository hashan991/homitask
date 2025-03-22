import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RemoveInventoryTable() {
  const [removedInventory, setRemovedInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Function to fetch removed inventory items from the server
  const fetchRemovedInventory = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch('http://localhost:8070/api/removeinventory');
      if (response.ok) {
        const data = await response.json();
        setRemovedInventory(data);
      } else {
        console.error('Failed to fetch removed inventory');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when fetch is complete
    }
  };

  // Fetch removed inventory when the component mounts
  useEffect(() => {
    fetchRemovedInventory();
  }, []);

  // Function to handle updating a removed inventory item
  const handleUpdate = (item) => {
    navigate('/dashremoveinventoryform', { state: { item } });
  };

  // Function to handle deleting a removed inventory item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/api/removeinventory/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRemovedInventory(); // Refresh the table after deletion
        alert('Removed inventory item deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete removed inventory item:', errorData.message || errorData.error);
        alert(`Failed to delete removed inventory item: ${errorData.message || errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting removed inventory item:', error);
      alert('An error occurred while deleting the removed inventory item.');
    }
  };

  // Filter removed inventory based on search query
  const filteredRemovedInventory = removedInventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px', color: '#000000', textAlign: 'center' }}>Removed Inventory List</h1>
      
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
      
      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div> // Display loading text or spinner
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
          <thead>
            <tr style={{ backgroundColor: '#7D2CE0', color: '#fff' }}>
              <th style={{ border: '1px solid #000000', padding: '12px' }}>Item Name</th>
              <th style={{ border: '1px solid #000000', padding: '12px' }}>Quantity</th>
              <th style={{ border: '1px solid #000000', padding: '12px' }}>Category</th>
              <th style={{ border: '1px solid #000000', padding: '12px' }}>Quantity Type</th>
              <th style={{ border: '1px solid #000000', padding: '12px' }}>Expire Date</th>
              <th style={{ border: '1px solid #000000', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRemovedInventory.map((item) => (
              <tr key={item._id} style={{ backgroundColor: '#fff' }}>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.name}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.category}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.quantityType}</td>
                <td style={{ border: '1px solid #000000', padding: '12px' }}>{item.expiryDate}</td>
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
      )}
    </div>
  );
}
