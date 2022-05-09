import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TeamsPageComponent } from './components/teams-page/teams-page.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { SuggestionTableComponent } from './components/suggestion-table/suggestion-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EngineersTableComponent } from './components/engineers-table/engineers-table.component';
import { DragAndDropDirective } from './providers/drag-and-drop.directive';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TeamsDiagramComponent } from './components/teams-diagram/teams-diagram.component';
import { DevExtremeModule, DxDiagramModule } from 'devextreme-angular';
import { MatSortModule } from '@angular/material/sort';
import { NewEngineerPopupComponent } from './components/new-engineer-popup/new-engineer-popup.component';
import { EngineerDetailsPopupComponent } from './components/engineer-details-popup/engineer-details-popup.component';
import { NewTeamPopupComponent } from './components/new-team-popup/new-team-popup.component';
import { FileUploadPopupComponent } from './components/file-upload-popup/file-upload-popup.component';
import { MergeInformationPopupComponent } from './components/merge-information-popup/merge-information-popup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    ProjectPageComponent,
    HeaderComponent,
    TeamsPageComponent,
    HomePageComponent,
    ProjectCardComponent,
    SuggestionTableComponent,
    EngineersTableComponent,
    DragAndDropDirective,
    TeamsDiagramComponent,
    NewEngineerPopupComponent,
    EngineerDetailsPopupComponent,
    NewTeamPopupComponent,
    FileUploadPopupComponent,
    MergeInformationPopupComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatToolbarModule,
    DevExtremeModule,
    DxDiagramModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TableModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
