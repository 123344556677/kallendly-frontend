import React from "react";
import { useState, useEffect } from "react";
import { Form, Row, Col, Container, Button, Card } from "react-bootstrap";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { url as urls } from "../../env.js";

import "./NewBooking.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const NewBooking = () => {
  const history = useHistory();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [addWindow, setaddWindow] = useState();

  const [title, setTitle] = useState(null);
  const [url, setUrl] = useState(null);
  const [duration, setDuration] = useState("15");
  const [userData, setUserData] = useState();
  const [padding, setPadding] = useState("10");
  const [daysAhead, setDaysAhead] = useState("1");
  const [durationMinutes, setDurationMinutes] = useState("1");
  const [hours, setHours] = useState("Minutes");
  const [location, setLocation] = useState(null);
  const [booking, setBooking] = useState(null);
  const [privateBooking, setPrivateBooking] = useState(false);
  const [time, setTime] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.post(`${urls}/api/getUserProfile`, {
          userId: USER_ID,
        });
        if (!response) {
          throw new Error("No response found");
        }
        if (response.data.length === 0) {
          throw new Error("No Bookings Found");
        }
        setUserData(response);
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

  const [days, setDays] = useState([
    {
      id: "1",
      day: "Sunday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: false,
    },
    {
      id: "2",
      day: "Monday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: true,
    },
    {
      id: "3",
      day: "Tuesday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: true,
    },
    {
      id: "4",
      day: "Wednesday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: true,
    },
    {
      id: "5",
      day: "Thursday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: true,
    },
    {
      id: "6",
      day: "Friday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: true,
    },
    {
      id: "7",
      day: "Saturday",
      availableSlots: [
        {
          start: "08:00",
          end: "17:00",
        },
      ],
      enable: false,
    },
  ]);

  const convertEditorState = convertToRaw(editorState.getCurrentContent());
  const description = convertEditorState.blocks[0].text;

  const [addquestion, setAddquestion] = useState([
    {
      question: null,
      answer: null,
      required: false,
    },
  ]);

  const USER_ID = localStorage.getItem("userId");

  const newDayHandler = (event) => {
    let newDays = [];
    days.map((data) => {
      if (data.id === event.target.id) {
        let obj = {
          id: data.id,
          day: data.day,
          availableSlots: [
            {
              start: "08:00",
              end: "05:00",
            },
          ],
          enable: !data.enable,
        };
        newDays.push(obj);
      } else {
        newDays.push(data);
      }
    });
    setDays(newDays);
  };

  const handleQuestion = (event) => {
    event.preventDefault();
    setAddquestion([...addquestion, { ques: "" }]);
  };

  const addQuestionHandler = (event) => {
    let newQuestion = [];
    addquestion.map((data) => {
      if (event.target.name === "question") {
        let obj = {
          question: event.target.value,
          answer: event.target.value,
        };
        newQuestion.push(obj);
      } else if (event.target.name === "answer") {
        let obj = {
          question: event.target.value,
          answer: event.target.value,
        };
        newQuestion.push(obj);
      } else {
        newQuestion.push(data);
      }
    });
    setAddquestion(newQuestion);
  };

  const handleQuestionRemove = (cardindex, e) => {
    e.preventDefault();
    const list = [...addquestion];
    list.splice(cardindex, 1);
    setAddquestion(list);
  };

  const handleWindow = (dayNo, e) => {
    e.preventDefault();
    const filteredDay = days.map((day) => {
      if (dayNo == day.day) {
        return { ...day, ...day.availableSlots.push({ start: "", end: "" }) };
      }
      return day;
    });
    setDays(filteredDay);
  };

  const handleWindowRemove = (e, dayNo) => {
    e.preventDefault();
    const filteredDay = days.filter((day) => {
      if (dayNo == day.day) {
        return { ...day, ...day.availableSlots.pop({ start: "", end: "" }) };
      }
      return day;
    });
    setDays(filteredDay);
  };

  const setStartTime = (e, dayIndex, slotIndex) => {
    let _day = days;
    _day[dayIndex].availableSlots[slotIndex].start = e.target.value;
    setDays(_day);
  };

  const setEndTime = (e, dayIndex, slotIndex) => {
    let _day = days;
    _day[dayIndex].availableSlots[slotIndex].end = e.target.value;
    _day = _day;
    setDays(_day);
  };

  const handleCreateBookings = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${urls}/api/addBookingsTypes`, {
        userId: USER_ID,
        title: title,
        url: url,
        description: description,
        duration: duration,
        location: location,
        padding: padding,
        days_ahead: daysAhead,
        booking: booking,
        currentTime: durationMinutes + " " + hours,
        available: days.map((data) => ({
          id: data.id,
          day: data.day,
          availableSlots: data.availableSlots.map((available) => ({
            start: available.start,
            end: available.end,
          })),
          enable: data.enable,
        })),
        question: addquestion.map((data) => ({
          question: data.question,
          answer: data.answer,
          required: data.required,
        })),
        enableBookings: true,
        charge: null,
        private: privateBooking,
        days: null,
      });
      if (response.data.message === "meeting is expired") {
        Swal.fire({
          position: "center",
          icon: "error",
          color: "black",
          text: "Buy our primium services to create more booking types",
          showConfirmButton: false,
          timer: 1500,
        });

        history.push("/pricing");
      } else {
        Swal.fire({
          position: "center",
          icon: "success",
          text: "Booking Created",
          color: "black",
          showConfirmButton: false,
          timer: 1600,
        });
        history.push("/");
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Network error",
        color: "black",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={9}>
          <h3 className="booking  mt-5">Create new booking type</h3>
          <Form className="mt-5" onSubmit={handleCreateBookings}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-weight-bold">Title:</Form.Label>
              <Form.Control
                type="text"
                className="mt-2"
                required
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="font-weight-bold mt-3">URL:</Form.Label>
              <InputGroup className="mb-3 mt-2">
                <InputGroup.Text id="inputGroup-sizing-default">
                  https://kallendly.com
                </InputGroup.Text>
                <Form.Control
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  onChange={(event) => setUrl(event.target.value)}
                />
              </InputGroup>
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label className="font-weight-bold mt-3">
                Description:
              </Form.Label>
              <div
                className="mt-2"
                style={{
                  border: "1px solid black",
                  padding: "2px",
                  minHeight: "200px",
                }}
              >
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                />
              </div>
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label className="font-weight-bold">
                Group Bookings:
              </Form.Label>
              <p className="mt-2">
                Up to
                <input
                  type="text"
                  value="1"
                  className="group-input mr-2 ml-2"
                  disabled
                />
                person per time slot is allowed
              </p>
            </Form.Group> */}
            <Form.Label className="font-weight-bold">Bookings:</Form.Label>
            <br />
            <div className="mt-3">
              <input
                className="one-to-one"
                type="radio"
                value="one to one booking"
                name="booking"
                checked="checked"
                onChange={(event) => setBooking(event.target.value)}
              />{" "}
              One to one booking
              <input
                className={
                  userData?.data.data.planStatus === "continued"
                    ? "ml-4"
                    : "unlimited ml-4"
                }
                type="radio"
                value="unlimited bookings"
                name="booking"
                onChange={(event) => setBooking(event.target.value)}
              />{" "}
              <span
                className={
                  userData?.data.data.planStatus === "expired" && "unlimited"
                }
              >
                {" "}
                Unlimited bookings
              </span>
            </div>

            {/* <Alert variant="primary" className="alert mt-4">
              <p>
                <span className="arrow-pointer mr-2">👉</span>
                Upgrade to enable group bookings,
                <b>$29 lifetime access.</b>
              </p>
            </Alert> */}
            {/* <hr className="mt-5" />
            <Form.Label className="font-weight-bold">Location:</Form.Label>
            <br />
            <div className="mt-3">
              <input
                className=""
                type="radio"
                value="Online video conference"
                name="gender"
                onChange={(event) => setLocation(event.target.value)}
              />{" "}
              Online video conference
              <input
                className="ml-2"
                type="radio"
                value="Physical address"
                name="gender"
                onChange={(event) => setLocation(event.target.value)}
              />{" "}
              Physical adress
              <input
                className="ml-2"
                type="radio"
                value="No location"
                name="gender"
                onChange={(event) => setLocation(event.target.value)}
              />{" "}
              No location
            </div> */}
            <hr className="mt-5" />
            <Row className="mt-4">
              <Col md={6}>
                <Form.Label className="font-weight-bold mt-4">
                  Duration:
                </Form.Label>
                <br />
                <input
                  type="number"
                  id="duration_minutes"
                  name="duration_minutes"
                  className="form-control d-inline me-2 mt-2 range-selector"
                  min="15"
                  defaultValue={15}
                  onChange={(event) => setDuration(event.target.value)}
                />
                <span className="range-fonts ml-2">minutes</span>
              </Col>
              <Col md={6}>
                <Form.Label className="font-weight-bold mt-4">
                  Minimum meeting padding:
                </Form.Label>
                <br />
                <input
                  type="number"
                  id="duration_minutes"
                  name="duration_minutes"
                  className="form-control d-inline me-2 range-selector mt-2"
                  min="10"
                  defaultValue={10}
                  onChange={(event) => setPadding(event.target.value)}
                />
                <span className="range-fonts ml-2">minutes</span>
              </Col>
            </Row>
            <hr className="mt-4" />
            {/* <Row className="mt-4">
              <Col md={6}>
                <Form.Label className="font-weight-bold mt-4">
                  How far out can user book?
                </Form.Label>
                <br />
                <input
                  type="number"
                  id="days_ahead"
                  name="days_ahead"
                  className="form-control d-inline me-2 mt-2 range-selector"
                  min="1"
                  defaultValue={1}
                  onChange={(event) => setDaysAhead(event.target.value)}
                />
                <span className="range-fonts ml-2">days ahead</span>
              </Col>
              <Col md={6}>
                <Form.Label className="font-weight-bold mt-4">
                  Bookers can't schedule within:
                </Form.Label>
                <br />
                <InputGroup>
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    className="form-control d-inline me-2 range-selector mt-2"
                    min="1"
                    defaultValue={1}
                    onChange={(event) => setDurationMinutes(event.target.value)}
                  />
                  <select
                    className="form-control range-selector mt-2"
                    onChange={(event) => setHours(event.target.value)}
                  >
                    <option value="Minutes">minutes</option>
                    <option value="Hours">Hours</option>
                  </select>
                  <span className="range-fonts ml-2 mt-3">of current time</span>
                </InputGroup>
              </Col>
            </Row> */}
            {/* <hr className="mt-5" /> */}
            <Form.Label className="font-weight-bold mt-2">
              When are you available for this booking?
            </Form.Label>
            <Card className="booking-card mt-3">
              <Card.Body className="py-0">
                {days.length > 0 &&
                  days.map((day, daysIndex) => (
                    <>
                      {day.availableSlots.map((singleWindow, slotsIndex) => (
                        // <div key={slotsIndex}>
                        <>
                          <Row
                            className={
                              day.enable === true ? "mt-4" : "mt-4 unlimited"
                            }
                            key={slotsIndex}
                          >
                            <Col md={3} className="my-auto">
                              <Form.Check
                                label={day.day}
                                type="checkbox"
                                id={days[daysIndex].id}
                                onChange={(event) =>
                                  newDayHandler(event, daysIndex)
                                }
                                checked={day.enable}
                              />
                            </Col>
                            {day.enable === true ? (
                              <>
                                <Col md={5}>
                                  <div style={{ display: "flex" }}>
                                    <div className="input-group">
                                      <input
                                        type="time"
                                        className="form-control timing-input px-4"
                                        defaultValue="08:00"
                                        required
                                        onChange={(e) =>
                                          setStartTime(e, daysIndex, slotsIndex)
                                        }
                                      />
                                    </div>
                                    <span
                                      className="mr-1 ml-1 mt-2"
                                      style={{
                                        color: "108,117,125",
                                        fontSize: ".875em",
                                      }}
                                    >
                                      -
                                    </span>
                                    <div className="input-group">
                                      <input
                                        type="time"
                                        className="form-control timing-input px-4"
                                        defaultValue="17:00"
                                        required
                                        onChange={(e) =>
                                          setEndTime(e, daysIndex, slotsIndex)
                                        }
                                      />
                                    </div>
                                  </div>
                                </Col>
                                <Col lg={4}>
                                  {slotsIndex > 0 && (
                                    <a
                                      className="remove-window-link cursor-pointer"
                                      onClick={(e) =>
                                        handleWindowRemove(e, day.day)
                                      }
                                    >
                                      Remove
                                    </a>
                                  )}
                                  {slotsIndex == 0 && (
                                    <a
                                      className="add-window mt-2 cursor-pointer"
                                      onClick={(e) => handleWindow(day.day, e)}
                                    >
                                      + Add window
                                    </a>
                                  )}
                                </Col>{" "}
                              </>
                            ) : (
                              <>
                                {" "}
                                <Col lg={5} className="py-2">
                                  <p className="unavailable font-weight-bold">
                                    Unavailable
                                  </p>
                                </Col>
                              </>
                            )}
                          </Row>
                        </>
                        // </div>
                      ))}
                      <hr className="mt-4 mb-0 pb-0" />
                    </>
                  ))}
              </Card.Body>
            </Card>
            <Form.Label className="font-weight-bold mt-4 mb-3">
              Ask one or more questions to the person scheduling this booking
              (optional):
            </Form.Label>
            <br />
            {addquestion.map((question, cardIndex) => (
              <Card key={cardIndex} className="mt-2">
                <Card.Body>
                  <Form.Group>
                    <Form.Label className="font-weight-bold">
                      Question{cardIndex + 1}:
                    </Form.Label>
                    <Row>
                      <Col md={6}>
                        <Form.Control
                          name="question"
                          placeholder="Write your question here..."
                          className="mt-2"
                          onChange={(e) =>
                            addQuestionHandler(e, question, cardIndex)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          label="required"
                          name="group1"
                          type="checkbox"
                          className="mt-3"
                        />
                      </Col>
                      <Col md={3}>
                        <a
                          className="remove-link mt-3 cursor-pointer"
                          onClick={(e) => handleQuestionRemove(cardIndex, e)}
                        >
                          Delete
                        </a>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <Form.Label>Answer type:</Form.Label>
                    <Form.Control
                      name="answer"
                      placeholder="Text"
                      className="mt-2"
                      onChange={(e) =>
                        addQuestionHandler(e, question, cardIndex)
                      }
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            ))}

            <a
              className="add-question mt-2 cursor-pointer"
              onClick={(e) => handleQuestion(e)}
            >
              + Add new question{" "}
            </a>
            <hr className="mt-4 mb-0 pb-0" />

            <div className="sticky-bottom">
              <Row className="justify-content-center">
                <Link to="/">
                  <Button variant="outline-primary" className="ml-2 cancel ">
                    Cancel
                  </Button>
                </Link>

                <Button className="ml-3 create" type="submit">
                  Create Booking Type
                </Button>
              </Row>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewBooking;
