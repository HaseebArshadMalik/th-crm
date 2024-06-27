import React, { useEffect, useRef, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { ColDef } from "ag-grid-community";
import { CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";
import MultiLineChart from "../../../components/charts/MultiLineChart";
import MultiLineZoomChart from "../../../components/charts/MultiLineZoomChart";

const ThaPaymentStats = () => {
  const [rowData, setRowData] = useState<any[] | null>(null);
  const [transformedData, setTransformedData] = useState<any>([]);
  const agGridRef = useRef<AgGridReact | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-7, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [type, setType] = useState(3);

  const controller = new AbortController();

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (rowData) {
      const uniqueKeys = Array.from(
        new Set(
          rowData.flatMap((entry) => [
            `${entry.ProductItemCode} ${entry.TransactionType}`,

          ])
        )
      );

      const groupedData = rowData.reduce((acc, entry) => {
        const day = entry.TransactionTime.split('T')[0];
        const combinedCode = `${entry.ProductItemCode} ${entry.TransactionType}`;

        let existingDay = acc.find((dayData: { Date: any; }) => dayData.Date === day);

        if (!existingDay) {
          existingDay = { Date: day };
          uniqueKeys.forEach((key) => {
            existingDay[key] = 0;
          });
          acc.push(existingDay);
        }

        existingDay[combinedCode] = (existingDay[combinedCode] || 0) + entry.Total;

        return acc;
      }, []);
      setTransformedData(groupedData);
    }
  }, [rowData]);
  console.log(transformedData);
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setRowData(null);
      setTransformedData([]);
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
        `/dashboard/paymentstats?StartDate=${startDate}&EndDate=${endDate}&Type=${type}`,
        { signal: controller.signal }
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        setRowData(responseData.Data);
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

  const columnDefs: ColDef[] = [
    { field: "TransactionTime", headerName: "TransactionTime", filter: true },
    { field: "ProductItemCode", headerName: "ProductItemCode", filter: true },
    { field: "TransactionType", headerName: "TransactionType", filter: true },
    {
      field: "Topup",
      headerName: "Topup",
      filter: true,
    },
    {
      field: "Bundle",
      headerName: "Bundle",
      filter: true,
    },
    {
      field: "Total",
      headerName: "Total",
      filter: true,
    }
  ];

  const onGridReady = (params: { api: { sizeColumnsToFit: () => void } }) => {
    params.api.sizeColumnsToFit();
  };

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
console.log(transformedData);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div>
        <h2 className="heading">Payment Stats</h2>
        {selectedEndDate &&
          selectedStartDate &&
          Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
          7 && <span className="small-text">Last 7 Days</span>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0 5px 0" }}>

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
      {transformedData.length > 0 && (
        <div className="boxShadow" style={{ overflow: "hidden" }}>
          <div style={{ padding: "40px 40px 40px 40px" }}>
            <MultiLineZoomChart chartData={transformedData} />
          </div>
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

export default ThaPaymentStats;
