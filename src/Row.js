import { IMG } from './Consts.js';
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
        props.row.Basisvare === "x",
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
        newSpes[s] = !newSpes[s];
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

    function renderCategories() {
        var catOpts = [];
        for (const [i, c] of props.cats.entries()) {
            const sel = cat === c ? " sel" : "";
            catOpts.push(
                <div className={"f1 brd" + sel} key={i} onClick={() => onClickCat(c)}>
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
                    <div className={"f1 brd" + a_sel} onClick={() => onClickSpes(0)}><img className="icon" src={IMG["base"]} alt="base" /></div>
                    <div className={"f1 brd" + b_sel} onClick={() => onClickSpes(1)}><img className="icon" src={IMG["bruk"]} alt="bruk" /></div>
                    <div className={"f1 brd" + h_sel} onClick={() => onClickSpes(2)}><img className="icon" src={IMG["helg"]} alt="helg" /></div>
                    <div className={"f1 brd" + r_sel} onClick={() => onClickSpes(3)}><img className="icon" src={IMG["rask"]} alt="rask" /></div>
                </div>
            )
        }
        return (
            <div className="row f1" onClick={() => props.onSelect()}>
                {renderIcon(props.row.Basisvare, "base")}
                {renderIcon(props.row.BrukeOpp, "bruk")}
                {renderIcon(props.row.Helgemiddag, "helg")}
                {renderIcon(props.row.Ferdigmiddag, "rask")}
            </div>
        )
    }

    function renderIcon(cell, icon) {
        if (cell !== "x") return (<div className='f1'></div>);
        return (<div className='f1'><img className="icon" src={IMG[icon]} alt={icon} /></div>);
    }

    function renderValue() {
        if (isSelected()) {
            return (
                <div className="f3">
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
            <div className="f1 txt-left" onClick={() => props.onSelect()}>
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
            <div className="f3" onClick={() => props.onSelect()}>
                {name}
            </div>
        );
    }

    function renderExitBtn() {
        return (
            <div className='f1 row'>
            <div className="f1" onClick={() => props.onSelect()}>
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
                    props.row.Basisvare === "x",
                    props.row.BrukeOpp === "x",
                    props.row.Helgemiddag === "x",
                    props.row.Ferdigmiddag === "x"
                ]);
                setEdited(false);
            }
            return (<div className="f1"></div>);
        }
        return (
            <div className="mid row f1">
                {renderCategories()}
                <div className='f1 add_hp'></div>
                {renderValue()}
                <div className="f1" onClick={() => onPlussOne()}><img className="icon" src={IMG["pluss"]} alt="pluss" /></div>
                <div className="f1" onClick={() => onMinusOne()}><img className="icon" src={IMG["minus"]} alt="minus" /></div>
                <div className='f1'></div>
                <div className="f1" onClick={() => props.onSave(name, val, cat, spes)}><img className="icon" src={IMG["save"]} alt="save" /></div>
            </div>

        );
    }

    function renderBaseRow() {
        const buy = (props.row.Basisvare === "x" && Number(props.row.Antall) < 1) ? " buy" : ""

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
