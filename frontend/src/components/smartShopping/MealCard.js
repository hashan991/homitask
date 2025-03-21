import React from "react";

const MealCard = ({ meal }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white m-2">
      <h3 className="text-lg font-semibold">{meal.name}</h3>
      <p className="text-sm text-gray-600">{meal.description}</p>

      {/* 🔹 Display Category */}
      <p className="text-sm font-medium text-blue-500">
        <strong>Category:</strong> {meal.category}
      </p>

      {/* 🔹 Separate Calories & Price into Two Rows */}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-700">
          <strong>Calories:</strong> {meal.calories} kcal
        </p>
        <p className="text-sm font-bold text-green-600">
          <strong>Price:</strong> ${meal.price}
        </p>
      </div>
    </div>
  );
};

export default MealCard;
