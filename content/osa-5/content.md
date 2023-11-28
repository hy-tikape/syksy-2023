# 5. Tietokannat ohjelmoinnissa

## Tietokannan käyttäminen

Python-kielen standardikirjastossa on moduuli `sqlite3`, jonka avulla voidaan käyttää SQLite-tietokantaa. Seuraava koodi on pohja tietokannan käyttämiselle:

```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

# tietokantakomennot
```

Koodi luo olion `db`, jonka kautta voidaan käyttää tiedostossa `testi.db` olevaa tietokantaa. Jos tiedostoa ei ole valmiina olemassa, tiedosto luodaan ja tietokanta on aluksi tyhjä.

Koodi myös määrittelee, että `isolation_level` on `None`, mikä tarkoittaa, että kun tietokantaan tehdään muutoksia, ne tulevat voimaan välittömästi samaan tapaan kuin SQLite-tulkissa.

### Komentojen suoritus

Metodi `execute` suorittaa halutun SQL-komennon tietokannassa. Esimerkiksi seuraavat komennot luovat taulun `Tuotteet` ja lisäävät sinne kolme riviä:

```python
db.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)")

db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('selleri', 5)")
db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('nauris', 8)")
db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('lanttu', 4)")
```

Samalla tavalla voidaan myös hakea tietoa tietokannasta. Metodi `fetchall` antaa kyselyn tulokset listana, jossa jokaista tulostaulun riviä vastaa tuple:

```python
tuotteet = db.execute("SELECT nimi, hinta FROM Tuotteet").fetchall()
print(tuotteet)
```

```
[('selleri', 5), ('nauris', 8), ('lanttu', 4)]
```

Metodi `fetchone` puolestaan palauttaa ensimmäisen tulosrivin tuplena. Tämä metodi on erityisen hyödyllinen kyselyissä, jotka palauttavat aina yhden rivin:

```python
hinta = db.execute("SELECT MAX(hinta) FROM Tuotteet").fetchone()
print(hinta)
```

```
(8,)
```

### Parametrit

Seuraava koodi kysyy käyttäjältä tuotteen nimeä ja ilmoittaa sitten tuotteen hinnan tai tiedon siitä, että tuotetta ei ole tietokannassa.

```python
nimi = input("Tuotteen nimi: ")
hinta = db.execute("SELECT hinta FROM Tuotteet WHERE nimi=?", [nimi]).fetchone()
if hinta:
    print("Hinta on", hinta[0])
else:
    print("Ei löytynyt")
```

Tässä käyttäjän antama tieto yhdistetään kyselyyn _parametrina_: kyselyssä tiedon kohdalla on merkki `?` ja sen kohdalle tuleva arvo annetaan listassa. Esimerkiksi jos käyttäjä antaa nimen `nauris`, kyselystä tulee `SELECT hinta FROM Tuotteet WHERE nimi='nauris'`. Tästä näkee, että merkkijonon tapauksessa `'`-merkit lisätään automaattisesti oikealla tavalla.

Seuraava koodi puolestaan lisää uuden tuotteen tietokantaan:

```python
nimi = input("Tuotteen nimi: ")
hinta = input("Tuotteen hinta: ")
db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES (?, ?)", [nimi, hinta])
```

Kun parametreja on useita, ne tulevat listan arvoista samassa järjestyksessä.

Parametrien avulla tieto liitetään varmasti oikealla tavalla SQL-komennon osaksi. Esimerkiksi jos tuotteen nimi on `Pepe's Drink`, nimessä esiintyy `'`-merkki ja oikea tapa ilmoittaa nimi komennossa on `'Pepe\'s Drink'`. Kun tieto annetaan parametrina, tämä muutos tehdään automaattisesti. Erityisesti web-sovelluksissa parametrien käyttäminen estää myös SQL-injektion, jossa pahantahtoinen käyttäjä yrittää muuttaa komennon rakennetta. Tutustumme aiheeseen tarkemmin kurssilla [Tietokantasovellus](https://hy-tsoha.github.io/materiaali/).

### Virheenkäsittely

Tietokannassa suoritettava komento saattaa epäonnistua. Esimerkiksi seuraava komento epäonnistuu, jos taulu `Tuotteet` on jo olemassa:

```python
db.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)")
```

Tällöin ohjelman suoritus päättyy seuraavaan virheeseen:

```
Traceback (most recent call last):
  File "testi.py", line 6, in <module>
    db.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)")
sqlite3.OperationalError: table Tuotteet already exists
```

Virhe voidaan käsitellä myös Python-koodin puolella vaikkapa näin:

```python
try:
    db.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)")
except:
    print("Taulua ei voitu luoda")
```

Tällöin ohjelman suoritus jatkuu eteenpäin eikä pääty virheeseen.

### Lisätyn rivin id-numero

Seuraava koodi ilmoittaa tietokantaan lisätyn rivin id-numeron:

```python
tulos = db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('lanttu', 4)")
print(tulos.lastrowid)
```

Tästä on hyötyä, jos tietokantaan lisätään tämän jälkeen muita rivejä, joka viittaavat ensin lisättyyn riviin.

## Käyttöliittymä

Seuraava ohjelma toteuttaa käyttöliittymän, jonka avulla käyttäjä voi lisätä tietokantaan tuotteita, hakea tuotteen hinnan tai poistua ohjelmasta. Ohjelma olettaa, että tiedostossa `testi.db` on valmiina olemassa taulu `Tuotteet`.

```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

print("1 - Lisää uusi tuote")
print("2 - Hae tuotteen hinta")
print("3 - Sulje ohjelma")

while True:
    komento = input("Anna komento: ")

    if komento == "1":
        nimi = input("Tuotteen nimi: ")
        hinta = input("Tuotteen hinta: ")
        db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES (?,?)", [nimi, hinta])

    if komento == "2":
        nimi = input("Tuotteen nimi: ")
        hinta = db.execute("SELECT hinta FROM Tuotteet WHERE nimi=?", [nimi]).fetchone()
        if hinta:
            print("Hinta on", hinta[0])
        else:
            print("Ei löytynyt")

    if komento == "3":
        break
```

Ohjelman suoritus voi näyttää seuraavalta:

```
1 - Lisää uusi tuote
2 - Hae tuotteen hinta
3 - Sulje ohjelma
Anna komento: 2
Tuotteen nimi: selleri
Hinta on 5
Anna komento: 2
Tuotteen nimi: palsternakka
Ei löytynyt
Anna komento: 1
Tuotteen nimi: palsternakka
Tuotteen hinta: 9
Anna komento: 2 
Tuotteen nimi: palsternakka
Hinta on 9
Anna komento: 3
```

### Koodin rakenne paremmaksi

Usein pidetään hyvänä, että tietokannan käsittely ja käyttöliittymän toteutus ovat toisistaan erillään ohjelmassa. Seuraava koodi toteuttaa tämän niin, että moduuli `tuotteet.py` käsittelee tietokantaa ja moduuli `main.py` on pääohjelma, joka näyttää käyttöliittymän.

<p class="code-title">tuotteet.py</p>
```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

def lisaa_tuote(nimi, hinta):
    db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES (?,?)", [nimi, hinta])

def hae_hinta(nimi):
    hinta = db.execute("SELECT hinta FROM Tuotteet WHERE nimi=?", [nimi]).fetchone()
    if hinta:
        return hinta[0]
    else:
        return None
```

<p class="code-title">main.py</p>
```python
import tuotteet

print("1 - Lisää uusi tuote")
print("2 - Hae tuotteen hinta")
print("3 - Sulje ohjelma")

while True:
    komento = input("Anna komento: ")

    if komento == "1":
        nimi = input("Tuotteen nimi: ")
        hinta = input("Tuotteen hinta: ")
        tuotteet.lisaa_tuote(nimi, hinta)

    if komento == "2":
        nimi = input("Tuotteen nimi: ")
        hinta = tuotteet.hae_hinta(nimi)
        if hinta:
            print("Hinta on", hinta)
        else:
            print("Ei löytynyt")

    if komento == "3":
        break
```

Tällaisessa toteutuksessa käyttöliittymässä ei näy mitään siitä, että tiedot tallennetaan nimenomaan SQLite-tietokantaan, vaan tallennustapaa voisi periaatteessa muuttaa ilman, että käyttöliittymään tulisi mitään muutoksia.

Laajemmassa sovelluksessa olisi mielekästä jakaa tietokannan käsittely useampaan tiedostoon. Tällaisia sovelluksia tehdään myöhemmillä tietojenkäsittelytieteen kursseilla.

## Mitä tehdä missäkin

Tietokannan ja koodin puolella voi usein tehdä samantapaisia asioita. Esimerkiksi seuraavassa on kaksi tapaa etsiä kalleimman tuotteen hinta tietokannasta:

```python
kallein = db.execute("SELECT MAX(hinta) FROM Tuotteet").fetchone()
```

```python
hinnat = db.execute("SELECT hinta FROM Tuotteet").fetchall()
kallein = max(hinnat)
```

Ensimmäisessä tavassa haetaan kallein hinta tietokannan puolella SQL:n `MAX`-funktiolla. Toisessa tavassa puolestaan haetaan tietokannasta kaikkien tuotteiden hinnat listaan ja etsitään sitten koodin puolella listan kallein hinta Pythonin `max`-funktiolla.

Näistä kahdesta tavasta ensimmäinen tapa on selkeästi parempi: ei ole hyvä hakea turhaa tietoa koodin puolelle ja tehdä käsittelyä, jonka voi tehdä helposti myös tietokannassa.

Erityisesti kannattaa välttää tilannetta, jossa suoritetaan turhaan useita SQL-komentoja, vaikka vain yksi komento riittäisi. Esimerkiksi seuraavassa on huono tapa hakea tietokannasta jokaisen opettajan nimi ja kurssien määrä:

```python
opettajat = db.execute("SELECT id, nimi FROM Opettajat").fetchall()
for opettaja in opettajat:
    maara = db.execute("SELECT COUNT(*) FROM Kurssit WHERE opettaja_id=?", [opettaja[0]]).fetchone()
    print(opettaja[1], maara[0])
```

Koodi hakee ensin listaan kunkin opettajan id-numeron ja nimen ja sitten jokaisesta opettajasta erikseen niiden kurssien määrän, joita kyseinen opettaja opettaa. Koodi on kyllä toimiva mutta se tekee valtavasti turhaa työtä hakiessaan jokaisen tiedon erikseen. Parempi ratkaisu on muodostaa yksi kysely, joka hakee suoraan kaiken tarvittavan:

```python
tiedot = db.execute("SELECT O.nimi, COUNT(*) FROM Opettajat O LEFT JOIN Kurssit K ON O.id = K.opettaja_id GROUP BY O.id").fetchall()
for rivi in tiedot:
    print(rivi[0], rivi[1])
```

Tuloksena oleva kysely on monimutkaisempi, mutta sen avulla tietokantajärjestelmä voi optimoida kokonaisuutena halutun tiedon hakemisen ja toimittaa tiedon mahdollisimman tehokkaasti koodille.

Kuitenkaan tietokannan puolella ei kannata tehdä kaikkea, mikä on teoriassa mahdollista. Tästä esimerkkinä on seuraava koodi, joka hakee tietokannasta tuloslistan, jossa pelaajat on järjestettynä pistemäärän ja nimen mukaan. Tulostuksessa pelaajista näytetään myös sija (1, 2, 3, jne.) listalla.

```python
lista = db.execute("SELECT nimi, pisteet FROM Tulokset ORDER BY pisteet DESC, nimi").fetchall()
sija = 1
for tulos in lista:
    print(sija, tulos[0], tulos[1])
    sija += 1
```

Tässä tapauksessa pelaajien sijat lasketaan koodin puolella muuttujan `sija` avulla. Olisi mahdollista laatia monimutkainen SQL-kysely, jonka tulostaulussa on myös sijat, mutta tässä tapauksessa siitä tuskin olisi hyötyä, koska sijat voi laskea helposti ja tehokkaasti myös koodin puolella. Tällaisen kyselyn laatiminen on kuitenkin kiinnostava teoreettinen haaste, erityisesti käyttämättä ikkunafunktioita.
