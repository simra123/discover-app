import {
  Row,
  Col,
  Card,
  Input,
  InputGroup,
  Button,
  CardBody,
  FormGroup,
  Label,
} from "reactstrap";
import HttpHandler from "../http/services/CoreHttpHandler";
import {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { FormatNumber } from "../components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AxiosResponse, AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import Select from "react-select";
import { SlArrowDown } from "react-icons/sl";
import SearchUsers from "../components/searchUsers";
import { AuthFunction } from "../components";
import DashboardList from "./dashboardlist";
import { DefaultChannel } from "../contextHook";
import Countries from "../components/allCountries.json";
import { FaCrosshairs } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
const TikTokList = (): JSX.Element => {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [channel, SetChannel] = useContext(DefaultChannel);

  type PayloadTypes = {
    type: string;
    page: number;
    sortby: string;
    filters: {
      engagement_rate: {
        operator: string;
        value: string;
      };
      engagements: {
        left_number: number | null;
        right_number: number | null;
      };
      followers: {
        left_number: number | null;
        right_number: number | null;
      };
      age: {
        left_number: number | null;
        right_number: number | null;
      };
      avg_reels_plays: {
        left_number: number | null;
        right_number: number | null;
      };
      gender: {
        code: string;
      };
      audience_gender: {
        code: string;
        weight: number | null;
      };
      geo: string[];
      audience_geo: any[];
      audience_age: any[];
      text: string;
      last_posted: number | null;
      audience_lang: {};
      keywords: string[] | null;
      lang: {};
      with_contact: string[];
      is_verified: boolean | null;
      is_hidden: boolean | null;
      has_audience_data: boolean | null;
      audience_relevance: {};
      relevance: {};
    };
  };
  type dispatchTypes = {
    type: string;
    payload?: any;
  };

  const initialPayload = {
    type: "tiktok",
    page: 1,
    sortby: "followers",
    filters: {
      engagement_rate: {
        operator: "gte",
        value: "",
      },
      engagements: {
        left_number: null,
        right_number: null,
      },
      followers: {
        left_number: null,
        right_number: null,
      },
      age: {
        left_number: null,
        right_number: null,
      },
      avg_reels_plays: {
        left_number: null,
        right_number: null,
      },
      gender: {
        code: "",
      },
      audience_gender: {
        code: "",
        weight: null,
      },
      geo: [],
      audience_geo: [],
      audience_age: [],
      text: "",
      last_posted: null,
      audience_lang: {},
      keywords: null,
      lang: {},
      with_contact: [],
      is_verified: null,
      is_hidden: null,
      has_audience_data: null,
      audience_relevance: {},
      relevance: {},
    },
  };

  const audienceRadio = [
    {
      name: "Any",
      code: "",
      weight: 0.5,
    },
    {
      name: "Male",
      code: "MALE",
      weight: 0.5,
    },
    {
      name: "Female",
      code: "FEMALE",
      weight: 0.5,
    },
  ];
  const influRadio = [
    {
      name: "Any",
      code: "",
      weight: 0.3,
    },
    {
      name: "Male",
      code: "MALE",
      weight: 0.3,
    },
    {
      name: "Female",
      code: "FEMALE",
      weight: 0.3,
    },
    {
      name: "Male or Female",
      code: "KNOWN",
      weight: 0.3,
    },
    {
      name: "Gender Neutral",
      code: "UNKNOWN",
      weight: 0.3,
    },
  ];

  type GenderTypes = {
    weight: number;
    code: string;
    name: string;
  };
  const [listData, setListData] = useState([]);
  const [totalPages, setTotaPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(2);
  const [recordsPerP, setRecordsPerP] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedInfCountries, setSelectedInfCountries] = useState([]);
  const [isPagination, setIsPagination] = useState(false);
  const [audienceG, setAudienceG] = useState<GenderTypes | null>(null);
  const [influencerG, setInfluencerG] = useState<GenderTypes | null>(null);
  const [prevData, setPrevData] = useState([]);
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState<boolean>(false);

  const rangeFollowers: string[] = [
    "100",
    "200",
    "300",
    "400",
    "500",
    "1k",
    "5k",
    "10k",
    "50k",
    "100k",
    "50k",
    ">1m",
  ];

  const weight: number[] = [
    0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7,
  ];
  const reducer = useCallback((state: PayloadTypes, action: dispatchTypes) => {
    switch (action.type) {
      case "page": {
        return {
          ...state,
          page: action.payload,
        };
      }
      case "audience_geo": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            audience_geo: [...action.payload],
          },
        };
      }
      case "geo": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            geo: action.payload,
          },
        };
      }
      case "audience_gender": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            audience_gender: action.payload,
          },
        };
      }
      case "gender": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            gender: action.payload,
          },
        };
      }
    }
    throw Error("Unknown action: " + action.type);
  }, []);
  const [payloadState, dispatch] = useReducer(reducer, initialPayload);

  const { mutate, isLoading } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    PayloadTypes
  >(
    {
      mutationFn: (data: PayloadTypes) => {
        return HttpHandler.makeRequest("api/profiles_listing", "POST", data);
      },
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  //fetch mutate function
  const getData = useCallback(() => {
    mutate(payloadState, {
      onSuccess: (data: any) => {
        const res = data?.data?.data;
        if (isPagination) {
          setListData([...listData, ...res]);
        } else {
          setListData(res);
        }
        setIsPagination(false);

        setTotaPages(data.data?.totalPages);
        setTotalUsers(data.data?.totalRecords);
        setRecordsPerP(data.data?.recordsPerPage);
      },
      onError: (data: any) => {
        AuthFunction(data);
      },
    });
  }, [channel, payloadState]);
  useEffect(() => {
    getData();
  }, [channel, payloadState]);
  const handlePageNumber = () => {
    setCurrentPage(currentPage + 1);
    setIsPagination(true);
    dispatch({
      type: "page",
      payload: currentPage,
    });
  };

  return (
    <>
      <Card className="tictok-list">
        <SearchUsers
          showCard={showCard}
          setShowCard={setShowCard}
          showButton={false}
        />
        <Row className="search-filters">
          <h5 className="mt-2">Smart Filters</h5>
          <Col className="d-flex ">
            <div className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown ? null : 1);
                }}
                className="ms-1 "
                color="light"
              >
                Location <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 1 && (
                <Card className=" p-2 filter-forms mt-2 text-left position-absolute">
                  <CardBody>
                    <Row>
                      <Col xs="6" className="m-0">
                        <Label>Audience</Label>
                        <Select
                          placeholder="Your Country"
                          // defaultValue={Countries[0]}
                          options={Countries}
                          onChange={(e) => {
                            setSelectedCountries([...selectedCountries, e]);
                            dispatch({
                              type: "audience_geo",
                              payload: [...selectedCountries, e],
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.code}
                        />
                        {selectedCountries?.map((val, i) => {
                          return (
                            <div
                              key={val.value}
                              className="d-flex location-geo"
                            >
                              <AiFillCloseCircle
                                onClick={() => {
                                  const k = selectedCountries.filter(
                                    (c) => val.code !== c.code,
                                  );
                                  setSelectedCountries(k);
                                  dispatch({
                                    type: "audience_geo",
                                    payload: k,
                                  });
                                }}
                                className=" mt-2"
                                size={20}
                              />
                              <span className="m-2 ">
                                {val.name.length > 9
                                  ? val.name.substring(0, 8) + "..."
                                  : val.name}
                              </span>
                              <Input
                                // value={val.weight}
                                type="select"
                                onChange={(e) => {
                                  const k = selectedCountries.filter(
                                    (c) => val.code !== c.code,
                                  );
                                  dispatch({
                                    type: "audience_geo",
                                    payload: [
                                      ...k,
                                      {
                                        ...val,
                                        weight: Number(e.target.value),
                                      },
                                    ],
                                  });
                                }}
                              >
                                <option> {">" + val.weight * 100}%</option>
                                {weight.map((v) => {
                                  return (
                                    <option value={v}>
                                      {" "}
                                      {">" + (v * 100).toFixed(0)}%
                                    </option>
                                  );
                                })}
                              </Input>
                            </div>
                          );
                        })}
                      </Col>
                      <Col xs="6" className="m-0">
                        <Label>Influencer</Label>

                        <Select
                          placeholder="Your Country"
                          // defaultValue={Countries[0]}
                          options={Countries}
                          onChange={(e) => {
                            setSelectedInfCountries([
                              ...selectedInfCountries,
                              e,
                            ]);
                            const countryCodes = [
                              ...selectedInfCountries,
                              e,
                            ].map((country) => country.code);
                            dispatch({
                              type: "geo",
                              payload: countryCodes,
                            });
                          }}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.code}
                        />
                        {selectedInfCountries?.map((val, i) => {
                          return (
                            <div key={val.code} className="d-flex location-geo">
                              <AiFillCloseCircle
                                onClick={() => {
                                  const k = selectedInfCountries.filter(
                                    (c) => val.code !== c.code,
                                  );
                                  setSelectedInfCountries(k);
                                  const countryCodes = k.map(
                                    (country) => country.code,
                                  );
                                  dispatch({
                                    type: "geo",
                                    payload: countryCodes,
                                  });
                                }}
                                className=" mt-2"
                                size={20}
                              />
                              <span className="m-2 ">{val.name}</span>
                            </div>
                          );
                        })}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </div>
            <div className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown ? null : 2);
                }}
                className="ms-1 "
                color="light"
              >
                Gender <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 2 && (
                <Card className=" w-50  filter-forms mt-2 text-left position-absolute">
                  <CardBody>
                    <Row>
                      <Col xs="6" className="m-0">
                        {" "}
                        <FormGroup>
                          <Label>Audience</Label>

                          {audienceRadio.map((val) => {
                            return (
                              <FormGroup key={val.value} check>
                                <Label check>
                                  <Input
                                    onChange={(e) => {
                                      const selectedG = audienceRadio.filter(
                                        (g) => g.code == e.target.value,
                                      );
                                      setAudienceG(...selectedG);
                                      dispatch({
                                        type: "audience_gender",
                                        payload: selectedG[0],
                                      });
                                    }}
                                    defaultChecked={val.code == ""}
                                    value={val.code}
                                    type="radio"
                                    name="audience-gender"
                                  />{" "}
                                  {val.name}
                                </Label>
                              </FormGroup>
                            );
                          })}
                        </FormGroup>
                        <Input
                          // value={val.weight}
                          type="select"
                          className="w-55"
                          onChange={(e) => {
                            dispatch({
                              type: "audience_gender",
                              payload: {
                                code: audienceG?.code,
                                weight: Number(e.target.value),
                              },
                            });
                          }}
                        >
                          <option>{">" + 50}%</option>
                          {weight.map((v) => {
                            return (
                              <option value={v}>
                                {" "}
                                {">" + (v * 100).toFixed(0)}%
                              </option>
                            );
                          })}
                        </Input>
                      </Col>
                      <Col xs="6" className="m-0">
                        <FormGroup>
                          <Label>Influencer</Label>
                          {influRadio.map((val) => {
                            return (
                              <FormGroup key={val.value} check>
                                <Label check>
                                  <Input
                                    onChange={(e) => {
                                      const selectedG = influRadio.filter(
                                        (g) => g.code == e.target.value,
                                      );
                                      setInfluencerG(...selectedG);

                                      dispatch({
                                        type: "gender",
                                        payload: selectedG[0],
                                      });
                                    }}
                                    defaultChecked={val.code == ""}
                                    value={val.code}
                                    type="radio"
                                    name="influ-gender"
                                  />{" "}
                                  {val.name}
                                </Label>
                              </FormGroup>
                            );
                          })}
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </div>
            <div className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown ? null : 3);
                }}
                className="ms-1 "
                color="light"
              >
                Keywords <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 3 && (
                <Card className="  filter-forms mt-2 text-left position-absolute">
                  <CardBody>
                    <FormGroup>
                      <Label>Keywords</Label>
                      <Input placeholder="Keywords" />
                    </FormGroup>
                  </CardBody>
                </Card>
              )}
            </div>
            <div className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown ? null : 4);
                }}
                className="ms-1 "
                color="light"
              >
                followers
                <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 4 && (
                <Card className="  filter-forms mt-2 text-left position-absolute">
                  <CardBody>
                    <Row>
                      <Col xs="6" className="m-0">
                        <Label>Followers</Label>
                        <Input placeholder="from" />
                      </Col>
                      <Col xs="6" style={{ marginTop: "31px" }}>
                        <Input placeholder="to" />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </div>
            <div className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown ? null : 5);
                }}
                className="ms-1 "
                color="light"
              >
                Enagagements
                <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 5 && (
                <Card className="  filter-forms mt-2 text-left position-absolute">
                  <CardBody>
                    <Row>
                      <Label>Audience</Label>
                      <Col xs="6" className="m-0">
                        <Input type="select" name="select" id="exampleSelect">
                          <option>from</option>
                          {rangeFollowers.map((val) => {
                            return <option key={val}>{val}</option>;
                          })}
                        </Input>
                      </Col>
                      <Col xs="6" className="m-0">
                        <Input type="select" name="select" id="exampleSelect">
                          <option>to</option>
                          {rangeFollowers.map((val) => {
                            return <option key={val}>{val}</option>;
                          })}
                        </Input>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Card>
      <DashboardList
        handlePageNumber={handlePageNumber}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        isLoading={isLoading}
        listData={listData}
        recordPerPage={recordsPerP}
      />
    </>
  );
};
export default TikTokList;
