# Kurssisivupohja

## Käyttöönotto

Kloonaa repo tai ota template käyttöön githubissa. Templaten saa käyttöön klikkaamalla "Use this template" githubissa, jolloin githubissa voi luoda uuden repon, jossa on pohjana templaten tiedostot. Tämän jälkeen template repo pitää kuitenkin kloonata, jos haluaa tiedostot koneelle.

Mene paikallisesti sivun hakemistoon ja aja komento `bundle install`. Tämän jälkeen pohjan voi käynnistää paikallisesti komennolla `bundle exec jekyll serve --incremental`.

### _config.yml

Hakemiston juuressa on tiedosto nimeltä `_config.yml`. Muokkaa kurssin tiedot tiedostoon seuraavasti

* `title: Kurssin nimi` korvaa "Kurssin nimi" kurssin nimellä. Laita nimeen `&shy;` merkintä niihin kohtiin, josta teksti voidaan tavuttaa. Tämä saa kurssin nimen rivittymään tavuviivoineen oikein pienessä tilassa.
* `baseurl: "/course-template-light"` Korvaa "/course-template-light" repon nimellä, jossa kurssi sivu julkaistaan. 
* `url: "https://millakortelainen.github.io/course-template-light/"` Vaihda url osoite sivun osoitteeksi. Tämän saa yleensä sillä, että julkaiee sivun github pages:ssä. Käytännössä osoite on muotoa `https://<käyttäjä/organisaatio>.github.io/<repon-nimi>/`.

### Materiaali

Materiaali on jaettu kahteen osaan. Staattiset sivut, jossa voi olla tietoa kurssista on hakemistossa `_pages`. Kurssimateriaali on hakemistossa `_content`.

Jokaisen sivun alussa on "frontmatter", joka on merkitty viivojen sisälle

```jekyll
---
layout: default
nav-title: Etusivu
---
```

Se sisältää metatietoja siuvsta, jota voidaan käyttää sivun kääntämis vaiheessa.

#### _pages

Hakemisto staattisille. Lisää määre `hidden: true` frontmatteriin, jotta sivu ei tule näkyviin sivuvalikkoon. 

Sivut järjestetään valikkoon aakkosjärjestyksessä.
TODO: sivut järjestetään annetun arvon perusteella. 

#### _content

Kurssimateriaali on hakemistossa `_content`. 

### Github Action konfigurointi

Github Actions tarvitaan, jotta pluginit toimii.
