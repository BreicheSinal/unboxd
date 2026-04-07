import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { OrderFlowPage } from "./pages/OrderFlowPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClosetPage } from "./pages/ClosetPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { TradeFlowPage } from "./pages/TradeFlowPage";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { HelpCenterPage } from "./pages/HelpCenterPage";
import { ContactUsPage } from "./pages/ContactUsPage";
import { ReturnsPage } from "./pages/ReturnsPage";
import { BadgesPage } from "./pages/BadgesPage";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "signin", Component: SignInPage },
      { path: "signup", Component: SignUpPage },
      { path: "terms", Component: TermsOfServicePage },
      { path: "privacy", Component: PrivacyPolicyPage },
      { path: "help-center", Component: HelpCenterPage },
      { path: "contact-us", Component: ContactUsPage },
      { path: "returns", Component: ReturnsPage },
      { 
        path: "order", 
        element: (
          <ProtectedRoute>
            <OrderFlowPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "dashboard", 
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "closet", 
        element: (
          <ProtectedRoute>
            <ClosetPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "marketplace", 
        element: (
          <ProtectedRoute>
            <MarketplacePage />
          </ProtectedRoute>
        )
      },
      { 
        path: "trade/:id", 
        element: (
          <ProtectedRoute>
            <TradeFlowPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "transactions", 
        element: (
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "badges", 
        element: (
          <ProtectedRoute>
            <BadgesPage />
          </ProtectedRoute>
        )
      },
    ],
  },
]);
