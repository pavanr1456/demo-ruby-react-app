// src/components/NewPurchaseRequisition.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const CREATE_REQ_API_URL = BASE_URL + "/api/v1/purchase_requisitions";

function NewPurchaseRequisition() {
  const [prType, setPrType] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequisition = {
      pr_type: prType,
      description: description,
    };

    axios
      .post(CREATE_REQ_API_URL, newRequisition)
      .then((response) => {
        // Redirect to the list page after successful creation
        navigate("/");
      })
      .catch((error) => {
        // If there are validation errors, set the errors state
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        console.error("Error creating requisition:", error);
      });
  };
  const handleCancel = () => {
    // Navigate back to the list page when cancel is clicked
    navigate("/");
  };
  return (
    <div className="p-8">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">
          Create New Purchase Requisition
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prType" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="prType"
              value={prType}
              onChange={(e) => setPrType(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.pr_type ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              required
            >
              <option value="">Select Type</option>
              <option value="NB">NB(Standard Purchase Requisition)</option>
              <option value="NBS">NBS(Standard Purchase Requisition)</option>
              <option value="RV">RV(Outline Agreement)</option>
              <option value="ZNB">ZNB(Custom Purchase Requisition)</option>
            </select>
            {errors.pr_type && (
              <p className="text-red-500 text-sm">{errors.pr_type[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows="4"
              required
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description[0]}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
          <button
              type="button"
              onClick={handleCancel} // Navigate to the list page
              className="ml-6 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
        </form>
      </div>
    </div>
  );
}

export default NewPurchaseRequisition;
