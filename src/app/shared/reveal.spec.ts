import { TestBed } from '@angular/core/testing';
import { AOS_LOADER, AosApi, RevealService } from './reveal';

describe('Progressive AOS reveals', () => {
  let reduced: boolean;
  let changeMotion: (event: MediaQueryListEvent) => void;
  let api: AosApi;
  let loader: ReturnType<typeof vi.fn>;
  const settle = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  };

  beforeEach(() => {
    reduced = false;
    api = { init: vi.fn(), refreshHard: vi.fn(), refresh: vi.fn() };
    loader = vi.fn(async () => api);
    TestBed.configureTestingModule({ providers: [{ provide: AOS_LOADER, useValue: loader }] });
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, listener: typeof changeMotion) => {
        changeMotion = listener;
      },
      removeEventListener: vi.fn(),
    }));
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('leaves server/fallback content visible until the local AOS module is ready', async () => {
    let ready!: (value: AosApi) => void;
    loader.mockImplementation(
      () =>
        new Promise<AosApi>((resolve) => {
          ready = resolve;
        }),
    );
    const element = document.createElement('article');
    element.textContent = 'A useful project';
    TestBed.inject(RevealService).watch(element, 999, 'zoom-in');
    expect(element.hasAttribute('data-aos')).toBe(false);
    expect(element.style.opacity).toBe('');
    ready(api);
    await settle();
    expect(element.getAttribute('data-aos')).toBe('zoom-in');
    expect(element.getAttribute('data-aos-delay')).toBe('200');
    expect(api.init).toHaveBeenCalledWith(
      expect.objectContaining({ once: true, disableMutationObserver: true }),
    );
  });
  it('does not download or initialize AOS for reduced motion', async () => {
    reduced = true;
    const element = document.createElement('div');
    TestBed.inject(RevealService).watch(element);
    await settle();
    expect(loader).not.toHaveBeenCalled();
    expect(element.hasAttribute('data-aos')).toBe(false);
  });
  it('keeps content visible when the animation module fails', async () => {
    loader.mockRejectedValue(new Error('Module unavailable'));
    const element = document.createElement('div');
    TestBed.inject(RevealService).watch(element);
    await settle();
    expect(element.hasAttribute('data-aos')).toBe(false);
    expect(element.classList.contains('aos-init')).toBe(false);
    expect(element.style.opacity).toBe('');
  });
  it('initializes once and refreshes real additions/removals from project filters', async () => {
    const service = TestBed.inject(RevealService);
    const first = document.createElement('article');
    const remove = service.watch(first);
    await settle();
    const second = document.createElement('article');
    service.watch(second);
    await settle();
    expect(api.init).toHaveBeenCalledTimes(1);
    expect(api.refreshHard).toHaveBeenCalled();
    remove();
    await settle();
    expect(first.hasAttribute('data-aos')).toBe(false);
    expect(second.getAttribute('data-aos')).toBe('fade-up');
  });
  it('clears hidden animation state immediately when reduced motion is enabled', async () => {
    const element = document.createElement('div');
    TestBed.inject(RevealService).watch(element);
    await settle();
    element.classList.add('aos-init');
    reduced = true;
    changeMotion({ matches: true } as MediaQueryListEvent);
    expect(element.hasAttribute('data-aos')).toBe(false);
    expect(element.classList.contains('aos-init')).toBe(false);
    reduced = false;
    changeMotion({ matches: false } as MediaQueryListEvent);
    await settle();
    expect(element.getAttribute('data-aos')).toBe('fade-up');
    expect(api.init).toHaveBeenCalledTimes(1);
  });
});
