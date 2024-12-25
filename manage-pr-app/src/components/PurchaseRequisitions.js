import React, { useEffect, useState } from 'react'
import axios from "axios";

const GET_REQ_API_URL = "http://localhost:3000/api/v1/purchase_requisitions";

function getAllRequisitions() {
    return axios.get(GET_REQ_API_URL).then(res => res.data);
}

function PurchaseRequisitions() {
    const [requisitions, setRequisitions] = useState([]);
    useEffect(() => {
        let mounted = true;
        getAllRequisitions().then( (reqs) => {
            if (mounted) {
                setRequisitions(reqs);
            }
        })
        return () => {mounted = false};
    }, []);
    
  return (
    <div>
      {requisitions.map((req) => {return <div key={req.id}>Purchase Requisition with ID {req.id}, type: {req.pr_type} and description: "{req.description}" was created at {req.created_at} </div>})}
    </div>
  )
}

export default PurchaseRequisitions
