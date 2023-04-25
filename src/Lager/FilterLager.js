import { IMG } from './../Consts.js';
import './../App.css';

export function FilterLager(props) {

    function renderAddRowBtn() {
        if(!props.mayEdit)return null;
        const bgcol = props.addNew ? " buy" : " sel";
        const sign = props.addNew ? "minus" : "pluss"
        return (
          <div className="f1 cp brd" onClick={() => props.setAddNew(!props.addNew)}>
            <img className={"btn-img" + bgcol} src={IMG[sign]} alt={sign} />
          </div>
        );
      }
    
    function renderCategories() {
        var catOpts = [];
        for (const [i, c] of props.categories.entries()) {
            const sel = props.kat === c ? " sel" : "";
            catOpts.push(
                <div className={"f1 cp brd" + sel} key={i} onClick={() => props.onClickCat(c)}>
                    <img className="btn-img" src={IMG[c]} alt={c} />
                </div>
            );
        }
        return (
            <div className="row mid">
                {catOpts}
                {renderAddRowBtn()}
            </div>
        )
    }

    return (
        <div className='col narrow'>
            {renderCategories()}
        </div>
    );
}
