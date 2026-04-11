import { describe, expect, it } from "vitest";
import reducer, { loadAdminOrders, mutateAdminOrder } from "./adminOrdersSlice";

describe("adminOrdersSlice", () => {
  it("loads and normalizes orders", () => {
    const state = reducer(
      undefined,
      loadAdminOrders.fulfilled(
        {
          items: [
            {
              id: "order-1",
              buyerUid: "u1",
              buyerName: "Test Buyer",
              orderType: "jersey",
              provider: "cod",
              status: "placed",
              paymentState: "pending",
              reconciliationStatus: "n/a",
              amount: 10,
              currency: "USD",
              size: "L",
              createdAt: null,
              updatedAt: null,
            },
          ],
          nextCursor: "order-1",
        },
        "req-1",
        undefined,
      ),
    );

    expect(state.ids).toEqual(["order-1"]);
    expect(state.entities["order-1"]?.status).toBe("placed");
  });

  it("optimistically updates mutable order fields", () => {
    const loaded = reducer(
      undefined,
      loadAdminOrders.fulfilled(
        {
          items: [
            {
              id: "order-1",
              buyerUid: "u1",
              buyerName: "Test Buyer",
              orderType: "jersey",
              provider: "cod",
              status: "placed",
              paymentState: "pending",
              reconciliationStatus: "n/a",
              amount: 10,
              currency: "USD",
              size: "L",
              createdAt: null,
              updatedAt: null,
            },
          ],
          nextCursor: null,
        },
        "req-1",
        undefined,
      ),
    );

    const updated = reducer(
      loaded,
      mutateAdminOrder.fulfilled(
        { orderId: "order-1", status: "completed", paymentState: "paid" },
        "req-2",
        { orderId: "order-1", status: "completed", paymentState: "paid" },
      ),
    );

    expect(updated.entities["order-1"]?.status).toBe("completed");
    expect(updated.entities["order-1"]?.paymentState).toBe("paid");
  });
});
