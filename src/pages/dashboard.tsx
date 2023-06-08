import React, { useState } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  Input,
  InputGroup,
  Button,
  CardBody,
} from "reactstrap";
import { ImSearch } from "react-icons/im";
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import { IoOptionsSharp } from "react-icons/io5";
import HttpHandler from "../http/services/CoreHttpHandler";
import Logo from "../assets/images/influsense.png";
import UserDefault from "../assets/images/default-avatar.png";
import Flag from "../assets/images/flag.png";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";

type SearchType = {
  type: string;
  user_id: string;
};

type Response = {
  success: string;
};

type Error = {
  error: string;
};
const Dashboard: React.FC = () => {
  const { mutate } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    SearchType
  >({
    mutationFn: (data: SearchType) => {
      return HttpHandler.makeRequest("api/profiles", "POST", data);
    },
  });

  const year: number = new Date().getFullYear();

  return (
    <Container fluid className="dashboard">
      <Row>
        <Col lg="1">
          <div className="sidebar ">
            <Nav vertical>
              <NavbarBrand href="/dashboard">
                <img src={Logo} alt="logo" height={"auto"} width={70} />
              </NavbarBrand>
              <NavItem>
                <NavLink href="/dashboard">
                  <ImSearch color="gray" size="22" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">
                  <IoOptionsSharp color="gray" size="25" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">
                  <ImSearch color="gray" size="22" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">
                  <ImSearch color="gray" size="22" />
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Col>
        <Col lg="11">
          <div className="navbar">
            <h4 className="fw-bold">Influencer Search</h4>
            <div className="">
              <img
                src={Flag}
                height={26}
                className="rounded-circle mx-2"
                alt="Avatar"
              />
              <img
                src={UserDefault}
                height={30}
                className="rounded-circle"
                alt="Avatar"
              />
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
