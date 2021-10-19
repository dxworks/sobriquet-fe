import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {ProjectIdentityPage} from "./pages/project-identity-page/project-identity-page";
import {AuthGuard} from "./providers/auth.guard";
import {TeamsPageComponent} from "./pages/teams-page/teams-page.component";
import {EngineersPageComponent} from "./pages/engineers-page/engineers-page.component";
import {RepositoriesPageComponent} from "./pages/repositories-page/repositories-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'identities', component: ProjectIdentityPage, canActivate: [AuthGuard]},
  {path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'teams', component: TeamsPageComponent, canActivate: [AuthGuard]},
  {path: 'engineers', component: EngineersPageComponent, canActivate: [AuthGuard]},
  {path: 'repositories', component: RepositoriesPageComponent, canActivate: [AuthGuard]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
