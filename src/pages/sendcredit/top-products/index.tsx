import React, { useState, useRef, useEffect } from "react";
import {

  FormControl,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Menu,
  InputLabel,
} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";
import { toast } from "react-toastify";

const TopProducts = () => {
  const [product, setProduct] = useState<number>(1);
  const [topProducts, setTopProducts] = useState(null);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);
  const [subCategory, setSubCategory] = useState<any>("0");

  const agGridRef = useRef<AgGridReact | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState<Boolean>(false);
  const [loadingData, setLoadingData] = useState<Boolean>(false);


  const loadSubCategory = async () => {
    await fetch("/data/subCategory.json").then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    }).then((json: any) => { setSubCategoryList(json.subCategory) });
  }
  const controller = new AbortController();

  useEffect(() => {
    loadSubCategory();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setTopProducts(null);
      if (subCategory == "0" || subCategory == undefined) {
        toast.error("Please Select subcategory")
        setLoadingData(false);

      }
      else {
        GetTopProducts(startDateParam || "", endDateParam || "", subCategory.subCategoryShortCode);
        setLoadingData(true);

      }
    }
  }, [selectedStartDate, selectedEndDate, subCategory]);

  const exportGridDataAsCSV = () => {
    if (agGridRef.current) {
      agGridRef.current.api.exportDataAsCsv();
    }
  };
  const columnDefs: ColDef[] = [
    {
      field: "category_name",
      headerName: "Category Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "subcategory_name",
      headerName: "Subcategory Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "SoldDate",
      headerName: "Sold Date",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "TotalRecords",
      headerName: "Total Records",
      filter: true,
      sortable: true,
      resizable: true,
    },

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





  const GetTopProducts = async (startDate: string, endDate: string, product: string) => {
    toast.dismiss();
    await axiosInterceptorInstance
      .get(
        `/dashboard/TopProducts?StartDate=${startDate}&EndDate=${endDate}&Product=${product}`
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        const formattedData = responseData.Data.map((item: any) => ({
          ...item,
          SoldDate: item.SoldDate.split('T')[0]
        }));
        setTopProducts(formattedData);

      })
      .catch((error) => {
        console.error(error);

      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div>
        <h2 className="heading">Top 10 Products</h2>
        {selectedEndDate &&
          selectedStartDate &&
          Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
          30 && <span className="small-text">Last 30 Days</span>}
      </div>

      <Grid container spacing={1} style={{ justifyContent: "end" }}>

        <Grid item xs={3}>
          {subCategoryList && <FormControl style={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-label" style={{ background: "#f4f5fa", padding: " 0 5px" }}>SubCategory</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              className="formControl"
              autoWidth
              value={subCategory?.subCategoryShortCode || "0"}
              defaultValue={subCategory?.subCategoryShortCode || "0"}
              onChange={(e: any) => {
                const country = subCategoryList?.find(item => item.subCategoryShortCode === e.target.value)
                setSubCategory(country);
              }}
            >
              <MenuItem value="0">Select SubCategory</MenuItem>
              {subCategoryList.map(item => (
                <MenuItem value={item?.subCategoryShortCode}>{item?.subCategoryName}</MenuItem>
              ))}

            </Select>
          </FormControl>}
        </Grid>
        <Grid item>
          <IconButton
            onClick={(e: any) => {
              if (topProducts) {
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
        </Grid>
      </Grid>

      {topProducts && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button
              className="small-btn"
              style={{
                visibility: topProducts ? "visible" : "hidden",
                marginBottom: "8px",
              }}
              onClick={() => {
                if (topProducts) {
                  exportGridDataAsCSV();
                }
              }}
            >
              Export as CSV
            </button>
          </div>
        </div>
      )}
      {!topProducts && loadingData && (
        <div className="dummy-conatiner">
          <CircularProgress size={40} />
        </div>
      )}

      {topProducts && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={agGridRef}
            paginationPageSize={10}
            pagination={true}
            domLayout="autoHeight"
            rowData={topProducts}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      )}


    </motion.div>
  );
};

export default TopProducts;
