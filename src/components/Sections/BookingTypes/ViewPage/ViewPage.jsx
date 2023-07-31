import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Container,
  Button,
  InputGroup,
  Alert,
  Card,
} from "react-bootstrap";
import { FaGreaterThan } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import smily from "../../../../assets/img/BookingTypes/smiley.svg";
import axios from "axios";
import "./ViewPage.css";
import Swal from "sweetalert2";
import { url } from "../../env.js";

const ViewPage = () => {
  const [loadedData, setLoadedData] = useState();
  const { id } = useParams();
  const USER_ID = localStorage.getItem("userId");
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      const getUser = await axios.get(`${url}/api/getUsersById/${USER_ID}`);
      setUserData(getUser);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.post(`${url}/api/getBookingsTypes`, {
          userId: id,
        });
        if (!response) {
          throw new Error("No response found");
        }
        if (response.data.length === 0) {
          throw new Error("No Bookings Found");
        }
        setLoadedData(response.data);
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          text: error.message,
          color: "black",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Container>
        {userData && userData.data.data.img ? (
          <img className="profileImage" src={userData.data.data.img} />
        ) : (
          <img
            className="profileImage"
            src="https://asset-tidycal.b-cdn.net//img/smiley.svg"
            alt="logo"
          />
        )}
        {/* <img src={smily} className="profile-image mt-3" /> */}

        <h3 className="booking text-center mt-5">{userData?.data.data.name}</h3>
        <Row className="justify-content-center">
          {loadedData?.data.map((data) => (
            <Col md={4}>
              <div
                className={
                  userData?.data.data.planStatus === "expired" &&
                  "expired-cursor"
                }
              >
                <Card
                  className={
                    userData?.data.data.planStatus === "expired"
                      ? "first-view-card-expired mt-5"
                      : " first-view-card mt-5"
                  }
                >
                  <Card.Body className="view-card-body">
                    <Card.Title>
                      <h5 className="minutes ml-2">{data.duration} Meeting</h5>
                    </Card.Title>
                    <p className="mt-4 ml-2" style={{ color: "black" }}>
                      Book a meeting with me for {data.duration} Minutes!
                    </p>
                    <Link to={`/Schedule/${USER_ID}/${data._id}`}>
                      <Button
                        variant="outline-dark"
                        size="md"
                        style={{ paddingRight: "20px" }}
                        className="mt-4 ml-2 book-button mb-4"
                      >
                        Book now
                        <FaGreaterThan className="ml-2" />
                      </Button>
                    </Link>
                    <div className="booking-view-div mt-3"></div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default ViewPage;
