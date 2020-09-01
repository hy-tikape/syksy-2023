---
title: SQLite Javassa
hidden: true
---

# SQLite Javassa

Voimme käyttää Javassa SQLite-tietokantaa lataamalla
sopivan JDBC-ajurin netistä.
Tämä sivu kertoo perusasiat SQLite-tietokannan käyttämisestä Javalla,
ja voit halutessasi etsiä lisätietoa netistä ja Javan dokumentaatiosta.

## Esimerkki

Seuraava koodi käyttää tietokantaa, joka on tiedostossa `testi.db`.
Koodi luo taulun `Tuotteet` ja lisää sinne viisi riviä.
Tämän jälkeen koodi hakee ja näyttää taulun rivit.

```java
import java.sql.*;

public class Testi {
    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:sqlite:testi.db");
        Statement s = db.createStatement();
        s.execute("CREATE TABLE Tuotteet (id INTEGER PRIMARY KEY, nimi TEXT, hinta INTEGER)");
        s.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('retiisi',7)");
        s.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('porkkana',5)");
        s.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('nauris',4)");
        s.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('lanttu',8)");
        s.execute("INSERT INTO Tuotteet (nimi,hinta) VALUES ('selleri',4)");

        ResultSet r = s.executeQuery("SELECT * FROM Tuotteet");
        while (r.next()) {
            System.out.println(r.getInt("id")+" "+r.getString("nimi")+" "+r.getInt("hinta"));
        }
    }
}
```

Koodin tulostus on seuraava:

```
1 retiisi 7
2 porkkana 5
3 nauris 4
4 lanttu 8
5 selleri 4
```

Koodi tarvitsee toimiakseen JDBC-ajurin, joka osaa muodostaa yhteyden SQLite-tietokantaan.
Saat ladattua tarvittavan ajurin koneellesi [tästä](https://bitbucket.org/xerial/sqlite-jdbc/downloads/).
Oletamme seuraavaksi, että ajuritiedosto on `sqlite-jdbc-3.30.1.jar`
(voit ladata myös mahdollisen uudemman version ajurista).

Voit kääntää ja suorittaa yllä olevan koodin Linux-ympäristössä näin
(kun tiedostot ovat siinä hakemistossa, jossa suoritat komennot):

```prompt
$ javac Testi.java
$ java -classpath ":sqlite-jdbc-3.30.1.jar" Testi
1 retiisi 7
2 porkkana 5
3 nauris 4
4 lanttu 8
5 selleri 4
```

Jos käytät Windowsia, kirjoita kaksoispisteen `:`
sijasta puolipiste `;` toiseen komentoon.

Jos teet projektin NetBeansissa,
voit tehdä tavallisen Java-ohjelman ja sitten liittää
sen osaksi yllä mainitun JDBC-ajurin.
Tämä onnistuu painamalla oikealla hiiren näppäimellä
kohdasta _Libraries_ ja valitsemalla _Add JAR/Folder_.
Jos et löydä kohtaa _Libraries_,
kokeile luoda projekti uudestaan niin,
että sen tyyppinä on "Ant" eikä "Maven".

Huomaa, että jos suoritat koodin uudestaan,
tapahtuu virhe, koska taulu `Tuotteet` on jo tietokannassa mutta
ohjelma yrittää luoda sen uudestaan.
Voit aina halutessasi nollata tietokannan sisällön
poistamalla tiedoston `testi.db`.

## Tiedon hakeminen käyttäjänä

Seuraava koodi näyttää esimerkin, jossa käyttäjä pystyy
hakemaan tietoa tietokannasta, jossa on valmiina taulu `Tuotteet`:

```java
import java.sql.*;
import java.util.*;

public class Testi {
    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:sqlite:testi.db");
        
        Scanner input = new Scanner(System.in);
        System.out.println("Anna tuotteen nimi:");
        String nimi = input.nextLine();

        PreparedStatement p = db.prepareStatement("SELECT hinta FROM Tuotteet WHERE nimi=?");
        p.setString(1,nimi);

        ResultSet r = p.executeQuery();
        if (r.next()) {
            System.out.println("Hinta: "+r.getInt("hinta"));
        } else {
            System.out.println("Tuotetta ei löytynyt");
        }
    }
}
```

Tässä on käytössä _parametrisoitu_ kysely,
jossa on käyttäjän antaman tiedon kohdalla `?` ja
tieto annetaan erikseen metodilla `setString`.
Metodi asettaa kyselyn parametriksi 1 (eli ainoaksi parametriksi)
annetun merkkijonon.

Tässä on esimerkkejä koodin toiminnasta:

```prompt
Anna tuotteen nimi:
selleri
Hinta: 4
```

```prompt
Anna tuotteen nimi:
banaani
Tuotetta ei löytynyt
```

Parametrisoitu kysely on turvallinen tapa yhdistää käyttäjän
antamaa tietoa kyselyyn,
koska tällöin käyttäjän antama tieto ei sekoitu SQL-komentoihin.
Sen sijaan vaarallinen tapa olisi yhdistää käyttäjän antama
tieto suoraan kyselyyn:

```java
ResultSet r = s.executeQuery("SELECT hinta FROM Tuotteet WHERE nimi='"+nimi"'");
```

Nyt käyttäjä voisi antaa vaikka seuraavan tuotteen "nimen":

```prompt
Anna tuotteen nimi:
' OR id=1 OR nimi='
Hinta: 7
```

Tämä tuottaa kyselyn `SELECT hinta FROM Tuotteet WHERE nimi='' OR id=1 OR nimi=''`,
joka hakeekin tietokannasta tuotteen, jonka id on 1.
Käyttäjä voisi siis koettaa hakea tietoa, johon hänellä ei kuuluisi olla pääsyä.

Tällaisesta kyselyn rakennetta muuttavasta käyttäjän antamasta
tiedosta käytetään nimeä _SQL-injektio_.
Tämä oli etenkin takavuosina tavallinen tapa murtautua
huonosti toteutettuihin nettisivustoihin.

## Tiedon muuttaminen käyttäjänä

Tässä on vielä esimerkki, jossa käyttäjä pystyy lisäämään tuotteen:

```java
import java.sql.*;
import java.util.*;

public class Testi {
    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:sqlite:testi.db");

        Scanner input = new Scanner(System.in);
        System.out.println("Anna tuotteen nimi:");
        String nimi = input.nextLine();
        System.out.println("Anna tuotteen hinta:");
        int hinta = Integer.parseInt(input.nextLine());

        PreparedStatement p = db.prepareStatement("INSERT INTO Tuotteet(nimi,hinta) VALUES (?,?)");
        p.setString(1,nimi);
        p.setInt(2,hinta);

        p.executeUpdate();
        System.out.println("Tuote lisätty");
    }
}
```

Kuten tiedon hakemisessa, turvallinen tapa toteuttaa komento on
käyttää parametrisoitua komentoa.
Tässä tapauksessa annamme komennolle kaksi parametria:
tuotteen nimi ja hinta.

Koodin suoritus voi näyttää seuraavalta:

```prompt
Anna tuotteen nimi:
banaani
Anna tuotteen hinta:
3
Tuote lisätty
```

Joskus haluamme rivin lisäyksen jälkeen selvittää,
minkä id:n uusi lisätty rivi sai. Tämä onnistuu laajentamalla koodia seuraavasti:

```java
import java.sql.*;
import java.util.*;

public class Testi {
    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:sqlite:testi.db");

        Scanner input = new Scanner(System.in);
        System.out.println("Anna tuotteen nimi:");
        String nimi = input.nextLine();
        System.out.println("Anna tuotteen hinta:");
        int hinta = Integer.parseInt(input.nextLine());

        PreparedStatement p = db.prepareStatement("INSERT INTO Tuotteet(nimi,hinta) VALUES (?,?)",
                                                  Statement.RETURN_GENERATED_KEYS);
        p.setString(1,nimi);
        p.setInt(2,hinta);

        p.executeUpdate();
        ResultSet g = p.getGeneratedKeys();
        g.next();
        System.out.println("Tuote lisätty id:llä "+g.getInt(1));
    }
}
```

Nyt koodin suoritus voisi näyttää tältä:

```prompt
Anna tuotteen nimi:
banaani
Anna tuotteen hinta:
3
Tuote lisätty id:llä 6
```

## Virheenkäsittely

Jos kyselyssä tapahtuu virhe, niin tämä keskeyttää ohjelman suorituksen.
Näin käy seuraavassa ohjelmassa, jos taulua `Kurssit` ei ole olemassa:

```java
import java.sql.*;

public class Testi {
    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:sqlite:testi.db");
        Statement s = db.createStatement();

        ResultSet r = s.executeQuery("SELECT * FROM Kurssit");
    }
}
```

Tässä tapauksessa ohjelma päättyy seuraavaan virheeseen:

```
Exception in thread "main" org.sqlite.SQLiteException: [SQLITE_ERROR] SQL error or missing database (no such table: Kurssit)
	at org.sqlite.core.DB.newSQLException(DB.java:941)
	at org.sqlite.core.DB.newSQLException(DB.java:953)
	at org.sqlite.core.DB.throwex(DB.java:918)
	at org.sqlite.core.NativeDB.prepare_utf8(Native Method)
	at org.sqlite.core.NativeDB.prepare(NativeDB.java:134)
	at org.sqlite.core.DB.prepare(DB.java:257)
	at org.sqlite.jdbc3.JDBC3Statement.executeQuery(JDBC3Statement.java:73)
	at Testi.main(Testi.java:8)
```

Tällä hetkellä metodin `main` alussa lukee `throws SQLException`,
mikä tarkoittaa, että mahdolliset SQL-poikkeukset heitetään eteenpäin.
Koska olemme metodissa `main`, niin kukaan muukaan ei käsittele poikkeuksia
ja ohjelman suoritus keskeytyy.

Voimme kuitenkin halutessamme varautua virheeseen `try`-rakenteen
avulla vaikkapa näin:

```java
import java.sql.*;

public class Testi {
    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:sqlite:testi.db");
        Statement s = db.createStatement();

        try {
            ResultSet r = s.executeQuery("SELECT * FROM Kurssit");
        } catch (SQLException e) {
            System.out.println("Kysely ei onnistunut");
        }
    }
}
```

Nyt virhetilanteessa ohjelma tulostaa viestin ja jatkaa toimintaansa.
