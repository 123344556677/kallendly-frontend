import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import DetailsModal from "./DetailsModal";
import moment from "moment";
import axios from "axios";
import "./Bookings.css";
import Swal from "sweetalert2";
import { url } from "../env.js";

function Bookings() {
  const [showBooking, setShowBooking] = useState("Upcoming");
  const [tableData, setTableData] = useState();
  const [past, setPast] = useState(false);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response = await axios.get(`${url}/api/getUsersById/${USER_ID}`);
        if (!response) {
          throw new Error("No response found");
        } else {
          setUserData(response.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
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

  const handleSelect = (event) => {
    setShowBooking(event.target.value);
  };
  const USER_ID = localStorage.getItem("userId");
  const fetchBookingsData = async () => {
    try {
      let response = await axios.post(`${url}/api/getBookingsByUserId`, {
        userId: USER_ID,
      });
      if (!response) {
        throw new Error("no response found");
      } else {
        setTableData(response.data);
      }
    } catch (error) {
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
  useEffect(() => {
    fetchBookingsData();
  }, []);

  const handleCancel = async (event) => {
    let id = event.target.id;
    Swal.fire({
      position: "center",
      text: "Do you want to cancel the Booking?",
      color: "black",
      showCancelButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: "#dc3545",
    }).then(async (result) => {
      let response = await axios.put(`${url}/api/updateBookingsStatus/${id}`, {
        status: "Canceled",
      });
      if (!response) {
        throw new Error("Could not cancel booking");
      }
    });
    fetchBookingsData();
  };

  let currentDate = new Date();

  let Bookings = [];

  if (showBooking === "Upcoming") {
    tableData?.data.filter((data) => {
      if (
        currentDate < new Date(data.currentTime) &&
        data.status === "Scheduled"
      ) {
        // Bookings = tableData?.data.update((data) => data.status.update("Past"));
        Bookings.push(data);
        // Bookings = tableData?.data.filter((data) => data.status.includes("Scheduled"));
      }
    });
  }

  if (showBooking === "Cancelled") {
    Bookings = tableData?.data.filter((data) =>
      data.status.includes("Canceled")
    );
  }
  // let finalDate=[]
  // finalDate=new Date(expiryDate.map((data)=>
  //   data,
  // ))
  if (showBooking === "Past") {
    // console.log(tableData.data.currentTime,"=====>tableDate");
    // console.log(currentDate,"=====>Date");
    //   console.log(expiryDate,"=====>finalDate");
    tableData?.data.map((data) => {
      if (
        currentDate > new Date(data.currentTime) &&
        data.status === "Scheduled"
      ) {
        // Bookings = tableData?.data.update((data) => data.status.update("Past"));
        Bookings.push(data);
      }
    });
  }

  if (showBooking === "All") {
    Bookings = tableData?.data.filter((data) => data.status.includes(""));
  }
  return (
    <React.Fragment>
      <Container>
        <Row className="justify-content-between py-5">
          <Col sm>
            <h2 className="font-weight-bold">Bookings</h2>
          </Col>
          <Col sm className="text-right">
            <span>View:</span>
            <select
              name="show"
              className="dropDownIcon border p-2 rounded"
              aria-label="Default select example"
              onChange={handleSelect}
            >
              <option value="Upcoming">Upcoming bookings</option>
              <option value="Past">Past bookings</option>
              <option value="Cancelled">Cancelled bookings</option>
              <option value="All">All bookings</option>
            </select>
          </Col>
        </Row>
      </Container>
      <Container
        style={{
          height: "550px",
          overflow: "auto",
        }}
      >
        {/* <div className={userData?.data.planStatus === "expired" &&"expired-cursor"}> */}
        <div>
          <Table responsive>
            <thead>
              <tr>
                <th className="small text-secondary border-0 ps-0">Date</th>
                <th className="small text-secondary border-0 ps-0">Time</th>
                <th className="small text-secondary border-0 ps-0">Duration</th>
                <th className="small text-secondary border-0 ps-0">
                  Booking Type
                </th>
                <th className="small text-secondary border-0 ps-0">With</th>
                <th className="small text-secondary text-center border-0 ps-0">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Bookings.length == 0 && !loading && (
                <p className="py-3 px-2"> No record found ! </p>
              )}
              {Bookings?.map((data) => (
                <tr className="border-top" key={data._id}>
                  <td className="py-4 text-nowrap pe-4 ps-0 font-size">
                    {moment(data.currentTime, "MM Do YYYY").format(
                      "MMMM Do YYYY"
                    )}{" "}
                  </td>
                  <td className="py-4 small text-nowrap border-0 pe-4">
                    {data.time}
                  </td>
                  <td className="py-4 small text-nowrap border-0 pe-4">
                    {data.duration} minutes
                  </td>
                  <td className="py-4 small text-nowrap border-0">
                    <a className="text-decoration-none link-color align-middle">
                      {data.duration} minutes meeting
                    </a>
                  </td>
                  <td className="py-4 border-0 small">
                    <a className="text-decoration-none link-color">
                      {data.with}
                    </a>
                  </td>
                  <td className="py-4 border-0 text-center">
                    {showBooking === "Upcoming" &&
                      data.status === "Scheduled" && (
                        <span className="badge rounded-pill bg-success text-white py-1 px-2">
                          {data.status}
                        </span>
                      )}
                    {data.status === "Canceled" && (
                      <span className="badge rounded-pill bg-danger text-white py-1 px-2">
                        {data.status}
                      </span>
                    )}
                    {data.status === "Scheduled" && showBooking === "Past" && (
                      <span className="badge rounded-pill bg-primary text-white py-1 px-2">
                        completed
                      </span>
                    )}
                    {new Date(data.currentTime) < currentDate &&
                      showBooking === "All" &&
                      data.status === "Scheduled" && (
                        <span className="badge rounded-pill bg-primary text-white py-1 px-2">
                          completed
                        </span>
                      )}
                    {new Date(data.currentTime) > currentDate &&
                      showBooking === "All" &&
                      data.status === "Scheduled" && (
                        <span className="badge rounded-pill bg-success text-white py-1 px-2">
                          Secheduled
                        </span>
                      )}
                  </td>

                  {/* <td className={userData?.data.planStatus === "expired" ? "first-card-expired py-4 border-0" : " py-4 border-0"}> */}
                  <td className="py-4 border-0">
                    {data.status === "Scheduled"
                      ? showBooking !== "Past" && (
                          <button
                            id={data._id}
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={handleCancel}
                            disabled={userData?.data.planStatus === "expired"}
                          >
                            Cancel
                          </button>
                        )
                      : null}
                  </td>
                  <td className="py-4 border-0">
                    {data.status === "Scheduled" ? (
                      <Link
                        to={`/Reschedule/${data.userId}/${data.bookingsTypeId}/${data._id}`}
                      >
                        <button
                          disabled={userData?.data.planStatus === "expired"}
                          className="btn btn-sm btn-outline-danger border-0"
                        >
                          Reschedule
                        </button>
                      </Link>
                    ) : null}
                  </td>
                  <td className="py-4">
                    <DetailsModal
                      id={data._id}
                      name={data.with}
                      duration={data.duration}
                      status={data.status}
                      time={data.time}
                      email={data.addAttendees.map((data) => data.email)}
                      currentTime={data.currentTime}
                      created={data.createdAt}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {loading && (
            <div className="d-flex justify-content-center ">
              <Spinner animation="border" role="status"></Spinner>
            </div>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
}

export default Bookings;
