import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Sidebar from "./Sidebar";
import Backdrop from "../Elements/Backdrop";
import Kallendly from './Kallendly.png';

import BurgerIcon from "../../assets/svg/BurgerIcon";

export default function TopNavbar() {
  const [y, setY] = useState(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState(false);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <Wrapper
        className="flexCenter animate whiteBg top-nav"
        style={y > 100 ? { height: "60px" } : { height: "80px" }}
      >
        <NavInner className="container flexSpaceCenter">
          <Link className="pointer flexNullCenter" to="/" smooth={true}>
          <img  src={Kallendly} style={{width:"50%"}} />
          </Link>
          <BurderWrapper
            className="pointer"
            onClick={() => toggleSidebar(!sidebarOpen)}
          >
            <BurgerIcon />
          </BurderWrapper>
          <UlWrapper className="flexNullCenter"></UlWrapper>
          <UlWrapperRight className="flexNullCenter">
            <li className="semiBold font15 pointer mr-2">
            <Link
                // activeClass="active"
                style={{ padding: "10px 15px" }}
                to="/pricing"
                spy={true}
                smooth={true}
                offset={-80}
              >
                Pricing
              </Link>
              </li>
            <li className="semiBold font15 pointer">
              <Link to="/signup">
                <a style={{ padding: "10px 30px 10px 0" }}>Sign Up</a>
              </Link>
            </li>

            <li className="semiBold font15 pointer ">
              <Link to="/Login">
                <a style={{ padding: "10px 30px 10px 0px" }}>Log in</a>{" "}
              </Link>
            </li>
            
          </UlWrapperRight>
        </NavInner>
      </Wrapper>
    </>
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
  @media (max-width: 760px) {
    display: block;
  }
`;
const UlWrapper = styled.ul`
  display: flex;
  @media (max-width: 760px) {
    display: none;
  }
`;
const UlWrapperRight = styled.ul`
  @media (max-width: 760px) {
    display: none;
  }
`;
