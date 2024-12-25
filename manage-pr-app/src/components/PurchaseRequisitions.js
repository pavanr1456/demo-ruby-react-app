import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GET_REQ_API_URL = "http://localhost:3000/api/v1/purchase_requisitions";

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
    <div>
      {/* <div>
        {requisitions.map((req) => {
          return (
            <div key={req.id}>
              Purchase Requisition with ID {req.id}, type: {req.pr_type} and
              description: "{req.description}" was created at {req.created_at}{" "}
            </div>
          );
        })}
      </div> */}
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Purchase Requisition ID</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Created at</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requisitions.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.pr_type}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">{row.created_at}</TableCell>
                  <TableCell align="right">
                <button
                  onClick={() => navigate(`/pr/${row.id}`)}
                  style={{ cursor: "pointer", padding: "5px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  View/Edit
                </button>
              </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default PurchaseRequisitions;
