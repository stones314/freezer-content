import { IMG } from './Consts.js';
import { useState } from "react";
import StringInput from './StringInput.jsx';
import './App.css';

export function AddRow(props) {

    const [val, setVal] = useState("1");
    const [navn, setNavn] = useState("");
    const [cat, setCat] = useState(props.cats[0]);
    const [nErr, setNerr] = useState("");
    const [vErr, setVerr] = useState("");
    const [spes, setSpes] = useState([ false, false, false, false ]);

    function onValChange(newValue) {
        setVal(newValue);
    }

    function onNavnChange(newValue) {
        if (newValue.length > 30) {
            return;
        }
        setNavn(newValue);
    }

    function renderCategories() {
        var catOpts = [];
        for (const [i, c] of props.cats.entries()) {
            const sel = cat === c ? " sel" : "";
            catOpts.push(
                <div className={"f1 brd" + sel} key={i} onClick={() => onClickCat(c)}>
                    <img className="btn-img" src={IMG[c]} alt={c} />
                </div>
            );
        }
        return (
            <div className='center'>
                <div>
                    Kategori
                </div>
                <div className="row">
                    {catOpts}
                </div>
            </div>
        )
    }

    function onClickCat(c) {
        setCat(c);
    }

    function renderSpecial() {
        const a_sel = spes[0] ? " sel" : "";
        const b_sel = spes[1] ? " sel" : "";
        const h_sel = spes[2] ? " sel" : "";
        const r_sel = spes[3] ? " sel" : "";
        return (
            <div className='center'>
                <div>
                    Ekstra info
                </div>
                <div className="row">
                    <div className={"f1 brd" + a_sel} onClick={() => onClickSpes(0)}><img className="btn-img" src={IMG["base"]} alt="base" /></div>
                    <div className={"f1 brd" + b_sel} onClick={() => onClickSpes(1)}><img className="btn-img" src={IMG["bruk"]} alt="bruk" /></div>
                    <div className={"f1 brd" + h_sel} onClick={() => onClickSpes(2)}><img className="btn-img" src={IMG["helg"]} alt="helg" /></div>
                    <div className={"f1 brd" + r_sel} onClick={() => onClickSpes(3)}><img className="btn-img" src={IMG["rask"]} alt="rask" /></div>
                </div>
            </div>
        )
    }

    function onClickSpes(s){
        var newSpes = [];
        for (const [i, x] of spes.entries()) newSpes[i] = x;
        newSpes[s] = !newSpes[s];
        setSpes(newSpes);
    }

    function onSave() {
        if (navn === "") {
            setNerr("Må ha navn!");
            return;
        }
        setNerr("");
        if (val === "") {
            setVerr("Må ha antall!");
            return;
        }
        if(Number(val) < 0){
            setVerr("antall må være større enn 0");
            return;
        }
        setVerr("");
        props.onSave(navn, val, cat, spes);
    }

    return (
        <div className="narrow center col">
            <h3>Legg til ny rad!</h3>
            <StringInput
                description={"Navn"}
                type="text"
                editVal={navn}
                errorMsg={nErr}
                onChange={(newValue) => onNavnChange(newValue)}
                onEnterDown={(e) => { e.preventDefault(); onSave() }}
            />
            <StringInput
                description={"Antall"}
                type="number"
                editVal={val.toString()}
                errorMsg={vErr}
                onChange={(newValue) => onValChange(newValue)}
                onEnterDown={(e) => { e.preventDefault(); onSave() }}
            />
            {renderCategories()}
            {renderSpecial()}
            Lagre
            <div className="f1" onClick={() => onSave()}>
                <img className="btn-img" src={IMG["save"]} alt="save" />
            </div>
        </div>
    );
}
