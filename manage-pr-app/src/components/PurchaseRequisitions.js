import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Title } from '@ui5/webcomponents-react';
import {
  Button
} from '@ui5/webcomponents-react';
import { Input } from '@ui5/webcomponents-react';
import {
  Table,
  TableRow,
  TableCell,
  TableHeaderRow,
  TableHeaderCell,
  TableSelection
} from '@ui5/webcomponents-react';
import { FilterBar } from '@ui5/webcomponents-react';
import { Page } from '@ui5/webcomponents-react';
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const GET_REQ_API_URL = BASE_URL + "/api/v1/purchase_requisitions";
const DELETE_REQ_API_URL = BASE_URL + "/api/v1/purchase_requisitions/";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy HH:mm:ss"); // Example format: 'December 22, 2024 09:37:11'
};

function getAllRequisitions() {
  return axios.get(GET_REQ_API_URL).then((res) => res.data);
}

function PurchaseRequisitions() {
  const [requisitions, setRequisitions] = useState([]);
  const [selected, setSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
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

  const handleDelete = (id) => {
    // Make DELETE request to API
    axios
      .delete(DELETE_REQ_API_URL + id)
      .then(() => {
        getAllRequisitions().then((updatedRequisitions) => {
          setRequisitions(updatedRequisitions); // Update the state with the new data
        });
      })
      .catch((error) => {
        console.error("Error deleting requisition:", error);
      });
  };

  const filteredRequisitions = requisitions.filter((req) =>
    Object.values(req)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Page
      backgroundDesign="Solid"
      style={{
        height: '1000px',
        border: '0px'
      }}
    >

<FilterBar
  filterContainerWidth="13.125rem"
  header={<Title level="H2" size="H4">Purchase Requisitions</Title>}
  onAfterFiltersDialogOpen={function Ki() { }}
  onClear={() => setSearchQuery("")} 
  showGoOnFB={true}
  onGo={() => {}}
  search={
    <Input
      id="searchField"
      value={searchQuery}
      onInput={(e) => setSearchQuery(e.target.value)} 
    />
  }
/>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
        <Button
          design="Default"
          onClick={() => navigate("/pr/new")}
        >
          New Purchase Requisition
        </Button>
        <Button style={{ display: "flex", marginLeft: "5px"}}
          design="Default"
          onClick={() => handleDelete(selected)}
        >
          Delete
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          headerRow={<TableHeaderRow sticky><TableHeaderCell minWidth="200px" width="200px"><span>ID</span></TableHeaderCell>
            <TableHeaderCell minWidth="200px"><span>Type</span></TableHeaderCell>
            <TableHeaderCell minWidth="200px"><span>Description</span></TableHeaderCell>
            <TableHeaderCell maxWidth="200px" minWidth="100px"><span>Created At</span></TableHeaderCell>
            <TableHeaderCell minWidth="200px"><span>Update At</span></TableHeaderCell>
          </TableHeaderRow>}
          features={<TableSelection slot="features" mode="single" onChange={(e) => setSelected(e.target.selected)} />}
          onRowClick={(oEvent) => {
            const row = oEvent.detail.row;
            const cells = row.children;
            const cellValues = Array.from(cells).map(cell => cell.textContent);
            navigate(`/pr/${cellValues[0]}`)
          }}
        >

          {filteredRequisitions.map((row) => (
            <TableRow rowKey={row.id} key={row.id} interactive="true">
              <TableCell><span>{row.id}</span></TableCell>
              <TableCell><span>{row.pr_type}{" "}
                {row.pr_type_desc && (
                  <span className="text-sm text-gray-500">({row.pr_type_desc})</span>
                )}</span></TableCell>
              <TableCell><span>{row.description}</span></TableCell>
              <TableCell><span>{formatDate(row.created_at)}</span></TableCell>
              <TableCell><span>{formatDate(row.updated_at)}</span></TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </Page>
  );
}

export default PurchaseRequisitions;
