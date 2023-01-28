export const IMG = {
    "Kjøtt" : "https://rygg-gaard.no/frys/img/meat.png",
    "Fisk" : "https://rygg-gaard.no/frys/img/fish.png",
    "Grønnsaker og fries" : "https://rygg-gaard.no/frys/img/vegetables.png",
    "Bær" : "https://rygg-gaard.no/frys/img/berries.png",
    "Brødmat" : "https://rygg-gaard.no/frys/img/bread.png",
    "Søtsaker" : "https://rygg-gaard.no/frys/img/dessert.png", 
    "Div" : "https://rygg-gaard.no/frys/img/snowflake.png",
    "base" : "https://rygg-gaard.no/frys/img/cart.png",
    "bruk" : "https://rygg-gaard.no/frys/img/expired.png",
    "helg" : "https://rygg-gaard.no/frys/img/tie.png",
    "rask" : "https://rygg-gaard.no/frys/img/clock.png",
    "pluss" : "https://rygg-gaard.no/quiz/img/AddBtn.png",
    "minus" : "https://rygg-gaard.no/quiz/img/MinusBtn.png",
    "save" : "https://rygg-gaard.no/frys/img/ok.png",
    
}

export function isBase(cell){
    if(!cell) return false;
    if(cell === "") return false;
    if(Number(cell) <= 0) return false;
    return true;
}
