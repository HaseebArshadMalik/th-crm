import React, { useEffect, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import moment from "moment";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { ColDef } from "ag-grid-community";
import { CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";

const PortOutReport = () => {
  const [rowData, setRowData] = useState(null);
  const agGridRef = useRef<AgGridReact | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);


  const controller = new AbortController();

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setRowData(null);
      fetchDataFromAPI(
        startDateParam || "",
        endDateParam || "",

      );
    }
  }, [selectedStartDate, selectedEndDate]);

  const fetchDataFromAPI = async (
    startDate: string,
    endDate: string,

  ) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/portinandout?StartDate=${startDate}&EndDate=${endDate}&PageNumber=1&PageSize=1&PortType=3`,
        { signal: controller.signal }
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        responseData.data.forEach((item: any) => {
          var diffOrderDate = Math.round(
            moment(moment()).diff(item.OrderDate, "month", true)
          );
          item.OrderDate = moment(item.OrderDate).format(moment.HTML5_FMT.DATE);
          item.AgeOfPurchase =
            diffOrderDate + " " + (diffOrderDate > 1 ? "Months" : "Month");
          if (item.ActivationDate) {
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
          item.ActivationDate = item.ActivationDate
            ? moment(item.ActivationDate).format(moment.HTML5_FMT.DATE)
            : "--";
        });
        setRowData(responseData.data);
      })
      .catch((error) => {
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
    { field: "Email", headerName: "Email", filter: true },
    { field: "NTMsisdn", headerName: "NTMsisdn", filter: true },
    {
      field: "PortMsisdn",
      headerName: "PortMsisdn",
      filter: true,
    },
    {
      field: "RequestDateTime",
      headerName: "Request Date",
      filter: true,
      sortable: true,
    },
    {
      field: "Status",
      headerName: "Status",
      filter: true,
      sortable: true,
    },
    {
      field: "Network",
      headerName: "Network",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <h2 className="heading">Portout Report</h2>
      {selectedEndDate &&
        selectedStartDate &&
        Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
        30 && <span className="small-text">Last 30 Days</span>}

      <div style={{ display: "flex", justifyContent: "space-between" }}>

        <div>
          <button
            className="small-btn"
            style={{ visibility: (rowData ? "visible" : "hidden") }}
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
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={agGridRef}
            paginationPageSize={12}
            pagination={true}
            domLayout="autoHeight"
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      )}
    </motion.div>
  );
};

export default PortOutReport;
