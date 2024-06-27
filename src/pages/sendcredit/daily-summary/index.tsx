import React, { useState, useRef, useEffect } from "react";
import {
  MenuItem,
  CircularProgress,
  IconButton,
  Menu,
} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { motion } from "framer-motion";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs, { Dayjs } from "dayjs";
import Calendar from "../../../components/calendar/Calender";
import MultiLineZoomChart from "../../../components/charts/MultiLineZoomChart";
import { toast } from "react-toastify";

const DailySummary = () => {
  const [summaryData, setSummaryData] = useState<any[] | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState<Boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const agGridRef = useRef<AgGridReact | null>(null);
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[] | null>(null);

  const [loadingData, setLoadingData] = useState<Boolean>(false);
  const pageSize = 8;

  useEffect(() => {

    const startDate = selectedStartDate ? selectedStartDate.format("YYYY-MM-DD") : '';
    const endDate = selectedEndDate ? selectedEndDate.format("YYYY-MM-DD") : '';
    setRowData([]);
    setLoadingData(true);
    setTimeout(() => {
      GetSummaryData(startDate, endDate, 1, 999)
        .then((res) => {
          const rowData = res.data;
          setRowData(rowData);

        })
    }, 1000)


  }, [selectedStartDate, selectedEndDate],);

  useEffect(() => {
    if (rowData) {
      const uniqueKeys = Array.from(
        new Set(
          rowData.flatMap((entry) => [
            `${entry.category_name} ${entry.subcategory_name}`,

          ])
        )
      );

      const groupedData = rowData.reduce((acc, entry) => {
        const day = entry.Date.split('T')[0];
        const combinedCode = `${entry.category_name} ${entry.subcategory_name}`;

        let existingDay = acc.find((dayData: { Date: any; }) => dayData.Date === day);

        if (!existingDay) {
          existingDay = { Date: day };
          uniqueKeys.forEach((key) => {
            existingDay[key] = 0;
          });
          acc.push(existingDay);
        }

        existingDay[combinedCode] = (existingDay[combinedCode] || 0) + entry.TotalRecords;

        return acc;

      }, []);
      setTransformedData(groupedData);
    }
  }, [rowData]);

  useEffect(() => {
    if (gridApi) {
      setSummaryData(null);
      const dataSource = {
        getRows: async (params: any) => {
          const page = Math.floor(params.startRow / pageSize) + 1;
          const startDate = selectedStartDate ? selectedStartDate.format("YYYY-MM-DD") : '';
          const endDate = selectedEndDate ? selectedEndDate.format("YYYY-MM-DD") : '';
          setLoadingData(true);
          await GetSummaryData(startDate, endDate, page, pageSize)
            .then((res) => {
              const rowData = res.data;
              params.successCallback(rowData, res.totalRecords);
              setLoadingData(false);

            })
            .catch((err) => {
              console.error(err);
              params.successCallback([], 0);

            });
        },
      };

      gridApi.setDatasource(dataSource);



    }
  }, [gridApi, selectedStartDate, selectedEndDate]);



  const GetSummaryData = async (startDate: string, endDate: string, pageNumber: number, pageSize: number) => {
    toast.dismiss();
    try {
      const response = await axiosInterceptorInstance.get(
        `/dashboard/ChurnData?StartDate=${startDate}&EndDate=${endDate}&PageNumber=${pageNumber}&PageSize=${pageSize}`
      );

      const responseData = JSON.parse(response.data.body);
      if (responseData.Data.length == 0) {
        toast.error("No record found")
      }

      const formattedData = responseData.Data.map((item: any) => {
        const newItem = { ...item };
        newItem.Date = newItem.SoldDate.split('T')[0];
        delete newItem.SoldDate;
        return newItem;
      });
      setSummaryData(formattedData);
      setTotalPages(responseData.TotalPages);

      return { data: formattedData, totalRecords: responseData.TotalRecords };

    } catch (error) {
      console.error(error);
      return { data: [], totalRecords: 0 };
    }
  };
  const columnDefs: ColDef[] = [
    
    {
      field: "category_name", headerName: "Category Name",
      resizable: true,
    },
    {
      field: "subcategory_name", headerName: "SubCategory Name",
      resizable: true,
    },
    {
      field: "TotalRecords", headerName: "TotalRecords",
      resizable: true,
    },
    {
      field: "Date", headerName: "SoldDate",
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
  const exportGridDataAsCSV = () => {
    if (agGridRef.current) {
      agGridRef.current.api.exportDataAsCsv();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div>
        <h2 className="heading">Daily Summary</h2>
        {selectedEndDate &&
          selectedStartDate &&
          Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
          30 && <span className="small-text">Last 30 Days</span>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <button
            className="small-btn"
            style={{ visibility: ((summaryData?.length) ? "visible" : "hidden") }}
            onClick={() => {
              if (summaryData) {
                exportGridDataAsCSV();
              }
            }}
          >
            Export as CSV
          </button>
        </div>
        <IconButton
          onClick={(e: any) => {
            if (summaryData) {
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
      {loadingData && (
        <div className="dummy-conatiner loader">
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

      <div className="ag-theme-alpine">
        <AgGridReact
          ref={agGridRef}
          pagination={true}
          paginationPageSize={pageSize}
          cacheBlockSize={pageSize}
          maxBlocksInCache={1}
          domLayout="autoHeight"
          columnDefs={columnDefs}
          rowModelType="infinite"
          defaultColDef={{ flex: 1 }}
          onGridReady={(params) => setGridApi(params.api)}
        />


      </div>
    </motion.div>
  );
};

export default DailySummary;