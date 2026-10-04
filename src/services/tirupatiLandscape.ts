/**
 * Photographic Landscape Generator for Tirupati Seven Hills (Seshachalam Range)
 * Replicates the authentic geological features from the reference photograph:
 * - Characteristic flat-topped table mountain (mesa) with vertical terracotta sandstone cliffs
 * - Dramatic central and eastern red sandstone escarpments with horizontal geological strata
 * - Sweeping steep mountain slopes blanketed in lush evergreen/deciduous mountain forest canopy
 * - Realistic atmospheric perspective with aerial blue haze and soft mountain sky
 */

let cachedTirupatiDataUrl: string | null = null;

export function getTirupatiPhotographicImage(): string {
  if (typeof document === 'undefined') return '';
  if (cachedTirupatiDataUrl) return cachedTirupatiDataUrl;

  const width = 1920;
  const height = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // ---------------- 1. SKY & ATMOSPHERE ----------------
  // Soft atmospheric sky gradient matching reference: pale cerulean blue down to hazy horizon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
  skyGrad.addColorStop(0.0, '#98b6cb'); // Soft upper blue
  skyGrad.addColorStop(0.35, '#b2cadc');
  skyGrad.addColorStop(0.65, '#cadde9');
  skyGrad.addColorStop(1.0, '#e2edf4'); // Misty horizon
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft atmospheric cumulus wisps in the upper sky
  ctx.save();
  for (let i = 0; i < 45; i++) {
    const cx = (i * 47) % width + Math.sin(i * 3) * 60;
    const cy = 60 + (i % 7) * 45 + Math.cos(i) * 20;
    const rx = 140 + (i % 5) * 50;
    const ry = 40 + (i % 4) * 20;
    const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx);
    cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    cloudGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.12)');
    cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ---------------- 2. DISTANT BACKGROUND RIDGES ----------------
  // Far background mountain ridge in deep atmospheric blue-gray haze
  ctx.beginPath();
  ctx.moveTo(0, 560);
  ctx.bezierCurveTo(350, 520, 700, 540, 1100, 480);
  ctx.bezierCurveTo(1400, 440, 1700, 430, 1920, 460);
  ctx.lineTo(1920, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  const farHazeGrad = ctx.createLinearGradient(0, 450, 0, 800);
  farHazeGrad.addColorStop(0, '#7895aa');
  farHazeGrad.addColorStop(0.5, '#6c889d');
  farHazeGrad.addColorStop(1, '#8ca6b8');
  ctx.fillStyle = farHazeGrad;
  ctx.fill();

  // ---------------- 3. RIDGE 1: FLAT-TOPPED MESA WITH RED CLIFF (LEFT OF REFERENCE) ----------------
  // The iconic Tirumala flat table-mountain with sheer terracotta cliffs
  ctx.save();
  ctx.beginPath();
  // Ascent from far left foothills
  ctx.moveTo(0, 680);
  ctx.bezierCurveTo(150, 640, 280, 570, 440, 490);
  // Plateau begins at ~460, flat rocky top across to ~800, elevation around Y: 440
  ctx.lineTo(460, 455);
  ctx.bezierCurveTo(550, 448, 680, 445, 800, 462);
  // Descent on right side of mesa
  ctx.bezierCurveTo(920, 520, 1020, 600, 1100, 690);
  ctx.lineTo(1920, 720);
  ctx.lineTo(1920, height);
  ctx.lineTo(0, height);
  ctx.closePath();

  // Forest slope base fill
  const r1SlopeGrad = ctx.createLinearGradient(0, 450, 0, 900);
  r1SlopeGrad.addColorStop(0, '#4a6b57'); // Upper forest
  r1SlopeGrad.addColorStop(0.4, '#385544');
  r1SlopeGrad.addColorStop(1, '#486857');
  ctx.fillStyle = r1SlopeGrad;
  ctx.fill();

  // Add the distinctive sheer vertical red/terracotta sandstone cliff on the mesa
  // Cliff face spans X: 460 to 790, Y: 450 to 540
  const cliff1Grad = ctx.createLinearGradient(460, 450, 460, 540);
  cliff1Grad.addColorStop(0, '#be7b6b');   // Sunlit terracotta sandstone
  cliff1Grad.addColorStop(0.4, '#a96657'); // Sedimentary strata
  cliff1Grad.addColorStop(0.7, '#8f5144'); // Shadowed under-ledge
  cliff1Grad.addColorStop(1, '#536858');   // Transition into forest slope
  
  ctx.fillStyle = cliff1Grad;
  ctx.beginPath();
  ctx.moveTo(460, 455);
  ctx.bezierCurveTo(550, 448, 680, 445, 800, 462);
  ctx.lineTo(790, 535);
  ctx.bezierCurveTo(680, 525, 560, 530, 470, 540);
  ctx.closePath();
  ctx.fill();

  // Draw delicate horizontal rock strata lines across mesa cliff
  ctx.strokeStyle = 'rgba(70, 35, 28, 0.45)';
  ctx.lineWidth = 1.2;
  for (let ly = 465; ly < 535; ly += 9) {
    ctx.beginPath();
    ctx.moveTo(470, ly);
    for (let lx = 470; lx <= 790; lx += 25) {
      const wobble = Math.sin(lx * 0.05 + ly) * 2;
      ctx.lineTo(lx, ly + wobble);
    }
    ctx.stroke();
  }

  // Atmospheric haze over Ridge 1
  const r1Haze = ctx.createLinearGradient(0, 440, 0, 750);
  r1Haze.addColorStop(0, 'rgba(164, 186, 203, 0.38)');
  r1Haze.addColorStop(0.6, 'rgba(164, 186, 203, 0.48)');
  r1Haze.addColorStop(1, 'rgba(164, 186, 203, 0.2)');
  ctx.fillStyle = r1Haze;
  ctx.fill();
  ctx.restore();

  // ---------------- 4. RIDGE 2: MIDGROUND CENTER PEAK WITH VERTICAL CLIFFS ----------------
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(820, 680);
  ctx.bezierCurveTo(940, 520, 1020, 400, 1100, 335);
  // Mountain crest and rock shoulder
  ctx.bezierCurveTo(1160, 325, 1220, 330, 1270, 360);
  ctx.bezierCurveTo(1340, 420, 1420, 540, 1500, 650);
  ctx.lineTo(1920, 700);
  ctx.lineTo(1920, height);
  ctx.lineTo(820, height);
  ctx.closePath();

  const r2ForestGrad = ctx.createLinearGradient(1100, 330, 1100, 850);
  r2ForestGrad.addColorStop(0, '#3a5e46');
  r2ForestGrad.addColorStop(0.5, '#2c4a35');
  r2ForestGrad.addColorStop(1, '#233d2c');
  ctx.fillStyle = r2ForestGrad;
  ctx.fill();

  // Central sheer sandstone cliff (X: 1080 to 1260, Y: 330 to 455)
  const cliff2Grad = ctx.createLinearGradient(1100, 330, 1100, 455);
  cliff2Grad.addColorStop(0, '#c67e6c');
  cliff2Grad.addColorStop(0.35, '#b46b59');
  cliff2Grad.addColorStop(0.7, '#9b5645');
  cliff2Grad.addColorStop(1, '#415743');
  ctx.fillStyle = cliff2Grad;
  ctx.beginPath();
  ctx.moveTo(1095, 340);
  ctx.bezierCurveTo(1150, 328, 1210, 332, 1265, 362);
  ctx.lineTo(1250, 455);
  ctx.bezierCurveTo(1200, 445, 1140, 440, 1085, 450);
  ctx.closePath();
  ctx.fill();

  // Strata lines on central cliff
  ctx.strokeStyle = 'rgba(65, 30, 22, 0.4)';
  ctx.lineWidth = 1.2;
  for (let ly = 350; ly < 450; ly += 11) {
    ctx.beginPath();
    ctx.moveTo(1090, ly);
    for (let lx = 1090; lx <= 1255; lx += 20) {
      ctx.lineTo(lx, ly + Math.sin(lx * 0.08) * 2.5);
    }
    ctx.stroke();
  }

  // Soft atmospheric haze over Ridge 2
  const r2Haze = ctx.createLinearGradient(0, 330, 0, 700);
  r2Haze.addColorStop(0, 'rgba(164, 186, 203, 0.22)');
  r2Haze.addColorStop(1, 'rgba(164, 186, 203, 0.08)');
  ctx.fillStyle = r2Haze;
  ctx.fill();
  ctx.restore();

  // ---------------- 5. RIDGE 3: FOREGROUND MASSIVE MOUNTAIN WITH RED CLIFFS & LUSH GREEN SLOPES ----------------
  // The dominant mountain in the reference photo, sweeping down from top right to left
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(1920, 260); // Summit on right
  ctx.bezierCurveTo(1820, 265, 1680, 280, 1550, 320); // Top cliff rim
  ctx.bezierCurveTo(1450, 360, 1380, 420, 1280, 480);
  ctx.bezierCurveTo(1150, 550, 950, 630, 750, 710);  // Diagonal sweep
  ctx.bezierCurveTo(550, 780, 300, 830, 0, 870);     // Foothills on left
  ctx.lineTo(0, height);
  ctx.lineTo(1920, height);
  ctx.closePath();

  // Lush emerald green forest slope gradient
  const r3ForestGrad = ctx.createLinearGradient(1600, 260, 800, 1080);
  r3ForestGrad.addColorStop(0, '#2b5837');   // High forest
  r3ForestGrad.addColorStop(0.3, '#244e30'); // Rich dense canopy
  r3ForestGrad.addColorStop(0.65, '#1e4228');
  r3ForestGrad.addColorStop(1, '#15311e');   // Deep valley shadows
  ctx.fillStyle = r3ForestGrad;
  ctx.fill();

  // ---------------- 6. FOREGROUND TOWERING RED ROCK CLIFFS (UPPER RIGHT) ----------------
  // The iconic sheer ochre/red quartzite cliff crags on the upper right (X: 1420 to 1920, Y: 270 to 520)
  const cliff3Grad = ctx.createLinearGradient(1600, 260, 1600, 520);
  cliff3Grad.addColorStop(0, '#d88673');   // Sun-drenched sandstone rim
  cliff3Grad.addColorStop(0.25, '#c87663');
  cliff3Grad.addColorStop(0.55, '#ae5d4c'); // Deep reddish-ochre rock face
  cliff3Grad.addColorStop(0.85, '#874031'); // Craggy shadow crevasses
  cliff3Grad.addColorStop(1, '#2c4f34');   // Bottom transition into forest
  ctx.fillStyle = cliff3Grad;

  ctx.beginPath();
  ctx.moveTo(1920, 265);
  ctx.bezierCurveTo(1820, 265, 1680, 280, 1550, 320);
  ctx.bezierCurveTo(1480, 350, 1435, 395, 1410, 450); // Left crag edge
  ctx.bezierCurveTo(1450, 490, 1520, 510, 1620, 500); // Base of rock face
  ctx.bezierCurveTo(1740, 480, 1850, 460, 1920, 450);
  ctx.closePath();
  ctx.fill();

  // Detailed horizontal and vertical geological fracturing on the main red cliff
  ctx.lineWidth = 1.4;
  for (let ly = 290; ly < 490; ly += 14) {
    ctx.strokeStyle = 'rgba(75, 28, 20, 0.42)';
    ctx.beginPath();
    ctx.moveTo(1420, ly + Math.sin(ly) * 3);
    for (let lx = 1420; lx <= 1920; lx += 20) {
      const strataWobble = Math.sin(lx * 0.04 + ly * 0.2) * 3 + Math.cos(lx * 0.1) * 1.5;
      ctx.lineTo(lx, ly + strataWobble);
    }
    ctx.stroke();
  }

  // Vertical clefts and crags in the red rock face
  ctx.strokeStyle = 'rgba(50, 18, 12, 0.35)';
  ctx.lineWidth = 1.8;
  for (let lx = 1460; lx < 1900; lx += 36) {
    ctx.beginPath();
    ctx.moveTo(lx, 275 + (lx > 1600 ? 0 : 25));
    ctx.bezierCurveTo(lx + 4, 340, lx - 6, 410, lx + 2, 480);
    ctx.stroke();
  }

  // Sunlit highlight facets on prominent cliff crags
  ctx.strokeStyle = 'rgba(255, 200, 180, 0.28)';
  ctx.lineWidth = 2.0;
  for (let lx = 1490; lx < 1880; lx += 70) {
    ctx.beginPath();
    ctx.moveTo(lx, 290);
    ctx.lineTo(lx - 2, 380);
    ctx.stroke();
  }

  // ---------------- 7. DENSE FOREST CANOPY TEXTURE ACROSS SLOPES ----------------
  // Thousands of micro foliage crowns that create authentic photographic tree canopy
  const foliageColors = [
    'rgba(26, 60, 34, 0.45)',
    'rgba(34, 76, 44, 0.42)',
    'rgba(46, 96, 56, 0.38)',
    'rgba(58, 116, 68, 0.32)',
    'rgba(20, 46, 26, 0.50)'
  ];

  for (let i = 0; i < 4500; i++) {
    // Generate tree coordinates constrained to the mountain slope
    const rx = Math.random() * width;
    // Calculate mountain surface elevation at rx
    const slopeY = 260 + Math.pow((width - rx) / width, 1.15) * 530;
    const ry = slopeY + Math.random() * (height - slopeY);
    
    // Don't draw trees on the sheer cliff face
    if (rx > 1420 && ry < 480) continue;
    if (rx > 1080 && rx < 1260 && ry < 445) continue;
    if (rx > 460 && rx < 790 && ry < 535) continue;

    const rad = Math.random() * 4.5 + 2.0;
    ctx.fillStyle = foliageColors[i % foliageColors.length];
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Very subtle atmospheric valley mist along the foothill saddles
  const valleyMist = ctx.createLinearGradient(0, 650, 0, 850);
  valleyMist.addColorStop(0, 'rgba(215, 230, 240, 0.15)');
  valleyMist.addColorStop(0.5, 'rgba(215, 230, 240, 0.28)');
  valleyMist.addColorStop(1, 'rgba(215, 230, 240, 0.05)');
  ctx.fillStyle = valleyMist;
  ctx.fillRect(0, 620, 900, 240);

  ctx.restore();

  // Export as high-quality photographic JPEG data URL
  cachedTirupatiDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  return cachedTirupatiDataUrl;
}
