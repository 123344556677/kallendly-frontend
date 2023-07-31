import React, { useState } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import Swal from "sweetalert2";

import { url } from "../env.js";

import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const clientId =
    "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com"; // client id
  const history = useHistory();

  const values = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [value, setValue] = useState(values);
  const [passwordValue, setpasswordValue] = useState(false);
  const [passwordLength, setpasswordLength] = useState(false);
  const [specialCharacter, setspecialCharacter] = useState(false);
  const [digits, setDigits] = useState(false);
  const [checkEmail, setcheckEmail] = useState(false);
  const [checkName, setcheckName] = useState(false);
  const [havingPassword, sethavingPassword] = useState(false);
  const [havingName, sethavingName] = useState(false);
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(false);
  let currentDate = new Date();

  const pickPassword = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    setDigits(false);
    setspecialCharacter(false);
    setpasswordValue(false);
    setpasswordLength(false);
    setcheckEmail(false);
    setcheckName(false);
    sethavingPassword(false);
    sethavingName(false);
  };

  const register = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (value.name) {
      sethavingName(false);
      if (value.name.length < 25) {
        setcheckName(false);
      } else {
        setcheckName(true);
      }
    } else {
      sethavingName(true);
    }

    if (
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.email) === true
    ) {
      setcheckEmail(false);
    } else {
      setcheckEmail(true);
    }
    if (value.password && value.confirmPassword) {
      if (value.password === value.confirmPassword) {
        setpasswordValue(false);
      } else {
        setLoading(false);
        setpasswordValue(true);
        return;
      }
    } else {
      setLoading(false);
      // Swal.fire({
      //   position: "center",
      //   icon: "error",
      //   text: "check if with google",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
      setpasswordValue(true);
      return;
    }
    if (value.password) {
      sethavingPassword(false);

      if (value.password.length >= 8) {
        setpasswordLength(false);

        const passw = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (passw.test(value.password) === true) {
          setspecialCharacter(false);

          if (/\d/.test(value.password) === true) {
            setDigits(false);
            try {
              await axios
                .post(`${url}/api/userRegister`, {
                  name: value.name,
                  email: value.email,
                  password: value.password,
                  userRole: "user",
                  loggedInWithGoogle: false,
                  loggedInWithMicrosoft: false,
                })
                .then((res) => {
                  setLoading(false);
                  if (res.data.data.loggedInWithGoogle) {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      text: "Please login with google",
                      showCancelButton: true,
                      confirmButtonText: "Ok",
                      confirmButtonColor: "#dc3545",
                    });
                    return;
                  } else if (res.data.message === "Email already exist") {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      text: "Email already exist",
                      showCancelButton: true,
                      confirmButtonText: "Ok",
                      confirmButtonColor: "#dc3545",
                    });
                  } else {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      text: "SignUp successfull",
                      showCancelButton: true,
                      confirmButtonText: "Ok",
                      confirmButtonColor: "#dc3545",
                    });
                    localStorage.setItem("planType", res.data.data.planType);
                    history.push("/Login");
                  }
                })
                .catch((err) => {
                  setLoading(false);
                  Swal.fire({
                    position: "center",
                    icon: "error",
                    text: "Network Error",
                    showCancelButton: true,
                    confirmButtonText: "Ok",
                    confirmButtonColor: "#dc3545",
                  });
                });
            } catch (error) {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "Network Error",
                showCancelButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
            }
          } else {
            setDigits(true);
          }
        } else {
          setspecialCharacter(true);
        }
      } else {
        setpasswordLength(true);
      }
    } else {
      sethavingPassword(true);
    }
  };

  const onSuccessHandle = async (response) => {
    await axios
      .post(`${url}/api/googleLogin`, {
        tokenId: response.tokenId,
      })
      .then((response) => {
        let expiryDate = new Date(response?.data.user.planEndDate);
        localStorage.setItem("_a", true);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("planType", response?.data.user.planType);
        setUserRole(
          localStorage.setItem("userRole", response?.data.user.userRole)
        );
        localStorage.setItem("planType", response?.data.user.planType);
        if (currentDate > expiryDate) {
          try {
            let response = axios.put(
              `${url}/api/updateUser/${response.data.user._id}`,
              {
                isPremium: false,
                planStatus: "expired",
                planType: "none",
              }
            );
            if (!response) {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "No response found",
                color: "black",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "Your subscription is expired",
                color: "black",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
              axios.post(`${url}/api/sendMail`, {
                email: response?.data.user.email,
              });
            }
          } catch (error) {
            Swal.fire({
              position: "center",
              icon: "error",
              text: error,
              color: "black",
              showConfirmButton: true,
              confirmButtonText: "Ok",
              confirmButtonColor: "#dc3545",
            });
          }
        }

        history.push("/");
        window.location.reload();
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          text: error,
          color: "balck",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const onFailureHandle = (response) => {
    // Swal.fire({
    //   position: "center",
    //   icon: "error",
    //   text: "Network error",
    //   color: "black",
    //   showConfirmButton: false,
    //   timer: 1500,
    // });
  };

  return (
    <React.Fragment>
      <h1 className="cool-heading text-center mt-5">
        Cool! Let's get you registered
      </h1>
      <Row className="justify-content-center mt-4">
        <Col md={4}>
          <Card className="signup-card">
            <Card.Body>
              <Form onSubmit={register}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="form-label">Your name:</Form.Label>
                  <Form.Control
                    className="mt-2"
                    onChange={(e) => pickPassword(e)}
                    name="name"
                    required
                  />
                  {havingName && (
                    <span className="validation-text">
                      *Name must not be empty
                    </span>
                  )}
                  {checkName && (
                    <span className="validation-text">
                      *Name should be less than 25 characters
                    </span>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="form-label">Your email:</Form.Label>
                  <Form.Control
                    type="email"
                    className="mt-2"
                    onChange={(e) => pickPassword(e)}
                    name="email"
                    required
                  />
                  {checkEmail && (
                    <span className="validation-text">
                      *Please Enter a Valid Email Address
                    </span>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="form-label">Your password:</Form.Label>
                  <Form.Control
                    type="password"
                    className="mt-2"
                    onChange={(e) => pickPassword(e)}
                    name="password"
                  />
                  {havingPassword && (
                    <span className="validation-text">
                      *Password must not be empty
                    </span>
                  )}
                  {passwordLength && (
                    <span className="validation-text">
                      *password must have 8 characters
                    </span>
                  )}
                  {specialCharacter && (
                    <span className="validation-text">
                      *password must have a special character
                    </span>
                  )}
                  {digits && (
                    <span className="validation-text">
                      *password must contain a digit
                    </span>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className=" form-label">
                    Confirm your password:
                  </Form.Label>
                  <Form.Control
                    type="password"
                    className="mt-2"
                    onChange={(e) => pickPassword(e)}
                    name="confirmPassword"
                  />
                  {passwordValue && (
                    <span className="validation-text">
                      *Password and Confirm password must be same
                    </span>
                  )}
                </Form.Group>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-2 mb-sm-1 mt-1"
                >
                  {loading ? "Register... →" : "Register →"}
                </button>
                <div className="d-flex align-items-center mt-3 mb-3">
                  <div className="col pt-1 mb-1 border-bottom"></div>
                  <div className=" sign-or">Or:</div>
                  <div className="col pt-1 mb-1 border-bottom"></div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <GoogleLogin
                    className="Google-Btn"
                    clientId={clientId}
                    buttonText="Signup with Google"
                    onSuccess={onSuccessHandle}
                    onFailure={onFailureHandle}
                    cookiePolicy={"single_host_origin"}
                  />
                  <div aria-hidden="true"></div>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <p className="text-center mt-4">
            <Link to="/Login">
              <a className="text-decoration-none already-reg" href="">
                Already registered?
              </a>
            </Link>
          </p>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SignUp;
