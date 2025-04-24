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


```TypeScript
// Composant
export class PipesExampleComponent {
  today = new Date();
  name = 'Angular';
  title = 'angular framework';
  price = 42.99;
  value = 1234.5678;
  ratio = 0.2345;
  user = { name: 'John', age: 30, role: 'Developer' };
  list = ['a', 'b', 'c', 'd', 'e'];
  messages = ['Message 1', 'Message 2'];
  gender = 'male';
}
```

```html

<!-- Template -->
<h2>Pipes intégrés d'Angular</h2>

<table class="pipe-examples">
  <tr>
    <th>Pipe</th>
    <th>Expression</th>
    <th>Résultat</th>
  </tr>
  <tr>
    <td>date</td>
    <td>{{ "{{ today | date:'dd/MM/yyyy' }}" }}</td>
    <td>24/04/2025</td>
  </tr>
  <tr>
    <td>uppercase</td>
    <td>{{ "{{ name | uppercase }}" }}</td>
    <td>ANGULAR</td>
  </tr>
  <tr>
    <td>lowercase</td>
    <td>{{ "{{ name | lowercase }}" }}</td>
    <td>angular</td>
  </tr>
  <tr>
    <td>titlecase</td>
    <td>{{ "{{ title | titlecase }}" }}</td>
    <td>Angular Framework</td>
  </tr>
  <tr>
    <td>currency</td>
    <td>{{ "{{ price | currency:'EUR' }}" }}</td>
    <td>€42.99</td>
  </tr>
  <tr>
    <td>number</td>
    <td>{{ "{{ value | number:'1.2-2' }}" }}</td>
    <td>1,234.57</td>
  </tr>
  <tr>
    <td>percent</td>
    <td>{{ "{{ ratio | percent:'2.2-2' }}" }}</td>
    <td>23.45%</td>
  </tr>
  <tr>
    <td>json</td>
    <td>{{ "{{ user | json }}" }}</td>
    <td>{ "name": "John", "age": 30, "role": "Developer" }</td>
  </tr>
  <tr>
    <td>slice</td>
    <td>{{ "{{ list | slice:1:3 }}" }}</td>
    <td>["b", "c"]</td>
  </tr>
  <tr>
    <td>i18nSelect</td>
    <td>{{ "{{ gender | i18nSelect: {'male': 'Monsieur', 'female': 'Madame'} }}" }}</td>
    <td>Monsieur</td>
  </tr>
</table>
```
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
