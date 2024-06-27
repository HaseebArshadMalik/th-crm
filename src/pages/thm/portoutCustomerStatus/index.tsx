import React, { useState, useRef, useEffect } from "react";
import {
  CircularProgress,

} from "@mui/material";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { motion } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

const labels = [
  { name: 'Raven', definition: "The customer has requested port-out but the port-out process hasn't started." },
  { name: 'Goose', definition: 'Customer has completed port-out + their age was more than 180 days.' },
  { name: 'Godwit', definition: 'Customer has completed port-out + their age was less than 180 days but more than 90 days.' },
  { name: 'Penguin', definition: 'Customer has completed port-out + their age was less than 90 days.' }
];


const PortoutCustomerStatus = () => {
  const [portoutData, setPortoutData] = useState(null);
  const agGridRef = useRef<AgGridReact | null>(null);
  useEffect(() => {

    setPortoutData(null);
    GetPortoutStatus();

  }, []);

  const exportGridDataAsCSV = () => {
    if (agGridRef.current) {
      agGridRef.current.api.exportDataAsCsv();
    }
  };
  const columnDefs: ColDef[] = [

    {
      field: "msisdn",
      headerName: "Msisdn",
      filter: true,
      resizable: true,
      sortable: true,
    },
    {
      field: "CustomerStatus",
      headerName: "Customer Status",
      filter: true,
      resizable: true,
      sortable: true,
    },
    {
      field: "portInititated",
      headerName: "Port Inititated",
      filter: true,
      resizable: true,
      sortable: true,
    },
    {
      field: "portCompleted",
      headerName: "Port Completed",
      filter: true,
      resizable: true,
      sortable: true,
    },
    {
      field: "AgeofCustomer",
      headerName: "Age",
      filter: true,
      resizable: true,
      sortable: true,
    },
    {
      field: "donor_name",
      headerName: "Donor Name",
      filter: true,
      resizable: true,
      sortable: true,
    },
    {
      field: "recipient_name",
      headerName: "Recipient Name",
      filter: true,
      resizable: true,
      sortable: true,
    },
  ];
  const onGridReady = (params: { api: { sizeColumnsToFit: () => void } }) => {
    params.api.sizeColumnsToFit();
  };
  const GetPortoutStatus = async () => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/PortoutCustomerStatus?EndDate=2024-01-01`
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        const formattedData = responseData.Data.map((item: any) => ({
          ...item,
          portInititated: item.portInititated.split('T')[0],
          portCompleted: item.portCompleted.split('T')[0]
        }));
        setPortoutData(formattedData);
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
      <h2 className="heading" style={{ marginBottom: "revert" }}>Portout Customer Status</h2>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <button
          className="small-btn"
          style={{ visibility: (portoutData ? "visible" : "hidden") }}
          onClick={() => {
            if (portoutData) {
              exportGridDataAsCSV();
            }
          }}
        >
          Export as CSV
        </button>
      </div>

      {!portoutData && (
        <div className="dummy-conatiner">
          <CircularProgress size={40} />
        </div>
      )}
      {portoutData && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={agGridRef}
            paginationPageSize={12}
            pagination={true}
            domLayout="autoHeight"
            rowData={portoutData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      )}
      {portoutData && (
        <div className="graph-container"
          style={{ height: "auto", minHeight: "130px", borderRadius: "revert", marginTop: "5px" }}>
          <h2> Important Labels: </h2>
          <ul>
            {labels.map(label => (
              <li key={label.name} style={{ marginBottom: "10px" }}>
                <strong style={{ fontWeight: "bold" }}>{label.name}:</strong> {label.definition}
              </li>

            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default PortoutCustomerStatus;
