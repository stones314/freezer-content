import { useState, useEffect, useRef } from "react";
import { SheetApi } from './SheetApiClass.js'
import { IMG } from './Consts.js';
import StringInput from './StringInput.jsx';
import Fryser from './FryserMain.js';
import Cookies from "universal-cookie";
import './App.css';

const LOADING = 0;
const READY = 1;
const SAVING = 2;

function App() {
  const cookies = new Cookies();
  const [pageState, setPageState] = useState(LOADING);
  const [pwd, setPwd] = useState(cookies.get("lastPwd") ? cookies.get("lastPwd") : "");
  const [pwdErr, setPwdErr] = useState("");
  const [hasLoggedIn, setHasLoggedIn] = useState(mayEdit());
  const [errMsg, setErrMsg] = useState("");
  const [rows, setRows] = useState([]);
  const sheetApi = useRef(null);

  useEffect(() => {
    sheetApi.current = new SheetApi();
    sheetApi.current.loadSheetData(onDataLoaded);
  }, []);

  function onDataLoaded() {
    const data = sheetApi.current.getRows();
    setRows(data);
    setPageState(READY);
  }

  function mayEdit() {
    return (pwd === process.env.REACT_APP_EDIT_PWD);
  }

  function onPwdChange(p) {
    setPwd(p);
  }
  function onLogin(withPwd) {
    if (!withPwd) {//login only to look, no edit
      cookies.set("lastPwd", "", { path: "/" });
      setPwdErr("");
      setHasLoggedIn(true);
      return;
    }
    //trying to edit, requre correct pwd:
    if (mayEdit()) {//Correct pwd was entered
      cookies.set("lastPwd", pwd, { path: "/" });
      setPwdErr("");
      setHasLoggedIn(true);
    }
    else {//Wrong pwd was entered
      setPwdErr("Feil passord!");
    }
  }
  function renderLogin() {
    return (
      <div className='narrow center col'>
        <img className="btn-img" src={IMG["Div"]} alt="snowflake" />
        Rygg Gårds fryserinnhald :)
        <div className={"add_hp"}></div>
        Skriv passord for å kunne gjere endringer.<br />
        Hopp over om du bare vil kikke :)
        <div className={"add_hp"}></div>
        <div className={""}>
          <StringInput
            description={""}
            type="password"
            editVal={pwd}
            errorMsg={pwdErr}
            onChange={(newValue) => onPwdChange(newValue)}
            onEnterDown={(e) => { e.preventDefault(); onLogin(true) }}
          />
        </div>
        <div className={"add_hp"}></div>
        <div className={"row mid add_hp"}>
          OK:
          <img className="btn-img" src={IMG["save"]} alt="snowflake" onClick={() => onLogin(true)} />
        </div>
        <div className={"add_hp"}></div>
        <div className={"row mid add_hp"}>
          Hopp over:
          <img className="btn-img" src={IMG["save"]} alt="snowflake" onClick={() => onLogin(false)} />
        </div>
      </div>
    );
  }

  function onUpdateRowFrys(row_id, name, value, cat, extra) {
    setPageState(SAVING);
    sheetApi.current.updateFryserRow(row_id, name, value, cat, extra, (msg) => {
      if (msg === "save") {
        onDataLoaded();
        setErrMsg("");
      }
      else if (msg === "delete") {
        onDataLoaded();
        setErrMsg("");
      }
      else {
        sheetApi.current.setNewVal("Antall", row_id, rows[row_id].Antall);
        setRows(rows);
        setErrMsg(msg);
      }
      setPageState(READY);
    });
  }

  function onNewRowFrys(navn, antall, cat, extra) {
    setPageState(SAVING);
    sheetApi.current.addNewFryserRow(navn, antall, cat, extra, (err) => {
      if (err !== "") {
        //error at add row...
      }
      else {
        onDataLoaded();
      }
      setErrMsg(err);
      setPageState(READY);
    });
  }

  function renderErrorMsg() {
    if (errMsg !== "") {
      return (<div>{errMsg}</div>);
    }
    return null;
  }

  function renderBody() {
    if (pageState === SAVING) {
      return (
        <div className="col">
          <img className="App-logo" src={IMG["Div"]} alt="snowflake" />
          Saving...
        </div>
      );
    }
    return (<Fryser
        rows={rows[0]}
        mayEdit={mayEdit()}
        onNewRowFrys={(n, a, c, e) => onNewRowFrys(n, a, c, e)}
        onUpdateRowFrys={(i, n, v, c, e) => onUpdateRowFrys(i, n, v, c, e)}
      />
    );
  }

  if (!hasLoggedIn) {
    return (
      <div className="narrow col center trans-mid">
        {renderLogin()}
      </div>
    )
  }

  if (pageState === LOADING) {
    return (
      <div className="narrow col center trans-mid">
        <img className="App-logo" src={IMG["Div"]} alt="snowflake" />
      </div>
    );
  }

  return (
    <div className="narrow col center trans-mid">
      {renderErrorMsg()}
      {renderBody()}
    </div>
  );
}

export default App;
