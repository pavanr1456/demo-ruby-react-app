class CreatePurchaseRequisitions < ActiveRecord::Migration[8.0]
  def change
    create_table :purchase_requisitions do |t|
      t.string :type
      t.string :description

      t.timestamps
    end
  end
end
