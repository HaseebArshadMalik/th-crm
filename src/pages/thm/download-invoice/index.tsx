import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import axios from "axios";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  getOrderStatus,
  getPaymentMethodByNumber,
  getTranscationTypeNameByNumber,
} from "../../../utils";
import moment from "moment";
import "./index.css";

const DownloadInvoice = () => {
  const agGridRef = useRef<AgGridReact | null>(null);
  const [msisdn, setmsisdn] = useState("");
  const [action, setAction] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [actionDownload, setActionDownload] = useState(false);

  const handleGetInovices = async () => {
    setInvoices([]);
    toast.dismiss();
    if (msisdn.trim().length > 9) {
      setAction(true);
      requestInvoices();
    } else {
      toast.error("Please enter valid inputs.");
    }
  };

  const requestInvoices = async () => {
    await axios
      .get(
        `${
          process.env.REACT_APP_THM_API_URL
        }/payment/getorderdetailsbymsisdn?Msisdn=${msisdn.trim()}`
      )
      .then((res: any) => {
        const data = res.data.data;
        if (data == null) {
          toast.error("MSISDN not found.");
        } else {
          if (data.history.length > 0) {
            data.history.map((item: any) => {
              item.bundleName = item.bundleName == "" ? "--" : item.bundleName;
              item.transactionType = getTranscationTypeNameByNumber(
                item.transactionType
              );
              item.paymentMethodType = getPaymentMethodByNumber(
                item.paymentMethodType
              );
              item.orderStatus = getOrderStatus(item.orderStatus);
              item.transactionDate = moment(item.transactionDate).format(
                "YYYY-MM-DD"
              );
            });
            setInvoices(data.history);
          } else {
            toast.info("Record Not found");
          }
        }
      })
      .catch((error: any) => {
        toast.error(error.message);
      })
      .finally(() => {
        setAction(false);
      });
  };

  const downloadInvoice = async (data: any) => {
    setActionDownload(true);
    await fetch(
      `${process.env.REACT_APP_THM_API_URL}/payment/generateinvoice`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/octet-stream",
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      }
    )
      .then((response: any) => {
        if (response.status != 200) {
          toast.dismiss();
          toast.error("Unable to download invoice");
          return;
        } else {
          return response.blob();
        }
      })
      .then((blob: any) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.target = "_blank";
          link.download = `Invoice-${data.orderID}.pdf`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setActionDownload(false);
      });
  };

  const ActionsCellRenderer: React.FC<{ data: any }> = ({ data }) => {
    return (
      <Button
        onClick={() => {
          downloadInvoice(data);
        }}
        className="dButton dButton2"
        variant="contained"
        style={{ width: "100%", height: "32px" }}
      >
        Download
      </Button>
    );
  };

  const onGridReady = (params: { api: { sizeColumnsToFit: () => void } }) => {
    params.api.sizeColumnsToFit();
  };

  const columnDefs: ColDef[] = [
    { field: "transactionDate", headerName: "Order Date", filter: true },
    { field: "bundleName", headerName: "Bundle Name", filter: true },
    { field: "totalAmount", headerName: "Total Amount", filter: true },
    { field: "vatAmount", headerName: "VAT Amount", filter: true },
    { field: "transactionType", headerName: "Transaction Type", filter: true },
    {
      field: "paymentMethodType",
      headerName: "Payment Type",
      filter: true,
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      filter: true,
    },
    { headerName: "Invoice", cellRenderer: ActionsCellRenderer },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div className="boxShadow">
        {actionDownload && (
          <div className="dimBG">
            <CircularProgress size={40} />
          </div>
        )}
        <h2 className="sectionTitle">Download Invoices</h2>
        <div className="boxInner">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                className="formControl"
                label="MSISDN"
                variant="outlined"
                defaultValue={msisdn}
                onChange={(e) => setmsisdn(e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={4}>
              {!action && (
                <Button
                  onClick={handleGetInovices}
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
      {invoices.length > 0 && (
        <div className="ag-theme-alpine">
          <AgGridReact
            ref={agGridRef}
            paginationPageSize={12}
            pagination={true}
            domLayout="autoHeight"
            rowData={invoices}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      )}
    </motion.div>
  );
};

export default DownloadInvoice;
