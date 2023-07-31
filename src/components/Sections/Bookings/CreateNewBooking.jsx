import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Calender.css";
import {
  EmojiSmileFill,
  Calendar4,
  Clock,
  Globe2,
} from "react-bootstrap-icons";
import TimeSelectReschedual from "./TimeSelectReschedual";
import { Calendar, utils } from "@amir04lm26/react-modern-calendar-date-picker";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { url } from "../env.js";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Swal from "sweetalert2";

function CreateNewBooking() {
  const [selectedDay, setSelectedDay] = useState();
  const [loadedData, setLoadedData] = useState();
  const [data, setData] = useState();
  const [userData, setUserData] = useState();
  const [getBookings, setGetBookings] = useState();
  const history = useHistory();

  const { userId, BookingsTypeId, id } = useParams();

  const fetchUser = async () => {
    const getUser = await axios.get(`${url}/api/getUsersById/${userId}`);
    setUserData(getUser);
  };

  const bookingsData = async () => {
    try {
      let response = await axios.get(`${url}/api/getBookingsById/${id}`);
      if (!response) {
        throw new Error("Could not find bookings");
      } else {
        setLoadedData(response.data);
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        text: error,
        showCancelButton: false,
        // confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const fetchBooking = async () => {
    const bookings = await axios.post(`${url}/api/getBookingsByUserId`, {
      userId: userId,
    });
    if (!bookings) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Booking not found",
        color: "black",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      setGetBookings(bookings.data);
    }
  };

  const getData = async () => {
    try {
      let response = await axios.get(
        `${url}/api/getBookingsTypesById/${BookingsTypeId}`
      );
      if (!response) {
        throw new Error("Failed to fetch data");
      }
      setData(response.data);
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

  useEffect(() => {
    fetchUser();
    bookingsData();
    fetchBooking();
    getData();
  }, []);

  const handleCancel = async (event) => {
    Swal.fire({
      position: "center",
      text: "Do you want to cancel the Booking?",
      showCancelButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: "#dc3545",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await axios.put(
            `${url}/api/updateBookingsStatus/${id}`,
            {
              status: "Canceled",
            }
          );
          if (!response) {
            // throw new Error("Could not cancel booking");
            Swal.fire({
              position: "center",
              icon: "error",
              text: "Network Error",
              color: "black",
              showCancelButton: true,
              confirmButtonText: "Ok",
              confirmButtonColor: "#dc3545",
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "success",
              text: "Booking cancelled",
              color: "black",
              showCancelButton: true,
              confirmButtonText: "Ok",
              confirmButtonColor: "#dc3545",
            });
            history.push(`/CancelBooking/${id}`);
          }
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
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <Container className="py-5 px-3">
      <Row className="pl-2">
        <Col className="mb-5">
          <Row className="ml-1">
            {userData && userData.data.data.img ? (
              <img className="profileImageinRe" src={userData?.data.data.img} />
            ) : (
              <img
                className="profileImageinRe"
                src="https://asset-tidycal.b-cdn.net//img/smiley.svg"
                alt="logo"
              />
            )}
            <span className="d-flex text-nowrap align-items-center ml-2">
              {userData?.data.data.name}
            </span>
          </Row>
          <Row className="py-3">
            <Col>
              <h4 className="font-weight-bold text-nowrap">
                {loadedData?.data.duration} minutes Meeting
              </h4>
            </Col>
          </Row>
          <Row className=" text-nowrap">
            <Col className="d-flex align-items-center pt-4 ">
              <Calendar4 className="mr-2" />
              <span>
                {moment(loadedData?.data.currentTime, "MM Do YYYY").format(
                  "MMMM Do YYYY"
                )}{" "}
                , at {loadedData?.data.time}
              </span>
            </Col>
          </Row>
          <Row className="d-flex align-items-center py-2 text-nowrap">
            <Col>
              <Globe2 className="mr-2" />
              <span>{loadedData?.data.location}</span>
            </Col>
          </Row>
          <Row className="d-flex align-items-center text-nowrap">
            <Col>
              <Clock className="mr-2" />
              <span>{loadedData?.data.duration} minutes</span>
            </Col>
          </Row>
          <Row className="d-flex align-items-center py-2">
            <Col>
              <button
                className="text-danger btn btn-sm btn-link p-0"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </Col>
          </Row>
          <Row className="d-flex align-items-center py-2">
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
              Reschedule:
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
            <TimeSelectReschedual
              setUserName={userData?.data.data.name}
              setDuration={loadedData?.data.duration}
              setDaysHead={loadedData?.data.days_ahead}
              setLocation={loadedData?.data.location}
              available={data?.data.available}
              setSelectedDay={selectedDay}
              setTime={loadedData?.data.time}
              enabledDays={data?.data.available.map(
                (e) => e.enable === false && e.day
              )}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CreateNewBooking;
