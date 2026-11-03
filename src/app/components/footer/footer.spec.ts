import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';
describe('Footer', () => {
  it('shows the studio contact and current copyright year', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(String(new Date().getFullYear()));
    expect(
      fixture.nativeElement.querySelector('a[href="mailto:suezadeh@suewebstudio.com"]'),
    ).toBeTruthy();
  });
});
