---
title: SQLite Pythonissa
hidden: true
---

# SQLite Pythonissa

Pythonin standardikirjaston osana on moduuli `sqlite3`,
jonka kautta pystyy käsittelemään SQLite-tietokantaa.
Tämä sivu kertoo perusasiat moduulin käyttämisestä,
ja voit halutessasi etsiä lisätietoa Pythonin dokumentaatiosta.

## Esimerkki

Seuraava koodi käyttää tietokantaa, joka on tiedostossa `testi.db`.
Koodi luo taulun `Tuotteet` ja lisää sinne viisi riviä.
Tämän jälkeen koodi hakee ja näyttää taulun rivit.

```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

c = db.cursor()

c.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)")
c.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('retiisi',7)")
c.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('porkkana',5)")
c.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('nauris',4)")
c.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('lanttu',8)")
c.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('selleri',4)")

c.execute("SELECT * FROM Tuotteet")
print(c.fetchall())
```

Koodin tulostus on seuraava:

```prompt
[(1, 'retiisi', 7), (2, 'porkkana', 5), (3, 'nauris', 4), (4, 'lanttu', 8), (5, 'selleri', 4)]
```

Tietokantaa käytetään _kursorin_ kautta,
jonka metodi `execute` suorittaa halutun komennon.
Komennon `SELECT` suorituksen jälkeen metodi `fetchall`
hakee tulosrivit.

Asetus `isolation_level = None` tarkoittaa, että oletuksena jokainen
komento on oma transaktionsa (kuten SQLite-tulkissa).

Huomaa, että jos suoritat koodin uudestaan,
tapahtuu virhe, koska taulu `Tuotteet` on jo tietokannassa mutta
ohjelma yrittää luoda sen uudestaan.
Voit aina halutessasi nollata tietokannan sisällön
poistamalla tiedoston `testi.db`.


## Tiedon hakeminen käyttäjänä

Seuraava koodi näyttää esimerkin, jossa käyttäjä pystyy
hakemaan tietoa tietokannasta, jossa on valmiina taulu `Tuotteet`:

```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

c = db.cursor()

print("Anna tuotteen nimi:")
nimi = input()

c.execute("SELECT hinta FROM Tuotteet WHERE nimi=?",[nimi])
tiedot = c.fetchone()
if tiedot != None:
    print("Hinta:",tiedot[0])
else:
    print("Tuotetta ei löytynyt")    
```

Tässä on käytössä _parametrisoitu_ kysely,
jossa on käyttäjän antaman tiedon kohdalla `?` ja
tieto annetaan erikseen listassa kyselyn jälkeen.
Metodi `fetchone` antaa yhden tulosrivin tai `None`,
jos kysely ei palauttanut mitään riviä.

Tässä on esimerkkejä koodin toiminnasta:

```prompt
Anna tuotteen nimi:
selleri
Hinta: 4
```

```prompt
Anna tuotteen nimi:
banaani
Tuotetta ei löytynyt
```

Parametrisoitu kysely on turvallinen tapa yhdistää käyttäjän
antamaa tietoa kyselyyn,
koska tällöin käyttäjän antama tieto ei sekoitu SQL-komentoihin.
Sen sijaan vaarallinen tapa olisi yhdistää käyttäjän antama
tieto suoraan kyselyyn:

```python
c.execute("SELECT hinta FROM Tuotteet WHERE nimi='"+nimi+"'")
```

Nyt käyttäjä voisi antaa vaikka seuraavan tuotteen "nimen":

```prompt
Anna tuotteen nimi:
' OR id=1 OR nimi='
Hinta: 7
```

Tämä tuottaa kyselyn `SELECT hinta FROM Tuotteet WHERE nimi='' OR id=1 OR nimi=''`,
joka hakeekin tietokannasta tuotteen, jonka id on 1.
Käyttäjä voisi siis koettaa hakea tietoa, johon hänellä ei kuuluisi olla pääsyä.

Tällaisesta kyselyn rakennetta muuttavasta käyttäjän antamasta
tiedosta käytetään nimeä _SQL-injektio_.
Tämä oli etenkin takavuosina tavallinen tapa murtautua
huonosti toteutettuihin nettisivustoihin.

## Tiedon muuttaminen käyttäjänä

Tässä on vielä esimerkki, jossa käyttäjä pystyy lisäämään tuotteen:

```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

c = db.cursor()

print("Anna tuotteen nimi:")
nimi = input()
print("Anna tuotteen hinta:")
hinta = input()

c.execute("INSERT INTO Tuotteet(nimi,hinta) VALUES (?,?)",[nimi,hinta])

print("Tuote lisätty id:llä",c.lastrowid)
```

Kuten tiedon hakemisessa, turvallinen tapa toteuttaa kysely on
käyttää parametrisoitua kyselyä.
Rivin lisäämisen jälkeen kentässä `lastrowid` on 
lisätyn rivin id-numero, josta olisi hyötyä,
jos esimerkiksi lisäisimme vielä toisen rivin,
joka viittaa siihen.

Koodin suoritus voi näyttää seuraavalta:

```prompt
Anna tuotteen nimi:
banaani
Anna tuotteen hinta:
3
Tuote lisätty id:llä 6
```

## Virheenkäsittely

Jos kyselyssä tapahtuu virhe, niin tämä keskeyttää ohjelman suorituksen.
Näin käy vaikkapa seuraavassa kyselyssä, jos taulua `Kurssit` ei ole olemassa:

```python
c.execute("SELECT * FROM Kurssit")
```

Tässä tapauksessa ohjelma päättyy seuraavaan virheeseen:

```prompt
Traceback (most recent call last):
  File "testi4.py", line 7, in <module>
      c.execute("SELECT * FROM Kurssit")
sqlite3.OperationalError: no such table: Kurssit
```

Voimme kuitenkin halutessamme varautua virheeseen `try`-rakenteen
avulla vaikkapa näin:

```python
try:
    c.execute("SELECT * FROM Kurssit")
except:
    print("Kysely ei onnistunut")    
```

Nyt virhetilanteessa ohjelma tulostaa viestin ja jatkaa toimintaansa.
