/**
 * JurisAI Application Controller
 * Handles UI interactions, state management, speech synthesis, and workflow execution.
 */

import { LegalGenAIEngine } from './genai-engine.js';
import { SAMPLE_DOCUMENTS, CONTRACT_COMPARISONS } from './sample-docs.js';

class JurisAIApp {
  constructor() {
    this.engine = new LegalGenAIEngine();
    this.currentDoc = SAMPLE_DOCUMENTS.saas_msa;
    this.currentComparison = CONTRACT_COMPARISONS[0];
    this.activeLanguage = "en";
    this.isSpeaking = false;

    this.initElements();
    this.bindEvents();
    this.updateApiStatusUI();
    this.renderCurrentDocument();
    this.populateComparatorDefaults();
  }

  initElements() {
    // Nav & Tabs
    this.tabs = document.querySelectorAll('.tab-btn');
    this.tabViews = document.querySelectorAll('.tab-view');
    this.apiStatusBtn = document.getElementById('api-status-btn');
    this.apiStatusDot = document.getElementById('api-status-dot');
    this.apiStatusText = document.getElementById('api-status-text');
    this.langSelect = document.getElementById('lang-select');
    this.openSettingsBtn = document.getElementById('open-settings-btn');

    // Document Simplifier controls
    this.sampleDocSelect = document.getElementById('sample-doc-select');
    this.pasteCustomBtn = document.getElementById('paste-custom-btn');
    this.analyzeDocBtn = document.getElementById('analyze-doc-btn');
    this.analyzeBtnText = document.getElementById('analyze-btn-text');
    this.customInputCard = document.getElementById('custom-input-card');
    this.hideCustomInputBtn = document.getElementById('hide-custom-input-btn');
    this.customDocTextarea = document.getElementById('custom-doc-textarea');

    // Dashboard Metrics
    this.metricDensity = document.getElementById('metric-density');
    this.metricOrigTime = document.getElementById('metric-orig-time');
    this.metricAiTime = document.getElementById('metric-ai-time');
    this.metricRiskCount = document.getElementById('metric-risk-count');

    // Summary & Clauses
    this.summaryBulletsList = document.getElementById('summary-bullets-list');
    this.playTtsBtn = document.getElementById('play-tts-btn');
    this.clausesList = document.getElementById('clauses-list');
    this.filterAllBtn = document.getElementById('filter-all-btn');
    this.filterHighBtn = document.getElementById('filter-high-btn');

    // Comparator
    this.runComparisonBtn = document.getElementById('run-comparison-btn');
    this.comparatorDocA = document.getElementById('comparator-doc-a');
    this.comparatorDocB = document.getElementById('comparator-doc-b');
    this.diffCardsContainer = document.getElementById('diff-cards-container');
    this.overallRiskDeltaBadge = document.getElementById('overall-risk-delta-badge');

    // Workbench
    this.workbenchContainer = document.getElementById('workbench-clauses-container');

    // Chat
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');
    this.chatMessagesContainer = document.getElementById('chat-messages-container');
    this.chipBtns = document.querySelectorAll('.chip-btn');

    // Modal
    this.apiModal = document.getElementById('api-modal');
    this.closeModalBtn = document.getElementById('close-modal-btn');
    this.saveApiKeyBtn = document.getElementById('save-api-key-btn');
    this.clearApiKeyBtn = document.getElementById('clear-api-key-btn');
    this.modalApiKeyInput = document.getElementById('modal-api-key-input');
  }

  bindEvents() {
    // Tab Switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        this.tabViews.forEach(v => v.classList.remove('active'));
        tab.classList.add('active');
        const targetView = document.getElementById(tab.dataset.tab);
        if (targetView) targetView.classList.add('active');
      });
    });

    // Sample Document Selection
    this.sampleDocSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'custom') {
        this.customInputCard.style.display = 'block';
      } else {
        this.customInputCard.style.display = 'none';
        if (SAMPLE_DOCUMENTS[val]) {
          this.currentDoc = SAMPLE_DOCUMENTS[val];
          this.renderCurrentDocument();
        }
      }
    });

    this.pasteCustomBtn.addEventListener('click', () => {
      this.sampleDocSelect.value = 'custom';
      this.customInputCard.style.display = 'block';
      this.customDocTextarea.focus();
    });

    this.hideCustomInputBtn.addEventListener('click', () => {
      this.customInputCard.style.display = 'none';
    });

    this.analyzeDocBtn.addEventListener('click', () => this.handleAnalyzeDocument());

    // Language change
    this.langSelect.addEventListener('change', (e) => {
      this.activeLanguage = e.target.value;
      this.handleAnalyzeDocument();
    });

    // TTS Audio Reader
    this.playTtsBtn.addEventListener('click', () => this.toggleTTS());

    // Clause Filters
    this.filterAllBtn?.addEventListener('click', () => this.filterClauses('all'));
    this.filterHighBtn?.addEventListener('click', () => this.filterClauses('high'));

    // Comparator Trigger
    this.runComparisonBtn.addEventListener('click', () => this.handleRunComparison());

    // Chat Form Submit
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSendChatMessage();
    });

    this.chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        this.chatInput.value = query;
        this.handleSendChatMessage();
      });
    });
  }

  updateApiStatusUI() {
    // API is securely running server-side
  }

  async handleAnalyzeDocument() {
    let rawText = "";
    if (this.sampleDocSelect.value === 'custom') {
      rawText = this.customDocTextarea.value.trim();
      if (!rawText) {
        alert("Please paste contract text into the custom input box before analyzing.");
        return;
      }
    } else {
      rawText = this.currentDoc.rawText;
    }

    this.setLoadingState(true);

    try {
      const processed = await this.engine.processDocument(rawText, this.activeLanguage);
      this.currentDoc = processed;
      this.renderCurrentDocument();
    } catch (err) {
      alert(`Document analysis error: ${err.message}`);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.analyzeDocBtn.disabled = true;
      this.analyzeBtnText.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    } else {
      this.analyzeDocBtn.disabled = false;
      this.analyzeBtnText.textContent = '✨ Simplify Document';
    }
  }

  renderCurrentDocument() {
    const doc = this.currentDoc;

    // Metrics
    this.metricDensity.textContent = `${doc.legaleseDensity || 70}%`;
    this.metricOrigTime.textContent = doc.estReadingTime || '20 mins';
    this.metricAiTime.textContent = doc.simplifiedReadingTime || '3 mins';

    const highRisks = (doc.clauses || []).filter(c => c.severity === 'high').length;
    this.metricRiskCount.textContent = `${highRisks} Critical`;

    // Summary Bullets
    this.summaryBulletsList.innerHTML = '';
    const bullets = doc.summary || [
      "Key obligations established between contracting parties.",
      "Identified critical notice periods and automatic renewal schedules.",
      "Review high-risk clauses highlighted below."
    ];

    bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      this.summaryBulletsList.appendChild(li);
    });

    // Clause Cards
    this.renderClauses(doc.clauses || []);
    this.renderWorkbench(doc.clauses || []);
  }

  renderClauses(clauses) {
    this.clausesList.innerHTML = '';

    if (clauses.length === 0) {
      this.clausesList.innerHTML = `<p style="color: var(--text-muted);">No clauses detected in this document.</p>`;
      return;
    }

    clauses.forEach(c => {
      const card = document.createElement('div');
      card.className = `clause-card severity-${c.severity || 'low'}`;
      card.dataset.severity = c.severity || 'low';

      const badgeClass = c.severity === 'high' ? 'badge-high' : c.severity === 'medium' ? 'badge-medium' : 'badge-low';
      const badgeText = c.severity === 'high' ? '⚠️ High Risk' : c.severity === 'medium' ? '⚡ Moderate Risk' : '✅ Standard Safe';

      card.innerHTML = `
        <div class="clause-header">
          <div class="clause-title">${c.title}</div>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>

        <div style="margin-bottom: 0.75rem;">
          <h4 style="font-size: 0.78rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem;">
            💡 Plain English Translation
          </h4>
          <p style="font-size: 0.92rem; color: #fff; font-weight: 500;">${c.simplified}</p>
        </div>

        <div class="clause-grid">
          <div class="clause-box">
            <h4>📜 Legal Text (Raw Clause)</h4>
            <p class="clause-raw">${c.rawText}</p>
          </div>

          <div class="clause-box">
            <h4>🎯 Operational Impact & Loophole Risk</h4>
            <p style="margin-bottom: 0.4rem;"><strong>Impact:</strong> ${c.impact || 'Standard provision.'}</p>
            <p style="color: var(--severity-high);"><strong>Potential Trap:</strong> ${c.loopholes || 'None detected.'}</p>
          </div>
        </div>

        <div class="clause-box" style="margin-top: 0.75rem; background: rgba(6, 182, 212, 0.06); border-color: rgba(6, 182, 212, 0.2);">
          <h4>🤝 Recommended Negotiation Counter-Clause</h4>
          <p style="color: var(--text-main); font-style: italic;">"${c.fairDraft || c.recommendation || 'Standard language.'}"</p>
        </div>
      `;

      this.clausesList.appendChild(card);
    });
  }

  filterClauses(type) {
    const cards = this.clausesList.querySelectorAll('.clause-card');
    cards.forEach(card => {
      if (type === 'all') {
        card.style.display = 'block';
      } else if (type === 'high') {
        card.style.display = card.dataset.severity === 'high' ? 'block' : 'none';
      }
    });
  }

  renderWorkbench(clauses) {
    this.workbenchContainer.innerHTML = '';
    
    const targetClauses = clauses.filter(c => c.severity === 'high' || c.severity === 'medium');
    if (targetClauses.length === 0) {
      this.workbenchContainer.innerHTML = `<p style="color: var(--text-muted);">All contract clauses are balanced and safe.</p>`;
      return;
    }

    targetClauses.forEach(c => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.padding = '1.25rem';
      
      card.innerHTML = `
        <div class="card-title-bar" style="margin-bottom: 0.5rem;">
          <h3 style="font-size: 1rem; color: var(--accent-cyan);">${c.title} - Negotiation Template</h3>
          <button class="btn btn-secondary copy-btn" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;">📋 Copy Counter-Clause</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">
          <strong>Original Risk:</strong> ${c.simplified}
        </p>
        <div style="background: rgba(7, 10, 18, 0.8); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: var(--radius-sm); font-family: monospace; font-size: 0.82rem; color: #10b981;">
          ${c.fairDraft}
        </div>
      `;

      const copyBtn = card.querySelector('.copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(c.fairDraft);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Counter-Clause', 2000);
      });

      this.workbenchContainer.appendChild(card);
    });
  }

  populateComparatorDefaults() {
    this.comparatorDocA.value = `MUTUAL NON-DISCLOSURE AGREEMENT
1. Confidential Information: Both parties agree to protect proprietary technical, financial, and product data disclosed under this agreement.
2. Non-Solicitation: Neither party shall solicit the employees of the other party during the term.
3. Jurisdiction: Governed by the laws of Delaware, USA.`;

    this.comparatorDocB.value = `MUTUAL NON-DISCLOSURE AGREEMENT (COUNTERPROPOSAL)
1. Confidential Information: Protected information is strictly limited to Vendor's marked disclosures. Client's verbal info is excluded.
2. Non-Solicitation: Client agrees not to hire Vendor employees for 2 years. Penalty equal to 200% annual salary.
3. Jurisdiction: Governed by the laws of London, UK, under English Courts.`;

    this.renderComparisonResults(CONTRACT_COMPARISONS[0]);
  }

  async handleRunComparison() {
    const docA = this.comparatorDocA.value.trim();
    const docB = this.comparatorDocB.value.trim();

    if (!docA || !docB) {
      alert("Please enter text for both Document A and Document B to compare.");
      return;
    }

    this.runComparisonBtn.disabled = true;
    this.runComparisonBtn.innerHTML = '<span class="loading-spinner"></span> Comparing...';

    try {
      const result = await this.engine.compareContracts(docA, docB);
      this.renderComparisonResults(result);
    } catch (err) {
      alert(`Comparison error: ${err.message}`);
    } finally {
      this.runComparisonBtn.disabled = false;
      this.runComparisonBtn.textContent = '✨ Compare Contracts';
    }
  }

  renderComparisonResults(comp) {
    this.overallRiskDeltaBadge.textContent = comp.overallRiskDelta || 'Modifications Detected';
    this.diffCardsContainer.innerHTML = '';

    const diffs = comp.diffSummary || [];
    diffs.forEach(d => {
      const card = document.createElement('div');
      card.className = 'diff-card';

      const statusClass = d.status || 'modified';
      card.innerHTML = `
        <div class="diff-header">
          <strong style="font-family: var(--font-heading); font-size: 0.95rem;">${d.clause}</strong>
          <span class="diff-status ${statusClass}">${d.status}</span>
        </div>

        <div class="diff-comparison-box">
          <div class="diff-side doc-a">
            <strong style="display: block; color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.2rem;">Doc A (Your Draft)</strong>
            ${d.docA_Text || '[Not present]'}
          </div>
          <div class="diff-side doc-b">
            <strong style="display: block; color: var(--accent-cyan); font-size: 0.75rem; margin-bottom: 0.2rem;">Doc B (Their Counter-Draft)</strong>
            ${d.docB_Text || '[Not present]'}
          </div>
        </div>

        <div class="diff-explanation">
          <strong>Plain Meaning:</strong> ${d.plainMeaning}<br>
          <span style="color: var(--severity-high);"><strong>Impact:</strong> ${d.impact}</span>
        </div>
      `;

      this.diffCardsContainer.appendChild(card);
    });
  }

  async handleSendChatMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.appendChatMessage(text, 'user');
    this.chatInput.value = '';

    const typingMsg = this.appendChatMessage('JurisAI is searching contract clauses...', 'assistant');

    try {
      const docContext = this.currentDoc.rawText || JSON.stringify(this.currentDoc);
      const response = await this.engine.chatAssistant(text, docContext);
      typingMsg.querySelector('.message-bubble').innerHTML = this.formatMarkdown(response);
    } catch (err) {
      typingMsg.querySelector('.message-bubble').textContent = `Error: ${err.message}`;
    }
  }

  appendChatMessage(content, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerHTML = `<div class="message-bubble">${content}</div>`;
    this.chatMessagesContainer.appendChild(msg);
    this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    return msg;
  }

  formatMarkdown(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^>\s*(.+)$/gm, '<blockquote style="border-left: 3px solid var(--accent-cyan); padding-left: 0.6rem; color: #cbd5e1; margin: 0.4rem 0;">$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.4); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  toggleTTS() {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.playTtsBtn.innerHTML = '<span>🔊 Listen Audio Summary</span>';
    } else {
      const bullets = (this.currentDoc.summary || []).join('. ');
      const textToRead = `${this.currentDoc.title || 'Legal Document Summary'}. Key summary: ${bullets}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => {
        this.isSpeaking = false;
        this.playTtsBtn.innerHTML = '<span>🔊 Listen Audio Summary</span>';
      };

      window.speechSynthesis.speak(utterance);
      this.isSpeaking = true;
      this.playTtsBtn.innerHTML = '<span>⏹️ Stop Audio Reader</span>';
    }
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new JurisAIApp();
});
