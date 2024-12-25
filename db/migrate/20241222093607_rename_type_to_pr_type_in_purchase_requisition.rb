class RenameTypeToPrTypeInPurchaseRequisition < ActiveRecord::Migration[8.0]
  def change
    rename_column :purchase_requisitions, :type, :pr_type
  end
end
