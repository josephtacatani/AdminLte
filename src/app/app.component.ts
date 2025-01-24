import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthActions } from './auth/ngrx/login.actions';
import { Store } from '@ngrx/store';
import { checkTokenExpiry } from './functions/token_expiry';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NgSelectModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'adminlteapp';

  constructor(
    private store: Store,
    private router: Router
  ){

  }

  ngOnInit() {
    // const refreshToken = localStorage.getItem('refreshToken');
    // checkTokenExpiry(this.store, this.router); // ✅ Call utility function
    
    // if (!refreshToken) {
    //   this.store.dispatch(AuthActions.logout({ refreshToken: '' })); // ✅ Dispatch logout
    //   this.router.navigate(['/login']); // ✅ Redirect to login
    //   return;
    // }

    // // ✅ If refreshToken exists but accessToken is missing, trigger refresh
    // if (!sessionStorage.getItem('accessToken')) {
    //   console.log('Session expired - Refreshing access token...');
    //   this.store.dispatch(AuthActions.refreshToken({ refreshToken }));
    // }


  }
}
