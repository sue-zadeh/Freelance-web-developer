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
    ).find((element) => element.textContent?.trim() === 'Business websites')!;
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(4);
    expect(fixture.nativeElement.textContent).toContain('SAMCT Villages');
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
  it('features the launched SAMCT platform first and keeps Senior Healthcare last', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const cards = page.querySelectorAll('article');
    expect(cards[0].querySelector('h3')?.textContent).toBe('SAMCT Villages');
    expect(cards[0].querySelector('.project-category')?.textContent).toContain('Launched');
    expect(cards[0].querySelector('a')?.getAttribute('href')).toBe('https://samplvillages.org.nz/');
    expect(cards[0].querySelector('a')?.textContent).toContain('Visit website');
    expect(cards[8].querySelector('h3')?.textContent).toBe('Senior Healthcare Auckland');
    const lion = cards[1];
    expect(lion.textContent).toContain('donation page');
    expect(lion.textContent).toContain('email notifications');
    expect(lion.textContent).toContain('private owner area');
    const filter = Array.from(page.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Admin dashboards',
    )!;
    filter.click();
    fixture.detectChanges();
    expect(page.textContent).toContain('SAMCT Villages');
    expect(page.textContent).toContain('Lion & Sun Society NZ');
    expect(page.textContent).toContain('FieldSafe');
    expect(page.textContent).not.toContain('Senior Healthcare Auckland');
  });
});

describe('Interactive 3D concepts', () => {
  function setup() {
    const fixture = TestBed.createComponent(ShowroomComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const button = (text: string) =>
      Array.from(page.querySelectorAll('button')).find((b) => b.textContent?.includes(text))!;
    const orb = page.querySelector<HTMLButtonElement>('[aria-label="Rotate restaurant in 3D"]')!;
    const key = (name: string) => {
      const event = new KeyboardEvent('keydown', { key: name, cancelable: true });
      orb.dispatchEvent(event);
      fixture.detectChanges();
      return event;
    };
    return { fixture, page, button, orb, key };
  }
  it('replaces both range sliders with an accessible orb and keeps top/perspective/reset views', () => {
    const { fixture, page, button, key } = setup();
    expect(page.querySelectorAll('input[type="range"]')).toHaveLength(0);
    expect(page.querySelectorAll('app-orbit-control')).toHaveLength(2);
    for (let i = 0; i < 36; i++) key('ArrowRight');
    expect(fixture.componentInstance.angle()).toBe(330);
    button('Top view').click();
    fixture.detectChanges();
    expect(page.querySelector<HTMLElement>('.room')!.style.getPropertyValue('--tilt')).toBe('0deg');
    expect(button('Top view').getAttribute('aria-pressed')).toBe('true');
    key('ArrowUp');
    expect(fixture.componentInstance.tilt()).toBe(0);
    button('Perspective').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.tilt()).toBe(57);
    button('Reset view').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.angle()).toBe(330);
  });
  it('keeps lighting independent of view changes', () => {
    const { fixture, page, button } = setup();
    button('Daylight').click();
    button('Top view').click();
    button('Reset view').click();
    fixture.detectChanges();
    expect(button('Evening').getAttribute('aria-pressed')).toBe('true');
    expect(page.querySelector('.demo-panel')?.classList.contains('evening')).toBe(true);
  });
  it('assembles and separates six food layers without changing the room', () => {
    const { fixture, page, button } = setup();
    expect(page.querySelectorAll('.ingredient')).toHaveLength(6);
    const food = page.querySelector('.sandwich-panel')!;
    expect(food.classList.contains('assembled')).toBe(false);
    button('Bring the layers together').click();
    fixture.detectChanges();
    expect(food.classList.contains('assembled')).toBe(true);
    expect(button('Separate the layers').getAttribute('aria-pressed')).toBe('true');
    expect(page.querySelector('#sandwich-state')?.textContent).toContain('All six layers together');
    button('Separate the layers').click();
    fixture.detectChanges();
    expect(food.classList.contains('assembled')).toBe(false);
    expect(fixture.componentInstance.angle()).toBe(330);
  });
});
