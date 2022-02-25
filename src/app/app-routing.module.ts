import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ProjectPageComponent} from './pages/project-page/project-page.component';
import {TeamsPageComponent} from './pages/teams-page/teams-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'project/:name/identities', component: ProjectPageComponent},
  {path: 'newProject/:name/identities', component: ProjectPageComponent},
  {path: 'project/:name/teams', component: TeamsPageComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
