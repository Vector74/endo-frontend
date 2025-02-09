import { Children } from "react";

export default function CtrlButton({ type, onClicked, children }) {
    return (
        <button
            type={type ??  null}
            class="btn btn-primary col-sm-3 btn-lg m-2"
            onClick={onClicked}
        >{Children.map(children, child => child)}
        </button>
    )
}