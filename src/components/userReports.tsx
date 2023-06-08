import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  UncontrolledTooltip,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import HttpHandler from "../http/services/CoreHttpHandler";
import { useState, useEffect, memo } from "react";
import Select from "react-select";
import { AxiosResponse, AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import TikTokList from "./tiktokList";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import { FormatNumber, Engagemnets, Loader } from "../components";
import moment from "moment";
import { AiFillQuestionCircle } from "react-icons/ai";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AuthFunction } from "../components";
import StepCountChart from "./engagmentsLikes";
import GenderSplit from "./genderSplit";
import WordCloud from "./wordChart";
import AgeGenderColumns from "./ageGenderSplit";
import LocationByCountry from "./locationByCountry";
import Reachability from "./reachability";
import { FlagIcon } from "react-flag-kit";
import SimilarUsers from "./similiarUser";
import PostSlider from "./postSlider";
/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
type CardProps = {
  text?: string | number;
  textM?: string;
  percentage?: string | null;
  tooltipText?: string;
};
const AvgCards = ({ text, textM, percentage, tooltipText }: CardProps) => {
  return (
    <Card className="avg-cards">
      <h2 className="d-flex">
        {text}{" "}
        <small
          className={`    ${
            percentage?.includes("-") ? "text-danger" : "text-success"
          }`}
        >
          {[percentage]}
        </small>{" "}
      </h2>
      <h5 className="text-muted">
        {textM}
        {tooltipText && (
          <>
            <span id="UncontrolledTooltipExample">
              <AiFillQuestionCircle
                size="20"
                color="#d0d6dd"
                className="mb-1 mx-2"
              />
            </span>
            <UncontrolledTooltip
              placement="right"
              target="UncontrolledTooltipExample"
            >
              {tooltipText}
            </UncontrolledTooltip>
          </>
        )}
      </h5>
    </Card>
  );
};

type SearchType = {
  type: string;
  user_id: string;
};
const UserReports = (): JSX.Element => {
  const { mutate, isLoading } = useMutation<
    AxiosResponse<Response>,
    AxiosError<Error>,
    SearchType
  >({
    mutationFn: (data: SearchType) => {
      return HttpHandler.makeRequest("api/profile", "POST", data);
    },
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("username");
  const [userData, setUserData] = useState<any>({});
  const [stateHistory, setStatHistory] = useState<any>([]);
  const [followers, setFollowers] = useState<string | null | number>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [likes, setLikes] = useState<string | null>(null);
  const [views, setAvgViews] = useState<string | null>(null);
  const [comments, setAvgComments] = useState<string | null>(null);
  const [showCard, setShowCard] = useState<boolean>(false);

  useEffect(() => {
    if (query) {
      setShowCard(false);
      mutate(
        {
          type: "tiktok",
          user_id: query,
        },
        {
          onSuccess: (data: any) => {
            if (data.data?.data[0]) {
              setUserData(data.data?.data[0]);

              if (data.data?.data[0]?.user_profile?.stat_history.length > 5) {
                const kk =
                  data.data?.data[0]?.user_profile?.stat_history?.slice(
                    Math.max(
                      data.data?.data[0]?.user_profile?.stat_history?.length -
                        5,
                      1,
                    ),
                  );
                setStatHistory(kk);
              } else {
                setStatHistory(data.data?.data[0]?.user_profile?.stat_history);
              }
            } else {
              setUserData({});
            }
          },
          onError: (data: any) => {
            AuthFunction(data);
          },
        },
      );
    }
  }, [query]);

  useEffect(() => {
    const graph = am4core.create("line-followers", am4charts.XYChart);
    const graph2 = am4core.create("line-following", am4charts.XYChart);
    const graph3 = am4core.create("line-likes", am4charts.XYChart);

    // console.log(userData?.user_profile.stat_history);
    if (stateHistory?.length) {
      graph.data = stateHistory;

      graph.numberFormatter.numberFormat = "#,##a";

      if (stateHistory.length > 1) {
        const currMonth = stateHistory[stateHistory.length - 1]?.followers;
        const lastMonth = stateHistory[stateHistory.length - 2]?.followers;
        setFollowers(
          (((currMonth - lastMonth) / lastMonth) * 100).toFixed(2) + "%",
        );
        const currMonth2 = stateHistory[stateHistory.length - 1]?.following;
        const lastMonth2 = stateHistory[stateHistory.length - 2]?.following;
        console.log(currMonth2, lastMonth2, "fllowig");
        setFollowing(
          lastMonth2 !== 0
            ? (((currMonth2 - lastMonth2) / lastMonth2) * 100).toFixed(2) + "%"
            : "0%",
        );
        const currMonth3 = stateHistory[stateHistory.length - 1]?.avg_likes;
        const lastMonth3 = stateHistory[stateHistory.length - 2]?.avg_likes;
        setLikes(
          lastMonth3 !== 0
            ? (((currMonth3 - lastMonth3) / lastMonth3) * 100).toFixed(2) + "%"
            : "0%",
        );

        const currMonth4 = stateHistory[4]?.avg_comments;
        const lastMonth4 = stateHistory[3]?.avg_comments;
        setAvgComments(
          lastMonth4 !== 0
            ? (((currMonth4 - lastMonth4) / lastMonth4) * 100).toFixed(2) + "%"
            : "0%",
        );
        const currMonth5 = stateHistory[4]?.avg_views;
        const lastMonth5 = stateHistory[3]?.avg_views;
        setAvgViews(
          (((currMonth5 - lastMonth5) / lastMonth5) * 100).toFixed(2) + "%",
        );
      } else {
        setFollowers("");
        setLikes("");
        setFollowing("");
        setAvgComments("");
        setAvgViews("");
      }

      // Create axes
      const dateAxis = graph.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.renderer.minGridDistance = 10;
      dateAxis.periodChangeDateFormats.setKey("month", "MMM");
      const valueAxis = graph.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.minGridDistance = 90;

      //graph following
      graph2.data = stateHistory;
      graph2.numberFormatter.numberFormat = "#,##a";

      // Create axes
      const dateAxis2 = graph2.xAxes.push(new am4charts.DateAxis());
      dateAxis2.renderer.grid.template.disabled = true;
      dateAxis2.renderer.labels.template.fontSize = 12;
      dateAxis2.renderer.minGridDistance = 10;
      dateAxis2.periodChangeDateFormats.setKey("month", "MMM");
      const valueAxis2 = graph2.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.labels.template.fontSize = 12;
      valueAxis2.renderer.minGridDistance = 90;

      //graph likes

      graph3.data = stateHistory;
      graph3.numberFormatter.numberFormat = "#,##a";

      // Create axes
      const dateAxis3 = graph3.xAxes.push(new am4charts.DateAxis());
      dateAxis3.renderer.grid.template.disabled = true;
      dateAxis3.renderer.labels.template.fontSize = 12;
      dateAxis3.renderer.minGridDistance = 10;
      dateAxis3.periodChangeDateFormats.setKey("month", "MMM");
      const valueAxis3 = graph3.yAxes.push(new am4charts.ValueAxis());
      valueAxis3.renderer.labels.template.fontSize = 12;
      valueAxis3.renderer.minGridDistance = 30.5;
      function createSeries(field: string, g: any) {
        const series = g.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = FormatNumber(field);
        series.dataFields.dateX = "month";
        series.tooltipText = "{valueY}";
        series.strokeWidth = 2;
        series.stroke = am4core.color("black");
        series.strokeDasharray = "5 , 0";
        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.fill = am4core.color("black");
        bullet.stroke = am4core.color("white");
        return series;
      }

      createSeries("followers", graph);
      createSeries("following", graph2);
      createSeries("avg_likes", graph3);

      // chart.legend = new am4charts.Legend();
      graph.cursor = new am4charts.XYCursor();
      graph2.cursor = new am4charts.XYCursor();
      graph3.cursor = new am4charts.XYCursor();
      let cursor = new am4charts.XYCursor();
      let cursor2 = new am4charts.XYCursor();
      let cursor3 = new am4charts.XYCursor();
      graph.cursor = cursor;
      graph2.cursor = cursor2;
      graph3.cursor = cursor3;
      // cursor.lineX.disabled = true;
      cursor.lineY.disabled = true;
      cursor2.lineY.disabled = true;
      cursor3.lineY.disabled = true;

      // cursor.events.on("cursorpositionchanged", updateTooltip);
      // // dateAxis.events.on("datarangechanged", updateTooltip);

      // function updateTooltip() {
      //   //   dateAxis.showTooltipAtPosition(3.5);
      //   series.showTooltipAtPosition(1.5, 0);
      //   // series.tooltip.validate(); // otherwise will show other columns values for a second
      // }
    }
    return () => {
      graph.dispose();
      graph2.dispose();
      graph3.dispose();
    };
  }, [userData, stateHistory]);

  const options = [
    { value: "add", label: "ADD" },
    { value: "down", label: "DOWNLOAD" },
  ];

  console.log(userData, "hi");
  return (
    <>
      <TikTokList
        showCard={showCard}
        setShowCard={setShowCard}
        showButton={true}
      />
      <Loader isLoading={isLoading} />
      {!isLoading && Object.keys(userData)?.length ? (
        <>
          {" "}
          <Card className="user_card  ">
            <Row>
              <Col md="2">
                <div className="user-image" style={{ width: 148, height: 148 }}>
                  <img
                    height={"auto"}
                    className="rounded-circle mt-4"
                    width={"100%"}
                    src={userData?.user_profile?.picture}
                    alt=""
                  />
                  <span className="verified"></span>
                </div>
              </Col>
              <Col md="6" className=" mt-3">
                <h2>{userData?.user_profile?.fullname}</h2>
                <span className="fw-bold">
                  @{userData?.user_profile?.username}
                </span>
                {userData?.user_profile?.geo?.country && (
                  <p className="mt-4">
                    <FlagIcon
                      size={19}
                      className="mx-1"
                      code={userData?.user_profile?.geo?.country?.code}
                    />
                    {userData?.user_profile?.geo?.country?.name}
                  </p>
                )}
              </Col>
              <Col
                md="4"
                className="d-flex justify-content-end align-items-end"
              >
                <Select
                  className="mx-2 react-select"
                  defaultValue={options[0]}
                  options={options}
                />
                <Select
                  className=""
                  defaultValue={options[1]}
                  options={options}
                />
              </Col>
              <p className="date">
                Updated:{" "}
                {moment(userData?.report_info?.profile_updated).format(
                  "DD MMM YYYY",
                )}
              </p>{" "}
            </Row>
          </Card>
          <div className="d-flex">
            <h2>Influencer insight</h2>
          </div>
          <AvgCards
            text={FormatNumber(userData?.user_profile?.followers)}
            textM={"Followers"}
            percentage={followers}
          />
          <h2>Post data</h2>
          <Row>
            <Col md="8">
              <Row>
                <Col md="6">
                  <AvgCards
                    text={FormatNumber(userData?.user_profile?.avg_likes)}
                    textM={"Avg Likes"}
                    percentage={likes}
                    tooltipText=" Lorem ipsum dolor sit amet consectetur "
                  />
                </Col>
                <Col md="6">
                  <AvgCards
                    text={FormatNumber(userData?.user_profile?.avg_comments)}
                    textM={"Avg comments"}
                    percentage={comments}
                    tooltipText=" Lorem ipsum dolor sit amet consectetur "
                  />{" "}
                </Col>
                <Col md="12">
                  <AvgCards
                    text={FormatNumber(userData?.user_profile?.avg_views)}
                    textM={"Avg Views"}
                    percentage={views}
                    tooltipText=" Lorem ipsum dolor sit amet consectetur "
                  />{" "}
                </Col>
              </Row>
            </Col>
            <Col md="4">
              <Card style={{ height: "323px" }} className="avg-cards">
                <h2 className="d-flex">
                  {(userData?.user_profile?.engagement_rate * 100).toFixed(2)}%
                </h2>
                <h5 className="text-muted">
                  Engagement rates
                  <span id="enagements">
                    <AiFillQuestionCircle
                      size="20"
                      color="#d0d6dd"
                      className="mb-1 mx-2"
                    />
                  </span>
                  <UncontrolledTooltip placement="right" target="enagements">
                    Lorem ipsum dolor sit amet.
                  </UncontrolledTooltip>
                </h5>
                <Engagemnets
                  picture={userData?.user_profile?.picture}
                  data={userData?.extra?.engagement_rate_histogram}
                />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <AvgCards
                text={"$0 - $0"}
                tooltipText=" Lorem ipsum dolor sit amet consectetur "
                textM={"Estimated post price"}
              />
            </Col>
            <Col md="4">
              <AvgCards
                text={"$0.00 "}
                tooltipText=" Lorem ipsum dolor sit amet consectetur "
                textM={"CPV"}
              />
            </Col>
            <Col md="4">
              <AvgCards
                text={"$0.00 "}
                tooltipText=" Lorem ipsum dolor sit amet consectetur "
                textM={"CPE"}
              />
            </Col>
          </Row>
          <Card className="user_card ">
            <Row>
              <Col md="9">
                <h3>SCORE</h3>
                <Row>
                  <Col md="6">poor cons</Col>
                  <Col md="6"></Col>
                </Row>
              </Col>
              <Col md="3">
                <Card className="text-dark text-center">
                  <CardHeader>Score</CardHeader>
                  <CardBody>
                    <span className="display-2">30</span>
                    <p>poor</p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
          <Row>
            {userData?.user_profile?.relevant_tags?.length && (
              <Col md="6">
                <Card className="p-4 my-2">
                  <h5>
                    Topic tensor{" "}
                    <span id="similar">
                      <AiFillQuestionCircle
                        size="20"
                        color="#d0d6dd"
                        className="mb-1 mx-2"
                      />
                    </span>
                    <UncontrolledTooltip placement="right" target="similar">
                      Lorem ipsum dolor sit amet.
                    </UncontrolledTooltip>
                  </h5>
                  <WordCloud data={userData} />
                </Card>
              </Col>
            )}
            {userData?.user_profile?.similar_users?.length && (
              <Col md="6">
                <Card className="p-4 my-2 text-dark">
                  <h5>
                    Lookalikes (similar topics)
                    <span id="similar">
                      <AiFillQuestionCircle
                        size="20"
                        color="#d0d6dd"
                        className="mb-1 mx-2"
                      />
                    </span>
                    <UncontrolledTooltip placement="right" target="similar">
                      Lorem ipsum dolor sit amet.
                    </UncontrolledTooltip>
                  </h5>
                  <SimilarUsers data={userData?.user_profile?.similar_users} />
                </Card>
              </Col>
            )}
          </Row>
          <Row>
            {userData?.user_profile?.stat_history[0] && (
              <Col md="4">
                <Card className="py-4 my-2">
                  <h5 className="mx-4">
                    Followers
                    <span
                      className={` ${
                        followers?.includes("-")
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {" "}
                      {followers}{" "}
                    </span>{" "}
                    this month
                  </h5>
                  <div id="line-followers"></div>
                </Card>
              </Col>
            )}

            {userData?.user_profile?.stat_history[0] && (
              <Col md="4">
                <Card className="py-4 my-2">
                  <h5 className="mx-4">
                    Following{" "}
                    <span
                      className={` ${
                        following?.includes("-")
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {following}
                    </span>{" "}
                    this month
                  </h5>
                  <div id="line-following"></div>
                </Card>
              </Col>
            )}

            {userData?.user_profile?.stat_history[0] && (
              <Col md="4">
                <Card className="py-4 my-2">
                  <h5 className="mx-4">
                    Likes{" "}
                    <span
                      className={` ${
                        likes?.includes("-") ? "text-danger" : "text-success"
                      }`}
                    >
                      {likes}
                    </span>{" "}
                    this month
                  </h5>
                  <div id="line-likes"></div>
                </Card>
              </Col>
            )}

            <Col md="12">
              <Card className="py-4 my-2">
                <h5 className="mx-4">
                  Engagements spread for last posts
                  <span id="engagelikers">
                    <AiFillQuestionCircle
                      size="20"
                      color="#d0d6dd"
                      className="mb-1 mx-2"
                    />
                  </span>
                  <UncontrolledTooltip placement="right" target="engagelikers">
                    Lorem ipsum dolor sit amet.
                  </UncontrolledTooltip>
                </h5>

                <StepCountChart data={userData} />
              </Card>
            </Col>
          </Row>
          <Row>
            <h2 className="text-center my-3">Audience data (by Followers)</h2>
            <Col md="4">
              <Card>
                <h5 className="mx-4">Gender split</h5>
                <GenderSplit
                  data={userData?.audience_followers?.data?.audience_genders}
                />
              </Card>
            </Col>
            {userData?.user_profile?.relevant_tags?.length && (
              <Col md="8">
                <Card>
                  <h5 className="mx-4">Age and gender split</h5>
                  <AgeGenderColumns
                    data={
                      userData?.audience_followers?.data
                        ?.audience_genders_per_age
                    }
                    followers={userData?.user_profile?.followers}
                  />
                </Card>
              </Col>
            )}{" "}
            {userData?.audience_followers?.data?.audience_geo?.countries
              ?.length && (
              <Col md="6">
                <Card className="py-3 my-2">
                  <h5 className="mx-4">Location by country</h5>
                  <LocationByCountry
                    followers={userData?.user_profile?.followers}
                    showFlag={true}
                    data={
                      userData?.audience_followers?.data?.audience_geo
                        ?.countries
                    }
                  />
                </Card>
              </Col>
            )}
            {userData?.audience_followers?.data?.audience_languages?.length && (
              <Col md="6">
                <Card className="py-3 my-2">
                  <h5 className="mx-4">Location by language</h5>
                  <LocationByCountry
                    showFlag={false}
                    followers={userData?.user_profile?.followers}
                    data={
                      userData?.audience_followers?.data?.audience_languages
                    }
                  />
                </Card>
              </Col>
            )}
            <Col md="6">
              <Card
                className="py-3 my-2 avg-cards  "
                style={{
                  display: "flex",
                  margin: "auto",
                  alignItems: "center",
                  height: "280px",
                  justifyContent: "center",
                }}
              >
                <h2 className="mx-4 fw-bold"> 0.0%</h2>
                <h5 className="text-muted">
                  Influencers
                  <span>
                    <AiFillQuestionCircle
                      size="20"
                      color="#d0d6dd"
                      className="mb-1 mx-2"
                    />
                  </span>
                </h5>
              </Card>
            </Col>
            {userData?.audience_followers?.data?.audience_reachability
              ?.length && (
              <Col md="6">
                <Card style={{ height: "280px" }} className="py-3 my-2">
                  <h5 className="mx-4">Audience reachability</h5>
                  <Reachability
                    data={
                      userData?.audience_followers?.data?.audience_reachability
                    }
                  />
                </Card>
              </Col>
            )}
            {userData?.user_profile?.similar_users?.length && (
              <Col md="6">
                <Card className="p-4 my-2 text-dark">
                  <h5>Audience lookalikes</h5>
                  <SimilarUsers
                    data={
                      userData?.audience_followers?.data?.audience_lookalikes
                    }
                  />
                </Card>
              </Col>
            )}
            {userData?.user_profile?.similar_users?.length && (
              <Col md="6">
                <Card className="p-4 my-2 text-dark">
                  <h5>Top followers </h5>
                  <SimilarUsers
                    data={userData?.audience_followers?.data?.notable_users}
                  />
                </Card>
              </Col>
            )}
          </Row>
          <Row>
            <h2 className="text-center my-3">Popular Posts</h2>

            {userData.user_profile?.top_posts?.length && (
              <Col xs="12">
                <PostSlider data={userData.user_profile?.top_posts} />
              </Col>
            )}
          </Row>
        </>
      ) : (
        !isLoading && (
          <p className="text-danger text-center my-3">No Data Found</p>
        )
      )}
    </>
  );
};
export default memo(UserReports);
