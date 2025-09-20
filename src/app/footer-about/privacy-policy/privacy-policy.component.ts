import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  brand = 'Mushroom Store';                 // change if needed
  supportEmail = 'info@mushroomstore.com';  // change if needed
  phone = '+91 7039683801';
  lastUpdated = new Date();  

    get telHref(): string {
    return 'tel:' + this.phone.replace(/[^+\d]/g, '');
  }

  get mailHref(): string {
    return 'mailto:' + this.supportEmail;
  }


  scrollTop(e: Event) {
  e.preventDefault();              // route change roko
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
  }
}

}
