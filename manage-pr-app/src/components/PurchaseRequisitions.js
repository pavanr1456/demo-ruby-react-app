import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";


const GET_REQ_API_URL = "http://localhost:3000/api/v1/purchase_requisitions";



const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMMM dd, yyyy HH:mm:ss'); // Example format: 'December 22, 2024 09:37:11'
};

function getAllRequisitions() {
  return axios.get(GET_REQ_API_URL).then((res) => res.data);
}

function PurchaseRequisitions() {
  const [requisitions, setRequisitions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    let mounted = true;
    getAllRequisitions().then((reqs) => {
      if (mounted) {
        setRequisitions(reqs);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Requisitions</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/pr/new")}
        >
          New Purchase Requisition
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Updated At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requisitions.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{row.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.pr_type}{" "}
                  {row.pr_type_desc && (
                    <span className="text-sm text-gray-500">({row.pr_type_desc})</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.description}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(row.created_at)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(row.updated_at)}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => navigate(`/pr/${row.id}`)}
                  >
                    View/Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseRequisitions;
