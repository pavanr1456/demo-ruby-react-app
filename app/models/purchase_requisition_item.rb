class PurchaseRequisitionItem < ApplicationRecord
  belongs_to :purchase_requisition

  validates :item_name, presence: true
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }
end
