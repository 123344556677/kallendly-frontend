import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import { url } from "../env";
import "./adminStyle.css";

function Razorpay() {
  const [razorpay, setRazorpay] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/api/getAllRazorpay`);
      if (!response) {
        throw new Error("Could find response");
      } else {
        setRazorpay(response.data.data);
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.message,
        color: "black",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Container>
        <Row className="justify-content-between p-5">
          <Col sm className="px-5">
            <h3 className="font-weight-bold">Payments</h3>
          </Col>
          <Col sm className="text-right"></Col>
        </Row>
      </Container>
      <Container className="w-auto">
        <Table responsive>
          <thead>
            <tr>
              <th className="small text-secondary border-0 ps-0">User</th>
              <th className="small text-secondary border-0 ps-0">Order-ID</th>
              <th className="small text-secondary border-0 ps-0">
                Amount Paid
              </th>
              <th className="small text-secondary border-0 ps-0">
                Payment Method
              </th>
              <th className="small text-secondary border-0 ps-0">Plan Type</th>
            </tr>
          </thead>
          <tbody>
            {razorpay?.map((data) => (
              <tr className="border-top" key={data._id}>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.name}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.orderId}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.amountPaid}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.method}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.planType}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Razorpay;
