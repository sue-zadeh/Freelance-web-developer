import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Server, status: 301 },
  { path: 'projects', renderMode: RenderMode.Server, status: 301 },
  { path: 'contact', renderMode: RenderMode.Server, status: 301 },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
