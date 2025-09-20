import { Component, inject } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ⬅️ add


@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent {
    constructor(
    private sanitizer: DomSanitizer              // ⬅️ add
  ) {}
private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  // change these to your real details
  phone = '+91-7039683801';
  email = 'support@yourbrand.in';
  officeAddress = 'Shop No. 5, Tare Compound, Mumbai - Dahisar';
  registeredAddress = 'Shop No. 5, Tare Compound, Mumbai - Dahisar';

    mapSrc!: SafeResourceUrl;
  externalMapHref = '';
  locating = false;

  sending = false;
  success?: string;
  error?: string;
  


  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  ngOnInit(){
    this.setMapByAddress(this.officeAddress);
  }

  submit() {
    this.success = this.error = undefined;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.sending = true;

    // matches the /api/contact route I gave you earlier
    const body = { ...this.form.value, subject: 'Website contact' };
    this.http.post('/api/contact', body).subscribe({
      next: () => { this.sending = false; this.success = 'Thanks! We got your message.'; this.form.reset(); },
      error: (e) => { this.sending = false; this.error = e?.error?.message || 'Failed to send. Try again.'; },
    });
  }

  telHref()  { return `tel:${this.phone.replace(/[^+\d]/g,'')}`; }
  mailHref() { return `mailto:${this.email}`; }


   // ===== Map helpers =====
  setMapByAddress(addr: string) {
    const u = `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;
    this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(u);
    this.externalMapHref = `https://www.google.com/maps?q=${encodeURIComponent(addr)}`;
  }

  setMapByCoords(lat: number, lng: number, zoom = 16) {
    const u = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
    this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(u);
    this.externalMapHref = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      this.error = 'Geolocation not supported on this device.';
      return;
    }
    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.locating = false;
        this.setMapByCoords(coords.latitude, coords.longitude, 16);
        this.success = 'Showing your current location on the map.';
      },
      (err) => {
        this.locating = false;
        const msg =
          err.code === err.PERMISSION_DENIED ? 'Location permission denied.' :
          err.code === err.POSITION_UNAVAILABLE ? 'Location unavailable.' :
          err.code === err.TIMEOUT ? 'Location request timed out.' :
          'Could not get location.';
        this.error = msg;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  resetToOffice() { this.setMapByAddress(this.officeAddress); }
}
