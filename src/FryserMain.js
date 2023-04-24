import { useState } from "react";
import { Filter } from './Filter.js'
import { Row } from './Row.js'
import { isBase } from './Consts.js';
import { AddRow } from './AddRow.js';
import './App.css';

const NO_SPES = 0;
const BRUK = 1;
const HELG = 2;
const RASK = 3;
const BASE = 4;

const cats = [
    "Kjøtt",
    "Fisk",
    "Grønnsaker og fries",
    "Bær",
    "Brødmat",
    "Søtsaker",
    "Div"
]

function Fryser(props) {
  const [selected, setSelected] = useState(-1);
  const [filterKat, setFilterKat] = useState("");
  const [spes, setSpes] = useState(NO_SPES);
  const [addNew, setAddNew] = useState(false);

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
    for (const [i, r] of props.rows.entries()) {
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
    if (!props.mayEdit) return;
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
    props.onUpdateRowFrys(row_id, name, value, cat, extra);
    setSelected(-1);
  }

  function onNewRow(navn, antall, cat, extra) {
    props.onNewRowFrys(navn, antall, cat, extra);
    setAddNew(false);
    setSelected(-1);
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
    return (renderRows());
  }

  return (
    <div className="narrow col center trans-mid">
      <Filter
        kat={filterKat}
        categories={cats}
        base={spes === BASE}
        bruk={spes === BRUK}
        helg={spes === HELG}
        rask={spes === RASK}
        addNew={addNew}
        mayEdit={props.mayEdit}
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

export default Fryser;
