# 8. Tietokantojen teoria

Tietokannan sisällön esittäminen relaatiomallin mukaisesti tauluina ja riveinä tuntuu nykyään lähes itsestään selvältä tavalta, mutta tämä oli aikoinaan mullistava idea tietokanta-alalla. Tässä luvussa tutustumme relaatiomallin matemaattiseen taustaan, joka syntyi 1970-luvulla.

## Matemaattinen tausta

### Joukko

_Joukko_ (_set_) on kokoelma alkioita. Esimerkiksi $$A=\{1,2,3,4,5\}$$ ja $$B=\{apina, banaani, cembalo\}$$ ovat joukkoja.

Merkintä $$\mid S \mid$$ tarkoittaa joukon $$S$$ alkioiden määrää. Äskeisessä esimerkissä $$\mid A \mid=5$$ ja $$\mid B \mid =3$$.

Merkintä $$x \in S$$ tarkoittaa, että alkio $$x$$ kuuluu joukkoon $$S$$.

Joukon alkioilla ei ole tiettyä järjestystä. Esimerkiksi $$\{1,2,3\}$$, $$\{1,3,2\}$$ ja $$\{2,3,1\}$$ tarkoittavat samaa joukkoa.

Tietty alkio voi esiintyä joukossa enintään kerran. Esimerkiksi $$\{1,2,1\}$$ ei ole joukko, koska alkio $$1$$ esiintyy kahdesti.

### Osajoukko

_Osajoukko_ (_subset_) sisältää osan joukon alkioista. Esimerkiksi joukon $$\{1,2,3\}$$ osajoukot ovat $$\emptyset$$, $$\{1\}$$, $$\{2\}$$, $$\{3\}$$, $$\{1,2\}$$, $$\{1,3\}$$, $$\{2,3\}$$ ja $$\{1,2,3\}$$. Merkintä $$\emptyset$$ tarkoittaa tyhjää joukkoa.

Merkintä $$A \subset B$$ tarkoittaa, että joukko $$A$$ on joukon $$B$$ osajoukko.

Osajoukko on _aito_ (_proper_), jos siinä ei ole kaikkia joukon alkioita.

Kun joukossa on $$n$$ alkiota, siitä voidaan muodostaa $$2^n$$ osajoukkoa. Esimerkiksi joukossa $$\{1,2,3\}$$ on $$3$$ alkiota, joten osajoukkoja on $$2^3=8$$.

### Monikko

_Monikko_ (_tuple_) on lista alkioita tietyssä järjestyksessä. Esimerkiksi $$(1,3,2)$$ on monikko, jossa on $$3$$ alkiota.

Monikossa alkioiden järjestyksellä on merkitystä. Esimerkiksi $$(1,2,3)$$, $$(1,3,2)$$ ja $$(2,3,1)$$ ovat kolme eri monikkoa.

Monikossa sama alkio voi toistua monta kertaa. Esimerkiksi $$(1,2,1)$$ on monikko, jossa toistuu kahdesti alkio $$1$$.

### Karteesinen tulo

_Karteesinen tulo_ (_Cartesian product_) $$S_1 \times S_2 \times \dots \times S_k$$ sisältää kaikki monikot, jotka muodostuvat valitsemalla järjestyksessä yksi alkio jokaisesta joukosta $$S_1,S_2,\dots,S_k$$.

Kun $$A=\{1,2,3\}$$ ja $$B=\{x,y,z\}$$, niin

$$A \times B = \{(1,x),(1,y),(1,z),(2,x),(2,y),(2,z),(3,x),(3,y),(3,z)\}.$$

Kun $$A=\{1,2,3\}$$, $$B=\{x\}$$ ja $$C=\{1,2\}$$, niin

$$A \times B \times C = \{(1,x,1), (1,x,2), (2,x,1), (2,x,2), (3,x,1), (3,x,2)\}.$$

Karteesisen tulon alkioiden määrä on $$\mid S_1 \mid \cdot \mid S_2 \mid \dots \mid S_k \mid$$. Esimerkiksi kun $$\mid A \mid = 3$$, $$\mid B \mid = 1$$ ja $$\mid C \mid = 2$$, karteesinen tulo $$A \times B \times C$$ muodostuu $$3 \cdot 1 \cdot 2 = 6$$ alkiosta.

### Relaatio

_Relaatio_ (_relation_) on karteesisen tulon osajoukko. Kun $$A=\{1,2,3\}$$ ja $$B=\{x,y,z\}$$, niin mahdollisia karteesisen tulon $$A \times B$$ relaatioita ovat esimerkiksi seuraavat:

$$R_1 = \{(1,x),(1,y),(1,z)\}$$

$$R_2 = \{(1,x),(2,x),(2,z),(3,y)\}$$

$$R_3 = \{(2,y)\}$$

Relaatio tarkoittaa siis sitä, että valitaan jokin osajoukko kaikista mahdollisista alkioiden muodostamista yhdistelmistä.

Karteesisella tulolla $$S_1 \times S_2 \times \dots \times S_k$$ on kaikkiaan $$2^{\mid S_1 \mid \cdot \mid S_2 \mid \dots \mid S_k \mid}$$ mahdollista relaatiota.

## Taulu relaationa

Tietokannan taulu voidaan esittää matemaattisesti relaationa, jonka jokainen monikko vastaa yhtä taulun riviä. Kun taulussa on $$k$$ saraketta, relaatiossa jokaisessa monikossa on vastaavasti $$k$$ alkiota, joista käytetään nimeä attribuutti. Relaation taustalla on karteesinen tulo

$$S_1 \times S_2 \times \dots \times S_k,$$

jossa joukot $$S_1,S_2,\dots,S_k$$ ilmaisevat, mitä arvoja kussakin attribuutissa voi olla eli kunkin attribuutin tyypin.

### Esimerkki

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

Tämä taulu vastaa relaatiota

$$T=\{(1,retiisi,7),(2,porkkana,5),(3,nauris,4),(4,lanttu,8),(5,selleri,4)\},$$

jonka jokainen monikko muodostuu kolmesta attribuutista `id`, `nimi` ja `hinta`.

Tässä tapauksessa relaation taustalla on karteesinen tulo $$S_1 \times S_2 \times S_3$$. Joukot $$S_1,S_2,S_3$$ määrittelevät attribuuttien tyypit eli jokainen joukko sisältää kaikki arvot, joita vastaavassa attribuutissa voi olla.

Esimerkiksi attribuutti `id` on positiivinen kokonaisluku, joten $$S_1$$ voisi olla $$\{1,2,3,\dots\}$$ eli ääretön joukko, joka sisältää kaikki positiiviset kokonaisluvut. Toinen mahdollisuus on, että id-numerolla on yläraja, kuten yleensä käytännön tietokannoissa. Esimerkiksi jos id-numero on 64-bittinen kokonaisluku, $$S_1$$ voisi olla $$\{1,2,3,\dots,2^{64}-1\}$$.

### Teoria vs. käytäntö

SQL-tietokannat perustuvat relaatiomalliin, mutta ne eivät kuitenkaan täysin noudata sitä.

Yksi ero on, että relaatiossa jokainen monikko on erilainen (koska relaatio on joukko), mutta SQL-taulussa ei ole tätä rajoitusta. Esimerkiksi voimme luoda seuraavasti taulun `Testi` ja lisätä siihen kolme samanlaista riviä:

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

Usein tosin SQL-taulussa on sarake `id`, joka takaa, että taulussa ei ole kahta samanlaista riviä, koska jokaisella rivillä on eri id-numero.

Toinen ero on, että relaatiossa jokaisella monikon attribuutilla tulee olla arvo mutta SQL-taulussa sarakkeessa voi olla `NULL` eli arvo puuttuu.

## Relaatio-operaatiot

Relaatio-operaatioiden avulla olemassa olevista relaatioista voidaan muodostaa uusi relaatio. Tämä vastaa SQL:ssä kyselyä, jossa tauluista muodostetaan tulostaulu. Tutustumme seuraavaksi esimerkkinä kolmeen keskeiseen relaatio-operaatioon: projektio, restriktio ja liitos.

### Projektio

Projektio $$\Pi$$ muodostaa relaation, jossa monikoista valitaan tietyt attribuutit. Projektio vastaa SQL-kyselyä, jossa valitaan tietyt sarakkeet taulusta. Esimerkiksi projektio $$\Pi_{nimi,hinta}(T)$$ vastaa SQL-kyselyä `SELECT nimi, hinta FROM Tuotteet`.

Esimerkkejä:

$$\Pi_{nimi}(T) = \{(retiisi),(porkkana),(nauris),(lanttu),(selleri)\}$$

$$\Pi_{hinta}(T) = \{(7),(5),(4),(8)\}$$

$$\Pi_{nimi,hinta}(T) = \{(retiisi,7),(porkkana,5),(nauris,4),(lanttu,8),(selleri,4)\}$$

Huomaa, että mahdolliset toistuvat monikot suodattuvat pois projektiosta. Tämän takia projektiossa $$\Pi_{hinta}(T)$$ on vain neljä monikkoa, koska kahdella tuotteella on sama hinta.

### Restriktio

Restriktio $$\sigma$$ muodostaa relaation, jossa on tietyt ehdot täyttävät monikot. Restriktio vastaa SQL-kyselyä, jossa rivit valitaan `WHERE`-osassa. Esimerkiksi restriktio $$\sigma_{hinta \le 5}(T)$$ vastaa SQL-kyselyä `SELECT * FROM Tuotteet WHERE hinta <= 5`.

Esimerkkejä:

$$\sigma_{nimi = nauris}(T)=\{(3,nauris,4)\}$$

$$\sigma_{hinta = 4}(T)=\{(3,nauris,4),(5,selleri,4)\}$$

$$\sigma_{hinta \le 5}(T)=\{(2,porkkana,5),(3,nauris,4),(5,selleri,4)\}$$

Yhdistämällä projektio ja restriktio saadaan vastine esimerkiksi SQL-kyselylle `SELECT nimi FROM Tuotteet WHERE hinta <= 5`:

$$\Pi_{nimi}(\sigma_{hinta \le 5}(T))=\{(porkkana),(nauris),(selleri)\}$$

### Liitos

Liitos $$\bowtie$$ muodostaa relaation, jonka monikot on koostettu kahden relaation pohjalta. Tämä vastaa SQL:ssä kahden taulun kyselyä.

Tarkastellaan esimerkkinä seuraavia tauluja `Henkilot` ja `Yritykset`:

<table class="db-table">
<thead>
  <tr><th colspan="3" id="table-title">Henkilot</th></tr>
  <tr><th width="30">id</th><th width="100">nimi</th><th width="70">yritys_id</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>Maija</td><td>1</td></tr>
  <tr><td>2</td><td>Liisa</td><td>1</td></tr>
  <tr><td>3</td><td>Kaaleppi</td><td>3</td></tr>
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

Relaatio-operaatioiden avulla voidaan toteuttaa hakuja samaan tapaan kuin SQL-kyselyillä, mutta tässäkin SQL-kielessä on joitakin eroja.

Kuten näimme aiemmin, projektio $$\Pi_{hinta}(T)$$ sisältää jokaisen eri hinnan vain kerran, kun taas kyselyn `SELECT hinta FROM Tuotteet` tulostaulussa voi olla monta kertaa sama hinta. SQL:ssä on itse asiassa kaksi eri tapaa hakea tietoa:

* `SELECT ALL ...`: haetaan kaikki rivit, myös toistuvat rivit
* `SELECT DISTINCT ...`: haetaan jokainen erilainen rivi vain kerran

Ensimmäinen tapa on oletus ja sanaa `ALL` ei käytetä yleensä, mutta toistuvat rivit voidaan poistaa sanan `DISTINCT` avulla. Tarkasti ottaen projektiota $$\Pi_{hinta}(T)$$ vastaa siis kysely `SELECT DISTINCT hinta FROM Tuotteet`.

Lisäksi SQL:ssä rivien järjestyksellä voi olla väliä, kun taas relaation monikoilla ei ole järjestystä. Rivien järjestys näkyy SQL:ssä esimerkiksi kyselyssä, jonka lopussa on `ORDER BY`, jolloin tulostaulun rivit ovat halutussa järjestyksessä. Relaatio-operaatioilla ei ole mahdollista toteuttaa tällaista hakua.

## Avaimet ja riippuvuudet

_Yliavain_ (_superkey_) on attribuuttien yhdistelmä, joka on varmasti erilainen jokaisessa relaation monikossa. Yliavain yksilöi siis jokaisen relaatiossa olevan monikon.

_Kandidaattiavain_ (_candidate key_) eli _avain_ (_key_) on minimaalinen yliavain. Tämä tarkoittaa, että jos poistetaan mikä tahansa attribuutti, niin kyseessä ei ole enää yliavain.

_Pääavain_ (_primary key_) on yksi avaimista, joka on nostettu erikoisasemaan.

### Esimerkki

Tarkastellaan esimerkkinä tuotteita kuvaavaa relaatiota, jonka attribuutit ovat `id`, `nimi` ja `hinta`.

Koska attribuutti `id` yksilöi jokaisen monikon, se on yliavain. Myös yhdistelmät (`id`, `nimi`), (`id`, `hinta`) ja (`id`, `nimi`, `hinta`) ovat yliavaimia, koska niiden osana on attribuutti `id`. Kuitenkin näistä yliavaimista vain `id` on avain, koska muut yliavaimet eivät ole minimaalisia.

Attribuutti `hinta` ei selkeästi ole yliavain, koska monella tuotteella voi olla sama hinta. Attribuutti `nimi` on yliavain siinä tapauksessa, että usealla tuotteella ei voi olla samaa nimeä. Yhdistelmä (`nimi`, `hinta`) on yliavain, jos ei voi olla kahta tuotetta, joilla olisi sekä sama nimi että sama hinta. Riippuu siis tietoon liittyvistä oletuksista, mitkä attribuuttien yhdistelmät ovat yliavaimia.

### Avaimen valinta

Avain voi olla joko _luonnollinen avain_ (_natural key_) tai _sijaisavain_ (_surrogate key_). Luonnollinen avain muodostuu alkuperäisestä tiedosta, kun taas sijaisavain on lisätty mukaan nimenomaan sen takia, että siitä tulisi avain. Esimerkiksi `nimi` on luonnollinen avain, kun taas `id` on sijaisavain.

Tietokantojen teoriassa näkee usein käytettävän luonnollisia avaimia, mutta käytännössä on hyvin tavallista käyttää id-numeroa tai vastaavaa sijaisavainta. Tässä on etuna, että id-numero on kompakti tieto, joka kelpaa varmasti avaimeksi. Jos valittaisiin luonnollinen avain, siihen kuuluisi ehkä monia attribuutteja ja pitäisi pohtia, riittävätkö attribuutit varmasti yksilöimään monikon kaikissa tapauksissa.

### Funktionaalinen riippuvuus

_Funktionaalinen riippuvuus_ (_functional dependency_) $$A \to B$$ tarkoittaa, että attribuutit $$A$$ määräävät attribuutit $$B$$. Toisin sanoen jos relaatiossa on kaksi monikkoa, joissa attribuutit $$A$$ ovat samat, niin myös attribuutit $$B$$ ovat samat.

Esimerkiksi jos relaatiossa on attribuutit `postinumero` ja `kaupunki`, siinä on funktionaalinen riippuvuus `postinumero` $$\to$$ `kaupunki`, koska postinumerosta voidaan päätellä kaupunki. Ei voi olla kahta monikkoa, joissa olisi sama postinumero mutta eri kaupunki.

Attribuutit $$A$$ muodostavat yliavaimen tarkalleen silloin, kun $$A \to B$$ pätee mille tahansa attribuuteille $$B$$. Tässä tapauksessa koska $$A$$ on yliavain, relaatiossa ei voi olla kahta monikkoa, jossa attribuutit $$A$$ ovat samat.

## Normaalimuodot

Normaalimuodot ovat tietokannan suunnitteluun liittyviä vaatimuksia, joiden tavoitteena on edistää tiedon eheyttä ja helpottaa tietokannan käyttämistä.

Ensimmäinen normaalimuoto vaatii, että tietokannassa on käytössä relaatiomalli. SQL:ssä määritelty taulu toteuttaa automaattisesti ensimmäisen normaalimuodon.

Toinen ja kolmas normaalimuoto liittyvät attribuuttien riippuvuuksiin. Näiden pohjalta on edelleen kehitetty Boyce–Codd-normaalimuoto, johon tutustumme seuraavaksi.

### Boyce–Codd-normaalimuoto

Relaatio toteuttaa Boyce–Codd-normaalimuodon, jos jokaisessa siinä olevassa funktionaalisessa riippuvuudessa $$X \to Y$$ pätee, että $$Y \subset X$$ tai $$X$$ on yliavain.

Ideana on varmistaa, että relaatiossa ei ole riippuvuuksia, jotka eivät liittyisi relaation avaimiin. Jos tällaisia riippuvuuksia on olemassa, ne tulisi esittää erillisessä relaatiossa.

Jos $$Y \subset X$$, niin attribuutit $$Y$$ ovat osa attribuutteja $$X$$. Tällainen riippuvuus on voimassa aina, eli se ei kerro mitään erityistä. Esimerkki tästä on riippuvuus (`nimi`, `hinta`) $$\to$$ `hinta`.

Jos $$X$$ on yliavain, niin riippuvuus $$X \to Y$$ kuuluu asiaan, koska yliavain määrää kaikki attribuutit. Esimerkki tästä on riippuvuus `id` $$\to$$ `nimi`.

Jos relaatio toteuttaa Boyce–Codd-normaalimuodon, niin se toteuttaa myös ensimmäisen, toisen ja kolmannen normaalimuodon.

### Esimerkki

Tarkastellaan esimerkkinä seuraavaa taulua `Suoritukset`, jossa on kurssisuorituksia:

<table class="db-table">
<thead>
  <tr><th colspan="4" id="table-title">Suoritukset</th></tr>
  <tr><th width="30">id</th><th width="100">opiskelija_id</th><th width="100">kurssi_id</th><th width="100">op</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>123123</td><td>111</td><td>5</td></tr>
  <tr><td>2</td><td>321321</td><td>111</td><td>5</td></tr>
  <tr><td>3</td><td>123123</td><td>222</td><td>10</td></tr>
  <tr><td>4</td><td>321321</td><td>333</td><td>5</td></tr>
</tbody>
</table>

Oletetaan, että jokaisella kurssilla on kiinteä opintopisteiden määrä, jolloin taulussa on riippuvuus `kurssi_id` $$\to$$ `op`. Tämä on vastoin Boyce–Codd-normaalimuotoa, koska sarake `op` ei ole osa saraketta `kurssi_id` eikä sarake `kurssi_id` ole yliavain.

Asia voidaan korjata tallentamalla kurssien opintopisteet erilliseen tauluun:

<table class="db-table">
<thead>
  <tr><th colspan="3" id="table-title">Suoritukset</th></tr>
  <tr><th width="30">id</th><th width="100">opiskelija_id</th><th width="100">kurssi_id</th></tr>
</thead>
<tbody>
  <tr><td>1</td><td>123123</td><td>111</td></tr>
  <tr><td>2</td><td>321321</td><td>111</td></tr>
  <tr><td>3</td><td>123123</td><td>222</td></tr>
  <tr><td>4</td><td>321321</td><td>333</td></tr>
</tbody>
</table>

<table class="db-table">
<thead>
  <tr><th colspan="2" id="table-title">Kurssit</th></tr>
  <tr><th width="50">id</th><th width="100">op</th></tr>
</thead>
<tbody>
  <tr><td>111</td><td>5</td></tr>
  <tr><td>222</td><td>10</td></tr>
  <tr><td>333</td><td>5</td></tr>
</tbody>
</table>

Tämän muutoksen jälkeen molemmat taulut noudattavat Boyce–Codd-normaalimuotoa.

### Teoria vs. käytäntö

Normaalimuotojen merkityksenä on, että ne antavat matemaattisen näkökulman tietokantojen suunnitteluun. Esimerkiksi jos tietokanta ei toteuta Boyce–Codd-normaalimuotoa, tietokannan rakennetta voi luultavasti parantaa.

Käytännössä tietokantoja ei kuitenkaan yleensä suunnitella normaalimuotojen avulla vaan luvun 6 periaatteiden tyylisesti. Normaalimuodot kuvaavat osan siitä, millainen ajattelutapa on pätevällä tietokantojen suunnittelijalla.
