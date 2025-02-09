import { SqlCommandRequest, SqlCommandResponse, EmailCommandRequest } from "../apicalls/APICallsClasses.js"
import APICall from "../components/APICall.js"
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader.js";
import { ErrorPage } from "./ErrorPage.js";
import { Translate } from "../core_utils/utils.js";
import PopupModal from "./PopupModal.js";
import PageSkelton from "./PageSkelton.js";
import { useNavigate } from "react-router-dom";
import CtrlInput from "../components/CtrlInput.js";
import CtrlQuestionItem from "../components/CtrlQuestionItem.js";
import CtrlButton from "../components/CtrlButton.js";
import { MainPanelCenter, MainPanel } from "../components/CtrlPanels.js";
import RenderEmailBody from "../components/RenderEmailBody.js";
import { renderToStaticMarkup } from "react-dom/server"

export default function Questionnaire() {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [errorMessage, setErrormessage] = useState("");
    const [show, setShow] = useState(false);
    const [zeroQuestion, setZeroQuestion] = useState(false);
    const initValues = { userName: "", userEmail: "" };
    const [formValues, setFormValues] = useState(initValues);
    const [formErrors, setFormErrors] = useState({});
    const [resultDatas, setResultDatas] = useState();

    const navigate = useNavigate();
    
    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            const queryParams = new URLSearchParams(window.location.search);
            const h_id = queryParams.get('h_id');
            const sqlCommand = new SqlCommandRequest("SELECT * FROM questions WHERE h_id=" + h_id);
            const results = await APICall(sqlCommand);
            if (results.errorcode !== 0) {
                const error = results.data[0]["message"];
                setErrormessage(error);
            } else {
                const datas = new SqlCommandResponse(results.data);
                if (datas.data.length !== 0) {
                    const expandedArray = datas.data.map((item) => {
                        return { ...item, "star": 2.5, "text": "" }
                    });
                    setResultDatas(expandedArray);
                } else {
                    setResultDatas([{ "id": 0, "question": Translate("A kérdőívhez nincsenek kérdések rögzítve!"), "questiontype": "caption", "star": 2.5, "text": "" }]);
                    setZeroQuestion(true);
                }
            }
            setLoading(false);
        };
        loadPost();
    }, [errorMessage]);


    useEffect(() => {
        async function addUser() {
            const sqlCommand = new SqlCommandRequest("INSERT INTO users ( username, email, usertype ) VALUES ( '" + formValues.userName + "', '" + formValues.userEmail + "', 'patient');");
            const results = await APICall(sqlCommand);
            if (results.errorcode !== 0) {
                const error = results.data[0]["message"];
                setErrormessage(error);
            } else {
                const datas = new SqlCommandResponse(results.data);
                return datas.data[0]["lastid"];
            }
            return 0;
        };

        async function addAnswer(p_id, q_id, answer, now) {
            const sqlCommand = new SqlCommandRequest("INSERT INTO answers ( p_id, q_id, date_time, answer_text ) VALUES ( " + p_id + ", " + q_id + ", '" + now + "', '" + answer + "');");
            const results = await APICall(sqlCommand);
            if (results.errorcode !== 0) {
                const error = results.data[0]["message"];
                setErrormessage(error);
            } else {
                const datas = new SqlCommandResponse(results.data);
                return datas.data[0]["lastid"];
            }
            return 0;
        };


        const sendPost = async () => {
            if (sending) {
                setLoading(true);
                const sqlCommand = new SqlCommandRequest("SELECT * FROM users WHERE username='" + formValues.userName + "' AND email='" + formValues.userEmail + "'");
                const results = await APICall(sqlCommand);
                if (results.errorcode !== 0) {
                    const error = results.data[0]["message"];
                    setErrormessage(error);
                } else {
                    const datas = new SqlCommandResponse(results.data);
                    let p_id;
                    if (datas.data.length === 0) {
                        p_id = await addUser();
                    } else {
                        p_id = datas.data[0]["id"];
                    }
                    const now = new Date(Date.now()).toLocaleString();
                    for (let index = 0; index < resultDatas.length; index++) {
                        const item = resultDatas[index];
                        switch (item.questiontype) {
                            case "star": await addAnswer(p_id, item.id, item.star, now);
                                break
                            case "text": await addAnswer(p_id, item.id, item.text, now);
                                break
                            default:
                                break
                        }
                    }
                    const body = RenderEmailBody(formValues.userName, resultDatas);
                    const staticElement = renderToStaticMarkup(body);
                    const emailCommand = new EmailCommandRequest(formValues.userEmail, Translate("Betegelegedettségi kérdőív"), staticElement);
                    await APICall(emailCommand);
                }
                setLoading(false);
                setSending(false);
                setShow(true);
            }
        };
        sendPost();
    }, [resultDatas, sending, formValues, errorMessage]);


    

    function ratingChanged(value, id) {
        
        const datas = [...resultDatas];
        const index = datas.findIndex(item => item.id === id);
        if (datas[index].questiontype === "star") {
            datas[index].star = value;
        } else {
            datas[index].text = value;
        }
        setResultDatas(datas);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            setSending(true);
        }
    }

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.userName) {
            errors.userName = Translate("A név mező kitöltése kötelező!");
        }
        if (!values.userEmail) {
            errors.userEmail = Translate("A név email kitöltése kötelező!");
        } else if (!regex.test(values.userEmail)) {
            errors.userEmail = Translate("Helytelen email formátum!");
        }
        return errors;
    }

    function renderSubmit() {
        return (
            <div class="container">
                <form onSubmit={handleSubmit}>
                    <MainPanelCenter>
                        <hr class="mt-2 mb-2 border border-primary border-2" />
                        <h3>{Translate("Kérdőív beküldése")}</h3>
                    </MainPanelCenter>
                    <CtrlInput
                        name="userName"
                        placeholder={Translate("Az ön neve")}
                        label={Translate("Az ön neve")}
                        value={formValues.userName}
                        setValue={handleChange} />
                    <span class="text-danger">
                        <div>
                            {formErrors.userName}
                        </div>
                    </span>
                    <CtrlInput
                        name="userEmail"
                        placeholder={Translate("E-mail")}
                        label={Translate("E-mail")}
                        value={formValues.userEmail}
                        setValue={handleChange} />
                    <span class="text-danger">
                        <div>
                            {formErrors.userEmail}
                        </div>
                    </span>
                    <MainPanelCenter>
                        <CtrlButton>
                            {Translate("Beküldés")}
                        </CtrlButton>
                        <hr class="mt-2 mb-2 border border-primary border-2" />
                    </MainPanelCenter>
                </form>
            </div>
        );
    }

    function handleClose() {
        setShow(false);
        navigate("/");
    }

    function renderQuestions() {
        const result = resultDatas.map((item) => {
            return CtrlQuestionItem(item.id, item.question, item.questiontype, ratingChanged, item.questiontype === "text" ? item.text : item.star )
        });
        return (
            <MainPanel>
                {result}
                {!zeroQuestion && renderSubmit()}
                <PopupModal title={Translate("Sikeres beküldés")} show={show} handleClose={handleClose}>
                    {Translate("Nagyra értékeljük a visszajelzését, hamarosan egy összefoglaló emailt fog kapni válaszai alapján!")}
                </PopupModal>
            </MainPanel>
        );
    }

    function renderResult() {
        return errorMessage !== "" ? <ErrorPage errorMessage={errorMessage} />
            : renderQuestions(resultDatas);
    }

    return <PageSkelton>
        {(loading === true) ? <Loader /> : renderResult()}
    </PageSkelton>
}