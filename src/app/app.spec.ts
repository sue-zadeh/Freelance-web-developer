import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudioPageComponent } from './studio-page';
import { NavbarComponent } from './components/navbar/navbar';
import { ProjectsComponent } from './components/projects/projects';
import { ShowroomComponent } from './components/showroom/showroom';

describe('One-page studio experience', () => {
  it('renders every main section and exactly one main heading without JavaScript animation gates', async () => {
    await TestBed.configureTestingModule({
      imports: [StudioPageComponent],
      providers: [provideHttpClient()],
    }).compileComponents();
    const fixture = TestBed.createComponent(StudioPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelectorAll('h1')).toHaveLength(1);
    for (const section of [
      'home',
      'services',
      'demo',
      'projects',
      'about',
      'process',
      'faq',
      'contact',
      'privacy',
    ])
      expect(page.querySelector('#' + section)).toBeTruthy();
    expect(page.querySelectorAll('[data-aos]')).toHaveLength(0);
    expect(page.textContent).toContain('Lion & Sun Society NZ');
    expect(page.textContent).not.toContain('Hello, sue-portfolio');
  });
  it('opens and closes the mobile menu with matching accessibility state', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    fixture.componentInstance.onEscape();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
  it('uses real hash links for navigation', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('a[href="/#projects"]')).toBeTruthy();
    expect(page.querySelector('a[href="/#contact"]')).toBeTruthy();
    expect(page.querySelectorAll('[data-bs-toggle]')).toHaveLength(0);
  });
  it('filters actual website projects and includes all nine projects initially', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(9);
    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((element) => element.textContent?.trim() === 'Websites')!;
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(3);
    expect(fixture.nativeElement.textContent).toContain('ShowerPower');
    expect(fixture.nativeElement.textContent).not.toContain('Lion & Sun Society NZ');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
  it('shows in-progress project status and uses accessible real project links', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const link = page.querySelector('a[href="https://lionandsun.up.railway.app/en"]')!;
    expect(link.textContent).toContain('View preview');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(page.querySelectorAll('.project-details')).toHaveLength(9);
  });
  it('changes the restaurant view and lighting through the real controls', () => {
    const fixture = TestBed.createComponent(ShowroomComponent);
    fixture.detectChanges();
    const slider = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    slider.value = '-55';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(
      (fixture.nativeElement.querySelector('.room') as HTMLElement).style.getPropertyValue(
        '--rotation',
      ),
    ).toBe('-55deg');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.textContent).toContain('Evening');
  });
});
