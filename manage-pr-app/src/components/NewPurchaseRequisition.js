// src/components/NewPurchaseRequisition.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, Breadcrumbs, BreadcrumbsItem, Button, Form, FormItem, Input, Label, ObjectPage, ObjectPageSection, ObjectPageSubSection, ObjectPageTitle, Option, Select, Table, TableCell, TableHeaderCell, TableHeaderRow, TableRow, TextArea } from "@ui5/webcomponents-react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const CREATE_REQ_API_URL = BASE_URL + "/api/v1/purchase_requisitions";

function NewPurchaseRequisition() {
  const [prType, setPrType] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([{ item_name: "", quantity: 1, unit_price: 0, notes: "" }]);
  const [errors, setErrors] = useState({});
  const [generalErrors, setGeneralErrors] = useState([]);
  const [itemErrors, setItemErrors] = useState([]);
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
            pr_type: errorData.pr_type?.length > 0 ? errorData.pr_type[0] : null,
            description: errorData.description?.length > 0 ? errorData.description[0] : null,
          });
          const itemLevelError = {};

          Object.entries(errorData).forEach(([key, value]) => {
            // Extract the index from the key using regex
            const match = key.match(/purchase_requisition_items\[(\d+)\]\.item_name/);
            if (match) {
              const index = match[1]; // Extract the index
              itemLevelError[`item_name[${index}]`] = value[0]; // Add the error message
            }
          });
          setItemErrors(itemLevelError);
        }
      });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const hanldeAddItem = () => {
    setItems([...items, { item_name: "", quantity: 1, unit_price: 0, notes: "" }]);
  };

  return (
    <ObjectPage
      footerArea={<Bar design="FloatingFooter" endContent={<><Button design="Emphasized" onClick={handleSubmit}>Accept</Button><Button design="Default" onClick={handleCancel}>Cancel</Button></>} />}
      mode="Default"
      selectedSectionId="details"
      style={{
        height: '1000px'
      }}
      titleArea={<ObjectPageTitle breadcrumbs={<Breadcrumbs onItemClick={() => { navigate(-1) }}><BreadcrumbsItem onClick={() => { navigate(-1) }}>Home</BreadcrumbsItem><BreadcrumbsItem> </BreadcrumbsItem></Breadcrumbs>} header="New Purchase Requisition" ></ObjectPageTitle>}
    >
      <ObjectPageSection
        aria-label="Details"
        id="details"
        titleText="Details"
      >
        <ObjectPageSubSection titleText="Details">
          <Form
            labelSpan="S12 M12 L12 XL12"
            layout="S1 M2 L3 XL3"
          >
            <FormItem labelContent={<Label showColon>Type</Label>}  >
              <Select value={prType} valueState={errors.pr_type && errors.pr_type != null ? "Negative" : "None"} onChange={(e) => setPrType(e.target.value)}>
                <Option value="">Select Type</Option>
                <Option value="NB"> NB (Standard Purchase Requisition) </Option>
                <Option value="NBS"> NBS (Standard Purchase Requisition) </Option>
                <Option value="RV"> RV (Outline Agreement) </Option>
                <Option value="ZNB">ZNB (Custom Purchase Requisition)</Option>
                <div slot="valueStateMessage">{errors.pr_type}</div>
              </Select>
            </FormItem>
            <FormItem labelContent={<Label showColon>Description</Label>}  >
              <TextArea value={description} valueState={errors.description && errors.description != null ? "Negative" : "None"} valueStateMessage={errors.description} onChange={(e) => setDescription(e.target.value)} >
                <div slot="valueStateMessage">{errors.description}</div>
              </TextArea>
            </FormItem>
          </Form>
        </ObjectPageSubSection>
      </ObjectPageSection>

      <ObjectPageSection
        aria-label="Items"
        id="items"
        titleText="Items"
      >
        <ObjectPageSubSection titleText="" actions={
          <div style={{ marginLeft: "auto", display: "flex" }}>
            <Button design="Transparent" onClick={hanldeAddItem}>
              Add Item
            </Button>
          </div>
        }>
          <Table id="itemTableInDetails"
            headerRow={<TableHeaderRow sticky><TableHeaderCell minWidth="200px" width="200px"><span>Item Name</span></TableHeaderCell>
              <TableHeaderCell minWidth="200px"><span>Quantity</span></TableHeaderCell>
              <TableHeaderCell minWidth="200px"><span>Unit Price</span></TableHeaderCell>
              <TableHeaderCell maxWidth="200px" minWidth="100px"><span>Total Price</span></TableHeaderCell>
              <TableHeaderCell minWidth="200px"><span>Notes</span></TableHeaderCell>
            </TableHeaderRow>}
          >

            {items.map((row, index) => (
              <TableRow rowKey={row.id}>
                <TableCell><Input name="item_name" value={row.item_name} onChange={(event) => handleItemChange(index, event)} valueState={itemErrors.hasOwnProperty(`item_name[${index}]`) && itemErrors[`item_name[${index}]`] != null ? "Negative" : "None"}>
                  <div slot="valueStateMessage">{itemErrors[`item_name[${index}]`]}</div>
                </Input></TableCell>
                <TableCell><Input name="quantity" value={row.quantity} onChange={(event) => handleItemChange(index, event)}></Input></TableCell>
                <TableCell><Input name="unit_price" value={row.unit_price} onChange={(event) => handleItemChange(index, event)}></Input></TableCell>
                <TableCell><Input name="total_price" value={row.total_price} onChange={(event) => handleItemChange(index, event)}></Input></TableCell>
                <TableCell><Input name="notes" value={row.notes} onChange={(event) => handleItemChange(index, event)}></Input> </TableCell>
              </TableRow>
            ))}
          </Table>
        </ObjectPageSubSection>
      </ObjectPageSection>

    </ObjectPage>);

}

export default NewPurchaseRequisition;
