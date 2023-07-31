import React from "react";
import { useState, useEffect } from "react";
import { Form, Row, Col, Container, Button, Card } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../NewBooking/NewBooking.css";
import Swal from "sweetalert2";
import { url as urls } from "../../env.js";

const EditPage = () => {
  const history = useHistory();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [BookingData, setBookingData] = useState();
  const [title, setTitle] = useState(BookingData?.data.data.title);
  const [url, setUrl] = useState(BookingData?.data.data.url);
  const [duration, setDuration] = useState("15");
  const [padding, setPadding] = useState("10");
  const [daysAhead, setDaysAhead] = useState("1");
  const [durationMinutes, setDurationMinutes] = useState("1");
  const [hours, setHours] = useState(null);
  const [userData, setUserData] = useState();
  const [location, setLocation] = useState(null);
  const [privateBooking, setPrivateBooking] = useState(false);

  const USER_ID = localStorage.getItem("userId");
  const [booking, setBooking] = useState(null);

  const [days, setDays] = useState([]);

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

  const convertEditorState = convertToRaw(editorState.getCurrentContent());
  const description = convertEditorState.blocks[0].text;

  const [addquestion, setAddquestion] = useState([
    {
      question: null,
      answer: null,
      required: false,
    },
  ]);

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
  const booking_id = useParams();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = booking_id;
        let response = await axios.get(
          `${urls}/api/getBookingsTypesById/${id}`
        );
        if (!response) {
          throw new Error("No response found");
        }
        if (response.data.length === 0) {
          throw new Error("No Bookings Found");
        }
        setBookingData(response);
        setDays(response?.data.data.available);
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

  const handleUpdateBookings = async (event) => {
    event.preventDefault();

    try {
      const { id } = booking_id;
      const response = await axios.put(
        `${urls}/api/updateBookingsTypes/${id}`,
        {
          title: title,
          url: url,
          description: description,
          duration: duration,
          location: location,
          padding: padding,
          booking: booking,
          days_ahead: daysAhead,
          currentTime: durationMinutes + hours,
          available: days.map((data) => ({
            day: data.day,
            availableSlots: data.availableSlots.map((available) => ({
              start: available.start,
              end: available.end,
            })),
          })),
          question: addquestion.map((data) => ({
            question: data.question,
            answer: data.answer,
            required: data.required,
          })),
          charge: null,
          private: privateBooking,
          days: null,
        }
      );
      if (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          text: "Booking Upated",
          color: "black",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
        history.push("/");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "Booking Upatation Failed",
          color: "black",
          showConfirmButton: false,
          timer: 1600,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "success",
        color: "black",
        text: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={9}>
          <h3 className="booking mt-5">Update booking type</h3>
          <Form className="mt-5">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-weight-bold">Title:</Form.Label>
              {BookingData && (
                <Form.Control
                  type="text"
                  className="mt-2"
                  placeholder={BookingData.data.data.title}
                  // value={BookingData.data.data.title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              )}
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="font-weight-bold mt-3">URL:</Form.Label>
              <InputGroup className="mb-3 mt-2">
                <InputGroup.Text id="inputGroup-sizing-default">
                  https://kallendly.com
                </InputGroup.Text>
                {BookingData && (
                  <Form.Control
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder={BookingData.data.data.url}
                    // value={BookingData.data.data.url}
                  />
                )}
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
                {BookingData && (
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    placeholder={BookingData.data.data.description}
                    value={BookingData.data.data.description}
                  />
                )}
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
                name="gender"
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
                name="gender"
                checked={
                  BookingData?.data.data.booking === "unlimited bookings" &&
                  "checked"
                }
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
            {/* <Alert variant="primary" className="alert mt-3">
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
                value="Physical adress"
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
                {BookingData && (
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    className="form-control d-inline me-2 mt-2 range-selector"
                    min="15"
                    placeholder={BookingData.data.data.duration}
                    value={BookingData.data.data.duration}
                    onChange={(event) => setDuration(event.target.value)}
                  />
                )}
                <span className="range-fonts ml-2">minutes</span>
              </Col>
              <Col md={6}>
                <Form.Label className="font-weight-bold mt-4">
                  Minimum meeting padding:
                </Form.Label>
                <br />
                {BookingData && (
                  <input
                    type="number"
                    id="duration_minutes"
                    name="duration_minutes"
                    className="form-control d-inline me-2 range-selector mt-2"
                    placeholder={BookingData.data.data.padding}
                    value={BookingData.data.data.padding}
                    min="10"
                    onChange={(event) => setPadding(event.target.value)}
                  />
                )}
                <span className="range-fonts ml-2">minutes</span>
              </Col>
            </Row>
            <hr className="mt-5" />

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
                              <Col lg={5} className="py-2">
                                <p className="unavailable font-weight-bold">
                                  Unavailable
                                </p>
                              </Col>
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
            {BookingData &&
              BookingData.data.data.question.map((quesData) => (
                <>
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
                                placeholder={quesData.question}
                                value={quesData.question}
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
                                onClick={(e) =>
                                  handleQuestionRemove(cardIndex, e)
                                }
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
                            placeholder={quesData.answer}
                            value={quesData.answer}
                            className="mt-2"
                            onChange={(e) =>
                              addQuestionHandler(e, question, cardIndex)
                            }
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  ))}
                </>
              ))}

            <a
              href=""
              className="add-question mt-2"
              onClick={(e) => handleQuestion(e)}
            >
              + Add new question{" "}
            </a>
            {/* <hr className="mt-4" />
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-weight-bold mt-2 confirm-url">
                Confirmation redirect URL (optional):
              </Form.Label>
              <Form.Control
                type="email"
                className="mt-2 confirm-url-input"
                disabled
              />
            </Form.Group>
            <Alert variant="primary" className="alert">
              <p>
                <span className="arrow-pointer mr-2">👉</span>
                Upgrade to enable custom redirect URL,
                <b>$29 lifetime access.</b>
              </p>
            </Alert>
            <div className="mt-5 booking-div">
              <Form.Check
                inline
                label="Charge for this booking"
                name="group1"
                type="checkbox"
                id={`inline-radio-2`}
                className="font-weight-bold booking-charge"
              />
              <Alert variant="primary" className="alert mt-2">
                <p>
                  <span className="arrow-pointer mr-2">👉</span>
                  Upgrade to enable paid bookings
                </p>
              </Alert>
            </div>
            <Form.Check
              label="Private"
              name="group1"
              type="checkbox"
              id={`inline-radio-2`}
              checked={BookingData?.data.data.private==="true"&&"checked"}
              className="font-weight-bold"
              onChange={() => setPrivateBooking(!privateBooking)}
            />
            <Form.Text style={{ color: "#6c757d", fontSize: ".875em" }}>
              Will not be shown on your booking page
            </Form.Text> */}
            {/* <hr className="mt-4" /> */}
            <div className="sticky-bottom">
              <Row className="justify-content-center">
                <Link to="/">
                  <Button variant="outline-primary" className="ml-2 cancel ">
                    Cancel
                  </Button>
                </Link>
                <Button className="ml-3 create" onClick={handleUpdateBookings}>
                  Update Booking Type
                </Button>
              </Row>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditPage;
