import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Calender.css";
import { EmojiSmileFill, Clock } from "react-bootstrap-icons";
import TimeSelect from "./TimeSelect";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "@amir04lm26/react-modern-calendar-date-picker";
import { useParams } from "react-router-dom";
import { url } from "../env.js";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

function Reschedule() {
  const [selectedDay, setSelectedDay] = useState();
  const [loadedData, setLoadedData] = useState();
  const [userData, setUserData] = useState();

  const { userId, id } = useParams();

  useEffect(() => {
    fetchUser();
    getData();
  }, []);
  const fetchUser = async () => {
    const getUser = await axios.get(`${url}/api/getUsersById/${userId}`);
    setUserData(getUser);
  };

  let enabledDays;

  const getData = async () => {
    try {
      let response = await axios.get(`${url}/api/getBookingsTypesById/${id}`);

      if (!response) {
        throw new Error("Failed to fetch data");
      }
      setLoadedData(response.data);
      enabledDays = response.data.data.available.map(
        (e) => e.enable === false && e.day
      );
    } catch (error) {
      Swal.fire({
        position: "center",
        text: "Network error",
        color: "black",
        showCancelButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <Container className="py-5 px-3">
      <Row className="pl-2">
        <Col className="mb-5">
          <Row className="ml-1">
            {userData && userData.data.data.img ? (
              <img className="profileImageinRe" src={userData.data.data.img} />
            ) : (
              <img
                className="profileImageinRe"
                src="https://asset-tidycal.b-cdn.net//img/smiley.svg"
                alt="logo"
              />
            )}
            {/* <EmojiSmileFill
              style={{
                color: "grey",
                height: 40,
                width: 40,
                opacity: 0.2,
                marginRight: 10,
              }}
            /> */}
            <span className="d-flex text-nowrap align-items-center ml-3">
              {userData?.data.data.name}
            </span>
          </Row>
          <Row className="pt-3">
            <Col>
              <h4 className="font-weight-bold text-nowrap">
                {loadedData?.data.duration} minutes Meeting
              </h4>
            </Col>
          </Row>
          <Row className="d-flex align-items-center text-nowrap py-4">
            <Col>
              <Clock className="mr-2" />
              <span>{loadedData?.data.duration} minutes </span>
            </Col>
          </Row>
          <Row className="d-flex align-items-center">
            <Col>
              <p>
                Book a meeting with me for {loadedData?.data.duration} minutes!
              </p>
            </Col>
          </Row>
        </Col>

        <Col className="mb-5">
          <div className="d-flex flex-column">
            <h2
              className="h4 mb-0"
              style={{
                fontWeight: "lighter",
              }}
            >
              Select Date:
            </h2>

            <Calendar
              className="line-height"
              value={selectedDay}
              onChange={setSelectedDay}
              minimumDate={utils().getToday()}
            />
          </div>
        </Col>

        <Col className="px-lg-5">
          {selectedDay !== undefined && (
            <TimeSelect
              setDuration={loadedData.data.duration}
              setDaysHead={loadedData.data.days_ahead}
              setLocation={loadedData.data.location}
              setSelectedDay={selectedDay}
              setUserName={userData?.data.data.name}
              available={loadedData?.data.available}
              enabledDays={loadedData.data.available.map(
                (e) => e.enable === false && e.day
              )}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Reschedule;
