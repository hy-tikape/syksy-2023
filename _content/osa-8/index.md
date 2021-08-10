---
nav-title: 8. Tietokantojen teoria
sub-sections:
      - sub-section-title: Joukot ja relaatiot
      - sub-section-title: Relaatio-operaatiot
      - sub-section-title: Normaalimuodot
---

# 8. Tietokantojen teoria

Tietokannan sisällön esittäminen relaatiomallin mukaisesti tauluina ja riveinä tuntuu nykyään lähes itsestään selvältä tavalta, mutta tämä oli aikoinaan mullistava idea tietokanta-alalla. Tässä luvussa tutustumme relaatiomallin matemaattiseen taustaan, joka syntyi 1970-luvulla.

## Joukot ja relaatiot

### Määritelmiä

#### Joukko

Joukko on kokoelma alkioita. Esimerkiksi $$A=\{1,2,3,4,5\}$$ ja $$B=\{apina, banaani, cembalo\}$$ ovat joukkoja.

Merkintä $$\mid S \mid$$ tarkoittaa joukon $S$ alkioiden määrää. Äskeisessä esimerkissä $$\mid A \mid=5$$ ja $$\mid B \mid =3$$.

Joukon alkioilla ei ole tiettyä järjestystä. Esimerkiksi $$\{1,2,3\}$$ ja $$\{2,3,1\}$$ tarkoittavat samaa joukkoa.

Tietty alkio voi esiintyä joukossa enintään kerran. Esimerkiksi $$\{1,1,1\}$$ ei ole joukko, koska alkio $$1$$ esiintyy kolmesti.

#### Osajoukko

Osajoukko sisältää osan joukon alkioista. Esimerkiksi joukon $$\{1,2,3\}$$ osajoukot ovat $$\emptyset$$, $$\{1\}$$, $$\{2\}$$, $$\{3\}$$, $$\{1,2\}$$, $$\{1,3\}$$, $$\{2,3\}$$ ja $$\{1,2,3\}$$. Merkintä $$\emptyset$$ tarkoittaa tyhjää joukkoa.

Kun joukossa on $$n$$ alkiota, siitä voidaan muodostaa $$2^n$$ osajoukkoa. Esimerkiksi joukossa $$\{1,2,3\}$$ on $$3$$ alkiota, joten osajoukkoja on $$2^3=8$$.

#### Karteesinen tulo

Karteesinen tulo $$S_1 \times S_2 \times \dots \times S_k$$ sisältää kaikki yhdistelmät, jotka voidaan muodostaa valitsemalla järjestyksessä yksi alkio jokaisesta joukosta $$S_1,S_2,\dots,S_k$$.

Esimerkiksi kun $$A=\{1,2,3\}$$ ja $$B=\{x,y,z\}$$, niin

$$A \times B = \{(1,x),(1,y),(1,z),(2,x),(2,y),(2,z),(3,x),(3,y),(3,z)\}.$$

Vastaavasti kun $$A=\{1,2,3\}$$, $$B=\{x\}$$ ja $$C=\{1,2\}$$, niin

$$A \times B \times C = \{(1,x,1), (1,x,2), (2,x,1), (2,x,2), (3,x,1), (3,x,2)\}.$$

Karteesisen tulon alkioiden määrä on $$\mid S_1 \mid \cdot \mid S_2 \mid \dots \mid S_k \mid$$. Äskeisessä esimerkissä $$\mid A \mid = 3$$, $$\mid B \mid = 1$$ ja $$\mid C \mid = 2$$, joten karteesinen tulo $$A \times B \times C$$ muodostuu $$3 \cdot 1 \cdot 2 = 6$$ alkiosta.

#### Relaatio

Relaatio on karteesisen tulon osajoukko. Esimerkiksi kun $$A=\{1,2,3\}$$ ja $$B=\{x,y,z\}$$, niin yksi karteesisen tulon $$A \times B$$ relaatio on $$(1,x),(2,x),(3,y),(2,z)$$.

Relaatio tarkoittaa siis sitä, että valitaan jokin osa kaikista mahdollisista alkioiden yhdistelmistä.

Karteesisella tulolla $$S_1 \times S_2 \times \dots \times S_k$$ on kaikkiaan $$2^{\mid S_1 \mid \cdot \mid S_2 \mid \dots \mid S_k \mid}$$ mahdollista relaatiota.

### Taulu relaationa

Tietokannan taulu voidaan esittää relaationa, jossa joukot $$S_1,S_2,\dots,S_k$$ ilmaisevat, mitä alkioita missäkin sarakkeessa voi olla, ja jokainen rivi kuuluu karteesiseen tuloon $$S_1 \times S_2 \times \dots \times S_k$$.

Tarkastellaan esimerkkinä taulua `Tuotteet`, jossa on tietoa tuotteista:

<table class="db-table">
<thead>
  <tr><th colspan="3" id="table-title">Tuotteet</th></tr>
  <tr><th width="30">id</th><th width="100">nimi</th><th width="70">hinta</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>retiisi</td><td>7</td></tr>
  <tr><td>2</td><td>porkkana</td><td>5</td></tr>
  <tr><td>3</td><td>nauris</td><td>4</td></tr>
  <tr><td>4</td><td>lanttu</td><td>8</td></tr>
  <tr><td>5</td><td>selleri</td><td>4</td></tr>
</tbody>
</table>

Tämä taulu vastaa seuraavaa relaatiota:

$$T=\{(1,retiisi,7),(2,porkkana,5),(3,nauris,4),(4,lanttu,8),(5,selleri,4)\}$$

Tämän relaation taustalla on karteesinen tulo $$S_1 \times S_2 \times S_3$$. Nämä joukot määrittävät, mitä sisältöä riveissä voi olla eli kunkin sarakkeen tyypin.

Koska sarakkeissa $$1$$ ja $$3$$ on kokonaisluku, joukot $$S_1$$ ja $$S_3$$ sisältävät kaikki kokonaisluvut. Sarakkeessa $$2$$ on puolestaan merkkijono, joten joukko $$S_2$$ sisältää kaikki merkkijonot. Huomaa, että nämä ovat äärettömiä joukkoja, koska erilaisia kokonaislukuja ja merkkijonoja on äärettömästi.

Tietokannan taulussa jokaisella sarakkeella on myös nimi. Tässä taulussa sarakkeen $$1$$ nimi on `id`, sarakkeen $$2$$ nimi on `nimi` ja sarakkeen $$3$$ nimi on `hinta`.

## Relaatio-operaatiot

Relaatio-operaatioiden avulla olemassa olevista relaatioista voidaan muodostaa uusi relaatio. Tämä vastaa SQL:ssä kyselyä, jossa tauluista muodostetaan tulostaulu. Tutustumme seuraavaksi kolmeen keskeiseen relaatio-operaatioon: projektio, restriktio ja liitos.

### Projektio

Projektio $$\Pi$$ muodostaa relaation, jossa on tiettyjen sarakkeiden arvot joka riviltä. Projektio vastaa SQL-kyselyä, jossa valitaan tietyt sarakkeet taulusta. Esimerkiksi projektio $$\Pi_{nimi,hinta}(T)$$ vastaa SQL-kyselyä `SELECT nimi, hinta FROM Tuotteet`.

Esimerkkejä:

$$\Pi_{nimi}(T) = \{(retiisi),(porkkana),(nauris),(lanttu),(selleri)\}$$

$$\Pi_{hinta}(T) = \{(7),(5),(4),(8)\}$$

$$\Pi_{nimi,hinta}(T) = \{(retiisi,7),(porkkana,5),(nauris,4),(lanttu,8),(selleri,4)\}$$

Huomaa, että projektion tulos on relaatio, joten mahdolliset toistuvat rivit suodattuvat siitä pois. Tämän takia projektiossa $$\Pi_{hinta}(T)$$ on vain neljä riviä, koska kahdella tuotteella on sama hinta.

### Restriktio

Restriktio $$\sigma$$ muodostaa relaation, jossa on tietyt ehdot täyttävät rivit. Restriktio vastaa SQL-kyselyä, jossa rivit valitaan `WHERE`-osassa. Esimerkiksi restriktio $$\sigma_{hinta \le 5}(T)$$ vastaa SQL-kyselyä `SELECT * FROM Tuotteet WHERE hinta <= 5`.

Esimerkkejä:

$$\sigma_{nimi = nauris}(T)=\{(3,nauris,4)\}$$

$$\sigma_{hinta = 4}(T)=\{(3,nauris,4),(5,selleri,4)\}$$

$$\sigma_{hinta \le 5}(T)=\{(2,porkkana,5),(3,nauris,4),(5,selleri,4)\}$$

Yhdistämällä projektio ja restriktio saadaan vastine esimerkiksi SQL-kyselylle `SELECT nimi FROM Tuotteet WHERE hinta <= 5`:

$$\Pi_{nimi}(\sigma_{hinta \le 5}(T))=\{(porkkana),(nauris),(selleri)\}$$

### Liitos

Liitos $$\bowtie$$ muodostaa relaation, jonka rivit on koostettu kahden relaation pohjalta. Tämä vastaa SQL:ssä kahden taulun kyselyä.

Tarkastellaan esimerkkinä seuraavia tauluja `Henkilot` ja `Yritykset`:

<table class="db-table">
<thead>
  <tr><th colspan="3" id="table-title">Henkilot</th></tr>
  <tr><th width="30">id</th><th width="100">nimi</th><th width="70">yritys_id</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Maija</td><td>1</td></tr>
  <tr><td>2</td><td>Liisa</td><td>1</td></tr>
  <tr><td>3</td><td>Uolevi</td><td>3</td></tr>
  <tr><td>4</td><td>Anna</td><td>2</td></tr>
  <tr><td>5</td><td>Kaaleppi</td><td>3</td></tr>
</tbody>
</table>

<table class="db-table">
<thead>
  <tr><th colspan="3" id="table-title">Yritykset</th></tr>
  <tr><th width="30">id</th><th width="100">nimi</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Google</td></tr>
  <tr><td>2</td><td>Amazon</td></tr>
  <tr><td>3</td><td>Facebook</td></tr>
</tbody>
</table>

Näitä tauluja vastaavat seuraavat relaatiot:

$$H = \{(1,Maija,1),(2,Liisa,1),(3,Kaaleppi,3)\}$$

$$Y = \{(1,Google),(2,Amazon),(3,Facebook)\}$$

Nyt kyselyä `SELECT * FROM Henkilot H, Yritykset Y WHERE H.yritys_id = Y.id` vastaa seuraava relaatio-operaatio:

$${H\ \bowtie\ Y \atop \small H.yritys\_id = Y.id} = \{(1,Maija,1,1,Google),(2,Liisa,1,1,Google),(3,Kaaleppi,3,3,Facebook)\}$$

Yhdistämällä tähän projektion saamme haettua kunkin henkilön nimen ja yrityksen nimen:

$$\Pi_{H.nimi,Y.nimi}({H\ \bowtie\ Y \atop \small H.yritys\_id = Y.id}) = \{(Maija,Google),(Liisa,Google),(Kaaleppi,Facebook)\}$$

### Teoria vs. käytäntö

Tässä esitettyjen ja muiden relaatio-operaatioiden avulla voidaan toteuttaa hakuja samaan tapaan kuin SQL-kyselyillä. Kuitenkaan olemassa olevat SQL-tietokannat eivät noudata täysin matemaattista relaatiomallia, vaan niissä on käytännön syistä johtuvia eroja.

Yksi merkittävä ero on, että SQL:ssä taulun usean rivin sisältö voi olla sama, mikä ei ole mahdollista relaatiossa. Esimerkiksi voimme luoda seuraavasti taulun `Testi` ja lisätä siihen kolme samanlaista riviä:

```prompt
sqlite> CREATE TABLE Testi (x INTEGER);
sqlite> INSERT INTO Testi VALUES (1);
sqlite> INSERT INTO Testi VALUES (1);
sqlite> INSERT INTO Testi VALUES (1);
sqlite> SELECT * FROM Testi;
1
1
1
```

Tällä on vaikutusta myös hakujen tuloksiin. Kuten näimme aiemmin, projektio $$\Pi_{hinta}(T)$$ sisältää jokaisen eri hinnan vain kerran, kun taas kyselyn `SELECT hinta FROM Tuotteet` tulostaulussa voi olla monta kertaa sama hinta. SQL:ssä haetaan oletuksena kaikki rivit ja toistuvat rivit voidaan poistaa sanan `DISTINCT` avulla. Tarkasti ottaen projektiota $$\Pi_{hinta}(T)$$ vastaa siis kysely `SELECT DISTINCT hinta FROM Tuotteet`.

Toinen ero on, että SQL:ssä rivien järjestyksellä voi olla väliä, kun taas relaatiossa ei ole tiettyä järjestystä. Rivien järjestys näkyy SQL:ssä kyselyssä, jonka lopussa on osa `ORDER BY`. Tällainen kysely muodostaa tulostaulun, jossa rivit ovat halutussa järjestyksessä. Relaatio-operaatioilla ei ole mahdollista toteuttaa tällaista hakua. Järjestämisen mahdollisuus on mukana SQL:ssä, koska se on käytännössä hyödyllinen ominaisuus.

## Normaalimuodot

### 1. normaalimuoto

Taulu on 1. normaalimuodossa, jos jokaisella rivillä on samat sarakkeet ja missään sarakkeessa ei ole tietokannan kannalta rakenteellista tietoa.

Käytännössä rakenteellinen tieto tarkoittaa taulua. Esimerkiksi seuraava taulu ei ole 1. normaalimuodossa, koska sarakkeessa `tyontekijat` on sisältönä taulu.

<table class="db-table">
<thead>
  <tr><th colspan="3" id="table-title">Yritykset</th></tr>
  <tr><th width="30">id</th><th width="100">nimi</th><th>tyontekijat</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Google</td><td>
<table class="db-table">
<thead>
  <tr><th width="30">id</th><th width="100">nimi</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Maija</td></tr>
  <tr><td>2</td><td>Liisa</td></tr>
</tbody>
</table>
  </td></tr>
  <tr><td>2</td><td>Amazon</td><td>
<table class="db-table">
<thead>
  <tr><th width="30">id</th><th width="100">nimi</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Anna</td></tr>
</tbody>
</table>
  </td></tr>
  <tr><td>3</td><td>Facebook</td><td>
<table class="db-table">
<thead>
  <tr><th width="30">id</th><th width="100">nimi</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Uolevi</td></tr>
  <tr><td>2</td><td>Kaaleppi</td></tr>
</tbody>
</table>
  </td></tr>
</tbody>
</table>

Käytännössä 1. normaalimuoto on äärimmäisen helppoa saavuttaa, koska SQL:ssä jokaisessa taulussa on kiinteät sarakkeet eikä ole mahdollista, että sarakkeen sisältönä olisi taulu. Niinpä jokainen SQL:ssä luotu taulu on automaattisesti 1. normaalimuodossa.

### 2. normaalimuoto

Taulu on 2. normaalimuodossa, jos se on 1. normaalimuodossa ja siinä ei ole avaimeen kuulumatonta saraketta, jonka arvo voidaan päätellä avaimen osasta.

Avain on sarake tai sarakkeiden yhdistelmä, joka yksilöi jokaisen taulun rivin ja jonka mikään osa ei riitä yksilöimään taulun rivejä. Tavallinen avain on rivin id-numero, mutta tietokantojen teorian kannalta avain voi olla muutakin.

Seuraavassa on esimerkki taulusta, joka ei täytä 2. normaalimuotoa. Huomaa, että taulussa ei ole saraketta `id` kuten yleensä.

<table class="db-table">
<thead>
  <tr><th colspan="4" id="table-title">Henkilot</th></tr>
  <tr><th width="30">maakoodi</th><th width="100">puhelin</th><th width="100">nimi</th><th width="70">alue</th></tr>
</thead>
<tbody>
  <tr><td>358</td><td>1234567</td><td>Maija</td><td>Eurooppa</td></tr>
  <tr><td>358</td><td>7654321</td><td>Liisa</td><td>Eurooppa</td></tr>
  <tr><td>81</td><td>1234567</td><td>Kaaleppi</td><td>Aasia</td></tr>
</tbody>
</table>

Tämän taulun avain on (`maakoodi`, `puhelin`), koska maakoodin ja puhelinnumeron yhdistelmä yksilöi jokaisen rivin. Kuitenkin maakoodista (eli avaimen osasta) voidaan päätellä alue, minkä vuoksi taulu ei ole 2. normaalimuodossa.

Käytännössä taulussa on yleensä aina sarake `id`, joka on taulun ainoa avain. Koska id-numero on vain yksi sarake, siinä ei ole osaa, joka yksilöisi rivit. Niinpä id-numeron käyttäminen takaa automaattisesti, että taulu täyttää 2. normaalimuodon.

### 3. normaalimuoto

### 4. normaalimuoto

### 5. normaalimuoto
