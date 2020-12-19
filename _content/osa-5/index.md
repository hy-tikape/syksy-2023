---
nav-title: 5. Tietokannat ohjelmoinnissa
sub-sections:
      - sub-section-title: Tietokannan käyttäminen
      - sub-section-title: Parametrit
      - sub-section-title: Virheenkäsittely
---
      
# 5. Tietokannat ohjelmoinnissa

## Tietokannan käyttäminen

Python-kielen standardikirjastossa on moduuli `sqlite3`, jonka avulla voidaan käyttää SQLite-tietokantaa. Seuraava ohjelma esittelee moduulin käyttämistä:

```python
import sqlite3

db = sqlite3.connect("testi.db")
db.isolation_level = None

db.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)")

db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('selleri', 5)")
db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('nauris', 8)")
db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES ('lanttu', 4)")

tuotteet = db.execute("SELECT nimi, hinta FROM Tuotteet").fetchall()
print(tuotteet)

hinta = db.execute("SELECT MAX(hinta) FROM Tuotteet").fetchone()
print(hinta)
```

Ohjelma toimii seuraavasti:

```prompt
[('selleri', 5), ('nauris', 8), ('lanttu', 4)]
(8,)
```

Katsotaan seuraavaksi tarkemmin joitakin koodin osia:

### Yhteys tietokantaan

```python
db = sqlite3.connect("testi.db")
```

Tämä koodi luo olion `db`, jonka kautta voidaan käyttää tiedostossa `testi.db` olevaa tietokantaa. Tiedoston tulee olla hakemistossa, jossa koodi suoritetaan. Jos tiedostoa ei ole olemassa, se luodaan ja tietokanta on aluksi tyhjä.

### Komentojen suoritus 

```python
db.isolation_level = None
```

Tämä rivi määrittää, että SQL-komennon suorittaminen aiheuttaa välittömästi muutoksen tietokantaan, samaan tapaan kuin SQLite-tulkissa.

```python
db.execute(...)
```

Metodilla `execute` voi suorittaa SQL-komentoja, kuten luoda uuden taulun komennolla `CREATE TABLE` ja lisätä rivin tauluun komennolla `INSERT`.

### Tiedon hakeminen

```python
tuotteet = db.execute("SELECT nimi, hinta FROM Tuotteet").fetchall()
```

Metodi `fetchall` hakee kyselyn antamat rivit listana, jossa jokaista riviä vastaa yksi tuple. Tässä tapauksessa kysely antaa kolme riviä, joten listaan tulee kolme tuplea.

```python
hinta = db.execute("SELECT MAX(hinta) FROM Tuotteet").fetchone()
```

Metodi `fetchone` hakee ensimmäisen kyselyn antaman rivin, ja sitä käytetään usein silloin, kun kysely palauttaa vain yhden rivin. Tässä tapauksessa kysely antaa suurimman hinnan.

### Taulu on jo olemassa?

Jos koodi suoritetaan uudestaan, tuleekin virheilmoitus:

```prompt
Traceback (most recent call last):
  File "testi.py", line 11, in <module>
    """)
sqlite3.OperationalError: table Tuotteet already exists
```

Tämä johtuu siitä, että tietokannan sisältö säilyy tiedostossa `testi.db` ohjelman suorituskertojen välillä. Koska taulu on jo luotu, sitä ei voida luoda uudestaan. Kuitenkin tarvittaessa tiedoston `testi.db` voi aina poistaa, ja kaikki alkaa alusta.

## Parametrit

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
        tulos = db.execute("SELECT hinta FROM Tuotteet WHERE nimi=?", [nimi])
        hinta = tulos.fetchone()
        if hinta:
            print("Hinta on", hinta[0])
        else:
            print("Ei löytynyt")
        
    if komento == "3":
        break
```

Ohjelman suoritus voi näyttää seuraavalta:

```prompt
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
Tuotteen hinta: 19
Anna komento: 2 
Tuotteen nimi: palsternakka
Hinta on 19
Anna komento: 3
```

Ohjelma liittää käyttäjän antamat tiedot SQL-komentoihin parametrien avulla. Parametri merkitään SQL-komentoon merkillä `?`, ja parametrien halutut arvot annetaan listassa `execute`-metodissa samassa järjestyksessä.

Esimerkiksi kun kysely on `SELECT hinta FROM Tuotteet WHERE nimi=?` ja muuttujan `nimi` sisältönä on `selleri`, kyselystä tulee `SELECT hinta FROM Tuotteet WHERE nimi='hinta'`. Parametri yhdistetään automaattisesti kyselyyn oikealla tavalla: esimerkiksi tässä tapauksessa merkkijonon ympärille tulee `'`-merkit.

### Miksi käyttää parametreja?

Seuraavat kyselyt näyttävät päältä päin samanlaisilta:

```python
tulos = db.execute("SELECT hinta FROM Tuotteet WHERE nimi=?", [nimi])
```

```python
tulos = db.execute(f"SELECT hinta FROM Tuotteet WHERE nimi='{nimi}'")
```

Ensimmäisessä kyselyssä on käytetty parametria, kun taas toisessa kyselyssä muuttujan arvo on lisätty suoraan merkkijonon osaksi. Mitä hyötyä on käyttää parametria?

Syy käyttää parametria on, että silloin tieto liitetään varmasti oikealla tavalla kyselyn osaksi. Esimerkiksi jos tuotteen nimi on `Pepe's Drink`, nimessä esiintyy `'`-merkki ja oikea tapa antaa ehto kyselyssä on `nimi='Pepe\'s Drink'`. Kun tieto annetaan parametrina, tämä muutos tehdään automaattisesti.

Erityisesti web-sovelluksissa parametrien käyttäminen estää myös SQL-injektion, jossa pahantahtoinen käyttäjä yrittää muuttaa kyselyn rakennetta. Tutustumme aiheeseen tarkemmin kurssilla [Tietokantasovellus](https://hy-tsoha.github.io/materiaali/).
