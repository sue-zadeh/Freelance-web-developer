// Import base Angular Component decorator and modern inject function for Dependency Injection
import { Component, inject } from '@angular/core';
// Import FormsModule for Template-Driven forms and NgForm type for form instance handling
import { FormsModule, NgForm } from '@angular/forms';
// Import HttpClient for sending HTTP requests to backend API endpoints
import { HttpClient } from '@angular/common/http';
// Import RxJS finalize operator to execute cleanup code regardless of success or error state
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contact', // HTML tag selector used to render this component (<app-contact>)
  standalone: true, // Modern Angular standalone component (doesn't require an NgModule declaration)
  imports: [FormsModule], // Imports FormsModule so [(ngModel)] and #contactForm="ngForm" work in the HTML template
  templateUrl: './contact.html', // External HTML template file path
  styleUrl: './contact.css' // External CSS styling file path
})
export class ContactComponent {
  // Inject HttpClient instance using functional DI (inject()) rather than constructor injection
  private http = inject(HttpClient);

  // Object holding form inputs linked directly to template inputs via [(ngModel)] bi-directional binding
  formData = {
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    website: '',
  };

  // State flag tracking whether HTTP request is in progress to disable UI interactions
  isSubmitting = false;
  // Dynamic success alert message container for template rendering
  successMessage = '';
  // Dynamic error alert message container for template rendering
  errorMessage = '';

  // Function called upon submitting the contact form
  onSubmit(contactForm: NgForm): void {
    // Guard clause: stop execution if client-side validation failed or if a request is already pending
    if (contactForm.invalid || this.isSubmitting) {
      return;
    }

    // Reset feedback UI banners before initiating a new HTTP request
    this.successMessage = '';
    this.errorMessage = '';
    // Set loading indicator flag to true (disables submit button and updates text to "Sending email...")
    this.isSubmitting = true;

    // Send HTTP POST request to Node backend endpoint with form payload
    this.http
      .post('/api/contact', this.formData)
      .pipe(
        // finalize operator runs when observable completes OR errors out
        finalize(() => {
          // Re-enable the submit button regardless of API result status
          this.isSubmitting = false;
        })
      )
      .subscribe({
        // Triggered on HTTP 2xx successful responses
        next: () => {
          // Display user success confirmation message on screen
          this.successMessage =
            'Your message has been sent successfully. I will get back to you soon.';
          // Clear any previous error banner text
          this.errorMessage = '';

          // Reset local typescript data state back to initial empty strings
          this.formData = {
            name: '',
            email: '',
            company: '',
            projectType: '',
            budget: '',
            timeline: '',
            message: '',
            website: '',
          };

          // Reset template form state, clearing ngModel pristine/untouched/dirty flags
          contactForm.resetForm({
            name: '',
            email: '',
            company: '',
            projectType: '',
            budget: '',
            timeline: '',
            message: '',
            website: '',
          });
        },
        // Triggered on HTTP 4xx or 5xx server errors
        error: (error) => {
          // Log raw error details to browser developer console for debugging
          console.error('Submit error:', error);
          // Extract custom backend error message if available, else show fallback string
          this.errorMessage =
            error?.error?.message || 'Something went wrong. Please try again.';
          // Ensure success banner is hidden on error
          this.successMessage = '';
        }
      });
  }
}
