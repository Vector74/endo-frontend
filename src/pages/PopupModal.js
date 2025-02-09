import { Children } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Translate } from "../core_utils/utils";

export default function PopupModal({ title, children, show, handleClose, hideButton, size }) {

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size={size === undefined ? null : size}
                scrollable={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Children.map(children, child => child)}
                </Modal.Body>
                {!hideButton &&
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            {Translate("Rendben")}
                        </Button>
                    </Modal.Footer>}
            </Modal>
        </>
    );
}