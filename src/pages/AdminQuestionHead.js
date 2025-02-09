import { useState, useEffect } from "react";
import { CtrlMainCard } from "../components/CtrlMainCard.js";
import { Translate } from "../core_utils/utils.js";
import { MainPanel, MainPanelCenter } from "../components/CtrlPanels.js";
import PopupModal from "./PopupModal.js";
import CtrlList from "../components/CtrlList/CtrlList.js";
import CtrlButton from "../components/CtrlButton.js";
import EditQuestionHeader from "./EditQuestionHeader.js";
import { ErrorPage } from "./ErrorPage.js";
import { Loader } from "../components/Loader.js";
import { SqlCommandRequest } from "../apicalls/APICallsClasses.js";
import APICall from "../components/APICall.js";
import ReportAnswers from "./ReportAnswers.js";

export default function AdminQuestionsHead({ loggedUserId, token }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrormessage] = useState("");
    const [rows, setRows] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [reportId, setReportId] = useState(0);

    const columns = [
        { title: Translate("Kérdőív"), field: "title", selectitem: [] }
    ];
    useEffect(() => {
        const loadData = async () => {
            if (rows.length === 0) {
                setLoading(true);
                const sqlCommand = new SqlCommandRequest("SELECT * FROM questionhead WHERE 1");
                const results = await APICall(sqlCommand);
                if (results.errorcode !== 0) {
                    const error = results.data[0]["message"];
                    setErrormessage(error);
                } else {
                    setRows(results.data)
                }
                setLoading(false);
            }
        };
        loadData();
    }, [errorMessage, rows.length]);


    function deleteDB(item, idx, targetIndex) {
        if (idx !== targetIndex) return true;
        const deleteData = async (id) => {
            const sqlCommand = new SqlCommandRequest("DELETE FROM questionhead WHERE id=" + id);
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

    function handleHeadClose() {
        setShowModal(false)
    }

    function handleReportClose() {
        setReportId(0);
    }


    function handleAdd() {
        setRowToEdit(null);
        setShowModal(true);
    }

    function handlePrintRow(idx) {
        setReportId(rows[idx].id);
    }

    function renderMain() {
        const data = (rowToEdit ?? 0) === 0 ? { id: 0, title: "" } : rows[rowToEdit];
        return (
            reportId === 0 ?
                <>
                    <PopupModal title={Translate("Kérdőív")} show={showModal} handleClose={handleHeadClose} hideButton={true}>
                        <EditQuestionHeader parentHandleSubmit={handleSubmit} columns={columns} show={showModal} initValues={data} />
                    </PopupModal>
                    <MainPanel>
                        <CtrlMainCard title={Translate("Adminisztrátori felület")} >
                            <CtrlList columns={columns} rows={rows} deleteRow={handleDeleteRow} editRow={handleEditRow} printRow={handlePrintRow} />
                            <MainPanelCenter>
                                <CtrlButton onClicked={() => handleAdd()}>{Translate("Új kérdőív")}</CtrlButton>
                            </MainPanelCenter>
                        </CtrlMainCard>
                    </MainPanel>
                </>
                : 
                <MainPanel>
                    <CtrlMainCard title={Translate("Adminisztrátori felület")} >
                        <PopupModal title={Translate("Kérdőív")} show={true} handleClose={handleReportClose} hideButton={true} size={"xl"}>
                            <ReportAnswers h_id={reportId} />
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

