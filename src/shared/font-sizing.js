/**
 * Shared font sizing helpers for InkPages.
 *
 * Keeps the configured reader font size consistent across pages by
 * compensating for visual viewport scale on mobile browsers.
 */
(function(global) {
  'use strict';

  if (global.InkPagesFontSizing) {
    return;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeReaderFontSize(value, min, max, fallback) {
    const minSize = Number.isFinite(min) ? min : 14;
    const maxSize = Number.isFinite(max) ? max : 32;
    const fallbackSize = Number.isFinite(fallback) ? fallback : 18;
    const numericValue = Number(value);
    const normalized = Number.isFinite(numericValue) ? Math.round(numericValue) : fallbackSize;
    return clamp(normalized, minSize, maxSize);
  }

  function getViewportScale(viewport) {
    const vv = viewport || global.visualViewport;
    return vv && Number.isFinite(vv.scale) && vv.scale > 0 ? vv.scale : 1;
  }

  function getEffectiveReaderFontSize(baseFontSizePx, options) {
    const opts = options || {};
    const base = normalizeReaderFontSize(
      baseFontSizePx,
      opts.minFontSize,
      opts.maxFontSize,
      opts.fallbackFontSize
    );
    const scale = getViewportScale(opts.viewport);
    const effective = base / scale;
    const minEffective = Number.isFinite(opts.minEffective) ? opts.minEffective : 10;
    const maxEffective = Number.isFinite(opts.maxEffective) ? opts.maxEffective : 64;
    return clamp(effective, minEffective, maxEffective);
  }

  function getEffectiveUiFontSize(baseFontSizePx, options) {
    const opts = options || {};
    const baseValue = Number(baseFontSizePx);
    const fallbackSize = Number.isFinite(opts.fallbackFontSize) ? opts.fallbackFontSize : 16;
    const base = Number.isFinite(baseValue) ? baseValue : fallbackSize;
    const scale = getViewportScale(opts.viewport);
    const effective = base / scale;
    const minEffective = Number.isFinite(opts.minEffective) ? opts.minEffective : 8;
    const maxEffective = Number.isFinite(opts.maxEffective) ? opts.maxEffective : 32;
    return clamp(effective, minEffective, maxEffective);
  }

  function applyEffectiveReaderFontSize(rootEl, baseFontSizePx, options) {
    if (!rootEl) return null;
    const effective = getEffectiveReaderFontSize(baseFontSizePx, options);
    rootEl.style.setProperty('--font-size', `${effective}px`);
    return effective;
  }

  function applyEffectiveUiFontSize(rootEl, baseFontSizePx, options) {
    if (!rootEl) return null;
    const effective = getEffectiveUiFontSize(baseFontSizePx, options);
    rootEl.style.setProperty('--ui-font-size', `${effective}px`);
    return effective;
  }

  global.InkPagesFontSizing = {
    normalizeReaderFontSize,
    getViewportScale,
    getEffectiveReaderFontSize,
    getEffectiveUiFontSize,
    applyEffectiveReaderFontSize,
    applyEffectiveUiFontSize
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
