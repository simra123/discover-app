import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import ModalProfile from "./profilleModal";
interface UserProps {
  data: {
    user_id: string;
    username: string;
    picture: string;
    fullname: string;
    url: string;
    is_verified: boolean;
  }[];
}
type MapTypes = {
  user_id: string;
  username: string;
  picture: string;
  fullname: string;
  url: string;
  is_verified: boolean;
};

const SimilarUsers: React.FC<UserProps> = ({ data }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="other_profiles">
      <ModalProfile
        title="Lookalikes (similar topics)"
        data={data}
        modal={showModal}
        setModal={setShowModal}
      />
      {data?.slice(0, 5).map((val: MapTypes) => {
        return (
          <Row className="my-3" key={val?.user_id}>
            <Col xs="2" className="m-0 text-center">
              <img
                height={48}
                className="rounded-circle"
                width={"auto"}
                src={val?.picture}
              />
            </Col>
            <Col xs="6" className="m-0">
              <Link to={val?.url} target="_blank">
                {" "}
                <h6 className="fw-normal m-0"> {val?.username}</h6>
              </Link>
              <small className="text-muted "> {val?.fullname}</small>
            </Col>
          </Row>
        );
      })}
      <p style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
        view more
      </p>
    </div>
  );
};

export default SimilarUsers;
