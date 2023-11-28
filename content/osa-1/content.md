# 1. Johdanto

## Mikä on tietokanta

_Tietokanta_ (_database_) on tietokoneella oleva kokoelma tietoa, johon voidaan suorittaa hakuja ja jonka sisältöä voidaan muuttaa. Tietokantoja ovat esimerkiksi:

* nettisivuston käyttäjärekisteri
* verkkokaupan tuotteet ja varastotilanne
* pankin tiedot asiakkaista ja tilitapahtumista
* päivittäin mitatut säätiedot eri paikoissa
* lentoyhtiön lentoaikataulut ja varaustilanne

Tietokantoja on nykyään valtavasti, ja useimmat ihmiset ovat tavallisen päivän aikana yhteydessä lukuisiin tietokantoihin.

### Tietokantojen haasteet

Tietokantojen tekniseen toteutukseen liittyy monia haasteita, eikä hyvin toimivan tietokannan toteuttaminen ole helppo tehtävä. Keskeisiä haasteita ovat:

#### Tiedon määrä

Monessa tietokannassa on suuri määrä tietoa, johon kohdistuu jatkuvasti hakuja ja muutoksia. Miten toteuttaa tietokanta niin, että tietoon pääsee käsiksi tehokkaasti?

#### Samanaikaisuus

Tietokannalla on yleensä useita käyttäjiä, jotka voivat hakea ja muuttaa tietoa samaan aikaan.
Mitä tietokannan toteutuksessa tulee ottaa huomioon tähän liittyen?

#### Yllätykset

Tietokannan sisällön tulisi säilyä järkevänä myös yllättävissä tilanteissa. Esimerkiksi mitä tapahtuu, jos sähköt katkeavat juuri silloin, kun tietoa ollaan muuttamassa?

### Tietokantajärjestelmät

_Tietokantajärjestelmä_ pitää huolta tietokannan sisällöstä ja tarjoaa tietokannan käyttäjälle toiminnot, joiden avulla tietoa pystyy hakemaan ja muuttamaan. Huomaa, että termiä _tietokanta_ käytetään usein myös silloin, kun viitataan tietokantajärjestelmään.

Useimmat käytössä olevat tietokannat perustuvat relaatiomalliin ja SQL-kieleen, joihin tutustumme tällä kurssilla. Esimerkiksi MySQL, PostgreSQL ja SQLite ovat tällaisia tietokantajärjestelmiä. Näiden tietokantojen teoreettinen perusta syntyi 1970-luvulla.

Termi _NoSQL_ viittaa tietokantaan, joka perustuu muuhun kuin relaatiomalliin ja SQL-kieleen. Esimerkiksi MongoDB ja Redis ovat saavuttaneet viime aikoina suosiota. Tällä kurssilla emme kuitenkaan juurikaan käsittele NoSQL-tietokantoja.

## Tee-se-itse-tietokanta

Ennen tutustumista olemassa oleviin tietokantajärjestelmiin on hyvä miettiä, mitä tarvetta tällaisille järjestelmille on. Miksi emme voisi vain toteuttaa tietokantaa itse vaikkapa tallentamalla tietokannan sisällön tekstitiedostoon sopivassa muodossa?

### Esimerkki

Haluamme tallentaa tietokantaan tietoa kurssin opiskelijoiden ratkaisuista kurssin tehtäviin. Kun opiskelija lähettää ratkaisun, tietokantaan tallennetaan opiskelijanumero, tehtävän numero, ratkaisun lähetysaika sekä ratkaisun tuottama pistemäärä.

Yksinkertainen tapa toteuttaa tietokanta on luoda yksi tekstitiedosto, jonka jokaisella rivillä on yksi lähetys. Aina kun joku opiskelija lähettää ratkaisun, tiedostoon lisätään yksi rivi. Voisimme käytännössä tallentaa tietokannan CSV-tiedostona tähän tapaan:

```
012121212;1;2020-05-03 12:50:32;100
012341234;1;2020-05-03 14:02:12;100
012121212;2;2020-05-04 14:05:50;100
012121212;3;2020-05-04 14:43:12;0
012341234;2;2020-05-04 10:15:23;0
012341234;2;2020-05-04 16:40:39;0
013371337;1;2020-05-06 18:11:13;0
012341234;2;2020-05-07 10:02:15;100
```

CSV-tiedostossa tietty erotinmerkki erottaa riveillä olevat kentät. Tässä tapauksessa erotinmerkkinä on puolipiste `;`. Esimerkiksi tiedoston ensimmäinen rivi kertoo, että opiskelija 012121212 on lähettänyt ratkaisun tehtävään 1 ja saanut siitä 100 pistettä.

Nyt jos haluamme vaikkapa selvittää jokaisen opiskelijan lähetysten määrän, voimme hoitaa asian näin Python-kielellä:

```python
count = {}

for line in open("lahetykset.csv"):
    parts = line.split(";")
    if parts[0] not in count:
        count[parts[0]] = 0
    count[parts[0]] += 1

print(count)
```

Ohjelma antaa seuraavan tuloksen:

```
{'012121212': 3, '012341234': 4, '013371337': 1}
```

Tämä tarkoittaa, että opiskelija 012121212 on lähettänyt kolme ratkaisua, opiskelija 012341234 on lähettänyt neljä ratkaisua ja opiskelija 013371337 on lähettänyt yhden ratkaisun.

### Mahdolliset ongelmat

Tällainen CSV-tiedostoa käyttävä tietokanta on periaatteessa toimiva, mutta sen käyttäminen voi johtaa ongelmiin:

#### Tiedon määrä

Kun tiedon määrä kasvaa, tiedon hakeminen CSV-tiedostosta voi muodostua ongelmaksi. Tämä johtuu siitä, että joudumme useimmissa tilanteissa käymään läpi koko tiedoston sisällön alusta loppuun, kun haluamme saada haettua tietyn asian.

Esimerkiksi jos haluamme selvittää, minkä pistemäärän opiskelija 012341234 on saanut tehtävästä 2, joudumme käymään läpi tiedoston _kaikki_ rivit, jotta löydämme oikeat rivit. Joudumme tekemään näin, koska rivit ovat sekalaisessa järjestyksessä eikä meillä ole etukäteen tietoa, missä haluamamme rivit ovat.

Tiedoston läpikäynti ei ole ongelma, jos tiedosto on pieni. Esimerkiksi jos tiedostossa on sata riviä, läpikäynti sujuu hyvin nopeasti. Mutta tiedoston koon kasvaessa alkaa olla työlästä käydä kaikki rivit läpi aina, kun haluamme saada selville jotain tiedostosta.

#### Samanaikaisuus

Mitä tapahtuu, jos kaksi opiskelijaa lähettävät ratkaisun samaan aikaan? Tällöin tiedoston loppuun pitäisi tulla kaksi riviä tietoa seuraavaan tapaan:

```
012341234;3;2020-05-07 15:42:02;0
013371337;7;2020-05-07 15:42:02;0
```

Jos käy huonosti, voi kuitenkin käydä näin:

```
012341234;3;2020013371337;7;2020-05-07 15:42:02;0
-05-07 15:42:02;0
```

Tässä ensimmäinen prosessi kirjoittaa ensin tiedoston loppuun `012341234;3;2020`, sitten toinen prosessi kirjoittaa väliin `013371337;7;2020-05-07 15:42:02;0` ja lopuksi ensimmäinen prosessi kirjoittaa `-05-07 15:42:02;0`. Tämän seurauksena tiedoston rakenne menee sekaisin.

Kun tiedostoon kirjoitetaan tietoa, ei ole itsestään selvää, että tieto menee perille yhtenäisenä, jos joku muu koettaa kirjoittaa samaan aikaan. Tämä riippuu tiedostojärjestelmästä, tiedon määrästä ja tiedoston käsittelytavasta.

#### Yllätykset

Tarkastellaan tilannetta, jossa haluamme poistaa tietokannasta opiskelijan 012341234 lähetykset. Voimme tehdä tämän lukemalla ensin kaikki rivit muistiin ja kirjoittamalla sitten takaisin
tiedostoon kaikki rivit, joissa opiskelija ei ole 012341234.

Mitä jos sähköt katkeavat juuri, kun olemme kirjoittaneet puolet riveistä takaisin? Kun käynnistämme tietokannan uudestaan, huomaamme, että tiedostossa on vain puolet riveistä ja loput ovat kadonneet eikä meillä ole keinoa saada niitä takaisin.

### Mitä opimme tästä?

Yksinkertainen tekstitiedosto ei ole sinänsä huono tapa tallentaa tietoa, mutta se ei sovellu kaikkiin käyttötarkoituksiin. Tämän vuoksi tarvitsemme erillisiä tietokantajärjestelmiä, joihin tutustumme tällä kurssilla.

Tietokantajärjestelmien kehittäjät ovat miettineet tarkasti, miten järjestelmä kannattaa toteuttaa, jotta tietoon pääsee käsiksi tehokkaasti, samanaikaiset käyttäjät eivät aiheuta ongelmia eikä tietoa katoa yllättävissä tilanteissa. Kun käytämme tietokantajärjestelmää, meidän ei tarvitse huolehtia tästä kaikesta itse.

## Relaatiomalli ja SQL-kieli

Tällä kurssilla tutustumme tietokantoihin relaatiomallin ja SQL-kielen kautta. Relaatiomallin ytimessä on kaksi perusideaa:

1. Kaikki tieto tallennetaan tauluihin riveinä, jotka voivat viitata toisiinsa.
2. Tietokannan käyttäjä käsittelee tietoa SQL-kielellä, joka kätkee käyttäjältä tietokannan sisäisen toiminnan yksityiskohdat.

### Tietokannan rakenne

Relaatiomallissa tietokanta muodostuu _tauluista_ (_table_), joissa on kiinteät _sarakkeet_ (_column_). Tauluihin tallennetaan tietoa _riveinä_ (_row_), joilla on tietyt arvot sarakkeissa. Jokaisessa taulussa on kokoelma tiettyyn asiaan liittyvää tietoa.

Seuraavassa kuvassa on esimerkki tietokannasta, jota voisi käyttää osana verkkokaupan toteutusta. Tauluissa `Tuotteet`, `Asiakkaat` ja `Ostokset` on tietoa tuotteista, asiakkaista ja heidän ostoskoriensa sisällöstä.

{% include example.md %}

Tauluissa `Tuotteet` ja `Asiakkaat` jokaisella rivillä on yksilöllinen id-numero, jonka avulla niihin voi viitata. Tämä on yleinen tapa tietokantojen suunnittelussa. Tämän ansiosta taulussa `Ostokset` voidaan esittää id-numeroiden avulla, mitä tuotteita kukin asiakas on valinnut. Tässä esimerkissä Uolevin korissa on porkkana ja selleri ja Maijan korissa on retiisi, lanttu ja selleri.

### SQL-kieli

_SQL_ (_Structured Query Language_) on vakiintunut tapa käsitellä tietokannan sisältöä.
Kielessä on komentoja, joiden avulla tietokannan käyttäjä (esimerkiksi tietokantaa käyttävä ohjelmoija) voi lisätä, hakea, muuttaa ja poistaa tietoa.

SQL-komennot muodostuvat avainsanoista (kuten `SELECT` ja `WHERE`), taulujen ja sarakkeiden nimistä sekä muista arvoista. Esimerkiksi komento

```sql
SELECT hinta FROM Tuotteet WHERE nimi='retiisi';
```

hakee tietokannan tuotteista retiisin hinnan. Komentojen lopussa on puolipiste `;` ja voimme käyttää välilyöntejä ja rivinvaihtoja haluamallamme tavalla. Esimerkiksi voisimme kirjoittaa äskeisen komennon myös näin usealle riville:

```sql
SELECT
  hinta
FROM
  Tuotteet
WHERE
  nimi='retiisi';
```

Tutustumme SQL-kieleen tarkemmin materiaalin luvuissa 2–4.

SQL-kieli syntyi 1970-luvulla, ja siinä on paljon muistumia _vanhan ajan ohjelmoinnista_.
Tällaisia piirteitä ovat esimerkiksi:

- Avainsanat ovat kokonaisia englannin kielen sanoja, ja komennot muistuttavat englannin kielen lauseita.
- Avainsanoissa kirjainkoolla ei ole väliä. Esimerkiksi `SELECT`, `select` ja `Select` tarkoittavat samaa. Avainsanat on tapana kirjoittaa kokonaan suurilla kirjaimilla.
- Merkki `=` tarkoittaa sekä asetusta että yhtäsuuruusvertailua (nykyään ohjelmoinnissa yhtäsuuruusvertailu on yleensä `==`).

SQL-kielestä on olemassa _standardeja_, jotka pyrkivät antamaan yhteisen pohjan kielelle. Käytännössä jokainen SQL-kielen toteutus toimii kuitenkin hieman omalla tavallaan. Tällä kurssilla keskitymme SQL:n ominaisuuksiin, jotka ovat yleisesti käytettävissä eri tietokannoissa.

### Tietokannan sisäinen toiminta

Tietokantajärjestelmän tehtävänä on käsitellä käyttäjän antamat SQL-komennot. Esimerkiksi kun käyttäjä antaa komennon, joka hakee tietoa tietokannasta, tietokantajärjestelmän tulee löytää jokin hyvä tapa käsitellä komento ja toimittaa tulokset takaisin käyttäjälle mahdollisimman nopeasti.

SQL-kielen hienoutena on, että käyttäjän riittää _kuvailla_, mitä tietoa hän haluaa, minkä jälkeen tietokantajärjestelmä hoitaa likaisen työn ja hankkii tiedot tietokannan uumenista. Tämä on mukavaa käyttäjälle, koska hänen ei tarvitse tietää mitään tietokannan sisäisestä toiminnasta
vaan voi luottaa tietokantajärjestelmään.

Tietokantajärjestelmän toteuttaminen on vaikea tehtävä, koska järjestelmän täytyy sekä osata käsitellä tehokkaasti SQL-komentoja että huolehtia siitä, että kaikki toimii oikein samanaikaisilla käyttäjillä ja yllättävissä tilanteissa. Tällä kurssilla tutustumme tietokantoihin lähinnä tietokannan käyttäjän näkökulmasta emmekä perehdy niiden sisäiseen toimintaan.
