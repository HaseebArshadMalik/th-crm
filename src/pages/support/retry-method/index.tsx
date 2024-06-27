import React, { useRef, useState } from "react";
import {
    Button,
    Grid,
    TextField,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,

} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";


const RetryMethod = () => {
    const [data, setData] = useState<any>(null);
    const [msisdn, setmsisdn] = useState("");

    const [action, setAction] = useState<Boolean>(false);
    const agGridRef = useRef<AgGridReact | null>(null);
    const [Open, setOpen] = useState<boolean>(false);
    const [actionRequest, setActionRequest] = useState<Boolean>(false);
    const [activedata, setActiveData] = useState<any>(null);


    const exportGridDataAsCSV = () => {
        if (agGridRef.current) {
            agGridRef.current.api.exportDataAsCsv();
        }
    };
    const ActionsCellRenderer: React.FC<{ data: any }> = ({ data }) => {

        return (

            <Button
                onClick={() => { setOpen(true); setActiveData(data); }}
                className="dButton dButton2"
                variant="contained"
                style={{ width: "110px", height: "32px" }}

            > Retry

            </Button>

        );
    };
    console.log(activedata);
    const columnDefs: ColDef[] = [

        {
            field: "Account",
            headerName: "Account",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "Msisdn",
            headerName: "Msisdn",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "CallingPackageId",
            headerName: "CallingPackageId",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "Email",
            headerName: "Email",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "Name",
            headerName: "Bundle Name",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "IsRenew",
            headerName: "IsRenew",
            filter: true,
            resizable: true,
            sortable: true,
            cellDataType: "string"
        },
        {
            field: "PaymentMethod",
            headerName: "PaymentMethod",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "CreatedDate",
            headerName: "CreatedDate",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "LastExecutionDate",
            headerName: "LastExecutionDate",
            filter: true,
            resizable: true,
            sortable: true,

        },
        {
            field: "IsSuccess",
            headerName: "IsSuccess",
            filter: true,
            resizable: true,
            sortable: true,
            cellDataType: "string"
        },
        {
            field: "ErrorMessage",
            headerName: "ErrorMessage",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "ErrorCode",
            headerName: "ErrorCode",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "ReExecuteCount",
            headerName: "ReExecuteCount",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "IsActive",
            headerName: "IsActive",
            filter: true,
            resizable: true,
            sortable: true,
            cellDataType: "string"
        },
        {
            headerName: 'Actions',
            cellRenderer: ActionsCellRenderer
        },

    ];

    const handleGetBundles = async () => {
        setData(null);
        toast.dismiss();
        if (msisdn.trim().length > 9) {
            setAction(true);
            requestBundles();
        } else {
            toast.error("Please enter valid  input.");
        }
    };

    const bundleUpdateRequest = async (Id: any) => {
        setActionRequest(true);
        await axiosInterceptorInstance
            .put(`/dashboard/ChangePaymentMethod`, {
                Id: Id

            })
            .then((res: any) => {
                const responseData = JSON.parse(res.data.body);
                if (responseData.message != "") {

                    toast.success(responseData.message);
                    requestBundles();
                }

            })
            .catch((error: any) => {
                setOpen(false);
                setActionRequest(false);

            }).finally(() => {
                setOpen(false);
                setActionRequest(false);
                setData(null);
            });
    };
    const requestBundles = async () => {
        await axiosInterceptorInstance
            .get(`/dashboard/GetPaymentMethod?MSISDN=${msisdn.trim()}`)
            .then((res: any) => {

                setAction(false);
                const apiresponse = JSON.parse(res.data.body);
                if (apiresponse.Data.length == 0) {
                    toast.error("Record not found.");
                }
                else {
                    setData(apiresponse.Data);
                }
            })
            .catch((error: any) => {
                setAction(false);
                toast.error(error.message);
            });
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 0.5 }}
        >
            <div className="boxShadow">
                <h2 className="sectionTitle">Retry Method</h2>
                <div className="boxInner">
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                className="formControl"
                                label="MSISDN"
                                variant="outlined"
                                value={msisdn}
                                onChange={(e) => setmsisdn(e.target.value)}
                                inputProps={{ maxLength: 20 }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            {!action && (
                                <Button
                                    onClick={handleGetBundles}
                                    className="dButton dButton2"
                                    variant="contained"
                                >
                                    Search
                                </Button>
                            )}
                            {action && (
                                <Button className="dButton dButton2" variant="contained">
                                    <CircularProgress color="inherit" size={30} />
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <button
                    className="small-btn"
                    style={{ visibility: (data ? "visible" : "hidden") }}
                    onClick={() => {
                        if (data) {
                            exportGridDataAsCSV();
                        }
                    }}
                >
                    Export as CSV
                </button>
            </div>
            {data && (
                <div className="ag-theme-alpine">
                    <AgGridReact
                        ref={agGridRef}
                        paginationPageSize={8}
                        pagination={true}
                        domLayout="autoHeight"
                        rowData={data}
                        columnDefs={columnDefs}
                    ></AgGridReact>
                </div>
            )}
            {activedata && <Dialog
                open={Open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Retry Confirmation"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Would you really like to Retry this ?
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        className="dButton dButton2 dbuttonSec"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <div style={{ width: "30px" }}></div>
                    {!actionRequest && (
                        <Button
                            variant="contained"
                            className="dButton dButton2"
                            onClick={() => {
                                bundleUpdateRequest(activedata.Id);
                            }}
                            autoFocus
                        >
                            Retry
                        </Button>
                    )}
                    {actionRequest && (
                        <Button className="dButton dButton2" variant="contained">
                            <CircularProgress color="inherit" size={30} />
                        </Button>
                    )}
                </DialogActions>
            </Dialog>}


        </motion.div>
    );
};

export default RetryMethod;
