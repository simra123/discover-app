import {
  Row,
  Col,
  Card,
  Input,
  InputGroup,
  Button,
  CardBody,
} from "reactstrap";
import HttpHandler from "../http/CoreHttpHandler";
import { useState, useCallback, useContext } from "react";
import { FormatNumber } from "../components";
import TicTok from "../assets/images/tiktik.png";
import Insta from "../assets/images/insta.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AxiosResponse, AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ImSearch } from "react-icons/im";
import { AuthFunction } from "../components";
import { DefaultChannel } from "../contextHook";

const options = [
  { value: "tiktok", label: "Tiktok", icon: TicTok },
  { value: "instagram", label: "Instagram", icon: Insta },
];

import Select, { components } from "react-select";
const { Option } = components;
const IconOption = (props: any) => (
  <Option {...props}>
    <img src={props.data.icon} style={{ width: 30 }} alt={props.data.label} />
    <small>{props.data.label}</small>
  </Option>
);
type SearchType = {
  type: string;
  user_id: string;
};
type listProps = {
  showButton?: boolean;
  showCard?: boolean;
  setShowCard: (value: boolean) => void;
  dispatch: any;
};
const SearchUsers = ({
  showButton,
  showCard,
  setShowCard,
  dispatch,
}: listProps): JSX.Element => {
  const navigate = useNavigate();

  const { mutate } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    SearchType
  >({
    mutationFn: (data: SearchType) => {
      return HttpHandler.makeRequest("api/profiles", "POST", data);
    },
  });
  const [userProfiles, setUserProfiles] = useState<[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [channel, SetChannel] = useContext(DefaultChannel);

  const getSearch = useCallback(
    debounce((val: any) => {
      const getInput = val.target.value;
      setSearchVal(getInput);
      if (getInput) {
        mutate(
          {
            type: "tiktok",
            user_id: getInput,
          },
          {
            onSuccess: (data: any) => {
              if (data.data?.data?.length) {
                setShowCard(true);
              } else {
                setShowCard(false);
              }
              setUserProfiles(data.data?.data);
            },
            onError: (data: any) => {
              AuthFunction(data);
            },
          },
        );
      } else {
        setShowCard(false);
      }
    }, 300),
    [],
  );

  return (
    <Card className="tictok-list">
      {showCard && (
        <Card className="user-cards text-left">
          {userProfiles?.map((val: any, index: number) => {
            return (
              <CardBody key={`${index}-users`}>
                <Link
                  to={`/dashboard/reports?username=${val?.user_profile?.username}`}
                >
                  <Row>
                    <Col xs="2" className="m-0">
                      <img
                        height={"100%"}
                        className="rounded-circle"
                        width={"50"}
                        src={val?.user_profile?.picture}
                      />
                    </Col>
                    <Col xs="7" className="name">
                      <h6 className="fw-normal">
                        {" "}
                        @{val?.user_profile?.username}
                      </h6>
                      <small className="text-muted ">
                        {" "}
                        {val?.user_profile?.fullname}
                      </small>
                    </Col>
                    <Col xs="3">
                      <p className="text-muted mt-2">
                        {" "}
                        {FormatNumber(val?.user_profile?.followers)}
                      </p>
                    </Col>
                  </Row>
                </Link>
              </CardBody>
            );
          })}
        </Card>
      )}

      <Row className=" justify-content-between">
        <Col md="2">
          <Select
            defaultValue={channel}
            options={options}
            onChange={(e) => {
              SetChannel(e);
              dispatch({
                type: "channel_type",
                payload: e.value,
              });
            }}
            components={{ Option: IconOption }}
          />
        </Col>
        <Col md={showButton ? 8 : 10} className="px-5 searchList ">
          {" "}
          <InputGroup>
            <Button className="bg-light ">
              <ImSearch color="black" size="19" />
            </Button>
            <Input
              onChange={(e) => getSearch(e)}
              placeholder="influencer profile URL, user ID or @handler"
            />
          </InputGroup>
        </Col>
        {showButton && (
          <Col md="2">
            <Button
              disabled={!searchVal}
              onClick={() =>
                navigate(`/dashboard/reports?username=${searchVal}`)
              }
              className="w-100"
              color="primary"
            >
              Profile Insights
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
};
export default SearchUsers;
