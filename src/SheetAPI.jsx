/**
 * Copied from gaia-map-web, in case using google sheet is what we want :)
 * It might be because the sheet is easier to accsess than a random file on some
 * AWS server if I do it like I did for gues-bet-web...
 */

import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

/**
 * 
 * @returns array of row-objects, where the keys are the headers used in spreadsheet :)
 * 0    Kategori
 * 1	Hva
 * 2	Antall
 * 3	Endringer
 * 4	Basisvare
 * 5	Ferdigmiddag
 * 6	Brukes opp
 * 7	Helgemiddag
 */
export async function loadSheetPage(pageName) {
    try {

        await doc.useApiKey("AIzaSyDDBUDDkWmwrWEcS8kz2dpPVTg6bRZGMIA");//TODO: unchanged from gaia map

        // loads document properties and worksheets
        await doc.loadInfo();

        const sM = doc.sheetsByTitle[pageName];
        return out = await sM.getRows();

    } catch (e) {
        console.error('Error: ', e);
        return [];
    }
}

/**
 * 
 * @returns array of row-objects, where the keys are the headers used in spreadsheet :)
 * 0    Kategori
 * 1	Hva
 * 2	Antall
 * 3	Endringer
 * 4	Basisvare
 * 5	Ferdigmiddag
 * 6	Brukes opp
 * 7	Helgemiddag
 */
export async function loadSheetData() {
    var error = "";
    try {

        //await doc.useApiKey("AIzaSyDDBUDDkWmwrWEcS8kz2dpPVTg6bRZGMIA");
        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_CLIENT_EMAIL,
            private_key: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
        });

        // loads document properties and worksheets
        await doc.loadInfo();
        const keyCol = 0;
        const eqCol = 1;
        const clCol = 2;
        const edCol = 3;
        const evCol = 4;
        const e2Col = 5;
        const myMapTypes = [];//["7A", "7B", "7C", "7D", "7E","8", "10"];
        var hexMap = new HexMap();
        hexMap.criteria.maxEdgeCount = 1;
        var mapKey = "";

        for (const [i, m] of myMapTypes.entries()) {
            const sheet = doc.sheetsByTitle[m];
            await sheet.loadCells({ startRowIndex: 1 });
            const maxRow = sheet.rowCount;
            for (var r = 1; r < maxRow; r++) {
                mapKey = sheet.getCell(r, keyCol).value;
                if (!mapKey) continue;
                const out = hexMap.setFromString(mapKey);
                if (!out.valid) continue;
                const eqCell = sheet.getCell(r, eqCol);
                eqCell.value = hexMap.getMinEqDist();
                const clCell = sheet.getCell(r, clCol);
                clCell.value = hexMap.biggestCluster;
                const edCell = sheet.getCell(r, edCol);
                edCell.value = hexMap.highestEdgeCount[1];

                const mapBal = hexMap.happiness.getBalance();
                const evCell = sheet.getCell(r, evCol);
                evCell.value = mapBal.maxMin;
                const e2Cell = sheet.getCell(r, e2Col);
                e2Cell.value = mapBal.maxAvg;
            }
            await sheet.saveUpdatedCells();
        }

    } catch (e) {
        console.error('Error: ', e);
        error = e + " for map " + mapKey;
    }
    return error + hexMap.nbrMat["Bl"]["No"][0];
}
