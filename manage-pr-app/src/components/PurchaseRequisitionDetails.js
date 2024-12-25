import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const GET_PR_API_URL = "http://localhost:3000/api/v1/purchase_requisitions";

function PurchaseRequisitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [requisition, setRequisition] = useState(null);

  useEffect(() => {
    axios
      .get(`${GET_PR_API_URL}/${id}`)
      .then((res) => setRequisition(res.data));
  }, [id]);

  if (!requisition) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Purchase Requisition Details</h1>
        <p><strong>ID:</strong> {requisition.id}</p>
        <p><strong>Type:</strong> {requisition.pr_type}</p>
        <p><strong>Description:</strong> {requisition.description}</p>
        <p><strong>Created At:</strong> {requisition.created_at}</p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => navigate(-1)}
      >
        Back to List
      </button>
    </div>
  );
}

export default PurchaseRequisitionDetails;
