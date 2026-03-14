import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  };

  onSubmit(): void {
    console.log('Form submitted:', this.formData);

    alert('Thanks! Your message has been submitted.');

    this.formData = {
      name: '',
      email: '',
      company: '',
      projectType: '',
      budget: '',
      timeline: '',
      message: ''
    };
  }
}