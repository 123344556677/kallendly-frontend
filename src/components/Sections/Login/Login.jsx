import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import axios from "axios";
import { url } from "../env.js";
import "./login.css";
import "./Forgot";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useHistory();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(false);

  let currentDate = new Date();

  // console.log(userData?.data.planEndDate, "========>EndDate")

  const clientId =
    "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com"; // client id

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: clientId });
    });
  }, []);

  const onLoginHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    // try {
    await axios
      .post(`${url}/api/loginUser`, {
        email: email,
        password: password,
      })
      .then((res) => {
        setLoading(false);
        // alert(res.data.message);

        if (res.data.message === "Login Successful") {
          let expiryDate = new Date(res?.data.data.planEndDate);
          localStorage.setItem("userId", res.data.data._id);
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("userRole", res?.data.data.userRole);
          localStorage.setItem("_a", true);
          localStorage.setItem("planType", res?.data.data.planType);
          if (currentDate > expiryDate) {
            try {
              let response = axios.put(
                `${url}/api/updateUser/${res.data.data._id}`,
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
                  email: res?.data.data.email,
                });
              }
            } catch (error) {
              setLoading(false);
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
          setLoading(false);
          history.push("/");
          window.location.reload();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            text: res.data.message,
            color: "black",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
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
    //   text: response,
    //   color: "black",
    //   showConfirmButton: false,
    //   timer: 1500,
    // });
  };

  return (
    <Container>
      <Row className="loginForm justify-content-center mt-5">
        <Col md={5}>
          <form onSubmit={onLoginHandler}>
            <div className="card justify-content-start">
              <div className="p-3 border-bottom">
                <h1 className="h3 fw-light mb-0 text-center">Login</h1>
              </div>
              <div className="p-3 p-sm-4">
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold mb-2">
                    Your email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    autoComplete="email"
                    required
                    autoFocus
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold mb-2">
                    Your password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    autoComplete="current-password"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {/* <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      name="remember"
                      type="checkbox"
                      defaultValue
                      id="remember_me"
                    />
                    <label className="form-check-label" htmlFor="remember_me">
                      Remember me
                    </label>
                  </div>
                </div> */}
                <button
                  type="submit"
                  className=" loginButton btn btn-primary w-100 mb-3"
                >
                  {loading ? "Login ..." : "Login"} →
                </button>
                <div className="d-flex align-items-center mb-3">
                  <div className="col pt-1 mb-1 border-bottom" />
                  <div className="text-secondary orFont mx-3 small">Or:</div>
                  <div className="col pt-1 mb-1 border-bottom" />
                </div>
                <GoogleLogin
                  className="Google-Btn"
                  clientId={clientId}
                  buttonText="Login with Google"
                  onSuccess={onSuccessHandle}
                  onFailure={onFailureHandle}
                  cookiePolicy={"single_host_origin"}
                />
                <div className="d-flex align-items-center justify-content-between flex-wrap ">
                  <Link to="/Forgot">
                    <a
                      className="my-2 small text-decoration-none me-3 signupOp"
                      href="#"
                    >
                      Forgot your password?
                    </a>
                  </Link>
                  <Link to="/SignUp">
                    <a
                      className="my-2 small text-decoration-none signupOp"
                      href="#"
                    >
                      Not registered?
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
