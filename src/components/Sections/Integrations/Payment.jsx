import React, { useState } from "react";
import "./Integration.css";
import paypal from "./integration-logo-paypal.svg";
import Paypal from "./Paypal";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../env.js";
import { Link } from "react-router-dom";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Payment() {
  const [primium, setPrimium] = useState(true);
  const [emailField, setEmailField] = useState("");
  const [mail, setMail] = useState(localStorage.getItem("integrationMail"));
  const [responseData, setResponseData] = useState();
  const [payment, setPayment] = useState(false);

  const [name, setName] = useState("");

  const _DEV_ = document.domain === "localhost";
  const id = localStorage.getItem("userId");
  // async function displayRazorpay() {
  //   console.log("=======>", id);

  //   const res = await loadScript(
  //     "https://checkout.razorpay.com/v1/checkout.js"
  //   );

  //   if (!res) {
  //     Swal.fire({
  //       position: "center",
  //       icon: "error",
  //       color: "black",
  //       text: "Razorpay sdk failed! Are you online?",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     return;
  //   }

  //   await axios
  //     .post(`${url}/api/razorPay`, {
  //       UserId: id,
  //       payment: payment,
  //     })
  //     .then((response) => {
  //       console.log(
  //         response,
  //         "=================================razor RESPOONSE"
  //       );

  //       setResponseData(response);
  //       const options = {
  //         key: _DEV_ ? "rzp_test_4GGNxLh0s3F5pA" : "PRODUCTION_KEY",
  //         currency: "INR",
  //         amount: response.data.amount.toString(),
  //         order_id: response.data.id,
  //         name: { name },
  //         description: "Thank you for nothing. Please give us some money",
  //         image: "http://localhost:1337/logo.svg",
  //         handler: function (response) {
  //           setPayment(true);
  //           {
  //             responseData &&
  //               axios.post(`${url}/api/createPay`, {
  //                 UserId: id,
  //                 payment: payment,
  //                 id: responseData.data.id,
  //                 amountPaid: responseData.data.amount,
  //               });
  //           }
  //           Swal.fire({
  //             position: "center",
  //             icon: "success",
  //             color: "black",
  //             text: "Payment Succeeded",
  //             showConfirmButton: false,
  //             timer: 1500,
  //           });
  //         },

  //         prefill: {
  //           name,
  //           email: "sdfdsjfh2@ndsfdf.com",
  //           phone_number: "9899999999",
  //         },
  //       };
  //       const paymentObject = new window.Razorpay(options);
  //       paymentObject.open();
  //     });
  // }
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      Swal.fire({
        position: "center",
        icon: "error",
        color: "black",
        text: "Razorpay sdk failed! Are you online?",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    await axios
      .post(`${url}/api/razorPay`, {
        UserId: id,
        payment: payment,
      })
      .then((response) => {
        setResponseData(response);
        const options = {
          key: _DEV_ ? "rzp_test_4GGNxLh0s3F5pA" : "rzp_test_4GGNxLh0s3F5pA",
          currency: "INR",
          amount: response.data.amount.toString(),
          order_id: response.data.id,
          name: { name },
          description: "Thank you for nothing. Please give us some money",

          handler: function (response) {
            setPayment(true);
            {
              responseData &&
                axios.post(`${url}/api/createPay`, {
                  UserId: id,
                  payment: payment,
                  id: responseData.data.id,
                  amountPaid: responseData.data.amount,
                });
            }
            Swal.fire({
              position: "center",
              icon: "success",
              color: "black",
              text: "Payment Succeeded",
              showConfirmButton: false,
              timer: 1500,
            });
          },

          prefill: {
            name,
            email: "",
            phone_number: "",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      });
  }

  let planType = localStorage.getItem("planType");

  return (
    <div className="card w-100 p-4">
      <h2 className="h3 font-weight-light border-bottom pb-2 text-nowrap">
        Payments
      </h2>

      {(!planType === "1 year" || !planType === "1 month") && (
        <Link to="/pricing">
          <div
            className="alert alert-primary border-primary mb-0 d-flex px-2 mt-3"
            onClick={() => setPrimium(false)}
          >
            <div className="h2 mb-0 mx-2">👉</div>
            <div className="p-2">
              Upgrade to enable paid bookings,{" "}
              <b>visit our subscription plan</b>
            </div>
          </div>
        </Link>
      )}
      <div
        className={
          !planType === "1 year" || !planType === "1 month"
            ? "primium-class"
            : null
        }
      >
        <h3 className="my-4 pt-3 text-center">
          <img src={paypal} height="35" alt="PayPal" />
        </h3>

        <div className="row justify-content-center mb-5 border-bottom-1">
          <div className="col col-md-9 col-xl-8">
            {/* <form className="onsubmit-disable d-none d-sm-block">
              <fieldset disabled="">
                <label
                  htmlFor="paypal-email"
                  className="form-label font-weight-bold mb-2"
                >
                  PayPal email:
                </label>
                <div className="input-group d-sm-flex">
                  <span className="input-group-text border-left">
                    <img
                      height="22"
                      src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                      alt="paypal"
                    />
                  </span>
                  <input
                    type="email"
                    className="form-control input-bg"
                    value={mail}
                    onChange={(e) => setEmailField(e.target.value)}
                    disabled={primium}
                  />
                  <button
                    type="submit"
                    className="btn btn-outline-primary"
                    onClick={(e) => e.preventDefault()}
                    disabled={primium}
                  >
                    Save PayPal Email
                  </button>
                </div>
              </fieldset>
            </form> */}
            <form className="d-sm-none border-bottom-0">
              <fieldset disabled="">
                <div className="input-group d-sm-flex mb-2">
                  <span className="input-group-text">
                    <img
                      height="22"
                      src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                      alt="paypal"
                    />
                  </span>
                  <input
                    type="email"
                    name="paypal_email"
                    id="paypal-email"
                    className="form-control input-bg"
                    disabled={primium}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-primary w-100"
                  onClick={(e) => e.preventDefault()}
                  disabled={primium}
                >
                  Pay with Razorpay
                </button>
              </fieldset>
            </form>
            <Paypal />
          </div>
        </div>

        <div className="p-4 text-center border-top">
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/en/thumb/8/89/Razorpay_logo.svg/1896px-Razorpay_logo.svg.png"
            }
            height="39"
            alt="Stripe"
          />
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col col-md-9 col-xl-8">
            <form className="opacity-2" onSubmit={(e) => e.preventDefault()}>
              <fieldset disabled="">
                {/* <label
                  htmlFor="stripe-key"
                  className="form-label font-weight-bold mb-2"
                >
                  Phone number:
                </label>
                <div className="input-group d-sm-flex mb-3">
                  <span className="input-group-text border-left">
                    <img
                      height="22"
                      src="https://avatars.githubusercontent.com/u/7713209?s=200&v=4"
                      alt="stripe"
                    />
                  </span>
                  <input
                    type="tel"
                    className="form-control input-bg border-0"
                    disabled={primium}
                  />
                </div>
                <label className="form-label font-weight-bold mb-2">
                  Email:
                </label>
                <div className="input-group d-sm-flex mb-3">
                  <span className="input-group-text border-left">
                    <img
                      height="22"
                      src="https://avatars.githubusercontent.com/u/7713209?s=200&v=4"
                      alt="stripe"
                    />
                  </span>
                  <input
                    type="email"
                    className="form-control input-bg"
                    disabled={primium}
                  />
                </div> */}
                <button
                  type="submit"
                  className="btn btn-outline-primary w-100"
                  onClick={displayRazorpay}
                  disabled={primium}
                >
                  Pay with Razorpay
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
