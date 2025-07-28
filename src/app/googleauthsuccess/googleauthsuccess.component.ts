// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-googleauthsuccess',
//   templateUrl: './googleauthsuccess.component.html',
//   styleUrls: ['./googleauthsuccess.component.scss']
// })
// export class GoogleauthsuccessComponent {

// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-google-auth-success',
  template: `<p>Logging in...</p>`
})
export class GoogleauthsuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.handleGoogleSuccess(token);
    }
  }
}

