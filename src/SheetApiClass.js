import { GoogleSpreadsheet } from "google-spreadsheet";

const PAGE_NAME = "Fryser";
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
        this.sPage = null;
        this.rows = [];
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
    async loadSheetData(onDataLoaded) {
        var error = "";
        try {

            //await doc.useApiKey("AIzaSyDDBUDDkWmwrWEcS8kz2dpPVTg6bRZGMIA");
            await this.doc.useServiceAccountAuth({
                client_email: process.env.REACT_APP_CLIENT_EMAIL,
                private_key: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
            });

            console.log("dbg-01");

            // loads document properties and worksheets
            await this.doc.loadInfo();

            this.sPage = this.doc.sheetsByTitle[PAGE_NAME];
            this.rows = await this.sPage.getRows();

            console.log("dbg-02 = " + this.sPage.rowCount);

            await this.sPage.loadCells({ startRowIndex: 1 });

            onDataLoaded();

        } catch (e) {
            console.error('Error: ', e);
            error = e + "!";
        }
        return error;
    }

    getRows() {
        console.log("yay - " + this.rows.length);
        return this.rows;
    }

    setNewVal(row_id, name, val, cat, extra) {
        this.rows[row_id].Navn = name;
        this.rows[row_id].Antall = val;
        this.rows[row_id].Kategori = cat;
        this.rows[row_id].Basisvare = extra[0] ? "x": "";
        this.rows[row_id].BrukeOpp = extra[1] ? "x": "";
        this.rows[row_id].Helgemiddag = extra[2] ? "x": "";
        this.rows[row_id].Ferdigmiddag = extra[3] ? "x": "";
    }

    async saveChanges(row_id, onSaved) {
        try {
            if(Number(this.rows[row_id].Antall) <= 0 && !this.rows[row_id].Basisvare !== "x")
            {
                await this.rows[row_id].delete();
                this.rows = await this.sPage.getRows();
                onSaved("delete");
            }
            else {
                await this.rows[row_id].save();
                onSaved("save");
            }
        }
        catch (e) {
            console.error("Error: ", e);
            onSaved(e);
        }
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
     * 6	BrukeOpp
     * 7	Helgemiddag
     */
    async addNewRow(navn, antall, cat, extra, onSaved) {
        try {
            const larryRow = await this.sPage.addRow({
                Kategori: cat,
                Navn: navn,
                Antall: antall,
                Endringer: "",
                Basisvare: extra[0] ? "x" : "",
                Ferdigmiddag: extra[3] ? "x" : "",
                BrukeOpp: extra[1] ? "x" : "",
                Helgemiddag: extra[2] ? "x" : ""
            });
            this.rows = await this.sPage.getRows();
            onSaved("");
        }
        catch (e) {
            console.error("Error: ", e);
            onSaved(e);
        }
    }
}

