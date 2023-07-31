import React, { useState, useEffect } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
// import "./SignUp.css";
import Swal from "sweetalert2";

import { url } from "../env.js";

import { useParams } from "react-router-dom";

const ForgetPassword = () => {
  const clientId =
    "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com";

  const values = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const { email } = useParams();
  const [value, setValue] = useState(values);
  const [passwordValue, setpasswordValue] = useState(false);
  const [passwordLength, setpasswordLength] = useState(false);
  const [specialCharacter, setspecialCharacter] = useState(false);
  const [digits, setDigits] = useState(false);
  const [checkEmail, setcheckEmail] = useState(false);
  const [checkName, setcheckName] = useState(false);
  const [havingPassword, sethavingPassword] = useState(false);
  const [havingName, sethavingName] = useState(false);

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

  useEffect(() => {
  }, []);

  const register = async (e) => {
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

    // if (
    //   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.email) === true
    // ) {
    //   setcheckEmail(false);
    // } else {
    //   setcheckEmail(true);
    // }
    if (value.password && value.confirmPassword) {
      if (value.password === value.confirmPassword) {
        setpasswordValue(false);
      } else {
        setpasswordValue(true);

        return;
      }
    } else {
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
              let response = await axios.put(`${url}/api/forgetPassword`, {
                email: email,
                password: value.password,
              });
              if (!response) {
                // throw new Error("Something went wrong");
                Swal.fire({
                  position: "center",
                  icon: "error",
                  text: "password updation failed",
                  showCancelButton: true,
                  confirmButtonText: "Ok",
                  confirmButtonColor: "#dc3545",
                });
              } else {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  text: "Password updated successfully",
                  showCancelButton: true,
                  confirmButtonText: "Ok",
                  confirmButtonColor: "#dc3545",
                });
              }
            } catch (error) {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "password updation failed",
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
      .post(`{url}/api/googleLogin`, {
        tokenId: response.tokenId,
      })
      .then((response) => {
        localStorage.setItem("_a", true);
        localStorage.setItem("userId", response.data.user._id);
        window.location.reload();
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "Network error",
          color: "balck",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
      });
  };

  const onFailureHandle = (response) => {
    Swal.fire({
      position: "center",
      icon: "error",
      text: response,
      color: "black",
      showCancelButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: "#dc3545",
    });
  };

  return (
    <React.Fragment>
      <h1 className="cool-heading text-center mt-5">Create new password</h1>
      <Row className="justify-content-center mt-4">
        <Col md={4}>
          <Card className="signup-card">
            <Card.Body>
              <Form onSubmit={register}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="form-label">Your email:</Form.Label>
                  <Form.Control
                    type="email"
                    className="mt-2"
                    onChange={(e) => pickPassword(e)}
                    name="email"
                    value={email}
                  />
                  {checkEmail && (
                    <span className="validation-text">
                      *Please Enter a Valid Email Address
                    </span>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="form-label">Password:</Form.Label>
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
                    Confirm password:
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
                  Reset Password →
                </button>
                <div className="d-flex align-items-center mt-3 mb-3">
                  <div className="col pt-1 mb-1 border-bottom"></div>

                  <div className="col pt-1 mb-1 border-bottom"></div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div aria-hidden="true"></div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ForgetPassword;
