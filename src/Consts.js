export const IMG = {
    "Kjøtt": "https://rygg-gaard.no/frys/img/meat.png",
    "Fisk": "https://rygg-gaard.no/frys/img/fish.png",
    "Grønnsaker og fries": "https://rygg-gaard.no/frys/img/vegetables.png",
    "Bær": "https://rygg-gaard.no/frys/img/berries.png",
    "Brødmat": "https://rygg-gaard.no/frys/img/bread.png",
    "Søtsaker": "https://rygg-gaard.no/frys/img/dessert.png",
    "Div": "https://rygg-gaard.no/frys/img/snowflake.png",
    "base": "https://rygg-gaard.no/frys/img/cart.png",
    "bruk": "https://rygg-gaard.no/frys/img/expired.png",
    "helg": "https://rygg-gaard.no/frys/img/tie.png",
    "rask": "https://rygg-gaard.no/frys/img/clock.png",
    "pluss": "https://rygg-gaard.no/quiz/img/AddBtn.png",
    "minus": "https://rygg-gaard.no/quiz/img/MinusBtn.png",
    "save": "https://rygg-gaard.no/frys/img/ok.png",

}

export const CATS = {
    Fryser : [
        "Kjøtt",
        "Fisk",
        "Grønnsaker og fries",
        "Bær",
        "Brødmat",
        "Søtsaker",
        "Div"
    ],
    Lager : [
        "Kjøtt",
        "Fisk",
        "Grønnsaker og fries",
        "Bær",
        "Brødmat",
        "Søtsaker",
        "Div"
    ]
}

export function isBase(cell) {
    if (!cell) return false;
    if (cell === "") return false;
    if (Number(cell) <= 0) return false;
    return true;
}

export function getDateTime() {
    const currentdate = new Date();
    const hours = currentdate.getHours() < 10 ? "0" + currentdate.getHours() : currentdate.getHours();
    const minutes = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
    const seconds = currentdate.getSeconds() < 10 ? "0" + currentdate.getSeconds() : currentdate.getSeconds();
    return currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + hours + ":"
        + minutes + ":"
        + seconds;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysSince(date_string){
    if(date_string === "never") return -1;
    var dmy = date_string.split(" @ ")[0].split("/");
    const old_date = new Date(dmy[1] + "/" + dmy[0] + "/" + dmy[2]);
    dmy = getDateTime().split(" @ ")[0].split("/");
    const new_date = new Date(dmy[1] + "/" + dmy[0] + "/" + dmy[2]);
    const ms_diff = Math.abs(new_date - old_date);
    const day_diff = Math.ceil(ms_diff / MS_PER_DAY);
    return day_diff;
}