import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ProjectPageComponent} from './pages/project-page/project-page.component';
import {TeamsPageComponent} from './pages/teams-page/teams-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'identities/project/:name', component: ProjectPageComponent},
  {path: 'identities/newProject/:name', component: ProjectPageComponent},
  {path: 'teams/project/:name', component: TeamsPageComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
