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
  it('features the launched SAMCT platform first and keeps Senior Healthcare last', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const cards = page.querySelectorAll('article');
    expect(cards[0].querySelector('h3')?.textContent).toBe('SAMCT Villages');
    expect(cards[0].querySelector('.project-category')?.textContent).toContain('Launched');
    expect(cards[0].querySelector('a')?.getAttribute('href')).toBe(
      'https://samplvillages.org.nz/',
    );
    expect(cards[0].querySelector('a')?.textContent).toContain('Visit website');
    expect(cards[8].querySelector('h3')?.textContent).toBe('Senior Healthcare Auckland');
    const lion = cards[1];
    expect(lion.textContent).toContain('donation page');
    expect(lion.textContent).toContain('email notifications');
    expect(lion.textContent).toContain('private owner area');
    const filter = Array.from(page.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'In progress',
    )!;
    filter.click();
    fixture.detectChanges();
    expect(page.textContent).not.toContain('SAMCT Villages');
    expect(page.textContent).toContain('Senior Healthcare Auckland');
  });
});

describe('Restaurant exploration', () => {
  function setup() {
    const fixture = TestBed.createComponent(ShowroomComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    const control = (id: string, value: string) => {
      const slider = page.querySelector<HTMLInputElement>('#' + id)!;
      slider.value = value;
      slider.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      return slider;
    };
    const button = (text: string) =>
      Array.from(page.querySelectorAll('button')).find((b) => b.textContent?.includes(text))!;
    return { fixture, page, control, button };
  }

  it('supports a full turn, top view, tilt, perspective, and reset through labelled controls', () => {
    const { fixture, page, control, button } = setup();
    const room = page.querySelector<HTMLElement>('.room')!;
    const slider = control('room-angle', '360');
    expect(slider.max).toBe('360');
    expect(room.style.getPropertyValue('--rotation')).toBe('360deg');
    button('Top view').click();
    fixture.detectChanges();
    expect(room.style.getPropertyValue('--tilt')).toBe('0deg');
    expect(button('Top view').getAttribute('aria-pressed')).toBe('true');
    expect(page.querySelector('#room-tilt')?.getAttribute('aria-valuetext')).toBe('Top view');
    control('room-tilt', '75');
    expect(room.style.getPropertyValue('--tilt')).toBe('75deg');
    button('Perspective').click();
    fixture.detectChanges();
    expect(room.style.getPropertyValue('--tilt')).toBe('57deg');
    expect(button('Perspective').getAttribute('aria-pressed')).toBe('true');
    button('Reset view').click();
    fixture.detectChanges();
    expect(room.style.getPropertyValue('--rotation')).toBe('330deg');
  });

  it('keeps the selected lighting when changing the view', () => {
    const { fixture, page, button } = setup();
    button('Daylight').click();
    button('Top view').click();
    button('Reset view').click();
    fixture.detectChanges();
    expect(button('Evening').getAttribute('aria-pressed')).toBe('true');
    expect(page.querySelector('.demo-panel')?.classList.contains('evening')).toBe(true);
  });

  it('wraps keyboard rotation, bounds tilt, and handles Home without intercepting unrelated keys', () => {
    const { fixture, page, control } = setup();
    const scene = page.querySelector<HTMLElement>('.scene')!;
    const key = (name: string) => {
      const event = new KeyboardEvent('keydown', { key: name, cancelable: true });
      scene.dispatchEvent(event);
      fixture.detectChanges();
      return event;
    };
    control('room-angle', '355');
    expect(key('ArrowRight').defaultPrevented).toBe(true);
    expect(fixture.componentInstance.angle()).toBe(5);
    key('ArrowLeft');
    expect(fixture.componentInstance.angle()).toBe(355);
    control('room-tilt', '0');
    key('ArrowUp');
    expect(fixture.componentInstance.tilt()).toBe(0);
    control('room-tilt', '75');
    key('ArrowDown');
    expect(fixture.componentInstance.tilt()).toBe(75);
    expect(key('Tab').defaultPrevented).toBe(false);
    key('Home');
    expect(fixture.componentInstance.angle()).toBe(330);
    expect(fixture.componentInstance.tilt()).toBe(57);
  });

  it('rotates while dragging and stops on cancellation; touch leaves vertical tilt unchanged', () => {
    const { fixture, page } = setup();
    const scene = page.querySelector<HTMLElement>('.scene')!;
    const pointer = (name: string, x: number, y: number, type = 'mouse', id = 1) => {
      const event = new MouseEvent(name, { clientX: x, clientY: y, button: 0 });
      Object.defineProperties(event, { pointerType: { value: type }, pointerId: { value: id } });
      scene.dispatchEvent(event);
      fixture.detectChanges();
    };
    pointer('pointerdown', 100, 100);
    pointer('pointermove', 200, 60);
    expect(fixture.componentInstance.angle()).toBe(40);
    expect(fixture.componentInstance.tilt()).toBe(67);
    expect(scene.classList.contains('is-dragging')).toBe(true);
    pointer('pointercancel', 200, 60);
    pointer('pointermove', 300, 0);
    expect(fixture.componentInstance.angle()).toBe(40);
    expect(scene.classList.contains('is-dragging')).toBe(false);
    pointer('pointerdown', 100, 100, 'touch', 2);
    pointer('pointermove', 200, 0, 'touch', 2);
    expect(fixture.componentInstance.angle()).toBe(110);
    expect(fixture.componentInstance.tilt()).toBe(67);
    pointer('pointerup', 200, 0, 'touch', 2);
    expect(scene.classList.contains('is-dragging')).toBe(false);
  });
});
