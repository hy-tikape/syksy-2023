# 7. Tietokannan ominaisuudet

## Tiedon eheys

Tiedon eheys viittaa siihen, että tietokannassa oleva tieto on paikkansa pitävää ja ristiriidatonta. Päävastuu tiedon laadusta on toki käyttäjällä tai sovelluksella, joka muuttaa tietokantaa, mutta myös tietokannan suunnittelija voi vaikuttaa asiaan lisäämällä tauluihin ehtoja, jotka tarkkailevat tietokantaan syötettävää tietoa.

### Sarakkeiden ehdot

Voimme määrittää taulun luonnin yhteydessä sarakkeisiin liittyviä ehtoja, joita tietokantajärjestelmä valvoo tiedon lisäämisen ja muuttamisen yhteydessä. Näillä ehdoilla voi ohjata sitä, millaista tietoa tietokantaan ilmestyy. Tyypillisiä ehtoja ovat seuraavat:

#### UNIQUE

Ehto `UNIQUE` tarkoittaa, että kyseisessä sarakkeessa tulee olla eri arvo joka rivillä. Esimerkiksi seuraavassa taulussa vaatimuksena on, että joka tuotteella on eri nimi:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT UNIQUE, hinta INTEGER);
```

Ehto `UNIQUE` voi kohdistua myös useampaan sarakkeeseen, jolloin se merkitään erikseen sarakkeiden jälkeen:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER, UNIQUE(nimi,hinta));
```

Tämä tarkoittaa, että taulussa ei voi olla kahta riviä, joilla on sama nimi ja sama hinta.

#### NOT NULL ja DEFAULT

Ehto `NOT NULL` tarkoittaa, että kyseisessä sarakkeessa ei saa olla arvoa `NULL`. Esimerkiksi seuraavassa taulussa tuotteen hinta ei saa olla tyhjä:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER NOT NULL);
```

Tähän liittyy myös määre `DEFAULT`, jonka seurauksena sarake saa tietyn oletusarvon, jos sille ei anneta arvoa rivin lisäämisessä. Esimerkiksi voimme määrittää oletusarvon 0 näin:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER DEFAULT 0);
```

#### CHECK

Yleisempi tapa luoda ehto on käyttää avainsanaa `CHECK`, jonka jälkeen voi kirjoittaa minkä tahansa ehtolausekkeen. Esimerkiksi seuraava komento luo taulun tuotteista, jossa rivin ehtona on `hinta >= 0` eli hinta ei saa olla negatiivinen:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER, CHECK (hinta >= 0));
```

### Ehtojen valvonta

Ehtojen hyötynä on, että tietokantajärjestelmä valvoo niitä ja kieltäytyy tekemästä lisäystä tai muutosta, joka rikkoisi ehdon. Seuraavassa on esimerkki tästä SQLitessä:

```prompt
sqlite> CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER, CHECK (hinta >= 0));
sqlite> INSERT INTO Tuotteet(nimi,hinta) VALUES ('retiisi',4);
sqlite> INSERT INTO Tuotteet(nimi,hinta) VALUES ('selleri',7);
sqlite> INSERT INTO Tuotteet(nimi,hinta) VALUES ('nauris',-2);
Error: CHECK constraint failed: Tuotteet
sqlite> SELECT * FROM Tuotteet;
1|retiisi|4
2|selleri|7
sqlite> UPDATE Tuotteet SET hinta=-2 WHERE id=2;
Error: CHECK constraint failed: Tuotteet
```

Kun koetamme lisätä tauluun `Tuotteet` rivin, jossa hinta on negatiivinen, tämä rikkoo ehdon `hinta >= 0` ja SQLite ei salli rivin lisäämistä vaan antaa virheen `CHECK constraint failed: Tuotteet`. Samalla tavalla käy, jos koetamme muuttaa olemassa olevan rivin sarakkeen hinnan negatiiviseksi jälkeenpäin.

### Ehdot ohjelmoinnissa

Seuraava esimerkki näyttää, miten taulussa olevaa ehtoa voidaan hyödyntää ohjelmoinnissa. Haluamme, että tietokannan jokaisella tuotteella on eri nimi, minkä vuoksi sarakkeessa `nimi` on ehtona `UNIQUE`:

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT UNIQUE, hinta INTEGER);
```

Nyt tuotteen lisäämisen tietokantaan voi toteuttaa näin:

```python
nimi = input("Anna nimi: ")
hinta = input("Anna hinta: ")
try:
    db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES (?,?)", [nimi, hinta])
except:
    print("Lisäys ei onnistunut")
```

Tässä tapauksessa komento `INSERT` epäonnistuu siinä tapauksessa, että taulussa on jo valmiina samanniminen tuote. Niinpä koodi voi _yrittää_ lisätä tuotetta tutkimatta, onko tuote jo valmiina taulussa, ja jos tästä tulee virhe, tiedetään, että tuote oli valmiina.

Tämä on selkeästi parempi toteutus kuin tutkia koodissa ennen lisäämistä `SELECT`-kyselyllä, onko tuotetta jo tietokannassa, koska `UNIQUE`-ehdon avulla tietokanta pitää luotettavasti huolen asiasta ja koodiakin tarvitaan vähemmän. Jos taulussa ei olisi `UNIQUE`-ehtoa ja sovellus suorittaisi komennot `SELECT` ja `INSERT`, olisi mahdollista, että toinen tietokannan käyttäjä ehtisi lisätä välissä saman tuotteen tauluun, jolloin taulussa olisikin kaksi tuotetta samalla nimellä. Kuitenkaan `UNIQUE`-ehdon kanssa näin ei voi tapahtua mitenkään.

### Viittausten ehdot

Voimme liittää myös tauluihin ehtoja, jotka pitävät huolen siitä, että tauluissa olevat viittaukset viittaavat todellisiin riveihin. Tämä tapahtuu luomalla _viiteavain_ (_foreign key_), joka ilmaisee, mihin taulussa oleva rivi viittaa.

Tarkastellaan esimerkkinä seuraavia tauluja:

```sql
CREATE TABLE Opettajat (id INTEGER PRIMARY KEY, nimi TEXT);
CREATE TABLE Kurssit (id INTEGER PRIMARY KEY, nimi TEXT, opettaja_id INTEGER);
```

Tässä tarkoituksena on, että taulun `Kurssit` sarake `opettaja_id` viittaa taulun `Opettajat` sarakkeeseen `id`, mutta tietokannan käyttäjä voi antaa sarakkeen `opettaja_id` arvoksi mitä tahansa (esim. luvun 123), jolloin tietokannan sisältö muuttuu epämääräiseksi.

Voimme parantaa tilannetta kertomalla taulun `Kurssit` luonnissa, että sarake `opettaja_id` on viiteavain tauluun `Opettajat`:

```sql
CREATE TABLE Kurssit (id INTEGER PRIMARY KEY, nimi TEXT, opettaja_id INTEGER REFERENCES Opettajat);
```

Tämän jälkeen voimme luottaa siihen, että taulussa `Kurssit` sarakkeen `opettaja_id` arvot
viittaavat todellisiin riveihin taulussa `Opettajat`.

Huomaa, että historiallisista syistä SQLite _ei_ oletuksena valvo viiteavainten ehtoja, vaan meidän tulee ensin suorittaa seuraava komento:

```prompt
sqlite> PRAGMA foreign_keys = ON;
```

Tämä on SQLiten erikoisuus, ja muissa tietokannoissa viiteavaimia valvotaan aina.

Tässä on esimerkki viiteavaimen käyttämisestä:

```prompt
sqlite> PRAGMA foreign_keys = ON;
sqlite> CREATE TABLE Opettajat (id INTEGER PRIMARY KEY, nimi TEXT);
sqlite> CREATE TABLE Kurssit (id INTEGER PRIMARY KEY, nimi TEXT, opettaja_id INTEGER
   ...>                       REFERENCES Opettajat);
sqlite> INSERT INTO Opettajat (nimi) VALUES ('Kaila');
sqlite> INSERT INTO Opettajat (nimi) VALUES ('Kivinen');
sqlite> SELECT * FROM Opettajat;
1|Kaila
2|Kivinen
sqlite> INSERT INTO Kurssit (nimi, opettaja_id) VALUES ('Laskennan mallit',2);
sqlite> INSERT INTO Kurssit (nimi, opettaja_id) VALUES ('Ohjelmoinnin perusteet',123);
Error: FOREIGN KEY constraint failed   
```

Taulussa `Opettaja` on kaksi opettajaa, joiden id-numerot ovat 1 ja 2. Niinpä kun koetamme lisätä tauluun `Kurssit` rivin, jossa `opettaja_id` on 123, SQLite ei salli tätä vaan saamme virheilmoituksen `FOREIGN KEY constraint failed`.

### Viittaukset ja poistot

Viittausten ehtoihin liittyy tavallisia sarakkeiden ehtoja mutkikkaampia tilanteita, koska viittaukset ovat kahden taulun välisiä. Erityisesti mitä tapahtuu, jos taulusta yritetään poistaa rivi, johon viitataan toisen taulun rivillä?

Yleensä oletuksena tietokannoissa riviä ei voi poistaa, jos siihen on viittaus muualta. Esimerkiksi jos koetamme äskeisen esimerkin päätteeksi poistaa taulusta `Opettajat` rivin 2, tämä ei onnistu, koska siihen viitataan taulussa `Kurssit`:

```prompt
sqlite> DELETE FROM Opettajat WHERE id=2;
Error: FOREIGN KEY constraint failed
```

Halutessamme voimme kuitenkin määrittää taulun luonnissa tarkemmin, mitä tapahtuu tässä tilanteessa. Esimerkiksi yksi vaihtoehto on `ON DELETE CASCADE`, mikä tarkoittaa, että rivin poistuessa myös siihen viittaavat rivit poistetaan. Saamme tämän aikaan näin:

```sql
CREATE TABLE Kurssit (id INTEGER PRIMARY KEY, nimi TEXT,
                      opettaja_id INTEGER REFERENCES Opettajat ON DELETE CASCADE);
```

Nyt jos tietokannasta poistetaan opettaja, niin samalla poistetaan automaattisesti kaikki kurssit, joita hän opettaa. Tämä voi kuitenkin olla kyseenalainen vaihtoehto, koska tämän seurauksena tietokannan tauluista voi kadota yllättäen tietoa.

Mahdollisia vaihtoehtoja `ON DELETE` -osassa ovat:

* `NO ACTION`: "älä tee mitään" (oletus)
* `RESTRICT`: estä poistaminen
* `CASCADE`: poista myös viittaavat rivit
* `SET NULL`: muuta viittaukset arvoksi `NULL`
* `SET DEFAULT`: muuta viittaukset oletusarvoksi

Hämmentävä seikka on, että myös oletusvaihtoehto `NO ACTION` estää rivin poistamisen, vaikka nimestä voisi päätellä muuta. Vaihtoehdot `NO ACTION` ja `RESTRICT` toimivat käytännössä lähes samalla tavalla, mutta tietokannasta riippuen niiden toiminnassa voi olla eroja joissain erikoistilanteissa.

## Transaktiot

_Transaktio_ on joukko peräkkäisiä SQL-komentoja, jotka tietokantajärjestelmä lupaa suorittaa yhtenä kokonaisuutena. Tietokannan käyttäjä voi luottaa siihen, että joko (1) kaikki komennot suoritetaan ja muutokset jäävät pysyvästi tietokantaan tai (2) transaktio keskeytyy eivätkä komennot aiheuta mitään muutoksia tietokantaan.

Transaktioiden yhteydessä esiintyy usein ihanteena kirjainyhdistelmä _ACID_, joka tulee seuraavista sanoista:

* _Atomicity_: Transaktiossa olevat komennot suoritetaan
  yhtenä kokonaisuutena.
* _Consistency_: Transaktio säilyttää tietokannan sisällön eheänä.
* _Isolation_: Transaktiot suoritetaan eristyksessä toisistaan.
* _Durability_: Loppuun viedyn transaktion tekemät muutokset jäävät pysyviksi.


### Transaktion vaiheet

Itse asiassa transaktio on hyvin arkipäiväinen asia tietokannan käyttämisessä, sillä oletuksena _jokainen_ suoritettava SQL-komento on oma transaktionsa. Tarkastellaan esimerkiksi seuraavaa komentoa, joka kasvattaa jokaisen tuotteen hintaa yhdellä:

```sql
UPDATE Tuotteet SET hinta=hinta+1;
```

Koska komento suoritetaan transaktiona, voimme luottaa siihen, että joko jokaisen tuotteen hinta todella kasvaa yhdellä tai sitten minkään tuotteen hinta ei muutu. Jälkimmäinen voi tapahtua esimerkiksi silloin, kun sähköt katkeavat kesken päivityksen. Siinäkään tapauksessa ei siis voi käydä niin, että vain _osa_ hinnoista muuttuu.

Usein kuitenkin sana transaktio viittaa erityisesti siihen, että kokonaisuuteen kuuluu useampi SQL-komento. Tällöin annamme ensin komennon `BEGIN`, joka aloittaa transaktion, sitten kaikki transaktioon kuuluvat komennot tavalliseen tapaan ja lopuksi komennon `COMMIT`, joka päättää transaktion.

Klassinen esimerkki transaktiosta on tilanne, jossa pankissa siirretään rahaa tililtä toiselle. Esimerkiksi seuraava transaktio siirtää 100 euroa Maijan tililtä Uolevin tilille:

```sql
BEGIN;
UPDATE Tilit SET saldo=saldo-100 WHERE omistaja='Maija';
UPDATE Tilit SET saldo=saldo+100 WHERE omistaja='Uolevi';
COMMIT;
```

Transaktion ideana on, että mitään pysyvää muutosta ei tapahdu ennen komentoa `COMMIT`. Niinpä yllä olevassa esimerkissä ei ole mahdollista, että Maija menettäisi 100 euroa mutta Uolevi ei saisi mitään. Joko kummankin tilin saldo muuttuu ja rahat siirtyvät onnistuneesti tai molemmat saldot säilyvät entisellään.

Jos transaktio keskeytyy jostain syystä ennen komentoa `COMMIT`, kaikki transaktiossa tehdyt muutokset peruuntuvat. Yksi syy transaktion keskeytymiseen on jokin häiriö tietokoneen toiminnassa (kuten sähköjen katkeaminen), mutta voimme myös itse halutessamme keskeyttää transaktion antamalla komennon `ROLLBACK`.

### Transaktioiden kokeilu

Hyvä tapa saada ymmärrystä transaktioista on kokeilla käytännössä, miten ne toimivat. Tässä on esimerkkinä yksi keskustelu SQLiten kanssa:

```prompt
sqlite> CREATE TABLE Tilit (id INTEGER PRIMARY KEY, omistaja TEXT, saldo INTEGER);
sqlite> INSERT INTO Tilit (omistaja,saldo) VALUES ('Uolevi',350);
sqlite> INSERT INTO Tilit (omistaja,saldo) VALUES ('Maija',600);
sqlite> SELECT * FROM Tilit;
1|Uolevi|350
2|Maija|600
sqlite> BEGIN;
sqlite> UPDATE Tilit SET saldo=saldo-100 WHERE omistaja='Maija';
sqlite> SELECT * FROM Tilit;
1|Uolevi|350
2|Maija|500
sqlite> ROLLBACK;
sqlite> SELECT * FROM Tilit;
1|Uolevi|350
2|Maija|600
sqlite> BEGIN;
sqlite> UPDATE Tilit SET saldo=saldo-100 WHERE omistaja='Maija';
sqlite> UPDATE Tilit SET saldo=saldo+100 WHERE omistaja='Uolevi';
sqlite> COMMIT;
sqlite> SELECT * FROM Tilit;
1|Uolevi|450
2|Maija|500
```

Alkutilanteessa Uolevin tilillä on 350 euroa ja Maijan tilillä on 600 euroa. Ensimmäisessä transaktiossa poistamme ensin Maijan tililtä 100 euroa, mutta sen jälkeen tulemme toisiin ajatuksiin ja keskeytämme transaktion. Niinpä transaktiossa tehty muutos peruuntuu ja tilien saldot ovat samat kuin alkutilanteessa. Toisessa transaktiossa viemme kuitenkin transaktion loppuun, minkä seurauksena Uolevin tilillä on 450 euroa ja Maijan tilillä on 500 euroa.

Huomaa, että transaktion sisällä muutokset kyllä näkyvät, vaikka niitä ei olisi tehty vielä pysyvästi tietokantaan. Esimerkiksi ensimmäisen transaktion `SELECT`-kysely antaa Maijan tilin saldoksi 500 euroa, koska edellinen `UPDATE`-komento muutti saldoa.

### Transaktiot ohjelmoinnissa

Transaktiokomentoja (`BEGIN`, `COMMIT`, jne.) voi suorittaa ohjelmoinnissa samaan tapaan kuin muitakin SQL-komentoja. Esimerkiksi seuraava koodi lisää tauluun `Tuotteet` tuhat riviä for-silmukassa yhden transaktion sisällä:

```python
db.execute("BEGIN")
for i in range(1,1000+1):
    db.execute("INSERT INTO Tuotteet (nimi, hinta) VALUES (?,?)", ["tuote"+str(i), 1])
db.execute("COMMIT")
```

Koska koodi on transaktion sisällä, koodi joko lisää kaikki rivit tietokantaan tai ei yhtään riviä, jos transaktio epäonnistuu jostain syystä.

Tässä tapauksessa transaktion sivuvaikutuksena on myös, että koodi toimii nopeammin, koska jokaista riviä ei lisätä erillisen transaktion sisällä vaan lisäys tapahtuu kokonaisuutena. Tämä auttaa tietokantaa toteuttamaan rivien lisääminen tehokkaammin.

### Rinnakkaiset transaktiot

Lisämaustetta transaktioiden käsittelyyn tuo se, että tietokannalla voi olla useita käyttäjiä,
joilla on meneillään samanaikaisia transaktioita. Missä määrin eri käyttäjien transaktiot tulisi eristää toisistaan?

Tämä on kysymys, johon ei ole yhtä oikeaa vastausta, vaan vastaus riippuu käyttötilanteesta ja myös tietokannan ominaisuuksista. Tavallaan paras ratkaisu olisi eristää transaktiot täydellisesti toisistaan, mutta toisaalta tämä voi haitata tietokannan käyttämistä.

SQL-standardi määrittelee transaktioiden eristystasot seuraavasti:

#### Taso 1 (read uncommitted)

On sallittua, että transaktio pystyy näkemään toisen transaktion tekemän muutoksen, vaikka toista transaktiota ei ole viety loppuun.

#### Taso 2 (read committed)

Toisin kuin tasolla 1, transaktio saa nähdä toisen transaktion tekemän muutoksen vain, jos toinen transaktio on viety loppuun.

#### Taso 3 (repeatable read)

Tason 2 vaatimus ja lisäksi jos transaktion aikana luetaan saman rivin sisältö useita kertoja,
joka kerralla saadaan sama sisältö.

#### Taso 4 (serializable)

Transaktiot ovat täysin eristettyjä ja komennot käyttäytyvät samoin kuin jos transaktiot olisi suoritettu peräkkäin yksi kerrallaan jossain järjestyksessä.

### Esimerkki

Tarkastellaan tilannetta, jossa tuotteen 1 hinta on aluksi 8 ja kaksi käyttäjää suorittaa samaan aikaan komentoja transaktioiden sisällä (käyttäjän 1 komennot ovat vasemmalla ja käyttäjän 2 komennot ovat oikealla):

```prompt
BEGIN;
                                         BEGIN;
                                         UPDATE Tuotteet SET hinta=5 WHERE id=1;
SELECT hinta FROM Tuotteet WHERE id=1;
                                         UPDATE Tuotteet SET hinta=7 WHERE id=1;
                                         COMMIT;
SELECT hinta FROM Tuotteet WHERE id=1;
COMMIT;
```

Tasolla 1 käyttäjä 1 voi saada kyselyistä tulokset 5 ja 7, koska käyttäjän 2 tekemät muutokset voivat tulla näkyviin heti, vaikka käyttäjän 2 transaktioita ei ole viety loppuun.

Tasolla 2 käyttäjä 1 voi saada kyselyistä tulokset 8 ja 7, koska ensimmäisen kyselyn kohdalla toista transaktiota ei ole viety loppuun, kun taas toisen kyselyn kohdalla se on viety loppuun.

Tasoilla 3 ja 4 käyttäjä 1 saa kyselyistä tulokset 8 ja 8, koska tämä on tilanne ennen transaktion alkua eikä välissä loppuun viety transaktio saa muuttaa luettua rivin sisältöä.

### Transaktiot käytännössä

Transaktioiden toteutustavat ja saatavilla olevat eristystasot riippuvat käytetystä tietokantajärjestelmästä. Esimerkiksi SQLitessä ainoa mahdollinen taso on 4, kun taas
PostgreSQL toteuttaa tasot 2–4 ja oletuksena käytössä on taso 2.

Eristystaso 4 on tavallaan selkeästi paras, koska silloin transaktioiden muutokset eivät voi
näkyä mitenkään toisilleen. Miksi edes muut tasot ovat olemassa ja miksi esimerkiksi PostgreSQL:n oletustaso on 2?

Hyvän eristämisen hintana on, että se voi hidastaa tai estää transaktioiden suorittamista, koska transaktion vieminen loppuun voisi aiheuttaa ristiriitaisen tilanteen. Toisaalta monissa käytännön tilanteissa riittää mainiosti heikompikin eristys, kunhan tietokannan käyttäjä on siitä tietoinen.

Hyvää tietoa rinnakkaisten transaktioiden toiminnasta saa perehtymällä käytetyn tietokannan dokumentaatioon sekä testailemalla asioita itse käytännössä. Esimerkiksi voimme käynnistää itse _kaksi_ SQLite-tulkkia, avata niillä saman tietokannan ja sen jälkeen kirjoittaa transaktioita sisältäviä komentoja ja tehdä havaintoja.

Seuraava keskustelu näyttää edellisen esimerkin tuloksen kahdessa rinnakkain käynnissä olevassa SQLite-tulkissa:

```prompt
BEGIN;
                                         BEGIN;
                                         UPDATE Tuotteet SET hinta=5 WHERE id=1;
SELECT hinta FROM Tuotteet WHERE id=1;
8
                                         UPDATE Tuotteet SET hinta=7 WHERE id=1;
                                         COMMIT;
                                         Error: database is locked
SELECT hinta FROM Tuotteet WHERE id=1;
8
COMMIT;
```

Tästä näkee, että ensimmäinen transaktio tosiaan saa kummastakin kyselystä tuloksen 8. Toista transaktiota ei sen sijaan saada vietyä loppuun, vaan tulee virheviesti `Error: database is locked`, koska tietokanta on lukittuna samanaikaisen transaktion takia. Eristys toimii siis hyvin, mutta toista transaktiota pitäisi yrittää viedä loppuun uudestaan.

Vertailun vuoksi tässä on vastaava keskustelu PostgreSQL-tulkeissa (tasolla 2):

```prompt
BEGIN;
                                         BEGIN;
                                         UPDATE Tuotteet SET hinta=5 WHERE id=1;
SELECT hinta FROM Tuotteet WHERE id=1;
8
                                         UPDATE Tuotteet SET hinta=7 WHERE id=1;
                                         COMMIT;
SELECT hinta FROM Tuotteet WHERE id=1;
7
COMMIT;
```

Nyt toisen transaktion muuttama arvo 7 ilmestyy ensimmäiseen transaktioon, mutta toisaalta molemmat transaktiot saadaan vietyä loppuun ongelmitta.

### Miten transaktiot toimivat?

Transaktioiden toteuttaminen on kiehtova tekninen haaste tietokannoissa. Tavallaan transaktion tulee tehdä muutoksia tietokantaan, koska komennot voivat riippua edellisistä komennoista, mutta toisaalta mitään ei saa muuttaa pysyvästi ennen transaktion viemistä loppuun.

Yksi keskeinen ajatus tietokantojen taustalla on tallentaa muutoksia kahdella tavalla. Ensin kuvaus muutoksesta kirjataan _lokitiedostoon_ (_write-ahead log_), jota voi ajatella luettelona suoritetuista komennoista. Vasta tämän jälkeen muutokset tehdään tietokannan varsinaisiin tietorakenteisiin. Nyt jos jälkimmäisessä vaiheessa sattuu jotain yllättävää, muutokset ovat jo tallessa lokitiedostossa ja ne voidaan suorittaa myöhemmin uudestaan.

Transaktioiden yhteydessä tietokantajärjestelmän täytyy myös pitää kirjaa siitä, mitkä muutokset ovat minkäkin meneillään olevan transaktion tekemiä. Käytännössä tauluihin voidaan tallentaa rivimuutoksia, jotka näkyvät vain tietyille transaktioille. Sitten jos transaktio pääsee loppuun asti, nämä muutokset liitetään taulun pysyväksi sisällöksi.

## Kyselyjen suoritus

SQL-kieli on tietokannan käyttäjälle mukava kyselyjen tekemisessä, koska käyttäjän riittää kuvata, mitä tietoa hän haluaa hakea, ja tietokantajärjestelmä hoitaa loput. Niinpä tietokantajärjestelmän on tärkeää pystyä löytämään jokin tehokas tapa toteuttaa käyttäjän antama kysely ja toimittaa kyselyn tulokset käyttäjälle.

### Kyselyn suunnitelma

Monet tietokantajärjestelmät kertovat pyydettäessä suunnitelmansa, miten annettu kysely aiotaan suorittaa. Tämän avulla voimme tutkia tietokantajärjestelmän sisäistä toimintaa.

Tarkastellaan esimerkkinä kyselyä, joka hakee retiisin tiedot taulusta `Tuotteet`:

```sql
SELECT * FROM Tuotteet WHERE nimi='retiisi';
```

Kun laitamme SQLitessä kyselyn eteen sanan `EXPLAIN`, saamme seuraavan tapaisen selostuksen suunnitelmasta:

```prompt
sqlite> EXPLAIN SELECT * FROM Tuotteet WHERE nimi='retiisi';
addr  opcode         p1    p2    p3    p4             p5  comment      
----  -------------  ----  ----  ----  -------------  --  -------------
0     Init           0     12    0                    00  Start at 12  
1     OpenRead       0     2     0     3              00  root=2 iDb=0; Tuotteet
2     Rewind         0     10    0                    00               
3       Column         0     1     1                    00  r[1]=Tuotteet.nimi
4       Ne             2     9     1     (BINARY)       52  if r[2]!=r[1] goto 9
5       Rowid          0     3     0                    00  r[3]=rowid   
6       Copy           1     4     0                    00  r[4]=r[1]    
7       Column         0     2     5                    00  r[5]=Tuotteet.hinta
8       ResultRow      3     3     0                    00  output=r[3..5]
9     Next           0     3     0                    01               
10    Close          0     0     0                    00               
11    Halt           0     0     0                    00               
12    Transaction    0     0     1     0              01  usesStmtJournal=0
13    TableLock      0     2     0     Tuotteet       00  iDb=0 root=2 write=0
14    String8        0     2     0     retiisi        00  r[2]='retiisi'
15    Goto           0     1     0                    00 
```

SQLite muuttaa kyselyn tietokannan sisäiseksi _ohjelmaksi_, joka hakee tietoa tauluista. Tässä tapauksessa ohjelman suoritus alkaa riviltä 12, jossa alkaa transaktio, ja sitten rivillä 14 rekisteriin 2 sijoitetaan hakuehdossa oleva merkkijono "retiisi". Tämän jälkeen suoritus siirtyy riville 1, jossa aloitetaan taulun `Tuotteet` käsittely, ja rivit 2–9 muodostavat silmukan, joka etsii hakuehtoa vastaavat rivit taulusta.

Voimme myös pyytää tiiviimmän suunnitelman laittamalla kyselyn eteen sanat `EXPLAIN QUERY PLAN`. Tällöin tulos voi olla seuraava:

```prompt
sqlite> EXPLAIN QUERY PLAN SELECT * FROM Tuotteet WHERE nimi='retiisi';
0|0|0|SCAN TABLE Tuotteet
```

Tässä `SCAN TABLE Tuotteet` tarkoittaa, että kysely käy läpi taulun `Tuotteet` rivit.

### Kyselyn optimointi

Jos kyselyssä haetaan tietoa vain yhdestä taulusta, kysely on yleensä helppo suorittaa, mutta todelliset haasteet tulevat vastaan usean taulun kyselyissä. Tällöin tietokantajärjestelmän tulee osata _optimoida_ kyselyn suorittamista eli muodostaa hyvä suunnitelma, jonka avulla halutut tiedot saadaan kerättyä tehokkaasti tauluista.

Tarkastellaan esimerkkinä seuraavaa kyselyä, joka listaa kurssien ja opettajien nimet:

```sql
SELECT K.nimi, O.nimi FROM Kurssit K, Opettajat O WHERE K.opettaja_id = O.id;
```

Koska kysely kohdistuu kahteen tauluun, olemme ajatelleet kyselyn toiminnan niin, että se muodostaa ensin kaikki rivien yhdistelmät tauluista `Kurssit` ja `Opettajat` ja valitsee sitten ne rivit, joilla pätee ehto `K.opettaja_id = O.id`. Tämä on hyvä ajattelutapa, mutta tämä _ei_ vastaa sitä, miten kunnollinen tietokantajärjestelmä toimii.

Ongelmana on, että tauluissa `Kurssit` ja `Opettajat` voi molemmissa olla suuri määrä rivejä. Esimerkiksi jos kummassakin taulussa on miljoona riviä, rivien yhdistelmiä olisi miljoona miljoonaa ja veisi valtavasti aikaa muodostaa ja käydä läpi kaikki yhdistelmät.

Tässä tilanteessa tietokantajärjestelmän pitääkin ymmärtää, mitä käyttäjä oikeastaan on hakemassa ja miten kyselyssä annettu ehto rajoittaa tulosrivejä. Käytännössä riittää käydä läpi kaikki taulun `Kurssit` rivit ja etsiä jokaisen rivin kohdalla jotenkin tehokkaasti yksittäinen haluttu rivi taulusta `Opettajat`.

Voimme taas pyytää SQLiteä selittämään kyselyn suunnitelman:

```prompt
sqlite> EXPLAIN QUERY PLAN SELECT K.nimi, O.nimi FROM Kurssit K, Opettajat O WHERE K.opettaja_id = O.id;
0|0|0|SCAN TABLE Kurssit AS K
0|1|1|SEARCH TABLE Opettajat AS O USING INTEGER PRIMARY KEY (rowid=?)
```

Tämä kysely käy läpi taulun `Kurssit` rivit (`SCAN TABLE Kurssit`) ja hakee tietoa taulusta `Opettajat` pääavaimen avulla (`SEARCH TABLE Opettajat`). Jälkimmäinen tarkoittaa, että kun käsittelyssä on tietty taulun `Kurssit` rivi, kysely hakee _tehokkaasti_ taulusta `Opettajat` rivin, jossa pääavain `O.id` on sama kuin `K.opettaja_id`.

Mutta miten käytännössä taulusta `Opettajat` voi hakea tehokkaasti? Tämä onnistuu käyttämällä indeksiä, joihin tutustumme heti seuraavaksi.

## Indeksit

_Indeksi_ on tietokannan taulun yhteyteen tallennettu hakemistorakenne, jonka tavoitteena on tehostaa tauluun liittyvien kyselyiden suorittamista. Indeksin avulla tietokantajärjestelmä voi selvittää tehokkaasti, missä päin taulua on rivejä, jotka täsmäävät tiettyyn hakuehtoon.

Indeksiä voi ajatella samalla tavalla kuin kirjan lopussa olevaa hakemistoa, jossa kerrotaan hakusanoista, millä kirjan sivuilla ne esiintyvät. Hakemiston avulla löydämme tietyn sanan sijainnit paljon nopeammin kuin lukemalla koko kirjan läpi.

### Pääavaimen indeksi

Kun tietokantaan luodaan taulu, sen pääavain saa automaattisesti indeksin. Tämän seurauksena voimme suorittaa tehokkaasti hakuja, joissa ehto liittyy pääavaimeen.

Esimerkiksi kun luomme SQLitessä taulun

```sql
CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER);
```

niin taululle luodaan indeksi sarakkeelle `id` ja voimme etsiä tehokkaasti tuotteita id-numeron perusteella. Tämän ansiosta esimerkiksi seuraava kysely toimii tehokkaasti:

```sql
SELECT hinta FROM Tuotteet WHERE id=3;
```

Voimme varmistaa tämän kysymällä kyselyn suunnitelman:

```prompt
sqlite> EXPLAIN QUERY PLAN SELECT hinta FROM Tuotteet WHERE id=3;
selectid    order       from        detail                                                   
----------  ----------  ----------  ---------------------------------------------------------
0           0           0           SEARCH TABLE Tuotteet USING INTEGER PRIMARY KEY (rowid=?)
```

Suunnitelmassa näkyy `SEARCH TABLE`, mikä tarkoittaa, että kysely pystyy hakemaan taulusta tietoa tehokkaasti indeksin avulla.

### Indeksin luominen

Pääavaimen indeksi on kätevä, mutta voimme haluta myös etsiä tietoa jonkin muun sarakkeen perusteella. Esimerkiksi seuraava kysely hakee rivit sarakkeen `hinta` perusteella:

```sql
SELECT nimi FROM Tuotteet WHERE hinta=4;
```

Tämä kysely _ei_ ole oletuksena tehokas, koska sarakkeelle `hinta` ei ole indeksiä. Näemme tämän pyytämällä taas selitystä kyselystä:

```prompt
sqlite> EXPLAIN QUERY PLAN SELECT nimi FROM Tuotteet WHERE hinta=4;
selectid    order       from        detail             
----------  ----------  ----------  -------------------
0           0           0           SCAN TABLE Tuotteet
```

Nyt suunnitelmassa näkyy `SCAN TABLE`, mikä tarkoittaa, että kysely joutuu käymään läpi taulun kaikki rivit. Tämä on hidasta, jos taulussa on paljon rivejä.

Voimme kuitenkin luoda uuden indeksin, joka tehostaa saraketta `hinta` käyttäviä kyselyitä. Saamme luotua indeksin komennolla `CREATE INDEX` näin:

```sql
CREATE INDEX idx_hinta ON Tuotteet (hinta);
```

Tässä `idx_hinta` on indeksin nimi, jolla voimme viitata siihen myöhemmin. Indeksi toimii luonnin jälkeen täysin automaattisesti, eli tietokantajärjestelmä osaa käyttää sitä kyselyissä
ja huolehtii sen päivittämisestä.

Indeksin luomisen jälkeen voimme kysyä uudestaan kyselyn suunnitelmaa:

```prompt
sqlite> EXPLAIN QUERY PLAN SELECT nimi FROM Tuotteet WHERE hinta=4;
selectid    order       from        detail                                               
----------  ----------  ----------  -----------------------------------------------------
0           0           0           SEARCH TABLE Tuotteet USING INDEX idx_hinta (hinta=?)
```

Indeksin ansiosta suunnitelmassa ei lue enää `SCAN TABLE` vaan `SEARCH TABLE`. Suunnitelmassa näkyy myös, että aikomuksena on hyödyntää indeksiä `idx_hinta`.

### Lisää käyttötapoja

Voimme käyttää indeksiä myös kyselyissä, joissa haemme pienempiä tai suurempia arvoja. Esimerkiksi sarakkeelle `hinta` luodun indeksin avulla voimme etsiä vaikkapa rivejä, joille pätee ehto `hinta<3` tai `hinta>=8`.

Indeksi on myös mahdollista luoda _usean_ sarakkeen perusteella. Esimerkiksi voisimme luoda indeksin näin:

```sql
CREATE INDEX idx_hinta ON Tuotteet (hinta,nimi);
```

Tässä indeksissä rivit on järjestetty ensisijaisesti hinnan ja toissijaisesti nimen mukaan.
Indeksi tehostaa hakuja, joissa hakuperusteena on joko pelkkä hinta tai yhdessä hinta ja nimi. Kuitenkaan indeksi ei tehosta hakuja, joissa hakuperusteena on pelkkä nimi.

### Miten indeksi toimii?

Indeksi tarvitsee tuekseen hakemistorakenteen, josta voi hakea tehokkaasti rivejä sarakkeen
arvon perusteella. Tämä voidaan toteuttaa esimerkiksi puurakenteena, jonka avaimina on sarakkeiden arvoja.

Asiaan liittyvää teoriaa käsitellään tarkemmin kurssilla _Tietorakenteet ja algoritmit_ binäärihakupuiden yhteydessä. Tyypillisiä tietokantojen yhteydessä käytettäviä puurakenteita ovat B-puu ja sen muunnelmat.

### Milloin luoda indeksi?

Periaatteessa voisi ajatella, että taulun jokaiselle sarakkeelle kannattaa luoda indeksi, jolloin monenlaiset kyselyt ovat nopeita. Tämä ei ole kuitenkaan käytännössä hyvä idea.

Vaikka indeksit tehostavat kyselyitä, niissä on myös kaksi ongelmaa: indeksin hakemistorakenne vie tilaa ja indeksi myös hidastaa tiedon lisäämistä ja muuttamista. Jälkimmäinen johtuu siitä,
että kun taulun sisältö muuttuu, niin muutos täytyy myös päivittää kaikkiin tauluun liittyviin indekseihin. Indeksiä ei siis kannata luoda huvin vuoksi.

Hyvä syy indeksin luontiin on, että haluamme suorittaa usein tietynlaisia kyselyitä ja ne toimivat hitaasti, koska tietokantajärjestelmä joutuu käymään läpi turhaan jonkin taulun kaikki rivit kyselyn aikana. Tällöin voimme lisätä taululle indeksin, jonka avulla tällaiset kyselyt toimivat jatkossa tehokkaasti.

Indekseillä on käytännössä suuri vaikutus tietokantojen tehokkuuteen. Moni tietokanta toimii hitaasti sen takia, että siitä puuttuu oleellisia indeksejä.

Huomaa, että indeksit ovat myös yksi esimerkki siitä, miten toisteinen tieto voi tehostaa kyselyjä. Indekseissä kuitenkaan toisteista tietoa ei tallenneta tauluun vaan
taulun ulkopuolelle erilliseen hakemistorakenteeseen.
