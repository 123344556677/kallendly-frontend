import React, { useEffect, useState } from "react";
import "./Bookings.css";
import { TimezoneSelect, clientTz } from "timezone-select-js";
import CreateNewBookingsModal from "./CreateNewBookingsModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { url } from "../env";
import Swal from "sweetalert2";

function TimeSelectReschedual(props) {
  const [selectedTimezone, setSelectedTimezone] = useState(clientTz());
  const [getTime, setGetTime] = useState([]);
  const [TIME, setTime] = useState([]);

  const selectedDate =
    props.setSelectedDay.month +
    "-" +
    props.setSelectedDay.day +
    "-" +
    props.setSelectedDay.year;

  const { userId, id } = useParams();

  let showTime = props.enabledDays.includes(
    moment(selectedDate, "MM Do YYYY").format("dddd")
  );

  useEffect(() => {
    getBookingsByDate();
  }, [selectedDate]);

  const getBookingsByDate = async () => {
    try {
      let response = await axios.post(`${url}/api/getBookingsByIdAndDate`, {
        userId: userId,
        currentTime: selectedDate,
      });
      if (response) {
        setGetTime(response?.data.data.map((data) => data.time));
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Network error",
        color: "black",
        showConfirmButton: false,
        timer: 1600,
      });
    }
  };

  let filterTime;
  useEffect(() => {
    var startTime;
    var endTime;

    let availableTime = props.available.filter(
      (e) => !props.enabledDays.includes(e.day)
    );

    if (
      availableTime
        .map((data) => data.day)
        .includes(moment(selectedDate, "MM Do YYYY").format("dddd"))
    ) {
      let startEndTime = availableTime.filter(
        (data) => data.day === moment(selectedDate, "MM Do YYYY").format("dddd")
      );

      startEndTime.map((data) =>
        data.availableSlots.map(
          (slots) => ((startTime = slots.start), (endTime = slots.end))
        )
      );
    }

    function intervals(start, end) {
      var start = moment(start, "hh:mm a").add(3, "h");
      var end = moment(end, "hh:mm a").subtract(1, "h");
      if (end < start) end = end.add(1, "d");
      var result = [];
      var current = moment(start);
      while (current <= end) {
        result.push(current.format("hh:mm a"));
        current.add(props.setDuration, "minutes");
      }
      return result;
    }

    setTime(intervals(startTime, endTime));
  }, [props]);

  filterTime = TIME.filter((data) => !getTime.includes(data));

  const changeSelectedTimeZone = async (e) => {
    setSelectedTimezone(e.value);
  };

  return (
    <React.Fragment>
      <div className="mb-4">
        <div className="fade-down">
          <h2 className="h4 text-nowrap pb-3 border-bottom" id="select-time">
            Select time:
          </h2>
          <div className="align-items-center">
            <TimezoneSelect
              value={selectedTimezone}
              onChange={changeSelectedTimeZone}
            />
          </div>
          <div className="overflow-auto time-list mt-4 scheduler-height">
            <CreateNewBookingsModal
              selectCountry={selectedTimezone}
              duration={props.setDuration}
              daysAhead={props.setDaysHead}
              location={props.setLocation}
              selectedDay={props.setSelectedDay}
              userName={props.setUserName}
              TIME={filterTime}
              showTime={showTime}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TimeSelectReschedual;
