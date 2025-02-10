import { Children } from "react";

export function MainPanelCenter({ children }) {
    return (
        <div class="col-12 d-flex flex-column flex-row text-center">
            <div class="col-12 mt-2 mb-2">
                {Children.map(children, child => child)}
            </div>
        </div>
    )
}

export function MainPanel({ children }) {
    return (
        <div class="col-12 d-flex flex-column flex-row text-left">
            <div class="col-12 mt-2 mb-2 ">
                {Children.map(children, child => child)}
            </div>
        </div>
    )
}


export function MainPanelRight({ children }) {
    return (
        <div class="col-12 d-flex flex-column flex-row text-right">
            <div class="col-12 mt-2 mb-2 ">
                {Children.map(children, child => child)}
            </div>
        </div>
    )
}
