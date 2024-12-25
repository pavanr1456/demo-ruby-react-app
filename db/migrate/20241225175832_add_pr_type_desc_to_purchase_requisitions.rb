class AddPrTypeDescToPurchaseRequisitions < ActiveRecord::Migration[8.0]
  def change
    add_column :purchase_requisitions, :pr_type_desc, :string
  end
end
