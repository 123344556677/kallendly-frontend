import React, { useState, useEffect } from "react";
import { Calendar4, Clock, XLg } from "react-bootstrap-icons";
import moment from "moment";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { url } from "../env.js";
import "./Bookings.css";
import Swal from "sweetalert2";

function DetailsModal(props) {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState();
  const USER_ID = localStorage.getItem("userId");

  const handleClose = () => {
    setShow(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(`${url}/api/getUsersById/${USER_ID}`);
        if (!response) {
          throw new Error("No response found");
        } else {
          setUserData(response.data);
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
    fetchData();
  }, []);

  const handleCancel = async () => {
    try {
      let response = await axios.put(
        `${url}/api/updateBookingsStatus/${props.id}`,
        {
          status: "Canceled",
        }
      );
      if (!response) {
        throw new Error("Could not cancel booking");
      } else {
        await axios
          .post(`${url}/api/deleteSingleEvent`, {
            eventId: props.eventId,
          })
          .then((res) => {
          })
          .catch((err) => {
          });
        setShow(false);
        window.location.reload();
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
  };
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      <button
        className="btn btn-sm btn-outline-primary text-nowrap border-0"
        onClick={handleShow}
      >
        Details
      </button>

      <Modal show={show} onHide={handleClose}>
        <div className="modal-header px-4">
          <h2 className="modal-title h4 text-dark">Booking Details</h2>
          <button
            type="button"
            className="bg-white border-0"
            onClick={handleClose}
          >
            <XLg />
          </button>
        </div>
        <Modal.Body className="px-4">
          <h5
            className="mb-4 pt-2 font-weight-bold"
            style={{
              fontFamily: "sans-serif",
            }}
          >
            {props.duration} minutes Meeting
          </h5>
          <div className="d-flex align-items-center mb-2">
            <Calendar4 className="mr-2" />
            <div>
              <small>
                {moment(props.currentTime, "MM Do yyyy").format("MMMM Do yyyy")}{" "}
                at {props.time}
              </small>
            </div>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Clock className="mr-2" />
            <div>
              <small>{props.duration} minutes</small>
            </div>
          </div>
          <div className="d-block w-100 py-2"></div>
          <div className="mb-2">
            <small>
              <strong>With: </strong>
              {props.name}
            </small>
          </div>
          <div className="mb-2">
            {props.email.map((data, index) => (
              <small key={index}>
                <li className="d-list pb-2" href="mailto:">
                  <strong className="text-dark">Email: </strong>
                  <span className="link-color">{data}</span>
                </li>
              </small>
            ))}
          </div>
          <div className="mb-2">
            <small>
              <strong>Created: </strong>
              {moment(props.created).format("MMMM D, YYYY hh:mm a")}
            </small>
          </div>
          <div className="d-block w-100 mb-1 py-3"></div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between px-4">
          {props.status === "Scheduled" && (
            <button
              type="submit"
              className="btn btn btn-outline-danger text-nowrap"
              variant="secondary"
              disabled={userData?.data.planStatus === "expired"}
              onClick={handleCancel}
            >
              Cancel Event
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary align-self-end ml-auto"
            variant="primary"
            onClick={handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default DetailsModal;
