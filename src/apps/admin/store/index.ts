import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice";
import adminOrdersReducer from "./slices/adminOrdersSlice";
import adminTransactionsReducer from "./slices/adminTransactionsSlice";
import adminListingsReducer from "./slices/adminListingsModerationSlice";
import adminTradesReducer from "./slices/adminTradesSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice";

export const adminStore = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminOrders: adminOrdersReducer,
    adminTransactions: adminTransactionsReducer,
    adminListings: adminListingsReducer,
    adminTrades: adminTradesReducer,
    adminUsers: adminUsersReducer,
    adminDashboard: adminDashboardReducer,
  },
});

export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminDispatch = typeof adminStore.dispatch;
