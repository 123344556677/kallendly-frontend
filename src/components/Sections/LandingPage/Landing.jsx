import React from "react";
import { Card } from "react-bootstrap";
import "./Landing.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../env.js";
import bookingOne from "./bookingFirst.png";
import Payment from "./payments.jpeg";
import Kal from "./logo.jpeg";

import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";

function LandingPage() {
  const clientId =
    "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com"; // client id

  let history = useHistory();
  let currentDate = new Date();

  const onSuccessHandle = async (response) => {
    await axios
      .post(`${url}/api/googleLogin`, {
        tokenId: response.tokenId,
      })
      .then((response) => {
        let expiryDate = new Date(response?.data.user.planEndDate);
        localStorage.setItem("_a", true);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response?.data.user.userRole);
        localStorage.setItem("planType", response?.data.user.planType);
        if (currentDate > expiryDate) {
          try {
            let response = axios.put(
              `${url}/api/updateUser/${response.data.user._id}`,
              {
                isPremium: false,
                planStatus: "expired",
                planType: "none",
              }
            );
            if (!response) {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "No response found",
                color: "black",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "Your subscription is expired",
                color: "black",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
              axios.post(`${url}/api/sendMail`, {
                email: response?.data.user.email,
              });
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
        }

        Swal.fire({
          position: "center",
          icon: "success",
          text: "Sign up Successfull",
          color: "balck",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
        history.push("/");
        window.location.reload();
      });
  };

  // const onFailureHandle = (response) => {
  //   console.log("FAIL")
  //   // Swal.fire({
  //   //   position: "center",
  //   //   icon: "error",
  //   //   text: response,
  //   //   color: "black",
  //   //   showConfirmButton: false,
  //   //   timer: 1500,
  //   // });
  // };
  return (
    <React.Fragment>
      <div className="container-fluid m-0 p-0 email-curve bg-gradient-red-vertical">
        <div className="row ">
          <div className="py-5 col-5 col-lg-5 col-xl-7  col-md-5 col-sm-12 col-xs-12">
            <div className="d-flex justify-content-center">
              <div className="col col-lg-12 col-xxl-11">
                <div className="vh-lg-100 d-flex flex-column align-items-center align-items-lg-start ">
                  <div className="text-align-center pb-3 mt-5 mb-2 mb-lg-5 pb-lg-5 d-flex justify-content-center">
                    <div className=" demoCard col col-sm-10 col-md-8  col-lg-12">
                      <h2 className="h3 lh-sm fw-light text-white mb-4 text-center text-lg-start">
                        <strong className="text-wrap">
                          Book meetings faster.
                        </strong>
                        <br />
                        The simplest way to book and schedule meetings.
                      </h2>
                      <Card
                        className="cardResponsive bg-white rounded-4 text-center mt-5 px-2"
                        style={{ width: "100%" }}
                      >
                        <Card.Body>
                          <Card.Title className="small mb-3">
                            Join 15,000+ other users who make scheduling easier:
                          </Card.Title>
                          <Card.Text className="mb-3 ">
                            <div className="mt-3">
                              <div className="d-flex align-items-center justify-content-between">
                                <GoogleLogin
                                  className="Google-Bt"
                                  clientId={clientId}
                                  buttonText="Signup with Google"
                                  onSuccess={onSuccessHandle}
                                  // onFailure={onFailureHandle}
                                  cookiePolicy={"single_host_origin"}
                                />
                              </div>
                            </div>
                          </Card.Text>
                          <Card.Link className="text-decoration-none"></Card.Link>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                  <div className="d-none d-sm-none d-md-none d-lg-block mt-4 ml-3">
                    <div className="text-white text-left small mt-2">
                      <small>
                        Part of the
                        <a className="text-decoration-none fw-bold text-white ml-1">
                          Kallendly
                        </a>
                        <span className="ml-1">family</span>
                      </small>
                    </div>
                    <div className="text-white text-left small mt-1">
                      <small className="text-white">
                        © 2022 Kallendly, Inc. All rights reserved.{" "}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-7 col-lg-7 col-md-7 col-sm-12 col-xs-12">
            <div className="vh-lg-100 bg-big-chevron d-flex flex-column justify-content-center align-items-center p-5">
              <div className="row mt-5 p-5">
                <div
                  id="carouselExampleControls"
                  className="carousel slide p-5"
                  data-ride="carousel"
                >
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img
                        className="d-block w-100 carousel-height"
                        src={Kal}
                        alt="First slide"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        className="d-block w-100 carousel-height"
                        src={bookingOne}
                        alt="Second slide"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        className="d-block carousel-height"
                        src={Payment}
                        alt="Third slide"
                      />
                    </div>
                  </div>
                  <a
                    className="carousel-control-prev"
                    href="#carouselExampleControls"
                    role="button"
                    data-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a
                    className="carousel-control-next"
                    href="#carouselExampleControls"
                    role="button"
                    data-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="sr-only">Next</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LandingPage;
