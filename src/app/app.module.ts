import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './components/login/login.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {HomePageComponent} from './pages/home/home-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./providers/auth.interceptor";
import {MatTableModule} from "@angular/material/table";
import {IdentityCardComponent} from './components/identity-card/identity-card.component';
import {IdentityComponent} from "./components/identity/identity.component";
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
import {NewEngineerPopupComponent} from './components/popups/new-engineer-popup/new-engineer-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import { TeamLinkerPopupComponent } from './components/popups/team-linker-popup/team-linker-popup.component';
import { NewTeamPopupComponent } from './components/popups/new-team-popup/new-team-popup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    IdentityComponent,
    IdentityCardComponent,
    HeaderComponent,
    TeamsPageComponent,
    TeamsTableComponent,
    EngineersPageComponent,
    EngineerComponent,
    EngineerCardComponent,
    NewEngineerPopupComponent,
    TeamLinkerPopupComponent,
    NewTeamPopupComponent,
    SidebarComponent
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
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
