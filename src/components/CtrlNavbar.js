import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Translate, GetLanguages } from "../core_utils/utils";
import GlobalParams from "../pages/GlobalParams.js";
import { Loader } from "./Loader.js";
import { SqlCommandRequest, SqlCommandResponse } from "../apicalls/APICallsClasses.js";
import APICall from "./APICall.js";
import { ErrorPage } from "../pages/ErrorPage.js";


export default function CtrlNavbar() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrormessage] = useState("");
  const [questionHeads, setQuestionHeads] = useState();
  

  var setLanguage = GlobalParams.setLanguage;

  const [countries] = useState(GetLanguages().map((item) => {
    item.title = Translate(item.title, "");
    return item;
  }
  ));
  const [toggleContents, setToggleContents] = useState(Translate("Magyar"));


  useEffect(() => {
    const loadQuestionHead = async () => {
      setLoading(true);
      const sqlCommand = new SqlCommandRequest("SELECT * FROM questionhead WHERE 1");
      const results = await APICall(sqlCommand);
      if (results.errorcode !== 0) {
        const error = results.data[0]["message"];
        setErrormessage(error);
      } else {
        const datas = new SqlCommandResponse(results.data);
        setQuestionHeads(datas);
      }
      setLoading(false);
    };
    loadQuestionHead();
  }, [errorMessage]);

  function renderResult() {
    return errorMessage !== "" ? <ErrorPage errorMessage={errorMessage} />
      : <Navbar bg="dark" variant="dark" expand="lg" >
        <Container>
          <Navbar.Brand href="/">
            {Translate("Betegelegedettségi kérdőív")}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title={Translate("Lehetőségek")} id="basic-nav-dropdown">
                <NavDropdown.Item key="home" href="https://endo-kapszula.com/">
                  {Translate("Honlap")}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {
                  questionHeads.data.map((item) => {
                    return (
                      <NavDropdown.Item key="question" href={"/Questionnaire?h_id=" + item['id']}>
                        {Translate(item['title'])}
                      </NavDropdown.Item>
                    );
                  })
                }
                <NavDropdown.Divider />
                <NavDropdown.Item key="admin" href="/Admin">
                  {Translate("Kérdőívek lekérdezése")}
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={toggleContents} id="basic-nav-dropdown">
                {
                  countries.map(({ code, title }) => {
                    return <NavDropdown.Item
                      href="#"
                      key={code}
                      onClick={() => {
                        if (setLanguage !== undefined) { setLanguage(code); }
                        GlobalParams.language = code;
                        setToggleContents(Translate(title, code));
                      }}
                    >{title}</NavDropdown.Item>
                  })
                }
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  }

  return (
    (loading === true) ? <Loader /> : renderResult()
  );
}

