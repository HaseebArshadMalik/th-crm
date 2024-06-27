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

const OperatorSummaryGiftCard = () => {


    const [summaryGiftCard, setSummaryGiftCard] = useState<any>([]);
    const agGridRef = useRef<AgGridReact | null>(null);
    const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
        dayjs().add(-14, "days")
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [calendarOpen, setCalendarOpen] = useState(false);

    useEffect(() => {

        const summaryGiftCard = [
            { OperatorName: 'Amazon', ProductName: 'Amazon', Count: 2 },
            { OperatorName: 'Amazon', ProductName: 'Airbnb', Count: 3 },
            { OperatorName: 'Amazon', ProductName: 'Asos', Count: 4 },
            { OperatorName: 'Amazon', ProductName: 'Bitcoin', Count: 1 },
            { OperatorName: 'Amazon', ProductName: 'Fortnite', Count: 5 }

        ];
        setSummaryGiftCard(summaryGiftCard);
    }, []);
    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            const startDateParam = selectedStartDate.format("YYYY-MM-DD");
            const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
            //setSummaryGiftCard(null);
            //GetsummaryGiftCard(startDateParam || "", endDateParam || "");
        }
    }, [selectedStartDate, selectedEndDate]);

    const exportGridDataAsCSV = () => {
        if (agGridRef.current) {
            agGridRef.current.api.exportDataAsCsv();
        }
    };
    const columnDefs: ColDef[] = [
        {
            field: "OperatorName",
            headerName: "OperatorName",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            field: "ProductName",
            headerName: "ProductName",
            filter: true,
            sortable: true,
            resizable: true,
        },
        {
            field: "Count",
            headerName: "Count",
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

    const GetsummaryGiftCard = async (startDate: string, endDate: string) => {
        await axiosInterceptorInstance
            .get(
                `/dashboard/GetsummaryGiftCard?StartDate=${startDate}&EndDate=${endDate}`
            )
            .then((response) => {
                const responseData = JSON.parse(response.data.body);
                setSummaryGiftCard(responseData.Data);
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
                <h2 className="heading">Operator Summary GiftCard</h2>
                {selectedEndDate &&
                    selectedStartDate &&
                    Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
                    14 && <span className="small-text">Last 14 Days</span>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <button
                        className="small-btn"
                        style={{ visibility: (summaryGiftCard ? "visible" : "hidden") }}
                        onClick={() => {
                            if (summaryGiftCard) {
                                exportGridDataAsCSV();
                            }
                        }}
                    >
                        Export as CSV
                    </button>
                </div>
                <IconButton
                    onClick={(e: any) => {
                        if (summaryGiftCard) {
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

            {!summaryGiftCard && (
                <div className="dummy-conatiner">
                    <CircularProgress size={40} />
                </div>
            )}
            {summaryGiftCard && (
                <div className="ag-theme-alpine">
                    <AgGridReact
                        ref={agGridRef}
                        paginationPageSize={12}
                        pagination={true}
                        domLayout="autoHeight"
                        rowData={summaryGiftCard}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                    ></AgGridReact>
                </div>
            )}
        </motion.div>
    );
};

export default OperatorSummaryGiftCard;
