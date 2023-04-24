import { IMG, isBase } from './Consts.js';
import { useState } from "react";
import StringInput from './StringInput.jsx';

import './App.css';




export function Row(props) {

    const [val, setVal] = useState(Number(props.row.Antall));
    const [name, setName] = useState(props.row.Navn);
    const [edited, setEdited] = useState(false);
    const [cat, setCat] = useState(props.row.Kategori);
    const [nErr, setNerr] = useState("");
    const [vErr, setVerr] = useState("");
    const [spes, setSpes] = useState([
        props.row.Basisvare ? Number(props.row.Basisvare) : 0,
        props.row.BrukeOpp === "x",
        props.row.Helgemiddag === "x",
        props.row.Ferdigmiddag === "x"
    ]);

    function isSelected() {
        return props.selected === props.row_id;
    }

    function onNameChange(newValue) {
        if (newValue.length > 30) {
            return;
        }
        setEdited(true);
        setName(newValue);
    }

    function onValChange(newValue) {
        var v = Number(newValue);
        if (v < 0) {
            return;
        }
        setEdited(true);
        setVal(v);
    }

    function onClickCat(c) {
        setEdited(true);
        setCat(c);
    }

    function onClickSpes(s) {
        var newSpes = [];
        for (const [i, x] of spes.entries()) newSpes[i] = x;
        if (s === 0) {
            if (Number(newSpes[s]) === 0) newSpes[s] = 1;
            else newSpes[s] = 0;
        }
        else {
            newSpes[s] = !newSpes[s];
        }
        setSpes(newSpes);
        setEdited(true);
    }

    function onMinusOne() {
        var v = Number(val);
        if (v === 0) return;
        setEdited(true);
        if (v - 1 <= 0) return setVal(0);
        setVal(v - 1);
    }

    function onPlussOne() {
        setEdited(true);
        var v = Number(val);
        setVal(v + 1);
    }

    function onBasePluss() {
        if (spes[0] >= 9) return;
        setEdited(true);
        setSpes([
            Number(spes[0]) + 1,
            spes[1],
            spes[2],
            spes[3]
        ]);
    }

    function onBaseMinus() {
        if (spes[0] <= 0) return;
        setEdited(true);
        setSpes([
            Number(spes[0]) - 1,
            spes[1],
            spes[2],
            spes[3]
        ]);
    }

    function renderCategories() {
        var catOpts = [];
        for (const [i, c] of props.cats.entries()) {
            const sel = cat === c ? " sel" : "";
            catOpts.push(
                <div className={"f1 cp brd" + sel} key={i} onClick={() => onClickCat(c)}>
                    <img className="icon" src={IMG[c]} alt={c} />
                </div>
            );
        }
        return (
            <div className="row f7">
                {catOpts}
            </div>
        )
    }

    function renderSpecial() {
        if (isSelected()) {
            const a_sel = spes[0] ? " sel" : "";
            const b_sel = spes[1] ? " sel" : "";
            const h_sel = spes[2] ? " sel" : "";
            const r_sel = spes[3] ? " sel" : "";
            return (
                <div className="row f4">
                    <div className={"f1 cp brd" + a_sel} onClick={() => onClickSpes(0)}><img className="icon" src={IMG["base"]} alt="base" /></div>
                    <div className={"f1 cp brd" + b_sel} onClick={() => onClickSpes(1)}><img className="icon" src={IMG["bruk"]} alt="bruk" /></div>
                    <div className={"f1 cp brd" + h_sel} onClick={() => onClickSpes(2)}><img className="icon" src={IMG["helg"]} alt="helg" /></div>
                    <div className={"f1 cp brd" + r_sel} onClick={() => onClickSpes(3)}><img className="icon" src={IMG["rask"]} alt="rask" /></div>
                </div>
            )
        }
        return (
            <div className="row f1" onClick={() => props.onSelect()}>
                {renderIcon(isBase(props.row.Basisvare), "base")}
                {renderIcon(props.row.BrukeOpp === "x", "bruk")}
                {renderIcon(props.row.Helgemiddag === "x", "helg")}
                {renderIcon(props.row.Ferdigmiddag === "x", "rask")}
            </div>
        )
    }

    function renderIcon(isSet, icon) {
        if (!isSet) return (<div className='f1'></div>);
        return (<div className='f1 cp'><img className="icon" src={IMG[icon]} alt={icon} /></div>);
    }

    function renderBaseVal() {
        if (spes[0] > 0) {
            return (
                <div className='mid row'>
                    <div className='f1 cp' onClick={() => onBaseMinus()}>
                        <img className="icon" src={IMG["minus"]} alt="minus" />
                    </div>
                    <div className='f1 brd sqr cp'>
                        {spes[0]}
                    </div>
                    <div className='f1 cp' onClick={() => onBasePluss()}>
                        <img className="icon" src={IMG["pluss"]} alt="pluss" />
                    </div>
                    <div className='f4'>
                        (Basisverdi)
                    </div>
                    <div className='f2'>

                    </div>
                    <div className='f7'>
                        {props.row.Endringer}
                    </div>
                </div>
            );
        }
        return (
            <div className='mid row'>
                <div className='f9'>

                </div>
                <div className='f7'>
                    {props.row.Endringer}
                </div>
            </div>
        );
    }

    function renderValue() {
        if (isSelected()) {
            return (
                <div className="f2">
                    <StringInput
                        description={""}
                        type="number"
                        editVal={val}
                        errorMsg={nErr}
                        onChange={(newValue) => onValChange(newValue)}
                        onEnterDown={(e) => { e.preventDefault(); props.onSave(name, val, cat, spes) }}
                    />
                </div>
            );
        }
        return (
            <div className="f1 cp txt-left" onClick={() => props.onSelect()}>
                {val}
            </div>
        );
    }

    function renderName() {
        if (isSelected()) {
            return (
                <div className="f9">
                    <StringInput
                        description={""}
                        type="text"
                        editVal={name}
                        errorMsg={nErr}
                        onChange={(newValue) => onNameChange(newValue)}
                        onEnterDown={(e) => { e.preventDefault(); props.onSave(name, val, cat, spes) }}
                    />
                </div>
            );
        }
        return (
            <div className="f3 cp txt-left" onClick={() => props.onSelect()}>
                {name}
            </div>
        );
    }

    function renderExitBtn() {
        return (
            <div className='f1 row'>
                <div className="f1 cp" onClick={() => props.onSelect()}>
                    X
                </div>
            </div>
        );
    }

    function renderExtraRow() {
        if (!isSelected()) {
            if (edited) {
                setVal(Number(props.row.Antall));
                setName(props.row.Navn);
                setCat(props.row.Kategori);
                setSpes([
                    props.row.Basisvare ? Number(props.row.Basisvare) : 0,
                    props.row.BrukeOpp === "x",
                    props.row.Helgemiddag === "x",
                    props.row.Ferdigmiddag === "x"
                ]);
                setEdited(false);
            }
            return (<div className="f1"></div>);
        }
        return (
            <div className="col">
                {renderBaseVal()}
                <div className="mid row f1">
                    {renderCategories()}
                    <div className='f3 add_hp txt-right'></div>
                    <div className="f1 cp" onClick={() => onMinusOne()}><img className="icon" src={IMG["minus"]} alt="minus" /></div>
                    {renderValue()}
                    <div className="f1 cp" onClick={() => onPlussOne()}><img className="icon" src={IMG["pluss"]} alt="pluss" /></div>
                    <div className="f1 cp" onClick={() => props.onSave(name, val, cat, spes)}><img className="icon" src={IMG["save"]} alt="save" /></div>
                </div>
            </div>

        );
    }

    function renderBaseRow() {
        const baseLim = props.row.Basisvare !== "" ? Number(props.row.Basisvare) : 0;
        const buy = (Number(props.row.Antall) < baseLim) ? " buy" : ""

        if (isSelected()) {
            return (
                <div className={"mid row f1" + buy}>
                    {renderSpecial()}
                    <div className='f1 add_hp'></div>
                    {renderName()}
                    {renderExitBtn()}
                </div>
            )
        }

        return (
            <div className={"mid row f1" + buy}>
                {renderSpecial()}
                {renderName()}
                {renderValue()}
            </div>
        )
    }

    return (
        <div className={"brd"}>
            {renderBaseRow()}
            {renderExtraRow()}
        </div>
    );
}
