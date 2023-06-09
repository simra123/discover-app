import React, { useState } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { ImSearch } from "react-icons/im";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import { IoOptionsSharp } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import Logo from "../assets/images/influsense.png";
import UserDefault from "../assets/images/default-avatar.png";
import Flag from "../assets/images/flag.png";

const Dashboard: React.FC = () => {
  const year: number = new Date().getFullYear();
  const location = useLocation();
  const pathnameObj = {
    "/dashboard": "Influencer Search",
    "/dashboard/reports": "Reports History",
  };
  return (
    <Container fluid className="dashboard">
      <Row>
        <Col lg="1">
          <div className="sidebar ">
            <Nav vertical>
              <NavbarBrand active href="/dashboard">
                <img src={Logo} alt="logo" height={"auto"} width={90} />
              </NavbarBrand>
              <NavItem>
                <NavLink className="nav-link" to="/dashboard">
                  <ImSearch color="#d0d6dd" size="26" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/">
                  <IoOptionsSharp color="#d0d6dd" size="27" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/dashboard/reports">
                  <HiUsers color="#d0d6dd" size="26" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/">
                  <ImSearch color="#d0d6dd" size="26" />
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Col>
        <Col lg="11">
          <div className="navbar">
            <h4 className="fw-bold">{pathnameObj[location.pathname]}</h4>
            <div className="d-flex">
              <img
                src={Flag}
                height={26}
                className="rounded-circle mx-2"
                alt="Avatar"
              />
              <UncontrolledDropdown>
                <DropdownToggle tag="a">
                  {" "}
                  <img
                    src={UserDefault}
                    height={30}
                    className="rounded-circle"
                    alt="Avatar"
                  />
                </DropdownToggle>
                <DropdownMenu
                  style={{
                    transform: "translate3d(0px, 38.6667px, 0px)",
                    inset: "none",
                    right: 0,
                    top: 48,
                  }}
                >
                  <DropdownItem
                    onClick={() => {
                      localStorage.removeItem("isUserLogged");
                      window.location.reload();
                    }}
                  >
                    Logout
                  </DropdownItem>
                  <DropdownItem>Account Settings</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>

          <div className="mid-content">
            <Outlet />
          </div>

          <footer>
            <small className="text-muted">
              {year} &copy;
              <span className="fw-bold text-dark"> influsense.ai</span>{" "}
            </small>
            <small className="text-muted">Privacy Policy</small>
          </footer>
        </Col>
      </Row>
    </Container>
  );
};
export default Dashboard;
