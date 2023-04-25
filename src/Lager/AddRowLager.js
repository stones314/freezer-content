import { IMG } from './../Consts.js';
import { useState } from "react";
import StringInput from './../StringInput.jsx';
import './../App.css';

export function AddRowLager(props) {

    const [val, setVal] = useState("1");
    const [navn, setNavn] = useState("");
    const [cat, setCat] = useState(props.cats[0]);
    const [nErr, setNerr] = useState("");
    const [vErr, setVerr] = useState("");
    const [basis, setBasis] = useState(1);

    function onValChange(newValue) {
        setVal(newValue);
    }

    function onNavnChange(newValue) {
        if (newValue.length > 30) {
            return;
        }
        setNavn(newValue);
    }

    function onBasePluss() {
        if (basis >= 9) return;
        setBasis(Number(basis) + 1);
    }

    function onBaseMinus() {
        if (basis <= 0) return;
        setBasis(Number(basis) - 1);
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

    function renderBaseVal() {
        return (
            <div className='mid row mtb2'>
                <div className='mlr3' onClick={() => onBaseMinus()}>
                    <img className="icon" src={IMG["minus"]} alt="minus" />
                </div>
                <div className='brd sqr'>
                    {basis}
                </div>
                <div className='mlr3' onClick={() => onBasePluss()}>
                    <img className="icon" src={IMG["pluss"]} alt="pluss" />
                </div>
            </div>
        );
    }

    function renderBasis() {
        return (
            <div className='center'>
                <div>
                    Basis
                </div>
                {renderBaseVal()}
            </div>
        )
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
        if (Number(val) < 0) {
            setVerr("antall må være større enn 0");
            return;
        }
        setVerr("");
        props.onSave(navn, val, cat, basis);
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
            {renderBasis()}
            Lagre
            <div className="f1" onClick={() => onSave()}>
                <img className="btn-img" src={IMG["save"]} alt="save" />
            </div>
        </div>
    );
}
