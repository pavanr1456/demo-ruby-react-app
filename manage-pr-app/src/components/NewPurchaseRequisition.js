// src/components/NewPurchaseRequisition.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const CREATE_REQ_API_URL = BASE_URL + "/api/v1/purchase_requisitions";

function NewPurchaseRequisition() {
  const [prType, setPrType] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([{ item_name: "", quantity: 1, unit_price: 0, notes: "" }]);
  const [errors, setErrors] = useState({});
  const [generalErrors, setGeneralErrors] = useState([]);
  const navigate = useNavigate();

  const handleAddItem = () => {
    setItems([...items, { item_name: "", quantity: 1, unit_price: 0, notes: "" }]);
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] = e.target.value;
    setItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequisition = {
      pr_type: prType,
      description: description,
      purchase_requisition_items_attributes: items.map((item) => ({
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total_price: item.quantity * parseFloat(item.unit_price),
        notes: item.notes,
      })),
    };

    axios
      .post(CREATE_REQ_API_URL, { purchase_requisition: newRequisition })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          // Separate general errors and field-specific errors
          setErrors({
            pr_type: errorData.pr_type || null,
            description: errorData.description || null,
          });
          setGeneralErrors(
            Object.entries(errorData)
              .filter(([key]) => key !== "pr_type" && key !== "description")
              .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
          );
        }
        console.error("Error creating requisition:", error);
      });
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="p-8">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Purchase Requisition</h1>
        <form onSubmit={handleSubmit}>
          {/* General Errors */}
          {generalErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 text-red-600 rounded">
              <ul>
                {generalErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* PR Type */}
          <div className="mb-4">
            <label htmlFor="prType" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="prType"
              value={prType}
              onChange={(e) => setPrType(e.target.value)}
              className={`w-full px-4 py-2 border ${errors.pr_type ? "border-red-500" : "border-gray-300"} rounded-md`}
              required
            >
              <option value="">Select Type</option>
              <option value="NB">NB (Standard Purchase Requisition)</option>
              <option value="NBS">NBS (Standard Purchase Requisition)</option>
              <option value="RV">RV (Outline Agreement)</option>
              <option value="ZNB">ZNB (Custom Purchase Requisition)</option>
            </select>
            {errors.pr_type && <p className="text-red-500 text-sm">{errors.pr_type[0]}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"}`}
              rows="4"
              required
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description[0]}</p>}
          </div>

          {/* Items */}
          <div className="mb-4">
            <h2 className="text-xl font-medium mb-2">Items</h2>
            {items.map((item, index) => (
              <div key={index} className="mb-4 flex gap-4 items-center">
                <div className="w-1/4">
                  <label className="block text-sm font-medium">Item Name</label>
                  <input
                    type="text"
                    name="item_name"
                    value={item.item_name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="w-1/6">
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border rounded-md"
                    min="1"
                    required
                  />
                </div>
                <div className="w-1/6">
                  <label className="block text-sm font-medium">Unit Price</label>
                  <input
                    type="number"
                    name="unit_price"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border rounded-md"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={item.notes}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Add Item
            </button>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="mt-6">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="ml-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPurchaseRequisition;
