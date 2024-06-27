import React from "react";
import { motion } from "framer-motion";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Calendar from "../../../components/calendar/Calender";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Sales = () => {
  const [data, setData] = useState<any>(null);
  const [category, setCategory] = useState<string>("2-1-0");
  const [offer, setOffer] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());

  const controller = new AbortController();

  useEffect(() => {
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate && category) {
      const cats = category.split("-");
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      if (cats.length > 2) {
        setOffer(parseInt(cats[2]));
      }
      setData(null);
      setTimeout(() => {
        fetchDataFromAPI(startDateParam, endDateParam, cats[0], cats[1]);
      }, 500);
    }
  }, [selectedStartDate, selectedEndDate, category]);

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

  const fetchDataFromAPI = async (
    startDateParam: string,
    startEndParam: string,
    type: any,
    catgegory: any
  ) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard/packages/sales?StartDate=${startDateParam}&EndDate=${startEndParam}&Category=${catgegory}${type !== "0" ? `&Type=${type}` : ``
        }`,
        { signal: controller.signal }
      )
      .then((response: any) => {
        const responseData = JSON.parse(response.data.body);
        setData(responseData.sales);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "linear", duration: 0.5 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2 className="heading">Bundles Sales { }</h2>
          {selectedEndDate &&
            selectedStartDate &&
            Math.floor(selectedEndDate.diff(selectedStartDate, "day", true)) ===
            30 && <span className="small-text">Last 30 Days</span>}
        </div>
        <div>
          <FormControl style={{ width: "250px" }}>
            <InputLabel id="demo-simple-select-label" style={{ background: "#f4f5fa", padding: " 0 5px" }}>Plans</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Age"
              onChange={(e: any) => setCategory(e.target.value)}
            >
              <MenuItem value={"2-1-0"}>Monthly Plans</MenuItem>
              <MenuItem value={"1-1-0"}>PAYG Plans</MenuItem>
              <MenuItem value={"0-6-0"}>12 Months Plans</MenuItem>
              <MenuItem value={"0-3-0"}>Data Only Plans</MenuItem>
              <MenuItem value={"0-2-0"}>International Plans</MenuItem>
              <MenuItem value={"0-5-1"}>Special Monthly Offers</MenuItem>
              <MenuItem value={"0-5-2"}>Special 12 Months Offers</MenuItem>
            </Select>
          </FormControl>
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
      </div>
      {!data && (
        <div className="dummy-conatiner">
          <CircularProgress size={40} />
        </div>
      )}
      {data && (
        <Grid container spacing={0}>
          {data.map((item: any, index: number) => (
            <>
              {offer === 0 && (
                <Grid key={index} item md={4} lg={3}>
                  <div
                    className="sales-container"
                    style={{ borderColor: item.Name }}
                  >
                    <strong className="main-head">{item.Name}</strong>
                    <strong className="main-count">{item.Total}</strong>
                  </div>
                </Grid>
              )}
              {offer === 1 && item.Name.indexOf("12") === -1 && (
                <Grid key={index} item md={4} lg={3}>
                  <div
                    className="sales-container"
                    style={{ borderColor: item.Name }}
                  >
                    <strong className="main-head">{item.Name}</strong>
                    <strong className="main-count">{item.Total}</strong>
                  </div>
                </Grid>
              )}
              {offer === 2 && item.Name.indexOf("12") !== -1 && (
                <Grid key={index} item md={4} lg={3}>
                  <div
                    className="sales-container"
                    style={{ borderColor: item.Name }}
                  >
                    <strong className="main-head">{item.Name}</strong>
                    <strong className="main-count">{item.Total}</strong>
                  </div>
                </Grid>
              )}
            </>
          ))}
        </Grid>
      )}
    </motion.div>
  );
};

export default Sales;
