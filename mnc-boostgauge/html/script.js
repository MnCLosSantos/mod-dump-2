let visible = false;
let wrapper = document.getElementById('gaugeWrapper');
let needle = document.getElementById('needle');
let psiText = document.getElementById('psiText');
let maxText = document.getElementById('maxText');
let btnPrev = document.getElementById('btnPrev');
let btnNext = document.getElementById('btnNext');
let ticksContainer = document.getElementById('gaugeTicks');
let warningIcon = document.getElementById('warningIcon');

let uiX = 0.85;
let uiY = 0.75;
let uiScale = 1.0;
let currentStyle = 1;
let currentBezel = 1;
let bezelThickness = 8;
let currentPsi = 0;
let currentRpm = 0;
let maxPsi = 1.0;
let lightsOn = false;
let highBeamsOn = false;

// Smooth needle animation
let animationFrame = null;
let needleAngle = 0; // Start at top (0 degrees)
let targetAngle = 0;
let isSweeping = false;
let sweepProgress = 0;

// Constants
const MIN_ANGLE = 0; // Top position
const MAX_ANGLE = 360; // Full circle for needle
const ANGLE_RANGE = MAX_ANGLE - MIN_ANGLE;
const SWEEP_DURATION = 1000; // 1 second sweep
const SWEEP_MAX_ANGLE = 360; // Sweep to full circle

// Message handler
window.addEventListener('message', (event) => {
  const d = event.data;
  if (!d || !d.action) return;

  switch (d.action) {
    case 'updatePosition':
      handleUpdatePosition(d.data);
      break;
    case 'update':
      handleUpdate(d.data);
      break;
    case 'setVisible':
      setVisible(d.data.visible);
      break;
    case 'startSweep':
      startSweep();
      break;
  }
});

// Generate dynamic tick marks
function generateTicks(maxPsi) {
  ticksContainer.innerHTML = ''; // Clear existing ticks
  const tickCount = Math.max(1, Math.floor(parseFloat(maxPsi) || 1)); // One tick per PSI

  const anglePerTick = 360 / tickCount; // Full 360° circle
  const gaugeInnerSize = ticksContainer.offsetWidth - (bezelThickness * 2); // Account for bezel
  const radius = (gaugeInnerSize / 2) - 2; // Reduced radius to stay inside gauge face

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < tickCount; i++) {
    const isMajorTick = i % 3 === 0; // Major tick every 3 PSI
    const tick = document.createElement('div');
    tick.className = isMajorTick ? 'gauge-tick major-tick' : 'gauge-tick';

    // Each tick rotated evenly around the circle
    const angle = i * anglePerTick;
    const rad = (angle - 90) * (Math.PI / 180); // Start at top (0°)
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    tick.style.position = 'absolute';
    tick.style.left = `calc(50% + ${x}px)`;
    tick.style.top = `calc(50% + ${y}px)`;
    tick.style.width = isMajorTick ? '10px' : '8px'; // Slightly smaller ticks
    tick.style.height = isMajorTick ? '12px' : '12px'; // Thinner ticks
    tick.style.background = isMajorTick ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.7)';
    tick.style.transformOrigin = 'center center';
    tick.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;



    fragment.appendChild(tick);
  }

  ticksContainer.appendChild(fragment);
}


// Handle position updates
function handleUpdatePosition(cfg) {
  uiX = cfg.x || 0.85;
  uiY = cfg.y || 0.75;
  uiScale = cfg.scale || 1.0;
  currentStyle = cfg.style || 1;
  currentBezel = cfg.bezel || 1;
  bezelThickness = cfg.bezelThickness || 8;
  
  applyPosition();
  applyStyle(currentStyle);
  applyBezel(currentBezel);
  
  // Update CSS variable for bezel thickness
  document.documentElement.style.setProperty('--bezel-thickness', `${bezelThickness}px`);
  
  // Hide buttons
  if (btnPrev) btnPrev.style.display = 'none';
  if (btnNext) btnNext.style.display = 'none';
  
  // Ensure starts hidden
  setVisible(false);
}

// Handle gauge updates
function handleUpdate(payload) {
  if (payload.visible === false) {
    setVisible(false);
    return;
  }
  
  setVisible(true);
  
  currentPsi = parseFloat(payload.psi || 0.0);
  maxPsi = parseFloat(payload.maxPsi || 1.0);
  currentRpm = parseFloat(payload.rpm || 0.0);
  const rpmHigh = payload.rpmHigh || false;
  const psiHigh = payload.psiHigh || false;
  const style = payload.style || currentStyle;
  const bezel = payload.bezel || currentBezel;
  lightsOn = payload.lightsOn || false;
  highBeamsOn = payload.highBeamsOn || false;
  
  // Generate tick marks based on max PSI
  generateTicks(maxPsi);
  
  // Update needle target (only if not sweeping)
  if (!isSweeping) {
    updateNeedleTarget(currentPsi, maxPsi);
  }
  
  // Update text displays
  updateTextDisplays(currentPsi, maxPsi);
  
  // Update style if changed
  if (style !== currentStyle) {
    applyStyle(style);
  }
  
  // Update bezel if changed
  if (bezel !== currentBezel) {
    applyBezel(bezel);
  }
  
  // Apply PSI and RPM-based effects
  applyPsiEffects(psiHigh, currentPsi, maxPsi);
  
  // Apply lighting effects
  applyLightingEffects(lightsOn, highBeamsOn);
  
    wrapper.setAttribute('data-rpm-high', rpmHigh ? 'true' : 'false');
  
  // Start animation if not running
  if (!animationFrame) {
    startNeedleAnimation();
  }
}

// Apply position to wrapper
function applyPosition() {
  const sw = window.innerWidth;
  const sh = window.innerHeight;
  
  const px = Math.round(uiX * sw);
  const py = Math.round(uiY * sh);
  
  wrapper.style.transform = `translate(-50%, -50%) scale(${uiScale})`;
  wrapper.style.left = px + 'px';
  wrapper.style.top = py + 'px';
}

// Apply style class
function applyStyle(n) {
  wrapper.className = 'gauge';
  wrapper.classList.add(`style-${n}`);
  wrapper.classList.add(`bezel-${currentBezel}`);
  wrapper.classList.add('hidden'); // Start hidden
  currentStyle = n;
}

// Apply bezel class
function applyBezel(n) {
  wrapper.className = 'gauge';
  wrapper.classList.add(`style-${currentStyle}`);
  wrapper.classList.add(`bezel-${n}`);
  wrapper.classList.add('hidden'); // Start hidden
  currentBezel = n;
}

// Set visibility
function setVisible(v) {
  visible = v;
  
  if (visible) {
    wrapper.classList.remove('hidden');
    wrapper.classList.add('visible');
    wrapper.style.display = 'block';
  } else {
    wrapper.classList.remove('visible');
    wrapper.classList.add('hidden');
    wrapper.style.display = 'none';
    
    // Stop animation when hidden
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    
    // Reset needle
    needleAngle = MIN_ANGLE;
    targetAngle = MIN_ANGLE;
    needle.style.transform = `rotate(${needleAngle}deg)`;
    isSweeping = false;
    sweepProgress = 0;
    
    // Hide warning icon
    warningIcon.classList.add('hidden');
    warningIcon.classList.remove('visible');
  }
}

// Start needle sweep animation
function startSweep() {
  if (!visible || isSweeping) return;
  
  isSweeping = true;
  sweepProgress = 0;
  const startTime = Date.now();
  
  function animateSweep() {
    const elapsed = Date.now() - startTime;
    sweepProgress = Math.min(1.0, elapsed / SWEEP_DURATION);
    
    if (sweepProgress < 0.5) {
      // Sweep forward (0 to 1)
      const forwardProgress = sweepProgress * 2; // 0 to 1
      needleAngle = MIN_ANGLE + (SWEEP_MAX_ANGLE * forwardProgress);
    } else {
      // Sweep backward (1 to 0)
      const backwardProgress = (sweepProgress - 0.5) * 2; // 0 to 1
      needleAngle = SWEEP_MAX_ANGLE - (SWEEP_MAX_ANGLE * backwardProgress);
    }
    
    needle.style.transform = `rotate(${needleAngle}deg)`;
    
    if (sweepProgress < 1.0) {
      requestAnimationFrame(animateSweep);
    } else {
      isSweeping = false;
      needleAngle = MIN_ANGLE;
      updateNeedleTarget(currentPsi, maxPsi);
    }
  }
  
  requestAnimationFrame(animateSweep);
}

// Update needle target angle
function updateNeedleTarget(psi, maxPsi) {
  let percent = 0.0;
  
  if (maxPsi > 0.0001) {
    percent = Math.min(1.0, Math.max(0.0, psi / maxPsi));
  }
  
  targetAngle = MIN_ANGLE + (ANGLE_RANGE * percent);
  // Clamp target angle
  targetAngle = Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, targetAngle));
}

// Update text displays
function updateTextDisplays(psi, maxPsi) {
  psiText.innerText = psi.toFixed(1) + ' PSI';
  maxText.innerText = 'PSI';
  
  // Color intensity based on PSI percentage
  const percent = maxPsi > 0 ? psi / maxPsi : 0;
  const opacity = 0.7 + (percent * 0.3);
  psiText.style.opacity = opacity;
}

// Apply PSI-based visual effects
function applyPsiEffects(psiHigh, psi, maxPsi) {
  // Set data attribute for CSS animations
  wrapper.setAttribute('data-psi-high', psiHigh ? 'true' : 'false');
  
  // Apply needle glow and pulse when PSI is high
  if (psiHigh) {
    const glowIntensity = 0.5 + (psi / maxPsi * 0.5);
    needle.style.filter = `drop-shadow(0 0 ${glowIntensity * 8}px rgba(255, 165, 0, 0.8))`; // Amber glow
    needle.style.animation = 'pulse-glow 0.5s ease-in-out infinite';
  } else {
    needle.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))';
    needle.style.animation = 'none';
  }
  
  // Show/hide warning icon
  if (psiHigh) {
    warningIcon.classList.remove('hidden');
    warningIcon.classList.add('visible');
  } else {
    warningIcon.classList.add('hidden');
    warningIcon.classList.remove('visible');
  }
}

// Apply lighting effects based on vehicle lights
function applyLightingEffects(lightsOn, highBeamsOn) {
  wrapper.setAttribute('data-lights-on', lightsOn ? 'true' : 'false');
  wrapper.setAttribute('data-highbeams-on', highBeamsOn ? 'true' : 'false');
}

// Smooth needle animation loop
function startNeedleAnimation() {
  function animate() {
    if (!isSweeping) {
      // Smooth lerp towards target
      const diff = targetAngle - needleAngle;
      const speed = 0.15; // Smoothing factor
      
      if (Math.abs(diff) > 0.1) {
        needleAngle += diff * speed;
        // Clamp needle angle
        needleAngle = Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, needleAngle));
        needle.style.transform = `rotate(${needleAngle}deg)`;
      } else {
        needleAngle = targetAngle;
        needle.style.transform = `rotate(${needleAngle}deg)`;
      }
    }
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  animate();
}

// Button event handlers (kept for compatibility)
if (btnPrev) {
  btnPrev.addEventListener('click', () => {
    sendNuiMessage('cycleStyle', { direction: 'prev' });
  });
}

if (btnNext) {
  btnNext.addEventListener('click', () => {
    sendNuiMessage('cycleStyle', { direction: 'next' });
  });
}

// Send NUI message helper
function sendNuiMessage(action, data) {
  fetch(`https://${GetParentResourceName()}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
}

// Initialize
function init() {
  // Force hide on init
  wrapper.style.display = 'none';
  wrapper.classList.add('hidden');
  wrapper.classList.remove('visible');
  setVisible(false);
  
  applyPosition();
  applyStyle(currentStyle);
  applyBezel(currentBezel);
  
  // Update CSS variable for bezel thickness
  document.documentElement.style.setProperty('--bezel-thickness', `${bezelThickness}px`);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    applyPosition();
  });
  
  // Hide buttons
  if (btnPrev) btnPrev.style.display = 'none';
  if (btnNext) btnNext.style.display = 'none';
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}