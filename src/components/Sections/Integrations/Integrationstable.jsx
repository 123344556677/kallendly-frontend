import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import INTEGRATION_DATA from "../../../data/IntegrationTableData.js";
import google from "../../../assets/img/Intergration/integration-logo-google.png";
import microsoft from "../../../assets/img/Intergration/integration-logo-microsoft.png";
import "./Integration.css";

function Integrationstable() {
  const [table, setTable] = useState(INTEGRATION_DATA);
  const [enabledAlert, setEnalbledAlert] = useState(null);
  const [primaryAlert, setPrimaryAlert] = useState(false);

  const API_KEY = "AIzaSyAiZvA1vGN-lMuR10n3-HVIAagOqBB7deY";

  // const [mail, setMail] = useState(localStorage.getItem((("integrationMail"))));
  const [mail, setMail] = useState(
    JSON.parse(localStorage.getItem("integrationMail"))
  );
  const [log, setLog] = useState(localStorage.getItem("loggedIn"));

  const removeEmail = () => {
    const val = localStorage.removeItem("integrationMail");
    setMail(val);
    window.location.reload(true);
  };
  const handlePrimaryAlert = () => {
    setPrimaryAlert(false);
  };
  const handleShowAlert = () => {
    setEnalbledAlert(null);
  };

  useEffect(() => {
    setTimeout(() => {
      setEnalbledAlert(null);
      setPrimaryAlert(false);
    }, 4000);
  }, [enabledAlert, primaryAlert]);

  const toggleHandler = (event) => {
    let newTable = [];
    table.map((data) => {
      if (data.id === event.id) {
        let obj = {
          id: data.id,
          scheduleTitle: data.scheduleTitle,
          enabled: !data.enabled,
          primary: data.primary,
        };
        newTable.push(obj);

        setPrimaryAlert(false);
        setEnalbledAlert(!enabledAlert);
      } else {
        newTable.push(data);
      }
    });
    setTable(newTable);
  };

  const primaryHandler = (event) => {
    let newTable = [];
    table.map((data) => {
      if (data.id === event.id) {
        let obj = {
          id: data.id,
          scheduleTitle: data.scheduleTitle,
          enabled: data.enabled,
          primary: !data.primary,
        };
        newTable.push(obj);

        setPrimaryAlert(true);
      } else {
        newTable.push(data);
      }
    });
    setTable(newTable);
  };

  return (
    <React.Fragment>
      <Table responsive>
        <tr className="justify-content-between">
          <td className="pt-4 border-0">
            <div className="d-flex flex-nowrap align-items-center">
              {log === "microsoft" ? (
                <img height="20" width="20" src={microsoft} alt="google logo" />
              ) : (
                <img height="20" width="20" src={google} alt="google logo" />
              )}
              <img
                className="mx-3 rounded-circle"
                height="45"
                width="45"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4O8-Ud_7lnP6aq-UFoJUP0fhGuVqLaMg-eQ&usqp=CAU"
                alt="Users profile"
              />
              <span className="text-nowrap">{mail}</span>
            </div>
          </td>
          <td className="d-flex justify-content-end ps-4 py-4 border-0">
            <button
              type="submit"
              className="btn btn-sm btn-outline-danger"
              onClick={removeEmail}
            >
              Disconnect
            </button>
          </td>
        </tr>
      </Table>

      {/* <Table responsive>
        {table.map((data) => (
          <>
            <tr key={data.id} className={data.primary ? "bg-table" : ""}>
              <td className="d-flex flex-row align-items-center">
                <span className="d-flex">
                  <Calendar className="mr-2" />
                </span>
                <span className="text-nowrap">{data.scheduleTitle}</span>
                <span className="bg-primary color-show mx-2 d-flex align-items-center"></span>
                {!!data.primary && (
                  <>
                    <span className="badge p-1 rounded-pill border border-primary text-primary bg-light text-nowrap mx-2">
                      Primary Calendar
                    </span>
                    <div className="text-secondary small mx-2 lh-sm">
                      <small className="text-nowrap">Your events will be</small>
                      <small className="text-nowrap">
                        added to this calendar
                      </small>
                    </div>
                  </>
                )}
              </td>
              <td>
                <div className="d-flex flex-row justify-content-end text-nowrap">
                  {!data.primary && (
                    <button
                      className="btn btn-sm btn-outline-primary me-3 border-0"
                      onClick={() => primaryHandler(data)}
                    >
                      Set primary
                    </button>
                  )}
                  <div className="custom-control custom-switch ml-1 my-auto">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={data.id}
                      onClick={() => toggleHandler(data)}
                    />
                    {!!data.enabled ? (
                      <label className="custom-control-label" htmlFor={data.id}>
                        Reading enabled
                      </label>
                    ) : (
                      <label
                        className="custom-control-label text-secondary"
                        htmlFor={data.id}
                      >
                        Reading disabled
                      </label>
                    )}
                  </div>
                </div>
              </td>
            </tr>
            {enabledAlert && (
              <div className="alert-float px-3">
                <div
                  className="d-flex align-items-center justify-content-between alert border-primary bg-white border-4 shadow  fade show alert-float"
                  role="alert"
                >
                  Calendar reading enabled!
                  <button
                    type="button"
                    className="btn btn-close px-0 d-flex align-items-center justify-content-end"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={handleShowAlert}
                  >
                    <XLg />
                  </button>
                </div>
              </div>
            )}
            {enabledAlert === false && (
              <div className="alert-float px-3">
                <div
                  className="d-flex align-items-center justify-content-between alert border-primary bg-white border-4 shadow  fade show alert-float"
                  role="alert"
                >
                  Calendar reading disabled!
                  <button
                    type="button"
                    className="btn btn-close px-0 d-flex align-items-center"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={handleShowAlert}
                  >
                    <XLg />
                  </button>
                </div>
              </div>
            )}
            {primaryAlert && (
              <div class="alert-float-container px-3">
                <div
                  className="d-flex align-items-center justify-content-between alert border-primary bg-white border-4 shadow  fade show alert-float"
                  role="alert"
                >
                  Primary calendar updated!
                  <button
                    type="button"
                    className="btn btn-close px-0 d-flex align-items-center justify-content-end"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={handlePrimaryAlert}
                  >
                    <XLg />
                  </button>
                </div>
              </div>
            )}
          </>
        ))}
      </Table> */}
    </React.Fragment>
  );
}

export default Integrationstable;
