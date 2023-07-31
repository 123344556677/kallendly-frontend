import React, { useState } from "react";
import { Calendar4, Clock, XLg } from "react-bootstrap-icons";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import "../Bookings/Bookings.css";

function DetailsModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
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
              <small>{props.duration} Minutes</small>
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
                <li className="d-list pb-2  " href="mailto:">
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
