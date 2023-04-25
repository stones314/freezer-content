import { IMG, daysSince } from './../Consts.js';
import { useState } from "react";
import StringInput from './../StringInput.jsx';

import './../App.css';

export function RowLager(props) {

    const [val, setVal] = useState(props.row.Antall.toString());
    const [name, setName] = useState(props.row.Navn);
    const [edited, setEdited] = useState(false);
    const [cat, setCat] = useState(props.row.Kategori);
    const [nErr, setNerr] = useState("");
    const [vErr, setVerr] = useState("");
    const [basis, setBasis] = useState(props.row.Basisvare);

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
        setEdited(true);
        setVal(newValue);
    }

    function onClickCat(c) {
        setEdited(true);
        setCat(c);
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
        if (basis >= 9) return;
        setEdited(true);
        setBasis(Number(basis) + 1);
    }

    function onBaseMinus() {
        if (basis <= 0) return;
        setEdited(true);
        setBasis(Number(basis) - 1);
    }

    function renderIconImg(isSet, icon, i) {
        if (!isSet) return (<div className='f1'></div>);
        return (<div className='f1 cp' key={i}><img className="icon" src={IMG[icon]} alt={icon} /></div>);
    }
    function renderIconBtn(sel, i, c) {
        return (
            <div className={"f1 cp brd" + sel} key={i} onClick={() => onClickCat(c)}>
                <img className="icon" src={IMG[c]} alt={c} />
            </div>
        );
    }

    function renderCategories() {
        var catOpts = [];
        for (const [i, c] of props.cats.entries()) {
            const sel = cat === c ? " sel" : "";
            if (isSelected()) {
                catOpts.push(
                    renderIconBtn(sel, i, c)
                );
            } else {
                catOpts.push(
                    renderIconImg(sel === " sel", c, i)
                );
            }
        }
        return (
            <div className="row f2">
                {catOpts}
            </div>
        )
    }

    function renderBaseVal() {
        const days_since_edit = daysSince(props.row.Endringer);
        const edit_text = days_since_edit === -1 ? "Aldri endret" : "Endret " + days_since_edit + " dager siden";
        return (
            <div className='mid row'>
                <div className='f1 cp' onClick={() => onBaseMinus()}>
                    <img className="icon" src={IMG["minus"]} alt="minus" />
                </div>
                <div className='f1 brd sqr cp'>
                    {basis}
                </div>
                <div className='f1 cp' onClick={() => onBasePluss()}>
                    <img className="icon" src={IMG["pluss"]} alt="pluss" />
                </div>
                <div className='f4'>
                    (Basisverdi)
                </div>
                <div className='f1'>

                </div>
                <div className='f8 txt-right'>
                    {edit_text}
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
                        editVal={val.toString()}
                        errorMsg={nErr}
                        onChange={(newValue) => onValChange(newValue)}
                        onEnterDown={(e) => { e.preventDefault(); props.onSave(name, val, cat, basis) }}
                    />
                </div>
            );
        }
        return (
            <div className="f2 cp txt-left" onClick={() => props.onSelect()}>
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
                        errorMsg={vErr}
                        onChange={(newValue) => onNameChange(newValue)}
                        onEnterDown={(e) => { e.preventDefault(); props.onSave(name, val, cat, basis) }}
                    />
                </div>
            );
        }
        return (
            <div className="f9 cp txt-left" onClick={() => props.onSelect()}>
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
                setBasis(Number(props.row.Basisvare));
                setEdited(false);
            }
            return (<div className="f1"></div>);
        }
        return (
            <div className="col">
                {renderBaseVal()}
                <div className="mid row f1">
                    <div className='f7 add_hp txt-right'></div>
                    <div className="f1 cp" onClick={() => onMinusOne()}><img className="icon" src={IMG["minus"]} alt="minus" /></div>
                    {renderValue()}
                    <div className="f1 cp" onClick={() => onPlussOne()}><img className="icon" src={IMG["pluss"]} alt="pluss" /></div>
                    <div className="f1 cp" onClick={() => props.onSave(name, val, cat, basis)}><img className="icon" src={IMG["save"]} alt="save" /></div>
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
                    {renderCategories()}
                    <div className='f1 add_hp'></div>
                    {renderName()}
                    {renderExitBtn()}
                </div>
            )
        }

        return (
            <div className={"mid row f1" + buy}>
                {renderCategories()}
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
