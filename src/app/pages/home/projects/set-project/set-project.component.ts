import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../core/services/firebase/auth.service';
import { AsyncPipe } from '@angular/common';
import { User } from '@angular/fire/auth';
import { FirestoreService } from '../../../../core/services/firebase/firestore.service';
import { FieldValue } from '@angular/fire/firestore';
import { Project } from '../../../../core/models/project.model';
import { serverTimestamp } from '@firebase/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-set-project',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './set-project.component.html',
  styles: `
  .contributor-form {
      display: flex;
      gap: 1rem;

      & > mat-form-field {
        flex: 2;
      }
    }
  `,
})
export class SetProjectComponent implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fs = inject(FirestoreService);
  readonly project = inject<Project<FieldValue> | undefined>(MAT_DIALOG_DATA);
  user$ = this.auth.user;

  ngOnInit(): void {
    if (this.project) {
      this.projectForm.patchValue(this.project);
      this.removeContributorControl(0);
      this.project.contributors?.forEach((c) => this.addContributorControl(c));
    }
  }

  projectForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    contributors: this.fb.array([this.contributorFormControl()]),
  });

  contributorFormControl(email?: string) {
    return this.fb.nonNullable.control(email ?? '', [Validators.email]);
  }

  addContributorControl(email?: string) {
    this.projectForm.controls.contributors.push(
      this.contributorFormControl(email)
    );
  }

  removeContributorControl(index: number) {
    this.projectForm.controls.contributors.removeAt(index);
  }

  onSubmit(user: User | null) {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const projectCollection = this.fs.projectCol;
    const projectId = this.project
      ? this.project.id
      : this.fs.createDocId(projectCollection);

    const project: Project<FieldValue> = {
      id: projectId,
      uid: user?.uid!,
      createdAt: this.project ? this.project.createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...this.projectForm.getRawValue(),
    };

    this.fs.setProject(project);

    const message = this.project
      ? 'Projet modifié avec succès'
      : 'Projet créé avec succès';

    this.snackBar.open(message, '', { duration: 5000 });

    this.dialog.closeAll();
  }
}
