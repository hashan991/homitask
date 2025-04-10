import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderTable() {
  const [Order, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Function to fetch orders from the server
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8070/test/');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle updating an order
  const handleUpdate = (Order) => {
    navigate('/dashOrderForm', { state: { Order } });
  };

  // Function to handle deleting an order
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/test/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchOrders(); // Refresh the table after deletion
        alert('Order deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete order:', errorData.message || errorData.error);
        alert(`Failed to delete order: ${errorData.message || errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('An error occurred while deleting the order.');
    }
  };

  // Filter orders based on search query
  const filteredOrders = Order.filter(order =>
    order.num.toString().includes(searchQuery)
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px', color: '#000000', textAlign: 'center' }}>Order List</h1>
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by Order Number"
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
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
        <thead>
          <tr style={{ backgroundColor: '#7D2CE0', color: '#fff' }}>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Order Name</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Name</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Product Quantity</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Size</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Material</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Material Quantity</th>
            <th style={{ border: '1px solid #000000', padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id} style={{ backgroundColor: '#fff' }}>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{order.num}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{order.name}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{order.qty}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{order.size}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{order.material}</td>
              <td style={{ border: '1px solid #000000', padding: '12px' }}>{order.materialQTY}</td>
              <td style={{ border: '1px solid #000000', padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => handleUpdate(order)}
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
                  onClick={() => handleDelete(order._id)}
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
