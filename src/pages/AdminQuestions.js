import { useState, useEffect } from "react";
import { CtrlMainCard } from "../components/CtrlMainCard.js";
import { Translate } from "../core_utils/utils.js";
import { MainPanel, MainPanelCenter } from "../components/CtrlPanels.js";
import PopupModal from "./PopupModal.js";
import CtrlList from "../components/CtrlList/CtrlList.js";
import CtrlButton from "../components/CtrlButton.js";
import EditQuestion from "./EditQuestion.js";
import { ErrorPage } from "./ErrorPage.js";
import { Loader } from "../components/Loader.js";
import { SqlCommandRequest } from "../apicalls/APICallsClasses.js";
import APICall from "../components/APICall.js";
import ReportAnswers from "./ReportAnswers.js";


export default function AdminQuestions({ loggedUserId, token }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrormessage] = useState("");
    const [rows, setRows] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [columns, setColumns] = useState();
    const [reportId, setReportId] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            if (rows.length === 0) {
                setLoading(true);
                const sqlCommand = new SqlCommandRequest("SELECT * FROM questions WHERE 1");
                const results = await APICall(sqlCommand);
                if (results.errorcode !== 0) {
                    const error = results.data[0]["message"];
                    setErrormessage(error);
                } else {
                    const newCommand = new SqlCommandRequest("SELECT * FROM questionhead WHERE 1");
                    const qhResult = await APICall(newCommand);
                    if (qhResult.errorcode !== 0) {
                        const error = qhResult.data[0]["message"];
                        setErrormessage(error);
                    } else {

                        const newItems = qhResult.data.map((item) => {
                            return { value: item.id, text: Translate(item.title) }
                        });
                        const initColumns = [
                            { title: Translate("Kérdőív"), field: "h_id", selectitem: newItems },
                            { title: Translate("Kérdés"), field: "question", selectitem: [] },
                            {
                                title: Translate("Kérdés típus"), field: "questiontype", selectitem: [
                                    { value: "caption", text: Translate("Felirat") },
                                    { value: "star", text: Translate("Csillag") },
                                    { value: "text", text: Translate("Szöveg") }
                                ]
                            }
                        ];
                        setRows(results.data)
                        setColumns(initColumns);
                    }
                }
                setLoading(false);
            }
        };
        loadData();
    }, [errorMessage, rows.length]);


    function deleteDB(item, idx, targetIndex) {
        if (idx !== targetIndex) return true;
        const deleteData = async (id) => {
            const sqlCommand = new SqlCommandRequest("DELETE FROM questions WHERE id=" + id);
            const results = await APICall(sqlCommand);
            if (results.errorcode !== 0) {
                const error = results.data[0]["message"];
                setErrormessage(error);
            }
        }
        deleteData(item['id']);
        return false;
    }

    const handleDeleteRow = (targetIndex) => {
        setRows(rows.filter((item, idx) => {
            return deleteDB(item, idx, targetIndex)
        }));
    };

    const handleEditRow = (idx) => {
        setRowToEdit(idx);
        setShowModal(true);
    };

    const handleSubmit = (newRow) => {
        if (rowToEdit === null) {
            setRows([...rows, newRow])
            setShowModal(false)
        }
        else {
            setRows(
                rows.map((currRow, idx) => {
                    if (idx !== rowToEdit) return currRow;
                    return newRow;
                })
            );
            setShowModal(false)
        }
    };

    function handleClose() {
        setShowModal(false)
    }

    function handleAdd() {
        setRowToEdit(null);
        setShowModal(true);
    }

    function handlePrintRow(idx) {
        setReportId(rows[idx].id);
    }

    function handleReportClose() {
        setReportId(0);
    }

    function renderMain() {
        const data = (rowToEdit ?? 0) === 0 ? { id: 0, h_id: 1, question: "", questiontype: "caption" } : rows[rowToEdit];

        return (
            reportId === 0 ?
                <>
                    <PopupModal title={Translate("Kérdés")} show={showModal} handleClose={handleClose} hideButton={true}>
                        <EditQuestion parentHandleSubmit={handleSubmit} columns={columns} show={showModal} initValues={data} ></EditQuestion>
                    </PopupModal>
                    <MainPanel>
                        <CtrlMainCard title={Translate("Adminisztrátori felület (kérdések)")} >
                            <CtrlList columns={columns} rows={rows} deleteRow={handleDeleteRow} editRow={handleEditRow} printRow={handlePrintRow} />
                            <MainPanelCenter>
                                <CtrlButton onClicked={() => handleAdd()}>{Translate("Új kérdés")}</CtrlButton>
                            </MainPanelCenter>
                        </CtrlMainCard>
                    </MainPanel>
                </>
                : 
                <MainPanel>
                    <CtrlMainCard title={Translate("Adminisztrátori felület (kérdések)")} >
                        <PopupModal title={Translate("Kérdés")} show={true} handleClose={handleReportClose} hideButton={true} size={"xl"}>
                            <ReportAnswers id={reportId} />
                        </PopupModal>
                    </CtrlMainCard>
                </MainPanel>
        );
    }

    function renderResult() {
        return errorMessage !== "" ? <ErrorPage errorMessage={errorMessage} />
            : renderMain();
    }

    return (loading === true) ? <Loader /> : renderResult()
}

