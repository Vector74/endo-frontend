import PageSkelton from "./PageSkelton.js"
import { CtrlMainCard } from "../components/CtrlMainCard.js";
import { Translate } from "../core_utils/utils.js";
import { MainPanelCenter } from "../components/CtrlPanels.js";
import { useState, useEffect } from "react";
import CtrlInput from "../components/CtrlInput.js";
import CtrlButton from "../components/CtrlButton.js";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader.js";
import { LoginCommandRequest } from "../apicalls/APICallsClasses.js";
import APICall from "../components/APICall.js";
import { ErrorPage } from "./ErrorPage.js";
import AdminPage from "./AdminPage.js";


export default function AdminLoginScreen() {
    const initValues = { userEmail: "", psw: "" };
    const [formValues, setFormValues] = useState(initValues);
    const [formErrors, setFormErrors] = useState({});
    const [errorMessage, setErrormessage] = useState("");
    const [tryLogin, setTryLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const loggedUserInitValues = { id: 0, token: "" };
    const [loggedUser, setLoggedUser] = useState(loggedUserInitValues);

    const navigate = useNavigate();

    function onBackClick() {
        navigate("/");
    }

    useEffect(() => {
        const doLogin = async () => {
            if (tryLogin) {
                setLoading(true);
                const command = new LoginCommandRequest(formValues.userEmail, formValues.psw);
                const results = await APICall(command);
                setLoading(false);
                if (results.errorcode !== 0) {
                    const error = results.data[0]["message"];
                    setErrormessage(error);
                } else {
                    const loggedUser = { id: results.data[0]["id"], token: results.data[0]["token"] };
                    setLoggedUser(loggedUser);
                }
            }
        };
        doLogin();
    }, [formValues.psw, formValues.userEmail, tryLogin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            setTryLogin(true);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.psw) {
            errors.psw = Translate("A jelszó mező kitöltése kötelező!");
        } else if (values.psw.length < 4) {
            errors.psw = Translate("A jelszó legalább 4 karakter hosszú legyen!");
        } else if (values.psw.length > 20) {
            errors.psw = Translate("A jelszó maximális hossza 20 karakter!");
        }
        if (!regex.test(values.userEmail)) {
            errors.userEmail = Translate("Helytelen email formátum!");
        }
        return errors;
    }

    function renderResult() {
        return errorMessage !== "" ? <ErrorPage errorMessage={errorMessage} />
            : loggedUser.id === 0 ?
                <CtrlMainCard title={Translate("Belépés az adminisztrátori felületre")} >
                    <div class="container">
                        <form onSubmit={handleSubmit}>
                            <MainPanelCenter>
                                <hr class="mt-2 mb-2 border border-primary border-2" />
                            </MainPanelCenter>
                            <CtrlInput
                                name="userEmail"
                                placeholder={Translate("Az ön neve")}
                                label={Translate("Az ön neve")}
                                value={formValues.userEmail}
                                setValue={handleChange} />
                            <span class="text-danger">
                                <div>
                                {formErrors.userEmail}
                                </div>
                            </span>
                            <CtrlInput
                                name="psw"
                                placeholder={Translate("Jelszó")}
                                label={Translate("Jelszó")}
                                value={formValues.psw}
                                setValue={handleChange}
                                type="password" />
                            <span class="text-danger">
                                <div>
                                {formErrors.psw}
                                </div>
                            </span>
                            <MainPanelCenter>
                                <CtrlButton>
                                    {Translate("Belépés")}
                                </CtrlButton>
                                <CtrlButton onClicked={onBackClick}>
                                    {Translate("Mégsem")}
                                </CtrlButton>
                                <hr class="mt-2 mb-2 border border-primary border-2" />
                            </MainPanelCenter>
                        </form>
                    </div>
                </CtrlMainCard> :
                <AdminPage loggedUserId={loggedUser.id} token={loggedUser.token} />;
    }

    return <PageSkelton>
        {(loading === true) ? <Loader /> :
            renderResult()}
    </PageSkelton>
}