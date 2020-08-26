---
nav-title: 5. Tietokannan suunnittelu
sub-sections:
      - sub-section-title: Taulujen valinta
      - sub-section-title: Sarakkeiden sisältö
      - sub-section-title: Viittausten toteutus
      - sub-section-title: Toisteinen tieto
      - sub-section-title: Lisää suunnittelusta
---
      
# 5. Tietokannan suunnittelu

## Taulujen valinta

Tietokannan suunnittelussa meidän tulee päättää tietokannan rakenne: mitä tauluja tietokannassa on sekä mitä sarakkeita kussakin taulussa on. Tähän on sinänsä suuri määrä mahdollisuuksia, mutta tuntemalla muutaman periaatteen ja maalaisjärjellä pärjää pitkälle.

Hyvä tavoite suunnittelussa on, että tuloksena olevaa tietokantaa on mukavaa käyttää SQL-kielen avulla. Tietokannan rakenteen tulisi olla sellainen, että pystymme hakemaan ja muuttamaan tietoa näppärästi SQL-komennoilla.

### Taulu vs. luokka

Tietokannan taulu ja olio-ohjelmoinnin luokka ovat samantapaisia käsitteitä. Molemmissa on kyse siitä, että määrittelemme tiedon _tyypin_. Esimerkiksi seuraava SQL-komento ja Java-koodi vastaavat toisiaan:

```sql
CREATE TABLE Elokuvat (id INTEGER PRIMARY KEY, nimi TEXT, vuosi INTEGER);
```

```java
public class Elokuva {
	private String nimi;
	private int vuosi;

	public Elokuva(String nimi, int vuosi) {
	    this.nimi = nimi;
	    this.vuosi = vuosi;
	}
}
```

Vastaavasti rivin lisääminen tietokannan tauluun ja olion luominen luokasta toimivat samalla periaatteella. Esimerkiksi voimme lisätä kolme riviä ja luoda kolme oliota seuraavasti:

```sql
INSERT INTO Elokuvat (nimi,vuosi) VALUES ('Lumikki',1937);
INSERT INTO Elokuvat (nimi,vuosi) VALUES ('Fantasia',1940);
INSERT INTO Elokuvat (nimi,vuosi) VALUES ('Pinocchio',1940);
```

```java
Elokuva a = new Elokuva("Lumikki",1937);
Elokuva b = new Elokuva("Fantasia",1940);
Elokuva c = new Elokuva("Pinocchio",1940);
```

Huomaa, että ohjelmoinnissa luokissa ei ole tarvetta id-kentälle, koska voimme viitata muutenkin luokasta luotuihin olioihin. Esimerkiksi yllä olevassa koodissa muuttujat `a`, `b` ja `c` sisältävät viittaukset olioihin.

### Yksi vai useita tauluja?

Periaatteena tietokannan suunnittelussa on, että kaikki saman tyyppiset rivit ovat _yhdessä_ taulussa. Tämän ansiosta voimme käsitellä rivejä kätevästi SQL-komennoilla.

Esimerkiksi jos tietokannassa on elokuvia, hyvä ratkaisu on tallentaa kaikki elokuvat samaan tauluun:

```
id          nimi        vuosi     
----------  ----------  ----------
1           Lumikki     1937      
2           Fantasia    1940      
3           Pinocchio   1940      
4           Dumbo       1941      
5           Bambi       1942    
```

Tästä taulusta voimme hakea esimerkiksi vuoden 1940 elokuvat näin:

```sql
SELECT nimi FROM Elokuvat WHERE vuosi=1940;
```

Mutta mitä kävisi, jos jakaisimmekin elokuvat moneen tauluun? Esimerkiksi voisimme jakaa elokuvat tauluihin vuosien mukaan. Tällöin taulussa `Elokuvat1940` olisi vuoden 1940 elokuvat, ja voisimme hakea ne näin:

```sql
SELECT nimi FROM Elokuvat1940;
```

Tällainen ratkaisu toimii niin kauan, kuin haluamme hakea vain tietyn vuoden elokuvia. Kuitenkin tietokanta muuttuu vaikeakäyttöiseksi heti, jos haluamme tehdä jotain muita hakuja. Esimerkiksi jos haluamme hakea kaikki elokuvat vuosilta 1940–1950, tarvitsemme useita kyselyjä:

```sql
SELECT nimi FROM Elokuvat1940;
SELECT nimi FROM Elokuvat1941;
SELECT nimi FROM Elokuvat1942;
...
SELECT nimi FROM Elokuvat1950;
```

Kuitenkin kun elokuvat ovat samassa taulussa, niin selviämme yhdellä kyselyllä:

```sql
SELECT nimi FROM Elokuvat WHERE vuosi BETWEEN 1940 AND 1950;
```

Kun elokuvat ovat yhdessä taulussa, pystymme käsittelemään niitä monipuolisesti yksittäisillä SQL-komennoilla, mikä ei olisi mahdollista, jos tauluja olisi useita.

## Sarakkeiden sisältö

*Periaate*:
Tietokannan taulun jokaisessa sarakkeessa on _yksittäinen_ (_atominen_) tieto, kuten yksi luku tai yksi merkkijono. Sarakkeessa ei saa olla esimerkiksi listaa tiedoista.

Tämä periaate helpottaa tietokannan käsittelyä SQL-komentojen avulla: kun jokainen tieto on omassa sarakkeessaan, niin pystymme viittaamaan tietoon kätevästi komennoissa. Mutta mitä tehdä, jos haluaisimme tallentaa listan?

### Esimerkki: Vaihe 1

Haluamme tallentaa tietokantaan opiskelijoiden tenttituloksia. Tentissä on neljä tehtävää, joista voi saada 0–6 pistettä. Voisimme koettaa tallentaa pisteet näin:

```
id          opiskelija_id  pisteet   
----------  -------------  ----------
1           1              6,5,1,4   
2           2              3,6,6,6   
3           3              6,4,0,6  
```

Ideana on, että sarakkeessa `pisteet` on merkkijono, jossa on lista pisteistä pilkuilla erotettuina. Tämä ratkaisu kuitenkin rikkoo periaatetta, että jokaisessa sarakkeessa on yksittäinen tieto. Mitä vikaa ratkaisussa on?

Ratkaisun ongelmana on, että meidän on vaivalloista koettaa päästä pisteisiin käsiksi SQL-komennoissa, koska pisteet ovat merkkijonon sisällä. Esimerkiksi jos haluamme laskea jokaisen opiskelijan yhteispisteet, tarvitsemme seuraavan tapaisen kyselyn:

```sql
SELECT opiskelija_id, SUBSTR(pisteet,1,1)+
                      SUBSTR(pisteet,3,1)+
                      SUBSTR(pisteet,5,1)+
                      SUBSTR(pisteet,7,1) FROM Tulokset;
```

Tässä funktio `SUBSTR` erottaa merkkijonosta tietyssä kohdassa olevan osajonon. Kysely on kuitenkin hankala ja lisäksi toimii vain, kun pisteitä on tasan neljä ja ne ovat yksinumeroisia. Tarvitsemme paremman tavan tallentaa pisteet.

### Esimerkki: Vaihe 2

Seuraavassa taulussa pisteille on neljä saraketta, jolloin voimme käsitellä niitä yksitellen:

```
id          opiskelija_id  pisteet1    pisteet2    pisteet3    pisteet4  
----------  -------------  ----------  ----------  ----------  ----------
1           1              6           5           1           4         
2           2              3           6           6           6         
3           3              6           4           0           6     
```

Tämän ansiosta saamme jo toteutettua kyselyn mukavammin:

```sql
SELECT opiskelija_id, pisteet1+pisteet2+pisteet3+pisteet4 FROM Tulokset;
```

Tämä ratkaisu on selkeästi parempaan suuntaan, mutta siinä on edelleen ongelmia. Vaikka pisteet ovat eri sarakkeissa, oletuksena on edelleen, että tehtäviä on tasan neljä. Jos tehtävien määrä muuttuu, joudumme muuttamaan taulun rakennetta ja kaikkia pisteisiin liittyviä SQL-komentoja, mikä ei ole hyvä tilanne.

### Esimerkki: Vaihe 3

Kun haluamme tallentaa listan tietokantaan, hyvä ratkaisu on tallentaa jokainen listan alkio omalle rivilleen. Tämän esimerkin tapauksessa voimme luoda taulun, jonka jokainen rivi ilmaisee tietyn opiskelijan pisteet tietyssä tehtävässä:

```
id          opiskelija_id  tehtava_id  pisteet   
----------  -------------  ----------  ----------
1           1              1           6         
2           1              2           5         
3           1              3           1         
4           1              4           4         
5           2              1           3         
6           2              2           6         
7           2              3           6         
8           2              4           6         
9           3              1           6         
10          3              2           4         
11          3              3           0         
12          3              4           6
```

Nyt voimme hakea kunkin opiskelijan yhteispisteet näin:

```sql
SELECT opiskelija_id, SUM(pisteet) FROM Tulokset GROUP BY opiskelija_id;
```

Tämä on _yleiskäyttöinen_ kysely eli se toimii yhtä hyvin riippumatta tehtävien määrästä. Pystymme hyödyntämään summan laskemisessa funktiota `SUM` sen sijaan, että meidän tulisi luetella kaikki tehtävät itse.

Huomaa, että muutoksen seurauksena taulun rivien määrä kasvoi selvästi. Tätä ei kannata kuitenkaan hätkähtää: tietokantajärjestelmät on toteutettu niin, että ne toimivat hyvin, vaikka olisi paljon rivejä.

## Viittausten toteutus

Ohjelmoinnissa olion sisällä voi olla viittaus toiseen olioon, ja vastaavasti tietokannan taulun rivillä voi olla viittaus toiseen riviin. Tavallinen tapa toteuttaa viittaukset tietokannassa on
antaa jokaiselle riville id-numero (pääavain), jolla voimme viitata siihen muualta.

### Yksi moneen -suhde

Tarkastellaan tilannetta, jossa tallennamme tietokantaan kursseja ja opettajia. Taulujen välillä on yksi moneen -suhde: jokaisella kurssilla on yksi opettaja, kun taas yhdellä opettajalla voi olla monta kurssia. Javassa voimme luoda tarvittavat luokat seuraavasti:

```java
public class Opettaja {
    private String nimi;
    
    public class Opettaja(String nimi) {
        this.nimi = nimi;
    }
}

public class Kurssi {
    private String nimi;
    private Opettaja opettaja;
    
    public class Kurssi(String nimi, Opettaja opettaja) {
        this.nimi = nimi;
        this.opettaja = opettaja;
    }
}
```

Vastaavasti voimme luoda tietokannan taulut näin:

```sql
CREATE TABLE Opettajat (id INTEGER PRIMARY KEY, nimi TEXT);
CREATE TABLE Kurssit (id INTEGER PRIMARY KEY, nimi TEXT, opettaja INTEGER REFERENCES Opettajat);
```

Taulussa `Kurssit` sarake `opettaja` viittaa tauluun `Opettajat`, eli siinä on jonkin opettajan id-numero. Ilmaisemme viittauksen `REFERENCES`-määreellä, joka kertoo, että sarakkeessa oleva kokonaisluku viittaa nimenomaan tauluun `Opettajat`.

Voisimme laittaa tauluihin tietoa vaikkapa seuraavasti:

```sql
INSERT INTO Opettajat (nimi) VALUES ('Kaila');
INSERT INTO Opettajat (nimi) VALUES ('Kivinen');
INSERT INTO Opettajat (nimi) VALUES ('Laaksonen');
INSERT INTO Kurssit (nimi, opettaja) VALUES ('Ohjelmoinnin perusteet',1);
INSERT INTO Kurssit (nimi, opettaja) VALUES ('Ohjelmoinnin jatkokurssi',1);
INSERT INTO Kurssit (nimi, opettaja) VALUES ('Tietokantojen perusteet',3);
INSERT INTO Kurssit (nimi, opettaja) VALUES ('Tietorakenteet ja algoritmit',2);
```

### Monta moneen -suhde

Tarkastellaan sitten tilannetta, jossa useampi opettaja voi järjestää kurssin yhteisesti. Tällöin kyseessä on monta moneen -suhde, koska kurssilla voi olla monta opettajaa ja opettajalla voi olla monta kurssia.

Javassa voisimme toteuttaa tämän muutoksen helposti muuttamalla luokkaa `Kurssi` niin, että siinä on yhden opettajan sijasta lista opettajista:

```java
public class Kurssi {
    private String nimi;
    private ArrayList<Opettaja> opettaja;
    
    public class Kurssi(String nimi) {
        this.nimi = nimi;
        this.opettaja = new ArrayList<>();
    }
}
```

Tietokannoissa tilanne on kuitenkin toinen, koska emme voi tallentaa järkevästi taulun sarakkeeseen listaa viittauksista. Tämän sijasta meidän täytyy luoda uusi taulu viittauksille:

```sql
CREATE TABLE Opettajat (id INTEGER PRIMARY KEY, nimi TEXT);
CREATE TABLE Kurssit (id INTEGER PRIMARY KEY, nimi TEXT);
CREATE TABLE KurssinOpettajat (kurssi_id INTEGER REFERENCES Kurssit,
                               opettaja_id INTEGER REFERENCES Opettaja);
```

Muutoksena on, että taulussa `Kurssit` ei ole enää viittausta tauluun `Opettajat`, mutta sen sijaan tietokannassa on uusi taulu `KurssinOpettajat`, joka viittaa kumpaankin tauluun. Jokainen rivi tässä rivissä kuvaa yhden suhteen muotoa "kurssilla x opettaa opettaja y".

Esimerkiksi voisimme ilmaista näin, että kurssilla on kaksi opettajaa:

```sql
INSERT INTO Opettajat (nimi) VALUES ('Kivinen');
INSERT INTO Opettajat (nimi) VALUES ('Laaksonen');
INSERT INTO Kurssit (nimi) VALUES ('Tietorakenteet ja algoritmit');
INSERT INTO KurssinOpettajat VALUES (1,1);
INSERT INTO KurssinOpettajat VALUES (1,2);
```

Huomaa, että voisimme käyttää tätä ratkaisua myös aiemmassa tilanteessa, jossa kurssilla on aina tasan yksi opettaja, joskin tietokannassa olisi silloin tavallaan turha taulu.

## Toisteinen tieto

*Periaate*:
Jokainen tieto on tasan yhdessä paikassa tietokannassa. Tietokannassa ei ole tietoa, jonka voi laskea tai päätellä tietokannan muun sisällön perusteella.

Tätä periaatetta seuraamalla tietokannan sisällön päivittäminen on helppoa, koska päivitys riittää tehdä yhteen paikkaan eikä se vaikuta tietokannan muihin osiin.

### Esimerkki 1

Tallennamme järjestelmään käyttäjien lähettämiä viestejä seuraavasti tauluun `Viestit`:

```
id          kayttaja    viesti     
----------  ----------  --------------
1           Anna123     Missä olet?
2           Joulupukki  Bussissa vielä
3           Anna123     Meneekö kauan?
4           Joulupukki  5 min   
```

Tämä on muuten toimiva ratkaisu, mutta tietokannan sisältöä on hankalaa päivittää, jos käyttäjä päättää vaihtaa nimeään. Esimerkiksi jos Anna123 haluaa muuttaa nimeään, muutos täytyy tehdä jokaiseen viestiin, jonka hän on lähettänyt.

Parempi ratkaisu on toteuttaa tietokanta niin, että käyttäjän nimi on vain yhdessä paikassa. Luonteva paikka tälle on taulu `Kayttajat`, joka sisältää käyttäjät:

```
id          nimi
----------  ----------
1           Anna123
2           Joulupukki
```

Muissa tauluissa on vain viitteenä käyttäjän id-numero, joka on muuttumaton tieto. Esimerkiksi taulu `Viestit` näyttää nyt tältä:

```
id          kayttaja_id  viesti     
----------  -----------  --------------
1           1            Missä olet?
2           2            Bussissa vielä
3           1            Meneekö kauan?
4           2            5 min   
```

Tämän jälkeen käyttäjän nimen muuttaminen on helppoa, koska muutos riittää tehdä taulun `Kayttajat` yhteen riviin ja muutos päivittyy heti kaikkialle, koska muissa tauluissa viitataan edelleen oikeaan riviin.

Tämä monimutkaistaa kyselyjä, koska meidän täytyy hakea tietoa useista tauluista, mutta ratkaisu on kuitenkin kokonaisuuden kannalta hyvä.

### Esimerkki 2

Tallennamme tietokantaan tietoa opiskelijoiden suorituksista. Tietokannasta voidaan kysyä, montako opintopistettä opiskelija on suorittanut.

Seuraavassa tietokannassa jokaisen opiskelijan yhteyteen on tallennettu tieto, montako opintopistettä hän on suorittanut. Taulun `Opiskelijat` sisältönä on:

```
id          nimi        op        
----------  ----------  ----------
1           Maija       20        
2           Uolevi      10   
```

Taulussa `Suoritukset` puolestaan on seuraavat rivit:

```
id          opiskelija_id  kurssi_id   op        
----------  -------------  ----------  ----------
1           1              1           5         
2           1              2           5         
3           1              4           10        
4           2              1           5         
5           2              3           5         
```

Tämän ansiosta on helppoa hakea opiskelijan opintopisteiden yhteismäärä:

```sql
SELECT op FROM Opiskelijat WHERE nimi='Maija';
```

Kuitenkin tietokannassa on toisteista tietoa: taulun `Opiskelijat` sarakkeen `op` sisältö voidaan laskea taulun `Suoritukset` avulla. Ongelmana on, että jos lisäämme tai poistamme suorituksen, niin joudumme tekemään muutoksen kahteen eri tauluun. Jos muutos unohtuu tehdä tai epäonnistuu, tietokantaan tulee ristiriitaista tietoa.

Pääsemme eroon toisteisesta tiedosta poistamalla sarakkeen `op` taulusta `Opiskelijat`:

```
id          nimi       
----------  ---------- 
1           Maija     
2           Uolevi    
```

Tämän muutoksen seurauksena on vaikeampaa selvittää opiskelijan opintopisteet, koska meidän täytyy laskea tieto suorituksista lähtien:

```sql
SELECT SUM(S.op) FROM Suoritukset S, Opiskelijat O WHERE S.opiskelija_id=O.id AND O.nimi='Maija';
```

Tämä on kuitenkin kokonaisuutena hyvä muutos, koska nyt voimme huoletta muutella suorituksia ja luottaa siihen, että saamme aina haettua oikean tiedon opiskelijan opintopisteistä.

### Muutokset vs. kyselyt

Vaikka ihanteena on, että tietokannassa ei ole toisteista tietoa, joskus kuitenkin toisteista tietoa tarvitaan hakujen tehostamiseksi. Toisteinen tieto vaikeuttaa tietokannan muuttamista mutta helpottaa kyselyjen tekemistä.

Usein esiintyvä ilmiö tietojenkäsittelytieteessä on, että joudumme tasapainoilemaan sen kanssa,
haluammeko muuttaa vai hakea tehokkaasti tietoa ja paljonko tilaa voimme käyttää. Tämä tulee tietokantojen lisäksi vastaan esimerkiksi algoritmien suunnittelussa.

Jos tietokannassa ei ole toisteista tietoa, muutokset ovat helppoja, koska jokainen tieto on vain yhdessä paikassa eli riittää muuttaa vain yhden taulun yhtä riviä. Myös hyvänä puolena tietokanta vie vähän tilaa. Toisaalta kyselyt voivat olla monimutkaisia ja hitaita, koska halutut tiedot pitää kerätä kasaan eri puolilta tietokantaa.

Kun sitten lisäämme toisteista tietoa, pystymme nopeuttamaan kyselyjä mutta toisaalta muutokset hidastuvat, koska muutettu tieto pitää päivittää useaan paikkaan. Samaan aikaan myös tietokannan tilankäyttö kasvaa toisteisen tiedon takia.

Ei ole mitään yleistä sääntöä, paljonko toisteista tietoa kannattaa lisätä, vaan tämä riippuu tietokannan sisällöstä ja halutuista kyselyistä. Yksi hyvä tapa on aloittaa tilanteesta, jossa toisteista tietoa ei ole, ja lisätä sitten toisteista tietoa tarvittaessa, jos osoittautuu, että kyselyt eivät muuten ole riittävän tehokkaita.

## Lisää suunnittelusta

Tässä luvussa esitellyt periaatteet ovat hyödyllisiä ja johtavat usein toimiviin ratkaisuihin,
mutta vielä tärkeämpää on käyttää omaa järkeä. Tavoitteen tulisi olla aina se, että tietokanta on käyttötarkoitukseen sopiva, eikä että noudatetaan periaatteita ilman omaa ajattelua.

### Esimerkki 1

Sarakkeessa tulisi olla vain yksittäinen tieto, joten onko seuraava taulu huonosti suunniteltu, koska samassa sarakkeessa on etu- ja sukunimi?

```
id          nimi         
----------  --------------
1           Anna Virtanen
2           Maija Korhonen
3           Pasi Lahtinen
```

Voisimme myös tallentaa etu- ja sukunimen erikseen näin:

```
id          etunimi     sukunimi  
----------  ----------  ----------
1           Anna        Virtanen
2           Maija       Korhonen
3           Pasi        Lahtinen
```

Riippuu tilanteesta, kumpi taulu on parempi. Jos järjestelmässä on erityisesti tarvetta etsiä
tietoa etu- tai sukunimen perusteella (esimerkiksi etsiä kaikki käyttäjät, joiden etunimi on Anna), jälkimmäinen taulu voi olla parempi. Kuitenkaan usein ei ole näin eikä ole mitään pahaa tallentaa samaan sarakkeeseen etu- ja sukunimi.

### Esimerkki 2

Seuraavassa taulussa näyttää olevan toisteista tietoa: kaksi kertaa sama viesti "Hei!". Pitäisikö tietokannan rakennetta parantaa?

```
id          kayttaja_id  viesti
----------  -----------  --------------
1           1            Hei!
2           2            Hei!
3           1            Missä olet?
4           2            Bussissa
```

Tässä tapauksessa _ei_ olisi hyvä idea toteuttaa tietokantaa niin, että jos kaksi käyttäjää lähettää saman sisältöisen viestin, viestin sisältö tallennetaan vain yhteen paikkaan.

Vaikka viesteissä on sama sisältö, ne ovat erillisiä viestejä. Jos käyttäjä 1 muuttaa viestin sisältöä, muutoksen ei ole tarkoitus heijastua käyttäjän 2 viestiin, vaikka siinä sattuu olemaan sama sisältö.

### Esimerkki 3

Yliopiston kurssijärjestelmällä on kahdenlaisia käyttäjiä: opettajia ja opiskelijoita. Kannattaako tehdä yksi yhteinen taulu kaikille käyttäjille vai eri taulut opettajille ja opiskelijoille?

Tämä vastaa olio-ohjelmoinnissa tilannetta, jossa voisimme käyttää rajapintoja tai periytymistä,
mutta SQL:ssä ei ole tarjolla tällaisia tekniikoita.

Kokemus on osoittanut, että hyvä ratkaisu on tallentaa kaikki käyttäjät samaan tauluun. Tauluun tarvitaan jokin sarake, joka ilmaisee käyttäjän roolin. Esimerkiksi voimme sopia, että rooli 1 tarkoittaa opettajaa ja rooli 2 tarkoittaa opiskelijaa. Esimerkiksi seuraava kysely hakee tiedot opettajista:

```sql
SELECT * FROM Kayttajat WHERE rooli=1;
```

Syynä tähän ratkaisuun on, että järjestelmässä on kuitenkin paikkoja, jotka ovat käyttäjille yhteisiä, ja olisi vaivalloista alkaa tehdä eri SQL-komentoja opettajia ja opiskelijoita varten näissä paikoissa.

Kun järjestelmä kehittyy, siihen saattaa tulla lisää rooleja, ja on myös mahdollista, että käyttäjällä on monta roolia (esimerkiksi käyttäjä voi olla samaan aikaan opiskelija ja opettaja). Tällöin voi olla hyvä idea luoda uusi taulu, joka kertoo, mitä eri rooleja kullakin käyttäjällä on.

### Esimerkki 4

Seuraavassa taulussa ei ole vielä mitään ongelmaa:

```
id          nimi           op          kuvaus    
----------  -------------  ----------  ----------
1           Ohjelmointi 1  5           ...       
2           Ohjelmointi 2  5           ...       
3           Tietokannat    10          ...       
```

Mutta kun järjestelmä kasvaa, niin tauluun voi alkaa ilmestyä lisää ja lisää sarakkeita sekalaista tietoa (kuten kurssin oppiaine, kirjallisuus, suoritustavat, jne.). Taulu voi alkaa tuntua sekavalta, jos siinä on suuri määrä sarakkeita.

Yksi vaihtoehto olisi rakentaa taulu niin, että siinä onkin vain kiinteä määrä sarakkeita:

```
sqlite> SELECT * FROM Kurssit;
id          avain       arvo
----------  ----------  -------------
1           nimi        Ohjelmointi 1
1           op          5
1           kuvaus      ...
2           nimi        Ohjelmointi 2
2           op          5
2           kuvaus      ...
3           nimi        Tietokannat
3           op          10
3           kuvaus      ...
```

Tämän ratkaisun etuna on, että voimme vapaasti lisätä uusia avaimia muuttamatta taulun rakennetta. Lisäksi jos jokin avain on käytössä vain harvoin, siihen ei tarvitse ottaa kantaa jokaisen kurssin kohdalla.

Ratkaisussa on kuitenkin omat ongelmansa: kaikilla arvoilla on sama tyyppi (käytännössä niiden täytyy olla merkkijonoja) ja tietyn kurssin tietojen etsiminen on vaikeampaa kuin aiemmin. Kuitenkin jos sarakkeiden määrä uhkaa paisua hankalan suureksi, tämä ratkaisu voi olla pelastava enkeli.
