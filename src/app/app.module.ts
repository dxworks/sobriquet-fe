import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './components/login/login.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ProjectIdentityPage} from './pages/project-identity-page/project-identity-page';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./providers/auth.interceptor";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent} from './components/header/header.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {TeamsPageComponent} from './pages/teams-page/teams-page.component';
import {TeamsTableComponent} from './components/teams-table/teams-table.component';
import {EngineersPageComponent} from './pages/engineers-page/engineers-page.component';
import {EngineerComponent} from './components/engineer/engineer.component';
import {EngineerCardComponent} from './components/engineer-card/engineer-card.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {TeamLinkerPopupComponent} from './components/popups/team-linker-popup/team-linker-popup.component';
import {NewTeamPopupComponent} from './components/popups/new-team-popup/new-team-popup.component';
import {RepositoriesPageComponent} from './pages/repositories-page/repositories-page.component';
import {NewRepositoryPopupComponent} from './components/popups/new-repository-popup/new-repository-popup.component';
import {RepositoryComponent} from './components/repository/repository.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HomePageComponent} from './pages/home-page/home-page.component';
import {ProjectComponent} from './components/project/project.component';
import {SuggestionTableComponent} from './components/suggestion-table/suggestion-table.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EngineersTableComponent} from './components/engineers-table/engineers-table.component';
import {DragAndDropDirective} from './providers/drag-and-drop.directive';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectIdentityPage,
    HeaderComponent,
    TeamsPageComponent,
    TeamsTableComponent,
    EngineersPageComponent,
    EngineerComponent,
    EngineerCardComponent,
    TeamLinkerPopupComponent,
    NewTeamPopupComponent,
    RepositoriesPageComponent,
    NewRepositoryPopupComponent,
    RepositoryComponent,
    HomePageComponent,
    ProjectComponent,
    SuggestionTableComponent,
    EngineersTableComponent,
    DragAndDropDirective
  ],
  imports: [
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
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatToolbarModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
