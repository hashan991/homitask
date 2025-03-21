import React, { useState } from "react";

const BudgetInput = ({ onBudgetSubmit }) => {
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    // Prevent non-numeric values
    if (!/^\d*$/.test(value)) {
      return;
    }

    setBudget(value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedBudget = Number(budget.trim());

    if (!budget || isNaN(parsedBudget) || parsedBudget <= 0) {
      setError("Budget must be a positive whole number!");
      return;
    }

    setError(""); // Clear error if valid
    onBudgetSubmit(parsedBudget);
    setBudget(""); // Reset input
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <input
        type="text" // ✅ Prevents decimal numbers
        placeholder="Enter Budget"
        className="border p-2 rounded-md w-full focus:ring focus:ring-blue-300"
        value={budget}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
      {/* Show error */}
      <button
        type="submit"
        className={`px-4 py-2 rounded-md ${
          !budget
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        disabled={!budget}
      >
        Set Budget
      </button>
    </form>
  );
};

export default BudgetInput;
