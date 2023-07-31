import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Calendar2, Clock, Globe2 } from "react-bootstrap-icons";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { url } from "../env.js";
import "./Calender.css";
import Swal from "sweetalert2";

function CancelBooking() {
  const [loadedData, setLoadedData] = useState();
  const { id } = useParams();
  const history = useHistory();
  const HandleBookAgain = () => {
    history.push(`/Reschedule/${id}`);
  };

  useEffect(() => {
    const bookingsData = async () => {
      try {
        let response = await axios.get(`${url}/api/getBookingsById/${id}`);
        if (!response) {
          throw new Error("Could not find bookings");
        }
        setLoadedData(response.data);
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
    bookingsData();
  }, []);

  return (
    <Container className="p-5">
      <h2 className="h4 text-center font-weight-bold mb-4 mb-sm-5 pb-3 text-nowrap">
        <span>🚫 Booking Cancelled</span>
      </h2>
      <Row className="px-5">
        <Col className="border-right">
          <div className="d-flex align-items-center text-nowrap mb-2">
            <img
              className="profile-image ml-0 mr-2"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4O8-Ud_7lnP6aq-UFoJUP0fhGuVqLaMg-eQ&usqp=CAU"
              alt="user profile"
            />
            {loadedData?.data.name}
          </div>
          <h2 className="h4 lh-base py-4 font-weight-light text-nowrap">
            {loadedData?.data.duration} Meeting
          </h2>
          <del className="d-flex align-items-center mb-2">
            <div>
              <Calendar2 className="mr-2" />
              <small>
                {moment(loadedData?.data.currentTime).format(
                  "dddd MMMM D, YYYY"
                )}{" "}
                , at {loadedData?.data.time}
              </small>
            </div>
          </del>
          <del className="text-nowrap d-flex align-items-center mb-2">
            <div>
              <Globe2 className="mr-2" />
              <small> {loadedData?.data.location} </small>
            </div>
          </del>
          <del className="text-nowrap  d-flex align-items-center">
            <div>
              <Clock className="mr-2" />{" "}
              <small className=""> {loadedData?.data.duration} </small>
            </div>
          </del>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <button
            className="btn btn-outline-dark text-nowrap"
            onClick={HandleBookAgain}
          >
            Click here to book again
          </button>
        </Col>
      </Row>
      <div className="p-5">
        <div class="border-radius-main bg-gradient-blue-vertical shadow-blue rounded-4 text-center d-flex flex-wrap overflow-hidden justify-content-center align-items-center">
          <div class="col-12 col-lg-5 p-4 pb-0 pb-lg-4 text-center text-lg-start">
            <div class="logo-white tc-logo mb-3 m-auto ms-lg-0">
              <img
                // src="https://asset-tidycal.b-cdn.net/img/logo-white.svg"
                width="120px"
                alt="kallendly white logo"
              />
            </div>
            <h2 class="fw-light h5 lh-base mb-0 text-white">
              Make scheduling your next meeting easy with kallendly!
            </h2>
          </div>

          <div class="col-12 col-md-7 col-lg-6 d-flex align-items-center justify-content-center">
            <form class=" w-100 p-4">
              <div class="rounded-4 bg-white p-2 shadow border-radius">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email…"
                  class="form-control form-control-l g border-2 border-danger w-100 mb-2"
                  required
                />
                <button
                  class="btn btn-l g btn-danger fw-bold text-antialiased w-100"
                  type="submit"
                >
                  Start for free!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CancelBooking;
