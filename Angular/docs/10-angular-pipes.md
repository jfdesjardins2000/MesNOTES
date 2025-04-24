# 🔧 Pipes dans Angular

Les **pipes** permettent de transformer les données dans les templates Angular avant de les afficher à l’écran. Ils sont très utiles pour formater du texte, des dates, des monnaies ou encore manipuler des listes.

---

## 📚 Sommaire

- [Qu’est-ce qu’un pipe ?](#quest-ce-quun-pipe)
- [Utilisation des pipes intégrés](#utilisation-des-pipes-intégrés)
- [Chainer plusieurs pipes](#chainer-plusieurs-pipes)
- [Créer un pipe personnalisé](#créer-un-pipe-personnalisé)
- [Pipe pur vs pipe impur](#pipe-pur-vs-pipe-impur)
- [Conclusion](#conclusion)

---

## Qu’est-ce qu’un pipe ?

Un **pipe** est une fonction qui prend une valeur d’entrée, la transforme, et retourne une nouvelle valeur.  
On les utilise dans les templates HTML avec le symbole `|`.

```html
<p>{{ user.name | uppercase }}</p>
```

---

## Utilisation des [Built-in Pipes](https://angular.dev/guide/templates/pipes#built-in-pipes) 

Angular fournit plusieurs **pipes intégrés** très utiles :

| Pipe        | Description                         | Exemple d'utilisation           |
|-------------|-------------------------------------|----------------------------------|
| `date`      | Formate les dates                   | {{ today | date:'longDate' }} |
| `uppercase` | Transforme en majuscules            | `{{ name | uppercase }}`        |
| `lowercase` | Transforme en minuscules            | `{{ name | lowercase }}`        |
| `currency`  | Affiche une valeur monétaire        | `{{ price | currency:'CAD' }}`  |
| `json`      | Affiche un objet sous forme JSON    | `{{ user | json }}`             |
| `slice`     | Découpe une chaîne ou un tableau    | `{{ list | slice:1:3 }}`        |

---

## Chainer plusieurs pipes

Les pipes peuvent être **enchaînés** :

```html
<p>{{ user.name | lowercase | titlecase }}</p>
```

Cela applique successivement les transformations.

---

## Créer un pipe personnalisé

Générer un pipe avec Angular CLI :

```bash
ng generate pipe shorten
```

Exemple de pipe qui raccourcit un texte :

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit: number = 10): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
```

Utilisation :

```html
<p>{{ longText | shorten:20 }}</p>
```

---

## Pipe pur vs pipe impur

- **Pipe pur (par défaut)** : exécuté uniquement si l'entrée change.
- **Pipe impur** : exécuté à chaque détection de changement. À utiliser avec prudence car plus coûteux.

```ts
@Pipe({
  name: 'custom',
  pure: false
})
```

---

## Conclusion

Les **pipes Angular** sont un moyen puissant de rendre les templates plus lisibles et maintenables.

✅ Utilise les pipes intégrés pour les cas simples  
🛠️ Crée des pipes personnalisés pour les besoins spécifiques
