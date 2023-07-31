import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import DetailsModal from "./DetailsModal";
import { url } from "../env";
import "./adminStyle.css";

function BookingsAdmin() {
  const [Bookings, setBookings] = useState();

  const fetchAllBookings = async () => {
    try {
      let response = await axios.get(`${url}/api/getBookings`);
      if (!response) {
        throw new Error("could not find response");
      } else {
        setBookings(response.data.data);
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.message,
        color: "black",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <div style={{ width: "auto" }}>
      <Container>
        <Row className="justify-content-between py-5">
          <Col sm className="px-5">
            <h3 className="font-weight-bold px-5">Bookings</h3>
          </Col>
          <Col sm className="text-right">
            {/* <span>View:</span>
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
              </select> */}
          </Col>
        </Row>
      </Container>
      <Container className="w-auto">
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
                  <span className="text-decoration-none link-color align-middle">
                    {data.duration} minutes meeting
                  </span>
                </td>
                <td className="py-4 border-0 small">
                  <a href="/#" className="text-decoration-none link-color">
                    {data.with}
                  </a>
                </td>
                <td className="py-4 border-0 text-center">
                  {data.status === "Scheduled" && (
                    <span className="badge rounded-pill bg-success text-white py-1 px-2">
                      {data.status}
                    </span>
                  )}
                  {data.status === "Canceled" && (
                    <span className="badge rounded-pill bg-danger text-white py-1 px-2">
                      {data.status}
                    </span>
                  )}
                  {data.status === "Past" && (
                    <span className="badge rounded-pill bg-secondary text-white py-1 px-2">
                      {data.status}
                    </span>
                  )}
                </td>
                <td className="py-4 small text-nowrap border-0">
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
      </Container>
    </div>
  );
}

export default BookingsAdmin;
