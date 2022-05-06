import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ProjectPageComponent} from './components/project-page/project-page.component';
import {TeamsPageComponent} from './components/teams-page/teams-page.component';
import {HomePageComponent} from './components/home-page/home-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'project-card/:name/identities', component: ProjectPageComponent},
  {path: 'newProject/:name/identities', component: ProjectPageComponent},
  {path: 'project-card/:name/teams', component: TeamsPageComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
