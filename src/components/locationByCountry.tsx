import { FlagIcon } from "react-flag-kit";
import { Link } from "react-router-dom";
import { Progress } from "reactstrap";
import React, { useState } from "react";
import CountryLanguegeModal from "./countryLanguageModal";
interface DataProps {
  data: { id: number; weight: number; code: string; name: string }[];
  showFlag: boolean;
  followers: number;
}

const Example: React.FC<DataProps> = ({ data, showFlag, followers }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <CountryLanguegeModal
        modal={showModal}
        setModal={setShowModal}
        data={data}
        followers={followers}
        showFlag={showFlag}
        title={showFlag ? "Location by Country" : "Languages of Audience"}
      />
      {data?.slice(0, 3)?.map((val: any) => {
        return (
          <React.Fragment key={val.code}>
            <div className=" my-2 d-flex justify-content-between">
              <span>
                {" "}
                {showFlag && <FlagIcon code={val.code} size={21} />}{" "}
                <small className="mx-1">{val.name}</small>{" "}
              </span>
              {(val.weight * 100).toFixed(1)}%
            </div>
            <Progress
              className="mb-3"
              color="primary"
              value={val.weight * 100}
            />
          </React.Fragment>
        );
      })}
      <p style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
        view more
      </p>
    </div>
  );
};

export default Example;
