import React, { useState, useEffect } from "react";
import "./PlanPayments.css";
import paypal from "../Integrations/integration-logo-paypal.svg";
import Paypal from "../Integrations/Paypal";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../env.js";
import { useParams } from "react-router-dom";
import moment from "moment";

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

function CardsPayment() {
  const [primium, setPrimium] = useState(false);

  const [responseData, setResponseData] = useState();
  const [payment, setPayment] = useState(false);
  const USER_ID = localStorage.getItem("userId");
  const [userData, setUserData] = useState();
  const [name, setName] = useState(userData?.data.data.name);

  const startDate = new Date();
  const addDate = moment(startDate).add(30, "days");
  const expiryDate = addDate._d;
  const planValue = useParams();
  const plan = planValue.month;

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

  const _DEV_ = document.domain === "localhost";
  const id = localStorage.getItem("userId");

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
        showCancelButton: true,
        confirmButtonText: "Ok",
        confirmButtonColor: "#dc3545",
      });
      return;
    }
    await axios
      .post(`${url}/api/razorPay`, {
        UserId: id,
        payment: payment,
        amount: planValue.month === "1 year" ? 39 : 9,
        // amount: "1",
      })
      .then((response) => {
        setResponseData(response);
        let options = {
          key: _DEV_ ? "rzp_live_S6mMginUIa6pad" : "rzp_live_S6mMginUIa6pad", // client id razor pay
          // key: "rzp_live_S6mMginUIa6pad",
          currency: "USD",
          amount: response.data.amount.toString(),
          order_id: response.data.id,
          name: { name },
          description: "Thank you for nothing. Please give us some money",
          handler: function (response) {
            // setPayment(true);
            if (responseData) {
              axios
                .post(`${url}/api/createPay`, {
                  UserId: id,
                  payment: payment,
                  id: responseData.data.id,
                  amountPaid: responseData.data.amount,
                  planType: plan,
                  planStartDate: startDate,
                  planEndDate: expiryDate,
                })
                .then((response) => {
                  if (response.data.message === "Payment Succeeded") {
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      color: "black",
                      text: "Payment Succeeded",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    try {
                      let response = axios.put(
                        `${url}/api/updateUser/${USER_ID}`,
                        {
                          isPremium: false,
                          planStatus: "continued",
                          planType: plan,
                          planStartDate: startDate,
                          planEndDate: expiryDate,
                        }
                      );
                      if (!response) {
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          text: "No response found",
                          color: "black",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      } else {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          text: "Your subscription is renewed",
                          color: "black",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        localStorage.setItem("planType", plan);
                      }
                    } catch (error) {
                      Swal.fire({
                        position: "center",
                        icon: "error",
                        text: "Network",
                        color: "black",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    }
                  } else {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      color: "black",
                      text: "Payment not succeeded",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  }
                });
            }
          },

          prefill: {
            name: "mannan",
            email: userData?.data.data.email,
            phone_number: "",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      });
  }

  return (
    <div className="card w-100 p-4">
      <h2 className="h3 font-weight-light border-bottom pb-2 text-nowrap">
        Payments
      </h2>
      {/* {primium && (
        <div
          className="alert alert-primary border-primary mb-0 d-flex px-2 mt-3"
          onClick={() => setPrimium(false)}
        >
          <div className="h2 mb-0 mx-2">👉</div>
          <div className="p-2">
            Upgrade to enable paid bookings, <b>$29 lifetime access.</b>
          </div>
        </div>
      )} */}
      <div className={primium ? "primium-class" : null}>
        <h3 className="my-4 pt-3 text-center">
          <img src={paypal} height="35" alt="PayPal" />
        </h3>

        <div className="row justify-content-center mb-5 border-bottom-1">
          <div className="col col-md-9 col-xl-8">
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

export default CardsPayment;
