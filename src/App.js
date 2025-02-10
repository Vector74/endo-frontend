import React, { useState } from "react";
import "./App.css";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Questionnaire from "./pages/Questionnaire.js";
import Home from "./pages/Home.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GetLang } from "./core_utils/utils.js";
import GlobalParams from "./pages/GlobalParams.js";
import AdminLoginScreen from "./pages/AdminLoginScreen.js";

function App() {
    const [language, setLanguage] = useState(GetLang());
    GlobalParams.language = language;
    GlobalParams.setLanguage = setLanguage;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Questionnaire" element={<Questionnaire />} />
                <Route path="/Admin" element={<AdminLoginScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
