# 3. Monen taulun kyselyt

## Taulujen viittaukset

Keskeinen idea tietokannoissa on, että taulun rivi voi viitata toisen taulun riviin. Tällöin voimme muodostaa kyselyn, joka kerää tietoa useista tauluista viittausten perusteella. Käytännössä viittauksena on yleensä toisessa taulussa olevan rivin id-numero.

### Esimerkki

Tarkastellaan esimerkkinä tilannetta, jossa tietokannassa on tietoa kursseista ja niiden opettajista. Oletamme, että jokaisella kurssilla on yksi opettaja ja sama opettaja voi opettaa monta kurssia.

Tallennamme tauluun `Opettajat` tietoa opettajista. Jokaisella opettajalla on id-numero, jolla voimme viitata siihen.

```
id          nimi      
----------  ----------
1           Kaila     
2           Luukkainen
3           Kivinen   
4           Laaksonen 
```

Taulussa `Kurssit` on puolestaan tietoa kursseista ja jokaisen kurssin kohdalla viittaus kurssin opettajaan.

```
id          nimi              opettaja_id
----------  ----------------  -----------
1           Laskennan mallit  3          
2           Ohjelmoinnin per  1          
3           Ohjelmoinnin jat  1          
4           Tietokantojen pe  4          
5           Tietorakenteet j  3        
```

Voimme nyt hakea kurssit opettajineen seuraavalla kyselyllä, joka hakee tietoa samaan aikaan tauluista `Kurssit` ja `Opettajat`:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit, Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id;
```

Koska kyselyssä on monta taulua, ilmoitamme sarakkeiden taulut. Esimerkiksi `Kurssit.nimi` viittaa taulun `Kurssit` sarakkeeseen `nimi`.

Kysely antaa seuraavan tuloksen:

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per  Kaila     
Ohjelmoinnin jat  Kaila     
Tietokantojen pe  Laaksonen 
Tietorakenteet j  Kivinen 
```

### Mitä tässä tapahtui?

Yllä olevassa kyselyssä uutena asiana on, että kysely koskee useaa taulua (`FROM Kurssit, Opettajat`), mutta mitä tämä tarkoittaa oikeastaan?

Ideana on, että kun kyselyssä on monta taulua, kyselyn tulosrivien lähtökohtana ovat _kaikki_ tavat valita rivien yhdistelmiä tauluista. Tämän jälkeen `WHERE`-osan ehdoilla voi määrittää, mitkä yhdistelmät ovat kiinnostuksen kohteena.

Hyvä tapa saada ymmärrystä monen taulun kyselyn toiminnasta on tarkastella ensin kyselyä, joka hakee kaikki sarakkeet ja jossa ei ole `WHERE`-osaa. Yllä olevassa esimerkkitilanteessa tällainen kysely on seuraava:

```sql
SELECT
  *
FROM
  Kurssit, Opettajat;
```

Koska taulussa `Kurssit` on 5 riviä ja taulussa `Opettajat` on 4 riviä, kyselyn tulostaulussa on 5 * 4 = 20 riviä. Tulostaulu sisältää kaikki mahdolliset tavat valita ensin jokin rivi taulusta `Kurssit` ja sitten jokin rivi taulusta `Opettajat`:

```
id          nimi              opettaja_id  id          nimi      
----------  ----------------  -----------  ----------  ----------
1           Laskennan mallit  3            1           Kaila     
1           Laskennan mallit  3            2           Luukkainen
1           Laskennan mallit  3            3           Kivinen   
1           Laskennan mallit  3            4           Laaksonen 
2           Ohjelmoinnin per  1            1           Kaila     
2           Ohjelmoinnin per  1            2           Luukkainen
2           Ohjelmoinnin per  1            3           Kivinen   
2           Ohjelmoinnin per  1            4           Laaksonen 
3           Ohjelmoinnin jat  1            1           Kaila     
3           Ohjelmoinnin jat  1            2           Luukkainen
3           Ohjelmoinnin jat  1            3           Kivinen   
3           Ohjelmoinnin jat  1            4           Laaksonen 
4           Tietokantojen pe  4            1           Kaila     
4           Tietokantojen pe  4            2           Luukkainen
4           Tietokantojen pe  4            3           Kivinen   
4           Tietokantojen pe  4            4           Laaksonen 
5           Tietorakenteet j  3            1           Kaila     
5           Tietorakenteet j  3            2           Luukkainen
5           Tietorakenteet j  3            3           Kivinen   
5           Tietorakenteet j  3            4           Laaksonen 
```

Suurin osa tulosriveistä ei ole kuitenkaan kiinnostavia, koska ne eivät liity toisiinsa mitenkään. Esimerkiksi ensimmäinen tulosrivi kertoo vain, että on olemassa kurssi Laskennan mallit ja toisaalta on olemassa opettaja Kaila. Tämän vuoksi rajaamme hakua niin, että opettajan id-numeron tulee olla sama kummankin taulun riveissä:

```sql
SELECT
  *
FROM
  Kurssit, Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id;
```

Tämän seurauksena kysely alkaa antaa mielekkäitä tuloksia:

```
id          nimi              opettaja_id  id          nimi      
----------  ----------------  -----------  ----------  ----------
1           Laskennan mallit  3            3           Kivinen   
2           Ohjelmoinnin per  1            1           Kaila     
3           Ohjelmoinnin jat  1            1           Kaila     
4           Tietokantojen pe  4            4           Laaksonen 
5           Tietorakenteet j  3            3           Kivinen   
```

Tämän jälkeen voimme vielä parantaa kyselyä valitsemalla meitä kiinnostavat sarakkeet:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit, Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id;
```

Näin päädymme samaan tulokseen kuin aiemmin:

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per  Kaila     
Ohjelmoinnin jat  Kaila     
Tietokantojen pe  Laaksonen 
Tietorakenteet j  Kivinen 
```

### Lisää ehtoja kyselyssä

Monen taulun kyselyissä `WHERE`-osa kytkee toisiinsa meitä kiinnostavat taulujen rivit, mutta lisäksi voimme laittaa `WHERE`-osaan muita ehtoja samaan tapaan kuin ennenkin. Esimerkiksi voimme suorittaa seuraavan kyselyn:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit, Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id AND Opettajat.nimi = 'Kivinen';
```

Näin saamme haettua kurssit, joiden opettajana on Kivinen:

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Tietorakenteet j  Kivinen 
```

### Taulujen lyhyet nimet

Voimme tiivistää monen taulun kyselyä antamalla tauluille vaihtoehtoiset lyhyet nimet, joiden avulla voimme viitata niihin kyselyssä. Esimerkiksi kysely

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit, Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id;
```

voidaan esittää lyhemmin näin:

```sql
SELECT
  K.nimi, O.nimi
FROM
  Kurssit AS K, Opettajat AS O
WHERE
  K.opettaja_id = O.id;
```

Sana `AS` ei ole pakollinen, eli voimme lyhentää kyselyä lisää:

```sql
SELECT
  K.nimi, O.nimi
FROM
  Kurssit K, Opettajat O
WHERE
  K.opettaja_id = O.id;
```

### Saman taulun toistaminen

Monen taulun kyselyssä voi esiintyä myös monta kertaa sama taulu, kunhan niille annetaan eri nimet. Esimerkiksi seuraava kysely hakee kaikki tavat valita kahden opettajan _pari_:

```sql
SELECT A.nimi, B.nimi FROM Opettajat A, Opettajat B;
```

Kyselyn tulos on seuraava:

```
nimi        nimi      
----------  ----------
Kaila       Kaila     
Kaila       Luukkainen
Kaila       Kivinen   
Kaila       Laaksonen 
Luukkainen  Kaila     
Luukkainen  Luukkainen
Luukkainen  Kivinen   
Luukkainen  Laaksonen 
Kivinen     Kaila     
Kivinen     Luukkainen
Kivinen     Kivinen   
Kivinen     Laaksonen 
Laaksonen   Kaila     
Laaksonen   Luukkainen
Laaksonen   Kivinen   
Laaksonen   Laaksonen 
```

## Liitostaulut

Taulujen välillä esiintyy yleensä kahdenlaisia suhteita:

1. _Yksi moneen -suhde_:
   Taulun A rivi liittyy enintään yhteen taulun B riviin.
   Taulun B rivi voi liittyä useaan taulun A riviin.

2. _Monta moneen -suhde_:
   Taulun A rivi voi liittyä useaan taulun B riviin.
   Taulun B rivi voi liittyä useaan taulun A riviin.

Tapauksessa 1 voimme lisätä tauluun A sarakkeen, joka viittaa tauluun B, kuten teimme edellisen osion esimerkissä. Tapauksessa 2 tilanne on kuitenkin hankalampi, koska yksittäinen viittaus kummankaan taulun rivissä ei riittäisi. Ratkaisuna on luoda kolmas _liitostaulu_, joka sisältää tiedot viittauksista.

### Esimerkki

Tarkastellaan esimerkkinä tilannetta, jossa verkkokaupassa on tuotteita ja asiakkaita ja jokainen asiakas on valinnut tiettyjä tuotteita ostoskoriin. Tietyn asiakkaan korissa voi olla useita tuotteita, ja toisaalta tietty tuote voi olla usean asiakkaan korissa.

Rakennamme tietokannan niin, että siinä on kolme taulua: `Tuotteet`, `Asiakkaat` ja `Ostokset`. Liitostaulu `Ostokset` ilmaisee, mitä tuotteita on kunkin asiakkaan ostoskorissa. Sen jokainen rivi esittää yhden parin muotoa "asiakkaan _x_ korissa on tuote _y_".

Oletamme, että taulujen sisällöt ovat seuraavat:

{% include example.md %}

Nyt voimme hakea asiakkaat ja tuotteet seuraavasti:

```sql
SELECT
  A.nimi, T.nimi
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id;
```

Kyselyn ideana on hakea tauluista `Asiakkaat` ja `Tuotteet` taulun `Ostokset` rivejä vastaavat tiedot. Jotta saamme mielekkäitä tuloksia, kytkemme rivit yhteen kahden ehdon avulla. Kysely tuottaa seuraavan tulostaulun:

```
nimi        nimi      
----------  ----------
Uolevi      porkkana  
Uolevi      selleri   
Maija       retiisi   
Maija       lanttu    
Maija       selleri   
```

### Miten kysely toimii?

Voimme taas tutkia kyselyn toimintaa hakemalla kaikki sarakkeet ja poistamalla ehdot:

```sql
SELECT
  *
FROM
  Asiakkaat A, Tuotteet T, Ostokset O;
```

Tämän kyselyn tulostaulussa on kaikki tavat valita jokin asiakas, tuote ja ostokset. Tulostaulussa on 5 * 3 * 5 = 75 riviä ja se alkaa näin:


```
id          nimi        id          nimi        hinta       asiakas_id  tuote_id  
----------  ----------  ----------  ----------  ----------  ----------  ----------
1           Uolevi      1           retiisi     7           1           2         
1           Uolevi      1           retiisi     7           1           5         
1           Uolevi      1           retiisi     7           2           1         
1           Uolevi      1           retiisi     7           2           4         
1           Uolevi      1           retiisi     7           2           5         
1           Uolevi      2           porkkana    5           1           2         
1           Uolevi      2           porkkana    5           1           5         
1           Uolevi      2           porkkana    5           2           1         
1           Uolevi      2           porkkana    5           2           4         
1           Uolevi      2           porkkana    5           2           5         
1           Uolevi      3           nauris      4           1           2         
1           Uolevi      3           nauris      4           1           5         
1           Uolevi      3           nauris      4           2           1         
1           Uolevi      3           nauris      4           2           4         
1           Uolevi      3           nauris      4           2           5         
...
```

Sitten kun lisäämme kyselyyn ehdot, saamme rajattua kiinnostavat rivit:

```sql
SELECT
  *
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id;
```

```
id          nimi        id          nimi        hinta       asiakas_id  tuote_id  
----------  ----------  ----------  ----------  ----------  ----------  ----------
1           Uolevi      2           porkkana    5           1           2         
1           Uolevi      5           selleri     4           1           5         
2           Maija       1           retiisi     7           2           1         
2           Maija       4           lanttu      8           2           4         
2           Maija       5           selleri     4           2           5     
```

Kun vielä määritämme halutut sarakkeet, tuloksena on lopullinen kysely:

```sql
SELECT
  A.nimi, T.nimi
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id;
```

```
nimi        nimi      
----------  ----------
Uolevi      porkkana  
Uolevi      selleri   
Maija       retiisi   
Maija       lanttu    
Maija       selleri   
```

### Lisää ehtoja kyselyyn

Voimme lisätä kyselyyn lisää ehtoja, jos haluamme saada selville muuta ostoskoreista. Esimerkiksi seuraava kysely hakee Maijan korissa olevat tuotteet:

```sql
SELECT
  T.nimi
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id AND A.nimi = 'Maija';
```

```
nimi      
----------
retiisi   
lanttu    
selleri   
```

Seuraava kysely puolestaan kertoo, keiden korissa on selleri:

```sql
SELECT
  A.nimi
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id AND T.nimi = 'selleri';
```

```
nimi      
----------
Uolevi    
Maija    
```

### Yhteenveto tauluista

Voimme käyttää koostefunktioita ja ryhmittelyä myös usean taulun kyselyissä. Ne käsittelevät tulostaulua samalla periaatteella kuin yhden taulun kyselyissä.

#### Esimerkki

Tarkastellaan edelleen tietokantaa, jossa on tuotteita, asiakkaita ja ostoksia:

{% include example.md %}

Seuraava kysely luo yhteenvedon, joka näyttää jokaisesta asiakkaasta, montako tuotetta hänen ostoskorissaan on ja mikä on tuotteiden yhteishinta.

```sql
SELECT
  A.nimi, COUNT(T.id), SUM(T.hinta)
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id
GROUP BY
  A.id;
```

Kyselyn tulos on seuraava:

```
nimi        COUNT(T.id)  SUM(T.hinta)
----------  -----------  ------------
Uolevi      2            9           
Maija       3            19          
```

Uolevin korissa on siis 2 tavaraa, joiden yhteishinta on 9, ja Maijan korissa on 3 tavaraa, joiden yhteishinta on 19.

#### Miten kysely toimii?

Kyselyn perusta on tässä:

```sql
SELECT
  *
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id;
```

```
id          nimi        id          nimi        hinta       asiakas_id  tuote_id  
----------  ----------  ----------  ----------  ----------  ----------  ----------
1           Uolevi      2           porkkana    5           1           2         
1           Uolevi      5           selleri     4           1           5         
2           Maija       1           retiisi     7           2           1         
2           Maija       4           lanttu      8           2           4         
2           Maija       5           selleri     4           2           5     
```

Kun kyselyyn lisätään ryhmittely `GROUP BY A.id`, rivit jakautuvat kahteen ryhmään sarakkeen `A.id` mukaan:


```
id          nimi        id          nimi        hinta       asiakas_id  tuote_id  
----------  ----------  ----------  ----------  ----------  ----------  ----------
1           Uolevi      2           porkkana    5           1           2         
1           Uolevi      5           selleri     4           1           5         
```

```
id          nimi        id          nimi        hinta       asiakas_id  tuote_id  
----------  ----------  ----------  ----------  ----------  ----------  ----------
2           Maija       1           retiisi     7           2           1         
2           Maija       4           lanttu      8           2           4         
2           Maija       5           selleri     4           2           5     
```

Näille ryhmille lasketaan sitten tuotteiden määrä `COUNT(T.id)` sekä ostosten yhteishinta `SUM(T.hinta)`.

Huomaa, että kyselyssä ryhmittely tapahtuu sarakkeen `A.id` mukaan, mutta kyselyssä haetaan sarake `A.nimi`. Tämä on sinänsä järkevää, koska sarake `A.id` määrää sarakkeen `A.nimi`, ja kysely toimii mainiosti SQLitessä. Muissa tietokannoissa vaatimuksena voi kuitenkin olla, että sellaisenaan haettavan sarakkeen tulee aina esiintyä myös ryhmittelyssä. Tällöin ryhmittelyn tulisi olla `GROUP BY A.id, A.nimi`.

#### Puuttuvan rivin ongelma

Kysely toimii sinänsä hyvin, mutta jotain puuttuu:

```
nimi        COUNT(T.id)  SUM(T.hinta)
----------  -----------  ------------
Uolevi      2            9           
Maija       3            19          
```

Kyselyn puutteena on vielä, että tuloksissa ei ole lainkaan kolmatta tietokannassa olevaa asiakasta eli Aapelia. Koska Aapelin korissa ei ole mitään, Aapelin rivi ei yhdisty minkään muun rivin kanssa eikä pääse osaksi tulostaulua.

Olemme törmänneet ongelmaan, mutta onneksi löydämme siihen ratkaisun pian.

## JOIN-syntaksi

Tähän mennessä olemme hakeneet tietoa tauluista listaamalla taulut kyselyn `FROM`-osassa, mikä toimii yleensä hyvin. Kuitenkin joskus on tarpeen vaihtoehtoinen `JOIN`-syntaksi. Siitä on hyötyä silloin, kun kyselyn tuloksesta näyttää "puuttuvan" tietoa.

### Kyselytavat

Seuraavassa on kaksi tapaa toteuttaa sama kysely, ensin käyttäen ennestään tuttua tapaa ja sitten käyttäen `JOIN`-syntaksia.

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit, Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id;
```

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit JOIN Opettajat ON Kurssit.opettaja_id = Opettajat.id;
```

`JOIN`-syntaksissa taulujen nimien välissä esiintyy sana `JOIN` ja lisäksi taulujen rivit toisiinsa kytkevä ehto annetaan erillisessä `ON`-osassa.

Tässä tapauksessa `JOIN`-syntaksi on vain vaihtoehtoinen tapa toteuttaa kysely eikä se tuo mitään uutta. Kuitenkin näemme seuraavaksi, miten voimme laajentaa syntaksia niin, että se antaa meille uusia mahdollisuuksia kyselyissä.

### Esimerkki

Tarkastellaan esimerkkinä tilannetta, jossa tietokannassa on tutut taulut `Kurssit` ja `Opettajat`, mutta taulussa `Kurssit` yhdeltä kurssilta puuttuu opettaja:

```
id          nimi              opettaja_id
----------  ----------------  -----------
1           Laskennan mallit  3          
2           Ohjelmoinnin per  1          
3           Ohjelmoinnin jat  1          
4           Tietokantojen pe             
5           Tietorakenteet j  3          
```

Rivin 4 sarakkeessa `opettaja_id` on arvo `NULL`, joten jos suoritamme jommankumman äskeisen kyselyn, ongelmaksi tulee, että rivi 4 ei täsmää mihinkään taulun `Opettajat` riviin. Tämän seurauksena tulostauluun ei tule riviä kurssista Tietokantojen perusteet:

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per  Kaila     
Ohjelmoinnin jat  Kaila     
Tietorakenteet j  Kivinen 
```

Ratkaisu ongelmaan on käyttää `LEFT JOIN` -syntaksia, joka tarkoittaa, että mikäli jokin vasemman taulun rivi ei yhdisty mihinkään oikean taulun riviin, kyseinen vasemman taulun rivi pääsee silti mukaan yhdeksi riviksi tulostauluun. Kyseisellä rivillä jokaisen oikeaan tauluun perustuvan sarakkeen arvona on `NULL`.

Tässä tapauksessa voimme toteuttaa kyselyn näin:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit LEFT JOIN Opettajat ON Kurssit.opettaja_id = Opettajat.id;
```

Nyt tulostauluun ilmestyy myös kurssi Tietokantojen perusteet ilman opettajaa:

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per  Kaila     
Ohjelmoinnin jat  Kaila     
Tietokantojen pe            
Tietorakenteet j  Kivinen
```

### Miten kysely toimii?

Jälleen hyvä tapa saada selkoa kyselystä on yksinkertaistaa sitä:

```sql
SELECT
  *
FROM
  Kurssit LEFT JOIN Opettajat ON Kurssit.opettaja_id = Opettajat.id;
```

```
id          nimi              opettaja_id  id          nimi      
----------  ----------------  -----------  ----------  ----------
1           Laskennan mallit  3            3           Kivinen   
2           Ohjelmoinnin per  1            1           Kaila     
3           Ohjelmoinnin jat  1            1           Kaila     
4           Tietokantojen pe                                     
5           Tietorakenteet j  3            3           Kivinen  
```

Tästä näkee, että koska vasemman taulun rivi 4 ei täsmää mihinkään oikean taulun riviin, niin kyseisestä rivistä tulee tulostauluun yksi rivi, jossa jokainen sarake oikean taulun osuudessa on `NULL`.

### JOIN-kyselyperhe

Itse asiassa `JOIN`-kyselystä on olemassa peräti neljä eri muunnelmaa:

* `JOIN`: toimii kuten tavallinen kahden taulun kysely
* `LEFT JOIN`: jos vasemman taulun rivi ei yhdisty mihinkään oikean taulun riviin,
  se valitaan kuitenkin mukaan erikseen
* `RIGHT JOIN`: jos oikean taulun rivi ei yhdisty mihinkään vasemman taulun riviin,
  se valitaan kuitenkin mukaan erikseen
* `FULL JOIN`: sekä vasemmasta että oikeasta taulusta valitaan erikseen mukaan
  rivit, jotka eivät yhdisty toisen taulun riviin

SQLiten rajoituksena on kuitenkin, että vain kaksi ensimmäistä kyselytapaa ovat mahdollisia. Onneksi `LEFT JOIN` on yleensä se, mitä haluamme.

### ON vs. WHERE

Sana `ON` on oleellinen `LEFT JOIN` -kyselyssä, koska se asettaa ehdon niin, että mukaan otetaan myös vasemman taulun ylimääräiset rivit:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit LEFT JOIN Opettajat ON Kurssit.opettaja_id = Opettajat.id;
```

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per  Kaila     
Ohjelmoinnin jat  Kaila     
Tietokantojen pe            
Tietorakenteet j  Kivinen
```

Jos käytämme sen sijasta sanaa `WHERE`, ylimääräiset rivit jäävät pois:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit LEFT JOIN Opettajat
WHERE
  Kurssit.opettaja_id = Opettajat.id;
```

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per  Kaila     
Ohjelmoinnin jat  Kaila     
Tietorakenteet j  Kivinen
```

Sinänsä kyselyssä voi esiintyä sekä `ON` että `WHERE`:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit LEFT JOIN Opettajat ON Kurssit.opettaja_id = Opettajat.id
WHERE
  Kurssit.nimi <> 'Ohjelmoinnin perusteet';
```

Tällöin `ON`-osa hoitaa taulujen yhdistämisen ja `WHERE`-osa rajaa tuloksia lisää:

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin jat  Kaila     
Tietokantojen pe            
Tietorakenteet j  Kivinen   
```

Jos molemmat ehdot ovatkin `ON`-osassa, kyselyn tulos muuttuu taas:

```sql
SELECT
  Kurssit.nimi, Opettajat.nimi
FROM
  Kurssit LEFT JOIN Opettajat ON Kurssit.opettaja_id = Opettajat.id AND 
                                 Kurssit.nimi <> 'Ohjelmoinnin perusteet';
```

```
nimi              nimi      
----------------  ----------
Laskennan mallit  Kivinen   
Ohjelmoinnin per            
Ohjelmoinnin jat  Kaila     
Tietokantojen pe            
Tietorakenteet j  Kivinen   
```

### Yhteenveto toimivaksi

Nyt voimme pureutua aiempaan ongelmaan, jossa yhteenvetokyselystä puuttui tietoa. Tietokannassamme on edelleen seuraavat taulut:

{% include example.md %}

Muodostimme yhteenvedon ostoskoreista seuraavalla kyselyllä:

```sql
SELECT
  A.nimi, COUNT(T.id), SUM(T.hinta)
FROM
  Asiakkaat A, Tuotteet T, Ostokset O
WHERE
  A.id = O.asiakas_id AND T.id = O.tuote_id
GROUP BY
  A.id;
```

Kuitenkin ongelmaksi tuli, että Aapeli puuttuu yhteenvedosta:

```
nimi        COUNT(T.id)  SUM(T.hinta)
----------  -----------  ------------
Uolevi      2            9
Maija       3            19
```

#### Ratkaisu

Ongelman syynä on, että Aapelin ostoskori on _tyhjä_ eli kun kysely valitsee yhdistelmiä taulujen riveistä, ei ole mitään sellaista riviä, jolla esiintyisi Aapeli. Ratkaisu ongelmaan on käyttää `LEFT JOIN` -syntaksia näin:

```sql
SELECT
  A.nimi, COUNT(T.id), SUM(T.hinta)
FROM
  Asiakkaat A LEFT JOIN Ostokset O ON A.id = O.asiakas_id
              LEFT JOIN Tuotteet T ON T.id = O.tuote_id
GROUP BY
  A.id;
```

Nyt myös Aapeli ilmestyy mukaan yhteenvetoon:

```
nimi        COUNT(T.id)  SUM(T.hinta)
----------  -----------  ------------
Uolevi      2            9           
Maija       3            19          
Aapeli      0                     
```

Koska Aapelin ostoskorissa ei ole tuotteita, hintojen summaksi tulee `NULL`. Voimme vielä parantaa kyselyä `IFNULL`-funktion avulla:

```sql
SELECT
  A.nimi, COUNT(T.id), IFNULL(SUM(T.hinta),0)
FROM
  Asiakkaat A LEFT JOIN Ostokset O ON A.id = O.asiakas_id
              LEFT JOIN Tuotteet T ON T.id = O.tuote_id
GROUP BY
  A.id;
```

Tämän seurauksena mahdollinen `NULL` muuttuu arvoksi 0:

```
nimi        COUNT(T.id)  IFNULL(SUM(T.hinta),0)
----------  -----------  ----------------------
Uolevi      2            9           
Maija       3            19          
Aapeli      0            0
```

Palaamme `NULL`-arvojen käsittelyyn tarkemmin myöhemmin.

#### Miten kysely toimii?

Kun kyselyssä on useita `LEFT JOIN` -osia, tulkintana on, että ne yhdistävät tauluja vasemmalta oikealle. Yllä olevassa kyselyssä voimme ajatella, että ensimmäinen vaihe yhdistää taulut `Asiakkaat` ja `Ostokset`:

```sql
SELECT
  *
FROM
  Asiakkaat A LEFT JOIN Ostokset O ON A.id = O.asiakas_id;
```

```
id          nimi        asiakas_id  tuote_id  
----------  ----------  ----------  ----------
1           Uolevi      1           2         
1           Uolevi      1           5         
2           Maija       2           1         
2           Maija       2           4         
2           Maija       2           5         
3           Aapeli    
```

Toinen vaihe puolestaan yhdistää yllä olevan tulostaulun ja taulun `Tuotteet`:

```sql
SELECT
  *
FROM
  Asiakkaat A LEFT JOIN Ostokset O ON A.id = O.asiakas_id
              LEFT JOIN Tuotteet T ON T.id = O.tuote_id;
```

```
id          nimi        asiakas_id  tuote_id    id          nimi        hinta     
----------  ----------  ----------  ----------  ----------  ----------  ----------
1           Uolevi      1           2           2           porkkana    5         
1           Uolevi      1           5           5           selleri     4         
2           Maija       2           1           1           retiisi     7         
2           Maija       2           4           4           lanttu      8         
2           Maija       2           5           5           selleri     4         
3           Aapeli      
```

Molemmissa vaiheissa Aapeli pääsee osaksi tulostaulua,
koska kyseinen rivi ei täsmää minkään oikean taulun rivin kanssa.
