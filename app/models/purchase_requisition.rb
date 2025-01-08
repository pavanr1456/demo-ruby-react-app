class PurchaseRequisition < ApplicationRecord
  has_many :purchase_requisition_items, dependent: :destroy, index_errors: true
  validates :purchase_requisition_items, presence: { message: "must have at least one item" }
  # Only allow specific type
  validates :pr_type, inclusion: { in: [ "NB", "NBS", "RV", "ZNB" ], message: "Purchase Requisition Type is mandatory" }
  validate :pr_type_not_znbs
  validates :description, length: { minimum: 10, message: "Description must be at least 10 characters long" }

  # Auto fill description
  before_save :set_pr_type_desc

  accepts_nested_attributes_for :purchase_requisition_items

  private
  def pr_type_not_znbs
    if pr_type == "ZNB"
      errors.add(:pr_type, "You are not authorized to create a requisition of this type")
    end
  end

  def set_pr_type_desc
    # Set pr_type_desc based on pr_type value
    case pr_type
    when "NB"
      self.pr_type_desc = "Standard Purchase Requisition"
    when "NBS"
      self.pr_type_desc = "Standard Purchase Requisition"
    when "RV"
      self.pr_type_desc = "Outline Agreement"
    when "ZNB"
      self.pr_type_desc = "Custom Purchase Requisition"
    else
      self.pr_type_desc = "Unknown"
    end
  end
end
