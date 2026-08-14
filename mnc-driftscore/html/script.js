// html/script.js - COMPLETELY FIXED VERSION
// Helper to get parent resource name
function GetParentResourceName() {
    // In FiveM, NUI files are served from nui://game/
    // We need to extract the resource name from the full path
    let resourceName = 'mnc-driftscore'; // Fallback
    
    if (window.location.pathname) {
        const pathParts = window.location.pathname.split('/');
        // Path is usually /@resource_name/html/file.html
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i].startsWith('@')) {
                resourceName = pathParts[i].substring(1);
                break;
            }
        }
    }
    
    return resourceName;
}

let currentStyleIndex = 1;
let currentStyleName = "Classic Green";
let allStyles = {};


// Main message handler
window.addEventListener("message", function(event) {
  const data = event.data;
  

  if (data.action === "update") {
    const d = data.data || {};

    // Apply style if it exists
    if (d.style && d.style.bg && d.style.text && d.style.accent) {
        
        document.documentElement.style.setProperty("--bg", d.style.bg);
        document.documentElement.style.setProperty("--text", d.style.text);
        document.documentElement.style.setProperty("--accent", d.style.accent);

        const hudBoxes = document.querySelectorAll(".hud-box:not(.notification)");
        hudBoxes.forEach(box => {
            box.style.background = d.style.bg;
            box.style.color = d.style.text;
            box.style.borderColor = d.style.accent + "55";
        });

        if (d.style.name) {
            currentStyleName = d.style.name;
        }
    }

    // Update toggles and positions
    if (d.toggle) {
        for (const field in d.toggle) {
            const box = document.getElementById(field);
            if (box) {
                if (d.toggle[field]?.enabled) {
                    box.classList.remove("hidden");
                    box.style.display = "flex";
                    
                    const pos = d.toggle[field].position || {};
                    box.style.top    = pos.top    || '';
                    box.style.right  = pos.right  || '';
                    box.style.bottom = pos.bottom || '';
                    box.style.left   = pos.left   || '';
                } else {
                    box.classList.add("hidden");
                    setTimeout(() => { 
                        box.style.display = "none"; 
                    }, 500);
                }
            }
        }
    }

    // Update values
    const scoreEl = document.querySelector("#score .value");
    const multEl = document.querySelector("#multiplier .value");
    const comboEl = document.querySelector("#combo .value");
    
    if (scoreEl) scoreEl.innerText = (d.score ?? 0).toLocaleString();
    if (multEl) multEl.innerText = d.multiplier || "x1.0";
    if (comboEl) comboEl.innerText = d.combo || "";

    if (d.currentStyleIndex) {
        currentStyleIndex = d.currentStyleIndex;
    }
  }

  if (data.action === "show") {
    const hudBoxes = document.querySelectorAll(".hud-box:not(.notification)");
    hudBoxes.forEach(box => {
      box.style.display = "flex";
      box.classList.remove("hidden");
      box.offsetHeight;
      box.classList.add("visible");
    });
  }

  if (data.action === "hide") {
    const hudBoxes = document.querySelectorAll(".hud-box:not(.notification)");
    hudBoxes.forEach(box => {
      box.classList.remove("visible");
      box.classList.add("hidden");
      setTimeout(() => {
        box.style.display = "none";
      }, 500);
    });
  }

  if (data.action === "showNotification") {
    const container = document.getElementById("notificationContainer") || createNotificationContainer();
    const notification = document.createElement("div");
    notification.className = `hud-box notification ${data.type}`;
    
    if (data.style) {
        notification.style.background = data.style.bg;
        notification.style.color = data.style.text;
        notification.style.borderColor = data.style.accent + "55";
    }
    
    notification.style.position = "fixed";
    notification.style.top = (20 + container.children.length * 70) + "px";
    notification.style.right = "20px";
    notification.style.opacity = "0";
    notification.style.display = "flex";
    notification.innerHTML = `<span class="value">${data.message}</span>`;
    
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transition = "opacity 0.3s ease, top 0.3s ease";
    }, 50);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
          notification.remove();
          Array.from(container.children).forEach((notif, index) => {
              notif.style.top = (20 + index * 70) + "px";
          });
      }, 300);
    }, 3000);
  }

  if (data.action === "openHelp") {
    
    if (data.styleName) {
      currentStyleName = data.styleName;
    }
    if (data.allStyles) {
      // Lua sends 1-indexed table, JS receives 0-indexed array
      // We need to convert it to 1-indexed object for consistency
      const convertedStyles = {};
      
      // Check if it's an array (0-indexed) or object (already 1-indexed)
      if (Array.isArray(data.allStyles)) {
        data.allStyles.forEach((style, index) => {
          convertedStyles[index + 1] = style;
        });
      } else {
        convertedStyles = data.allStyles;
      }
      
      allStyles = convertedStyles;
      
      // Verify styles are mapped correctly
      for (let i = 1; i <= 5; i++) {
        if (allStyles[i]) {
        }
      }
    }
    if (data.currentStyleIndex) {
      currentStyleIndex = data.currentStyleIndex;
    }
    openHelpModal();
  }

  if (data.action === "styleChanged") {
    currentStyleIndex = data.newStyle;
    currentStyleName = data.styleName;
    
    const styleNameEl = document.getElementById("currentStyleName");
    if (styleNameEl) {
      styleNameEl.textContent = data.styleName;
    }
    
    // Re-render the grid to update the active indicator
    if (Object.keys(allStyles).length > 0) {
      renderStyleGrid();
    }
  }
});

function createNotificationContainer() {
  const container = document.createElement("div");
  container.id = "notificationContainer";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.zIndex = "1000";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);
  return container;
}

function renderStyleGrid() {
  const styleGrid = document.getElementById("styleGrid");
  if (!styleGrid || Object.keys(allStyles).length === 0) {
    return;
  }
  

  styleGrid.innerHTML = '';
  
  // Lua tables are 1-indexed, so we need to iterate properly
  for (let luaIndex = 1; luaIndex <= Object.keys(allStyles).length; luaIndex++) {
    const style = allStyles[luaIndex];
    if (!style) continue;
    
    const styleCard = document.createElement('div');
    const isActive = currentStyleIndex === luaIndex;
    
    
    styleCard.className = 'style-card';
    styleCard.dataset.styleIndex = luaIndex;
    
    styleCard.style.cssText = `
      padding: 12px;
      border-radius: 8px;
      background: ${style.bg};
      border: 2px solid ${style.accent}55;
      cursor: pointer;
      transition: all 0.2s ease;
      ${isActive ? 'box-shadow: 0 0 20px ' + style.accent + '; border-width: 3px;' : ''}
    `;
    
    styleCard.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        <span style="font-weight: bold; color: ${style.accent};">#${luaIndex}</span>
        <span style="color: ${style.text}; font-weight: 600;">${style.name}</span>
        ${isActive ? '<span style="color: ' + style.accent + '; margin-left: auto; font-weight: bold;">✓ ACTIVE</span>' : ''}
      </div>
      <div style="color: ${style.text}; font-size: 0.85em; opacity: 0.8;">${style.description || ''}</div>
      <div style="margin-top: 8px; display: flex; gap: 6px;">
        <div style="width: 20px; height: 20px; border-radius: 4px; background: ${style.bg}; border: 1px solid ${style.text}33;" title="Background"></div>
        <div style="width: 20px; height: 20px; border-radius: 4px; background: ${style.text}; border: 1px solid ${style.text}33;" title="Text"></div>
        <div style="width: 20px; height: 20px; border-radius: 4px; background: ${style.accent}; border: 1px solid ${style.text}33;" title="Accent"></div>
      </div>
    `;
    
    // Click handler
    styleCard.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const styleIndex = parseInt(this.dataset.styleIndex);

      
      const resourceName = GetParentResourceName();
      const url = `https://${resourceName}/changeStyle`;

      
      // Don't try to parse response - FiveM NUI doesn't return proper JSON
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: styleIndex })
      }).catch(err => {
        // This error is expected in FiveM - the callback still executes

      });
      

    });
    
    // Hover effects
    styleCard.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = `0 0 20px ${style.accent}`;
    });
    
    styleCard.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = isActive ? `0 0 20px ${style.accent}` : 'none';
    });
    
    styleGrid.appendChild(styleCard);
  }
  

}

// Modal handling
const helpModal = document.getElementById("helpModal");
const closeModalBtn = document.getElementById("closeModal");

function openHelpModal() {
  if (!helpModal) {

    return;
  }
  

  
  const styleNameEl = document.getElementById("currentStyleName");
  if (styleNameEl) {
    styleNameEl.textContent = currentStyleName;
  }

  renderStyleGrid();

  helpModal.style.display = "flex";
  document.body.style.pointerEvents = "all";
  

}

function closeHelpModal() {
  if (!helpModal) return;
  

  helpModal.style.display = "none";
  document.body.style.pointerEvents = "none";
  
  const resourceName = GetParentResourceName();
  const url = `https://${resourceName}/closeModal`;

  
  // Tell FiveM to close NUI focus - don't try to parse response
  fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
  }).catch(err => {
      // This error is expected in FiveM - the callback still executes
  });
  
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeHelpModal();
  });
}

if (helpModal) {
  helpModal.addEventListener('click', function(e) {
    if (e.target === helpModal) {
      closeHelpModal();
    }
  });
}

// ESC key handling
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        if (helpModal && helpModal.style.display === 'flex') {
            e.preventDefault();
            e.stopPropagation();

            closeHelpModal();
        }
    }
});

// Debug - log when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {

    });
} else {

}

