// Custom Alert System

/**
 * Shows a custom styled alert
 * @param {string} type - The type of alert: 'success', 'error', 'warning', or 'info'
 * @param {string} title - The alert title
 * @param {string} message - The alert message
 * @param {number} duration - Time in milliseconds before alert disappears (default: 5000ms)
 * @param {string} position - Position of the alert: 'top', 'top-right', 'bottom', 'bottom-right' (default: 'top-right')
 */
export function showCustomAlert(
  type,
  title,
  message,
  duration = 5000,
  position = "top-right"
) {
  // Create alert container if it doesn't exist
  let alertContainer = document.querySelector(".custom-alert-container");

  if (!alertContainer) {
    alertContainer = document.createElement("div");
    alertContainer.className = "custom-alert-container";
    document.body.appendChild(alertContainer);

    // Add position class
    alertContainer.classList.add(`position-${position}`);

    // Add base styles for container
    const containerStyles = document.createElement("style");
    containerStyles.textContent = `
        .custom-alert-container {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 320px;
          max-width: 90vw;
          pointer-events: none;
        }
        
        .position-top {
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .position-top-right {
          top: 20px;
          right: 20px;
        }
        
        .position-bottom {
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .position-bottom-right {
          bottom: 20px;
          right: 20px;
        }
        
        .custom-alert {
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          padding: 16px;
          display: flex;
          align-items: flex-start;
          color: white;
          backdrop-filter: blur(5px);
          animation: alertSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          pointer-events: auto;
          position: relative;
          overflow: hidden;
        }
        
        .custom-alert.fade-out {
          animation: alertSlideOut 0.4s forwards;
        }
        
        .custom-alert::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 4px;
        }
        
        .custom-alert.success {
          background: rgba(47, 214, 111, 0.95);
        }
        
        .custom-alert.success::before {
          background: #0ad668;
        }
        
        .custom-alert.error {
          background: rgba(235, 87, 87, 0.95);
        }
        
        .custom-alert.error::before {
          background: #ff3b3b;
        }
        
        .custom-alert.warning {
          background: rgba(240, 147, 43, 0.95);
        }
        
        .custom-alert.warning::before {
          background: #ff9500;
        }
        
        .custom-alert.info {
          background: rgba(47, 128, 237, 0.95);
        }
        
        .custom-alert.info::before {
          background: #096dff;
        }
        
        .alert-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          min-width: 30px;
          background: rgba(255, 255, 255, 0.3);
        }
        
        .alert-content {
          flex-grow: 1;
        }
        
        .alert-title {
          font-weight: bold;
          margin-bottom: 2px;
          font-size: 16px;
        }
        
        .alert-message {
          font-size: 14px;
          opacity: 0.95;
        }
        
        .alert-close {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .alert-close:hover {
          opacity: 1;
        }
        
        .alert-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.5);
          width: 100%;
          transform-origin: left;
        }
        
        @keyframes alertSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes alertSlideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `;
    document.head.appendChild(containerStyles);
  }

  // Create alert element
  const alertElement = document.createElement("div");
  alertElement.className = `custom-alert ${type}`;

  // Create icon based on type
  const alertIcon = document.createElement("div");
  alertIcon.className = "alert-icon";

  // Set icon content based on alert type
  let iconContent = "";
  switch (type) {
    case "success":
      iconContent = "✓";
      break;
    case "error":
      iconContent = "✗";
      break;
    case "warning":
      iconContent = "!";
      break;
    case "info":
      iconContent = "i";
      break;
  }
  alertIcon.textContent = iconContent;

  // Create content container
  const alertContent = document.createElement("div");
  alertContent.className = "alert-content";

  // Create title
  const alertTitle = document.createElement("div");
  alertTitle.className = "alert-title";
  alertTitle.textContent = title;

  // Create message
  const alertMessage = document.createElement("div");
  alertMessage.className = "alert-message";
  alertMessage.textContent = message;

  // Create close button
  const alertClose = document.createElement("div");
  alertClose.className = "alert-close";
  alertClose.textContent = "×";
  alertClose.addEventListener("click", () => {
    closeAlert(alertElement);
  });

  // Create progress bar
  const alertProgress = document.createElement("div");
  alertProgress.className = "alert-progress";
  alertProgress.style.animation = `progress ${
    duration / 1000
  }s linear forwards`;

  // Assemble the alert
  alertContent.appendChild(alertTitle);
  alertContent.appendChild(alertMessage);
  alertElement.appendChild(alertIcon);
  alertElement.appendChild(alertContent);
  alertElement.appendChild(alertClose);
  alertElement.appendChild(alertProgress);

  // Add to container
  alertContainer.appendChild(alertElement);

  // Auto-remove after duration
  setTimeout(() => {
    closeAlert(alertElement);
  }, duration);

  // Return the alert element for additional manipulation if needed
  return alertElement;
}

/**
 * Close an alert with animation
 * @param {HTMLElement} alertElement - The alert element to close
 */
function closeAlert(alertElement) {
  if (!alertElement) return;

  alertElement.classList.add("fade-out");

  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.parentNode.removeChild(alertElement);

      // Check if container is empty and remove it if so
      const container = document.querySelector(".custom-alert-container");
      if (container && container.children.length === 0) {
        container.remove();
      }
    }
  }, 400);
}

// Example usage:
// Success alert
// showCustomAlert('success', 'Success!', 'User was successfully registered.', 5000, 'top-right');

// Error alert
// showCustomAlert('error', 'Error!', 'User already exists in the system.', 5000, 'top-right');

// Warning alert
// showCustomAlert('warning', 'Warning!', 'Please complete all required fields.', 5000, 'top-right');

// Info alert
// showCustomAlert('info', 'Info', 'Your session will expire in 5 minutes.', 5000, 'top-right');
