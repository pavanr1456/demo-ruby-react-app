class Api::V1::PurchaseRequisitionsController < ApplicationController
  before_action :set_purchase_requisition, only: %i[ show update destroy ]

  # GET /purchase_requisitions
  def index
    @purchase_requisitions = PurchaseRequisition.all

    render json: @purchase_requisitions
  end

  # GET /purchase_requisitions/1
  def show
    render json: @purchase_requisition
  end

  # POST /purchase_requisitions
  def create
    @purchase_requisition = PurchaseRequisition.new(purchase_requisition_params)

    if @purchase_requisition.save
      logger.debug "PurchaseRequisition created with ID: #{@purchase_requisition.id}"
      render json: @purchase_requisition, status: :created, location: api_v1_purchase_requisition_url(@purchase_requisition)
    else
      render json: @purchase_requisition.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /purchase_requisitions/1
  def update
    if @purchase_requisition.update(purchase_requisition_params)
      render json: @purchase_requisition
    else
      render json: @purchase_requisition.errors, status: :unprocessable_entity
    end
  end

  # DELETE /purchase_requisitions/1
  def destroy
    @purchase_requisition.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_purchase_requisition
      @purchase_requisition = PurchaseRequisition.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def purchase_requisition_params
      params.expect(purchase_requisition: [ :pr_type, :description ])
    end
end
