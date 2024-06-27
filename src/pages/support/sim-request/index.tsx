import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  Box,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Menu,
  Dialog,
} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";

const SimRequest = () => {
  const [product, setProduct] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [surname, setSurName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [simData, setSimData] = useState(null);
  const agGridRef = useRef<AgGridReact | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [cOpen, setCOpen] = useState(false);
  const [action, setAction] = useState(false);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setSimData(null);
      GetSimData(startDateParam || "", endDateParam || "");
    }
  }, [selectedStartDate, selectedEndDate, product]);

  const exportGridDataAsCSV = () => {
    if (agGridRef.current) {
      agGridRef.current.api.exportDataAsCsv();
    }
  };
  const columnDefs: ColDef[] = [
    {
      field: "firstname",
      headerName: "First Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "email",
      headerName: "Email",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "AddressL1",
      headerName: "Address",
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: "OrderDateTime",
      headerName: "Order Date",
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

  const handleGetBundles = async () => {
    toast.dismiss();
    if (
      name.trim() !== "" &&
      surname.trim() !== "" &&
      address.trim() !== "" &&
      email.trim() !== "" &&
      product !== 0
    ) {
      addSimRequest();
    } else {
      toast.error("Please enter the required inputs.");
    }
  };

  const addSimRequest = async () => {
    setAction(true);
    await axiosInterceptorInstance
      .post(`/product/simorder`, {
        name,
        product,
        address,
        address2,
        zip,
        surname,
        email,
      })
      .then((res: any) => {
        const data = JSON.parse(res.data.body);
        setName("");
        setSurName("");
        setAddress("");
        setEmail("");
        setAddress2("");
        setZip("");
        setCOpen(false);
        toast.success(data.message);
        if (selectedStartDate && selectedEndDate) {
          const startDateParam = selectedStartDate.format("YYYY-MM-DD");
          const endDateParam = selectedEndDate
            .add(1, "days")
            .format("YYYY-MM-DD");
          setSimData(null);
          GetSimData(startDateParam || "", endDateParam || "");
        }
      })
      .catch((error: any) => { })
      .finally(() => {
        setAction(false);
      });
  };

  const GetSimData = async (startDate: string, endDate: string) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/GetSimData?StartDate=${startDate}&EndDate=${endDate}&Product=${product}`
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        setSimData(responseData.Data);
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
        <h2 className="heading">Sim Request</h2>
        {selectedEndDate &&
          selectedStartDate &&
          Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
          30 && <span className="small-text">Last 30 Days</span>}
      </div>

      <Grid container spacing={1} style={{ justifyContent: "end" }}>
        <Grid item xs={3}>
          <Button
            onClick={() => setCOpen(true)}
            className="dButton dButton2"
            variant="contained"
          >
            Sim Request
          </Button>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{ width: "100%", backgroundColor: "white" }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              className="selectControl"
              autoWidth
              value={product}
              defaultValue={product}
              onChange={(e: any) => {
                setSimData(null);
                setProduct(parseInt(e.target.value));
              }}
            >
              <MenuItem value="1">THM</MenuItem>
              <MenuItem value="2">Now</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <IconButton
            onClick={(e: any) => {
              if (simData) {
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

      {simData && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button
              className="small-btn"
              style={{
                visibility: simData ? "visible" : "hidden",
                marginTop: "15px",
                marginBottom: "10px",
              }}
              onClick={() => {
                if (simData) {
                  exportGridDataAsCSV();
                }
              }}
            >
              Export as CSV
            </button>
          </div>
        </div>
      )}
      {!simData && (
        <div className="dummy-conatiner">
          <CircularProgress size={40} />
        </div>
      )}

      {simData && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={agGridRef}
            paginationPageSize={8}
            pagination={true}
            domLayout="autoHeight"
            rowData={simData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      )}

      <Dialog
        open={cOpen}
        onClose={() => setCOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box style={{ padding: "0 16px " }}>
          <h1 className="heading" style={{ marginTop: "20px" }}>SIM REQUEST</h1>
          <TextField
            className="formControl"
            style={{ marginTop: "20px" }}
            label="Name"
            variant="outlined"
            value={name}
            inputProps={{ maxLength: 200 }}
            onChange={(e: any) => setName(e.target.value)}
          />
          <TextField
            className="formControl"
            label="Surname"
            variant="outlined"
            value={surname}
            inputProps={{ maxLength: 200 }}
            onChange={(e: any) => setSurName(e.target.value)}
          />
          <TextField
            className="formControl"
            label="Email"
            variant="outlined"
            value={email}
            inputProps={{ maxLength: 200 }}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <TextField
            className="formControl"
            label="Address Line 1"
            variant="outlined"
            value={address}
            inputProps={{ maxLength: 500 }}
            onChange={(e: any) => setAddress(e.target.value)}
          />
          <TextField
            className="formControl"
            label="Address Line 2"
            variant="outlined"
            value={address2}
            inputProps={{ maxLength: 500 }}
            onChange={(e: any) => setAddress2(e.target.value)}
          />
          <TextField
            className="formControl"
            label="Zip"
            variant="outlined"
            value={zip}
            inputProps={{ maxLength: 500 }}
            onChange={(e: any) => setZip(e.target.value)}
          />
          <div style={{ marginTop: "10px" }}>
            {!action && (
              <Button
                className="dButton"
                onClick={() => handleGetBundles()}
                variant="contained"
              >
                Submit
              </Button>
            )}
            {action && (
              <Button className="dButton" variant="contained">
                <CircularProgress color="inherit" size={30} />
              </Button>
            )}
          </div>
        </Box>
      </Dialog>
    </motion.div>
  );
};

export default SimRequest;
