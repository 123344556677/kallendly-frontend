import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { url } from "../env.js";
import Integrationstable from "./Integrationstable";
import SocialMediaLinks from "./SocialMediaLinks";
import Payment from "./Payment";
import "./Integration.css";
import axios from "axios";
import Swal from "sweetalert2";

function Integrations() {
  const authHandler = async (err, data) => {
    let email = data.account.userName;

    await axios
      .post(`${url}/api/microsoftLogin`, {
        email: email,
      })
      .then((response) => {
        localStorage.setItem("_a", true);
        localStorage.setItem("userId", response.data.user._id);
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "Login failed",
          color: "balck",
          showCancelButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: "#dc3545",
        });
      });
  };

  const [mail, setMail] = useState(localStorage.getItem("integrationMail"));

  const removeEmail = () => {};
  return (
    <Container className="padding-responsive px-5">
      <h2 className="font-weight-bold p-5">Integrations</h2>
      <Row className="m-0 px-5 mb-5">
        <div className="card pb-0 p-4  w-100">
          <SocialMediaLinks />
          {mail && (
            <>
              <div class="border-bottom pb-2 d-flex justify-content-between align-items-center">
                <strong>Connected accounts:</strong>
              </div>
              <Integrationstable />
            </>
          )}
        </div>
      </Row>

      <Row className="m-0 px-5 mb-5">
        <Payment />
      </Row>

      {/* <MicrosoftLogin
        clientId={"601118cf-e48b-4987-b315-9d516682c96c"}
        authCallback={authHandler}
      /> */}
    </Container>
  );
}

export default Integrations;
