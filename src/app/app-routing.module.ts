import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {HomePageComponent} from "./pages/home/home-page.component";
import {AuthGuard} from "./providers/auth.guard";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomePageComponent, canActivate: [AuthGuard]}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
