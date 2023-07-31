import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { url } from "../env";
import "./adminStyle.css";

function Users() {
  const [users, setUsers] = useState();

  const fetchAllBookings = async () => {
    try {
      let response = await axios.get(`${url}/api/getUsers`);
      if (!response) {
        throw new Error("could not find response");
      } else {
        setUsers(response.data.data);
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
    fetchAllBookings();
  }, []);

  //   const sendPlanMail=async(id,startDate,EndDate,email)=>{
  //     console.log("==================>userid",id,startDate,EndDate,email);
  //     var a=new Date()
  //     var b = moment([EndDate]);
  // const diff=b.diff(a, 'days')
  //   //  const date=moment(EndDate).subtratct(6,'days');
  // console.log("difference============>",diff);
  //     try {
  //       let response = await axios.post(`${url}/api/planEmail/${id}`,{

  //       });
  //       if (!response) {
  //         throw new Error("could not find response");
  //       } else {
  //         setUsers(response.data.data);
  //         console.log("userData===============>",response)
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         position: "top",
  //         icon: "error",
  //         text: error.message,
  //         color: "black",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //   }

  return (
    <div>
      <Container>
        <Row className="justify-content-between py-5">
          <Col sm className="px-5">
            <h3 className="font-weight-bold px-5">Users</h3>
          </Col>
          <Col sm className="text-right">
            {/* <span>View:</span>
            <select
              name="show"
              className="dropDownIcon border p-2 rounded"
              aria-label="Default select example"
              onChange={handleSelect}
            >
              <option value="Upcoming">Upcoming bookings</option>
              <option value="Past">Past bookings</option>
              <option value="Cancelled">Cancelled bookings</option>
              <option value="All">All bookings</option>
            </select> */}
          </Col>
        </Row>
      </Container>
      <Container className="w-auto">
        <Table responsive>
          <thead>
            <tr>
              <th className="small text-secondary border-0 ps-0">Name</th>
              <th className="small text-secondary border-0 ps-0">Email</th>
              <th className="small text-secondary border-0 ps-0">User Role</th>
              <th className="small text-secondary border-0 ps-0">
                {" "}
                Plan Status
              </th>
              <th className="small text-secondary border-0 ps-0"> Plan Type</th>
              {/* <th className="small text-secondary border-0 ps-0"> Send Email</th> */}
            </tr>
          </thead>
          <tbody>
            {users?.map((data) => (
              <tr className="border-top" key={data._id}>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.name}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.email}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.userRole}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.planStatus}
                </td>
                <td className="py-4 small text-nowrap border-0 pe-4">
                  {data.planType}
                </td>
                {/* <td className="py-4 small text-nowrap border-0 pe-4">
                  <Button variant="primary" onClick={()=>sendPlanMail(data._id,data.planStartDate,
                    data.planEndDate,data.email)}>Send email</Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Users;
