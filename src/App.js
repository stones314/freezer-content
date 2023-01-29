import { useState, useEffect, useRef } from "react";
import { SheetApi } from './SheetApiClass.js'
import { Filter } from './Filter.js'
import { Row } from './Row.js'
import { IMG, isBase } from './Consts.js';
import StringInput from './StringInput.jsx';
import { AddRow } from './AddRow.js';
import Cookies from "universal-cookie";
import './App.css';

const LOADING = 0;
const READY = 1;
const SAVING = 2;

const NO_SPES = 0;
const BRUK = 1;
const HELG = 2;
const RASK = 3;
const BASE = 4;

function App() {
  const cookies = new Cookies();
  const [pageState, setPageState] = useState(LOADING);
  const [pwd, setPwd] = useState(cookies.get("lastPwd") ? cookies.get("lastPwd") : "");
  const [pwdErr, setPwdErr] = useState("");  
  const [hasLoggedIn, setHasLoggedIn] = useState(mayEdit());
  const [errMsg, setErrMsg] = useState("");
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [filterKat, setFilterKat] = useState("");
  const [spes, setSpes] = useState(NO_SPES);
  const [addNew, setAddNew] = useState(false);
  const [cats, setCats] = useState([]);
  const sheetApi = useRef(null);

  useEffect(() => {
    sheetApi.current = new SheetApi();
    sheetApi.current.loadSheetData(onDataLoaded);
  }, []);

  function onDataLoaded() {
    const data = sheetApi.current.getRows();
    setRows(data);
    var categories = [];
    for (const [i, r] of data.entries()) {
      if (!categories.includes(r.Kategori)) {
        categories.push(r.Kategori);
      }
    }
    setCats(categories);
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
        Skriv passord for å kunne gjere endringer.<br/>
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

  function isFiltered(row) {
    if (filterKat !== "" && row.Kategori !== filterKat) return true;//eliminated by category filter!
    if (spes === BASE && !isBase(row.Basisvare)) return true;//eliminated by Basisvare filter
    if (spes === BRUK && row.BrukeOpp !== "x") return true;//eliminated by BrukOpp filter
    if (spes === RASK && row.Ferdigmiddag !== "x") return true;//eliminated by Ferdigmiddag filter
    if (spes === HELG && row.Helgemiddag !== "x") return true;//eliminated by Helgemiddag filter
    return false;
  }

  function renderRows() {
    var rowData = [];
    for (const [i, r] of rows.entries()) {
      if (isFiltered(r)) continue;
      rowData.push(
        <Row key={i}
          row={r}
          row_id={i}
          cats={cats}
          onSave={(name, val, cat, extra) => onSave(i, name, val, cat, extra)}
          onSelect={() => onClickRow(i)}
          selected={selected}
        />
      );
    }
    return (
      <div className="narrow col">
        <div className="narrow col">
          {rowData}
        </div>
        <div className="narrow col add_h">

        </div>
      </div>
    )
  }

  function onClickRow(row_id) {
    if (!mayEdit()) return;
    if (selected === row_id) setSelected(-1);
    else setSelected(row_id)
  }

  function onClickCat(cat) {
    if (addNew) {
      setAddNew(false);
      return;
    }
    if (filterKat === cat) {
      setFilterKat("");
    }
    else {
      setFilterKat(cat);
    }
  }

  function onClickSpes(s) {
    if (addNew) {
      setAddNew(false);
      return;
    }
    if (spes === s) {
      setSpes(NO_SPES);
    }
    else {
      setSpes(s);
    }
  }

  function onSave(row_id, name, value, cat, extra) {
    setPageState(SAVING);
    sheetApi.current.saveNewVal(row_id, name, value, cat, extra, (msg) => {
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
      setSelected(-1);
    });
  }

  function onNewRow(navn, antall, cat, extra) {
    setAddNew(false);
    setPageState(SAVING);
    sheetApi.current.addNewRow(navn, antall, cat, extra, (err) => {
      if (err !== "") {
        //error at add row...
      }
      else {
        onDataLoaded();
      }
      setErrMsg(err);
      setPageState(READY);
      setSelected(-1);
    });
  }

  function renderErrorMsg() {
    if (errMsg !== "") {
      return (<div>{errMsg}</div>);
    }
    return null;
  }

  function renderBody() {
    if (addNew) {
      return (
        <AddRow
          cats={cats}
          onSave={(navn, antall, cat, extra) => onNewRow(navn, antall, cat, extra)}
        />
      );
    }
    if (pageState === SAVING) {
      return (
        <div className="col">
          <img className="App-logo" src={IMG["Div"]} alt="snowflake" />
          Saving...
        </div>
      );
    }
    return (renderRows());
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
      <Filter
        kat={filterKat}
        categories={cats}
        base={spes === BASE}
        bruk={spes === BRUK}
        helg={spes === HELG}
        rask={spes === RASK}
        addNew={addNew}
        mayEdit={mayEdit()}
        setAddNew={(x) => setAddNew(x)}
        onClickCat={(cat) => onClickCat(cat)}
        onClickBase={() => onClickSpes(BASE)}
        onClickBruk={() => onClickSpes(BRUK)}
        onClickHelg={() => onClickSpes(HELG)}
        onClickRask={() => onClickSpes(RASK)}
      />
      {renderBody()}
    </div>
  );
}

export default App;
