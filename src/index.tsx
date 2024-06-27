import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgetPassword from "./pages/forget-password";
import ResetPassword from "./pages/reset-password";
import DashboardLayout from "./layout/dashboard";
import Dashboard from "./pages/thm/dashboard";
import Portin from "./pages/support/portin";
import AutoRenew from "./pages/support/auto-renew";
import AutoTopup from "./pages/support/auto-topup";
import AddBundle from "./pages/support/add-bundle";
import EmailStatus from "./pages/support/email-status";
import DetachNumber from "./pages/support/detach-number";
import THCC from "./pages/thcc";
import THM from "./pages/thm";
import THA from "./pages/tha";
import SendCredit from "./pages/sendcredit";
import PageNotFound from "./pages/pagenotfound";
import THMReports from "./pages/thm/prepaid-sim-report";
import EmptyLayout from "./layout/empty-layout";
import Now from "./pages/now";
import SimReplacement from "./pages/support/sim-replacement";
import PaidCampaigns from "./pages/thm/paidCampaigns";
import PortInReports from "./pages/thm/portin-report";
import PortOutReports from "./pages/thm/portout-report";
import Sales from "./pages/thm/sales";
import PlanSubscriptionReport from "./pages/thm/subscription-report";
import ActivityReport from "./pages/tha/activity-report";
import ThaPaymentStats from "./pages/tha/payment-stats";
import NowPaymentStats from "./pages/now/payment-stats";
import ThccPaymentStats from "./pages/thcc/payment-stats";
import ThmPaymentStats from "./pages/thm/payment-stats";
import CreateBundles from "./pages/thm/create-bundles";
import SimRequest from "./pages/support/sim-request";
import CancelFulfillment from "./pages/support/cancel-fulfillment";
import PortoutCustomerStatus from "./pages/thm/portoutCustomerStatus";
import DeleteRequest from "./pages/tha/delete-request";
import OperatorCms from "./pages/sendcredit/operator-cms";
import DownloadInvoice from "./pages/thm/download-invoice";
import DailySummary from "./pages/sendcredit/daily-summary";
import OperatorSummaryGiftCard from "./pages/sendcredit/operator-summary-giftcard";
import OperatorSummaryMobile from "./pages/sendcredit/operator-summary-mobile";
import VendorConfiguration from "./pages/tha/vendor-configuration";
import CustomerStatus from "./pages/thm/customerStatus";
import TopProducts from "./pages/sendcredit/top-products";
import CreditSimStatus from "./pages/support/creditsim-status";
import RetryMethod from "./pages/support/retry-method";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* Routes that use layout 1 */}
        <Route element={<EmptyLayout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        {/* Routes that use layout 2 */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Portin />} />
          <Route path="/support/portin" element={<Portin />} />
          <Route path="/support/auto-renew" element={<AutoRenew />} />
          <Route path="/support/auto-topup" element={<AutoTopup />} />
          <Route path="/support/sim-replacement" element={<SimReplacement />} />
          <Route path="/support/add-bundle" element={<AddBundle />} />
          <Route path="/support/email-status" element={<EmailStatus />} />
          <Route path="/support/detach-number" element={<DetachNumber />} />
          <Route path="/support/sim-request" element={<SimRequest />} />
          <Route path="/support/cancel-fulfillment" element={<CancelFulfillment />} />
          <Route path="/support/creditsim-status" element={<CreditSimStatus />} />
          <Route path="/support/retry-method" element={<RetryMethod />} />
          <Route path="/thm/dashboard" element={<THM />} />
          <Route path="/thm/paidcampaigns" element={<PaidCampaigns />} />
          <Route path="/thm/prepaid-sim-report" element={<THMReports />} />
          <Route path="/thm/portin-report" element={<PortInReports />} />
          <Route path="/thm/portout-report" element={<PortOutReports />} />
          <Route path="/thm/sales" element={<Sales />} />
          <Route path="/thm/subscription-report" element={<PlanSubscriptionReport />} />
          <Route path="/thm/payment-stats" element={<ThmPaymentStats />} />
          <Route path="/thm/create-bundles" element={<CreateBundles />} />
          <Route path="/thm/portoutCustomerStatus" element={<PortoutCustomerStatus />} />
          <Route path="/thm/customerStatus" element={<CustomerStatus />} />
          <Route path="/thm/download-invoice" element={<DownloadInvoice />} />
          <Route path="/now" element={<Now />} />
          <Route path="/now/payment-stats" element={<NowPaymentStats />} />
          <Route path="/thcc" element={<THCC />} />
          <Route path="/thcc/payment-stats" element={<ThccPaymentStats />} />
          <Route path="/tha" element={<THA />} />
          <Route path="/tha/activity-report" element={<ActivityReport />} />
          <Route path="/tha/payment-stats" element={<ThaPaymentStats />} />
          <Route path="/tha/delete-request" element={<DeleteRequest />} />
          <Route path="/tha/vendor-configuration" element={<VendorConfiguration />} />
          <Route path="/sendcredit" element={<SendCredit />} />
          <Route path="/sendcredit/operator-cms" element={<OperatorCms />} />
          <Route path="/sendcredit/daily-summary" element={<DailySummary />} />
          <Route path="/sendcredit/top-products" element={<TopProducts />} />
          <Route path="/sendcredit/operator-summary-giftcard" element={<OperatorSummaryGiftCard />} />
          <Route path="/sendcredit/operator-summary-mobile" element={<OperatorSummaryMobile />} />

        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
);
