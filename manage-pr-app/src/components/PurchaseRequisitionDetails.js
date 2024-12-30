import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const GET_PR_API_URL = BASE_URL + "/api/v1/purchase_requisitions";
const GET_ITEMS_API_URL = (id) => `${BASE_URL}/api/v1/purchase_requisitions/${id}/items`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy HH:mm:ss");
};

function PurchaseRequisitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requisition, setRequisition] = useState(null);
  const [items, setItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${GET_PR_API_URL}/${id}`).then((res) => {
      setRequisition(res.data);
      setDescription(res.data.description);
    });

    axios.get(GET_ITEMS_API_URL(id)).then((res) => {
      setItems(res.data);
    });
  }, [id]);

  const handleToggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleUpdate = () => {
    const updatedRequisition = { ...requisition, description };
    axios
      .put(`${GET_PR_API_URL}/${id}`, updatedRequisition)
      .then((response) => {
        setRequisition(response.data);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating requisition:", error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${GET_PR_API_URL}/${id}`)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting requisition:", error);
      });
  };

  if (!requisition) return <div>Loading...</div>;

  return (
    <div className="p-8">
      {/* Buttons moved to the top */}
      <div className="flex space-x-6 mb-6">
        <button
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleToggleEditMode}
        >
          {isEditMode ? "Cancel" : "Edit"}
        </button>
        {isEditMode && (
          <button
            className="mr-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
        <button
          className="mr-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => navigate(-1)}
        >
          Back to List
        </button>
      </div>

      {/* Purchase Requisition Details */}
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Purchase Requisition Details</h1>
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
            <div>
              <strong>Description:</strong>
              <textarea
                className="w-full mt-2 p-4 border border-gray-300 rounded-md"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          ) : (
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

      {/* Items Table */}
      <div className="bg-white shadow-md rounded p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Items</h2>
        {items.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Item Name</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Unit Price</th>
                <th className="border border-gray-300 px-4 py-2">Total Price</th>
                <th className="border border-gray-300 px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.item_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${Number(item.unit_price || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ${Number(item.total_price || 0).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items available for this requisition.</p>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p>
              Do you really want to delete this purchase requisition? This action cannot be undone.
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                className="mr-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="mr-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => setIsDeleteModalOpen(false)}
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
