import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Spinner } from "react-bootstrap";
import { Calendar4, Clock, Globe2, XLg } from "react-bootstrap-icons";
import "./Bookings.css";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { url } from "../env.js";
import Swal from "sweetalert2";

function RescheduleModal(props) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [time, setTime] = useState();
  const [lgShow, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const [addAttendees, setAddAttendees] = useState([{ name, email }]);
  const userName = props.userName;
  const { userId, id } = useParams();
  let planType = localStorage.getItem("planType");

  let loggedIn = localStorage.getItem("_a");

  const handleAddAttendees = (event) => {
    event.preventDefault();
    setAddAttendees([...addAttendees, { name, email }]);
  };

  const handleRemoveAttendees = () => {
    addAttendees.pop();
    setAddAttendees([...addAttendees]);
  };

  const addAttendeesHandler = (event, index) => {
    let tmp = addAttendees;
    if (event.target.name === "name") {
      tmp[index][event.target.name] = event.target.value;
    }
    if (event.target.name === "email") {
      tmp[index][event.target.name] = event.target.value;
    }
    setAddAttendees(tmp);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setShow(false);
  };

  const handleShow = async (event) => {
    setTime(event.target.innerHTML);
    setShow(true);
  };

  const bookEventHandler = async (event) => {
    setLoader(true);
    event.preventDefault();

    try {
      let response = await axios.post(`${url}/api/addBookings`, {
        userId: userId,
        bookingsTypeId: id,
        addAttendees: addAttendees.map((data) => ({
          name: data.name,
          email: data.email,
        })),
        duration: props.duration,
        location: props.selectCountry,
        days_ahead: props.daysAhead,
        currentTime:
          props.selectedDay.month +
          "-" +
          props.selectedDay.day +
          "-" +
          props.selectedDay.year,
        with: userName,
        status: "Scheduled",
        time: time,
      });

      if (!response) {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "Network error",
          color: "black",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
      } else if (response.status == 200) {
        setLoader(false);
        Swal.fire({
          position: "center",
          icon: "success",
          text: "A meeting invitation has been sent to your email",
          color: "black",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
        if (loggedIn == "true") {
          history.push("/Bookings");
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Your booking is successfully created",
            color: "black",
            showConfirmButton: false,
            timer: 2500,
          });
        }
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
    setShow(false);
  };

  return (
    <React.Fragment>
      {!props.showTime ? (
        <>
          {props.TIME.map((data, index) => (
            <button
              key={index}
              onClick={handleShow}
              className="btn btn-outline-dark w-100 fade-down justify-content-center my-1"
            >
              {data}
            </button>
          ))}
        </>
      ) : (
        <p>No slots available</p>
      )}
      <Modal size="lg" show={lgShow} onHide={handleClose}>
        <div className="px-3 py-2">
          <div className="modal-header pl-4">
            <h2 className="modal-title h4 text-dark">Confirm booking:</h2>
            <button
              type="button"
              className="bg-white border-0"
              onClick={handleClose}
            >
              <XLg />
            </button>
          </div>
          <Modal.Body className="px-4">
            <h5 className="mb-4 pt-2 font-styling">
              {props.duration} minutes Meeting
              <i className="text-secondary font-weight-light"> with</i>{" "}
              {props.userName}
            </h5>
            <div className="d-flex align-items-center mb-2">
              <Calendar4 className="mr-2" />
              <small>
                {moment(props.currentTime).format("dddd MMMM D, YYYY")} , at{" "}
                {time}
              </small>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Globe2 className="mr-2" />
              <small>{props.selectCountry}</small>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Clock className="mr-2" />

              <small>{props.duration} minutes</small>
            </div>
            <div className="d-block w-100 py-2"></div>
          </Modal.Body>
          <form onSubmit={bookEventHandler}>
            {addAttendees.map((data, index) => (
              <Modal.Footer
                key={index}
                className="justify-content-center px-4 modal-responsive"
              >
                <div className="col p-0">
                  <input
                    name="name"
                    type="text"
                    id="name"
                    placeholder="Name"
                    className="form-control bg-white"
                    required
                    value={name}
                    onChange={(event) => addAttendeesHandler(event, index)}
                  />
                </div>

                <div className="col p-0 ">
                  <input
                    name="email"
                    type="email"
                    id="email"
                    placeholder="email"
                    required
                    className="form-control bg-white"
                    value={email}
                    onChange={(event) => addAttendeesHandler(event, index)}
                  />
                </div>
              </Modal.Footer>
            ))}
            {planType === "1 year" && (
              <div className="row">
                <div className="col-6">
                  <div
                    className="text-right px-4"
                    style={{ cursor: "pointer" }}
                    onClick={handleAddAttendees}
                  >
                    +Add attendees
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="text-left px-4"
                    style={{ cursor: "pointer" }}
                    onClick={handleRemoveAttendees}
                  >
                    -Remove
                  </div>
                </div>
              </div>
            )}
            {planType === "1 month" && (
              <div className="row">
                <div className="col-6">
                  {addAttendees.length < 6 && (
                    <div
                      className="text-right px-4"
                      style={{ cursor: "pointer" }}
                      onClick={handleAddAttendees}
                    >
                      +Add attendees
                    </div>
                  )}
                </div>
                <div className="col-6">
                  <div
                    className="text-left px-4"
                    style={{ cursor: "pointer" }}
                    onClick={handleRemoveAttendees}
                  >
                    -Remove
                  </div>
                </div>
              </div>
            )}

            {/* {(planType === "none" ) && } */}
            <Modal.Footer className="justify-content-center border-0">
              <button
                className="btn btn btn-outline-danger text-nowrap"
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-dark reschedual-button"
                variant="primary"
              >
                {loader ? (
                  <div className="d-flex mx-4 postion-absolute justify-content-center ">
                    <Spinner animation="border" role="status"></Spinner>
                  </div>
                ) : (
                  "Book Event"
                )}
              </button>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default RescheduleModal;
