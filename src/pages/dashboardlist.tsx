import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import { FormatNumber, AuthFunction, LoadingButton } from "../components";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import HttpHandler from "../http/services/CoreHttpHandler";
import { Link } from "react-router-dom";
import { AiOutlineLineChart } from "react-icons/ai";
import { SlArrowDown } from "react-icons/sl";

interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: { id: number; weight: number; code: string; name: string }[];
  showFlag: boolean;
  title: string;
  followers: number;
}

type listBody = {
  page: number;
  type: string;
  sortby: string;
};
interface listDataType {
  type: string;
  page: 2;
  sortby: string;
  filters: [];
}
const DashBoard: React.FC<ModalProps> = ({}) => {
  const [listData, setListData] = useState([]);
  const [totalPages, setTotaPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(2);
  const { mutate, isLoading } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    listBody
  >(
    {
      mutationFn: (data: listBody) => {
        return HttpHandler.makeRequest("api/profiles_listing", "POST", data);
      },
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  useEffect(() => {
    mutate(
      {
        type: "tiktok",
        page: 1,
        sortby: "followers",
      },
      {
        onSuccess: (data: any) => {
          console.log(data.data);
          setListData(data.data.data);
          setTotaPages(data.data?.totalPages);
          setTotalUsers(data.data?.totalRecords);
        },
        onError: (data: any) => {
          AuthFunction(data);
        },
      },
    );
  }, []);
  const handlePageNumber = () => {
    setCurrentPage(currentPage + 1);
    console.log(currentPage);
    mutate(
      {
        type: "tiktok",
        page: currentPage,
        sortby: "followers",
      },
      {
        onSuccess: (data: any) => {
          const res: any[] = data.data?.data;
          // console.log(...res);
          setListData([...listData, ...res]);
        },
        onError: (data: any) => {
          AuthFunction(data);
        },
      },
    );
  };
  return (
    <div className="dashboard_table">
      <Table>
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
                  <Button color="primary">
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
        text="Unlock next 10 results"
        loading={isLoading}
      />
    </div>
  );
};

export default DashBoard;
