import React, { useEffect, useState } from "react";
import { Container, Table, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import "./contact.css";
import Swal from "sweetalert2";
import { url } from "../env.js";

function Contacts() {
  const [tableData, setTableData] = useState();
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let USER_ID = localStorage.getItem("userId");
    setLoading(true);
    const fetchBookingsData = async () => {
      try {
        let response = await axios.post(`${url}/api/getBookingsByUserId`, {
          userId: USER_ID,
        });
        if (!response) {
          throw new Error("no response found");
        } else {
          setLoading(false);
          setTableData(response.data);
        }
      } catch (error) {
        setLoading(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Network error",
          showCancelButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
      }
    };
    fetchBookingsData();
  }, []);

  let contacts = [];
  if (filteredData !== null) {
    contacts = tableData?.data.filter(
      (data) =>
        data.addAttendees[0].name.includes(filteredData) ||
        data.addAttendees[0].email.includes(filteredData)
    );
  } else {
    contacts = tableData?.data;
  }

  return (
    <React.Fragment>
      <Container>
        <Row className="display d-flex align-items-center justify-content-between pt-5">
          <h1 className="contact h3 fw-bold  d-inline  pb-3 pl-3">Contacts</h1>
          <form className="search pb-5 p-3 mb-3 bg-white text-dark">
            <span className=" ">
              <input
                id="search"
                className="contact-input"
                type="text"
                name="search"
                placeholder="Search"
                onChange={(e) => setFilteredData(e.target.value)}
              />
            </span>
          </form>
        </Row>
      </Container>
      <Container
        style={{
          height: "550px",
          overflow: "auto",
        }}
      >
        <Table responsive>
          <thead>
            <tr>
              <th className="small fw-normal text-secondary border-0 border-bottom border-1 ps-0 ">
                Contact
              </th>
              <th className="small fw-normal text-secondary border-0 border-bottom border-1 ps-0">
                Bookings
              </th>
              <th className="small fw-normal text-secondary border-0 border-bottom border-1 ps-0">
                Created
              </th>
            </tr>
          </thead>
          <tbody className=" border border-botton-1 border-left-0 border-right-0">
            {contacts?.length == 0 && !loading && " No record found ! "}

            {contacts?.map((data) => (
              <tr key={data?._id}>
                <td className="pt-3 pb-3">
                  {data.addAttendees.map((data) => (
                    <>
                      <p>
                        <strong> Name: </strong>
                        {data.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {data?.email}
                      </p>
                    </>
                  ))}
                </td>
                <td className="pt-3 pb-3 h5 text-primary">1</td>
                <td className="pt-3 pb-3">
                  {moment(data?.createdAt).format("ddd MMMM D, YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {loading && (
          <div className="d-flex justify-content-center ">
            <Spinner animation="border" role="status"></Spinner>
          </div>
        )}
      </Container>
    </React.Fragment>
  );
}

export default Contacts;
