require "test_helper"

class PurchaseRequisitionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @purchase_requisition = purchase_requisitions(:one)
  end

  test "should get index" do
    get purchase_requisitions_url, as: :json
    assert_response :success
  end

  test "should create purchase_requisition" do
    assert_difference("PurchaseRequisition.count") do
      post purchase_requisitions_url, params: { purchase_requisition: { description: @purchase_requisition.description, type: @purchase_requisition.type } }, as: :json
    end

    assert_response :created
  end

  test "should show purchase_requisition" do
    get purchase_requisition_url(@purchase_requisition), as: :json
    assert_response :success
  end

  test "should update purchase_requisition" do
    patch purchase_requisition_url(@purchase_requisition), params: { purchase_requisition: { description: @purchase_requisition.description, type: @purchase_requisition.type } }, as: :json
    assert_response :success
  end

  test "should destroy purchase_requisition" do
    assert_difference("PurchaseRequisition.count", -1) do
      delete purchase_requisition_url(@purchase_requisition), as: :json
    end

    assert_response :no_content
  end
end
