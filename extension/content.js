// content.js
class SafetyMonitor {
    constructor() {
      this.API_URL = 'http://localhost:5123/api/messages';
      this.currentAlert = null;
      this.lastProcessedText = '';
      this.initialize();
    }
  
    initialize() {
      console.log('SafetyMonitor initialized');
      this.createStyles();
      this.createAlertContainer();
      this.setupMessageMonitor();
    }
  
    setupMessageMonitor() {
      // Monitor all inputs for Enter key press
      document.addEventListener('keydown', async (e) => {
        // Check if it's an Enter press without Shift
        if (e.key === 'Enter' && !e.shiftKey) {
          // Get the active element (where user is typing)
          const element = document.activeElement;
          
          // Check if it's an input element
          if (element && (
            element.tagName === 'INPUT' ||
            element.tagName === 'TEXTAREA' ||
            element.getAttribute('contenteditable') === 'true' ||
            element.getAttribute('role') === 'textbox'
          )) {
            // Get text from the element
            const text = element.value || element.textContent;
            
            if (text && text.trim() && text !== this.lastProcessedText) {
              // Wait for the message to be sent
              await new Promise(resolve => setTimeout(resolve, 100));
              this.lastProcessedText = text;
              await this.analyzeText(text.trim());
            }
          }
        }
      });
    }
  
    async analyzeText(text) {
      console.log('Analyzing text:', text);
      try {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: 'extension',
            message: text
          })
        });
  
        if (!response.ok) {
          throw new Error('API request failed');
        }
  
        const data = await response.json();
        console.log('API response:', data);
  
        if (data.safetyAnalysis && data.safetyAnalysis !== 'SAFE') {
          this.showAlert(data.safetyAnalysis);
        }
      } catch (error) {
        console.error('Error analyzing text:', error);
      }
    }
  
    createStyles() {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        .safety-alert-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2147483647;
          width: 300px;
          pointer-events: none;
        }
  
        .safety-alert {
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border-left: 4px solid #ff4444;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: slideIn 0.3s ease;
          pointer-events: auto;
          margin-bottom: 10px;
        }
  
        .safety-alert-icon {
          font-size: 20px;
        }
  
        .safety-alert-content {
          flex-grow: 1;
        }
  
        .safety-alert-title {
          font-weight: bold;
          color: #ff4444;
          margin-bottom: 5px;
        }
  
        .safety-alert-message {
          color: #333;
          font-size: 14px;
          line-height: 1.4;
        }
  
        .safety-alert-close {
          color: #999;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          padding: 0 4px;
        }
  
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
  
        @keyframes fadeOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  
    createAlertContainer() {
      if (!document.querySelector('.safety-alert-container')) {
        const container = document.createElement('div');
        container.className = 'safety-alert-container';
        document.body.appendChild(container);
      }
    }
  
    showAlert(message) {
      if (this.currentAlert) {
        this.currentAlert.remove();
      }
  
      const container = document.querySelector('.safety-alert-container');
      
      const alert = document.createElement('div');
      alert.className = 'safety-alert';
      alert.innerHTML = `
        <div class="safety-alert-icon">⚠️</div>
        <div class="safety-alert-content">
          <div class="safety-alert-title">Safety Alert</div>
          <div class="safety-alert-message">${message}</div>
        </div>
        <div class="safety-alert-close">×</div>
      `;
  
      const closeButton = alert.querySelector('.safety-alert-close');
      closeButton.onclick = () => {
        alert.classList.add('fade-out');
        setTimeout(() => {
          alert.remove();
          this.currentAlert = null;
        }, 300);
      };
  
      container.appendChild(alert);
      this.currentAlert = alert;
  
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (alert.parentElement) {
          alert.classList.add('fade-out');
          setTimeout(() => {
            alert.remove();
            this.currentAlert = null;
          }, 300);
        }
      }, 5000);
    }
  }
  
  // Initialize the monitor
  const monitor = new SafetyMonitor();