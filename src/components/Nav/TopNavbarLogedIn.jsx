import React, { useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import "./top.css";
import SidebarLogged from "./SidebarLoggedIn";
import Backdrop from "../Elements/Backdrop";
import Kallendly from "./Kallendly.png";

import BurgerIcon from "../../assets/svg/BurgerIcon";

export default function TopNavbarLoggedIn() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);

  const history = useHistory();

  const handleLogout = () => {
    localStorage.setItem("_a", false);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  };

  return (
    <React.Fragment>
      <SidebarLogged sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper
        className="flexCenter animate whiteBg top-nav"
        style={y > 100 ? { height: "60px" } : { height: "80px" }}
      >
        <NavInner className="container flexSpaceCenter">
          <Link className="overflow-none" to="/" smooth={true}>
            <img src={Kallendly} style={{ width: "50%", height: "50%" }} />
          </Link>
          <BurderWrapper
            className="pointer"
            onClick={() => toggleSidebar(!sidebarOpen)}
          >
            <BurgerIcon />
          </BurderWrapper>

          <UlWrapper
            className="flexNullCenter"
            style={{ position: "absolute", marginLeft: "25%" }}
          >
            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                to="/"
                spy={true}
                smooth={true}
                offset={-80}
              >
                Booking Types
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                to="/Bookings"
                spy={true}
                smooth={true}
                offset={-80}
              >
                Bookings
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                to="/Contacts"
                spy={true}
                smooth={true}
                offset={-80}
              >
                Contacts
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                to="/Integrations"
                spy={true}
                smooth={true}
                offset={-80}
              >
                Integrations
              </Link>
            </li>
            <li className="semiBold font15 pointer">
              <Link
                activeClass="active"
                style={{ padding: "10px 15px" }}
                to="/pricing"
                spy={true}
                smooth={true}
                offset={-80}
              >
                Pricing
              </Link>
            </li>
          </UlWrapper>
          <UlWrapperRight className="flexNullCenter">
            <li className="semiBold font15 pointer">
              <Link to="/Profile">
                <a style={{ padding: "10px 30px 10px 0" }}>Profile</a>{" "}
              </Link>
            </li>
            <li className="semiBold font15 pointer flexCenter ml-4">
              <a
                onClick={handleLogout}
                className="radius8 lightBg"
                style={{ padding: "10px 15px" }}
              >
                log out
              </a>
            </li>
          </UlWrapperRight>
        </NavInner>
      </Wrapper>
    </React.Fragment>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;
const NavInner = styled.div`
  position: relative;
  height: 100%;
`;
const BurderWrapper = styled.button`
  outline: none;
  border: 0px;
  background-color: transparent;
  height: 100%;
  padding: 0 15px;
  display: none;
  @media (max-width: 900px) {
    display: block;
  }
`;
const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 900px) {
    display: none;
  }
`;
const UlWrapperRight = styled.ul`
  @media (max-width: 900px) {
    display: none;
  }
`;
