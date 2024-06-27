import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import "./index.css";
import PIEChart from "../../../components/charts/PieChart";
import axiosInterceptorInstance from "../../../utils/axios.interceptor";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Calendar from "../../../components/calendar/Calender";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { prepaidSim, totalSim } from "../../../utils/index.type";

const Dashboard = ({ page }: any) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [prepaidSimStates, setPrepaidSimStates] = useState<prepaidSim[]>([]);
  const [totalSimStates, setTotalSimStates] = useState<totalSim[]>([]);
  const [userActivityData, setUserActivityData] = useState<any>(null);
  const [portInStates, setPortInStates] = useState<prepaidSim[]>([]);
  const [portOutStates, setPortOutStates] = useState<prepaidSim[]>([]);
  const [pieChartData, setPieChartData] = useState<totalSim[]>([]);
  const [totalSimPieChartData, setTotalSimPieChartData] = useState<totalSim[]>([]);
  const [totalPortPieChartData, setTotalPortPieChartData] = useState<totalSim[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    dayjs().add(-30, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(dayjs());
  const navigate = useNavigate();
  const product = 1;

  const controller = new AbortController();

  useEffect(() => {
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDateParam = selectedStartDate.format("YYYY-MM-DD");
      const endDateParam = selectedEndDate.add(1, "days").format("YYYY-MM-DD");
      setPrepaidSimStates([]);
      setTotalSimPieChartData([]);
      setUserActivityData(null);
      setTotalSimStates([]);
      setPortInStates([]);
      setPortOutStates([]);
      fetchDataFromAPI(startDateParam, endDateParam, product);
    }
  }, [selectedStartDate, selectedEndDate]);

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

  const handleButtonClick = () => {
    navigate("/thm/prepaid-sim-report");
  };

  const fetchDataFromAPI = async (
    startDateParam: string,
    startEndParam: string,
    product: number
  ) => {
    await axiosInterceptorInstance
      .get(
        `/dashboard?StartDate=${startDateParam}&EndDate=${startEndParam}&Product=${product}`,
        { signal: controller.signal }
      )
      .then((response) => {
        const responseData = JSON.parse(response.data.body);
        setPrepaidSimStates(responseData.data.PrepaidSimsStates);
        setTotalSimStates(responseData.data.TotalSimsStates);
        setUserActivityData(responseData.data.UsersStates);
        setPortInStates(responseData.data.PortInStates);
        setPortOutStates(responseData.data.PortOutStates);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (prepaidSimStates !== null) {
      var tempData: any[] = [];
      tempData.push(prepaidSimStates[4]);
      tempData.push(prepaidSimStates[2]);
      tempData.push(prepaidSimStates[3]);
      setPieChartData(tempData);
    }
  }, [prepaidSimStates]);

  useEffect(() => {
    if (totalSimStates !== null) {
      var tempData: any[] = [];
      tempData.push(totalSimStates[3]);
      tempData.push(totalSimStates[2]);
      tempData.push(totalSimStates[1]);
      setTotalSimPieChartData(tempData);
    }
  }, [totalSimStates]);
  useEffect(() => {
    if (portInStates.length > 0 && portOutStates.length > 0) {
      var tempData: any[] = [];
      portInStates[0].Name = "InRequests";
      portInStates[1].Name = "InProcessed";
      portOutStates[0].Name = "OutRequests";
      portOutStates[1].Name = "OutProcessed";
      tempData.push(portInStates[0]);
      tempData.push(portInStates[1]);
      tempData.push(portOutStates[0]);
      tempData.push(portOutStates[1]);
      setTotalPortPieChartData(tempData);
    }
  }, [portInStates, portOutStates]);
  return (
    <>
      <Grid container spacing={5} style={{ width: "100%", marginLeft: "0px" }}>
        <Grid item xs={6} md={6} style={{ paddingLeft: "0px" }}>
          <div className="graph-container">
            <div className="outer-div">
              <h2 className="heading">Prepaid SIM Orders</h2>
              <div>
                <button className="small-btn" onClick={handleButtonClick}>
                  View Report
                </button>
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
            {selectedStartDate == null ? (
              <span className="small-text">Last 30 Days</span>
            ) : (
              ""
            )}
            {prepaidSimStates.length === 0 && (
              <div className="dummy-conatiner">
                <CircularProgress size={40} />
              </div>
            )}
            {prepaidSimStates.length > 0 &&
              pieChartData.length > 0 &&
              prepaidSimStates[1].Total === 0 && (
                <div className="dummy-conatiner">
                  There is currently no data available on the selected date
                </div>
              )}
            {pieChartData.length > 0 &&
              prepaidSimStates.length > 0 &&
              prepaidSimStates[1].Total !== 0 && (
                <Grid container rowSpacing={2} columnSpacing={5}>
                  <Grid item xs={8} md={8}>
                    <div
                      style={{
                        marginTop: "30px",
                      }}
                    >
                      <PIEChart data={pieChartData} />
                    </div>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <div>
                      <p className="text">Total SIM Orders</p>
                      {prepaidSimStates ? (
                        <h1 className="numbervalue">
                          {prepaidSimStates[1].Total}
                        </h1>
                      ) : (
                        <div className="dummy-conatiner">
                          <CircularProgress size={40} />
                        </div>
                      )}
                      <p className="text">with Top-up & Plans</p>
                      {prepaidSimStates ? (
                        <h2 className="numbervalue">
                          {prepaidSimStates[4].Total}
                        </h2>
                      ) : (
                        <div className="dummy-conatiner">
                          <CircularProgress size={40} />
                        </div>
                      )}
                      <p className="text">with Top-up only</p>
                      {prepaidSimStates ? (
                        <h2 className="numbervalue">
                          {prepaidSimStates[2].Total}
                        </h2>
                      ) : (
                        <div className="dummy-conatiner">
                          <CircularProgress size={40} />
                        </div>
                      )}
                      <p className="text">with Plans only</p>
                      {prepaidSimStates ? (
                        <h2 className="numbervalue">
                          {prepaidSimStates[3].Total}
                        </h2>
                      ) : (
                        <div className="dummy-conatiner">
                          <CircularProgress size={40} />
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>
              )}
          </div>
        </Grid>
        <Grid item xs={6} md={6}>
          <div className="graph-container">
            <div className="outer-div">
              <h2 className="heading">SIM Reporting Data</h2>
            </div>
            <span className="small-text">Total SIM Orders</span>
            {totalSimStates.length > 0 ? (
              <h1 className="numbervalue" style={{ paddingLeft: "10px" }}>
                {totalSimStates[0].Total}
              </h1>
            ) : (
              <div className="dummy-conatiner">
                <CircularProgress size={40} />
              </div>
            )}

            {totalSimStates.length > 0 &&
              totalSimPieChartData.length > 0 &&
              totalSimStates[0].Total === 0 && (
                <div className="dummy-conatiner">
                  There is currently no data available on the selected date
                </div>
              )}
            {totalSimStates.length > 0 && totalSimPieChartData.length > 0 && totalSimStates[0].Total !== 0 && (
              <Grid container rowSpacing={2} columnSpacing={5}>
                <Grid item xs={8} md={8}>
                  <div>
                    <PIEChart data={totalSimPieChartData} />
                  </div>
                </Grid>
                <Grid item xs={4} md={4}>
                  <div>
                    <p className="text">Active SIM's & Purchased</p>
                    <h1 className="numbervalue">{totalSimStates[3].Total}</h1>
                    <p className="text">Active SIM's & not Purchased</p>
                    <h2 className="numbervalue">{totalSimStates[2].Total}</h2>
                    <p className="text">Inactive SIM's</p>
                    <h2 className="numbervalue">{totalSimStates[1].Total}</h2>
                  </div>
                </Grid>
              </Grid>
            )}
          </div>
        </Grid>
        <Grid item xs={6} md={6} style={{ paddingLeft: "0px" }}>
          <div className="graph-container">
            <div className="outer-div">
              <h2 className="heading">Port Insights</h2>
              <div>
                <button
                  className="small-btn"
                  onClick={() => navigate("/thm/portin-report")}
                >
                  Port-In Report
                </button>
                &nbsp;&nbsp;
                <button className="small-btn" onClick={() => navigate("/thm/portout-report")}>
                  Port-Out Report
                </button>
              </div>
            </div>
            {portInStates.length > 0 && portOutStates.length > 0 ? (
              <></>
            ) : (
              <div className="dummy-conatiner">
                <CircularProgress size={40} />
              </div>
            )}
            {portInStates.length > 0 && portOutStates.length > 0 &&
              totalPortPieChartData.length === 0 && (
                <div className="dummy-conatiner">
                  There is currently no data available on the selected date
                </div>
              )}
            {totalPortPieChartData && totalPortPieChartData.length > 0 && portInStates.length > 0 && portOutStates.length > 0 && (
              <Grid container rowSpacing={2} columnSpacing={5}>
                <Grid item xs={8} md={8}>

                  <div style={{ marginTop: "50px" }}>
                    <PIEChart data={totalPortPieChartData} />
                  </div>
                </Grid>
                <Grid item xs={4} md={4}>
                  <div>
                    <p className="text">Port-in Request</p>
                    <h1 className="numbervalue">{portInStates[0].Total}</h1>
                    <div className="m-r">
                      <p className="text">Port-in Processed</p>
                      <h2 className="numbervalue">{portInStates[1].Total}</h2>
                    </div>
                    <p className="text">Port-out Request</p>
                    <h2 className="numbervalue">{portOutStates[0].Total}</h2>
                    <div className="flex d-flex-row">
                      <div>
                        <p className="text">Port-out Processed</p>
                        <h2 className="numbervalue">
                          {portOutStates[1].Total}
                        </h2>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            )}
          </div>
        </Grid>
        <Grid item xs={6} md={6}>
          <div className="graph-container">
            <div className="outer-div">
              <h2 className="heading">User Activity</h2>
            </div>
            <span className="small-text"></span>
            <div className="outer-div"></div>
            {/* {totalSimStates ? (
              <h1 className="numbervalue">{}</h1>
            ) : (
              <div className="dummy-conatiner">
                <CircularProgress size={40} />
              </div>
            )} */}

            {/* {prepaidSimStates &&
              totalSimPieChartData &&
              totalSimPieChartData.length === 0 && ( */}
            <div className="dummy-conatiner">Under Maintenance</div>
            {/* )} */}
            {/* {totalSimPieChartData && totalSimPieChartData.length > 0 && (
              <Grid container rowSpacing={2} columnSpacing={5}>
                <Grid item xs={8} md={8}>
                  <div>
                    <AREAChart data={userActivityData} xDataKey="year" />
                  </div>
                </Grid>
                <Grid item xs={4} md={4}>
                  <div>
                    <p className="text">Total Users</p>
                    <h1 className="numbervalue">
                      {userActivityData.reduce(
                        (acc: any, item: { total: number }) => acc + item.total,
                        0
                      )}
                    </h1>
                    <p className="text">Active Users</p>
                    <h2 className="numbervalue">
                      {userActivityData.reduce(
                        (acc: any, item: { active: number }) =>
                          acc + item.active,
                        0
                      )}
                    </h2>
                    <p className="text">Inactive Users</p>
                    <h2 className="numbervalue">
                      {userActivityData.reduce(
                        (acc: any, item: { inactive: number }) =>
                          acc + item.inactive,
                        0
                      )}
                    </h2>
                  </div>
                </Grid>
              </Grid>
            )} */}
          </div>
        </Grid>
        {/* <Grid item xs={6} md={6}>
          <div className="graph-container">
            <div className="outer-div">
              <h2 className="heading">Average Customer Duration (lifetime)</h2>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={toggleCalendar}></MenuItem>
                <Calendar
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
              </Menu>{" "}
            </div>
            <span className="small-text">customer lifetime value</span>
            <div className="outer-div">
              <div>
                <h2 className="heading">34 Months</h2>
                <span>Average Customer Lifetime</span>
              </div>
              <div className="me-5">
                <h2 className="heading">$7,473.01</h2>
                <span>Average Value Lifetime</span>
              </div>
            </div>
            {!prepaidSimStates && (
              <div className="dummy-conatiner">
                <CircularProgress size={40} />
              </div>
            )}
            {prepaidSimStates && pieChartData && pieChartData.length === 0 && (
              <div className="dummy-conatiner">
                There is currently no data available on the selected date
              </div>
            )}
            {pieChartData && pieChartData.length > 0 && (
              <Grid container rowSpacing={2} columnSpacing={5}>
                <Grid item xs={12}>
                  <div
                    style={{
                      marginTop: "30px",
                    }}
                  >
                    <ComPosedChart data={pieChartData} xDataKey="Name"  barDataKey = "Total" lineDataKey = "Total" />
                  </div>
                </Grid>
              </Grid>
            )}
          </div>
        </Grid> */}
      </Grid>
    </>
  );
};

export default Dashboard;
