import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import email from "../../../assets/img/BookingTypes/share-icon-email.svg";
import facebook from "../../../assets/img/BookingTypes/share-icon-facebook.svg";
import linkedin from "../../../assets/img/BookingTypes/share-icon-linkedin.svg";
import twitter from "../../../assets/img/BookingTypes/share-icon-twitter.svg";
import axios from "axios";
import "./BookingTypes.css";
import Swal from "sweetalert2";
import { url } from "../env.js";

export default function BookingTypes() {
  const [loadedData, setLoadedData] = useState();
  const [userData, setUserData] = useState();
  const [loader, setLoader] = useState(false);

  const USER_ID = localStorage.getItem("userId");

  const enableBookingsHandler = async (event) => {
    event.preventDefault();
    let id = event.target.id;
    let index = event.target.name;
    let enableBookings = !loadedData?.data[index].enableBookings;
    try {
      let response = axios.put(`${url}/api/updateBookingsTypes/${id}`, {
        enableBookings: enableBookings.toString(),
      });
      if (!response) {
        throw new Error("Could not update bookings");
      } else {
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: error,
        color: "black",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      try {
        let response = await axios.get(`${url}/api/getUsersById/${USER_ID}`);
        if (!response) {
          throw new Error("No response found");
        } else {
          setUserData(response.data);
          setLoader(false);
        }
      } catch (error) {
        setLoader(false);
        Swal.fire({
          position: "center",
          icon: "error",
          text: error.message,
          color: "black",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    };
    fetchData();
  }, []);
  let em = userData?.data.email;

  // ======== checking if the date is expired or not ==========

  // let currentDate = new Date();
  // let expiryDate = new Date(userData?.data.planEndDate);
  // console.log(userData?.data.planEndDate,"========>EndDate")

  // useEffect(() => {
  //   if (currentDate > expiryDate) {
  //     try {
  //       let response = axios.put(`${url}/api/updateUser/${USER_ID}`, {
  //         isPremium: false,
  //         planStatus: "expired",
  //         planType: "none",
  //       });
  //       if (!response) {
  //         Swal.fire({
  //           position: "center",
  //           icon: "error",
  //           text: "No response found",
  //           color: "black",
  //           showConfirmButton: true,
  //           confirmButtonText: "Ok",
  //           confirmButtonColor: "#dc3545",
  //         });
  //       } else {
  //         Swal.fire({
  //           position: "center",
  //           icon: "error",
  //           text: "Your subscription is expired",
  //           color: "black",
  //           showConfirmButton: true,
  //           confirmButtonText: "Ok",
  //           confirmButtonColor: "#dc3545",
  //         });
  //         axios.post(`${url}/api/sendMail`, {
  //           email: em,
  //         });
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         position: "center",
  //         icon: "error",
  //         text: error,
  //         color: "black",
  //         showConfirmButton: true,
  //         confirmButtonText: "Ok",
  //         confirmButtonColor: "#dc3545",
  //       });
  //     }
  //   }
  // }, []);

  const deleteBookingsHandler = async (event) => {
    event.preventDefault();
    let id = event.target.id;
    try {
      let response = axios.delete(`${url}/api/deleteBookingTypes/${id}`);
      if (!response) {
        throw new Error("Could not update bookings");
      } else {
        // fetchData();
        Swal.fire({
          position: "center",
          icon: "success",
          text: "Booking deleted successfully",
          color: "black",
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
          // timer: 1500,
        });
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Booking can not be deleted",
        color: "black",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
        // timer: 1500,
      });
    }
    fetchData();
  };

  const handleCreateBookings = async (event) => {
    event.preventDefault();
    const id = event.target.id;

    if (userData?.data.planStatus === "expired") {
      axios
        .post(`${url}/api/sendMail`, {
          email: userData.data.email,
        })
        .then((res) => {})
        .catch((err) => {
        });
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Buy our premium services to clone this booking type",
        color: "black",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
    } else {
      try {
        const response = await axios.post(
          `${url}/api/getBookingsTypesByIdAndSave/${id}`
        );

        if (!response) {
          Swal.fire({
            position: "center",
            icon: "error",
            text: "Failed to clone",
            color: "black",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
        } else {
          fetchData();
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Booking cloned successfully",
            color: "black",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          color: "black",
          text: "Failed to clone",
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let response = await axios.post(`${url}/api/getBookingsTypes`, {
        userId: USER_ID,
      });
      if (!response) {
        throw new Error("No response found");
      } else if (response.data.length === 0) {
        throw new Error("No Bookings Found");
      } else {
        setLoadedData(response.data);
        localStorage.setItem("bookingTypeLength", response.data.data.length);
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "Error in network",
        color: "black",
        text: error.message,
        showConfirmButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <React.Fragment>
      <Container className="main-container">
        <Row>
          <Col md={8}>
            <Row>
              <h3 className="booking ml-3 mt-3">Booking types</h3>
              <Link to="/create">
                <Button variant="outline-primary" className="ml-3 mt-3">
                  + Create new booking type
                </Button>
              </Link>
            </Row>
          </Col>
          <Col md={4}>
            <Link to={`/id/${USER_ID}`}>
              <a className="view mt-4">View your booking page</a>
            </Link>
          </Col>
        </Row>
        {!loader ? (
          <Row className="mt-2">
            {/* {loadedData?.data.length == 0 && " No record found ! " } */}

            {loadedData?.data.map((data, index) => (
              <Col md={4} key={data._id}>
                <Card
                  className={
                    data?.enableBookings === false
                      ? "first-card-notEnable mt-5"
                      : "first-card mt-5"
                  }
                >
                  <div
                    className={
                      userData?.data.planStatus === "expired" &&
                      "expired-cursor"
                    }
                  >
                    <Card.Body
                      className={
                        userData?.data.planStatus === "expired" &&
                        "first-card-expired"
                      }
                    >
                      <Card.Title>
                        <h5 className="minutes ml-2">
                          {data.duration} minutes Meeting
                        </h5>
                      </Card.Title>
                      <Row>
                        <Col lg={6} md={8}>
                          <Link
                            to={
                              data?.enableBookings === false
                                ? "/"
                                : `/Schedule/${USER_ID}/${data._id}`
                            }
                            className={
                              data?.enableBookings === false
                                ? "minute-notEnable ml-2 text-nowrap"
                                : "minute ml-2 text-nowrap"
                            }
                          >
                            <span className="linkview">
                              /{data.duration}-minute-meeting
                            </span>
                          </Link>
                        </Col>
                        <Col lg={6} md={4}>
                          <a
                            href="javascript:;"
                            className={
                              data?.enableBookings === false
                                ? "copy-link-notEnable mt-4 text-nowrap"
                                : "copy-link mt-4 text-nowrap"
                            }
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `https://kallendly.com/Schedule/${USER_ID}/${data._id}`
                              );
                              Swal.fire({
                                position: "center",
                                icon: "success",
                                text: "Link copied",
                                className: "copy-alert",
                                color: "black",
                                timer: 1500,
                                showConfirmButton: false,
                              });
                            }}
                          >
                            Copy link
                          </a>
                        </Col>
                      </Row>
                      <hr />
                      <div className="custom-control custom-switch ml-1">
                        {data?.enableBookings === true && (
                          <input
                            name={index}
                            type="checkbox"
                            className="custom-control-input"
                            id={data?._id}
                            checked
                            onChange={enableBookingsHandler}
                          />
                        )}
                        {data?.enableBookings !== true && (
                          <input
                            name={index}
                            type="checkbox"
                            className="custom-control-input"
                            id={data?._id}
                            onChange={enableBookingsHandler}
                          />
                        )}
                        <label
                          className="custom-control-label"
                          htmlFor={data?._id}
                        >
                          {data?.enableBookings === true && "Booking is ON"}
                          {data?.enableBookings !== true && "Booking is OFF"}
                        </label>
                      </div>
                      <p className="mt-3 ml-1" style={{ fontSize: "medium" }}>
                        <AiOutlineClockCircle className="mr-1" />
                        {data.duration} minutes
                      </p>
                      <p className="mt-3 ml-2" style={{ color: "black" }}>
                        Book a meeting with me for {data.duration} minutes!
                      </p>
                      <hr className="mt-4" />
                      <Row className="justify-content-between ">
                        <Col>
                          <p className="share-button ml-2 mt-1 ">Share:</p>
                        </Col>
                        <Col>
                          <a
                            href={
                              data?.enableBookings === false
                                ? "/"
                                : `mailto:?subject=${
                                    data.duration + " Minutes Meeting"
                                  }&amp;&body=${`https://kallendly.com/Schedule/${USER_ID}/${data._id}`}`
                            }
                          >
                            <img
                              src={email}
                              alt="share email"
                              className={
                                data?.enableBookings === false
                                  ? "icon-img-notEnable align-bottom"
                                  : "icon-img align-bottom"
                              }
                            />
                          </a>
                        </Col>
                        <Col>
                          <a
                            href={
                              data?.enableBookings === false
                                ? "/"
                                : `https://www.linkedin.com/sharing/share-offsite/?url=${`https://kallendly.com/Schedule/${USER_ID}/${data._id}`}`
                            }
                            target="_blank"
                          >
                            <img
                              src={linkedin}
                              alt="share linkedin"
                              className={
                                data?.enableBookings === false
                                  ? "icon-img-notEnable align-bottom"
                                  : "icon-img align-bottom"
                              }
                            />
                          </a>
                        </Col>
                        <Col>
                          <a
                            href={
                              data?.enableBookings === false
                                ? "/"
                                : `https://www.facebook.com/sharer.php?u=${`https://kallendly.com/Schedule/${USER_ID}/${data._id}`}&description=${
                                    data.description
                                  }`
                            }
                            target="_blank"
                          >
                            <img
                              src={facebook}
                              alt="share facebook"
                              className={
                                data?.enableBookings === false
                                  ? "icon-img-notEnable align-bottom"
                                  : "icon-img align-bottom"
                              }
                            />
                          </a>
                        </Col>
                        <Col>
                          <a
                            href={
                              data?.enableBookings === false
                                ? "/"
                                : `https://twitter.com/intent/tweet?text=${
                                    data.duration + " Minutes Meeting "
                                  } ${`https://kallendly.com/Schedule/${USER_ID}/${data._id}`}`
                            }
                            target="_blank"
                          >
                            <img
                              src={twitter}
                              alt="share twitter"
                              className={
                                data?.enableBookings === false
                                  ? "icon-img-notEnable align-bottom"
                                  : "icon-img align-bottom"
                              }
                              target="_blank"
                            />
                          </a>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col>
                          <button
                            className="btn text-danger "
                            id={data._id}
                            onClick={deleteBookingsHandler}
                          >
                            Delete
                          </button>
                        </Col>
                        <Col>
                          <button
                            id={data._id}
                            className="btn text-primary"
                            onClick={handleCreateBookings}
                          >
                            Clone
                          </button>
                        </Col>
                        <Col>
                          <Link to={`/edit/${data._id}`}>
                            <button className="btn text-primary ml-4 ml-md-0 btn-media">
                              Edit
                            </button>
                          </Link>
                        </Col>
                      </Row>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
            {loadedData?.data.length === 0 && (
              <b className="font-weight-light py-4 px-3">No Bookings Found !</b>
            )}
          </Row>
        ) : (
          <div className="d-flex justify-content-center mt-5">
            <Spinner animation="border" role="status"></Spinner>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
}
