# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2024_12_30_075334) do
  create_table "purchase_requisition_items", force: :cascade do |t|
    t.integer "purchase_requisition_id", null: false
    t.string "item_name", null: false
    t.integer "quantity", null: false
    t.decimal "unit_price", precision: 10, scale: 2, null: false
    t.decimal "total_price", precision: 10, scale: 2, null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["purchase_requisition_id"], name: "index_purchase_requisition_items_on_purchase_requisition_id"
  end

  create_table "purchase_requisitions", force: :cascade do |t|
    t.string "pr_type"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "pr_type_desc"
  end

  add_foreign_key "purchase_requisition_items", "purchase_requisitions"
end
