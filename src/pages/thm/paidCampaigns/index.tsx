import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
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

const PaidCampaigns = ({ page }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const [gClidData, setGCLidData] = useState<any[]>([]);
  const [fbClidData, setFBClidData] = useState<any[]>([]);
  const [freeSimData, setFreeData] = useState(null);
  const [simType, setSimType] = useState(1); // FreeSim By Default Selected
  const [prepaidSimData, setPrepaidSimData] = useState(null);
  const agGridRef = useRef<AgGridReact | null>(null);

  let controller = new AbortController();

  useEffect(() => {
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setGCLidData([]);
      setFBClidData([]);
      fetchData(startDateParam, endDateParam, 1);
      setTimeout(() => fetchData(startDateParam, endDateParam, 2), 500);
      setFreeData(null);
      setPrepaidSimData(null);
    }
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    if (
      gClidData.length > 0 &&
      fbClidData.length > 0 &&
      selectedStartDate &&
      selectedEndDate
    ) {
      setFreeData(null);
      setPrepaidSimData(null);
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setTimeout(
        () =>
          fetchDataFromAPI(startDateParam || "", endDateParam || "", simType),
        500
      );
    }
  }, [gClidData, fbClidData, simType]);

  const fetchData = async (
    startDateParam: string,
    startEndParam: string,
    type: number
  ) => {
    await axiosInterceptorInstance
      .get(
        `/clid?StartDate=${startDateParam}&EndDate=${startEndParam}&Type=${type}`,
        { signal: controller.signal }
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        if (type === 1) {
          setGCLidData(responseData.Data);
        } else if (type === 2) {
          setFBClidData(responseData.Data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchDataFromAPI = async (
    startDateParam: string,
    startEndParam: string,
    type: number
  ) => {
    await axiosInterceptorInstance
      .get(
        `/clid/SimData?StartDate=${startDateParam}&EndDate=${startEndParam}&Type=${type}`
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        if (type === 1) {
          setFreeData(responseData.Data);
        } else {
          setPrepaidSimData(responseData.Data);
        }
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
    { field: "OrderDate", headerName: "OrderDate", filter: true },
    {
      field: "Acquisition Channel",
      headerName: "Acquisition Channel",
      filter: true,
    },
    {
      field: "ActivationDate",
      headerName: "ActivationDate",
      filter: true,
      sortable: true,
    },
  ];

  const columnDefs1: ColDef[] = [
    { field: "Msisdn", headerName: "MSISDN", filter: true },
    { field: "CreateDateTime", headerName: "CreateDateTime", filter: true },
    {
      field: "NAME",
      headerName: "NAME",
      filter: true,
    },
    {
      field: "BundleType",
      headerName: "BundleType",
      filter: true,
      sortable: true,
    },
    {
      field: "BundleCategory",
      headerName: "BundleCategory",
      filter: true,
      sortable: true,
    },
    {
      field: "Amount",
      headerName: "Amount",
      filter: true,
      sortable: true,
    },

    {
      field: "Acquisition Channel",
      headerName: "Acquisition Channel",
      filter: true,
      sortable: true,
    },

    {
      field: "ActivationDate",
      headerName: "ActivationDate",
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
      <Grid container spacing={5} style={{ marginLeft: "0px", width: "100%" }}>
        <Grid item xs={12} style={{ paddingLeft: "0px", paddingBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h2 className="heading">Google and Facebook CLID Data</h2>
              {selectedEndDate &&
                selectedStartDate &&
                Math.floor(
                  selectedEndDate.diff(selectedStartDate, "day", true)
                ) === 30 && <span className="small-text new">Last 30 Days</span>}
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
        </Grid>
        <Grid item xs={12} style={{ padding: "0" }}>
          <div
            className="graph-container"
            style={{ height: "auto", minHeight: "130px" }}
          >
            {gClidData.length === 0 && (
              <div
                className="dummy-conatiner"
                style={{ height: "auto", minHeight: "130px" }}
              >
                <CircularProgress size={40} />
              </div>
            )}
            {gClidData.length > 0 && fbClidData.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="titles-text"> CLID</p>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="titles-text"> Free sims </p>
                    </div>
                  </Grid>

                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="titles-text"> Paid sims </p>
                    </div>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <div>
                      <p className="titles-text">Total paid sims (£) </p>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="titles-text">Total sim </p>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="titles-text">Activation </p>
                    </div>
                  </Grid>
                </div>

                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="numberColumn">
                        {" "}
                        <strong style={{ fontWeight: "600" }}>Google</strong>
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">{gClidData[1].Total}</h1>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">{gClidData[0].Total}</h1>
                    </div>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <div>
                      <h1 className="numberColumn">
                        £{gClidData[0].Value || 0}
                      </h1>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">
                        {gClidData[0].Total + gClidData[1].Total}
                      </h1>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">-</h1>
                    </div>
                  </Grid>
                </div>

                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Grid item xs={2} md={2}>
                    <div>
                      <p className="numberColumn">
                        <strong style={{ fontWeight: "600" }}>Facebook</strong>
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">{fbClidData[1].Total}</h1>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">{fbClidData[0].Total}</h1>
                    </div>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <div>
                      <h1 className="numberColumn">
                        £{fbClidData[0].Value || 0}
                      </h1>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">
                        {fbClidData[0].Total + fbClidData[1].Total}
                      </h1>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <div>
                      <h1 className="numberColumn">-</h1>
                    </div>
                  </Grid>
                </div>
              </div>
            )}
          </div>
        </Grid>
      </Grid>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "linear", duration: 0.5 }}
      >
        <div className="action-conatiner">
          <button
            className={"small-btn" + (simType === 1 ? " selected" : "")}
            onClick={() => {
              setSimType(1); //Free Sim
            }}
          >
            Free Sim Report
          </button>
          <button
            className={"small-btn" + (simType === 2 ? " selected" : "")}
            onClick={() => {
              setSimType(2); //Prepaid Sim
            }}
          >
            Prepaid Sim Report
          </button>
        </div>
        {simType === 1 && freeSimData && (
          <div className="row" style={{ marginBottom: "15px" }}>
            <div></div>
            <div>
              <button
                className="small-btn"
                onClick={() => {
                  if (freeSimData) {
                    exportGridDataAsCSV();
                  }
                }}
              >
                Export as CSV
              </button>
            </div>
          </div>
        )}
        {!freeSimData && simType === 1 && (
          <div className="dummy-conatiner">
            <CircularProgress size={40} />
          </div>
        )}
        {simType === 1 && freeSimData && (
          <div className="ag-theme-alpine">
            <AgGridReact
              ref={agGridRef}
              paginationPageSize={12}
              pagination={true}
              domLayout="autoHeight"
              rowData={freeSimData}
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
        {simType === 2 && prepaidSimData && (
          <div className="row" style={{ marginBottom: "15px" }}>
            <div></div>
            <div>
              <button
                className="small-btn"
                onClick={() => {
                  if (prepaidSimData) {
                    exportGridDataAsCSV();
                  }
                }}
              >
                Export as CSV
              </button>
            </div>

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
        )}
        {!prepaidSimData && simType === 2 && (
          <div className="dummy-conatiner">
            <CircularProgress size={40} />
          </div>
        )}
        {simType === 2 && prepaidSimData && (
          <div className="ag-theme-alpine">
            <AgGridReact
              ref={agGridRef}
              paginationPageSize={12}
              pagination={true}
              domLayout="autoHeight"
              rowData={prepaidSimData}
              columnDefs={columnDefs1}
              onGridReady={onGridReady}
            ></AgGridReact>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default PaidCampaigns;
