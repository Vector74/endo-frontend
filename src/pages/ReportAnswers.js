import { useState, useEffect } from "react";
import { Translate } from "../core_utils/utils.js";
import CtrlList from "../components/CtrlList/CtrlList.js";
import { ErrorPage } from "./ErrorPage.js";
import { Loader } from "../components/Loader.js";
import { SqlCommandRequest } from "../apicalls/APICallsClasses.js";
import APICall from "../components/APICall.js";
import { MainPanelCenter } from "../components/CtrlPanels.js";
import CtrlInput from "../components/CtrlInput.js";
import CtrlButton from "../components/CtrlButton.js";
import ExportCSV from "../components/ExportCSV.js";


export default function ReportAnswers({ h_id, id }) {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrormessage] = useState("");
    const [rows, setRows] = useState([]);
    const initFilter = { datefrom: "", dateto: "", partname: "", partemail: "" }
    const [filter, setFilter] = useState(initFilter);
    const [hasFiltered, setHasFiltered] = useState(false);
    const [filterChanged, setFilterChanged] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (filterChanged) {
                setLoading(true);
                setFilterChanged(false);
                const whereHid = (h_id !== undefined) ? ("h_id=" + h_id) : "";
                const whereId = (id !== undefined) ? ("questions.id=" + id) : "";
                const whereOp = (whereHid !== "" && whereId !== "") ? " AND " : "";

                const whereDateFrom = filter.datefrom !== "" ? " AND date_time >= '" + filter.datefrom.replaceAll("-", ". ") + ". 00:00:'" : "";
                const whereDateTo = filter.dateto !== "" ? " AND date_time <='" + filter.dateto.replaceAll("-", ". ") + ". 23:59:'" : "";
                const wherePartName = filter.partname !== "" ? " AND username LIKE '%" + filter.partname + "%'" : "";
                const wherePartEmail = filter.partemail !== "" ? " AND email LIKE '%" + filter.partemail + "%'" : "";

                const sqlCommand = new SqlCommandRequest("SELECT answers.date_time, users.username, users.email, questionhead.title, questions.question, questions.questiontype, answers.answer_text, questions.id FROM answers INNER JOIN questions ON questions.id = answers.q_id INNER JOIN questionhead ON questions.h_id = questionhead.id INNER JOIN users ON users.id = answers.p_id WHERE " + whereHid + whereOp + whereId + whereDateFrom + whereDateTo + wherePartName + wherePartEmail);
                const results = await APICall(sqlCommand);
                if (results.errorcode !== 0) {
                    const error = results.data[0]["message"];
                    setErrormessage(error);
                } else {
                    if (results.data.length === 0) results.data = [{
                        date_time: "",
                        username: "",
                        email: "",
                        title: Translate("Nem történt bejegygzés"),
                        question: "",
                        questiontype: "",
                        answer_text: "",
                    }];
                    setRows(results.data)
                }
                setHasFiltered(true)
                setLoading(false);
            }
        };
        loadData();
    }, [errorMessage, filter.datefrom, filter.dateto, filter.partemail, filter.partname, filterChanged, h_id, hasFiltered, id, rows.length]);

    function buildFileName()
    {
        return "download_H"+(h_id ?? "0")+"_I"+(id ?? "0" )+"_D"+Date.now()+".csv";
    }

    function renderMain() {

        const columns = [
            { title: Translate("Dátum"), field: "date_time", selectitem: [] },
            { title: Translate("Páciens"), field: "username", selectitem: [] },
            { title: Translate("Email"), field: "email", selectitem: [] },
            { title: Translate("Kérdőív"), field: "title", selectitem: [] },
            { title: Translate("Kérdés"), field: "question", selectitem: [] },
            {
                title: Translate("Kérdés típus"), field: "questiontype", selectitem: [
                    { value: "caption", text: Translate("Felirat") },
                    { value: "star", text: Translate("Csillag") },
                    { value: "text", text: Translate("Szöveg") }
                ]
            },
            { title: Translate("Értékelés"), field: "answer_text", selectitem: [] },
        ];

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFilter({ ...filter, [name]: value });
        }
        const handleSubmit = (e) => {
            e.preventDefault();
            setFilterChanged(true);

        }
        return (<>
            <div class="container">
                <form onSubmit={handleSubmit}>
                    <MainPanelCenter>
                        <hr class="mt-2 mb-2 border border-primary border-2" />
                        <h3>{Translate("Szűrő")}</h3>
                    </MainPanelCenter>

                    <CtrlInput
                        name="datefrom"
                        placeholder={Translate("Dátumtól")}
                        label={Translate("Dátumtól")}
                        value={filter.datefrom}
                        type="date"
                        setValue={handleChange} />
                    <CtrlInput
                        name="dateto"
                        placeholder={Translate("Dátumig")}
                        label={Translate("Dátumig")}
                        value={filter.dateto}
                        type="date"
                        setValue={handleChange} />

                    <CtrlInput
                        name="partname"
                        placeholder={Translate("Név része")}
                        label={Translate("Név része")}
                        value={filter.partname}
                        setValue={handleChange} />
                    <CtrlInput
                        name="partemail"
                        placeholder={Translate("Email része")}
                        label={Translate("Email része")}
                        value={filter.partemail}
                        setValue={handleChange} />
                    <MainPanelCenter>
                        <CtrlButton>
                            {Translate("Szűrés")}
                        </CtrlButton>
                        {
                            rows.length > 0 && rows[0].title !== Translate("Nem történt bejegygzés") &&
                            <CtrlButton onClicked={() => ExportCSV(rows, buildFileName())}>
                                {Translate("Exportálás")}
                            </CtrlButton>
                        }
                        <hr class="mt-2 mb-2 border border-primary border-2" />
                    </MainPanelCenter>
                </form>
            </div>
            {hasFiltered &&
                <CtrlList columns={columns} rows={rows} />
            }
        </>
        );

    }

    function renderResult() {
        return errorMessage !== "" ? <ErrorPage errorMessage={errorMessage} />
            : renderMain();
    }

    return (loading === true) ? <Loader /> : renderResult()
}

