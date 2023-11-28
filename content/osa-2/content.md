# 2. SQL-kielen perusteet

## Peruskomennot

Tässä luvussa tutustumme tavallisimpiin SQL-komentoihin, joiden avulla voimme lisätä, hakea, muuttaa ja poistaa tietokannan sisältöä. Nämä komennot muodostavat perustan tietokannan käyttämiselle.

### Taulun luonti

Komento `CREATE TABLE` luo taulun, jossa on halutut sarakkeet. Esimerkiksi seuraava komento luo taulun `Tuotteet`, jossa on kolme saraketta:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER);
```

Voimme nimetä taulun ja sarakkeet haluamallamme tavalla. Tällä kurssilla käytäntönä on, että kirjoitamme taulun nimen suurella alkukirjaimella ja monikkomuotoisena. Sarakkeiden nimet puolestaan kirjoitamme pienellä alkukirjaimella.

Jokaisesta sarakkeesta ilmoitetaan nimen lisäksi tyyppi. Tässä taulussa sarakkeet `id` ja `hinta` ovat kokonaislukuja (`INTEGER`) ja sarake `nimi` on merkkijono (`TEXT`). Sarake `id` on lisäksi taulun _pääavain_ (`PRIMARY KEY`), mikä tarkoittaa, että se yksilöi jokaisen taulun rivin ja voimme viitata sen avulla kätevästi mihin tahansa riviin.

#### Pääavain

Tietokannan taulun _pääavain_ on jokin sarake (tai sarakkeiden yhdistelmä), joka yksilöi taulun jokaisen rivin eli millään kahdella rivillä ei ole samaa pääavainta. Käytännössä hyvin tavallinen valinta pääavaimeksi on kokonaislukumuotoinen id-numero.

Usein haluamme lisäksi, että id-numerolla on _juokseva numerointi_. Tämä tarkoittaa, että kun tauluun lisätään rivejä, ensimmäinen rivi saa automaattisesti id-numeron 1, toinen rivi saa id-numeron 2, jne. Juoksevan numeroinnin toteuttaminen riippuu tietokantajärjestelmästä. Esimerkiksi SQLite-tietokannassa `INTEGER PRIMARY KEY` -tyyppinen sarake saa automaattisesti juoksevan numeroinnin.

### Tiedon lisääminen

Komento `INSERT` lisää uuden rivin tauluun. Esimerkiksi seuraava komento lisää rivin äsken luomaamme tauluun `Tuotteet`:

```sql
INSERT INTO Tuotteet (nimi,hinta) VALUES ('retiisi',7);
```

Tässä annamme arvot lisättävän rivin sarakkeille `nimi` ja `hinta`. Kun sarakkeessa `id` on juokseva numerointi, se saa automaattisesti arvon 1, kun kyseessä on taulun ensimmäinen rivi. Niinpä tauluun ilmestyy seuraava rivi:

```
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
```

Jos emme anna arvoa jollekin sarakkeelle, se saa oletusarvon. Tavallisessa sarakkeessa oletusarvo on `NULL`, mikä tarkoittaa tiedon puuttumista. Esimerkiksi seuraavassa komennossa emme anna arvoa sarakkeelle `hinta`:

```sql
INSERT INTO Tuotteet (nimi) VALUES ('retiisi');
```

Tällöin tauluun ilmestyy rivi, jossa hinta on `NULL` (eli tyhjä):

```
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     
```

### Esimerkkitaulu

Oletamme tämän osion tulevissa esimerkeissä, että olemme lisänneet tauluun `Tuotteet` seuraavat viisi riviä:

```sql
INSERT INTO Tuotteet (nimi,hinta) VALUES ('retiisi',7);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('porkkana',5);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('nauris',4);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('lanttu',8);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('selleri',4);
```

Taulun sisältö on siis seuraavanlainen:

```
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
4           lanttu      8         
5           selleri     4         
```

### Tiedon hakeminen

Komento `SELECT` suorittaa _kyselyn_ eli hakee tietoa taulusta. Yksinkertaisin tapa tehdä kysely on hakea kaikki tiedot taulusta:

```sql
SELECT * FROM Tuotteet;
```

Tässä tapauksessa kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
4           lanttu      8         
5           selleri     4         
```

Kyselyssä tähti `*` ilmaisee, että haluamme hakea kaikki sarakkeet. Kuitenkin voimme myös hakea vain osan sarakkeista. Esimerkiksi seuraava kysely hakee vain tuotteiden nimet:

```sql
SELECT nimi FROM Tuotteet;
```

Kyselyn tulos on seuraava:

```
nimi      
----------
retiisi    
porkkana             
nauris               
lanttu               
selleri              
```

Tämä kysely puolestaan hakee nimet ja hinnat:

```sql
SELECT nimi, hinta FROM Tuotteet;
```

Nyt kyselyn tulos muuttuu näin:

```
nimi        hinta     
----------  ----------
retiisi     7         
porkkana    5         
nauris      4         
lanttu      8         
selleri     4         
```

Kyselyn tuloksena olevat rivit muodostavat taulun, jota kutsutaan nimellä _tulostaulu_. Sen sarakkeet ja rivit riippuvat kyselyn sisällöstä. Esimerkiksi äskeinen kysely loi tulostaulun, jossa on kaksi saraketta ja viisi riviä.

Tietokannan käsittelyssä esiintyy siis kahdenlaisia tauluja: tietokannassa kiinteästi olevia tauluja, joihin on tallennettu tietokannan sisältö, sekä kyselyjen muodostamia väliaikaisia tulostauluja, joiden tiedot on koostettu kiinteistä tauluista.

#### Hakuehto

Liittämällä `SELECT`-kyselyyn `WHERE`-osan voimme valita vain osan riveistä halutun ehdon perusteella. Esimerkiksi seuraava kysely hakee tiedot lantusta:

```sql
SELECT * FROM Tuotteet WHERE nimi='lanttu';
```

Kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
4           lanttu      8        
```

Ehdoissa voi käyttää vertailuja ja sanoja `AND` ja `OR` samaan tapaan kuin ohjelmoinnissa. Esimerkiksi seuraava kysely etsii tuotteet, joiden hinta on välillä 4...6:

```sql
SELECT * FROM Tuotteet WHERE hinta>=4 AND hinta<=6;
```

Kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
2           porkkana    5         
3           nauris      4         
5           selleri     4         
```

#### Järjestäminen

Oletuksena kyselyn tuloksena olevien rivien järjestys voi olla mikä tahansa. Voimme kuitenkin määrittää halutun järjestyksen `ORDER BY` -osan avulla. Esimerkiksi seuraava kysely hakee tuotteet järjestyksessä nimen mukaan:

```sql
SELECT * FROM Tuotteet ORDER BY nimi;
```

Kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
4           lanttu      8         
3           nauris      4         
2           porkkana    5         
1           retiisi     7         
5           selleri     4  
```

Järjestys on oletuksena pienimmästä suurimpaan. Kuitenkin jos haluamme järjestyksen suurimmasta pienimpään, voimme lisätä sanan `DESC` sarakkeen nimen jälkeen:

```sql
SELECT * FROM Tuotteet ORDER BY nimi DESC;
```

Tämän seurauksena kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
5           selleri     4  
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
4           lanttu      8         
```

Tietokantakielessä järjestys on joko _nouseva_ (_ascending_) eli pienimmästä suurimpaan tai _laskeva_ (_descending_) eli suurimmasta pienimpään. Oletuksena järjestys on nouseva, ja avainsana `DESC` tarkoittaa siis laskevaa järjestystä.

SQL-kielessä on myös avainsana `ASC`, joka tarkoittaa nousevaa järjestystä. Seuraavat kyselyt toimivat siis samalla tavalla:

```sql
SELECT * FROM Tuotteet ORDER BY nimi;
```

```sql
SELECT * FROM Tuotteet ORDER BY nimi ASC;
```

Käytännössä sanaa `ASC` käytetään kuitenkin äärimmäisen harvoin.

Voimme myös järjestää rivejä usealla eri perusteella. Esimerkiksi seuraava kysely järjestää rivit ensisijaisesti kalleimmasta halvimpaan hinnan mukaan ja toissijaisesti aakkosjärjestykseen nimen mukaan:

```sql
SELECT * FROM Tuotteet ORDER BY hinta DESC, nimi;
```

Kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
4           lanttu      8         
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
5           selleri     4  
```

Tässä tapauksessa nauris ja selleri järjestetään nimen mukaan, koska ne ovat yhtä kalliita.

#### Erilliset tulosrivit

Joskus tulostaulussa voi olla useita samanlaisia rivejä. Näin käy esimerkiksi seuraavassa kyselyssä:

```sql
SELECT hinta FROM Tuotteet;
```

Koska kahden tuotteen hinta on 4, kahden tulosrivin sisältönä on 4:

```
hinta     
----------
7         
5         
4         
8         
4         
```

Jos kuitenkin haluamme vain erilaiset tulosrivit, voimme lisätä kyselyyn sanan `DISTINCT`:

```sql
SELECT DISTINCT hinta FROM Tuotteet;
```

Tämän seurauksena kyselyn tulos muuttuu näin:

```
hinta     
----------
7         
5         
4         
8         
```

### Tiedon muuttaminen

Komento `UPDATE` muuttaa taulun rivejä, jotka täsmäävät haluttuun ehtoon. Esimerkiksi seuraava komento muuttaa tuotteen 2 hinnaksi 6:

```sql
UPDATE Tuotteet SET hinta=6 WHERE id=2;
```

Useita sarakkeita voi muuttaa yhdistämällä muutokset pilkuilla. Esimerkiksi seuraava komento muuttaa tuotteen 2 nimeksi ananas ja hinnaksi 9:

```sql
UPDATE Tuotteet SET nimi='ananas', hinta=9 WHERE id=2;
```

Muutos voidaan myös laskea aiemman arvon perusteella. Esimerkiksi seuraava komento kasvattaa tuotteen 2 hintaa yhdellä:

```sql
UPDATE Tuotteet SET hinta=hinta+1 WHERE id=2;
```

Jos komennossa ei ole ehtoa, se vaikuttaa _kaikkiin_ riveihin. Esimerkiksi seuraava komento kasvattaa jokaisen tuotteen hintaa yhdellä:

```sql
UPDATE Tuotteet SET hinta=hinta+1;
```

### Tiedon poistaminen

Komento `DELETE` poistaa taulusta rivit, jotka täsmäävät annettuun ehtoon. Esimerkiksi seuraava komento poistaa taulusta tuotteen 5:

```sql
DELETE FROM Tuotteet WHERE id=5;
```

Kuten muuttamisessa, jos ehtoa ei ole, niin komento vaikuttaa kaikkiin riveihin. Seuraava komento siis poistaa _kaikki_ tuotteet taulusta:

```sql
DELETE FROM Tuotteet;
```

Komento `DROP TABLE` poistaa tietokannan taulun (ja kaiken sen sisällön). Esimerkiksi seuraava komento poistaa taulun `Tuotteet`:

```sql
DROP TABLE Tuotteet;
```

## Yhteenveto ja ryhmittely

Yhteenvetokysely laskee jonkin yksittäisen arvon taulun riveistä, kuten taulun rivien määrän tai sarakkeen kaikkien arvojen summan. Tällaisen kyselyn tulostaulussa on vain yksi rivi.

Yhteenvetokyselyn perustana on _koostefunktio_, joka laskee yhteenvetoarvon taulun riveistä. Tavallisimmat koostefunktiot ovat seuraavat:

* `COUNT()` laskee rivien määrän
* `SUM()` laskee summan arvoista
* `MIN()` hakee pienimmän arvon
* `MAX()` hakee suurimman arvon

### Esimerkkejä

Tarkastellaan taas taulua `Tuotteet`:

```
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
4           lanttu      8         
5           selleri     4         
```

Seuraava kysely hakee taulun rivien määrän:

```sql
SELECT COUNT(*) FROM Tuotteet;
```

```
COUNT(*)
----------
5
```

Seuraava kysely hakee niiden rivien määrän, joissa hinta on 4:

```sql
SELECT COUNT(*) FROM Tuotteet WHERE hinta=4;
```

```
COUNT(*)
----------
2
```

Seuraava kysely puolestaan laskee summan tuotteiden hinnoista:

```sql
SELECT SUM(hinta) FROM Tuotteet;
```

```
SUM(hinta)
----------
28
```

### Rivien valinta

Jos `COUNT`-funktion sisällä on tähti `*`, kysely laskee kaikki rivit. Jos taas funktion sisällä on sarakkeen nimi, kysely laskee rivit, joissa sarakkeessa on arvo (eli sarake ei ole `NULL`).

Tarkastellaan esimerkkinä seuraavaa taulua, jossa rivillä 3 ei ole hintaa:

```
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
2           nauris      4         
3           lanttu               
4           selleri     4         
```

Seuraava kysely hakee rivien yhteismäärän:

```sql
SELECT COUNT(*) FROM Tuotteet;
```

```
COUNT(*)  
----------
4
```

Seuraava kysely taas hakee niiden rivien määrän, joilla on hinta:

```sql
SELECT COUNT(hinta) FROM Tuotteet;
```

```
COUNT(hinta)
------------
3
```

Voimme myös käyttää sanaa `DISTINCT`, jotta saamme laskettua, montako eri arvoa jossakin sarakkeessa on:

```sql
SELECT COUNT(DISTINCT hinta) FROM Tuotteet;
```

```
COUNT(DISTINCT hinta)
---------------------
2
```

### Ryhmittely

Ryhmittelyn avulla voimme yhdistää rivikohtaista ja koostefunktion antamaa tietoa. Ideana on, että rivit jaetaan ryhmiin `GROUP BY` -osassa annettujen sarakkeiden mukaan ja tämän jälkeen koostefunktion arvo lasketaan jokaiselle ryhmälle erikseen.

#### Esimerkki

Tarkastellaan esimerkkinä seuraavaa taulua `Tyontekijat`, jossa on työntekijöiden tietoja:

```
id          nimi        yritys      palkka    
----------  ----------  ----------  ----------
1           Anna        Google      8000      
2           Liisa       Google      7500      
3           Kaaleppi    Amazon      5000      
4           Uolevi      Amazon      8000      
5           Maija       Google      9500      
6           Vihtori     Facebook    5000    
```

Seuraava kysely hakee kunkin yrityksen työntekijöiden määrän:

```sql
SELECT yritys, COUNT(*) FROM Tyontekijat GROUP BY yritys;
```

Kyselyn tulos on seuraava:

```
yritys      COUNT(*)  
----------  ----------
Amazon      2         
Facebook    1
Google      3    
```

Tämä tarkoittaa, että Amazonilla on 2 työntekijää, Facebookilla on 1 työntekijä ja Googlella on 3 työntekijää.

#### Miten ryhmittely toimii?

Äskeisessä kyselyssä ryhmittelyn ehtona on `GROUP BY yritys`, joten rivit jaetaan ryhmiin sarakkeen `yritys` mukaan. Tässä tapauksessa ryhmät ovat:

```
id          nimi        yritys      palkka    
----------  ----------  ----------  ----------
3           Kaaleppi    Amazon      5000      
4           Uolevi      Amazon      8000      
```

```
id          nimi        yritys      palkka    
----------  ----------  ----------  ----------
6           Vihtori     Facebook    5000    
```

```
id          nimi        yritys      palkka    
----------  ----------  ----------  ----------
1           Anna        Google      8000      
2           Liisa       Google      7500      
5           Maija       Google      9500     
```

Tämän jälkeen jokaiselle ryhmälle lasketaan rivien määrä koostefunktion `COUNT(*)` avulla.

Ryhmittely tuottaa tulostaulun, jonka rivien määrä on sama kuin ryhmien määrä. Jokaisella rivillä voi esiintyä ryhmittelyssä käytettyjä sarakkeita sekä koostefunktioita.

Huomaa, että SQLite sallii myös seuraavan kyselyn, jossa haetaan ryhmittelyn ulkopuolinen sarake:

```sql
SELECT yritys, nimi FROM Tyontekijat GROUP BY yritys;
```

```
yritys      nimi      
----------  ----------
Amazon      Uolevi    
Facebook    Vihtori
Google      Maija    
```

Koska sarake `nimi` ei kuulu ryhmittelyyn, sillä voi olla useita arvoja ryhmässä ja tulostauluun tulee yksi niistä. Tällainen kysely ei kuitenkaan toimi kaikissa tietokannoissa.

#### Lisää kyselyjä

Seuraava kysely hakee joka yrityksestä palkkojen summan:

```sql
SELECT yritys, SUM(palkka) FROM Tyontekijat GROUP BY yritys;
```

```
yritys      SUM(palkka)
----------  -----------
Amazon      13000      
Facebook    5000
Google      25000   
```

Seuraava kysely puolestaan hakee korkeimman palkan:

```sql
SELECT yritys, MAX(palkka) FROM Tyontekijat GROUP BY yritys;
```

```
yritys      MAX(palkka)
----------  -----------
Amazon      8000   
Facebook    5000
Google      9500
```

### Tulossarakkeen nimentä

Oletuksena tulostaulun sarake saa nimen suoraan kyselyn perusteella, mutta voimme halutessamme antaa myös oman nimen `AS`-sanan avulla. Tämän ansiosta voimme esimerkiksi selventää,
mistä yhteenvetokyselyssä on kyse.

Esimerkiksi seuraavassa kyselyssä toisen sarakkeen nimeksi tulee `korkein`:

```sql
SELECT yritys, MAX(palkka) AS korkein FROM Tyontekijat GROUP BY yritys;
```

```
yritys      korkein
----------  ----------
Amazon      8000         
Facebook    5000
Google      9500       
```

Sana `AS` ei ole pakollinen, eli voisimme kirjoittaa kyselyn myös näin:

```sql
SELECT yritys, MAX(palkka) korkein FROM Tyontekijat GROUP BY yritys;
```

### Rajaus ryhmittelyn jälkeen

Voimme lisätä kyselyyn myös `HAVING`-osan, joka rajaa tuloksia ryhmittelyn jälkeen. Esimerkiksi seuraava kysely hakee yritykset, joissa on ainakin kaksi työntekijää:

```sql
SELECT yritys, COUNT(*) FROM Tyontekijat GROUP BY yritys HAVING COUNT(*) >= 2;
```

```
yritys      COUNT(*)  
----------  ----------
Amazon      2         
Google      3     
```

Voimme myös käyttää koostefunktiota vain `HAVING`-osassa:

```sql
SELECT yritys FROM Tyontekijat GROUP BY yritys HAVING COUNT(*) >= 2;
```

```
yritys    
----------
Amazon    
Google    
```

### Kyselyn yleiskuva

SQL-kyselyn yleiskuva on seuraava:

`SELECT` – `FROM` – `WHERE` – `GROUP BY` – `HAVING` – `ORDER BY`

Kyselystä riippuu, mitkä näistä osista siinä esiintyvät. Tämä on kuitenkin aina järjestys,
jossa kyselyn osat sijaitsevat toisiinsa nähden.

Seuraavassa on esimerkki kyselystä, joka sisältää yhtä aikaa kaikki nämä osat.

#### Esimerkki

Tarkastellaan taulua `Tehtavat`, jossa on projekteihin liittyviä tehtäviä. Jokaisella tehtävällä on tietty tärkeysaste. Tehtävä on _kriittinen_, jos sen tärkeysaste on ainakin 3.

```
id          projekti_id  tarkeys   
----------  -----------  ----------
1           1            3         
2           1            4         
3           1            4         
4           2            1         
5           2            5         
6           3            2         
7           3            4         
8           3            5   
```

Seuraava kysely etsii projektit, joissa on vähintään kaksi kriittistä tehtävää, ja järjestää ne projektin id-numeron mukaan:

```sql
SELECT
  projekti_id, COUNT(*)
FROM
  Tehtavat
WHERE
  tarkeys >= 3
GROUP BY
  projekti_id
HAVING
  COUNT(*) >= 2
ORDER BY
  projekti_id;
```

Kyselyn tulos on tässä:

```
projekti_id  COUNT(*)  
-----------  ----------
1            3         
3            2         
```

Tämä tarkoittaa, että projektissa 1 on 3 kriittistä tehtävää ja projektissa 3 on 2 kriittistä tehtävää.

#### Miten kysely toimii?

Kyselyn lähtökohtana ovat kaikki taulussa `Tehtavat` olevat rivit. Ehto `WHERE tarkeys >= 3` valitsee käsittelyyn seuraavat rivit:

```
id          projekti_id  tarkeys   
----------  -----------  ----------
1           1            3         
2           1            4         
3           1            4         
5           2            5         
7           3            4         
8           3            5   
```

Kyselyssä on käytössä ryhmittely `GROUP BY projekti_id`, joka jakaa rivit ryhmiin näin:

```
id          projekti_id  tarkeys   
----------  -----------  ----------
1           1            3         
2           1            4         
3           1            4         
```

```
id          projekti_id  tarkeys   
----------  -----------  ----------
5           2            5         
```

```
id          projekti_id  tarkeys   
----------  -----------  ----------
7           3            4         
8           3            5   
```

Osa `HAVING COUNT(*) >= 2` valitsee ryhmät, joissa on ainakin kaksi riviä:

```
id          projekti_id  tarkeys   
----------  -----------  ----------
1           1            3         
2           1            4         
3           1            4         
```

```
id          projekti_id  tarkeys   
----------  -----------  ----------
7           3            4         
8           3            5   
```

Tulostauluun valitaan joka ryhmästä sarake `projekti_id` sekä funktion `COUNT(*)` arvo, ja `ORDER BY projekti_id` järjestää rivit projektin id-numeron mukaan:

```
projekti_id  COUNT(*)  
-----------  ----------
1            3       
3            2         
```

## SQLite-tietokanta

SQLite on yksinkertainen avoimesti saatavilla oleva tietokantajärjestelmä, joka soveltuu hyvin SQL-kielen opetteluun. Voit kokeilla helposti SQL-kieleen liittyviä asioita SQLiten avulla,
ja käytämme sitä tämän kurssin harjoituksissa.

SQLite on mainio valinta SQL-kielen harjoitteluun, mutta siinä on tiettyjä rajoituksia, jotka voivat aiheuttaa ongelmia todellisissa sovelluksissa. Muita suosittuja avoimia tietokantajärjestelmiä ovat MySQL ja PostgreSQL. Niissä on suuri määrä ominaisuuksia, jotka puuttuvat SQLitestä, mutta toisaalta niiden asentaminen ja käyttäminen on vaikeampaa.

Eri tietokantajärjestelmien välillä siirtyminen on onneksi helppoa, koska kaikissa on samantapainen SQL-kieli. Tutustumme PostgreSQL-tietokannan käyttämiseen myöhemmin _Tietokantasovellus_-kurssilla.

### SQLite-tulkki

SQLite-tulkki on ohjelma, jonka kautta voidaan käyttää SQLite-tietokantaa. Tulkki käynnistyy antamalla komentorivillä komento `sqlite3`. Tämän jälkeen tulkkiin voi kirjoittaa joko suoritettavia SQL-komentoja tai pisteellä alkavia SQLite-tulkin omia komentoja.

Jos käyttämälläsi koneella ei ole vielä SQLite-tulkkia, voit asentaa sen tästä:

* [https://www.sqlite.org/download.html](https://www.sqlite.org/download.html)

Valitse oman käyttöjärjestelmäsi mukainen paketti, jonka vieressä on otsikko _command-line tools_ (eli komentorivityökalut). Tarvittava tiedosto on se, jonka nimi alkaa `sqlite3`.

### Esimerkki

SQLite-tulkissa tietokanta on oletuksena muistissa (_in-memory database_), jolloin se on aluksi tyhjä ja katoaa, kun tulkki suljetaan. Tämä on hyvä tapa testailla SQL-kielen ominaisuuksia. Keskustelu tulkin kanssa voi näyttää vaikkapa tältä:

```prompt
$ sqlite3
SQLite version 3.11.0 2016-02-15 17:29:24
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER);
sqlite> .tables
Tuotteet
sqlite> INSERT INTO Tuotteet (nimi,hinta) VALUES ('retiisi',7);
sqlite> INSERT INTO Tuotteet (nimi,hinta) VALUES ('porkkana',5);
sqlite> INSERT INTO Tuotteet (nimi,hinta) VALUES ('nauris',4);
sqlite> INSERT INTO Tuotteet (nimi,hinta) VALUES ('lanttu',8);
sqlite> INSERT INTO Tuotteet (nimi,hinta) VALUES ('selleri',4);
sqlite> SELECT * FROM Tuotteet;
1|retiisi|7
2|porkkana|5
3|nauris|4
4|lanttu|8
5|selleri|4
sqlite> .mode column
sqlite> .headers on
sqlite> SELECT * FROM Tuotteet;
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
4           lanttu      8         
5           selleri     4         
sqlite> .quit
```

Esimerkissä luomme aluksi taulun `Tuotteet` ja tarkastamme sitten komennolla `.tables`, mitä tauluja tietokannassa on. Ainoa taulu on `Tuotteet`, mikä kuuluu asiaan.

Tämän jälkeen lisäämme tauluun rivejä ja haemme sitten kaikki rivit taulusta. SQLite-tulkin oletustapa näyttää tulosrivit pystyviivoin erotettuina ei ole kovin tyylikäs, minkä vuoksi parannamme tulostusta komennoilla `.mode column` (jokaisella sarakkeella on kiinteä leveys) ja `.headers on` (sarakkeiden nimet näytetään).

Lopuksi suoritamme komennon `.quit`, joka sulkee SQLite-tulkin.

### Tietokanta tiedostossa

Käynnistyksen yhteydessä SQLite-tulkille voi antaa parametrina tiedoston, johon tietokanta tallennetaan. Tällöin tietokannan sisältö säilyy tallessa tulkin sulkemisen jälkeen.

Seuraavassa esimerkissä tietokanta tallennetaan tiedostoon `testi.db`. Tämän ansiosta tietokannan sisältö on edelleen tallessa, kun tulkki käynnistetään uudestaan.

```prompt
$ sqlite3 testi.db
SQLite version 3.11.0 2016-02-15 17:29:24
Enter ".help" for usage hints.
sqlite> CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER);
sqlite> .tables
Tuotteet
sqlite> .quit
$ sqlite3 testi.db
SQLite version 3.11.0 2016-02-15 17:29:24
Enter ".help" for usage hints.
sqlite> .tables
Tuotteet
sqlite> .quit
```

### Komennot tiedostosta

Voimme myös ohjata SQLite-tulkille tiedoston, jossa olevat komennot suoritetaan peräkkäin. Tämän avulla voimme automatisoida komentojen suorittamista. Esimerkiksi voimme laatia seuraavan tiedoston `komennot.sql`:

```
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('retiisi',7);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('porkkana',5);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('nauris',4);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('lanttu',8);
INSERT INTO Tuotteet (nimi,hinta) VALUES ('selleri',4);
.mode column
.headers on
SELECT * FROM Tuotteet;
```

Tämän jälkeen voimme ohjata komennot tiedostosta tulkille näin:

```prompt
$ sqlite3 < komennot.sql
id          nimi        hinta     
----------  ----------  ----------
1           retiisi     7         
2           porkkana    5         
3           nauris      4         
4           lanttu      8         
5           selleri     4         
```
