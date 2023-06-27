import React from "react";
import { Link } from "react-router-dom";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";
import { FormatNumber } from ".";

interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: {
    likes: number;
    comments: number;
    views: number;
    shares: number;
    saves: number;
    created: string;
    xAxis: number;
    link: string;
  }[];
}
const ModalProfile: React.FC<ModalProps> = ({ modal, setModal, data }) => {
  return (
    <Modal
      modalClassName="modal-lg"
      isOpen={modal}
      toggle={() => setModal(!modal)}
    >
      <ModalHeader toggle={() => setModal(!modal)}>
        Engagements spread for last posts
      </ModalHeader>
      <ModalBody className="m-1">
        <Table>
          <thead>
            <tr>
              <th>POST DATE</th>
              <th> LIKES</th>
              <th> COMMENTS</th>
              <th> POST</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr key={val?.xAxis}>
                  <td>{val.created}</td>
                  <td>{FormatNumber(val.likes)}</td>
                  <td>{FormatNumber(val.comments)}</td>
                  <td>
                    {" "}
                    <small>
                      <Link to={val.link} target="_blank">
                        {" "}
                        View Post
                      </Link>{" "}
                    </small>
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
