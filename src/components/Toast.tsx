import { useState } from "react";
import BToast from "react-bootstrap/Toast";
import { REMOVE_DELAY } from "../constants/nofitication.constants";

export type ToastComponentProps = {
    heading?: string;
    message?: string;
    variant:
        | "Primary"
        | "Secondary"
        | "Success"
        | "Danger"
        | "Warning"
        | "Info"
        | "Light"
        | "Dark";
};

const Toast = (props: ToastComponentProps) => {
    const [show, setShow] = useState(true);

    return (
        <BToast
            onClose={() => setShow(false)}
            show={show}
            delay={REMOVE_DELAY}
            bg={props.variant.toLowerCase()}
            autohide
        >
            <BToast.Header>
                <strong className="me-auto">{props.heading}</strong>
            </BToast.Header>
            <BToast.Body className="p-3">{props.message}</BToast.Body>
        </BToast>
    );
};

export default Toast;
