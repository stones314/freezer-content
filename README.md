# Fryser innhold :)

Web app for å halde orden på innhaldet i fryseren vår!

Backend er eit google sheet. Web appen laster data frå regnearket ved oppstart, og skriver data ved behov.

Frontend er laga med React.

Poenget er å:
- Ha eit litt bedre brukergrensesnitt på telefon, sidan det er litt knot å editere regnearket på mobilen.
- Ha mulighet til å filtrere på kategori etc.

# TODOS:

1. Basisvare merkes med eit tal som indikerer kor mange vi vil ha i fryen.
    - Då må også UI ha mulighet til å sette/endre det talet om noko markes som basisvare.
2. Mulighet for dobbel-filtrering - både velge kategori og velge klassifisering samtidig.
3. Bakgrunnsfarge i logo-snøfnugg
4. Rydde kode: no har eg ein del copy paste på tvers av filer, kan/bør gjeres felles. eks
    1. rad med kategori-ikoner
    2. rad med klassifiserings-ikoner
