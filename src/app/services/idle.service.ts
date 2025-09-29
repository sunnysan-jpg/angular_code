import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private activitySub?: Subscription;
  private timeoutSub?: Subscription;
  private readonly EXPIRY_KEY = 'mushroom_auth_expiry';

  // Idle timeout in milliseconds (30 minutes)
  readonly IDLE_TIMEOUT = 30 * 60 * 1000;

  constructor(private auth: AuthService, private ngZone: NgZone) {}

  // Start watching user activity and schedule logout timer
  startWatching() {
    // Run outside angular to avoid change detection on frequent events
    this.ngZone.runOutsideAngular(() => {
      const events$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'scroll')
      );

      // whenever user interacts -> refresh expiry (inside Angular zone)
      this.activitySub = events$.subscribe(() => {
        this.ngZone.run(() => this.refreshExpiry());
      });

      // begin countdown (reads expiry from localStorage)
      this.resetCountdown();
    });
  }

  stopWatching() {
    this.activitySub?.unsubscribe();
    this.timeoutSub?.unsubscribe();
  }

  // Refresh expiry to now + IDLE_TIMEOUT
  refreshExpiry() {
    const expiry = Date.now() + this.IDLE_TIMEOUT;
    localStorage.setItem(this.EXPIRY_KEY, String(expiry));
    this.resetCountdown(); // restart timer
  }

  // Reset countdown from the stored expiry value
  private resetCountdown() {
    this.timeoutSub?.unsubscribe();

    const expiryStr = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiryStr) return;

    const expiry = Number(expiryStr);
    const remaining = expiry - Date.now();

    if (remaining <= 0) {
      // Already expired
      this.handleTimeout();
      return;
    }

    // subscribe a single timer that fires when remaining time elapses
    this.timeoutSub = timer(remaining).subscribe(() => this.handleTimeout());
  }

  private handleTimeout() {
    // run inside angular zone as we will update UI/navigate
    this.ngZone.run(() => {
      console.log('Idle timeout — logging out');
      this.auth.logout();
      this.stopWatching();
      // optionally show a toast/modal here
    });
  }
}
