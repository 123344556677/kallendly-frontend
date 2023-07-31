import React, { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../env.js";
import moment from "moment";

export default function Paypal() {
  const [state, setState] = useState();
  const id = localStorage.getItem("userId");
  const USER_ID = localStorage.getItem("userId");
  const startDate = new Date();
  const addDate = moment(startDate).add(30, "days");
  const expiryDate = addDate._d;
  const planValue = useParams();
  const plan = planValue.month;

  return (
    <div>
      <PayPalButton
        options={{
          clientId:
            "ASFTqvakOVwjSXZyA4FPjCO4guDENP_GoEgIfDJ4VPFgPunSaz1EDm-lGrSq0UNWzw9zJAhOnB7hwf2I",
          currency: "USD",
        }} // test options
        amount={planValue.month === "1 year" ? "39" : "9"}
        // amount="1"
        onSuccess={(details, data) => {
          // alert("Transaction completed by " + details.payer.name.given_name);
          Swal.fire({
            position: "center",
            icon: "success",
            color: "black",
            text: "Transaction completed by " + details.payer.name.given_name,
            showCancelButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
          axios.post(`${url}/api/paypalPay`, {
            UserId: id,
            id: details.id,
            amountPaid: state,
            planType: plan,
            planStartDate: startDate,
            planEndDate: expiryDate,
          });
          try {
            let response = axios.put(`${url}/api/updateUser/${USER_ID}`, {
              isPremium: false,
              planStatus: "continued",
              planType: plan,
              planStartDate: startDate,
              planEndDate: expiryDate,
            });
            if (!response) {
              Swal.fire({
                position: "center",
                icon: "error",
                text: "No response found",
                color: "black",
                showCancelButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "success",
                text: "Your subscription is renewed",
                color: "black",
                showCancelButton: true,
                confirmButtonText: "Ok",
                confirmButtonColor: "#dc3545",
              });
              localStorage.setItem("planType", plan);
            }
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

        }}
      />
    </div>
  );
}
