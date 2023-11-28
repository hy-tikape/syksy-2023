# 4. Lisää SQL-kielestä

## Tyypit ja lausekkeet

SQL-kielessä esiintyy tyyppejä ja lausekkeita samaan tapaan kuin ohjelmoinnissa. Olemme jo nähneet monia esimerkkejä SQL-komennoista, mutta nyt on hyvä hetki tutustua syvällisemmin kielen rakenteeseen.

Jokainen tietokantajärjestelmä toteuttaa tyypit ja lausekkeet vähän omalla tavallaan ja tietokantojen toiminnassa on paljon pieniä eroja. Niinpä aiheeseen liittyvät yksityiskohdat kannattaa tarkastaa käytetyn tietokannan dokumentaatiosta.

### Tyypit

Taulun määrittelyssä jokaiselle sarakkeelle annetaan tyyppi:

```sql
CREATE TABLE Elokuvat(id INTEGER PRIMARY KEY, nimi TEXT, vuosi INTEGER);
```

Tässä sarakkeen `nimi` tyyppi on `TEXT` (merkkijono) ja sarakkeen `vuosi` tyyppi on `INTEGER` (kokonaisluku). Nämä ovat yleisimmät tyypit, jotka ovat saatavilla näillä nimillä monissa tietokannoissa. Esimerkkejä muista yleisistä tyypeistä ovat `TIMESTAMP` (ajanhetki), `REAL` (liukuluku) ja `BLOB` (raakadata).

#### TEXT vs. VARCHAR

Perinteikäs tapa tallentaa merkkijono SQL:ssä on käyttää tyyppiä `VARCHAR`, jossa annetaan suluissa merkkijonon maksimipituus. Esimerkiksi tyyppi `VARCHAR(10)` tarkoittaa, että merkkijonossa voi olla enintään 10 merkkiä.

Tämä on muistuma vanhan ajan ohjelmoinnista, jossa merkkijono saatettiin esittää kiinteän pituisena merkkitaulukkona. Tyyppi `TEXT` on kuitenkin mukavampi, koska siinä ei tarvitse keksiä maksimipituutta.

#### SQLiten tyypit

Erikoinen piirre SQLiten toteutuksessa on, että taulun määrittelyssä esiintyvä tyyppi on vain ohje, mitä tyyppiä sarakkeessa tulisi olla. Voimme kuitenkin olla välittämättä ohjeesta ja vaikkapa tallentaa kokonaisluvun kohdalle merkkijonon:

```sql
INSERT INTO Elokuvat (nimi,vuosi) VALUES ('Lumikki','abc');
```

Lisäksi tyypin nimenä voi olla _mikä tahansa_ merkkijono, vaikka SQLitessä ei olisi sellaista tyyppiä. Tämän avulla voimme esimerkiksi määritellä sarakkeen, johon on tarkoitus tallentaa ajanhetki:

```sql
CREATE TABLE Tapahtumat(id INTEGER PRIMARY KEY, paiva TIMESTAMP, viesti TEXT);
```

SQLitessä ei ole tyyppiä `TIMESTAMP`, vaan ajanhetkiä käsitellään merkkijonoina, mutta tässä kuitenkin sarakkeen tyyppi ilmaisee, mitä siihen on tarkoitus tallentaa.

### Lausekkeet

Lauseke on SQL-komennon osa, jolla on tietty arvo.
Esimerkiksi kyselyssä

```sql
SELECT hinta FROM Tuotteet WHERE nimi='retiisi';
```

on neljä lauseketta: `hinta`, `nimi`, `'retiisi'` ja `nimi='retiisi'`. Lausekkeet `hinta` ja `nimi` saavat arvonsa rivin sarakkeesta, lauseke `'retiisi'` on merkkijonovakio ja lauseke `nimi='retiisi'` on totuusarvoinen.

Voimme rakentaa monimutkaisempia lausekkeita samaan tapaan kuin ohjelmoinnissa. Esimerkiksi kysely

```sql
SELECT hinta*5 FROM Tuotteet;
```

antaa jokaisen tuotteen hinnan viisinkertaisena ja kysely

```sql
SELECT nimi FROM Tuotteet WHERE hinta%2 = 0;
```

hakee tuotteet, joiden hinta on parillinen.

Hyvä tapa testata SQL:n lausekkeiden toimintaa on keskustella tietokannan kanssa tekemällä kyselyitä, jotka eivät hae tietoa mistään taulusta vaan laskevat vain tietyn lausekkeen arvon. Keskustelu voi näyttää vaikkapa seuraavalta:

```prompt
sqlite> SELECT 2*(1+3);
8
sqlite> SELECT 'tes' || 'ti';
testi
sqlite> SELECT 3 < 5;
1
```

Ensimmäinen kysely laskee lausekkeen `2*(1+3)` arvon. Toinen kysely yhdistää `||`-operaattorilla
merkkijonot `'tes'` ja `'ti'` merkkijonoksi `'testi'`. Kolmas kysely puolestaan määrittää ehtolausekkeen `3 < 5` arvon. Tästä näkee, että SQLitessä kokonaisluku ilmaisee totuusarvon: 1 on tosi ja 0 on epätosi.

Monet SQL:n lausekkeisiin liittyvät asiat ovat tuttuja ohjelmoinnista:

* laskutoimitukset: `+`, `-`, `*`, `/`, `%`
* vertaileminen: `=`, `<>`, `<`, `<=`, `>`, `>=`
* ehtojen yhdistys: `AND`, `OR`, `NOT`

Näiden lisäksi SQL:ssä on kuitenkin myös erikoisempia ominaisuuksia, joiden tuntemisesta on välillä hyötyä. Seuraavassa on joitakin niistä:

#### BETWEEN

Lauseke `x BETWEEN a AND b` on tosi, jos `x` on vähintään `a` ja enintään `b`. Esimerkiksi kysely

```sql
SELECT * FROM Tuotteet WHERE hinta BETWEEN 4 AND 6;
```

hakee tuotteet, joiden hinta on vähintään 4 ja korkeintaan 6. Voimme toki kirjoittaa samalla tavalla toimivan kyselyn myös näin:

```sql
SELECT * FROM Tuotteet WHERE hinta >= 4 AND hinta <= 6;
```

#### CASE

Rakenne `CASE` mahdollistaa ehtolausekkeen tekemisen. Siinä voi olla yksi tai useampi `WHEN`-osa sekä mahdollinen `ELSE`-osa. Esimerkiksi kysely

```sql
SELECT nimi, CASE WHEN hinta>5 THEN 'kallis' ELSE 'halpa' END FROM Tuotteet;
```

hakee kunkin tuotteen nimen sekä tiedon siitä, onko tuote kallis vai halpa. Tässä tuote on kallis, jos sen hinta on yli 5, ja muuten halpa.

#### IN

Lauseke `x IN (...)` on tosi, jos `x` on jokin annetuista arvoista. Esimerkiksi kysely

```sql
SELECT * FROM Tuotteet WHERE nimi IN ('lanttu','nauris','selleri');
```

hakee tuotteet, joiden nimi on lanttu, nauris tai selleri.

#### LIKE

Lauseke `s LIKE p` on tosi, jos merkkijono `s` vastaa kuvausta `p`. Kuvauksessa voi käyttää erikoismerkkejä `_` (mikä tahansa yksittäinen merkki) sekä `%` (mikä tahansa määrä mitä tahansa merkkejä). Esimerkiksi kysely

```sql
SELECT * FROM Tuotteet WHERE nimi LIKE '%ri%';
```

hakee tuotteet, joiden nimen osana esiintyy merkkijono "ri" (kuten nauris ja selleri).

### Funktiot

Lausekkeiden osana voi esiintyä myös funktioita samaan tapaan kuin ohjelmoinnissa. Tässä on esimerkkinä joitakin SQLiten funktioita:

* `ABS(x)` antaa luvun `x` itseisarvon
* `LENGTH(s)` antaa merkkijonon `s` pituuden
* `LOWER(s)` muuttaa merkkijonon `s` kirjaimet pieniksi
* `MAX(x,y)` antaa suuremman luvuista `x` ja `y`
* `MIN(x,y)` antaa pienemmän luvuista `x` ja `y`
* `RANDOM()` antaa satunnaisen luvun
* `ROUND(x,d)` antaa luvun `x` pyöristettynä `d` desimaalin tarkkuudelle
* `SUBSTR(s,a,b)` antaa merkkijonon `s` kohdasta `a` alkaen `b` merkkiä
* `UPPER(s)` muuttaa merkkijonon `s` kirjaimet suuriksi

Esimerkiksi kysely

```sql
SELECT * FROM Tuotteet WHERE LENGTH(nimi)=6;
```

hakee tuotteet, joiden nimessä on kuusi kirjainta (kuten lanttu ja nauris). Kysely

```sql
SELECT SUBSTR(nimi,1,1), COUNT(*) FROM Tuotteet GROUP BY SUBSTR(nimi,1,1);
```

ryhmittelee tuotteet ensimmäisen kirjaimen mukaan ja ilmoittaa kullakin kirjaimella alkavien tuotteiden määrät. Kysely

```sql
SELECT * FROM Tuotteet ORDER BY RANDOM();
```

puolestaan antaa rivit _satunnaisessa_ järjestyksessä, koska järjestys ei perustu minkään sarakkeen sisältöön vaan satunnaiseen arvoon.

#### ORDER BY ja lausekkeet

Voisi kuvitella, että kyselyssä

```sql
SELECT * FROM Tuotteet ORDER BY 1;
```

rivit järjestetään lausekkeen `1` mukaan. Koska lausekkeen arvo on joka rivillä `1`, tämä ei tuottaisi mitään erityistä järjestystä. Näin ei kuitenkaan ole, vaan `1` järjestää rivit ensimmäisen sarakkeen mukaan, `2` toisen sarakkeen mukaan, jne. Tämä on siis vaihtoehtoinen tapa ilmaista sarake, johon järjestys perustuu.

Kuitenkin jos `ORDER BY` -osassa oleva lauseke on jotain muuta kuin yksittäinen luku (kuten `RANDOM()`), rivit järjestetään kyseisen lausekkeen mukaisesti.

## NULL-arvot

`NULL` on erityinen arvo, joka ilmaisee, että taulun sarakkeessa ei ole tietoa tai jokin kyselyn osa ei tuottanut tietoa. `NULL` on tietyissä tilanteissa kätevä, mutta voi aiheuttaa myös yllätyksiä.

`NULL` on selkeästi eri asia kuin luku 0. Jos `NULL` esiintyy laskun osana, niin koko laskun tulokseksi tulee `NULL`. SQLite-tulkki näyttää tällöin vain tyhjän rivin:

```prompt
sqlite> SELECT NULL;

sqlite> SELECT 5+NULL;

sqlite> SELECT 2*NULL+1;

```

Myöskään tavallinen vertailu ei tuota tulosta, jos verrattavana on `NULL`:

```prompt
sqlite> SELECT 5 = NULL;

sqlite> SELECT 5 <> NULL;

```

Tämä on yllättävää, koska yleensä lausekkeille `a` ja `b` pätee joko `a = b ` tai `a <> b`. Voimme kuitenkin tutkia erityisen syntaksin `IS NULL` avulla, onko lausekkeen arvo `NULL`:

```prompt
sqlite> SELECT 5 IS NULL;
0
sqlite> SELECT NULL IS NULL;
1
```

### Sarakkeen puuttuva tieto

`NULL`-arvon yksi käyttötarkoitus on ilmaista, että jossain sarakkeessa ei ole tietoa. Esimerkiksi seuraavassa taulussa `Elokuvat` Dumbon vuosi puuttuu, joten sen kohdalla on `NULL`:

```
id          nimi        vuosi     
----------  ----------  ----------
1           Lumikki     1937      
2           Fantasia    1940      
3           Pinocchio   1940      
4           Dumbo                 
5           Bambi       1942  
```

Kun haemme ensin vuoden 1940 elokuvat ja sitten kaikki elokuvat muilta vuosilta, saamme seuraavat tulokset:

```sql
SELECT * FROM Elokuvat WHERE vuosi=1940;
```

```
id          nimi        vuosi     
----------  ----------  ----------
2           Fantasia    1940      
3           Pinocchio   1940      
```

```sql
SELECT * FROM Elokuvat WHERE vuosi<>1940;
```

```
id          nimi        vuosi     
----------  ----------  ----------
1           Lumikki     1937      
5           Bambi       1942      
```

Koska Dumbolla ei ole vuotta, emme saa sitä kummassakaan kyselyssä, mikä on yllättävä ilmiö. Voimme kuitenkin hakea näin elokuvat, joilla ei ole vuotta:

```sql
SELECT * FROM Elokuvat WHERE vuosi IS NULL;
```

```
id          nimi        vuosi     
----------  ----------  ----------
4           Dumbo            
```

### NULL-arvo koostefunktiossa

Kun koostefunktion sisällä on lauseke (kuten sarake), riviä ei lasketa mukaan, jos lausekkeen arvo on `NULL`. Tarkastellaan esimerkkinä seuraavaa taulua `Tyontekijat`:

```
id          nimi        yritys      palkka    
----------  ----------  ----------  ----------
1           Anna        Google      8000      
2           Liisa       Google      7500      
3           Kaaleppi    Amazon            
4           Uolevi      Amazon      
5           Maija       Google      9500      
```

Taulussa Googlen työntekijöillä on ilmoitettu palkka, mutta Amazonin työntekijöillä ei. Koostefunktio `COUNT(palkka)` laskee mukaan vain rivit, joissa palkka on ilmoitettu:

```sql
SELECT COUNT(palkka) FROM Tyontekijat WHERE yritys='Google';
```

```
COUNT(palkka)
-------------
3

```

```sql
SELECT COUNT(palkka) FROM Tyontekijat WHERE yritys='Amazon';
```

```
COUNT(palkka)
-------------
0
```

Kun sitten laskemme palkkojen summia koostefunktiolla `SUM(palkka)`, saamme seuraavat tulokset:

```sql
SELECT SUM(palkka) FROM Tyontekijat WHERE yritys='Google';
```

```
SUM(palkka)
-----------
25000      
```

```sql
SELECT SUM(palkka) FROM Tyontekijat WHERE yritys='Amazon';
```

```
SUM(palkka)
-----------

```

Tämä on vähän yllättävää, koska voisi myös odottaa tyhjän summan olevan 0 eikä `NULL`.

### NULL-arvon muuttaminen

Funktio `IFNULL(a,b)` palauttaa arvon `a`, jos `a` ei ole `NULL`, ja muuten arvon `b`:

```prompt
sqlite> SELECT IFNULL(5,0);
IFNULL(5,0)
-----------
5          
sqlite> SELECT IFNULL(NULL,0);
IFNULL(NULL,0)
--------------
0
```

Yllä oleva tapa on tyypillinen tapa käyttää funktiota: kun toinen parametri on 0, niin funktio muuttaa mahdollisen `NULL`-arvon nollaksi. Tästä on hyötyä esimerkiksi `LEFT JOIN` -kyselyissä
`SUM`-funktion kanssa.

Yleisempi funktio on `COALESCE(...)`, jolle annetaan lista arvoista. Funktio palauttaa listan ensimmäisen arvon, joka ei ole `NULL`, tai arvon `NULL`, jos jokainen arvo on `NULL`. Jos funktiolla on kaksi parametria, se toimii samoin kuin `IFNULL`.

```prompt
sqlite> SELECT COALESCE(1,2,3);
COALESCE(1,2,3)
---------------
1              
sqlite> SELECT COALESCE(NULL,2,3);
COALESCE(NULL,2,3)
------------------
2                 
sqlite> SELECT COALESCE(NULL,NULL,3);
COALESCE(NULL,NULL,3)
---------------------
3                    
sqlite> SELECT COALESCE(NULL,NULL,NULL);
COALESCE(NULL,NULL,NULL)
------------------------

```

## Tulosrivien rajaus

Kun lisäämme kyselyn loppuun `LIMIT x`, kysely antaa vain `x` ensimmäistä tulosriviä. Esimerkiksi `LIMIT 3` tarkoittaa, että kysely antaa kolme ensimmäistä tulosriviä.

Yleisempi muoto on `LIMIT x OFFSET y`, mikä tarkoittaa, että haluamme `x` riviä kohdasta `y` alkaen (0-indeksoituna). Esimerkiksi `LIMIT 3 OFFSET 1` tarkoittaa, että kysely antaa toisen, kolmannen ja neljännen tulosrivin.

Tarkastellaan esimerkkinä kyselyä, joka hakee tuotteita halvimmasta kalleimpaan:

```sql
SELECT * FROM Tuotteet ORDER BY hinta;
```

Kyselyn tuloksena on seuraava tulostaulu:

```
id          nimi        hinta     
----------  ----------  ----------
3           nauris      2
5           selleri     4         
2           porkkana    5         
1           retiisi     7         
4           lanttu      8         
```

Saamme haettua kolme halvinta tuotetta seuraavasti:

```sql
SELECT * FROM Tuotteet ORDER BY hinta LIMIT 3;
```

Kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
3           nauris      2         
5           selleri     4         
2           porkkana    5      
```

Seuraava kysely puolestaan hakee kolme halvinta tuotetta toiseksi halvimmasta tuotteesta alkaen:

```sql
SELECT * FROM Tuotteet ORDER BY hinta LIMIT 3 OFFSET 1;
```

Tämän kyselyn tulos on seuraava:

```
id          nimi        hinta     
----------  ----------  ----------
5           selleri     4         
2           porkkana    5         
1           retiisi     7    
```

## Alikyselyt

_Alikysely_ on SQL-komennon osana oleva lauseke, jonka arvo syntyy jonkin kyselyn perusteella.
Voimme rakentaa alikyselyjä samaan tapaan kuin varsinaisia kyselyjä ja toteuttaa niiden avulla hakuja, joita olisi vaikea saada aikaan muuten.

### Esimerkki

Tarkastellaan esimerkkinä tilannetta, jossa tietokannassa on pelaajien tuloksia taulussa `Tulokset`. Oletamme, että taulun sisältö on seuraava:

```
id          nimi        tulos     
----------  ----------  ----------
1           Uolevi      120       
2           Maija       80        
3           Liisa       120       
4           Aapeli      45        
5           Kaaleppi    115    
```

Haluamme nyt selvittää ne pelaajat, jotka ovat saavuttaneet korkeimman tuloksen, eli kyselyn tulisi palauttaa Uolevi ja Liisa. Saamme tämän aikaan alikyselyllä seuraavasti:

```sql
SELECT
  nimi, tulos
FROM
  Tulokset
WHERE
  tulos = (SELECT MAX(tulos) FROM Tulokset);
```

Kyselyn tuloksena on:

```
nimi        tulos     
----------  ----------
Uolevi      120       
Liisa       120       
```

Tässä kyselyssä alikysely on `SELECT MAX(tulos) FROM Tulokset`, joka antaa suurimman taulussa olevan tuloksen eli tässä tapauksessa arvon 120. Huomaa, että alikysely tulee kirjoittaa sulkujen sisään, jotta se ei sekoitu pääkyselyyn.

### Alikyselyn laatiminen

Alikysely voi esiintyä melkein missä tahansa kohtaa kyselyssä, ja se voi tilanteesta riippuen palauttaa yksittäisen arvon, listan arvoista tai kokonaisen taulun.

#### Alikysely sarakkeessa

Seuraavassa kyselyssä alikyselyn avulla luodaan kolmas sarake, joka näyttää pelaajan tuloksen eron ennätystulokseen:

```sql
SELECT
  nimi, tulos, (SELECT MAX(tulos) FROM Tulokset)-tulos
FROM
  Tulokset;
```

```
nimi        tulos       (SELECT MAX(tulos) FROM Tulokset)-tulos
----------  ----------  ---------------------------------------
Uolevi      120         0                                      
Maija       80          40                                     
Liisa       120         0                                      
Aapeli      45          75                                     
Kaaleppi    115         5   
```

#### Alikysely tauluna

Seuraavassa kyselyssä alikysely luo taulun, jossa on kolme parasta tulosta.
Näiden tulosten summa (120+120+115) lasketaan pääkyselyssä.

```sql
SELECT
  SUM(tulos)
FROM
  (SELECT * FROM Tulokset ORDER BY tulos DESC LIMIT 3);
```

```
SUM(tulos)
----------
355
```

Tässä avainsana `LIMIT` rajaa tulostaulua niin, että siinä on vain kolme ensimmäistä riviä.

Huomaa, että yhtä kyselyä käyttämällä saisimme väärän tuloksen:

```sql
SELECT SUM(tulos) FROM Tulokset ORDER BY tulos DESC LIMIT 3;
```

```
SUM(tulos)
----------
480     
```

Tässä tulostaulussa on vain yksi rivi, jossa on kaikkien tulosten summa (480). Niinpä kyselyn lopussa oleva `LIMIT 3` ei vaikuta mitenkään tulokseen.

#### Alikysely listana

Seuraava kysely hakee pelaajat, joiden tulos kuuluu kolmen parhaimman joukkoon. Alikysely palauttaa listan tuloksista IN-lauseketta varten.

```sql
SELECT
  nimi
FROM
  Tulokset
WHERE
  tulos IN (SELECT tulos FROM Tulokset ORDER BY tulos DESC LIMIT 3);
```

```
nimi      
----------
Uolevi    
Liisa     
Kaaleppi  
```

### Riippuva alikysely

Alikysely on mahdollista toteuttaa myös niin, että sen toiminta riippuu pääkyselyssä käsiteltävästä rivistä. Näin on seuraavassa kyselyssä:

```sql
SELECT
  nimi, tulos, (SELECT COUNT(*) FROM Tulokset WHERE tulos > T.tulos)
FROM
  Tulokset T;
```

Tämän kysely laskee jokaiselle pelaajalle, monenko pelaajan tulos on parempi kuin pelaajan oma tulos. Esimerkiksi Maijalle vastaus on 3, koska Uolevin, Liisan ja Kaalepin tulos on parempi. Kysely antaa seuraavan tuloksen:

```
nimi        tulos       (SELECT COUNT(*) FROM Tulokset WHERE tulos > T.tulos)
----------  ----------  -----------------------------------------------------
Uolevi      120         0                                                    
Maija       80          3                                                    
Liisa       120         0                                                    
Aapeli      45          4                                                    
Kaaleppi    115         2                                                    
```

Koska taulu `Tulokset` esiintyy kahdessa roolissa alikyselyssä, pääkyselyn taululle on annettu nimi `T`. Tämän ansiosta alikyselyssä on selvää, että halutaan laskea rivejä, joiden tulos on parempi kuin pääkyselyssä käsiteltävän rivin tulos.

### Milloin käyttää alikyselyä?

Melko usein alikysely on vaihtoehtoinen tapa toteuttaa kysely, jonka voisi tehdä jotenkin muutenkin. Esimerkiksi molemmat seuraavat kyselyt hakevat tuotteiden nimet asiakkaan 1 ostoskorissa:

```sql
SELECT
  T.nimi
FROM
  Tuotteet T, Ostokset O
WHERE
  T.id = O.tuote_id AND O.asiakas_id = 1;
```

```sql
SELECT
  nimi
FROM
  Tuotteet
WHERE
  id IN (SELECT tuote_id FROM Ostokset WHERE asiakas_id = 1);
```

Ensimmäinen kysely on tyypillinen kahden taulun kysely, kun taas toinen kysely valikoi tuotteet alikyselyn avulla. Kumpi kysely on parempi?

Ensimmäinen kysely on parempi, koska tämä on tarkoitettu tapa hakea SQL:ssä tietoa tauluista viittausten avulla. Toinen kysely toimii sinänsä, mutta se poikkeaa totutusta eikä tietokantajärjestelmä myöskään pysty ehkä suorittamaan sitä yhtä tehokkaasti.

Alikyselyä kannattaa käyttää vain silloin, kun siihen on todellinen syy. Jos kyselyn voi tehdä helposti usean taulun kyselyllä, tämä on yleensä parempi ratkaisu.

## Lisää tekniikoita

Tässä osiossa on lisää näytteitä SQL:n mahdollisuuksista. Näistä tekniikoista on hyötyä joidenkin SQL Trainerin vaikeiden tehtävien ratkaisemisessa.

### Kumulatiivinen summa

Hyödyllinen taito SQL:ssä on osata laskea _kumulatiivinen summa_ eli jokaiselle riville summa sarakkeen luvuista kyseiselle riville asti. Tarkastellaan esimerkiksi seuraavaa taulua:

```
id          tulos
----------  ----------
1           200
2           100
3           400
4           100
```

Voimme laskea kumulatiivisen summan kahden taulun kyselyllä näin:

```sql
SELECT
  A.id, SUM(B.tulos)
FROM
  Tulokset A, Tulokset B
WHERE
  B.id <= A.id
GROUP BY
  A.id;
```

```
id          SUM(B.tulos)
----------  ------------
1           200         
2           300         
3           700         
4           800       
```

Tässä on ideana, että summa lasketaan taulun `A` riville ja taulusta `B` haetaan kaikki rivit, joiden `id` on pienempi tai sama kuin taulun `A` rivillä. Halutut summat saadaan laskettua `SUM`-funktiolla ryhmittelyn jälkeen.

Vastaavaa tekniikkaa voi käyttää muissakin tilanteissa, jos haluamme laskea tuloksen, joka riippuu jotenkin kaikista "pienemmistä" riveistä taulussa.

### Sisäkkäiset koosteet

Tarkastellaan tilannetta, jossa haluamme selvittää, mikä on suurin määrä elokuvia, jotka ovat ilmestyneet samana vuonna. Esimerkiksi seuraavassa taulussa haluttu tulos on 2, koska vuonna 1940 ilmestyi kaksi elokuvaa.

```
id          nimi        vuosi     
----------  ----------  ----------
1           Lumikki     1937      
2           Fantasia    1940      
3           Pinocchio   1940      
4           Dumbo       1941      
5           Bambi       1942      
```

Tämä on vähän hankalalta vaikuttava tilanne, koska meidän tulisi tehdä sisäkkäin kyselyt `COUNT`, joka laskee ilmestymismääriä, ja sitten `MAX`, joka hakee suurimman arvon. SQL ei salli kuitenkaan kyselyä `SELECT MAX(COUNT(vuosi))` tai vastaavaa.

Voimme ottaa kuitenkin lähtökohdaksi kyselyn,
joka ryhmittelee elokuvat vuoden mukaan ja hakee jokaisesta ryhmästä
elokuvien määrän:

```sql
SELECT COUNT(*) FROM Elokuvat GROUP BY vuosi;
```

```
COUNT(*)  
----------
1         
2         
1         
1       
```

Näistä luvuista pitää vielä saada haettua suurin, mikä onnistuu alikyselyn avulla. Tässä tapauksessa kätevä tapa on käyttää alikyselyä niin, että sen tulos on pääkyselyn `FROM`-osassa, jolloin alikysely luo taulun, josta pääkysely hakee tietoa:

```sql
SELECT MAX(c) FROM (SELECT COUNT(*) c FROM Elokuvat GROUP BY vuosi);
```

```
MAX(c)    
----------
2       
```

Entä voisiko tehtävän ratkaista ilman alikyselyä? Kyllä, koska voimme järjestää tulokset suurimmasta pienimpään ja valita tulostaulun ensimmäisen rivin:

```sql
SELECT COUNT(*) c FROM Elokuvat GROUP BY vuosi ORDER BY c DESC LIMIT 1;
```

```
c         
----------
2          
```

### Sijaluvut

Tarkastellaan taulua, jossa on pelaajia ja heidän tuloksiaan:

```
id          nimi        tulos     
----------  ----------  ----------
1           Aapeli      45        
2           Kaaleppi    115       
3           Liisa       120       
4           Maija       80        
5           Uolevi      120   
```

Tavoitteena on hakea rivit järjestyksessä tuloksen mukaan suurimmasta pienempään ja ilmoittaa lisäksi kunkin rivin _sijaluku_. Yksi tapa toteuttaa tämä on tehdä alikysely, joka laskee, monellako rivillä tulos on parempi, jolloin sija on yhtä suurempi kuin alikyselyn tulos:

```sql
SELECT
  (SELECT COUNT(*) FROM Tulokset WHERE tulos > T.tulos)+1 sija, nimi, tulos
FROM
  Tulokset T
ORDER BY
  tulos DESC, nimi;
```

```
sija        nimi        tulos     
----------  ----------  ----------
1           Liisa       120       
1           Uolevi      120       
3           Kaaleppi    115       
4           Maija       80        
5           Aapeli      45   
```

Samalla idealla voidaan laskea sijaluvut myös niin, että jokaisella on eri sija ja yhtä suuren tuloksen tapauksessa aakkosjärjestys ratkaisee sijan:

```sql
SELECT
  (SELECT COUNT(*) FROM Tulokset WHERE tulos > T.tulos OR (tulos = T.tulos AND nimi < T.nimi))+1 sija, nimi, tulos
FROM
  Tulokset T
ORDER BY
  tulos DESC, nimi;
```

```
sija        nimi        tulos     
----------  ----------  ----------
1           Liisa       120       
2           Uolevi      120       
3           Kaaleppi    115       
4           Maija       80        
5           Aapeli      45   
```

Vaihtoehtoinen tapa laskea sijalukuja on ikkunafunktio, jos käytetty tietokanta sallii sen. Esimerkiksi SQLiten uusissa versioissa ikkunafunktioiden `RANK` ja `ROW_NUMBER` avulla voidaan laskea vastaavat sijaluvut kuin äskeisissä esimerkeissä.

### Listojen vertailu

Tarkastellaan taulua, johon on tallennettu listojen sisältö. Esimerkiksi seuraavassa taulussa lista 1 sisältää luvut [2, 4, 5], lista 2 sisältää luvut [3, 5] ja lista 3 sisältää luvut [2, 4, 5]:

```
id          lista_id    luku     
----------  ----------  ----------
1           1           2         
2           1           4         
3           1           5         
4           2           3         
5           2           5         
6           3           2         
7           3           4         
8           3           5     
```

Seuraava kysely laskee jokaiselle listaparille, montako _yhteistä_ tulosta niillä on:

```sql
SELECT
  A.lista_id, B.lista_id, COUNT(*)
FROM
  Listat A, Listat B
WHERE
  A.luku=B.luku
GROUP BY
  A.lista_id, B.lista_id;
```

```
lista_id    lista_id    COUNT(*)  
----------  ----------  ----------
1           1           3         
1           2           1         
1           3           3         
2           1           1         
2           2           2         
2           3           1         
3           1           3         
3           2           1         
3           3           3     
```

Tästä selviää, että esimerkiksi listoilla 1 ja 2 on yksi yhteinen luku (5) ja listoilla 1 ja 3 on kolme yhteistä lukua (2, 4, 5). Tällaista kyselyä laajentamalla voidaan vaikkapa vertailla, onko kahdella listalla täysin sama sisältö. Näin on silloin, kun listoilla on yhtä monta lukua ja yhteisten lukujen määrä on yhtä suuri kuin yksittäisen listan lukujen määrä.
