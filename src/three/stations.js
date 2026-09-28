/* World layout. Each section of the page has a "station" in 3D space.
   center  – where the station's object sits
   offset  – camera position relative to center
   lookY   – vertical offset of the look target
   shift   – desktop: slides the object sideways so it sits beside the text
             (fraction of half the visible width; + = object on the right)
   mobile  – optional overrides for narrow screens */

export const STATIONS = [
  { id: 'hero', center: [0, 0, 0], offset: [0, 0, 7.6], lookY: 0, shift: 0.52,
    mobile: { offset: [0, 0, 10], lookY: -2.6, shift: 0.62 } },
  { id: 'about', center: [0, -18, 0], offset: [0, 3.3, 7.6], lookY: 0.45, shift: 0.36,
    mobile: { offset: [0, 3.6, 9.8], lookY: -0.6 } },
  { id: 'projects', center: [0, -36, 0], offset: [0, 0.4, 10.5], lookY: 0, shift: 0,
    mobile: { offset: [0, 0.4, 12] } },
  { id: 'trafficx', center: [0, -54, 0], offset: [6.2, 7, 8.2], lookY: -0.3, shift: -0.4,
    mobile: { offset: [6.5, 8.5, 8.5], lookY: -1.6 } },
  { id: 'skills', center: [0, -72, 0], offset: [0, 0, 8.6], lookY: 0, shift: 0.5,
    mobile: { offset: [0, 0, 11.5], lookY: -1.4 } },
  { id: 'certificates', center: [0, -90, 0], offset: [0, 1.1, 10.5], lookY: 0, shift: 0,
    mobile: { offset: [0, 1.1, 13] } },
  { id: 'contact', center: [0, -108, 0], offset: [0, 0, 7.4], lookY: 0, shift: 0.44,
    mobile: { offset: [0, 0, 10], lookY: -1.2 } },
];

export const STATION_INDEX = Object.fromEntries(STATIONS.map((s, i) => [s.id, i]));

export const PALETTE = {
  bg: '#07070c',
  violet: '#a78bfa',
  violetDeep: '#7c3aed',
  cyan: '#38bdf8',
  indigo: '#6366f1',
  pink: '#f472b6',
  lime: '#bef264',
  amber: '#fbbf24',
};
