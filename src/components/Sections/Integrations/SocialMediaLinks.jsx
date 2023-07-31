import React, { useEffect, useState } from "react";
import apple from "../../../assets/img/Intergration/integration-logo-apple.png";
import microsoft from "../../../assets/img/Intergration/integration-logo-microsoft.png";
import MicrosoftLogin from "react-microsoft-login";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import axios from "axios";
import Swal from "sweetalert2";
import { Login } from "@microsoft/mgt-react";

function SocialMediaLinks() {
  const clientId =
    "512607047503-9ds6lskp7flv1r8m4d7kqtj2l4n21k5a.apps.googleusercontent.com";
  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: clientId });
    });
  }, []);

  const onSuccessHandle = async (response) => {
    // localStorage.setItem(JSON.parse("integrationMail", response.profileObj.email));

    localStorage.setItem(
      "integrationMail",
      JSON.stringify(response.profileObj.email)
    );
    localStorage.setItem("loggedIn", "");
    window.location.reload(true);
  };

  const onFailureHandle = (response) => {};

  const authHandler = async (err, data) => {
    let email = data.account.userName;
    let name = data.account.name;

    await axios
      .post("https://admin.kallendly.com/api/microsoftLogin", {
        email: email,
        name: name,
      })
      .then((response) => {
        localStorage.setItem("_a", true);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("integrationMail", JSON.stringify(email));
        localStorage.setItem("loggedIn", "microsoft");
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          text: error,
          color: "balck",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
      });
  };

  return (
    <React.Fragment>
      <h2 className="h3 font-weight-light border-bottom pb-2 text-nowrap">
        Calendars
      </h2>
      <p>
        Connect all your calendars to avoid conflicts. Define the calendar you
        would like to add new bookings to.
      </p>
      <div className="my-4 row justify-content-center aligh-items-stretch gx-2">
        <div className="col-md mb-3 mb-md-0">
          <button className="btn btn-outline-primary btn-block">
            <div className="py-2 py-md-4 text-left d-flex flex-wrap justify-content-center align-items-center flex-md-column">
              {/* <img
                height="43"
                className="m-1 mx-md-auto mb-md-3 google-icon"
                src={google}
                alt="Google account logo"
              /> */}
              <GoogleLogin
                className="mx-md-auto mb-md-3 googley"
                clientId={clientId}
                onSuccess={onSuccessHandle}
                onFailure={onFailureHandle}
                cookiePolicy={"single_host_origin"}
              />
              <span className="mx-2 my-1 m-md-0 text-center add">
                Add Google account
              </span>
            </div>
          </button>
        </div>
        <div className="col-md mb-3 mb-md-0">
          <MicrosoftLogin
            clientId={"601118cf-e48b-4987-b315-9d516682c96c"}
            authCallback={authHandler}
            className="position-absolute microsoft-btn"
          />
          <button
            className="btn btn-outline-primary btn-block w-100 h-100 position-relative z-index"
            href="/#"
          >
            <div className="py-2 py-md-4 text-left d-flex flex-wrap justify-content-center align-items-center flex-md-column">
              <img
                height="42"
                className="m-1 mx-md-auto mb-md-3"
                src={microsoft}
                alt="Office account logo"
              />
              <span className="mx-2 my-1 m-md-0 text-center">
                Add Office 365 account
              </span>
            </div>
          </button>
        </div>
        {/* <div className="col-md mb-md-0" title="Coming Soon!">
          <button
            className="btn btn-outline-primary btn-block w-100 h-100"
            href="/#"
          >
            <div className="py-2 py-md-4 text-left d-flex flex-wrap justify-content-center align-items-center flex-md-column">
              <img
                height="43"
                className="m-1 mx-md-auto mb-md-3"
                src={apple}
                alt="Apple account logo"
              />
              <span className="mx-2 my-1 m-md-0 text-center">
                Add Apple account
              </span>
            </div>
          </button>
        </div> */}
      </div>
    </React.Fragment>
  );
}

export default SocialMediaLinks;
