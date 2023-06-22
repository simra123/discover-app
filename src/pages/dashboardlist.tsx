import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Input, FormGroup, Label } from "reactstrap";
import { FormatNumber, AuthFunction, LoadingButton } from "../components";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import HttpHandler from "../http/services/CoreHttpHandler";
import { Link } from "react-router-dom";
import { AiOutlineLineChart } from "react-icons/ai";
import { SlArrowDown } from "react-icons/sl";
import { DefaultChannel } from "../contextHook";
import { useNavigate } from "react-router-dom";
interface DashboardProps {
  totalUsers: number;
  listData: any[];
  totalPages: number;
  currentPage: number;
  sortBy?: string;
  handlePageNumber?: (value: void) => void;
  isLoading?: boolean;
  recordPerPage?: number;
  dispatch: any;
}

const DashBoard: React.FC<DashboardProps> = ({
  totalUsers,
  listData,
  totalPages,
  currentPage,
  sortBy,
  handlePageNumber,
  isLoading,
  recordPerPage,
  dispatch,
}) => {
  const [channel] = useContext(DefaultChannel);

  const navigate = useNavigate();

  return (
    <div className="dashboard_table">
      <FormGroup className="d-flex">
        <Label className="my-2 mx-2">sort by</Label>
        <Input
          onChange={(e) =>
            dispatch({
              type: "sortby",
              payload: e.target.value,
            })
          }
          className=" w-auto"
          name="select"
          type="select"
        >
          <option value={"followers"}>Followers</option>
          <option value={"engagements"}>Engagemnets</option>
        </Input>
      </FormGroup>

      <Table responsive>
        <thead>
          <tr>
            <th>{totalUsers} INFLUENCERS FOUND</th>
            <th> FOLLOWERS</th>
            <th>ENGAGEMENTS</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {listData?.map((val) => {
            return (
              <tr key={val?.user_profile.url}>
                <td>
                  <div className="d-flex">
                    <img
                      height={48}
                      loading={"lazy"}
                      className="rounded-circle"
                      width={"auto"}
                      src={val?.user_profile.picture}
                    />{" "}
                    <span>
                      <h6 className="fw-normal my-2 mx-3">
                        {" "}
                        <Link to={val?.user_profile.url} target="_blank">
                          {val?.user_profile.username}{" "}
                        </Link>
                      </h6>
                      <small className="text-muted  fw-light mx-3">
                        {" "}
                        {val?.user_profile.fullname}
                      </small>
                    </span>
                  </div>
                </td>
                <td className="pt-4">
                  {FormatNumber(val?.user_profile.followers)}
                </td>
                <td className="pt-4">
                  {FormatNumber(val?.user_profile.engagements)}
                </td>
                <td className="pt-3 text-end">
                  <Button
                    color="primary"
                    onClick={() => {
                      navigate(
                        `reports?username=${val?.user_profile.username}`,
                      );
                    }}
                  >
                    {" "}
                    <AiOutlineLineChart size={22} /> PROFILE INSIGHT
                  </Button>
                  <Button className="mx-3 " color="light">
                    ADD TO LIST <SlArrowDown size={11} className="mx-1" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <LoadingButton
        onClick={() => handlePageNumber()}
        color="primary"
        disabled={totalPages < currentPage}
        className="m-auto d-block"
        text={`Unlock next ${recordPerPage} results`}
        loading={isLoading}
      />
    </div>
  );
};

export default DashBoard;
