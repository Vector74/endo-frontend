import { SqlCommandRequest, SqlCommandResponse } from "../apicalls/APICallsClasses.js"
import APICall from "../components/APICall.js";
import { useEffect, useState } from "react";
import { ErrorPage } from "./ErrorPage.js";
import { Translate } from "../core_utils/utils.js";
import CtrlInput from "../components/CtrlInput.js";
import { MainPanel } from "../components/CtrlPanels.js";
import CtrlButton from "../components/CtrlButton.js";

export default function EditQuestionHeader({ initValues, columns, parentHandleSubmit }) {
    const [isSubmit, setIsSubmit] = useState(false);
    const [errorMessage, setErrormessage] = useState("");
    const [formValues, setFormValues] = useState(initValues ?? { id: 0, title: "" });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const sendPost = async () => {
            if (isSubmit) {
                const sqlCommand = formValues.id === 0 ?
                    new SqlCommandRequest("INSERT INTO questionhead ( title ) VALUES (  '" + formValues.title + "' );") :
                    new SqlCommandRequest("UPDATE questionhead SET title = '" + formValues.title + "' WHERE id=" + formValues.id);
                const results = await APICall(sqlCommand);
                const datas = new SqlCommandResponse(results.data);
                const ok = results.errorcode === 0;
                if (!ok) {
                    const error = results.data[0]["message"];
                    setErrormessage(error);
                }
                setIsSubmit(false);
                if (ok && parentHandleSubmit !== undefined) {
                    formValues.id = formValues.id !== 0 ? formValues.id : datas.data[0]["lastid"]
                    parentHandleSubmit(formValues);
                }

            }
        };
        sendPost();
    }, [formValues, errorMessage, isSubmit, parentHandleSubmit]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = await validate(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            setIsSubmit(true);
        }
    }

    const validate = async (values) => {
        const errors = {};
        if (!values.title) {
            errors.title = Translate("A kérdőív címe mező kitöltése kötelező!");
        }
        const where = values.id !== 0 ? " AND id <> " + values.id : "";
        const sqlCommand = new SqlCommandRequest("SELECT * FROM questionhead WHERE title='" + values.title + "'" + where);
        const results = await APICall(sqlCommand);
        if (results.errorcode !== 0) {
            const error = results.data[0]["message"];
            setErrormessage(error);
        } else if (results.data.length > 0) {
            errors.title = Translate("A kérdőív címe már szerepel a törzsben!");
        }
        return errors;
    }


    function renderMain() {
        return (
            <MainPanel>
                <div class="container">
                    <form onSubmit={handleSubmit}>
                        {
                            columns.map((item) => {
                                return (<>
                                    <CtrlInput
                                        name={item.field}
                                        placeholder={item.title}
                                        value={formValues[item.field]}
                                        setValue={handleChange}
                                        items={item.selectitem} />
                                    <p class="text-danger">
                                        {formErrors[item.field]}
                                    </p>
                                </>)
                            })
                        }
                        <CtrlButton >
                            {Translate("Mentés")}
                        </CtrlButton>
                    </form>
                </div>
            </MainPanel>
        );
    }


    return errorMessage !== "" ? <ErrorPage errorMessage={errorMessage} />
        : renderMain();

}