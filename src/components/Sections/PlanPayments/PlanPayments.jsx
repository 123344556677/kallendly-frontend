import React from "react";
import "./PlanPayments.css";
import CardsPayment from "./CardsPayment";
import { Container, Row, Col } from "react-bootstrap";

function PlanPayments() {
  return (
    <>
      <Container>
        <Row className="justify-content-center mt-5 m-0 px-5 mb-5">
          <Col md={8}>
            <CardsPayment />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PlanPayments;
