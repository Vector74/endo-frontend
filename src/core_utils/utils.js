import * as React from "react";
import dictionary from "../assets/dictionary.json";
import appsettings from "../assets/appsettings.json";
import languages from "../assets/languages.json";
import FlagIconFactory from "react-flag-icon-css";
import GlobalParams from "../pages/GlobalParams.js";

export const Translate = function (source) {

    const foundItem = dictionary.filter((item) => {
        return item.source.toLowerCase() === source.toLowerCase();
    });
    const lang = ((GlobalParams.language ?? "") !== "") ? GlobalParams.language.toLowerCase() : appsettings.lang.toLowerCase();
    const translatedText = foundItem.length > 0 ?
        foundItem[0].targets.filter((item) => {
            return item.code.toLowerCase() === lang;
        }) : null;

    const finalText = (translatedText != null) && (translatedText.length > 0) ? translatedText[0].text : source;
    return finalText;
}

export const GetLang = function () {
    return appsettings.lang;
}

export const GetLanguages = function () {
    return languages;
}

export const GetAPIUrl = function () {
    return appsettings.apiurl;
}


export const FlagIcon = FlagIconFactory(React, { useCssModules: false })




