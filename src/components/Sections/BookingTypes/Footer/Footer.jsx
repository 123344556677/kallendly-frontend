import React from "react";
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

// styling
import "./Footer.css";

const Footer = () => {
  return (
    <div
      className="footer-shahow"
      style={{
        bottom: 0,
        position: "relative",
      }}
    >
      <Container>
        <Row className="d-flex justify-content-center ">
          <div className="footer-div">
            <p className="second-text my-2">
              <strong>Email: </strong>
              <a
                href="mailto:connect@kallendly.com"
                style={{ cursor: "pointer" }}
              >
                connect@kallendly.com
              </a>
            </p>
            <p className="second-text">
              <strong>Address: </strong>2nd floor, Sumitra Co. Hos., Shankar Rao
              Joshi, PNG Showroom,Erandawane Pune, India - 411004
            </p>
            <p className="thired-text mt-2">
              &copy; 2022 Kallendly | All rights reserved.{" "}
              <Link to="/privacy-policy" target="_blank">
                Privacy Policy.
              </Link>
              <Link to="/terms-condition" target="_blank">
                {" "}
                Terms & Conditions.
              </Link>
              <Link to="/refund-policy" target="_blank">
                {" "}
                Refund Policy.
              </Link>
            </p>
            <p className="thired-text mt-2">Project of Landmark Techedge.</p>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
