import React, { useState, useRef, useEffect } from "react";
import {
    MenuItem,
    CircularProgress,
    IconButton,
    Menu,
    Dialog,
    Box,
    DialogContent,
    DialogContentText,
    Grid,
    DialogTitle,

} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import dayjs, { Dayjs } from "dayjs";
import "./index.css"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";
import { toast } from "react-toastify";

const DeleteRequest = () => {


    const [simData, setSimData] = useState(null);
    const agGridRef = useRef<AgGridReact | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
        dayjs().add(-30, "days")
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<any>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            const startDateParam = selectedStartDate.format("YYYY-MM-DD");
            const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
            setSimData(null);
            GetSimData(startDateParam || "", endDateParam || "");
        }
    }, [selectedStartDate, selectedEndDate]);

    const exportGridDataAsCSV = () => {
        if (agGridRef.current) {
            agGridRef.current.api.exportDataAsCsv();
        }
    };

    const columnDefs: ColDef[] = [
        { field: "Msisdn", headerName: "Msisdn", filter: true, sortable: true, resizable: true },
        { field: "Account", headerName: "Account", filter: true, sortable: true, resizable: true },
        { field: "Email", headerName: "Email", filter: true, sortable: true, resizable: true },
        { field: "Name", headerName: "Name", filter: true, sortable: true, resizable: true },
        { field: "AccountDeleteReasons", headerName: "AccountDeleteReasons", filter: true, sortable: true, resizable: true },
        { field: "AccountDeleteStatusName", headerName: "AccountDeleteStatus", filter: true, sortable: true, resizable: true },
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




    const GetSimData = async (startDate: string, endDate: string) => {
        await axiosInterceptorInstance
            .get(
                `/dashboard/ThaCustomerDetails?StartDate=${startDate}&EndDate=${endDate}`
            )
            .then((response) => {
                const responseData = JSON.parse(response.data.body);
                if (responseData.Data.length == 0) {
                    toast.error("No Record Found")
                }
                else {

                    setSimData(responseData.Data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const onRowClicked = (event: { data: any; }) => {

        const rowData = event.data;
        setSelectedRowData(rowData);
        setOpen(true);
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 0.5 }}
        >

            <div>
                <h2 className="heading">Delete Request</h2>
                {selectedEndDate &&
                    selectedStartDate &&
                    Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
                    30 && <span className="small-text">Last 30 Days</span>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <button
                        className="small-btn"
                        style={{ visibility: (simData ? "visible" : "hidden") }}
                        onClick={() => {
                            if (simData) {
                                exportGridDataAsCSV();
                            }
                        }}
                    >
                        Export as CSV
                    </button>
                </div>
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
            </div>


            {!simData && (
                <div className="dummy-conatiner">
                    <CircularProgress size={40} />
                </div>
            )}
            {simData && (
                <div className="ag-theme-alpine">
                    <AgGridReact
                        ref={agGridRef}
                        paginationPageSize={12}
                        pagination={true}
                        domLayout="autoHeight"
                        rowData={simData}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        onRowClicked={onRowClicked}
                    ></AgGridReact>
                </div>
            )}
            {selectedRowData != null && <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <h2 style={{ fontWeight: "bold", margin: "10px 0", paddingLeft: "10px" }}>Details</h2>
                <Grid container spacing={2} style={{ margin: "3px 0 20px 0", width: "100%", padding: "0px 10px 0px 10px" }}>
                    <Grid item xs={12} style={{ padding: "0" }}>

                        <Grid container >
                            <Grid item xs={3}>
                                <p className="tableHeader" > Msisdn</p>
                            </Grid>
                            <Grid item xs={9} md={9}>
                                <p className="tableData" >{selectedRowData.Msisdn}</p>
                            </Grid>

                            <Grid item xs={3}>
                                <p className="tableHeader" style={{ backgroundColor: "#f2eded" }}>Account </p>
                            </Grid>
                            <Grid item xs={9} md={9}>
                                <p className="tableData" style={{ backgroundColor: "#f2eded" }}>{selectedRowData.Account}</p>
                            </Grid>

                            <Grid item xs={3}>
                                <p className="tableHeader">Email </p>
                            </Grid>
                            <Grid item xs={9} md={9}>
                                <p className="tableData" >{selectedRowData.Email}</p>
                            </Grid>

                            <Grid item xs={3}>
                                <p className="tableHeader" style={{ backgroundColor: "#f2eded" }}>Name</p>
                            </Grid>
                            <Grid item xs={9} md={9}>
                                <p className="tableData" style={{ backgroundColor: "#f2eded" }}>{selectedRowData.Name}</p>
                            </Grid>

                            <Grid item xs={3}>
                                <p className="tableHeader">Reason</p>
                            </Grid>
                            <Grid item xs={9} md={9}>
                                <p className="tableData" >{selectedRowData.AccountDeleteReasons}</p>
                            </Grid>

                            <Grid item xs={3}>
                                <p className="tableHeader" style={{ backgroundColor: "#f2eded" }}>Status</p>
                            </Grid>
                            <Grid item xs={9} md={9}>
                                <p className="tableData" style={{ backgroundColor: "#f2eded" }}>{selectedRowData.AccountDeleteStatusName}</p>
                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>

            </Dialog>}

        </motion.div>
    );
};

export default DeleteRequest;
