import { IMG } from './Consts.js';
import './App.css';

export function Filter(props) {

    function renderAddRowBtn() {
        const bgcol = props.addNew ? " buy" : " sel";
        const sign = props.addNew ? "minus" : "pluss"
        return (
          <div className="f1 brd" onClick={() => props.setAddNew(!props.addNew)}>
            <img className={"btn-img" + bgcol} src={IMG[sign]} alt={sign} />
          </div>
        );
      }
    
    function renderCategories() {
        var catOpts = [];
        for (const [i, c] of props.categories.entries()) {
            const sel = props.kat === c ? " sel" : "";
            catOpts.push(
                <div className={"f1 brd" + sel} key={i} onClick={() => props.onClickCat(c)}>
                    <img className="btn-img" src={IMG[c]} alt={c} />
                </div>
            );
        }
        return (
            <div className="row">
                {catOpts}
            </div>
        )
    }

    function renderSpecial() {
        const a_sel = props.base ? " sel" : "";
        const b_sel = props.bruk ? " sel" : "";
        const h_sel = props.helg ? " sel" : "";
        const r_sel = props.rask ? " sel" : "";
        return (
            <div className="row">
                <div className={"f1 brd" + a_sel} onClick={() => props.onClickBase()}><img className="btn-img" src={IMG["base"]} alt="base" /></div>
                <div className={"f1 brd" + b_sel} onClick={() => props.onClickBruk()}><img className="btn-img" src={IMG["bruk"]} alt="bruk" /></div>
                <div className={"f1 brd" + h_sel} onClick={() => props.onClickHelg()}><img className="btn-img" src={IMG["helg"]} alt="helg" /></div>
                <div className={"f1 brd" + r_sel} onClick={() => props.onClickRask()}><img className="btn-img" src={IMG["rask"]} alt="rask" /></div>
                {renderAddRowBtn()}
            </div>
        )
    }

    return (
        <div className='col narrow'>
            {renderCategories()}
            {renderSpecial()}
        </div>
    );
}
