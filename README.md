# Fryser innhold :)

Web app for å halde orden på innhaldet i fryseren vår!

Backend er eit google sheet. Web appen laster data frå regnearket ved oppstart, og skriver data ved behov.

Frontend er laga med React.

Poenget er å:
- Ha eit litt bedre brukergrensesnitt på telefon, sidan det er litt knot å editere regnearket på mobilen.
- Ha mulighet til å filtrere på kategori etc.

# TODOS:

1. Rydde kode: no har eg ein del copy paste på tvers av filer, kan/bør gjeres felles. eks
    1. legge til ny rad og editere eksisterende rad er to forskjellige filer som har veldig mykje lik kode!
2. Passord-beskytte skriving til regneark
    - Når sida lastes, be om passord.
    - Lagre passord i coockies så det ikkje treng å tastes inn kvar gang.
    - Redigering er ikkje lov uten passord.
    - Passord kan sikkert ligge i regnearket.
