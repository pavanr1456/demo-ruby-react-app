import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { ObjectPage, ObjectPageTitle, ObjectPageSection, ObjectPageSubSection, Button, Breadcrumbs, BreadcrumbsItem, Label, Form, FormItem, Text, Input, Select, Option, TextArea, Table, TableHeaderRow, TableHeaderCell, TableRow, TableCell, BusyIndicator, TableSelection } from '@ui5/webcomponents-react';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const GET_PR_API_URL = BASE_URL + "/api/v1/purchase_requisitions";
const GET_ITEMS_API_URL = (id) => `${BASE_URL}/api/v1/purchase_requisitions/${id}/items`;
const GET_ITEM_UPDATE_URL = (id, itemId) => `${BASE_URL}/api/v1/purchase_requisitions/${id}/items/${itemId}`;
const GET_ITEM_CREATE_URL = (id) => `${BASE_URL}/api/v1/purchase_requisitions/${id}/items`;

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
  const [isItemEditMode, setIsItemEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [pr_type, setPrType] = useState("");
  const [currentItemKey, setCurrentItemKey] = useState(null);
  const [errors, setErrors] = useState({});
  const [itemErrors, setItemErrors] = useState([]);

  useEffect(() => {
    axios.get(`${GET_PR_API_URL}/${id}`).then((res) => {
      setRequisition(res.data);
      setDescription(res.data.description);
      setPrType(res.data.pr_type);
    });

    axios.get(GET_ITEMS_API_URL(id)).then((res) => {
      setItems(res.data);
    });
  }, [id]);

  const handleToggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleToggleItemEditMode = () => {
    setIsItemEditMode((prevMode) => !prevMode);
  };

  const handleUpdate = () => {
    const updatedRequisition = { ...requisition, description, pr_type };
    axios
      .put(`${GET_PR_API_URL}/${id}`, updatedRequisition)
      .then((response) => {
        setRequisition(response.data);
        setIsEditMode(false);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          // Separate general errors and field-specific errors
          setErrors({
            pr_type: errorData.pr_type?.length > 0 ? errorData.pr_type[0] : null,
            description: errorData.description?.length > 0 ? errorData.description[0] : null,
          });
        }
      });
  };

  const handleUpdateItem = () => {
    const { item_name, quantity, unit_price, total_price, notes } = items.find((item) => item.id === currentItemKey);
    const changedItem = { item_name, quantity, unit_price, total_price, notes };
    if (currentItemKey === "100") {
      axios
        .post(GET_ITEM_CREATE_URL(requisition.id), changedItem)
        .then((response) => {
          setIsItemEditMode((prevMode) => !prevMode);
          setCurrentItemKey(response.data.id);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorData = error.response.data;
            const itemLevelError = {};
            itemLevelError[`item_name[${currentItemKey}]`] = errorData.item_name?.length > 0 ? errorData.item_name[0] : null;
            setItemErrors(itemLevelError);
          }
        });
    } else {
      axios
        .put(GET_ITEM_UPDATE_URL(requisition.id, currentItemKey), changedItem)
        .then((response) => {
          setIsItemEditMode((prevMode) => !prevMode);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const errorData = error.response.data;
            const itemLevelError = {};
            itemLevelError[`item_name[${currentItemKey}]`] = errorData.item_name?.length > 0 ? errorData.item_name[0] : null;
            setItemErrors(itemLevelError);
          }
        });
    }
  };

  const hanldeAddItem = () => {
    setItems([...items, { id: "100", item_name: "", quantity: 1, unit_price: 0, notes: "" }]);
    setCurrentItemKey("100");
    handleToggleItemEditMode();
  };


  const handleItemSelection = (oEvent) => {
    if (Number(oEvent.target.selected) !== currentItemKey) {
      const selectedItem = items.find((item) => item.id === Number(oEvent.target.selected));
      selectedItem.oldEntry = { ...selectedItem };
      setCurrentItemKey(selectedItem.id);
    }
  }

  const handleItemChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] = e.target.value;
    setItems(updatedItems);
  };

  const handleCancelItem = (event) => {
    const itemEdited = items.find((item) => item.id === currentItemKey);
    if (itemEdited.id === "100") {
      const updatedItems = items.filter((item) => item.id !== "100");
      setItems(updatedItems);
    } else {
      const updatedItems = items.map((item) => {
        if (item.id === currentItemKey) {
          return item.oldEntry;
        }
        return item;
      });
      setItems(updatedItems);
    }
    setIsItemEditMode((prevMode) => !prevMode);
    setCurrentItemKey(currentItemKey);
  };

  if (!requisition) return (<div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: semi-transparent background
    zIndex: 1000,
  }}>
    <BusyIndicator active delay={1} size="L" />
  </div>);

  return (
    <ObjectPage
      mode="Default"
      selectedSectionId="details"
      style={{
        height: '1000px'
      }}
      titleArea={<ObjectPageTitle breadcrumbs={<Breadcrumbs onItemClick={() => { navigate(-1) }}><BreadcrumbsItem onClick={() => { navigate(-1) }}>Home</BreadcrumbsItem><BreadcrumbsItem> </BreadcrumbsItem></Breadcrumbs>} header={`Purchase Requisition ${requisition.id}`} subHeader={description} ></ObjectPageTitle>}
    >
      <ObjectPageSection
        aria-label="Details"
        id="details"
        titleText="Details"
      >
        <ObjectPageSubSection titleText="Details" actions={
          <div style={{ marginLeft: "auto", display: "flex" }}>
            {isEditMode ? <Button design="Emphasized" onClick={handleUpdate}>Save</Button> : null}
            <Button design="Transparent" onClick={handleToggleEditMode}>
              {isEditMode ? "Cancel" : "Edit"}
            </Button>
          </div>
        }>
          <Form
            labelSpan="S12 M12 L12 XL12"
            layout="S1 M2 L3 XL3"
          >
            <FormItem labelContent={<Label showColon>ID</Label>}  >
              <Text>{requisition.id}</Text>
            </FormItem>
            <FormItem labelContent={<Label showColon>Type</Label>}  >
              {isEditMode ? (<Select value={pr_type} valueState={errors.pr_type && errors.pr_type != null ? "Negative" : "None"} onChange={(e) => setPrType(e.target.value)}>
                <Option value="NB"> NB (Standard Purchase Requisition) </Option>
                <Option value="NBS"> NBS (Standard Purchase Requisition) </Option>
                <Option value="RV"> RV (Outline Agreement) </Option>
                <Option value="ZNB">ZNB (Custom Purchase Requisition)</Option>
                <div slot="valueStateMessage">{errors.pr_type}</div>
              </Select>) : <Text>{requisition.pr_type_desc}</Text>}
            </FormItem>
            <FormItem labelContent={<Label showColon>Description</Label>}  >
              {isEditMode ? <TextArea value={description} onChange={(e) => setDescription(e.target.value)} /> : <Text>{description}</Text>}
            </FormItem>
            <FormItem labelContent={<Label showColon>Created At</Label>}  >
              <Text>{formatDate(requisition.created_at)}</Text>
            </FormItem>
            <FormItem labelContent={<Label showColon>Updated At</Label>}  >
              <Text>{formatDate(requisition.updated_at)}</Text>
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
            <Button design="Transparent" disabled={isItemEditMode} onClick={hanldeAddItem}>
              Add Item
            </Button>
            {currentItemKey && !isItemEditMode ? <Button design="Transparent" onClick={handleToggleItemEditMode}>
              Edit
            </Button> : null}

            {currentItemKey && isItemEditMode ? <Button design="Transparent" onClick={handleUpdateItem}>
              Save
            </Button> : null}

            {currentItemKey && isItemEditMode ? <Button design="Transparent" onClick={handleCancelItem}>
              Cancel
            </Button> : null}
          </div>
        }>
          <Table id="itemTableInDetails"
            features={<TableSelection mode="Single" slot="features" onChange={handleItemSelection} selected={(typeof currentItemKey === 'string' || currentItemKey instanceof String) ? currentItemKey : " "} />}
            headerRow={<TableHeaderRow sticky><TableHeaderCell minWidth="200px" width="200px"><span>Item Name</span></TableHeaderCell>
              <TableHeaderCell minWidth="200px"><span>Quantity</span></TableHeaderCell>
              <TableHeaderCell minWidth="200px"><span>Unit Price</span></TableHeaderCell>
              <TableHeaderCell maxWidth="200px" minWidth="100px"><span>Total Price</span></TableHeaderCell>
              <TableHeaderCell minWidth="200px"><span>Notes</span></TableHeaderCell>
            </TableHeaderRow>}
          >

            {items.map((row, index) => (
              <TableRow rowKey={row.id}>
                <TableCell>{currentItemKey === row.id && isItemEditMode ? <Input name="item_name" value={row.item_name} onChange={(event) => handleItemChange(index, event)} valueState={itemErrors.hasOwnProperty(`item_name[${row.id}]`) && itemErrors[`item_name[${row.id}]`] != null ? "Negative" : "None"}>
                  <div slot="valueStateMessage">{itemErrors[`item_name[${row.id}]`]}</div>
                </Input> : <span>{row.item_name}</span>}</TableCell>
                <TableCell>{currentItemKey === row.id && isItemEditMode ? <Input name="quantity" value={row.quantity} onChange={(event) => handleItemChange(index, event)}></Input> : <span>{row.quantity}</span>}</TableCell>
                <TableCell>{currentItemKey === row.id && isItemEditMode ? <Input name="unit_price" value={row.unit_price} onChange={(event) => handleItemChange(index, event)}></Input> : <span>${Number(row.unit_price || 0).toFixed(2)}</span>}</TableCell>
                <TableCell>{currentItemKey === row.id && isItemEditMode ? <Input name="total_price" value={row.total_price} onChange={(event) => handleItemChange(index, event)}></Input> : <span>${Number(row.total_price || 0).toFixed(2)}</span>}</TableCell>
                <TableCell>{currentItemKey === row.id && isItemEditMode ? <Input name="notes" value={row.notes} onChange={(event) => handleItemChange(index, event)}></Input> : <span>{row.notes}</span>}</TableCell>
              </TableRow>
            ))}
          </Table>
        </ObjectPageSubSection>
      </ObjectPageSection>

    </ObjectPage>
  );
}

export default PurchaseRequisitionDetails;
