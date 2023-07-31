import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// Assets
import "./sidbar.css";
import Kall from "./Kal.png";
import { AiOutlineClose } from "react-icons/ai";

export default function SidebarLogged({ sidebarOpen, toggleSidebar }) {
  const handleLogout = () => {
    localStorage.setItem("_a", false);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <Wrapper
      className="animate"
      style={{ backgroundColor: "#E6E6E6" }}
      sidebarOpen={sidebarOpen}
    >
      <SidebarHeader className="flexSpaceCenter">
        <div className="flexNullCenter">
          <img src={Kall} style={{ width: "60%" }} />
        </div>
        <CloseBtn
          onClick={() => toggleSidebar(!sidebarOpen)}
          className="animate pointer"
        >
          <AiOutlineClose style={{ fontSize: "30px" }} />
        </CloseBtn>
      </SidebarHeader>

      <UlStyle className="flexNullCenter flexColumn">
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px", color: "black" }}
            to="/"
            spy={true}
            smooth={true}
            offset={-60}
          >
            BookingTypes
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px", color: "black" }}
            to="/Bookings"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Bookings
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px", color: "black" }}
            to="/Contacts"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Contacts
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px", color: "black" }}
            to="/Integrations"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Integration
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeClass="active"
            className="whiteColor"
            style={{ padding: "10px 15px", color: "black" }}
            to="/pricing"
            spy={true}
            smooth={true}
            offset={-60}
          >
            Pricing
          </Link>
        </li>
        <li className="semiBold font15 pointer flexCenter">
          <a
            href="/"
            className="radius8 logout-button"
            style={{
              padding: "10px 15px",
              marginLeft: "",
              backgroundColor: "black",
              color: "white",
            }}
            onClick={handleLogout}
          >
            Logout
          </a>
        </li>
      </UlStyle>
      <UlStyle className="flexSpaceCenter"></UlStyle>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  width: 400px;
  height: 100vh;
  position: fixed;
  top: 0;
  padding: 0 50px;
  right: ${(props) => (props.sidebarOpen ? "0px" : "-400px")};
  z-index: 9999;
  @media (max-width: 400px) {
    width: 100%;
  }
`;
const SidebarHeader = styled.div`
  padding: 20px 0;
`;
const CloseBtn = styled.button`
  border: 0px;
  outline: none;
  background-color: transparent;
  padding: 10px;
`;
const UlStyle = styled.ul`
  li {
    margin: 20px 0;
  }
`;
