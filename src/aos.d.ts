declare module 'aos' {
  const AOS: {
    init(options: {
      once: boolean;
      duration: number;
      offset: number;
      easing: string;
      disableMutationObserver: boolean;
    }): void;
    refreshHard(): void;
    refresh(): void;
  };
  export default AOS;
}
