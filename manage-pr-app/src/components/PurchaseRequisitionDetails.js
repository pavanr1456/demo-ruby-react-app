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
    <div>
      <h1>Purchase Requisition Details</h1>
      <p>ID: {requisition.id}</p>
      <p>Type: {requisition.pr_type}</p>
      <p>Description: {requisition.description}</p>
      <p>Created At: {requisition.created_at}</p>
      {/* Add update functionality here */}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        style={{
          padding: "10px 20px",
          background: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Back to List
      </button>
    </div>
  );
}

export default PurchaseRequisitionDetails;
