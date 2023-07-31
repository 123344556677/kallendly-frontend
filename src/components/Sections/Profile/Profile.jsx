import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosArrowUp } from "react-icons/io";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { EditorState, convertToRaw } from "draft-js";
import axios from "axios";
import FileBase64 from "react-file-base64";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Profile.css";
import Swal from "sweetalert2";
import { url } from "../env.js";
import { TimezoneSelect, clientTz } from "timezone-select-js";

function Profile() {
  const [userData, setUserData] = useState();
  const [name, setName] = useState(userData?.data.data.name);

  const [currPPic, setPPic] = useState();
  const [email, setemail] = useState(userData?.data.data.email);
  const [pageLink, setPageLink] = useState(userData?.data.data.PageLink);
  const [timeFormate, settimeFormate] = useState(
    userData?.data.data.TimeFormate
  );

  const [availabilityInterval, setavailabilityInterval] = useState(
    userData?.data.data.availibilityInterval
  );

  const [interval, setInterval] = useState("minutes");
  const [selectedTimezone, setSelectedTimezone] = useState(clientTz());
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const convertEditorState = convertToRaw(editorState.getCurrentContent());
  const description = convertEditorState.blocks[0].text;

  const USER_ID = localStorage.getItem("userId");

  const uploadFiles = () => {
    document.getElementById("select-file").click();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.post(`${url}/api/getUserProfile`, {
          userId: USER_ID,
        });
        if (!response) {
          throw new Error("No response found");
        }
        if (response.data.length === 0) {
          throw new Error("No Bookings Found");
        } else {
          setUserData(response);
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

  const onChangeProfileHandler = async (event) => {
    event.preventDefault();
    let image;
    if (currPPic) {
      image = currPPic.selectedFile.base64;
    }

    try {
      await axios
        .put(`${url}/api/updateUserProfile`, {
          userId: USER_ID,
          ProfilePicture: image,
          Name: name,
          PageLink: `https://kallendly.com/${USER_ID}`,
          email: email,
          TimeZone: selectedTimezone,
          TimeFormate: timeFormate,
          AvailabilityInterval: availabilityInterval,
        })
        .then(function (response) {
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Profile updated successfully",
            showCancelButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
        })
        .catch(function (error) {
          Swal.fire({
            position: "center",
            icon: "error",
            text: "Please use file with size of under 100kb",
            color: "black",
            showCancelButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
        });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Network error",
        color: "black",
        showCancelButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <React.Fragment>
      <Container>
        <h1 className="h3 text-center fw-bold mt-5 mb-5">My Profile</h1>
        <div className="profilePicture">
          {userData && userData.data.data.img ? (
            <img
              className="profileImage"
              src={
                currPPic !== undefined
                  ? currPPic.selectedFile.base64
                  : userData.data.data.img
              }
            />
          ) : (
            <img
              className="profileImage"
              src={
                currPPic !== undefined
                  ? currPPic.selectedFile.base64
                  : "https://asset-tidycal.b-cdn.net//img/smiley.svg"
              }
              alt="logo"
            />
          )}
          <div className="text-center custom-file-input mt-3">
            <FileBase64
              type="file"
              onDone={(base64) => setPPic({ selectedFile: base64 })}
            />
          </div>
        </div>
        <div className="picLink change-profile-link">
          <a
            className=" text-primary profile"
            style={{ position: "relative", top: -40, zIndex: -11111 }}
            onClick={uploadFiles}
          >
            <a className="change-profile-link">Change profile picture</a>
          </a>
        </div>

        <Row className="justify-content-center">
          <Col md={6}>
            <form>
              <p className="fw-bold pb-2">Your booking page link:</p>

              <div className="plink mb-4 pb-2">
                <InputGroup className="mb-3">
                  {userData && (
                    <InputGroup.Text className="w-100 text-wrap url-font">
                      https://kallendly.com/id/{USER_ID}
                    </InputGroup.Text>
                  )}
                </InputGroup>
                <Link to={`/id/${USER_ID}`}>
                  <a className="m-0 p-0 btn btn-link ">
                    View your booking page
                  </a>
                </Link>
              </div>
              <div className="mb-4 pb-2">
                <label className="fw-bold  pb-2" htmlFor="userName">
                  Your name:
                </label>
                {userData && (
                  <input
                    className="form-control  userInputs"
                    type="text"
                    // name="userName"
                    id="userName"
                    placeholder={userData?.data.data.name}
                    // value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </div>
              <div className="mb-4 pb-2">
                <label className="fw-bold pb-2" htmlFor="email">
                  Your email:
                </label>
                {userData && (
                  <input
                    className="form-control  userInputs"
                    type="text"
                    name="email"
                    id="email"
                    placeholder={userData.data.data.email}
                    // value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                )}
              </div>

              <div className="mb-4 pb-2">
                <label className="fw-bold  pb-2 " htmlFor="timezone">
                  Your timezone :
                </label>
                {/* <div className="border border-1 form-control p-2"> */}
                {userData && (
                  // <CountryDropdown
                  //   style={{
                  //     border: 0,
                  //     backgroundColor: "white",
                  //   }}
                  //   className="dropdown-toggle"
                  //   // value={userData.data.data.TimeZone}
                  //   placeholder={userData.data.data.TimeZone}
                  //   onChange={(val) => setCountry(val)}
                  // />
                  <TimezoneSelect
                    value={
                      userData.data.data.TimeZone
                        ? userData.data.data.TimeZone
                        : selectedTimezone
                    }
                    onChange={setSelectedTimezone}
                  />
                )}
                {/* </div> */}
              </div>

              <div className="mb-4 pb-2">
                <label className="fw-bold  pb-2" htmlFor="timeFormate">
                  Time formate:
                </label>
                {userData && (
                  <select
                    name="show"
                    value={userData.data.data.TimeFormate}
                    className="dropDownIcon form-control"
                    aria-label="Default select"
                    onChange={(e) => settimeFormate(e.target.value)}
                  >
                    <option value="12 hours">12 hour</option>
                    <option value="24 hours">24 hour</option>
                  </select>
                )}
              </div>

              <div className="d-none mb-4 pb-2 d-flex align-items-center flex-wrap flex-sm-nowrap">
                <label className="fw-bold  pb-2" htmlFor="themeColor">
                  Booking page theme color:
                </label>
                <input
                  type="color"
                  id="theme_color"
                  name="theme_color"
                  className="form-control  col-7 col-sm p-1"
                />
              </div>

              <div id="accordion" className="d-none">
                <div className="card">
                  <div
                    className="card-header bg-cfcfcf d-flex "
                    id="headingOne"
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className=" accordianButton btn btn-link text-dark w-100  fw-bold text-left"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Advance Settings
                    </a>
                    <div
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                      className="upArrow"
                    >
                      <IoIosArrowUp />
                    </div>
                  </div>

                  <div
                    id="collapseOne"
                    className="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <label htmlFor="interval" className="fw-bold">
                        Availability interval:
                      </label>
                      {userData && (
                        <input
                          style={{ height: "2.5rem", width: "50px" }}
                          placeholder={userData.data.data.availibilityInterval}
                          //  value={ availabilityInterval}
                          className="ml-2 userInputs intervalNumber"
                          type="number"
                          name="interval"
                          id="interval"
                          onChange={(e) =>
                            setavailabilityInterval(e.target.value)
                          }
                        />
                      )}
                      <select
                        className="dropDownIcon border ml-2 p-2 rounded mb-4"
                        onChange={(e) => setInterval(e.target.value)}
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                      <span className="pl-1 ">between available bookings</span>
                    </div>
                  </div>
                </div>
              </div>
              <label className="fw-bold  pb-2" htmlFor="">
                Plan Status:
              </label>
              <p>{userData?.data.data.planStatus}</p>
              <label className="fw-bold mt-4  pb-2" htmlFor="">
                Plan Type:
              </label>
              <p>{userData?.data.data.planType}</p>

              <div className="sticky-bottom justify-content-center">
                <div className="flex flex-wrap bg-white py-2 py-sm-3 d-flex align-items-center justify-content-center ">
                  <button
                    className="btn btn-primary m-1 m-sm-2"
                    type="submit"
                    onClick={onChangeProfileHandler}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default Profile;
