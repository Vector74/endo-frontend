import { Translate } from "../core_utils/utils.js";
import { CtrlMainCard } from "../components/CtrlMainCard.js";
import { MainPanelCenter } from "../components/CtrlPanels.js";
import CtrlButton from "../components/CtrlButton.js";
import { useNavigate } from "react-router-dom";

export function ErrorPage({ errorMessage }) {
    const navigate = useNavigate();

    function onClick() {
        navigate("/");
    }

    return <CtrlMainCard title={Translate("Belső hiba")} >
        <div class="row p-3 mb-2 bg-danger-subtle text-center">
            <MainPanelCenter>
                <h1>{Translate(errorMessage)}</h1>
                <br/>
                <CtrlButton onClicked={onClick}>
                    {Translate("Rendben")}
                </CtrlButton>
            </MainPanelCenter>

        </div>

    </CtrlMainCard>
}