# Formulaires dans Angular

## Introduction

La gestion des formulaires est un élément essentiel de toute application web interactive. Angular propose deux approches distinctes pour gérer les formulaires : les formulaires basés sur le template (Template-driven forms) et les formulaires réactifs (Reactive forms). Chaque approche répond à des besoins différents et offre ses propres avantages. Ce chapitre explore en détail ces deux méthodes, leurs caractéristiques, et les cas d'utilisation appropriés.

## Les Deux Approches de Formulaires

| Caractéristique | Template-driven Forms | Reactive Forms |
|-----------------|----------------------|---------------|
| Configuration | Principalement dans le HTML | Principalement dans le TypeScript |
| Complexité | Simple, plus intuitif | Plus complexe, mais plus puissant |
| Validation | Directives dans le template | Méthodes et validateurs dans le code |
| État du formulaire | Asynchrone | Synchrone |
| Module requis | FormsModule | ReactiveFormsModule |
| Cas d'utilisation | Formulaires simples, peu de validation | Formulaires complexes, validation avancée |

## Template-driven Forms

Les formulaires basés sur le template utilisent des directives dans le HTML pour construire et valider les formulaires. Cette approche est plus intuitive pour les développeurs qui préfèrent travailler principalement avec des templates.

### Configuration de Base

Pour utiliser les formulaires basés sur le template, vous devez d'abord importer le `FormsModule` dans votre module Angular :

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // Autres imports...
    FormsModule
  ],
  // ...
})
export class AppModule { }
```

### Création d'un Formulaire Simple

```html
<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm.value)">
  <div>
    <label for="name">Nom</label>
    <input type="text" id="name" name="name" [(ngModel)]="user.name" required>
  </div>
  
  <div>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" [(ngModel)]="user.email" required email>
  </div>
  
  <button type="submit" [disabled]="!userForm.valid">Envoyer</button>
</form>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  user = {
    name: '',
    email: ''
  };

  onSubmit(formValue: any): void {
    console.log('Formulaire soumis avec les valeurs :', formValue);
    // Traitement des données du formulaire...
  }
}
```

### Validation dans les Template-driven Forms

Angular fournit plusieurs directives de validation à utiliser directement dans les templates :

```html
<input type="text" id="name" name="name" 
       [(ngModel)]="user.name" 
       #nameInput="ngModel"
       required 
       minlength="3" 
       maxlength="50">

<div *ngIf="nameInput.invalid && (nameInput.dirty || nameInput.touched)">
  <div *ngIf="nameInput.errors?.['required']">
    Le nom est obligatoire.
  </div>
  <div *ngIf="nameInput.errors?.['minlength']">
    Le nom doit contenir au moins 3 caractères.
  </div>
  <div *ngIf="nameInput.errors?.['maxlength']">
    Le nom ne peut pas dépasser 50 caractères.
  </div>
</div>
```

### Gestion de l'État du Formulaire

Les formulaires Angular suivent plusieurs états :
- `pristine` / `dirty` : Le formulaire a-t-il été modifié ?
- `untouched` / `touched` : Un champ a-t-il perdu le focus après interaction ?
- `valid` / `invalid` : Les données du formulaire sont-elles valides ?

```html
<div *ngIf="userForm.submitted">
  <div *ngIf="userForm.valid">Formulaire envoyé avec succès!</div>
  <div *ngIf="userForm.invalid">Veuillez corriger les erreurs.</div>
</div>

<button type="submit" [disabled]="userForm.invalid || userForm.pristine">
  Envoyer
</button>
```

### Groupement de Champs

Vous pouvez regrouper des champs connexes à l'aide de la directive `ngModelGroup` :

```html
<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm.value)">
  <div ngModelGroup="personalInfo">
    <input type="text" name="firstName" [(ngModel)]="user.firstName" required>
    <input type="text" name="lastName" [(ngModel)]="user.lastName" required>
  </div>
  
  <div ngModelGroup="contactInfo">
    <input type="email" name="email" [(ngModel)]="user.email" required>
    <input type="tel" name="phone" [(ngModel)]="user.phone">
  </div>
  
  <button type="submit">Envoyer</button>
</form>
```

## Reactive Forms

Les formulaires réactifs offrent une approche basée sur le code plutôt que sur le template. Ils sont construits autour des observables RxJS et permettent une gestion plus robuste des formulaires complexes.

### Configuration de Base

Pour utiliser les formulaires réactifs, importez `ReactiveFormsModule` dans votre module :

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // Autres imports...
    ReactiveFormsModule
  ],
  // ...
})
export class AppModule { }
```

### Création d'un Formulaire Réactif

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-user-form',
  templateUrl: './reactive-user-form.component.html'
})
export class ReactiveUserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
      })
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Formulaire valide :', this.userForm.value);
      // Traitement des données...
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.userForm);
    }
  }

  // Utilitaire pour marquer tous les contrôles comme touchés
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
```

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Nom</label>
    <input id="name" type="text" formControlName="name">
    <div *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
      <div *ngIf="userForm.get('name')?.errors?.['required']">Le nom est obligatoire.</div>
      <div *ngIf="userForm.get('name')?.errors?.['minlength']">
        Le nom doit contenir au moins {{ userForm.get('name')?.errors?.['minlength'].requiredLength }} caractères.
      </div>
    </div>
  </div>
  
  <div>
    <label for="email">Email</label>
    <input id="email" type="email" formControlName="email">
    <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
      <div *ngIf="userForm.get('email')?.errors?.['required']">L'email est obligatoire.</div>
      <div *ngIf="userForm.get('email')?.errors?.['email']">
        Veuillez entrer une adresse email valide.
      </div>
    </div>
  </div>
  
  <div formGroupName="address">
    <h3>Adresse</h3>
    
    <div>
      <label for="street">Rue</label>
      <input id="street" type="text" formControlName="street">
    </div>
    
    <div>
      <label for="city">Ville</label>
      <input id="city" type="text" formControlName="city">
    </div>
    
    <div>
      <label for="zipCode">Code Postal</label>
      <input id="zipCode" type="text" formControlName="zipCode">
    </div>
  </div>
  
  <button type="submit" [disabled]="userForm.invalid">Envoyer</button>
</form>
```

### Contrôles de Formulaire

Angular propose différents types de contrôles pour les formulaires réactifs :

- `FormControl` : Un contrôle individuel, comme un champ de saisie.
- `FormGroup` : Un groupe de contrôles, comme un formulaire complet ou une section.
- `FormArray` : Un tableau dynamique de contrôles, utile pour les listes d'éléments.

#### Exemple de FormArray

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html'
})
export class SkillsFormComponent implements OnInit {
  skillsForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.skillsForm = this.fb.group({
      userName: ['', Validators.required],
      skills: this.fb.array([])
    });
  }

  get skills(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  addSkill(): void {
    const skillGroup = this.fb.group({
      name: ['', Validators.required],
      level: ['beginner', Validators.required],
      yearsExperience: [0, [Validators.required, Validators.min(0)]]
    });
    
    this.skills.push(skillGroup);
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onSubmit(): void {
    if (this.skillsForm.valid) {
      console.log(this.skillsForm.value);
    }
  }
}
```

```html
<form [formGroup]="skillsForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="userName">Nom d'utilisateur</label>
    <input id="userName" formControlName="userName">
  </div>
  
  <h3>Compétences</h3>
  <button type="button" (click)="addSkill()">Ajouter une compétence</button>
  
  <div formArrayName="skills">
    <div *ngFor="let skill of skills.controls; let i = index" [formGroupName]="i">
      <div>
        <label [for]="'skillName' + i">Nom de la compétence</label>
        <input [id]="'skillName' + i" formControlName="name">
      </div>
      
      <div>
        <label [for]="'skillLevel' + i">Niveau</label>
        <select [id]="'skillLevel' + i" formControlName="level">
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      
      <div>
        <label [for]="'yearsExperience' + i">Années d'expérience</label>
        <input [id]="'yearsExperience' + i" type="number" formControlName="yearsExperience">
      </div>
      
      <button type="button" (click)="removeSkill(i)">Supprimer</button>
    </div>
  </div>
  
  <button type="submit" [disabled]="!skillsForm.valid">Enregistrer</button>
</form>
```

### Validation Personnalisée

Les formulaires réactifs permettent d'implémenter facilement des validateurs personnalisés :

```typescript
// Validateur de fonction simple
function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) {
    return null;
  }
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
  
  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
  
  return !passwordValid ? { 'passwordStrength': true } : null;
}

// Validateur de classe avec dépendances
@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator {
  constructor(private userService: UserService) {}
  
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.checkUsernameExists(control.value).pipe(
      map(exists => (exists ? { 'usernameExists': true } : null)),
      catchError(() => of(null))
    );
  }
}

// Utilisation
this.registerForm = this.fb.group({
  username: ['', {
    validators: [Validators.required],
    asyncValidators: [this.uniqueUsernameValidator.validate.bind(this.uniqueUsernameValidator)],
    updateOn: 'blur'
  }],
  password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator]]
});
```

### Validation Inter-champs

Pour valider la relation entre différents champs :

```typescript
// Validateur pour vérifier que les mots de passe correspondent
function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  
  return password === confirmPassword ? null : { 'passwordMismatch': true };
}

// Utilisation
this.registerForm = this.fb.group({
  name: ['', Validators.required],
  passwordGroup: this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator })
});
```

### Réagir aux Changements

Les formulaires réactifs permettent de réagir aux changements avec des observables :

```typescript
ngOnInit(): void {
  this.userForm = this.fb.group({
    userType: ['individual'],
    individualName: [''],
    companyName: [''],
    companyRegNumber: ['']
  });
  
  // Réagir aux changements de type d'utilisateur
  this.userForm.get('userType')?.valueChanges.subscribe(value => {
    if (value === 'individual') {
      this.userForm.get('individualName')?.setValidators(Validators.required);
      this.userForm.get('companyName')?.clearValidators();
      this.userForm.get('companyRegNumber')?.clearValidators();
    } else {
      this.userForm.get('individualName')?.clearValidators();
      this.userForm.get('companyName')?.setValidators(Validators.required);
      this.userForm.get('companyRegNumber')?.setValidators([
        Validators.required, 
        Validators.pattern(/^\d{10}$/)
      ]);
    }
    
    // N'oubliez pas de mettre à jour les contrôles après avoir modifié les validateurs
    this.userForm.get('individualName')?.updateValueAndValidity();
    this.userForm.get('companyName')?.updateValueAndValidity();
    this.userForm.get('companyRegNumber')?.updateValueAndValidity();
  });
}
```

## Quand Utiliser Chaque Approche ?

### Template-driven Forms

Idéal pour :
- Formulaires simples et directs
- Petites applications
- Équipes plus habituées au HTML qu'au TypeScript
- Prototypage rapide
- Besoins de validation limités

### Reactive Forms

Idéal pour :
- Formulaires complexes avec validation avancée
- Logique métier complexe
- Formulaires dynamiques (champs qui apparaissent/disparaissent)
- Validation inter-champs
- Besoins de tests unitaires approfondis
- Applications à grande échelle
- Contrôle précis sur le timing des validations

## Bonnes Pratiques

1. **Séparer la logique de présentation** : Pour les formulaires réactifs, gardez la définition du formulaire dans le composant et l'affichage dans le template.

2. **Utiliser FormBuilder** : Au lieu de créer manuellement des instances de FormGroup et FormControl, utilisez le service FormBuilder pour un code plus concis.

3. **Valider au bon moment** : Utilisez l'option `updateOn` pour contrôler quand les validations sont déclenchées ('change', 'blur', ou 'submit').

4. **Désactiver la validation HTML5 native** : Ajoutez `novalidate` à votre élément form pour éviter la double validation.

5. **Créer des composants de formulaire réutilisables** : Pour les grands projets, envisagez de créer des composants réutilisables pour les éléments de formulaire courants.

6. **Gérer correctement les soumissions** : Désactivez le bouton de soumission si le formulaire est invalide et évitez les soumissions multiples.

## Conclusion

Angular offre deux approches complémentaires pour la gestion des formulaires, répondant à différents besoins et niveaux de complexité. Les formulaires basés sur le template sont parfaits pour les cas simples, tandis que les formulaires réactifs excellent dans les scénarios complexes nécessitant une validation avancée et une logique métier sophistiquée.

Le choix entre ces deux approches dépend des besoins spécifiques de votre application, de la complexité des formulaires, et des préférences de votre équipe. Dans les applications réelles, il est courant d'utiliser les deux approches selon les besoins de chaque formulaire.
