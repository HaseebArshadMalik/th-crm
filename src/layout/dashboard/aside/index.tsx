import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../../components/logo";
import "./index.css";
import LogoutIcon from "@mui/icons-material/Logout";
import MobileFriendlyOutlinedIcon from "@mui/icons-material/MobileFriendlyOutlined";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import StyleIcon from "@mui/icons-material/Style";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DownloadSharp from "@mui/icons-material/DownloadSharp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SimCardIcon from "@mui/icons-material/SimCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import Email from "@mui/icons-material/Email";
import { motion } from "framer-motion";

const Aside = () => {
  const [section, setSection] = useState("");
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user") || ""));
    }

    if (location.pathname.toLowerCase().indexOf("support") != -1) {
      setSection("support");
    }
    if (location.pathname.toLowerCase().indexOf("/thm") != -1) {
      setSection("thm");
    } else if (location.pathname.toLowerCase().indexOf("/tha") != -1) {
      setSection("tha");
    }
  }, []);
  return (
    <motion.div
      initial={{ x: -10000 }}
      animate={{ x: 0 }}
      style={{ height: "100%" }}
      transition={{ ease: "easeOut", duration: 0.5 }}
    >
      <div className="asideInner">
        <Logo logoOuter={"logoOuter"} />
        <ul className="mainNav" style={{ overflow: "hidden auto", height: "calc(100% - 98px)" }}>
          {user &&
            user.Email &&
            (user.Email.indexOf("support") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <span
                  onClick={() =>
                    setSection(section == "support" ? "" : "support")
                  }
                  className={section === "support" ? "disable" : ""}
                >
                  <SupportAgentIcon />
                  Support
                  <KeyboardArrowDownIcon className="arrowIcon" />
                </span>
              </li>
            )}

          {section === "support" &&
            user &&
            user.Email &&
            (user.Email.indexOf("support") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <ul>
                  <li>
                    <NavLink
                      to="/support/portin"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <MobileFriendlyOutlinedIcon />
                      PortIn
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/auto-renew"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AutorenewIcon />
                      Bundle
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/auto-topup"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <ArrowCircleUpIcon />
                      Topup
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/sim-replacement"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <SimCardIcon />
                      Online SIM Number Update
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/email-status"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <Email />
                      Email Status
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/add-bundle"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <ArrowCircleUpIcon />
                      Add Bundle
                    </NavLink>
                    {user.Email.indexOf("admin-support") !== -1 && (
                      <NavLink
                        to="/support/detach-number"
                        className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        <SimCardIcon />
                        Detach Number
                      </NavLink>
                    )}
                  </li>
                  <li>
                    <NavLink
                      to="/support/sim-request"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <SimCardIcon />
                      Sim Request
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/creditsim-status"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <SimCardIcon />
                      Credit Sim Status
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/support/retry-method"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <SimCardIcon />
                      Retry Method
                    </NavLink>
                  </li>
                  {user.Email.indexOf("admin-support") !== -1 && (<li>
                    <NavLink
                      to="/support/cancel-fulfillment"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <CancelPresentationIcon />
                      Cancel Fulfillment
                    </NavLink>
                  </li>)}
                </ul>
              </li>
            )}
          {user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <span
                  onClick={() => setSection(section == "thm" ? "" : "thm")}
                  className={section === "thm" ? "disable" : ""}
                >
                  <SimCardIcon />
                  THM
                  <KeyboardArrowDownIcon className="arrowIcon" />
                </span>
              </li>
            )}
          {section === "thm" &&
            user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <ul>
                  <li>
                    <NavLink
                      to="/thm/dashboard"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <DashboardIcon />
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/prepaid-sim-report"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Sim Order Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/portin-report"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      PortIn Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/portout-report"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Portout Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/paidcampaigns"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <PaymentsIcon />
                      Paid Campaign(s)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/sales"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Bundle Sales
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/subscription-report"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Plan Subscription Reports
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/create-bundles"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <ArrowCircleUpIcon />
                      Create Bundles
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/portoutCustomerStatus"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Portout Customer Status
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/customerStatus"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Customer Status
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/thm/download-invoice"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <DownloadSharp />
                      Download Invoice
                    </NavLink>
                  </li>
                  {(user.Email.indexOf("dev") != -1 ||
                    user.Email.indexOf("admin") != -1) && (
                      <li>
                        <NavLink
                          to="/thm/payment-stats"
                          className={({ isActive }) => (isActive ? "active" : "")}
                        >
                          <DashboardIcon />
                          Payment Stats
                        </NavLink>
                      </li>
                    )}
                </ul>
              </li>
            )}

          {user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <span
                  onClick={() => setSection(section == "tha" ? "" : "tha")}
                  className={section === "tha" ? "disable" : ""}
                >
                  <SimCardIcon />
                  THA
                  <KeyboardArrowDownIcon className="arrowIcon" />
                </span>
              </li>
            )}
          {section === "tha" &&
            user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <ul>
                  <li>
                    <NavLink
                      to="/tha/activity-report"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <DashboardIcon />
                      Signup Stats
                    </NavLink>
                  </li>
                  {(user.Email.indexOf("dev") != -1 ||
                    user.Email.indexOf("admin") != -1) && (
                      <li>
                        <NavLink
                          to="/tha/payment-stats"
                          className={({ isActive }) => (isActive ? "active" : "")}
                        >
                          <DashboardIcon />
                          Payment Stats
                        </NavLink>
                      </li>
                    )}
                  {(user.Email.indexOf("dev") != -1 ||
                    user.Email.indexOf("admin") != -1) && (
                      <li>
                        <NavLink
                          to="/tha/delete-request"
                          className={({ isActive }) => (isActive ? "active" : "")}
                        >
                          <CancelPresentationIcon />
                          Delete Request
                        </NavLink>
                      </li>
                    )}
                  <li>
                    <NavLink
                      to="/tha/vendor-configuration"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Vendor Configuration
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
          {user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <span
                  onClick={() => setSection(section == "now" ? "" : "now")}
                  className={section === "now" ? "disable" : ""}
                >
                  <PaymentsIcon />
                  NOW
                  <KeyboardArrowDownIcon className="arrowIcon" />
                </span>
              </li>
            )}
          {section === "now" &&
            user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <ul>
                  {(user.Email.indexOf("dev") != -1 ||
                    user.Email.indexOf("admin") != -1) && (
                      <li>
                        <NavLink
                          to="/now/payment-stats"
                          className={({ isActive }) => (isActive ? "active" : "")}
                        >
                          <DashboardIcon />
                          Payment Stats
                        </NavLink>
                      </li>
                    )}
                </ul>
              </li>
            )}
          {user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <span
                  onClick={() => setSection(section == "thcc" ? "" : "thcc")}
                  className={section === "thcc" ? "disable" : ""}
                >
                  <StyleIcon />
                  THCC
                  <KeyboardArrowDownIcon className="arrowIcon" />
                </span>
              </li>
            )}
          {section === "thcc" &&
            user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1) && (
              <li>
                <ul>
                  {(user.Email.indexOf("dev") != -1 ||
                    user.Email.indexOf("admin") != -1) && (
                      <li>
                        <NavLink
                          to="/thcc/payment-stats"
                          className={({ isActive }) => (isActive ? "active" : "")}
                        >
                          <DashboardIcon />
                          Payment Stats
                        </NavLink>
                      </li>
                    )}
                </ul>
              </li>
            )}
          {user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1 || user.Email == "asfand.yar@now.net.pk") && (
              <li>
                <span
                  onClick={() => setSection(section == "sendcredit" ? "" : "sendcredit")}
                  className={section === "sendcredit" ? "disable" : ""}
                >
                  <StyleIcon />
                  Send Credit
                  <KeyboardArrowDownIcon className="arrowIcon" />
                </span>
              </li>
            )}
          {section === "sendcredit" &&
            user &&
            user.Email &&
            (user.Email.indexOf("marketing") !== -1 ||
              user.Email.indexOf("dev") !== -1 || user.Email == "asfand.yar@now.net.pk") && (
              <li>
                <ul>
                  <li>
                    <NavLink
                      to="/sendcredit/operator-cms"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <DashboardIcon />
                      Operator CMS
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sendcredit/daily-summary"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Daily Summary
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sendcredit/top-products"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Top Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sendcredit/operator-summary-giftcard"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Operator Summary GiftCard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sendcredit/operator-summary-mobile"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AssessmentIcon />
                      Operator Summary Mobile
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

          {/* <li>
            <NavLink
              onClick={() => setSection("")}
              to="/sendcredit"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <AccountBalanceWalletIcon />
              Send Credit
            </NavLink>
          </li> */}

          <li>
            <NavLink
              onClick={() => localStorage.removeItem("user")}
              to="/login"
            >
              <LogoutIcon />
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Aside;
