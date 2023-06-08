import React from "react";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";

interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: {
    code: string;
    weight: number;
  }[];
}
const ModalProfile: React.FC<ModalProps> = ({ modal, setModal, data }) => {
  return (
    <Modal
      modalClassName="modal-md"
      isOpen={modal}
      toggle={() => setModal(!modal)}
    >
      <ModalHeader toggle={() => setModal(!modal)}>Gender split</ModalHeader>
      <ModalBody className="m-1">
        <Table>
          <thead>
            <tr>
              <th>GENDER</th>
              <th> FOLLOWERS</th>
              <th> LIKES</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr>
                  <td>{val.code}</td>
                  <td>{val.weight}</td>
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
