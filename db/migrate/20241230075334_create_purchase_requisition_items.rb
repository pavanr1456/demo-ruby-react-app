class CreatePurchaseRequisitionItems < ActiveRecord::Migration[8.0]
  def change
    create_table :purchase_requisition_items, if_not_exists: true do |t|
      t.references :purchase_requisition, null: false, foreign_key: true
      t.string :item_name, null: false
      t.integer :quantity, null: false
      t.decimal :unit_price, precision: 10, scale: 2, null: false
      t.decimal :total_price, precision: 10, scale: 2, null: false
      t.text :notes

      t.timestamps
    end
  end
end
