import React from "react";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";

interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: { total: number; min: number; max: number }[];
}
const ModalProfile: React.FC<ModalProps> = ({ modal, setModal, data }) => {
  console.log(data);
  return (
    <Modal
      modalClassName="modal-md"
      isOpen={modal}
      toggle={() => setModal(!modal)}
    >
      <ModalHeader toggle={() => setModal(!modal)}>
        Engagements rate
      </ModalHeader>
      <ModalBody className="m-1">
        <p>
          Distribution by engagement rate for influencers having followers
          between 100K and 500K
        </p>
        <Table>
          <thead>
            <tr>
              <th>ENGAGEMENTS RATE RANGE</th>
              <th> INFLUENCERS</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr key={val?.total}>
                  <td>{`${val.max ? (val.max * 100).toFixed(1) + "%" : ""}  ${
                    val.min ? "-" + (val.min * 100).toFixed(1) + "%" : ""
                  }`}</td>
                  <td>{val.total?.toFixed(0)}</td>
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
