import { useState, useEffect, useRef } from "react";
import { SheetApi } from './SheetApiClass.js'
import { Filter } from './Filter.js'
import { Row } from './Row.js'
import { IMG, isBase } from './Consts.js';
import { AddRow } from './AddRow.js';
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

  const [pageState, setPageState] = useState(LOADING);
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
    sheetApi.current.setNewVal(row_id, name, value, cat, extra);
    sheetApi.current.saveChanges(row_id, (msg) => {
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

  if (pageState === LOADING) {
    return (
      <div className="App">
        <img className="App-logo" src={IMG["Div"]} alt="snowflake" />
      </div>
    );
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
