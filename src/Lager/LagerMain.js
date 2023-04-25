import { useState } from "react";
import { FilterLager } from './FilterLager.js'
import { RowLager } from './RowLager.js'
import { AddRowLager } from './AddRowLager.js';
import './../App.css';

const cats = [
    "Bakevarer",
    "Hermetikk",
    "PastaRis",
    "Turmat"
]

function Lager(props) {
  const [selected, setSelected] = useState(-1);
  const [filterKat, setFilterKat] = useState("");
  const [addNew, setAddNew] = useState(false);

  function isFiltered(row) {
    if (filterKat !== "" && row.Kategori !== filterKat) return true;//eliminated by category filter!
    return false;
  }

  function renderRows() {
    var rowData = [];
    for (const [i, r] of props.rows.entries()) {
      if (isFiltered(r)) continue;
      rowData.push(
        <RowLager key={i}
          row={r}
          row_id={i}
          cats={cats}
          onSave={(name, val, cat, basis) => onSave(i, name, val, cat, basis)}
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

  function onSave(row_id, name, value, cat, basis) {
    props.onUpdateRowLager(row_id, name, value, cat, basis);
    setSelected(-1);
  }

  function onNewRow(navn, antall, cat, basis) {
    props.onNewRowLager(navn, antall, cat, basis);
    setAddNew(false);
    setSelected(-1);
  }

  function renderBody() {
    if (addNew) {
      return (
        <AddRowLager
          cats={cats}
          onSave={(navn, antall, cat, basis) => onNewRow(navn, antall, cat, basis)}
        />
      );
    }
    return (renderRows());
  }

  return (
    <div className="narrow col center trans-mid">
      <FilterLager
        kat={filterKat}
        categories={cats}
        addNew={addNew}
        mayEdit={props.mayEdit}
        setAddNew={(x) => setAddNew(x)}
        onClickCat={(cat) => onClickCat(cat)}
      />
      {renderBody()}
    </div>
  );
}

export default Lager;
