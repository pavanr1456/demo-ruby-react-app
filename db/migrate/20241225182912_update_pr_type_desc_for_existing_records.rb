class UpdatePrTypeDescForExistingRecords < ActiveRecord::Migration[8.0]
  def up
    # Loop through all the existing purchase requisitions
    PurchaseRequisition.find_each do |requisition|
      # Set the pr_type_desc based on pr_type
      case requisition.pr_type
      when 'NB'
        requisition.update(pr_type_desc: "Standard Purchase Requisition")
      when 'NBS'
        requisition.update(pr_type_desc: "Standard Purchase Requisition")
      when 'RV'
        requisition.update(pr_type_desc: "Outline Agreement")
      when 'ZNB'
        requisition.update(pr_type_desc: "Custom Purchase Requisition")
      else
        requisition.update(pr_type_desc: 'Unknown') # Default value if pr_type is unexpected
      end
    end
  end

  def down
    # Optionally, reset the pr_type_desc to nil or any default value when rolling back the migration
    PurchaseRequisition.update_all(pr_type_desc: 'Unknown')
  end
end
