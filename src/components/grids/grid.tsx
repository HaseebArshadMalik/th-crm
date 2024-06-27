import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import moment from "moment";
import axiosInterceptorInstance from "../../utils/axios.interceptor";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import "./index.css";
import "../../pages/thm/paidCampaigns/index.css";
import Calendar from "../calendar/Calender";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs, { Dayjs } from "dayjs";

const AgGrid = () => {
  const [rowData, setRowData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any[]>([]);
  const agGridRef = useRef<AgGridReact | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const controller = new AbortController();

  useEffect(() => {
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setRowData(null);
      setStatsData([]);
      fetchData(startDateParam, endDateParam);
    }
  }, [selectedStartDate, selectedEndDate]);

  const fetchData = async (startDateParam: string, startEndParam: string) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/stats?StartDate=${startDateParam}&EndDate=${startEndParam}`,
        { signal: controller.signal }
      )
      .then((response: any) => {
        const responseData = JSON.parse(response.data.body);
        setStatsData(responseData.Data);
        if (selectedStartDate && selectedEndDate) {
          const startDateParam = selectedStartDate.format("YYYY-MM-DD");
          const endDateParam = selectedEndDate
            .add(1, "days")
            .format("YYYY-MM-DD");
          fetchDataFromAPI(
            startDateParam || "",
            endDateParam || "",
            pageNumber,
            pageSize
          );
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const fetchDataFromAPI = async (
    startDate: string,
    endDate: string,
    pageNumber: number,
    pageSize: number
  ) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/prepaidsims?StartDate=${startDate}&EndDate=${endDate}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
        { signal: controller.signal }
      )
      .then((response: any) => {
        const responseData = JSON.parse(response.data.body);
        responseData.data.forEach((item: any) => {
          var diffOrderDate = Math.round(
            moment(moment()).diff(item.OrderDate, "month", true)
          );
          item.OrderDate = moment(item.OrderDate).format(moment.HTML5_FMT.DATE);

          item.AgeOfPurchase =
            diffOrderDate + " " + (diffOrderDate > 1 ? "Months" : "Month");

          if (item.ActivationDate && item.ActivationDate !== "--") {
            var diffActivationDate = Math.round(
              moment(moment()).diff(item.ActivationDate, "month", true)
            );
            item.ActivationMonths =
              diffActivationDate +
              " " +
              (diffActivationDate > 1 ? "Months" : "Month");
          } else {
            item.ActivationMonths = "--";
          }
          item.SimStatus = item.SimStatus === 0 ? "Not Activated" : "Activated";
          item.ActivationDate =
            item.ActivationDate !== "--"
              ? moment(item.ActivationDate).format(moment.HTML5_FMT.DATE)
              : "--";
        });
        setRowData(responseData.data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const exportGridDataAsCSV = () => {
    if (agGridRef.current) {
      agGridRef.current.api.exportDataAsCsv();
    }
  };

  const columnDefs: ColDef[] = [
    {
      field: "ID",
      headerName: "ID",
      width: 90,
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "SimType",
      headerName: "Sim Type",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "FirstName",
      headerName: "First Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "LastName",
      headerName: "Last Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "Email",
      headerName: "Email",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "MSISDN",
      headerName: "MSISDN",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "OrderDate",
      headerName: "Date of Purchase",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "AgeOfPurchase",
      headerName: "Age of Purchase",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "SimStatus",
      headerName: "SIM Status",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "ActivationDate",
      headerName: "Date of Activation",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "ActivationMonths",
      headerName: "Age of Activation",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "AcquisitionChannel",
      headerName: "Channel of Acquisition",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "TransactionType",
      headerName: "Transaction Type",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "BundleName",
      headerName: "Bundle Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "Amount",
      headerName: "Topup/Bundle Value",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "PaymentType",
      headerName: "Payment Method",
      filter: true,
      sortable: true,
      resizable: true,
    },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleCalendar = () => {
    setCalendarOpen(!calendarOpen);
    handleMenuClose();
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date !== null && date.isValid()) {
      setSelectedStartDate(date);
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date !== null && date.isValid()) {
      setSelectedEndDate(date);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 0",
        }}
      >
        <div>
          <button
            className="small-btn"
            style={{ visibility: rowData ? "visible" : "hidden" }}
            onClick={() => {
              if (rowData) {
                exportGridDataAsCSV();
              }
            }}
          >
            Export as CSV
          </button>
        </div>
        <IconButton
          onClick={(e: any) => {
            if (rowData) {
              handleMenuClick(e);
            }
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={toggleCalendar}></MenuItem>
          {selectedStartDate && selectedEndDate && (
            <Calendar
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
          )}
        </Menu>
      </div>
      {!rowData && (
        <div className="dummy-conatiner">
          <CircularProgress size={40} />
        </div>
      )}
      {rowData && (
        <div>
          <Grid
            container
            spacing={5}
            style={{
              marginLeft: "0px",
              width: "100%",
              marginTop: "0px",
              marginBottom: "20px",
            }}
          >
            <Grid item xs={12} style={{ padding: "0" }}>
              <div
                className="graph-container stats-table"
                style={{ height: "auto", minHeight: "130px" }}
              >
                <Grid container>
                  <Grid item xs={1.5}>
                    <p className="titles-text"> Channels</p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text"> Free SIM </p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text"> Bundle SIM </p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text"> Credit SIM </p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text">Bundle + Credit SIM </p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text">Total Paid SIM</p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text">Total SIM</p>
                  </Grid>
                  <Grid item xs={1.5}>
                    <p className="titles-text">Total Paid SIM (GBP)</p>
                  </Grid>

                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">Google</p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlefreesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlebundlesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlecreditsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlebundleandcreditsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlepaidsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].googlepaidsimvalue}
                    </p>
                  </Grid>

                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">Facebook</p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebookfreesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebookbundlesimstotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebookcreditsimstotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebookbundlecreditsimstotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebookpaidsimstotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebooksimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].facebookpaidsimvalue}
                    </p>
                  </Grid>

                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">Organic</p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].orgainicfreesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].orgainicbundlesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].orgainiccreditsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].orgainicbundleandcreditsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].orgainicpaidsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].organicsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].orgainicpaidsimvalue}
                    </p>
                  </Grid>

                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">Affiliate</p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatefreesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatebundlesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatecreditsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatebundleandcreditsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatepaidsimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatesimtotal}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="numberColumn">
                      {statsData[0].affiliatepaidsimvalue}
                    </p>
                  </Grid>

                  {Number(statsData[0].affiliategooglefreesimtotal) +
                    Number(statsData[0].affiliategooglebundlesimtotal) +
                    Number(statsData[0].affiliategooglecreditsimtotal) +
                    Number(
                      statsData[0].affiliategooglebundleandcreditsimtotal
                    ) +
                    Number(statsData[0].affiliategooglepaidsimtotal) +
                    Number(statsData[0].affiliategooglesimtotal) +
                    Number(statsData[0].affiliategooglepaidsimvalue) !==
                    0 && (
                      <>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="titles-text">Affiliate With Google</p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglefreesimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglebundlesimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglecreditsimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglebundleandcreditsimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglepaidsimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglesimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliategooglepaidsimvalue}
                          </p>
                        </Grid>
                      </>
                    )}

                  {Number(statsData[0].affiliatefacebookfreesimtotal) +
                    Number(statsData[0].affiliatefacebookbundlesimtotal) +
                    Number(statsData[0].affiliatefacebookcreditsimtotal) +
                    Number(
                      statsData[0].affiliatefacebookbundleandcreditsimtotal
                    ) +
                    Number(statsData[0].affiliatefacebookpaidimtotal) +
                    Number(statsData[0].affiliatefacebooksimtotal) +
                    Number(statsData[0].affiliatefacebookpaidsimvalue) !==
                    0 && (
                      <>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="titles-text">Affiliate With Facebook</p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliatefacebookfreesimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliatefacebookbundlesimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliatefacebookcreditsimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {
                              statsData[0]
                                .affiliatefacebookbundleandcreditsimtotal
                            }
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliatefacebookpaidimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliatefacebooksimtotal}
                          </p>
                        </Grid>
                        <Grid item xs={1.5} md={1.5}>
                          <p className="numberColumn">
                            {statsData[0].affiliatefacebookpaidsimvalue}
                          </p>
                        </Grid>
                      </>
                    )}

                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">Total</p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {Number(statsData[0].googlefreesimtotal) +
                        Number(statsData[0].facebookfreesimtotal) +
                        Number(statsData[0].orgainicfreesimtotal) +
                        Number(statsData[0].affiliatefreesimtotal) +
                        Number(statsData[0].affiliategooglefreesimtotal) +
                        Number(statsData[0].affiliatefacebookfreesimtotal)}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {Number(statsData[0].googlebundlesimtotal) +
                        Number(statsData[0].facebookbundlesimstotal) +
                        Number(statsData[0].orgainicbundlesimtotal) +
                        Number(statsData[0].affiliatebundlesimtotal) +
                        Number(statsData[0].affiliategooglebundlesimtotal) +
                        Number(statsData[0].affiliatefacebookbundlesimtotal)}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {Number(statsData[0].googlecreditsimtotal) +
                        Number(statsData[0].facebookcreditsimstotal) +
                        Number(statsData[0].orgainiccreditsimtotal) +
                        Number(statsData[0].affiliatecreditsimtotal) +
                        Number(statsData[0].affiliategooglecreditsimtotal) +
                        Number(statsData[0].affiliatefacebookcreditsimtotal)}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {Number(statsData[0].googlebundleandcreditsimtotal) +
                        Number(statsData[0].facebookbundlecreditsimstotal) +
                        Number(statsData[0].orgainicbundleandcreditsimtotal) +
                        Number(statsData[0].affiliatebundleandcreditsimtotal) +
                        Number(
                          statsData[0].affiliategooglebundleandcreditsimtotal
                        ) +
                        Number(
                          statsData[0].affiliatefacebookbundleandcreditsimtotal
                        )}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {Number(statsData[0].googlepaidsimtotal) +
                        Number(statsData[0].facebookpaidsimstotal) +
                        Number(statsData[0].orgainicpaidsimtotal) +
                        Number(statsData[0].affiliatepaidsimtotal) +
                        Number(statsData[0].affiliategooglepaidsimtotal) +
                        Number(statsData[0].affiliatefacebookpaidimtotal)}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {Number(statsData[0].googlesimtotal) +
                        Number(statsData[0].facebooksimtotal) +
                        Number(statsData[0].organicsimtotal) +
                        Number(statsData[0].affiliatesimtotal) +
                        Number(statsData[0].affiliategooglesimtotal) +
                        Number(statsData[0].affiliatefacebooksimtotal)}
                    </p>
                  </Grid>
                  <Grid item xs={1.5} md={1.5}>
                    <p className="titles-text">
                      {(
                        Number(statsData[0].googlepaidsimvalue) +
                        Number(statsData[0].facebookpaidsimvalue) +
                        Number(statsData[0].orgainicpaidsimvalue) +
                        Number(statsData[0].affiliatepaidsimvalue) +
                        Number(statsData[0].affiliategooglepaidsimvalue) +
                        Number(statsData[0].affiliatefacebookpaidsimvalue)
                      ).toFixed(2)}
                    </p>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", height: "500px", overflowY: "auto" }}
          >
            <AgGridReact
              ref={agGridRef}
              paginationPageSize={100}
              pagination={true}
              rowData={rowData}
              columnDefs={columnDefs}
            ></AgGridReact>
          </div>
        </div>
      )}
    </>
  );
};

export default AgGrid;
