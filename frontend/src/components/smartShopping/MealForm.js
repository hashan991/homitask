import React, { useState } from "react";

const MealForm = ({ onMealSubmit }) => {
  const [meal, setMeal] = useState({
    name: "",
    description: "",
    price: "",
    calories: "",
    category: "Breakfast",
  });

  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onMealSubmit(meal);
    setMeal({
      name: "",
      description: "",
      price: "",
      calories: "",
      category: "Breakfast",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <input
        type="text"
        name="name"
        placeholder="Meal Name"
        className="border p-2 w-full mb-2 rounded-md"
        value={meal.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Meal Description"
        className="border p-2 w-full mb-2 rounded-md"
        value={meal.description}
        onChange={handleChange}
        required
      ></textarea>
      <input
        type="number"
        name="price"
        placeholder="Price ($)"
        className="border p-2 w-full mb-2 rounded-md"
        value={meal.price}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="calories"
        placeholder="Calories"
        className="border p-2 w-full mb-2 rounded-md"
        value={meal.calories}
        onChange={handleChange}
        required
      />
      <select
        name="category"
        className="border p-2 w-full mb-2 rounded-md"
        value={meal.category}
        onChange={handleChange}
      >
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Add Meal
      </button>
    </form>
  );
};

export default MealForm;
