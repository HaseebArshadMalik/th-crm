import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import "./index.css";
import Calendar from "../../../components/calendar/Calender";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs, { Dayjs } from "dayjs";
import { ColDef } from "ag-grid-community";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
;

const PlanSubscriptionReport = ({ page }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-7, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [newSimData, setNewSimData] = useState(null);
  const [simType, setSimType] = useState(2); // FreeSim By Default Selected
  const [oldSimData, setOldSimData] = useState(null);
  const [activeUserData, setActiveUserData] = useState(null);
  const agGridRef = useRef<AgGridReact | null>(null);


  let controller = new AbortController();

  useEffect(() => {
    return () => controller.abort();
  }, []);



  useEffect(() => {
    if (

      selectedStartDate &&
      selectedEndDate
    ) {
      setNewSimData(null);
      setOldSimData(null);
      setActiveUserData(null);
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setTimeout(
        () =>
          fetchDataFromAPI(startDateParam || "", endDateParam || "", simType),
        500
      );
    }
  }, [selectedStartDate, selectedEndDate, simType]);



  const fetchDataFromAPI = async (
    startDateParam: string,
    startEndParam: string,
    type: number
  ) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/report/subcription?StartDate=${startDateParam}&EndDate=${startEndParam}&Type=${type}`,
        { signal: controller.signal }
      )
      .then((response: any) => {
        const responseData = JSON.parse(response.data.body);
        if (type === 1) {
          setNewSimData(responseData.Data);
        } if (type === 2) {
          setOldSimData(responseData.Data);
        }
        else {
          setActiveUserData(responseData.Data);
        }
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

  const onGridReady = (params: { api: { sizeColumnsToFit: () => void } }) => {
    params.api.sizeColumnsToFit();
  };
  const columnDefs: ColDef[] = [
    { field: "msisdn", headerName: "Msisdn", filter: true },
    { field: "email", headerName: "Email", filter: true },
    {
      field: "TransactionTypeDetail",
      headerName: "Transaction Type",
      filter: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      filter: true,
      sortable: true,
    },
    {
      field: "currency",
      headerName: "Currency",
      filter: true,
      sortable: true,
    },
    {
      field: "PaymentMethodTypeDetail",
      headerName: "Payment Method",
      filter: true,
      sortable: true,
    },
  ];

  const columnDefs1: ColDef[] = [
    { field: "Id", headerName: "ID", filter: true },
    {
      field: "firstname",
      headerName: "F Name",
      filter: true,
    },
    {
      field: "lastname",
      headerName: "L Name",
      filter: true,
    },
    {
      field: "email",
      headerName: "Email",
      filter: true,
    },
    { field: "msisdn", headerName: "Msisdn", filter: true },
    { field: "orderpurchase", headerName: "Date Of purchase", filter: true },
    {
      field: "TransactionTypeDetail",
      headerName: "Transaction Type",
      filter: true,
      sortable: true,
    },

    {
      field: "TotalAmount",
      headerName: "Amount",
      filter: true,
      sortable: true,
    },
    {
      field: "PaymentMethodTypeDetail",
      headerName: "Payment Type",
      filter: true,
      sortable: true,
    }
  ];
  const columnDefs2: ColDef[] = [
    { field: "MISIDN", headerName: "MSISDN", filter: true },
    { field: "First Used Date", headerName: "First Used Date", filter: true },
    {
      field: "Last Used Date",
      headerName: "Last Used Date",
      filter: true,
    },
    {
      field: "SIM State",
      headerName: "SIM State",
      filter: true,
      sortable: true,
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


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "linear", duration: 0.5 }}
      >

        <h2 className="heading">Plan Subscription Report</h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>

          <div>
            <button
              className="small-btn"
              style={{ visibility: (oldSimData ? "visible" : "hidden") }}
              onClick={() => {
                if (oldSimData) {
                  exportGridDataAsCSV();
                }
              }}
            >
              Export as CSV
            </button>
          </div>
          <IconButton onClick={handleMenuClick}>
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

        {/* <div className="action-conatiner">

          <button
            className={"small-btn" + (simType == 1 ? " selected" : "")}
            onClick={() => {
              setSimType(1); //Free Sim
            }}
          >
            New Sim New Subscription
          </button>
          <button
            className={"small-btn" + (simType == 2 ? " selected" : "")}
            // onClick={() => {
            //   setSimType(2); //Prepaid Sim
            // }}
          >
            Old Sim New Subscription
          </button>
          <button
            className={"small-btn" + (simType == 3 ? " selected" : "")}
            onClick={() => {
              setSimType(3); //Prepaid Sim
            }}
          >
            Total Active User
          </button>
          

          <div className="toggle">

            <IconButton onClick={handleMenuClick}>
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


        </div> */}
        {simType === 1 && newSimData && (
          <div className="row" style={{ marginBottom: "15px" }}>
            <div></div>
            <div>
              <button
                className="small-btn"
                onClick={() => {
                  if (newSimData) {
                    exportGridDataAsCSV();
                  }
                }}
              >
                Export as CSV
              </button>
            </div>
          </div>
        )}
        {!newSimData && simType === 1 && (
          <div className="dummy-conatiner">
            <CircularProgress size={40} />
          </div>
        )}
        {simType === 1 && newSimData && (
          <div className="ag-theme-alpine">
            <AgGridReact
              ref={agGridRef}
              paginationPageSize={12}
              pagination={true}
              domLayout="autoHeight"
              rowData={newSimData}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
            ></AgGridReact>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "linear", duration: 0.5 }}
      >
        {/* {simType === 2 && oldSimData && (
          <div  style={{ marginBottom: "15px" }}>
            <div></div>
            <div>
              <button
                className="small-btn"
                onClick={() => {
                  if (oldSimData) {
                    exportGridDataAsCSV();
                  }
                }}
              >
                Export as CSV
              </button>
            </div>

          </div>
        )} */}
        {!oldSimData && simType === 2 && (
          <div className="dummy-conatiner">
            <CircularProgress size={40} />
          </div>
        )}
        {simType === 2 && oldSimData && (
          <div className="ag-theme-alpine">
            <AgGridReact
              ref={agGridRef}
              paginationPageSize={12}
              pagination={true}
              domLayout="autoHeight"
              rowData={oldSimData}
              columnDefs={columnDefs1}
            //onGridReady={onGridReady}
            ></AgGridReact>
          </div>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "linear", duration: 0.5 }}
      >
        {simType === 3 && activeUserData && (
          <div className="row" style={{ marginBottom: "15px" }}>
            <div></div>
            <div>
              <button
                className="small-btn"
                onClick={() => {
                  if (activeUserData) {
                    exportGridDataAsCSV();
                  }
                }}
              >
                Export as CSV
              </button>
            </div>


          </div>
        )}
        {!activeUserData && simType === 3 && (
          <div className="dummy-conatiner">
            <CircularProgress size={40} />
          </div>
        )}
        {simType === 3 && activeUserData && (
          <div className="ag-theme-alpine">
            <AgGridReact
              ref={agGridRef}
              paginationPageSize={12}
              pagination={true}
              domLayout="autoHeight"
              rowData={activeUserData}
              columnDefs={columnDefs2}
              onGridReady={onGridReady}
            ></AgGridReact>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default PlanSubscriptionReport;
