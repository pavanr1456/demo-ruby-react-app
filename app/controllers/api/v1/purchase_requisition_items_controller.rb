class Api::V1::PurchaseRequisitionItemsController < ApplicationController
  before_action :set_purchase_requisition, only: [ :index, :create ]
  before_action :set_item, only: [ :show, :update, :destroy ]


  # GET /purchase_requisitions/:purchase_requisition_id/items
  def index
    items = @purchase_requisition.purchase_requisition_items
    render json: items
  end

  # GET /purchase_requisition_items/:id
  def show
    render json: @item
  end

  # POST /purchase_requisitions/:purchase_requisition_id/items
  def create
    item = @purchase_requisition.purchase_requisition_items.new(item_params)

    if item.save
      render json: item, status: :created
    else
      render json: item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /purchase_requisition_items/:id
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /purchase_requisition_items/:id
  def destroy
    @item.destroy
    head :no_content
  end

  private

  def set_purchase_requisition
    @purchase_requisition = PurchaseRequisition.find(params[:purchase_requisition_id])
  end

  def set_item
    @item = PurchaseRequisitionItem.find(params[:id])
  end

  def item_params
    params.require(:purchase_requisition_item).permit(:item_name, :quantity, :unit_price, :total_price, :notes)
  end
end
