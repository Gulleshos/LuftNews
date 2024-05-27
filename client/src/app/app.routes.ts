import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthorPageComponent } from './pages/author-page/author-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { isAuthenticatedGuard } from './core/guards/is-authenticated.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminGuard } from './core/guards/admin.guard';
import { CreateNewsPageComponent } from './pages/create-news-page/create-news-page.component';
import { CreateCategoryPageComponent } from './pages/create-category-page/create-category-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'news/:id',
        component: NewsPageComponent,
      },
      {
        path: 'category/:category',
        component: CategoryPageComponent,
      },
      {
        path: 'author/:authorId',
        component: AuthorPageComponent,
      },
      {
        path: 'search',
        component: SearchPageComponent,
      },
      {
        path: 'report',
        component: ReportPageComponent,
        canActivate: [isAuthenticatedGuard],
      },
      {
        path: 'admin',
        component: AdminPageComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: 'news',
            component: CreateNewsPageComponent,
          },
          {
            path: 'category',
            component: CreateCategoryPageComponent,
          },
          {
            path: 'reports',
            component: ReportsPageComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'signin',
        component: LoginPageComponent,
      },
      {
        path: 'signup',
        component: RegisterPageComponent,
      },
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
    ],
  },
];
