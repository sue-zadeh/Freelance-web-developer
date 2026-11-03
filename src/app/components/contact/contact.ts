import { RevealDirective } from '../../shared/reveal';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize, timeout } from 'rxjs/operators';
import {
  BUDGETS,
  ContactResponse,
  emptyContact,
  PROJECT_TYPES,
  TIMELINES,
} from '../../../shared/contact';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  private readonly http = inject(HttpClient);
  readonly projectTypes = PROJECT_TYPES;
  readonly budgets = BUDGETS.filter(Boolean);
  readonly timelines = TIMELINES.filter(Boolean);
  formData = emptyContact();
  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly notificationDelayed = signal(false);

  onSubmit(contactForm: NgForm): void {
    if (this.isSubmitting()) return;
    this.submitted.set(true);
    contactForm.control.markAllAsTouched();
    if (contactForm.invalid) return;
    this.successMessage.set('');
    this.errorMessage.set('');
    this.notificationDelayed.set(false);
    this.isSubmitting.set(true);

    this.http
      .post<ContactResponse>('/api/contact', this.formData)
      .pipe(
        timeout(15000),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.notificationDelayed.set(response.notification === 'pending');
          this.successMessage.set(
            response.notification === 'pending'
              ? 'Your enquiry is saved, but the email notification is delayed. You can also reach me directly using the email or phone number here.'
              : 'Thanks! Your enquiry has been received. I’ll get back to you about your project.',
          );
          this.formData = emptyContact();
          contactForm.resetForm(this.formData);
          this.submitted.set(false);
        },
        error: (error: { status?: number; name?: string }) => {
          this.errorMessage.set(
            error.status === 429
              ? 'A few messages have already been sent from this connection. Please try again in 15 minutes, or email me directly.'
              : error.name === 'TimeoutError'
                ? 'This is taking longer than expected. Your enquiry may have arrived. Please email or call me before sending it again.'
                : 'I couldn’t confirm your message was received. Your details are still here. Please try again, or use the email or phone number alongside this form.',
          );
        },
      });
  }
}
