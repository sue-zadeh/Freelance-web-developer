import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  private http = inject(HttpClient);

  formData = {
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.http.post('/api/contact', this.formData).subscribe({
      next: () => {
        this.successMessage = 'Your message has been sent successfully. I will get back to you soon.';
        this.errorMessage = '';
        this.isSubmitting = false;

        this.formData = {
          name: '',
          email: '',
          company: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: ''
        };
      },
      error: (error) => {
        console.error('Submit error:', error);
        this.errorMessage =
          error?.error?.message || 'Something went wrong. Please try again.';
        this.successMessage = '';
        this.isSubmitting = false;
      }
    });
  }
}