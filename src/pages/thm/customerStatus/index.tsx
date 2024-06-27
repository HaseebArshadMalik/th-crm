import React, { useState, useRef, useEffect } from "react";
import {
    MenuItem,
    CircularProgress,
    IconButton,
    Menu,

} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import dayjs, { Dayjs } from "dayjs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";
import moment from "moment";

const CustomerStatus = () => {
    const [customerData, setCustomerData] = useState(null);
    const agGridRef = useRef<AgGridReact | null>(null);
    useEffect(() => {

        setCustomerData(null);
        GetCustomerStatus();

    }, []);

    const exportGridDataAsCSV = () => {
        if (agGridRef.current) {
            agGridRef.current.api.exportDataAsCsv();
        }
    };
    const columnDefs: ColDef[] = [

        {
            field: "Msisdn",
            headerName: "Msisdn",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "CustomerStatusId",
            headerName: "Customer Status Id",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "CustomStatus",
            headerName: "Custom Status",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "CreatedOn",
            headerName: "Created On",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "ModifiedOn",
            headerName: "Modified On",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "UserId",
            headerName: "User Id",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "AccountId",
            headerName: "Account Id",
            filter: true,
            resizable: true,
            sortable: true,
        },
        {
            field: "LastOrderDate",
            headerName: "Last Order Date",
            filter: true,
            resizable: true,
            sortable: true,
            cellDataType: "text"
        },
    ];
    const onGridReady = (params: { api: { sizeColumnsToFit: () => void } }) => {
        params.api.sizeColumnsToFit();
    };
    const GetCustomerStatus = async () => {
        await axiosInterceptorInstance
            .get(
                `/dashboard/CustomerStatus?EndDate=2024-01-01`
            )
            .then((response) => {
                const responseData = JSON.parse(response.data.body);
                const formattedData = responseData.Data.map((item: any) => ({
                    ...item,
                    CreatedOn: item.CreatedOn.split('T')[0],
                    ModifiedOn: item.ModifiedOn.split('T')[0],
                    LastOrderDate: item.LastOrderDate == null
                        ? "--"
                        : item.LastOrderDate.split('T')[0]
                }));
                setCustomerData(formattedData);
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
            <h2 className="heading" style={{ marginBottom: "revert" }}>Customer Status</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <button
                    className="small-btn"
                    style={{ visibility: (customerData ? "visible" : "hidden") }}
                    onClick={() => {
                        if (customerData) {
                            exportGridDataAsCSV();
                        }
                    }}
                >
                    Export as CSV
                </button>
            </div>

            {!customerData && (
                <div className="dummy-conatiner">
                    <CircularProgress size={40} />
                </div>
            )}
            {customerData && (
                <div className="ag-theme-alpine">
                    <AgGridReact
                        ref={agGridRef}
                        paginationPageSize={12}
                        pagination={true}
                        domLayout="autoHeight"
                        rowData={customerData}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                    ></AgGridReact>
                </div>
            )}
        </motion.div>
    );
};

export default CustomerStatus;
