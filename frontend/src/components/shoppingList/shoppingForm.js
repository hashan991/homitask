import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ShoppingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const qtyTypes = ['Unit', 'Kg', 'g', 'L', 'ml', 'm'];
  const categories = ['Kitchen', 'Garden', 'Garage', 'Cleaning'];
  const priorities = ['High', 'Medium', 'Low'];

  const [formData, setFormData] = useState({
    name: '',
    qty: '',
    qtytype: '',
    cate: '',
    pri: '',
    est: '',
  });

  const [errors, setErrors] = useState({});
  const [itemsList, setItemsList] = useState([]);

  // Set the form data if we are updating an existing shopping list
  useEffect(() => {
    if (location.state && location.state.ShoppingItem) {
      const ShoppingItem = location.state.ShoppingItem;
      setFormData({
        name: ShoppingItem.name || '',
        qty: ShoppingItem.qty || '',
        qtytype: ShoppingItem.qtytype || '',
        cate: ShoppingItem.cate || '',
        pri: ShoppingItem.pri || '',
        est: ShoppingItem.est || '',
      });
      setItemsList(ShoppingItem.items || []);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let validValue = value;

    if (name === 'qty' || name === 'est') {
      validValue = value.replace(/[^0-9.]/g, '');
      if (parseFloat(validValue) < 0) validValue = '0';
    }

    setFormData({ ...formData, [name]: validValue });
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

  const handleAddItem = () => {
    if (!validateForm()) return;

    const newItem = { ...formData };

    setItemsList((prevItems) => {
      const index = prevItems.findIndex((item) => item.name === formData.name);
      if (index !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[index] = newItem;
        return updatedItems;
      } else {
        return [...prevItems, newItem];
      }
    });

    setFormData({ name: '', qty: '', qtytype: '', cate: '', pri: '', est: '' });
  };

  const handleDeleteItem = (index) => {
    setItemsList(itemsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemsList.length === 0) {
      alert('No items in the shopping list. Please add items before submitting.');
      return;
    }

    const transformedItems = itemsList.map(item => ({
      name: item.name,
      quantity: parseInt(item.qty, 10),
      quantityType: item.qtytype,
      category: item.cate,
      priority: item.pri,
      estimatedPrice: parseFloat(item.est),
    }));

    try {
      let url, method;

      if (location.state?.ShoppingItem?._id && location.state?.SecondId) {
        url = `http://localhost:8070/rshopping/update/${location.state.ShoppingItem._id}/${location.state.SecondId}`;
        method = 'PUT';
     } else {
        url = 'http://localhost:8070/rshopping/add';
        method = 'POST';
     }
     
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: transformedItems }),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (response.ok) {
        alert('Shopping list added successfully');
        navigate('/dashShoppingTable');
      } else {
        alert(`Failed toadd shopping list. Server response: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the shopping list.');
    }
  };

  const handleViewShoppingList = () => {
    navigate('/dashShoppingTable');
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.title}>{location.state?.ShoppingItem ? 'Update Shopping List' : 'Shopping List Form'}</h2>
      <form onSubmit={handleSubmit}>
        {!location.state?.ShoppingItem && (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              style={styles.input}
            />
            {errors.name && <div style={styles.error}>{errors.name}</div>}

            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              placeholder="Quantity"
              style={styles.input}
            />
            {errors.qty && <div style={styles.error}>{errors.qty}</div>}

            <select
              name="qtytype"
              value={formData.qtytype}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="" disabled>Select Measurement Units</option>
              {qtyTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.qtytype && <div style={styles.error}>{errors.qtytype}</div>}

            <select
              name="cate"
              value={formData.cate}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="" disabled>Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.cate && <div style={styles.error}>{errors.cate}</div>}

            <select
              name="pri"
              value={formData.pri}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="" disabled>Select Priority</option>
              {priorities.map((priority, index) => (
                <option key={index} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {errors.pri && <div style={styles.error}>{errors.pri}</div>}

            <input
              type="number"
              name="est"
              value={formData.est}
              onChange={handleChange}
              placeholder="Estimate Price"
              style={styles.input}
            />
            {errors.est && <div style={styles.error}>{errors.est}</div>}

            <button
              type="button"
              onClick={handleAddItem}
              style={styles.addButton}
            >
              Add to List
            </button>
          </>
        )}

        <ul style={styles.list}>
          {itemsList.map((item, index) => (
            <li key={index} style={styles.listItem}>
              {item.qty} {item.qtytype} - {item.name} ({item.cate}, {item.pri}) - Rs.{item.est}
              <button
                onClick={() => handleDeleteItem(index)}
                style={styles.deleteButton}
              >
                X
              </button>
            </li>
          ))}
        </ul>

        {location.state?.ShoppingItem ? (
          <button
            type="submit"
            style={styles.submitButton}
            disabled={itemsList.length === 0}
          >
            Update Items
          </button>
        ) : (
          <button
            type="submit"
            style={styles.submitButton}
            disabled={itemsList.length === 0}
          >
            Submit All Items
          </button>
        )}

        <button
          type="button"
          onClick={handleViewShoppingList}
          style={styles.viewButton}
        >
          View Shopping List
        </button>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '25px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  input: {
    width: '94%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
    transition: '0.3s',
  },
  select: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
    transition: '0.3s',
  },
  addButton: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: '0.3s',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: '0.3s',
  },
  viewButton: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: '0.3s',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: '10px 0',
  },
  listItem: {
    padding: '12px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '8px',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '14px',
    transition: '0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '-5px',
  },
};

// Add hover effects
styles.addButton[':hover'] = { backgroundColor: '#45a049' };
styles.submitButton[':hover'] = { backgroundColor: '#0056b3' };
styles.viewButton[':hover'] = { backgroundColor: '#e68900' };
styles.deleteButton[':hover'] = { backgroundColor: '#d32f2f' };
