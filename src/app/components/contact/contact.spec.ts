import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactComponent } from './contact';
import { emptyContact } from '../../../shared/contact';

describe('Contact form', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });
  afterEach(() => http.verify());
  async function fillAndSubmit(
    email = 'customer@example.com',
    message = 'I need a website.\nIt needs a menu.',
  ) {
    fixture.componentInstance.formData = {
      ...emptyContact(),
      name: 'Cafe Owner',
      email,
      projectType: 'Business Website',
      message,
    };
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }
  it('explains missing fields without sending a request', () => {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.field-error')).toHaveLength(4);
    http.expectNone('/api/contact');
  });
  it('rejects an invalid email in the browser', async () => {
    await fillAndSubmit('broken');
    http.expectNone('/api/contact');
    expect(fixture.nativeElement.textContent).toContain('valid email address');
  });
  it('rejects whitespace-only project details', async () => {
    await fillAndSubmit('customer@example.com', '   ');
    http.expectNone('/api/contact');
  });
  it('sends multiline project details and resets after confirmed receipt', async () => {
    await fillAndSubmit();
    const request = http.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.message).toContain('\n');
    request.flush({ message: 'Received', notification: 'sent', reference: '42' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Your enquiry has been received');
    expect(fixture.componentInstance.formData.email).toBe('');
  });
  it('clearly reports a saved enquiry with delayed email notification', async () => {
    await fillAndSubmit();
    http
      .expectOne('/api/contact')
      .flush(
        { message: 'Saved', notification: 'pending', reference: '42' },
        { status: 202, statusText: 'Accepted' },
      );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('email notification is delayed');
    expect(fixture.nativeElement.textContent).not.toContain('sent successfully');
  });
  it('keeps the draft after a server failure', async () => {
    await fillAndSubmit();
    http.expectOne('/api/contact').flush({}, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(fixture.componentInstance.formData.name).toBe('Cafe Owner');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Your details are still here');
  });
  it('explains rate limiting and restores the submit control', async () => {
    await fillAndSubmit();
    http.expectOne('/api/contact').flush({}, { status: 429, statusText: 'Too Many Requests' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('15 minutes');
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
  });
  it('prevents repeat submission while the first request is pending', async () => {
    await fillAndSubmit();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const requests = http.match('/api/contact');
    expect(requests).toHaveLength(1);
    requests[0].flush({ notification: 'sent', message: 'Received' });
  });
});
