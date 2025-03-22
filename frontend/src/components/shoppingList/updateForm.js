import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ShoppingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    qty: '',
    qtytype: '',
    cate: '',
    pri: '',
    est: '',
  });

  const [errors, setErrors] = useState({});

  // Extract listId and itemId from the location state
  const { list, shoppingItem } = location.state || {};

  // Populate form data when navigating from ShoppingTable for update
  useEffect(() => {
    if (shoppingItem) {
      setFormData({
        name: shoppingItem.name || '',
        qty: shoppingItem.quantity || '',
        qtytype: shoppingItem.quantityType || '',
        cate: shoppingItem.category || '',
        pri: shoppingItem.priority || '',
        est: shoppingItem.estimatedPrice || '',
      });
    }
  }, [shoppingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product Name is required';
    if (!formData.qty || isNaN(formData.qty) || formData.qty <= 0)
      newErrors.qty = 'Quantity should be a positive number';
    if (!formData.est || isNaN(formData.est) || formData.est <= 0)
      newErrors.est = 'Estimate Price should be a positive number';
    if (!formData.qtytype) newErrors.qtytype = 'Please select a quantity type';
    if (!formData.cate) newErrors.cate = 'Please select a category';
    if (!formData.pri) newErrors.pri = 'Please select a priority';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`http://localhost:8070/rshopping/update/${list._id}/${shoppingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          quantity: formData.qty,
          quantityType: formData.qtytype,
          category: formData.cate,
          priority: formData.pri,
          estimatedPrice: formData.est,
        }),
      });

      if (response.ok) {
        alert('Shopping item updated successfully');
        navigate('/dashShoppingTable'); // Navigate back to the shopping table
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('An error occurred while updating the item.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        {shoppingItem ? 'Update Shopping Item' : 'Shopping Form'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            style={inputStyle}
          />
          {errors.name && <div style={errorStyle}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            placeholder="Quantity"
            style={inputStyle}
          />
          {errors.qty && <div style={errorStyle}>{errors.qty}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <select
            name="qtytype"
            value={formData.qtytype}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Select Quantity Type</option>
            <option value="Kg">Kg</option>
            <option value="g">g</option>
            <option value="L">L</option>
            <option value="ml">ml</option>
            <option value="Unit">Unit</option>
          </select>
          {errors.qtytype && <div style={errorStyle}>{errors.qtytype}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <select
            name="cate"
            value={formData.cate}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Select Category</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Garden">Garden</option>
            <option value="Garage">Garage</option>
            <option value="Cleaning">Cleaning</option>
          </select>
          {errors.cate && <div style={errorStyle}>{errors.cate}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <select
            name="pri"
            value={formData.pri}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.pri && <div style={errorStyle}>{errors.pri}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            name="est"
            value={formData.est}
            onChange={handleChange}
            placeholder="Estimate Price"
            style={inputStyle}
          />
          {errors.est && <div style={errorStyle}>{errors.est}</div>}
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '96%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '10px',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '10px',
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginTop: '5px',
};
