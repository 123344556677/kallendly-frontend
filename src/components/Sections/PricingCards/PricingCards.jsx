import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import "./PricingCards.css";
const PricingCards = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const month = "1 month";
  const year = "1 year";
  let plan;

  const userChecking = localStorage.getItem("_a");
  const payments = (type) => {
    if (type === "month") {
      plan = month;
    } else if (type === "year") {
      plan = year;
    } else {
      plan = "free";
    }
    if (userChecking === "true") {
      history.push(`/planPayments/${plan}`);
    } else {
      history.push("/SignUp");
    }
  };

  return (
    <>
      <Container>
        <h3 style={{ fontWeight: "700" }} className="mt-5 text-center">
          Our subscription plan
        </h3>
        <p
          style={{ fontWeight: "700", color: "rgba(108, 117, 125)" }}
          className=" text-center mt-4"
        >
          We have One year and One month subscription plans.Click on the given
          button to check them out
        </p>
        <p
          style={{ fontWeight: "700", color: "rgba(108, 117, 125)" }}
          className=" text-center mt-2"
        >
          For indian users payment will be converted to their local currency.
        </p>
        <h1 className="text-center">
          <Button
            className="ml-3 mr-3 mt-4 mb-3 view-button"
            onClick={() => setOpen(true)}
          >
            View Cards{" "}
          </Button>
        </h1>
        {open && (
          <Row className="justify-content-center">
            <Col md={4}>
              <Card className="first-card mt-5 ml-2">
                <h4 className="ml-3 mt-3" style={{ fontWeight: "700" }}>
                  7 days free trial
                </h4>
                <div className="mt-3" style={{ display: "flex" }}>
                  <h4 className="ml-3 price">$ 0</h4>

                  <br />
                </div>

                <span
                  className="ml-3 mt-3"
                  style={{ color: "rgba(108, 117, 125)" }}
                >
                  Basic features for 1 users
                </span>

                <hr className="mt-3" />

                <h6 className="ml-3 mt-2" style={{ fontWeight: "700" }}>
                  FEATURES
                </h6>
                <span
                  className="ml-3 mt-3"
                  style={{ color: "rgba(108, 117, 125)" }}
                >
                  Everything in this plan plus....
                </span>
                <ListGroup className="">
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <ImCross className="cross ml-2 mr-2" />
                    <span className="features-text ">
                      You can embed meeting on your website
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      You can create unlimited meetings
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      You can add 1 attendees
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text ">
                      Access Kallendly with web applications
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      Create unlimited one-on-one events
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      Get meeting notifications via mail
                    </span>{" "}
                  </ListGroup.Item>
                </ListGroup>
                <hr className="mt-3" />
                <Button
                  variant=""
                  className="ml-3 mr-3 mt-2 mb-3 pricing-button"
                  onClick={() => {
                    payments("free");
                  }}
                >
                  Get Started For Free
                </Button>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="first-card mt-5 mr-2">
                <h4 className="ml-3 mt-3" style={{ fontWeight: "700" }}>
                  1 month plan
                </h4>
                <div className="mt-3" style={{ display: "flex" }}>
                  <h4 className="ml-3 price">$ 9</h4>
                  <span
                    className="mt-1 ml-1"
                    style={{ color: "rgba(108, 117, 125)" }}
                  >
                    {" "}
                    / month
                  </span>{" "}
                  <br />
                </div>

                <span
                  className="ml-3 mt-3"
                  style={{ color: "rgba(108, 117, 125)" }}
                >
                  Basic features for upto 6 users
                </span>

                <hr className="mt-3" />

                <h6 className="ml-3 mt-2" style={{ fontWeight: "700" }}>
                  FEATURES
                </h6>
                <span
                  className="ml-3 mt-3"
                  style={{ color: "rgba(108, 117, 125)" }}
                >
                  Everything in this plan plus....
                </span>
                <ListGroup className="">
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text">
                      You can embed meeting on your website{" "}
                      <span className="text-muted">(Coming Soon)</span>
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text ">
                      You can create unlimited meetings
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text ">
                      You can add 6 attendees
                    </span>{" "}
                  </ListGroup.Item>

                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text">
                      Access Kallendly with web applications{" "}
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text ">
                      Create unlimited one-on-one events
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0">
                    <TiTick className="tick" />
                    <span className="features-text">
                      Get meeting notifications via mail
                    </span>{" "}
                  </ListGroup.Item>
                </ListGroup>
                <hr className="mt-3" />
                <Button
                  className="ml-3 mr-3 mt-2 mb-3 pricing-button"
                  onClick={() => {
                    payments("month");
                  }}
                >
                  Get Started
                </Button>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="first-card mt-5 ml-2">
                <h4 className="ml-3 mt-3" style={{ fontWeight: "700" }}>
                  1 year plan
                </h4>
                <div className="mt-3" style={{ display: "flex" }}>
                  <h4 className="ml-3 price">$ 39</h4>
                  <span
                    className="mt-1 ml-1"
                    style={{ color: "rgba(108, 117, 125)" }}
                  >
                    {" "}
                    / year
                  </span>{" "}
                  <br />
                </div>

                <span
                  className="ml-3 mt-3"
                  style={{ color: "rgba(108, 117, 125)" }}
                >
                  Premium features for upto unlimited users
                </span>

                <hr className="mt-3" />

                <h6 className="ml-3 mt-2" style={{ fontWeight: "700" }}>
                  FEATURES
                </h6>
                <span
                  className="ml-3 mt-3"
                  style={{ color: "rgba(108, 117, 125)" }}
                >
                  Everything in this plan plus....
                </span>
                <ListGroup className="">
                  {/* <ListGroup.Item className="features ml-2 mt-2  p-0">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      You must activate your license within 1 year
                    </span>{" "}
                  </ListGroup.Item> */}
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick " />
                    <span className="features-text ">
                      You can embed meeting on your website{" "}
                      <span className="text-muted"> (Coming Soon)</span>
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      You can create unlimited meetings
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      You can add unlimited attendees
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick" />
                    <span className="features-text ">
                      Access Kallendly with web applications
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      Create unlimited one-on-one events
                    </span>{" "}
                  </ListGroup.Item>
                  <ListGroup.Item className="features ml-2 mt-2  p-0 ">
                    <TiTick className="tick  " />
                    <span className="features-text ">
                      Get meeting notifications via mail
                    </span>{" "}
                  </ListGroup.Item>
                </ListGroup>
                <hr className="mt-3" />
                <Button
                  variant=""
                  className="ml-3 mr-3 mt-1 mb-3 pricing-button"
                  onClick={() => {
                    payments("year");
                  }}
                >
                  Get Started
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default PricingCards;
