import React from "react";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";
import { FlagIcon } from "react-flag-kit";

interface ModalProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  data: { id: number; weight: number; code: string; name: string }[];
  showFlag: boolean;
  title: string;
  followers: number;
}
const ModalProfile: React.FC<ModalProps> = ({
  modal,
  setModal,
  data,
  showFlag,
  title,
  followers,
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
              <th>{showFlag ? "COUNTRY" : "NAMES"}</th>
              <th> FOLLOWERS</th>
              <th>LIKES</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((val) => {
              return (
                <tr key={val?.name}>
                  <th scope="row">
                    <div className=" my-2 d-flex justify-content-between">
                      <span>
                        {" "}
                        {showFlag && (
                          <FlagIcon code={val.code} size={21} />
                        )}{" "}
                        <small className="mx-1">{val.name}</small>{" "}
                      </span>
                    </div>
                  </th>
                  <td>
                    {" "}
                    {(followers * val.weight).toFixed(0) +
                      " / " +
                      (val.weight * 100).toFixed(3)}
                    %
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
