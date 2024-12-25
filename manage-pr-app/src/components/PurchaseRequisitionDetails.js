import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const GET_PR_API_URL = BASE_URL + "/api/v1/purchase_requisitions";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy HH:mm:ss"); // Example format: 'December 22, 2024 09:37:11'
};

function PurchaseRequisitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [requisition, setRequisition] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // State for toggling edit mode
  const [description, setDescription] = useState(""); // State for description input
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state

  useEffect(() => {
    axios.get(`${GET_PR_API_URL}/${id}`).then((res) => {
      setRequisition(res.data);
      setDescription(res.data.description); // Set initial description from API response
    });
  }, [id]);

  const handleToggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode); // Toggle between edit and view mode
  };

  const handleUpdate = () => {
    const updatedRequisition = { ...requisition, description };
    axios
      .put(`${GET_PR_API_URL}/${id}`, updatedRequisition)
      .then((response) => {
        setRequisition(response.data); // Update the requisition data with the new description
        setIsEditMode(false); // Switch back to display mode after update
      })
      .catch((error) => {
        console.error("Error updating requisition:", error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${GET_PR_API_URL}/${id}`)
      .then(() => {
        navigate("/"); // Redirect back to list page after deletion
      })
      .catch((error) => {
        console.error("Error deleting requisition:", error);
      });
  };

  if (!requisition) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">
          Purchase Requisition Details
        </h1>
        <p>
          <strong>ID:</strong> {requisition.id}
        </p>
        <p>
          <strong>Type:</strong> {requisition.pr_type}
          {requisition.pr_type_desc && (
            <span className="text-sm text-gray-500">
              ({requisition.pr_type_desc})
            </span>
          )}
        </p>
        <div>
          {isEditMode ? (
            // Editable field when in edit mode
            <div>
              <strong>Description:</strong>
              <textarea
                className="w-full mt-2 p-4 border border-gray-300 rounded-md"
                rows="4"
                value={description} // Use state for textarea value
                onChange={(e) => setDescription(e.target.value)} // Update description state
              />
            </div>
          ) : (
            // Display the description in view mode
            <p>
              <strong>Description:</strong> {requisition.description}
            </p>
          )}
        </div>
        <p>
          <strong>Created At:</strong> {formatDate(requisition.created_at)}
        </p>
        <p>
          <strong>Updated At:</strong> {formatDate(requisition.updated_at)}
        </p>
      </div>
      <div className="flex space-x-6 mt-6 flex-wrap">
        {/* Toggle button to switch between view and edit mode */}
        <button
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleToggleEditMode}
        >
          {isEditMode ? "Cancel" : "Edit"}
        </button>
        {isEditMode && (
          // Show the "Update" button only in edit mode
          <button
            className="mr-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
        {/* Delete button */}
        <button
          className="mr-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </button>
      </div>
      <button
        className="mr-4 bg-green-500 mt-6 px-4 py-2 text-white rounded"
        onClick={() => navigate(-1)}
      >
        Back to List
      </button>

      {/* Delete Confirmation Popup */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p>
              Do you really want to delete this purchase requisition? This
              action cannot be undone.
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                className="mr-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete} // Handle deletion
              >
                Yes, Delete
              </button>
              <button
                className="mr-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => setIsDeleteModalOpen(false)} // Close the modal
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseRequisitionDetails;
