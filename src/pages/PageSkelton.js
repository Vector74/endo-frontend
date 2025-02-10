import { Children } from "react";
import CtrlNavbar from "../components/CtrlNavbar";

export default function PageSkelton({ children }) {
    return <div
        className="App"
        class="container-fluid height-full vh-100" >
        <header>
            <CtrlNavbar />
        </header>
        <main>
            <div class="container">
                <div class="row">
                    <div class="col-12"></div>
                </div>
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-10">
                        {Children.map(children, child => child)}
                    </div>
                    <div class="col-1"></div>
                </div>
            </div>
        </main>
    </div>
}