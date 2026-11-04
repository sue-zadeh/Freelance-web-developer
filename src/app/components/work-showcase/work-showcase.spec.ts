import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkShowcaseComponent } from './work-showcase';

describe('Clickable project previews', () => {
  let fixture: ComponentFixture<WorkShowcaseComponent>;
  let reduced: boolean;
  let hidden: boolean;
  let motionChanged: (event: MediaQueryListEvent) => void;
  let removeMotionListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    reduced = false;
    hidden = false;
    removeMotionListener = vi.fn();
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, listener: typeof motionChanged) => {
        motionChanged = listener;
      },
      removeEventListener: removeMotionListener,
    }));
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  async function setup() {
    fixture = TestBed.createComponent(WorkShowcaseComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const root = fixture.nativeElement.querySelector('.hero-showcase') as HTMLElement;
    const deck = root.querySelector('.browser-stack') as HTMLButtonElement;
    const next = root.querySelector('[aria-label="Next project"]') as HTMLButtonElement;
    const previous = root.querySelector('[aria-label="Previous project"]') as HTMLButtonElement;
    const advance = (milliseconds: number) => {
      vi.advanceTimersByTime(milliseconds);
      fixture.detectChanges();
    };
    return { root, deck, next, previous, advance, component: fixture.componentInstance };
  }

  it('starts with Lion & Sun and five real previews, with no automatic changes on load or hover', async () => {
    const { root, deck, advance, component } = await setup();
    expect(root.querySelector('[data-position="0"] img')?.getAttribute('src')).toBe(
      '/images/lionandsun.webp',
    );
    expect(root.querySelectorAll('.browser-card')).toHaveLength(5);
    expect(root.querySelectorAll('.browser-card[aria-hidden="true"]')).toHaveLength(4);
    expect(root.querySelector('.preview-link')?.getAttribute('href')).toBe('#projects');
    expect(deck.tagName).toBe('BUTTON');
    deck.dispatchEvent(new MouseEvent('pointerenter'));
    advance(20000);
    expect(component.activeIndex()).toBe(0);
    expect(component.announcement()).toBe('');
  });

  it('turns one page per preview click, showing all five projects and wrapping to the first', async () => {
    const { root, deck, advance, component } = await setup();
    for (const index of [1, 2, 3, 4, 0]) {
      deck.click();
      advance(1100);
      expect(component.activeIndex()).toBe(index);
      expect(root.querySelector('[data-position="0"] img')?.getAttribute('src')).toBe(
        component.projects[index].image,
      );
      expect(root.querySelector('[role="status"]')?.textContent).toBe(
        `${component.projects[index].title}, project ${index + 1} of 5`,
      );
      expect(deck.getAttribute('aria-label')).toContain(component.projects[index].title);
      expect(component.turning()).toBe(false);
    }
  });

  it('ignores rapid clicks during both halves of a turn while preserving keyboard focus', async () => {
    const { root, deck, next, advance, component } = await setup();
    deck.focus();
    deck.click();
    fixture.detectChanges();
    expect(deck.getAttribute('aria-disabled')).toBe('true');
    expect(deck.disabled).toBe(false);
    expect(document.activeElement).toBe(deck);
    next.click();
    advance(550);
    expect(component.activeIndex()).toBe(1);
    expect(component.phase()).toBe('settling');
    expect(root.querySelector('[data-position="0"]')?.classList.contains('is-turning')).toBe(false);
    deck.click();
    advance(549);
    expect(component.activeIndex()).toBe(1);
    expect(component.turning()).toBe(true);
    advance(1);
    expect(deck.getAttribute('aria-disabled')).toBe(null);
    expect(document.activeElement).toBe(deck);
  });

  it('supports the separate previous and next controls across both ends of the deck', async () => {
    const { previous, next, advance, component } = await setup();
    previous.click();
    advance(1100);
    expect(component.activeIndex()).toBe(4);
    next.click();
    advance(1100);
    expect(component.activeIndex()).toBe(0);
  });

  it('switches immediately for reduced motion through the preview and arrow controls', async () => {
    reduced = true;
    const { deck, next, previous, component } = await setup();
    deck.click();
    expect(component.activeIndex()).toBe(1);
    next.click();
    expect(component.activeIndex()).toBe(2);
    previous.click();
    expect(component.activeIndex()).toBe(1);
    expect(component.turning()).toBe(false);
  });

  it.each([0, 550])(
    'settles the current page when reduced motion is enabled after %i ms',
    async (delay) => {
      const { deck, advance, component } = await setup();
      deck.click();
      advance(delay);
      motionChanged({ matches: true } as MediaQueryListEvent);
      advance(20000);
      expect(component.activeIndex()).toBe(1);
      expect(component.turning()).toBe(false);
      deck.click();
      expect(component.activeIndex()).toBe(2);
    },
  );

  it('finishes a pending turn when the tab is hidden and does not advance on return', async () => {
    const { deck, advance, component } = await setup();
    deck.click();
    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    advance(20000);
    expect(component.activeIndex()).toBe(1);
    expect(component.turning()).toBe(false);
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    advance(20000);
    expect(component.activeIndex()).toBe(1);
  });

  it.each([0, 550])('cancels the active turn timer on destruction after %i ms', async (delay) => {
    const { deck, advance, component } = await setup();
    deck.click();
    advance(delay);
    const current = component.activeIndex();
    fixture.destroy();
    vi.advanceTimersByTime(20000);
    expect(component.activeIndex()).toBe(current);
    expect(removeMotionListener).toHaveBeenCalledWith('change', motionChanged);
  });
});
