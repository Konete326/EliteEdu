export const REST_T = 1.0;
export const INTRO_U = 0.65;
export const PERIOD = 2.4;
export const ASC = 0.85;

export const GLYPHS = {
  e: [
    { type: 'arc', cx: 0.5, cy: 0.45, r: 0.38, sa: 0.15, ea: 5.9, w: 0.12 },
    { type: 'seg', ax: 0.12, ay: 0.45, bx: 0.88, by: 0.45, w: 0.12 }
  ],
  l: [
    { type: 'seg', ax: 0.5, ay: 0.95, bx: 0.5, by: 0.08, w: 0.12 }
  ],
  i: [
    { type: 'seg', ax: 0.5, ay: 0.65, bx: 0.5, by: 0.08, w: 0.12 },
    { type: 'dot', cx: 0.5, cy: 0.86, r: 0.07 }
  ],
  t: [
    { type: 'seg', ax: 0.5, ay: 0.88, bx: 0.5, by: 0.12, w: 0.12 },
    { type: 'seg', ax: 0.22, ay: 0.65, bx: 0.78, by: 0.65, w: 0.11 },
    { type: 'arc', cx: 0.65, cy: 0.2, r: 0.15, sa: 3.14, ea: 4.71, w: 0.11 }
  ],
  d: [
    { type: 'arc', cx: 0.5, cy: 0.42, r: 0.36, sa: 0, ea: 6.28, w: 0.12 },
    { type: 'seg', ax: 0.86, ay: 0.95, bx: 0.86, by: 0.08, w: 0.12 }
  ],
  u: [
    { type: 'arc', cx: 0.5, cy: 0.42, r: 0.36, sa: 3.14, ea: 6.28, w: 0.12 },
    { type: 'seg', ax: 0.14, ay: 0.75, bx: 0.14, by: 0.42, w: 0.12 },
    { type: 'seg', ax: 0.86, ay: 0.75, bx: 0.86, by: 0.08, w: 0.12 }
  ]
};

export const parseColor = (input) => {
  if (!input) return [1, 1, 1];
  if (Array.isArray(input)) return input.slice(0, 3);
  if (typeof input !== 'string') return [1, 1, 1];
  const s = input.trim().toLowerCase();
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255
      ];
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255
      ];
    }
  }
  const rgb = s.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (rgb) {
    return [
      parseFloat(rgb[1]) / 255,
      parseFloat(rgb[2]) / 255,
      parseFloat(rgb[3]) / 255
    ];
  }
  return [1, 1, 1];
};

export const sdSegment = (px, py, ax, ay, bx, by) => {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay) / (bax * bax + bay * bay || 1e-6)));
  const dx = pax - bax * h;
  const dy = pay - bay * h;
  return Math.hypot(dx, dy);
};

export const sdPrim = (px, py, prim) => {
  if (prim.type === 'seg') {
    return sdSegment(px, py, prim.ax, prim.ay, prim.bx, prim.by) - (prim.w || 0.1) * 0.5;
  }
  if (prim.type === 'dot') {
    return Math.hypot(px - prim.cx, py - prim.cy) - prim.r;
  }
  if (prim.type === 'arc') {
    const dx = px - prim.cx;
    const dy = py - prim.cy;
    const d = Math.abs(Math.hypot(dx, dy) - prim.r) - (prim.w || 0.1) * 0.5;
    let a = Math.atan2(dy, dx);
    if (a < 0) a += Math.PI * 2;
    let sa = prim.sa;
    let ea = prim.ea;
    if (ea < sa) ea += Math.PI * 2;
    if (a >= sa && a <= ea) return d;
    const p1x = prim.cx + Math.cos(prim.sa) * prim.r;
    const p1y = prim.cy + Math.sin(prim.sa) * prim.r;
    const p2x = prim.cx + Math.cos(prim.ea) * prim.r;
    const p2y = prim.cy + Math.sin(prim.ea) * prim.r;
    return Math.min(Math.hypot(px - p1x, py - p1y), Math.hypot(px - p2x, py - p2y)) - (prim.w || 0.1) * 0.5;
  }
  return 999;
};

export const layoutText = (text = 'eliteedu') => {
  const chars = String(text).toLowerCase().split('');
  let curX = 0;
  const placed = [];
  chars.forEach((c) => {
    const list = GLYPHS[c] || GLYPHS['e'];
    const w = c === 'l' || c === 'i' ? 0.35 : 0.65;
    placed.push({ char: c, list, x: curX, w });
    curX += w + 0.08;
  });
  return { placed, totalW: curX };
};

export const frameAt = (t) => {
  const cycle = t % PERIOD;
  const progress = Math.min(1, cycle / REST_T);
  const melt = Math.max(0, 1 - progress);
  return { progress, melt };
};

export const buildShader = (gl) => {
  const vsSrc = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_pos + 1.0) * 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fsSrc = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_res;
    uniform float u_time;
    uniform float u_progress;
    uniform float u_melt;
    uniform vec3 u_color;
    uniform vec3 u_bg;
    uniform float u_scale;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
      float drop = sin(uv.x * 24.0 + u_time * 4.0) * 0.03 * u_melt;
      float d = length(uv) - (0.35 + u_progress * 0.12);
      
      float wave = sin(uv.x * 12.0 + u_time * 6.0) * 0.05 * (1.0 - u_progress);
      float alpha = smoothstep(0.04, -0.04, d + wave + drop);
      
      float edge = smoothstep(0.08, 0.0, abs(d + wave + drop));
      vec3 finalCol = mix(u_bg, u_color, alpha);
      finalCol += edge * 0.12 * (1.0 - u_progress);

      gl_FragColor = vec4(finalCol, 1.0);
    }
  `;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  };

  const vs = compile(gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

  return prog;
};

