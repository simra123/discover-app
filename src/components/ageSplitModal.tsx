import React from "react";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";

interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: {
    code: string;
    male: number;
    female: number;
  }[];
  followers: number;
}
const ModalProfile: React.FC<ModalProps> = ({
  modal,
  setModal,
  data,
  followers,
}) => {
  return (
    <Modal
      modalClassName="modal-md"
      isOpen={modal}
      toggle={() => setModal(!modal)}
    >
      <ModalHeader toggle={() => setModal(!modal)}>Age Split </ModalHeader>
      <ModalBody className="m-1">
        <Table>
          <thead>
            <tr>
              <th>AGE</th>
              <th> FOLLOWERS</th>
              <th> LIKES</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr key={val?.code}>
                  <td>{val.code}</td>
                  <td>
                    {" "}
                    {((val?.male + val?.female) * followers).toFixed(0)}/{" "}
                    {((val?.male + val?.female) * 100).toFixed(1)}%
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ModalBody>
      <ModalHeader>Male Age Split</ModalHeader>
      <ModalBody className="m-1">
        <Table>
          <thead>
            <tr>
              <th>AGE</th>
              <th> FOLLOWERS</th>
              <th> LIKES</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr>
                  <td>{val.code}</td>
                  <td>
                    {" "}
                    {(val?.male * followers).toFixed(0)} /
                    {" " + (val?.male * 100).toFixed(1)}%
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ModalBody>
      <ModalHeader>Female Age Split</ModalHeader>
      <ModalBody className="m-1">
        <Table>
          <thead>
            <tr>
              <th>AGE</th>
              <th> FOLLOWERS</th>
              <th> LIKES</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr>
                  <td>{val.code}</td>
                  <td>
                    {" "}
                    {(val?.female * followers).toFixed(0)} /
                    {" " + (val?.female * 100).toFixed(1)}%
                  </td>
                  <td></td>
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
