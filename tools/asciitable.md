# Table ASCII des caractères utiles en programmation

## Caractères de contrôle (0-31)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 0   | 00  | 000 | NUL  | Null                         |
| 8   | 08  | 010 | BS   | Backspace                    |
| 9   | 09  | 011 | HT   | Tabulation horizontale       |
| 10  | 0A  | 012 | LF   | Saut de ligne                |
| 13  | 0D  | 015 | CR   | Retour chariot               |
| 27  | 1B  | 033 | ESC  | Échappement                  |

## Caractères imprimables ASCII (32-126)

### Symboles et ponctuation (32-47)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 32  | 20  | 040 | ' '  | Espace                       |
| 33  | 21  | 041 | !    | Point d'exclamation          |
| 34  | 22  | 042 | "    | Guillemet double             |
| 35  | 23  | 043 | #    | Dièse (hashtag)              |
| 36  | 24  | 044 | $    | Dollar                       |
| 37  | 25  | 045 | %    | Pourcentage                  |
| 38  | 26  | 046 | &    | Esperluette                  |
| 39  | 27  | 047 | '    | Apostrophe                   |
| 40  | 28  | 050 | (    | Parenthèse ouvrante          |
| 41  | 29  | 051 | )    | Parenthèse fermante          |
| 42  | 2A  | 052 | *    | Astérisque                   |
| 43  | 2B  | 053 | +    | Plus                         |
| 44  | 2C  | 054 | ,    | Virgule                      |
| 45  | 2D  | 055 | -    | Moins/tiret                  |
| 46  | 2E  | 056 | .    | Point                        |
| 47  | 2F  | 057 | /    | Barre oblique                |

### Chiffres (48-57)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 48  | 30  | 060 | 0    | Chiffre zéro                 |
| 49  | 31  | 061 | 1    | Chiffre un                   |
| 50  | 32  | 062 | 2    | Chiffre deux                 |
| 51  | 33  | 063 | 3    | Chiffre trois                |
| 52  | 34  | 064 | 4    | Chiffre quatre               |
| 53  | 35  | 065 | 5    | Chiffre cinq                 |
| 54  | 36  | 066 | 6    | Chiffre six                  |
| 55  | 37  | 067 | 7    | Chiffre sept                 |
| 56  | 38  | 070 | 8    | Chiffre huit                 |
| 57  | 39  | 071 | 9    | Chiffre neuf                 |

### Symboles de comparaison et autres (58-64)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 58  | 3A  | 072 | :    | Deux-points                  |
| 59  | 3B  | 073 | ;    | Point-virgule                |
| 60  | 3C  | 074 | <    | Inférieur à                  |
| 61  | 3D  | 075 | =    | Égal                         |
| 62  | 3E  | 076 | >    | Supérieur à                  |
| 63  | 3F  | 077 | ?    | Point d'interrogation        |
| 64  | 40  | 100 | @    | Arobase                      |

### Lettres majuscules (65-90)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 65  | 41  | 101 | A    | Lettre A majuscule           |
| 66  | 42  | 102 | B    | Lettre B majuscule           |
| ...jusqu'à... |
| 90  | 5A  | 132 | Z    | Lettre Z majuscule           |

### Symboles de programmation (91-96)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 91  | 5B  | 133 | [    | Crochet ouvrant              |
| 92  | 5C  | 134 | \    | Barre oblique inversée       |
| 93  | 5D  | 135 | ]    | Crochet fermant              |
| 94  | 5E  | 136 | ^    | Accent circonflexe           |
| 95  | 5F  | 137 | _    | Tiret bas                    |
| 96  | 60  | 140 | `    | Accent grave                 |

### Lettres minuscules (97-122)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 97  | 61  | 141 | a    | Lettre a minuscule           |
| 98  | 62  | 142 | b    | Lettre b minuscule           |
| ...jusqu'à... |
| 122 | 7A  | 172 | z    | Lettre z minuscule           |

### Symboles de programmation (123-126)

| Dec | Hex | Oct | Char | Description                  |
|-----|-----|-----|------|------------------------------|
| 123 | 7B  | 173 | {    | Accolade ouvrante            |
| 124 | 7C  | 174 | \|   | Barre verticale              |
| 125 | 7D  | 175 | }    | Accolade fermante            |
| 126 | 7E  | 176 | ~    | Tilde                        |

## Séquences d'échappement courantes en programmation

| Séquence | Description                     |
|----------|---------------------------------|
| \\n      | Saut de ligne                   |
| \\r      | Retour chariot                  |
| \\t      | Tabulation horizontale          |
| \\b      | Retour arrière                  |
| \\'      | Apostrophe                      |
| \\"      | Guillemet double                |
| \\\\     | Barre oblique inversée          |
| \\0      | Caractère nul                   |
| \\xhh    | Caractère hexadécimal (hh)      |
| \\uhhhh  | Caractère Unicode (hhhh)        |

## Caractères spéciaux utilisés en regex

| Caractère | Description dans les expressions régulières      |
|-----------|--------------------------------------------------|
| .         | N'importe quel caractère (sauf nouvelle ligne)   |
| ^         | Début de ligne/chaîne                            |
| $         | Fin de ligne/chaîne                              |
| *         | 0 ou plusieurs répétitions                       |
| +         | 1 ou plusieurs répétitions                       |
| ?         | 0 ou 1 répétition                                |
| \|        | Alternative (ou)                                 |
| ()        | Groupe de capture                                |
| []        | Classe de caractères                             |
| {}        | Quantificateur précis                            |
| \\        | Caractère d'échappement                          |