import React, { useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface CalendarProps {
  selectedStartDate: Dayjs;
  selectedEndDate: Dayjs;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedStartDate,
  selectedEndDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const selectedStartDateRef = useRef<Dayjs | null>(dayjs(selectedStartDate));
  const selectedEndDateRef = useRef<Dayjs | null>(dayjs(selectedEndDate));
  const customDateFormat = "DD-MM-YYYY";

  return (
    <div className="outer-div">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <label>Start Date</label>
          <DatePicker
            disableFuture
            value={selectedStartDateRef.current}
            onChange={(date) => {
              selectedStartDateRef.current = date;
              onStartDateChange(date);
            }}
            maxDate={selectedEndDateRef.current}
            format={customDateFormat}
          />
        </div>
        <div style={{ marginLeft: "5px" }}>
          <label>End Date</label>
          <DatePicker
            disableFuture
            defaultValue={selectedEndDateRef.current}
            onChange={(date) => {
              selectedEndDateRef.current = date;
              onEndDateChange(date);
            }}
            minDate={selectedStartDateRef.current}
            format={customDateFormat}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
