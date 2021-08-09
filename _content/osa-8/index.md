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

$$\{(1,retiisi,7),(2,porkkana,5),(3,nauris,4),(4,lanttu,8),(5,selleri,4)\}$$

Tämän relaation taustalla on karteesinen tulo $$S_1 \times S_2 \times S_3$$. Nämä joukot määrittävät, mitä sisältöä riveissä voi olla eli kunkin sarakkeen tyypin.

Koska sarakkeissa $$1$$ ja $$3$$ on kokonaisluku, joukot $$S_1$$ ja $$S_3$$ sisältävät kaikki kokonaisluvut. Sarakkeessa $$2$$ on puolestaan merkkijono, joten joukko $$S_2$$ sisältää kaikki merkkijonot. Huomaa, että nämä ovat äärettömiä joukkoja, koska erilaisia kokonaislukuja ja merkkijonoja on äärettömästi.

Tietokannan taulussa jokaisella sarakkeella on myös nimi. Tässä taulussa sarakkeen $$1$$ nimi on `id`, sarakkeen $$2$$ nimi on `nimi` ja sarakkeen $$3$$ nimi on `hinta`.

### Taulun avain

Avain on sarake tai sarakkeiden yhdistelmä, joka yksilöi taulun rivin eli joka rivillä on eri avain. Taulussa `Tuotteet` luonteva avain on sarake `id`, koska jokaisella rivillä on eri id-numero. Sen sijaan sarake `hinta` ei voisi olla avain, koska usealla tuotteella voi olla sama hinta.

Huomaa, että myös vaikkapa yhdistelmä (`id`, `nimi`) on mahdollinen avain, koska jokaisella rivillä id-numeron ja nimen muodostama pari on erilainen. Koska pelkkä id-numero yksilöi rivin, niin varmasti myös id-numeron ja nimen yhdistelmä yksilöi rivin.

Jos voidaan olettaa, että tietokannassa ei ole koskaan kahta tuotetta, joilla on sama nimi ja hinta, yhdistelmä (`nimi`, `hinta`) on mahdollinen avain. Tällöin taulussa ei olisi pakko olla saraketta `id`, koska myös nimi ja hinta yksilöivät tuotteen.

Tietokantojen teoriassa näkee usein tauluja, joissa avain on jotain muuta kuin id-numero. Käytännössä kuitenkin avain on yleensä aina id-numero, koska olisi hankalaa ja tarpeetonta yrittää keksiä jokin sarakkeiden yhdistelmä, joka yksilöisi rivin id-numeron sijasta.

## Relaatio-operaatiot



## Normaalimuodot
