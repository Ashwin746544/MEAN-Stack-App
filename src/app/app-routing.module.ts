import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

const routes: Routes = [
  { path: "",component: PostListComponent},
  { path: "create",component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: "edit/:postId",component: PostCreateComponent, canActivate: [AuthGuard]},
  // { path: "login", component: LoginComponent},
  // { path: "signup", component: SignupComponent},//Lazy Loading using AuthRoutingModule
  // { path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
  { path: "auth", loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)} // For Latest Angular versions
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
   providers: [AuthGuard]
})
export class AppRoutingModule{

}
