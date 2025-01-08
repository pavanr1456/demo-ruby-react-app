
PurchaseRequisition.create!(pr_type: 'NB', description: 'Apple Purachase Requisition', purchase_requisition_items_attributes: [
  { item_name: "PHone 16", quantity: 10, unit_price: 1000.0, total_price: 10000.0, notes: "With charger" },
  { item_name: "Macbook Pro M3", quantity: 10, unit_price: 1000.0, total_price: 10000.0, notes: "With charger" }
])

PurchaseRequisition.create!(pr_type: 'NB', description: 'Samsung Purachase Requisition', purchase_requisition_items_attributes: [
  { item_name: "Samsung S23", quantity: 10, unit_price: 1000.0, total_price: 10000.0, notes: "" }
])
