// Utility functions for formatting and display

const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

/**
 * Format a timestamp to relative or absolute time
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  const showYear = date.getFullYear() !== now.getFullYear();
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: showYear ? 'numeric' : undefined,
  });
}

/**
 * Format a boolean value for display
 * @param {boolean} val - Boolean value
 * @returns {string} Checkmark or dash
 */
export function formatBoolean(val) {
  return val ? '✓' : '—';
}

/**
 * Create a status badge HTML string
 * @param {string} status - Status value
 * @returns {string} HTML for status badge
 */
export function statusBadge(status) {
  const statusClasses = {
    new: 'badge-new',
    pitched: 'badge-pitched',
    contacted: 'badge-contacted',
    responded: 'badge-responded',
    converted: 'badge-converted',
  };

  const className = statusClasses[status] || 'badge-default';
  return `<span class="badge ${className}">${status || 'unknown'}</span>`;
}

/**
 * Create a confidence badge HTML string
 * @param {string} confidence - Confidence level
 * @returns {string} HTML for confidence badge
 */
export function confidenceBadge(confidence) {
  const confidenceClasses = {
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  };

  const className = confidenceClasses[confidence] || 'badge-default';
  return `<span class="badge ${className}">${confidence || 'unknown'}</span>`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
}

/**
 * Show loading state in a container
 * @param {HTMLElement} container - Container element
 */
export function showLoading(container) {
  container.innerHTML = '<div class="loading">Loading...</div>';
}

/**
 * Show error state in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 */
export function showError(container, message) {
  container.innerHTML = `<div class="error">Error: ${escapeHtml(message)}</div>`;
}

/**
 * Show empty state in a container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Empty message
 */
export function showEmpty(container, message = 'No data found') {
  container.innerHTML = `<div class="empty">${escapeHtml(message)}</div>`;
}
