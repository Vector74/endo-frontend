import { Translate } from "../core_utils/utils";
import { CtrlMainCard } from "../components/CtrlMainCard.js";
import parse from "html-react-parser";
import PageSkelton from "./PageSkelton.js"

export default function Home() {
    return <PageSkelton>
        <CtrlMainCard title={Translate("Beteg elégedettségi Kérdőív Felhasználása")} >
            {parse(Translate("Főkártya szövege"))}
        </CtrlMainCard>
    </PageSkelton>

}