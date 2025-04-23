# 🗂️ Gestion d'état (State Management) dans Angular

Dans les applications Angular complexes, la gestion de l’état devient un **enjeu central**. Elle permet de stocker, modifier et partager des données entre plusieurs composants de manière **prévisible**, **centralisée** et **réactive**.

---

## 📚 Sommaire

- [Pourquoi gérer l’état ?](#pourquoi-gérer-létat)
- [Méthode simple : services + BehaviorSubject](#méthode-simple--services--behaviorsubject)
- [NgRx : une solution inspirée de Redux](#ngrx--une-solution-inspirée-de-redux)
- [Elf : une alternative moderne et légère](#elf--une-alternative-moderne-et-légère)
- [Comparatif rapide](#comparatif-rapide)
- [Conclusion](#conclusion)

---

## Pourquoi gérer l’état ?

- Centraliser les données partagées entre composants
- Faciliter la synchronisation UI/données
- Permettre le debug et la reproductibilité (devtools, logs)
- Simplifier les effets secondaires (API, navigation…)

---

## Méthode simple : services + BehaviorSubject

C’est la méthode **native Angular**, idéale pour des cas simples ou moyens.

### Exemple :

```ts
@Injectable({ providedIn: 'root' })
export class CounterService {
  private counter = new BehaviorSubject<number>(0);
  counter$ = this.counter.asObservable();

  increment() {
    this.counter.next(this.counter.value + 1);
  }
}
```

Dans le composant :

```ts
export class CounterComponent {
  counter$ = this.counterService.counter$;

  constructor(private counterService: CounterService) {}

  onIncrement() {
    this.counterService.increment();
  }
}
```

✅ Simple, clair, efficace pour 80% des cas.

---

## NgRx : une solution inspirée de Redux

NgRx est basé sur les concepts de Redux : **store**, **actions**, **reducers**, **selectors**, **effects**.

### Caractéristiques :

- Architecture très structurée
- Historique d’état (Time travel debugging)
- Intégration forte avec RxJS
- Très bon pour les grandes équipes / projets complexes

### Exemple rapide :

```ts
// counter.actions.ts
export const increment = createAction('[Counter] Increment');

// counter.reducer.ts
export const counterReducer = createReducer(0,
  on(increment, state => state + 1)
);
```

```ts
// counter.component.ts
store.dispatch(increment());
store.select('counter').subscribe(value => console.log(value));
```

📦 Installer :

```bash
ng add @ngrx/store
```

---

## Elf : une alternative moderne et légère ![elf](../images/elf.png)

[Elf](https://github.com/ngneat/elf) est une bibliothèque de gestion d’état réactive, **inspirée par Akita** mais plus moderne, légère et maintenue par les créateurs de `ngneat`.



### Avantages :

✅  Modular by design
✅  Tree Shakeable & Fully Typed
✅  CLI
✅  First Class Entities Support
✅  Requests Status & Cache
✅  Persist State
✅  State History
✅  Pagination
✅  Devtools

📦 Installer :

```bash
npm install @ngneat/elf
```

### Exemple :

```ts
import { Store, withProps } from '@ngneat/elf';

interface CounterState {
  count: number;
}

export const counterStore = new Store({ name: 'counter' }, withProps<CounterState>({ count: 0 }));

export const increment = () => {
  counterStore.update(state => ({ count: state.count + 1 }));
};

export const counter$ = counterStore.pipe(select(state => state.count));
```

---

## Comparatif rapide

| Solution                  | Simplicité | Puissance | Idéal pour                    |
|---------------------------|------------|-----------|-------------------------------|
| Services + RxJS           | ✅✅✅       | ✅         | Projets simples à moyens      |
| NgRx                      | ❌          | ✅✅✅     | Projets complexes / équipe    |
| Elf                       | ✅✅        | ✅✅       | Projets moyens à grands       |

---

## Conclusion

- Pour démarrer : services + RxJS suffisent dans la plupart des cas.
- Pour des projets plus grands ou en équipe : NgRx apporte une architecture solide.
- Pour une approche moderne et fluide : Elf est une alternative puissante et légère.

💡 Conseil : choisis une solution adaptée à la **taille de ton application**, à ton **équipe** et à ton **niveau de complexité**.

---