// Procedurally generates premium abstract raster graphics (WebP/PNG) for VerbRea.
// We render rich SVG scenes (gradient mesh, node-network, grain, glow) then rasterize
// with sharp, so the shipped assets are photographic-quality raster images rather than
// flat inline vector icons.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images");
await mkdir(OUT, { recursive: true });

const NAVY_DEEP = "#070C14";
const NAVY = "#0B1526";
const NAVY_MID = "#132038";
const TEAL = "#0E3A3E";
const GOLD = "#D9B366";
const GOLD_SOFT = "#F0D9A8";
const EMERALD = "#3FBE8E";

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generates a network of nodes connected by faint lines, evoking logic/reasoning pathways.
function buildNetwork(width, height, seed, opts = {}) {
  const rand = seededRandom(seed);
  const count = opts.count ?? 34;
  const nodes = Array.from({ length: count }, () => ({
    x: rand() * width,
    y: rand() * height,
    r: 1.4 + rand() * 2.6,
  }));

  let lines = "";
  let maxDist = opts.maxDist ?? width * 0.16;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < maxDist) {
        const op = (1 - d / maxDist) * (opts.lineOpacity ?? 0.5);
        lines += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${opts.lineColor ?? GOLD}" stroke-width="${opts.lineWidth ?? 0.6}" opacity="${op.toFixed(3)}" />`;
      }
    }
  }

  let dots = nodes
    .map(
      (n) =>
        `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(2)}" fill="${opts.nodeColor ?? GOLD_SOFT}" opacity="${(0.55 + rand() * 0.4).toFixed(2)}" />`
    )
    .join("");

  return `<g>${lines}${dots}</g>`;
}

function grainFilter(id, freq = 0.85, opacity = 0.05) {
  return `
  <filter id="${id}">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${opacity} 0"/>
  </filter>`;
}

async function renderSvgToWebp(svg, file, { width, height, quality = 88, format = "webp" } = {}) {
  const buf = Buffer.from(svg);
  let pipeline = sharp(buf, { density: 300 }).resize(width, height);
  if (format === "webp") pipeline = pipeline.webp({ quality, effort: 6 });
  else if (format === "png") pipeline = pipeline.png({ quality, compressionLevel: 9 });
  await pipeline.toFile(path.join(OUT, file));
  console.log("wrote", file);
}

// 1. Hero background — deep navy gradient mesh + logic-network + grain, for the landing hero.
async function heroBackground() {
  const W = 2400,
    H = 1500;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g1" cx="18%" cy="12%" r="75%">
        <stop offset="0%" stop-color="${NAVY_MID}"/>
        <stop offset="45%" stop-color="${NAVY}"/>
        <stop offset="100%" stop-color="${NAVY_DEEP}"/>
      </radialGradient>
      <radialGradient id="g2" cx="82%" cy="88%" r="60%">
        <stop offset="0%" stop-color="${TEAL}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow" cx="72%" cy="22%" r="35%">
        <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
      </radialGradient>
      ${grainFilter("grain", 0.9, 0.045)}
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g1)"/>
    <rect width="${W}" height="${H}" fill="url(#g2)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${buildNetwork(W, H, 7, { count: 70, maxDist: W * 0.11, lineOpacity: 0.4, lineColor: GOLD, nodeColor: GOLD_SOFT })}
    <rect width="${W}" height="${H}" filter="url(#grain)"/>
  </svg>`;
  await renderSvgToWebp(svg, "hero-network.webp", { width: W, height: H, quality: 90 });
}

// 2. Certificate-style seal badge for the results / mastery report.
async function sealBadge() {
  const W = 1200,
    H = 1200;
  const cx = W / 2,
    cy = H / 2;
  const ringPoints = 48;
  let ticks = "";
  for (let i = 0; i < ringPoints; i++) {
    const a = (i / ringPoints) * Math.PI * 2;
    const r1 = 430,
      r2 = i % 4 === 0 ? 400 : 414;
    const x1 = cx + Math.cos(a) * r1,
      y1 = cy + Math.sin(a) * r1;
    const x2 = cx + Math.cos(a) * r2,
      y2 = cy + Math.sin(a) * r2;
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${GOLD}" stroke-width="4" opacity="0.85"/>`;
  }
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="42%" r="65%">
        <stop offset="0%" stop-color="${NAVY_MID}"/>
        <stop offset="100%" stop-color="${NAVY_DEEP}"/>
      </radialGradient>
      <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${GOLD_SOFT}"/>
        <stop offset="100%" stop-color="${GOLD}"/>
      </linearGradient>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="${cx}" cy="${cy}" r="440" fill="${GOLD}" opacity="0.12" filter="url(#soft)"/>
    <circle cx="${cx}" cy="${cy}" r="422" fill="none" stroke="url(#ring)" stroke-width="6"/>
    <circle cx="${cx}" cy="${cy}" r="368" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.6"/>
    ${ticks}
    ${buildNetwork(W, H, 22, { count: 20, maxDist: 260, lineOpacity: 0.35, lineColor: GOLD, nodeColor: GOLD_SOFT })}
    <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="220" fill="url(#ring)" font-weight="700">VR</text>
    <text x="${cx}" y="${cy + 150}" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" letter-spacing="10" fill="${GOLD_SOFT}" opacity="0.9">MASTERY</text>
  </svg>`;
  await renderSvgToWebp(svg, "seal-badge.webp", { width: W, height: H, quality: 92 });
}

// 3. Category emblems — four small badges for Deductive, Critical, Reading, Precision.
async function categoryEmblem(name, seed, accent) {
  const W = 600,
    H = 600;
  const cx = W / 2,
    cy = H / 2;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="${NAVY_MID}"/>
        <stop offset="100%" stop-color="${NAVY_DEEP}"/>
      </radialGradient>
      <radialGradient id="acc" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" rx="48" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" rx="48" fill="url(#acc)"/>
    <circle cx="${cx}" cy="${cy}" r="205" fill="none" stroke="${accent}" stroke-width="2" opacity="0.55"/>
    ${buildNetwork(W, H, seed, { count: 16, maxDist: 170, lineOpacity: 0.55, lineColor: accent, nodeColor: accent })}
  </svg>`;
  await renderSvgToWebp(svg, `emblem-${name}.webp`, { width: W, height: H, quality: 90 });
}

// 4. Open Graph share image (PNG — safest cross-platform format for social crawlers).
async function ogImage() {
  const W = 1200,
    H = 630;
  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g1" cx="20%" cy="15%" r="85%">
        <stop offset="0%" stop-color="${NAVY_MID}"/>
        <stop offset="100%" stop-color="${NAVY_DEEP}"/>
      </radialGradient>
      <radialGradient id="glow" cx="80%" cy="20%" r="40%">
        <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g1)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${buildNetwork(W, H, 9, { count: 40, maxDist: 170, lineOpacity: 0.4, lineColor: GOLD, nodeColor: GOLD_SOFT })}
    <text x="80" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="${GOLD_SOFT}" font-weight="700">VerbRea</text>
    <text x="80" y="365" font-family="Arial, sans-serif" font-size="34" fill="#EAF0F8">Verbal Reasoning Mastery Test</text>
    <text x="80" y="415" font-family="Arial, sans-serif" font-size="24" fill="${EMERALD}">GRE &#183; LSAT &#183; Executive Assessment Standard</text>
  </svg>`;
  await renderSvgToWebp(svg, "og-image.png", { width: W, height: H, format: "png" });
}

// 5. Subtle light-mode section texture (very faint dot grid) for content sections.
async function lightTexture() {
  const W = 1600,
    H = 1600;
  const rand = seededRandom(4);
  let dots = "";
  const gap = 34;
  for (let y = gap / 2; y < H; y += gap) {
    for (let x = gap / 2; x < W; x += gap) {
      const jitter = (rand() - 0.5) * 4;
      dots += `<circle cx="${(x + jitter).toFixed(1)}" cy="${y.toFixed(1)}" r="1.3" fill="#0B1526" opacity="0.055"/>`;
    }
  }
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="#FFFFFF"/>${dots}</svg>`;
  await renderSvgToWebp(svg, "texture-dots.webp", { width: W, height: H, quality: 80 });
}

await heroBackground();
await sealBadge();
await categoryEmblem("deductive", 11, GOLD);
await categoryEmblem("critical", 33, EMERALD);
await categoryEmblem("reading", 55, "#6EA8D9");
await categoryEmblem("precision", 77, "#D97BA8");
await ogImage();
await lightTexture();

console.log("All images generated in", OUT);
