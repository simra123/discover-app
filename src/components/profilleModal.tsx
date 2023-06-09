import React from "react";
import { Table, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { Link } from "react-router-dom";
interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: {
    user_id: string;
    username: string;
    picture: string;
    fullname: string;
    url: string;
    is_verified: boolean;
    engagements: number;
    followers: number;
  }[];
  title: string;
}
const ModalProfile: React.FC<ModalProps> = ({
  modal,
  setModal,
  data,
  title,
}) => {
  return (
    <Modal
      modalClassName="modal-lg"
      isOpen={modal}
      toggle={() => setModal(!modal)}
    >
      <ModalHeader toggle={() => setModal(!modal)}>{title}</ModalHeader>
      <ModalBody>
        <Table>
          <thead>
            <tr>
              <th>INFLUENCER</th>
              <th> ENGAGEMENTS</th>
              <th>FOLLOWERS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr key={val?.user_id}>
                  <th scope="row">
                    <div className="d-flex">
                      <img
                        height={48}
                        loading={"lazy"}
                        className="rounded-circle"
                        width={"auto"}
                        src={val?.picture}
                      />{" "}
                      <span>
                        <h6 className="fw-normal my-2 mx-3">
                          {" "}
                          <Link to={val?.url} target="_blank">
                            {val?.username}{" "}
                          </Link>
                        </h6>
                        <small className="text-muted  fw-light mx-3">
                          {" "}
                          {val?.fullname}
                        </small>
                      </span>
                    </div>
                  </th>
                  <td>{val?.engagements}</td>
                  <td>{val?.followers}</td>
                  <td>
                    <Link to={`?username=${val.username}`}>
                      <Button color="primary" className="w-100">
                        ANALYZE
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default ModalProfile;
