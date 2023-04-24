import { GoogleSpreadsheet } from "google-spreadsheet";
import { isBase, getDateTime } from './Consts.js';


const FRYS_PAGE_NAME = "Fryser";
const LAGER_PAGE_NAME = "Lager";
const PAGES = [FRYS_PAGE_NAME, LAGER_PAGE_NAME];
export const COL_ID = {
    Kategori: 0,
    Navn: 1,
    Antall: 2,
    Endringer: 3,
    Basisvare: 4,
    Ferdigmiddag: 5,
    BrukesOpp: 6,
    Helgemiddag: 7
};

export class SheetApi {
    constructor() {
        this.doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);
        this.sPages = [];
        this.rows = [];
    }

    /**
     * Call this function in a useEffect to load data async.
     * 
     * @param {*} onDataLoaded function to be called when data is loaded, taking no parameters
     * @returns 
     */
    async loadSheetData(onDataLoaded) {
        var error = "";
        try {

            await this.doc.useServiceAccountAuth({
                client_email: process.env.REACT_APP_CLIENT_EMAIL,
                private_key: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
            });

            // loads document properties and worksheets
            await this.doc.loadInfo();

            for (const [i, page] of PAGES.entries()) {
                this.sPages.push(this.doc.sheetsByTitle[page]);
                this.rows.push(await this.sPages[i].getRows());
            }

            onDataLoaded();

        } catch (e) {
            console.error('Error: ', e);
            error = e + "!";
        }
        return error;
    }

    /**
     * 
     * @returns array of row-objects, where the keys are the headers used in spreadsheet :)
     * 0    Kategori
     * 1	Navn
     * 2	Antall
     * 3	Endringer
     * 4	Basisvare
     * 5	Ferdigmiddag
     * 6	BrukesOpp
     * 7	Helgemiddag
     */
    getRows() {
        return this.rows;
    }

    async updateFryserRow(row_id, name, val, cat, extra, onSaved) {
        const page_no = 0;
        this.rows[page_no][row_id].Navn = name;
        this.rows[page_no][row_id].Antall = val;
        this.rows[page_no][row_id].Kategori = cat;
        this.rows[page_no][row_id].Endringer = getDateTime();
        this.rows[page_no][row_id].Basisvare = Number(extra[0]) > 0 ? extra[0].toString() : "";
        this.rows[page_no][row_id].BrukeOpp = extra[1] ? "x" : "";
        this.rows[page_no][row_id].Helgemiddag = extra[2] ? "x" : "";
        this.rows[page_no][row_id].Ferdigmiddag = extra[3] ? "x" : "";

        try {
            if (Number(this.rows[page_no][row_id].Antall) <= 0 && !isBase(this.rows[page_no][row_id].Basisvare)) {
                await this.rows[page_no][row_id].delete();
                this.rows[page_no] = await this.sPages[page_no].getRows();
                onSaved("delete");
            }
            else {
                await this.rows[page_no][row_id].save();
                onSaved("save");
            }
        }
        catch (e) {
            console.error("Error: ", e);
            onSaved(e);
        }
    }

    /**
     * Collumns:
     * 0    Kategori
     * 1	Navn
     * 2	Antall
     * 3	Endringer
     * 4	Basisvare
     * 5	Ferdigmiddag
     * 6	BrukeOpp
     * 7	Helgemiddag
     */
    async addNewFryserRow(navn, antall, cat, extra, onSaved) {
        const page_no = 0;
        try {
            await this.sPages[page_no].addRow({
                Kategori: cat,
                Navn: navn,
                Antall: antall,
                Endringer: getDateTime(),
                Basisvare: Number(extra[0]) > 0 ? extra[0].toString() : "",
                Ferdigmiddag: extra[3] ? "x" : "",
                BrukeOpp: extra[1] ? "x" : "",
                Helgemiddag: extra[2] ? "x" : ""
            });
            this.rows[page_no] = await this.sPages[page_no].getRows();
            onSaved("");
        }
        catch (e) {
            console.error("Error: ", e);
            onSaved(e);
        }
    }
}

