# 🏠 Homitask – Smart Home Inventory & Meal Planning System

**Homitask** is an intelligent household assistant system that leverages automation and AI principles to streamline home inventory, meal planning, and budget tracking. The platform helps families reduce food waste, manage stock efficiently, and save time through smart suggestions and reports.

---

## ✨ Key Features

- 🍽️ **Meal Management**  
  Add and manage meals categorized by time (Breakfast, Lunch, Dinner, Snacks), each with ingredients, calories, and pricing.

- 📅 **Smart Meal Planning**  
  Generate weekly meal plans that respect user-defined budgets and reuse past meals intelligently.

- 🛒 **Smart Shopping List**  
  Automatically generate ingredient shopping lists from the meal plan, grouped and optimized by quantity and units.

- 📋 **Custom Shopping Entries**  
  Add personalized shopping items manually with categories, estimated pricing, and priorities (High, Medium, Low).

- 📦 **Inventory Management**  
  Track inventory by category, quantity, expiry date, and low-stock threshold with alerting.

- 💰 **Budget Control**  
  Define, store, and track budgets to ensure grocery and meal planning stays within financial limits.

- 📊 **Analytics & Insights** *(Future-ready)*  
  Visual dashboards for stock trends, cost breakdowns, calorie analysis, and meal usage frequency.

---

## 🧠 How It Works

1. ➕ **Users add meals** with pricing, ingredients, calories, and type.  
2. 💸 **Set a weekly budget** (e.g., 5000 LKR).  
3. 🧠 **System suggests a meal plan** optimized for past meals and budget.  
4. 🛒 **Auto-generate a shopping list** from required ingredients.  
5. 📦 **Inventory adjusts dynamically** as items are used or removed.

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|-------------|------------------------------|
| Backend     | Node.js, Express.js          |
| Database    | MongoDB, Mongoose ODM        |
| Reports     | jsPDF, autoTable             |
| Frontend    | *(Optional - React.js planned)* |

---

## 📁 Data Model Overview

| Model              | Description |
|--------------------|-------------|
| `Inventory`         | Tracks current stock with quantity, expiry, and thresholds. |
| `RemoveInventory`   | Logs removed/expired items from inventory. |
| `MealPlan`          | Day-wise planned meals with meal type and recipe. |
| `Meal`              | Reusable meal objects with ingredients and nutritional data. |
| `ShoppingList`      | Auto-generated list of ingredients based on meal plan. |
| `Shopping`          | Manually added items with categories, priority, and estimated price. |
| `Budget`            | Stores weekly or monthly grocery budget constraints. |

---

## ⚙️ Getting Started

### 🧩 Prerequisites

Ensure the following are installed:

- Node.js ≥ v14.x  
- MongoDB instance (Local or MongoDB Atlas)  
- Git  

---

### 📦 Installation

Clone the project:

```bash
git clone https://github.com/your-username/homitask.git
cd homitask
