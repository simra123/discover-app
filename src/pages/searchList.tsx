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
  Badge,
} from "reactstrap";
import HttpHandler from "../http/CoreHttpHandler";
import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";
import { FormatNumber } from "../components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import Select from "react-select";
import { SlArrowDown } from "react-icons/sl";
import { ImSearch } from "react-icons/im";
import SearchUsers from "../components/searchUsers";
import { AuthFunction } from "../components";
import DashboardList from "./dashboardlist";
import { DefaultChannel } from "../contextHook";
import Countries from "../content/allCountries.json";
import Contacts from "../content/contacts.json";
import Age from "../content/ages.json";
import Languages from "../content/languages.json";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { debounce } from "lodash";
import { GrFormClose } from "react-icons/gr";
const TikTokList = (): JSX.Element => {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const [channel] = useContext(DefaultChannel);

  type PayloadTypes = {
    type: string;
    page: number;
    sortby: string;
    filters: {
      engagement_rate: {
        operator: string;
        value: number | null;
      };
      engagements: {
        left_number: number | null;
        right_number: number | null;
      };
      followers: {
        left_number: number | null;
        right_number: number | null;
      };
      followers_growth: {};
      age: {
        left_number: number | null;
        right_number: number | null;
      };
      avg_reels_plays: {
        left_number: number | null;
        right_number: number | null;
      };
      avg_views: {
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
      keywords: string;
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
    type: channel.value,
    page: 1,
    sortby: "followers",
    filters: {
      engagement_rate: {
        operator: "gte",
        value: null,
      },
      engagements: {
        left_number: null,
        right_number: null,
      },
      followers: {
        left_number: null,
        right_number: null,
      },
      followers_growth: {},
      age: {
        left_number: null,
        right_number: null,
      },
      avg_reels_plays: {
        left_number: null,
        right_number: null,
      },
      avg_views: {
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
      keywords: "",
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
  const influPost = [
    {
      name: "Any",
      value: "",
    },
    {
      name: "1 month",
      value: 30,
    },
    {
      name: "3 months",
      value: 3 * 30,
    },
    {
      name: "6 months",
      value: 6 * 30,
    },
  ];
  const growthMonths = [
    {
      interval: 30,
      operator: "gte",
      value: "0.05",
      name: "1 months",
    },
    {
      interval: 30 * 2,
      operator: "gte",
      value: "0.05",
      name: "2 months",
    },
    {
      interval: 30 * 3,
      operator: "gte",
      value: "0.05",
      name: "3 months",
    },
    {
      interval: 3 * 4,
      operator: "gte",
      value: "0.05",
      name: "4 months",
    },
    {
      interval: 30 * 5,
      operator: "gte",
      value: "0.05",
      name: "5 months",
    },
    {
      interval: 30 * 6,
      operator: "gte",
      value: "0.05",
      name: "6 months",
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
  type rangeTypes = {
    left_number: number | null;
    right_number: number | null;
  };
  const [listData, setListData] = useState([]);
  const [totalPages, setTotaPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(2);
  const [recordsPerP, setRecordsPerP] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedInfCountries, setSelectedInfCountries] = useState([]);
  const [selectedInfContacts, setSelectedInfContacts] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedInfLanguages, setSelectedInfLanguages] = useState([]);
  const [selectedAudUsers, setSelectedAudUsers] = useState<string>("");
  const [selectedContentUsers, setSelectedContentUsers] = useState<string[]>(
    [],
  );
  const [selectedGrowth, setSelectedGrowth] = useState({});
  const [relevanceString, setRelevanceString] = useState({
    value: [],
  });
  const [audRelevanceString, setAudRelevanceString] = useState<string>("");
  const [hashtagsDropdown, setHashtagsDropdown] = useState<boolean>(false);
  const [searchHashtagValue, setsearchHashtagValue] = useState<string>("");
  const [lookalikeType, setLookalikeType] = useState<string>("");
  const [searchAudValue, setSearchAudValue] = useState<string>("");
  const [searchContentValue, setSearchContentValue] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [selectedAudAges, setSelectedAudAges] = useState([]);
  const [isPagination, setIsPagination] = useState(false);
  const [audienceG, setAudienceG] = useState<GenderTypes | null>(null);
  const [influencerG, setInfluencerG] = useState<GenderTypes | null>(null);
  const [prevData, setPrevData] = useState([]);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [hashTagsData, setHashTagsData] = useState<[]>([]);
  const [hasAudData, setHasAudData] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [lastPost, setlastPost] = useState<number | null>(null);
  const [userProfiles, setUserProfiles] = useState<[]>([]);

  const [followersRange, setFollowersRange] = useState<rangeTypes>({
    left_number: null,
    right_number: null,
  });
  const [enagagementsRange, setEnagagementsRange] = useState<rangeTypes>({
    left_number: null,
    right_number: null,
  });
  const [viewsRange, setViewsRange] = useState<rangeTypes>({
    left_number: null,
    right_number: null,
  });
  const [ageInflu, setAgeInflu] = useState<rangeTypes>({
    left_number: null,
    right_number: null,
  });
  const [engageRate, setEngageRate] = useState<number | null>(null);

  const rangeFollowers: number[] = [
    100, 200, 300, 400, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000,
  ];

  const weight: number[] = [
    0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7,
  ];
  const weightAge: number[] = [
    0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
  ];
  const engageRateArray: number[] = [
    0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13,
    0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2,
  ];
  const reducer = useCallback((state: PayloadTypes, action: dispatchTypes) => {
    switch (action.type) {
      case "channel_type": {
        setCurrentPage(2);
        return {
          ...state,
          type: action.payload,
          page: 1,
        };
      }
      case "sortby": {
        setCurrentPage(2);
        return {
          ...state,
          sortby: action.payload,
          page: 1,
        };
      }
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
      case "keywords": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            keywords: action.payload,
          },
        };
      }
      case "followers-range": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            followers: action.payload,
          },
        };
      }
      case "engagements": {
        setCurrentPage(2);

        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            engagements: action.payload,
          },
        };
      }
      case "engagement_rate": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            engagement_rate: {
              operator: "gte",
              value: action.payload,
            },
          },
        };
      }
      case "bio": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            text: action.payload,
          },
        };
      }
      case "avg_views": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            avg_views: action.payload,
          },
        };
      }
      case "contacts": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            with_contact: action.payload,
          },
        };
      }
      case "contacts": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            with_contact: action.payload,
          },
        };
      }
      case "relevance": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            relevance: action.payload,
          },
        };
      }
      case "audience_lang": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            audience_lang: action.payload,
          },
        };
      }
      case "lang": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            lang: action.payload,
          },
        };
      }
      case "audience_age": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            audience_age: action.payload,
          },
        };
      }
      case "age": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            age: action.payload,
          },
        };
      }
      case "last_post": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            last_posted: action.payload,
          },
        };
      }
      case "followers_growth": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            followers_growth: action.payload,
          },
        };
      }
      case "is_verified": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            is_verified: action.payload,
          },
        };
      }
      case "has_audience_data": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            has_audience_data: action.payload,
          },
        };
      }
      case "audience_relevance": {
        setCurrentPage(2);
        return {
          ...state,
          page: 1,
          filters: {
            ...state.filters,
            audience_relevance: {
              value: action.payload,
            },
          },
        };
      }
    }

    throw Error("Unknown action: " + action.type);
  }, []);

  const [payloadState, dispatch] = useReducer(reducer, initialPayload);
  const cardRefs = useRef(
    Array(15)
      .fill(null)
      .map(() => React.createRef<HTMLDivElement | []>()),
  );
  const { mutate, isLoading } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    PayloadTypes
  >(
    {
      mutationFn: ({ data, cancel }) => {
        return HttpHandler.makeRequest(
          "api/profiles_listing",
          "POST",
          data,
          cancel,
        );
      },
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const getHashTags = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    {
      q: string;
      type: string;
    }
  >({
    mutationFn: (data: { q: string; type: string }) => {
      return HttpHandler.makeRequest("api/topic-tags", "POST", data);
    },
  });
  const profiles = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    {
      type: string;
      q: string;
      limit: number;
      key: string;
      cancel: any;
    }
  >({
    mutationFn: (data: {
      type: string;
      q: string;
      limit: number;
      key: string;
      cancel: any;
    }) => {
      return HttpHandler.makeRequest(
        "api/search-audience",
        "POST",
        data,
        data.cancel,
      );
    },
  });
  const getSearchedTags = useCallback(
    debounce((val: any) => {
      const getInput = val.target.value;

      if (getInput) {
        getHashTags.mutate(
          {
            type: channel.value,
            q: getInput,
          },
          {
            onSuccess: (data: any) => {
              if (data?.data?.data) {
                setHashTagsData(data?.data?.data);
                setHashtagsDropdown(true);
              }
            },
            onError: (data: any) => {
              AuthFunction(data);
            },
          },
        );
      }
    }, 300),
    [],
  );
  const getSearchProfiles = useCallback(
    debounce((val: any, key: string) => {
      const getInput: string = val.target.value;
      const CancelToken = axios.CancelToken;
      let source = CancelToken.source();

      source && source.cancel("Operation canceled due to new request.");

      // save the new request for cancellation
      source = axios.CancelToken.source();
      if (getInput) {
        profiles.mutate(
          {
            type: "tiktok",
            q: getInput,
            key: key,
            limit: 3,
            cancel: source.token,
          },
          {
            onSuccess: (data: any) => {
              setUserProfiles(data.data?.data);
            },
            onError: (data: any) => {
              AuthFunction(data);
            },
          },
        );
      }
    }, 100),
    [],
  );

  //fetch mutate function
  const getData = useCallback(() => {
    const CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    source && source.cancel("Operation canceled due to new request.");

    // save the new request for cancellation
    source = axios.CancelToken.source();

    mutate(
      { data: payloadState, cancel: source.token },
      {
        onSuccess: (data: any) => {
          console.log("wait im fetching data!");
          const res = data?.data?.data;
          console.log(res);
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

          if (axios.isCancel(data)) {
            console.log("test cancellation", axios.isCancel(data));
          }
        },
      },
    );
  }, [payloadState]);
  useEffect(() => {
    // const cancelToken = axios.CancelToken.source();

    getData();
  }, [payloadState]);
  useEffect(() => {
    const closeFilterCard = (e: any) => {
      if (
        !cardRefs.current[0]?.current?.contains(e.target) &&
        !cardRefs.current[1]?.current?.contains(e.target) &&
        !cardRefs.current[2]?.current?.contains(e.target) &&
        !cardRefs.current[3]?.current?.contains(e.target) &&
        !cardRefs.current[4]?.current?.contains(e.target) &&
        !cardRefs.current[5]?.current?.contains(e.target) &&
        !cardRefs.current[6]?.current?.contains(e.target) &&
        !cardRefs.current[7]?.current?.contains(e.target) &&
        !cardRefs.current[8]?.current?.contains(e.target) &&
        !cardRefs.current[9]?.current?.contains(e.target) &&
        !cardRefs.current[10]?.current?.contains(e.target) &&
        !cardRefs.current[11]?.current?.contains(e.target) &&
        !cardRefs.current[12]?.current?.contains(e.target) &&
        !cardRefs.current[13]?.current?.contains(e.target) &&
        !cardRefs.current[14]?.current?.contains(e.target)
      ) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("click", closeFilterCard, true);
    return () => {
      document.removeEventListener("click", closeFilterCard, true);
    };
  }, []);
  const handlePageNumber = () => {
    setCurrentPage(currentPage + 1);
    setIsPagination(true);
    dispatch({
      type: "page",
      payload: currentPage,
    });
  };
  console.log(selectedAudAges, "aud");

  return (
    <>
      <Card className="tictok-list">
        <SearchUsers
          showCard={showCard}
          setShowCard={setShowCard}
          showButton={false}
          dispatch={dispatch}
        />
        <Row className="search-filters">
          <h5 className="mt-2">Smart Filters</h5>
          <Col className="d-flex ">
            <div className="positive-relative" ref={cardRefs.current[0]}>
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown == 1 ? null : 1);
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
                                defaultValue={val.weight}
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
                                {/* <option> {">" + val.weight * 100}%</option> */}
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
            <div ref={cardRefs.current[1]} className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown == 2 ? null : 2);
                }}
                className="ms-1 "
                color="light"
              >
                Gender <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 2 && (
                <Card
                  // ref={cardRefs.current}
                  className=" w-50 filter-forms mt-2 text-left position-absolute"
                >
                  <CardBody>
                    <Row>
                      <Col xs="6" className="m-0">
                        {" "}
                        <FormGroup>
                          <Label>Audience</Label>

                          {audienceRadio.map((val) => {
                            return (
                              <FormGroup key={val.code} check>
                                <Label check for={val.code}>
                                  <Input
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        const selectedG = audienceRadio.filter(
                                          (g) => g.code == e.target.value,
                                        );
                                        setAudienceG(...selectedG);
                                        dispatch({
                                          type: "audience_gender",
                                          payload: selectedG[0],
                                        });
                                      } else {
                                        setAudienceG(null);
                                        dispatch({
                                          type: "audience_gender",
                                          payload: {},
                                        });
                                      }
                                    }}
                                    defaultChecked={
                                      audienceG
                                        ? audienceG?.code == val.code
                                        : val.code == ""
                                    }
                                    value={val.code}
                                    type="radio"
                                    name="audience-gender"
                                    id={val.code}
                                  />{" "}
                                  {val.name}
                                </Label>
                              </FormGroup>
                            );
                          })}
                        </FormGroup>
                        {audienceG?.weight && (
                          <Input
                            defaultValue={audienceG.weight}
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
                              setAudienceG({
                                code: audienceG?.code,
                                name: audienceG?.name,
                                weight: Number(e.target.value),
                              });
                            }}
                          >
                            {/* <option>{">" + 50}%</option> */}
                            {weight.map((v) => {
                              return (
                                <option value={v}>
                                  {" "}
                                  {">" + (v * 100).toFixed(0)}%
                                </option>
                              );
                            })}
                          </Input>
                        )}
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
                                      if (e.target.value) {
                                        const selectedG = influRadio.filter(
                                          (g) => g.code == e.target.value,
                                        );
                                        setInfluencerG(selectedG[0]);
                                        dispatch({
                                          type: "gender",
                                          payload: selectedG[0],
                                        });
                                      } else {
                                        setInfluencerG(null);
                                        dispatch({
                                          type: "gender",
                                          payload: {},
                                        });
                                      }
                                    }}
                                    defaultChecked={
                                      influencerG
                                        ? influencerG?.code == val.code
                                        : val.code == ""
                                    }
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
            <div ref={cardRefs.current[2]} className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown == 3 ? null : 3);
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
                      <Input
                        placeholder="Keywords"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            dispatch({
                              type: "keywords",
                              payload: keywords,
                            });
                            setKeywords(e.target.value);
                          }
                        }}
                      />
                    </FormGroup>
                  </CardBody>
                </Card>
              )}
            </div>
            <div ref={cardRefs.current[3]} className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown == 4 ? null : 4);
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
                        <Input
                          type="number"
                          value={
                            followersRange?.left_number
                              ? followersRange.left_number
                              : null
                          }
                          onChange={(e) => {
                            setFollowersRange({
                              ...followersRange,
                              left_number: Number(e.target.value),
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              dispatch({
                                type: "followers-range",
                                payload: {
                                  ...followersRange,
                                  left_number: Number(e.target.value),
                                },
                              });
                            }
                          }}
                          placeholder="from"
                        />
                      </Col>
                      <Col xs="6" style={{ marginTop: "31px" }}>
                        <Input
                          type="number"
                          placeholder="to"
                          value={
                            followersRange?.right_number
                              ? followersRange.right_number
                              : null
                          }
                          onChange={(e) =>
                            setFollowersRange({
                              ...followersRange,
                              right_number: Number(e.target.value),
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              dispatch({
                                type: "followers-range",
                                payload: {
                                  ...followersRange,
                                  right_number: Number(e.target.value),
                                },
                              });
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </div>
            <div ref={cardRefs.current[4]} className="positive-relative">
              <Button
                onClick={() => {
                  setShowDropdown(showDropdown == 5 ? null : 5);
                }}
                className="ms-1 "
                color="light"
              >
                Enagagements
                <SlArrowDown size={11} className="mx-1" />
              </Button>
              {showDropdown == 5 && (
                <Card className="  w-25 filter-forms mt-2 text-left position-absolute">
                  <CardBody>
                    <Row>
                      <Label>Audience</Label>
                      <Col xs="6" className="m-0">
                        <Input
                          type="select"
                          className="w-100"
                          name="select"
                          value={enagagementsRange?.left_number}
                          onChange={(e) => {
                            setEnagagementsRange({
                              ...enagagementsRange,
                              left_number: Number(e.target.value),
                            });
                            dispatch({
                              type: "engagements",
                              payload: {
                                ...enagagementsRange,
                                left_number: Number(e.target.value),
                              },
                            });
                          }}
                        >
                          <option>from</option>
                          {rangeFollowers.map((val) => {
                            return (
                              <option value={val} key={val}>
                                {" "}
                                {val === 1000000
                                  ? ">" + FormatNumber(val)
                                  : FormatNumber(val)}
                              </option>
                            );
                          })}
                        </Input>
                      </Col>
                      <Col xs="6" className="m-0">
                        <Input
                          type="select"
                          className="w-100"
                          name="select"
                          value={enagagementsRange.right_number}
                          onChange={(e) => {
                            setEnagagementsRange({
                              ...enagagementsRange,
                              right_number: Number(e.target.value),
                            });
                            dispatch({
                              type: "engagements",
                              payload: {
                                ...enagagementsRange,
                                right_number: Number(e.target.value),
                              },
                            });
                          }}
                        >
                          <option>to</option>
                          {rangeFollowers.map((val) => {
                            return (
                              <option value={val} key={val}>
                                {" "}
                                {val === 1000000
                                  ? ">" + FormatNumber(val)
                                  : FormatNumber(val)}
                              </option>
                            );
                          })}
                        </Input>
                      </Col>
                      <Col xs="12" className="m-0">
                        <FormGroup>
                          <Label>Engagement Rate</Label>
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            onChange={(e) => {
                              setEngageRate(Number(e.target.value));

                              dispatch({
                                type: "engagement_rate",
                                payload: Number(e.target.value),
                              });
                            }}
                          >
                            <option>from</option>
                            {engageRateArray.map((v) => {
                              return (
                                <option value={v} key={v}>
                                  {" "}
                                  &#8805;{(v * 100).toFixed(0)}%
                                </option>
                              );
                            })}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              )}
            </div>
          </Col>
        </Row>
        <Row className="search-filters mb-3">
          <h5 className="mt-3">
            Advance Filters{" "}
            {showFilters ? (
              <AiOutlineMinus
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
                className="cursor-pointer"
                size={18}
              />
            ) : (
              <AiOutlinePlus
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
                className="cursor-pointer"
                size={18}
              />
            )}
          </h5>
          {showFilters && (
            <Col className="d-flex ">
              <div ref={cardRefs.current[5]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 6 ? null : 6);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Bio <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 6 && (
                  <Card className="  filter-forms mt-2 text-left position-absolute">
                    <CardBody>
                      <FormGroup>
                        <Label>Bio</Label>
                        <Input
                          placeholder="Keywords"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              dispatch({
                                type: "bio",
                                payload: e.target.value,
                              });
                              setBio(e.target.value);
                            }
                          }}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                )}
              </div>
              <div ref={cardRefs.current[6]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 7 ? null : 7);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Views
                  <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 7 && (
                  <Card
                    // ref={cardRefs.current}
                    className=" w-25 filter-forms mt-2 text-left position-absolute"
                  >
                    <CardBody>
                      <Row>
                        <Label>Influencers</Label>
                        <Col xs="6" className="m-0">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            onChange={(e) => {
                              setViewsRange({
                                ...viewsRange,
                                left_number: Number(e.target.value),
                              });
                              dispatch({
                                type: "avg_views",
                                payload: {
                                  ...viewsRange,
                                  right_number: Number(e.target.value),
                                },
                              });
                            }}
                          >
                            <option>from</option>
                            {rangeFollowers.map((val) => {
                              return (
                                <option value={val} key={val}>
                                  {" "}
                                  {val === 1000000
                                    ? ">" + FormatNumber(val)
                                    : FormatNumber(val)}
                                </option>
                              );
                            })}
                          </Input>
                        </Col>
                        <Col xs="6" className="m-0">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            onChange={(e) => {
                              setViewsRange({
                                ...viewsRange,
                                right_number: Number(e.target.value),
                              });
                              dispatch({
                                type: "avg_views",
                                payload: {
                                  ...viewsRange,
                                  right_number: Number(e.target.value),
                                },
                              });
                            }}
                          >
                            <option>to</option>
                            {rangeFollowers.map((val) => {
                              return (
                                <option value={val} key={val}>
                                  {" "}
                                  {val === 1000000
                                    ? ">" + FormatNumber(val)
                                    : FormatNumber(val)}
                                </option>
                              );
                            })}
                          </Input>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                )}
              </div>
              <div ref={cardRefs.current[7]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 8 ? null : 8);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Contacts <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 8 && (
                  <Card className="  filter-forms mt-2 text-left position-absolute">
                    <CardBody>
                      <Label>Influencer</Label>

                      <Select
                        placeholder="add Contacts"
                        // defaultValue={Countries[0]}
                        options={Contacts}
                        onChange={(e) => {
                          setSelectedInfContacts([...selectedInfContacts, e]);

                          dispatch({
                            type: "contacts",
                            payload: [...selectedInfContacts, e],
                          });
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.type}
                      />
                      {selectedInfContacts?.map((val, i) => {
                        return (
                          <div key={val.type} className="d-flex location-geo">
                            <AiFillCloseCircle
                              onClick={() => {
                                const k = selectedInfContacts.filter(
                                  (c) => val.type !== c.type,
                                );
                                setSelectedInfContacts(k);
                                dispatch({
                                  type: "contacts",
                                  payload: k,
                                });
                              }}
                              className=" mt-2"
                              size={20}
                            />
                            <span className="m-2 ">{val.name}</span>
                          </div>
                        );
                      })}
                    </CardBody>
                  </Card>
                )}
              </div>
              <div ref={cardRefs.current[8]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 9 ? null : 9);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Lookalikes
                  <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 9 && (
                  <>
                    <Card className="  w-55 filter-forms mt-2 text-left position-absolute">
                      <CardBody>
                        <Row>
                          <Col xs="6">
                            <Label className="mb-2">Audience Based</Label>
                            <InputGroup className="searchList ">
                              <Button className="bg-light ">
                                <ImSearch color="black" size="19" />
                              </Button>
                              <Input
                                className="b-none"
                                placeholder="Name or @handle"
                                value={searchAudValue}
                                onChange={(e) => {
                                  getSearchProfiles(e, "lookalike");
                                  setSearchAudValue(e.target.value);
                                  setLookalikeType("aud");
                                }}
                              />
                            </InputGroup>
                            {selectedAudUsers ? (
                              <div className="d-flex location-geo">
                                <AiFillCloseCircle
                                  onClick={() => {
                                    setSelectedAudUsers("");
                                    dispatch({
                                      type: "audience_relevance",
                                      payload: null,
                                    });
                                  }}
                                  className=" mt-2"
                                  size={20}
                                />
                                <span className="m-2 ">{selectedAudUsers}</span>
                              </div>
                            ) : null}
                          </Col>
                          <Col xs="6">
                            <Label className="mb-2">Content Based</Label>
                            <InputGroup className="searchList ">
                              <Button className="bg-light ">
                                <ImSearch color="black" size="19" />
                              </Button>
                              <Input
                                className="b-none"
                                placeholder="Name or @handle"
                                value={searchContentValue}
                                onChange={(e) => {
                                  getSearchProfiles(e, "topic-tags");
                                  setSearchContentValue(e.target.value);
                                  setLookalikeType("cont");
                                }}
                              />
                            </InputGroup>
                            {selectedContentUsers?.map((val, i) => {
                              return (
                                <div key={val} className="d-flex location-geo">
                                  <AiFillCloseCircle
                                    onClick={() => {
                                      const k = selectedContentUsers.filter(
                                        (c) => val !== c,
                                      );
                                      setSelectedContentUsers(k);
                                      const rString = [
                                        ...relevanceString.value,
                                        ...k,
                                      ]
                                        .toString()
                                        .replace(/,/g, " ");

                                      dispatch({
                                        type: "relevance",
                                        payload: {
                                          value: rString,
                                        },
                                      });
                                    }}
                                    className=" mt-2"
                                    size={20}
                                  />
                                  <span className="m-2 ">{val}</span>
                                </div>
                              );
                            })}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    {userProfiles?.length ? (
                      <Card
                        style={{
                          marginLeft: lookalikeType == "aud" ? "6rem" : "21rem",
                        }}
                        className="user-cards text-left"
                      >
                        {userProfiles?.map((val: any, index: number) => {
                          return (
                            <CardBody
                              key={`${index}-users`}
                              onClick={() => {
                                if (lookalikeType == "aud") {
                                  setSelectedAudUsers(
                                    `@${val?.user_profile?.username}`,
                                  );
                                  setSearchAudValue("");

                                  dispatch({
                                    type: "audience_relevance",
                                    payload: `@${val?.user_profile?.username}`,
                                  });
                                } else {
                                  setSelectedContentUsers([
                                    ...selectedContentUsers,
                                    `@${val?.user_profile?.username}`,
                                  ]);
                                  setSearchContentValue("");

                                  const k = [
                                    ...relevanceString.value,
                                    ...selectedContentUsers,
                                    `@${val?.user_profile?.username}`,
                                  ]
                                    .toString()
                                    .replace(/,/g, " ");

                                  dispatch({
                                    type: "relevance",
                                    payload: {
                                      value: k,
                                    },
                                  });
                                }
                                setUserProfiles([]);
                              }}
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
                            </CardBody>
                          );
                        })}
                      </Card>
                    ) : null}
                  </>
                )}
              </div>
              <div ref={cardRefs.current[9]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 10 ? null : 10);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Hashtags
                  <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 10 && (
                  <>
                    <Card className="  w-25 filter-forms mt-2 text-left position-absolute">
                      <CardBody>
                        <Label className="d-flex justify-content-between mb-2">
                          Hashtag
                          <Badge color="primary" className=" p-2">
                            <small>
                              {" "}
                              Tags {relevanceString.value?.length}{" "}
                            </small>
                          </Badge>
                        </Label>
                        <InputGroup className="searchList ">
                          <Button className="bg-light ">
                            <ImSearch color="black" size="19" />
                          </Button>
                          <Input
                            className="b-none"
                            placeholder="search topic"
                            value={searchHashtagValue}
                            onChange={(e) => {
                              getSearchedTags(e);
                              setsearchHashtagValue(e.target.value);
                            }}
                          />
                        </InputGroup>
                      </CardBody>
                    </Card>
                    {hashtagsDropdown && (
                      <Card className="hashtags-card">
                        {hashTagsData?.map((val) => {
                          return (
                            <small
                              onClick={(e) => {
                                setRelevanceString({
                                  value: [...relevanceString.value, `#${val}`],
                                });
                                const k = [
                                  ...selectedContentUsers,
                                  ...relevanceString.value,
                                  `#${val}`,
                                ]
                                  .toString()
                                  .replace(/,/g, " ");

                                dispatch({
                                  type: "relevance",
                                  payload: {
                                    value: k,
                                  },
                                });
                                setHashtagsDropdown(false);
                                setsearchHashtagValue("");
                              }}
                            >
                              {" "}
                              {val}{" "}
                            </small>
                          );
                        })}
                      </Card>
                    )}
                  </>
                )}
              </div>
              <div ref={cardRefs.current[10]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 11 ? null : 11);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Language
                  <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 11 && (
                  <Card className="   filter-forms mt-2 text-left position-absolute">
                    <CardBody>
                      <Row>
                        <Col xs="6" className="m-0">
                          <Label>Audience</Label>
                          <Select
                            placeholder="Add language"
                            // defaultValue={Countries[0]}
                            options={Languages}
                            onChange={(e) => {
                              setSelectedLanguages([...selectedLanguages, e]);
                              dispatch({
                                type: "audience_lang",
                                payload: [...selectedLanguages, e],
                              });
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.code}
                          />
                          {selectedLanguages.map((val, i) => {
                            return (
                              <div
                                key={val.code}
                                className="d-flex location-geo"
                              >
                                <AiFillCloseCircle
                                  onClick={() => {
                                    const k = selectedLanguages.filter(
                                      (c) => val.code !== c.code,
                                    );
                                    setSelectedLanguages(k);
                                    dispatch({
                                      type: "audience_lang",
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
                                  defaultValue={val.weight}
                                  type="select"
                                  onChange={(e) => {
                                    const k = selectedLanguages.filter(
                                      (c) => val.code !== c.code,
                                    );
                                    dispatch({
                                      type: "audience_lang",
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
                                  {/* <option> {">" + val.weight * 100}%</option> */}
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
                            placeholder="Add Languague"
                            // defaultValue={Countries[0]}
                            options={Languages}
                            onChange={(e) => {
                              setSelectedInfLanguages([
                                ...selectedInfLanguages,
                                e,
                              ]);
                              const langCodes = [
                                ...selectedInfLanguages,
                                e,
                              ].map((item) => ({
                                code: item.code,
                              }));
                              dispatch({
                                type: "lang",
                                payload: langCodes,
                              });
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.code}
                          />
                          {selectedInfLanguages?.map((val, i) => {
                            return (
                              <div
                                key={val.code}
                                className="d-flex location-geo"
                              >
                                <AiFillCloseCircle
                                  onClick={() => {
                                    const k = selectedInfLanguages.filter(
                                      (c) => val.code !== c.code,
                                    );

                                    setSelectedInfLanguages(k);
                                    const langCodes = k.map((item) => ({
                                      code: item.code,
                                    }));
                                    dispatch({
                                      type: "lang",
                                      payload: langCodes,
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
              <div ref={cardRefs.current[11]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 12 ? null : 12);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Age
                  <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 12 && (
                  <Card className="  w-25 px-2 filter-forms mt-2 text-left position-absolute">
                    <CardBody>
                      <Row>
                        <Label>Audience</Label>
                        <Col xs="4" className="p-0">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            defaultValue={"13-17"}
                            onChange={(e) => {
                              const index = Age.findIndex(
                                (x) => x.code === e.target.value,
                              );
                              const remaining = Age.slice(index, Age.length);
                              setSelectedAudAges(remaining);
                              dispatch({
                                type: "audience_age",
                                payload: remaining,
                              });
                            }}
                          >
                            {Age.map((val) => {
                              return (
                                <option value={val.code} key={val.code}>
                                  {val.code.split("-")[0]}
                                </option>
                              );
                            })}
                          </Input>
                        </Col>
                        <Col xs="4" className="px-1">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            defaultValue={"65-"}
                            onChange={(e) => {
                              const compareAges = selectedAudAges?.length
                                ? selectedAudAges
                                : Age;
                              const index = compareAges?.findIndex(
                                (x: any) => x?.code === e.target.value,
                              );
                              const remaining = compareAges.slice(0, index + 1);
                              setSelectedAudAges(remaining);
                              dispatch({
                                type: "audience_age",
                                payload: remaining,
                              });
                            }}
                          >
                            {Age.map((val) => {
                              return (
                                <option value={val.code} key={val.code}>
                                  {val.code.split("-")[1]
                                    ? Number(val.code.split("-")[1]) + 1
                                    : "65+"}
                                </option>
                              );
                            })}
                          </Input>
                        </Col>
                        <Col xs="4" className="px-1">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            onChange={(e) => {
                              const k = selectedAudAges.map((item) => ({
                                ...item,
                                weight: e.target.value,
                              }));
                              setSelectedAudAges(k);
                              dispatch({
                                type: "audience_age",
                                payload: k,
                              });
                            }}
                          >
                            {weightAge.map((val) => {
                              return (
                                <option value={val} key={val}>
                                  {(val * 100).toFixed(0)}%
                                </option>
                              );
                            })}
                          </Input>
                        </Col>

                        <Label>Influencer</Label>

                        <Col xs="4" className="p-0">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            onChange={(e) => {
                              setAgeInflu({
                                ...ageInflu,
                                left_number: Number(e.target.value),
                              });
                              dispatch({
                                type: "age",
                                payload: {
                                  ...ageInflu,
                                  left_number: Number(e.target.value),
                                },
                              });
                            }}
                          >
                            <option value={18}>18</option>
                            <option value={25}>25</option>
                            <option value={35}>35</option>
                            <option value={45}>45</option>
                            <option value={65}>65</option>
                          </Input>
                        </Col>
                        <Col xs="4" className="px-1">
                          <Input
                            type="select"
                            className="w-100"
                            name="select"
                            onChange={(e) => {
                              setAgeInflu({
                                ...ageInflu,
                                right_number: Number(e.target.value),
                              });
                              dispatch({
                                type: "age",
                                payload: {
                                  ...ageInflu,
                                  right_number: Number(e.target.value),
                                },
                              });
                            }}
                          >
                            <option value={25}>25</option>
                            <option value={35}>35</option>
                            <option value={45}>45</option>
                            <option value={65}>65+ </option>
                          </Input>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                )}
              </div>
              <div ref={cardRefs.current[12]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 13 ? null : 13);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Last Post <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 13 && (
                  <Card
                    // ref={cardRefs.current}
                    className="w-25 filter-forms mt-2 text-left position-absolute"
                  >
                    <CardBody>
                      <FormGroup>
                        <Label>Influencer</Label>
                        {influPost.map((val) => {
                          return (
                            <FormGroup key={val.value} check>
                              <Label check>
                                <Input
                                  onChange={(e) => {
                                    // const selectedG = influRadio.filter(
                                    //   (g) => g.value == e.target.value,
                                    // );
                                    setlastPost(Number(e.target.value));

                                    dispatch({
                                      type: "last_post",
                                      payload: e.target.value,
                                    });
                                  }}
                                  defaultChecked={val.value == ""}
                                  value={val.value}
                                  type="radio"
                                  name="influ-gender"
                                />{" "}
                                {val.name}
                              </Label>
                            </FormGroup>
                          );
                        })}
                      </FormGroup>
                    </CardBody>
                  </Card>
                )}
              </div>
              <div ref={cardRefs.current[13]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 14 ? null : 14);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  Growing
                  <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 14 && (
                  <Card className=" p-2 filter-forms mt-2 text-left position-absolute">
                    <CardBody>
                      <Label>Followers Growth</Label>
                      <Input
                        onChange={(e: any) => {
                          const k = growthMonths.filter(
                            (c) => c.interval == e.target.value,
                          );
                          setSelectedGrowth(k[0]);
                          dispatch({
                            type: "followers_growth",
                            payload: k[0],
                          });
                        }}
                        className="w-100"
                        type="select"
                      >
                        <option>Choose the interval</option>
                        {growthMonths?.map((v) => {
                          return <option value={v.interval}>{v.name}</option>;
                        })}
                      </Input>
                      {/* {selectedGrowth?.interval && (
                        <Input
                          type="select"
                          className="w-100 mt-2"
                          defaultValue={selectedGrowth.value}
                          onChange={(e) => {
                            setSelectedGrowth({
                              ...selectedGrowth,
                              value: e.target.value,
                            });
                          
                        >
                          {weight.slice(0, 5).map((v) => {
                            return (
                              <option value={v}>
                                {" "}
                                {">" + (v * 100).toFixed(0)}%
                              </option>
                            );
                          })}
                        </Input> */}
                    </CardBody>
                  </Card>
                )}
              </div>
              <div ref={cardRefs.current[14]} className="positive-relative">
                <Button
                  onClick={() => {
                    setShowDropdown(showDropdown == 15 ? null : 15);
                  }}
                  className="ms-1 "
                  color="light"
                >
                  ... <SlArrowDown size={11} className="mx-1" />
                </Button>
                {showDropdown == 15 && (
                  <Card
                    // ref={cardRefs.current}
                    className="w-25 filter-forms mt-2 text-left position-absolute"
                  >
                    <CardBody>
                      <FormGroup>
                        <Label>Influencer</Label>
                        <div className="mb-0 p-0">
                          <Input
                            onChange={(e) => {
                              setIsVerified(!isVerified);
                              dispatch({
                                type: "is_verified",
                                payload: e.target.checked,
                              });
                            }}
                            checked={isVerified}
                            className="mx-1 mt-1"
                            type="checkbox"
                            id="isVerified"
                          />
                          <Label for="isVerified">Only verified accounts</Label>
                        </div>
                        <div className="mb-0 p-0">
                          <Input
                            onChange={(e) => {
                              setHasAudData(!hasAudData);
                              dispatch({
                                type: "has_audience_data",
                                payload: e.target.checked,
                              });
                            }}
                            checked={hasAudData}
                            className="mx-1 mt-1"
                            type="checkbox"
                            id="hasAudData"
                          />
                          <Label for="hasAudData">Has Audience Data</Label>
                        </div>
                      </FormGroup>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Card>
      <ul className="selected-filers  mt-1">
        <li className="d-inline-block">Filters:</li>
        {selectedCountries?.length
          ? selectedCountries.map((country) => {
              return (
                <li className="single-filter ">
                  <b> Location Aud:</b> {country.name} {`>  ${country.weight}`}{" "}
                  <GrFormClose
                    onClick={() => {
                      const k = selectedCountries.filter(
                        (c) => country.code !== c.code,
                      );
                      setSelectedCountries(k);
                      dispatch({
                        type: "audience_geo",
                        payload: k,
                      });
                    }}
                    className=" "
                    size={23}
                  />
                </li>
              );
            })
          : null}
        {selectedInfCountries?.length
          ? selectedInfCountries.map((country) => {
              return (
                <li className="single-filter ">
                  <b> Location Inf:</b> {country.name} {`>  ${country.weight}`}{" "}
                  <GrFormClose
                    onClick={() => {
                      const k = selectedInfCountries.filter(
                        (c) => val.code !== c.code,
                      );
                      setSelectedInfCountries(k);
                      const countryCodes = k.map((country) => country.code);
                      dispatch({
                        type: "geo",
                        payload: countryCodes,
                      });
                    }}
                    className=" "
                    size={23}
                  />
                </li>
              );
            })
          : null}

        {audienceG ? (
          <li className="single-filter ">
            <b> Gender Aud:</b> {audienceG.name}{" "}
            {`>  ${(audienceG.weight * 100).toFixed(0)}%`}
            <GrFormClose
              onClick={() => {
                setAudienceG(null);
                dispatch({
                  type: "audience_gender",
                  payload: {},
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {influencerG ? (
          <li className="single-filter ">
            <b> Gender Inf:</b> {influencerG.name}
            <GrFormClose
              onClick={() => {
                setInfluencerG(null);
                dispatch({
                  type: "gender",
                  payload: {},
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {keywords ? (
          <li className="single-filter ">
            <b> Keywords Inf:</b> {keywords}
            <GrFormClose
              onClick={() => {
                setKeywords("");
                dispatch({
                  type: "keywords",
                  payload: "",
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {followersRange.left_number || followersRange.right_number ? (
          <li className="single-filter ">
            <b> Followers:</b> {FormatNumber(followersRange?.left_number)} -
            {FormatNumber(followersRange?.right_number)}
            <GrFormClose
              onClick={() => {
                setFollowersRange({
                  left_number: null,
                  right_number: null,
                });
                dispatch({
                  type: "followers-range",
                  payload: {
                    left_number: null,
                    right_number: null,
                  },
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {enagagementsRange.left_number || enagagementsRange.right_number ? (
          <li className="single-filter ">
            <b> Engagements:</b> {FormatNumber(enagagementsRange?.left_number)}-
            {FormatNumber(enagagementsRange?.right_number)}
            <GrFormClose
              onClick={() => {
                setEnagagementsRange({
                  left_number: null,
                  right_number: null,
                });
                dispatch({
                  type: "engagements",
                  payload: {
                    left_number: null,
                    right_number: null,
                  },
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {engageRate ? (
          <li className="single-filter ">
            <b> Engagement Rate: </b> &#8805;{(engageRate * 100).toFixed(0)}%
            <GrFormClose
              onClick={() => {
                setEngageRate(null);
                dispatch({
                  type: "engagement_rate",
                  payload: null,
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {bio ? (
          <li className="single-filter ">
            <b> Bio Inf:</b> {bio}
            <GrFormClose
              onClick={() => {
                setBio("");
                dispatch({
                  type: "bio",
                  payload: "",
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {viewsRange.left_number || viewsRange.right_number ? (
          <li className="single-filter ">
            <b> Views:</b> {FormatNumber(viewsRange?.left_number)}{" "}
            {viewsRange?.right_number ? "-" : "+"}
            {FormatNumber(viewsRange?.right_number)}
            <GrFormClose
              onClick={() => {
                setViewsRange({
                  left_number: null,
                  right_number: null,
                });
                dispatch({
                  type: "avg_views",
                  payload: {
                    left_number: null,
                    right_number: null,
                  },
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {selectedInfContacts?.length
          ? selectedInfContacts.map((val) => {
              return (
                <li className="single-filter ">
                  {val.name}
                  <GrFormClose
                    onClick={() => {
                      const k = selectedInfContacts.filter(
                        (c) => val.type !== c.type,
                      );
                      setSelectedInfContacts(k);
                      dispatch({
                        type: "contacts",
                        payload: k,
                      });
                    }}
                    size={23}
                  />
                </li>
              );
            })
          : null}
        {selectedAudUsers ? (
          <li className="single-filter ">
            <b> Lookalike:</b> {selectedAudUsers}
            <GrFormClose
              onClick={() => {
                setSelectedAudUsers("");
                dispatch({
                  type: "audience_relevance",
                  payload: null,
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {selectedContentUsers?.length
          ? selectedContentUsers.map((val) => {
              return (
                <li className="single-filter ">
                  <b> Similar:</b> {val}
                  <GrFormClose
                    onClick={() => {
                      const k = selectedContentUsers.filter((c) => val !== c);
                      setSelectedContentUsers(k);
                      const rString = [...relevanceString.value, ...k]
                        .toString()
                        .replace(/,/g, " ");

                      dispatch({
                        type: "relevance",
                        payload: {
                          value: rString,
                        },
                      });
                    }}
                    size={23}
                  />
                </li>
              );
            })
          : null}
        {relevanceString?.value?.length
          ? relevanceString.value?.map((val) => {
              return (
                <li className="single-filter ">
                  <b> #</b> {val.split("#")[1]}
                  <GrFormClose
                    onClick={() => {
                      const k = relevanceString.value.filter((c) => val !== c);
                      setRelevanceString({
                        value: [...k],
                      });
                      const rString = [...k].toString().replace(/,/g, " ");

                      dispatch({
                        type: "relevance",
                        payload: {
                          value: rString,
                        },
                      });
                    }}
                    size={23}
                  />
                </li>
              );
            })
          : null}
        {selectedLanguages?.length
          ? selectedLanguages.map((lang) => {
              return (
                <li className="single-filter ">
                  <b> Language Aud:</b> {lang.name}{" "}
                  {`>  ${(lang.weight * 100).toFixed(0)}%`}{" "}
                  <GrFormClose
                    onClick={() => {
                      const k = selectedLanguages.filter(
                        (c) => lang.code !== c.code,
                      );
                      setSelectedLanguages(k);
                      dispatch({
                        type: "audience_lang",
                        payload: k,
                      });
                    }}
                    className=" "
                    size={23}
                  />
                </li>
              );
            })
          : null}
        {selectedInfLanguages?.length
          ? selectedInfLanguages.map((lang) => {
              return (
                <li className="single-filter ">
                  <b> Language Inf:</b> {lang.name}
                  <GrFormClose
                    onClick={() => {
                      const k = selectedInfLanguages.filter(
                        (c) => lang.code !== c.code,
                      );

                      setSelectedInfLanguages(k);
                      const langCodes = k.map((item) => ({
                        code: item.code,
                      }));
                      dispatch({
                        type: "lang",
                        payload: langCodes,
                      });
                    }}
                    className=" "
                    size={23}
                  />
                </li>
              );
            })
          : null}
        {lastPost ? (
          <li className="single-filter ">
            <b> Last Post:</b> {lastPost / 30}{" "}
            {lastPost / 30 > 1 ? "Months" : "Month"}
            <GrFormClose
              onClick={() => {
                setlastPost("");
                dispatch({
                  type: "audience_relevance",
                  payload: null,
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {selectedGrowth?.interval ? (
          <li className="single-filter">
            <b> Followers Growth:</b> {selectedGrowth.name}
            <GrFormClose
              onClick={() => {
                setSelectedGrowth({});
                dispatch({
                  type: "followers_growth",
                  payload: {},
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {isVerified ? (
          <li className="single-filter">
            Only Verified
            <GrFormClose
              onClick={() => {
                setSelectedGrowth({});
                dispatch({
                  type: "followers_growth",
                  payload: {},
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {hasAudData ? (
          <li className="single-filter">
            Has Audience
            <GrFormClose
              onClick={() => {
                setHasAudData(false);
                dispatch({
                  type: "has_audience_data",
                  payload: false,
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {selectedAudAges?.length ? (
          <li className="single-filter">
            <b> Age Aud:</b> {selectedAudAges[0].code.split("-")[0]} -{" "}
            {selectedAudAges[1]
              ? selectedAudAges[selectedAudAges.length - 1].code.split("-")[1]
                ? selectedAudAges[selectedAudAges.length - 1].code.split("-")[1]
                : "y.o"
              : selectedAudAges[0].code.split("-")[1]}{" "}
            {`>  ${(selectedAudAges[0]?.weight * 100).toFixed(0)}%`}
            <GrFormClose
              onClick={() => {
                setSelectedAudAges([]);
                dispatch({
                  type: "audience_age",
                  payload: [],
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
        {ageInflu.left_number || ageInflu.right_number ? (
          <li className="single-filter ">
            <b> Inf Age:</b> {ageInflu?.left_number?.toFixed(0)}{" "}
            {ageInflu?.right_number ? "-" : "+"}
            {ageInflu?.right_number?.toFixed(0)}
            <GrFormClose
              onClick={() => {
                setAgeInflu({
                  left_number: null,
                  right_number: null,
                });
                dispatch({
                  type: "age",
                  payload: {
                    left_number: null,
                    right_number: null,
                  },
                });
              }}
              className=" "
              size={23}
            />
          </li>
        ) : null}
      </ul>

      <DashboardList
        handlePageNumber={handlePageNumber}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        isLoading={isLoading}
        listData={listData}
        recordPerPage={recordsPerP}
        dispatch={dispatch}
      />
    </>
  );
};
export default TikTokList;
