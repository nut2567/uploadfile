import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { path: 'upload', component: UploadComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' }, // หน้าแรก
  // { path: '**', redirectTo: '/home' } // หากไม่พบเส้นทางใดที่ตรงกับ URL ที่กำหนด
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
