(function () {
  'use strict';

  var copyTimeout = null;

  function restoreStaticContent() {
    document.querySelectorAll('.section-title[data-typing]').forEach(function (el) {
      el.classList.add('visible');
      el.textContent = el.dataset.typing;
    });

    document.querySelectorAll('[data-loadbar]').forEach(function (wrap) {
      var fill = wrap.querySelector('.load-bar-fill');
      var empty = wrap.querySelector('.load-bar-empty');
      var pct = wrap.querySelector('.load-bar-pct');

      if (fill && empty && pct) {
        fill.textContent = '████████████████';
        empty.textContent = '';
        pct.textContent = ' 100%';
      }
    });
  }

  function safeSessionStorageGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSessionStorageSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      // Ignored
    }
  }

  function shouldReduceMotion() {
    if (!window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function skipBootImmediately(crtEl, overlay) {
    if (crtEl) crtEl.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
  }

  function runBootSequence(crtEl, overlay, bootScreen) {
    if (crtEl) {
      setTimeout(function () { crtEl.style.display = 'none'; }, 700);
    }
    
    if (bootScreen) {
      setTimeout(function () { bootScreen.classList.add('visible'); }, 500);
    }

    var bootLines = [
      { el: 'b-title', delay: 550, text: 'PHPONT BIOS v2.0' },
      { el: 'b-copy', delay: 600, text: 'Copyright (C) 2026 Paulo Pontarolo. All Rights Reserved.' },
      { el: 'b-sep', delay: 650, text: '────────────────────────────────────────────────────' },
      { el: 'b-cpu', delay: 750, text: 'CPU: Full-Stack Developer @ 3.2GHz' },
      { el: 'b-ram', delay: 850, text: '', special: 'ram' },
      { el: 'b-kb', delay: 1500, text: 'Keyboard............ OK' },
      { el: 'b-vid', delay: 1650, text: 'Video (CRT Phosphor). OK' },
      { el: 'b-sep2', delay: 1750, text: '' },
      { el: 'b-detect', delay: 1800, text: 'Detecting IDE drives...' },
      { el: 'b-d1', delay: 1950, text: '  Primary Master:   whoami.bin      [OK]' },
      { el: 'b-d2', delay: 2050, text: '  Primary Slave:    skills.bin      [OK]' },
      { el: 'b-d3', delay: 2150, text: '  Secondary Master: projects.bin    [OK]' },
      { el: 'b-d4', delay: 2250, text: '  Secondary Slave:  contact.bin     [OK]' },
      { el: 'b-d5', delay: 2350, text: '  Tertiary:         history.bin     [OK]' },
      { el: 'b-sep3', delay: 2450, text: '' }
    ];

    bootLines.forEach(function (item) {
      setTimeout(function () {
        var node = document.getElementById(item.el);
        if (!node) return;

        if (item.special === 'ram') {
          var memTarget = 8192;
          var memCurrent = 0;
          var memStep = 256;
          var memInterval = setInterval(function () {
            memCurrent += memStep;
            if (memCurrent >= memTarget) {
              memCurrent = memTarget;
              clearInterval(memInterval);
              node.textContent = 'Memory Test: ' + memTarget + 'K OK';
            } else {
              node.textContent = 'Memory Test: ' + memCurrent + 'K...';
            }
          }, 20);
        } else {
          node.textContent = item.text;
        }
      }, item.delay);
    });

    setTimeout(function () {
      var splash = document.getElementById('boot-splash');
      if (!splash) return;
      splash.textContent =
        ' ____  _   _ ____   ___  _   _ _____\n' +
        '|  _ \\| | | |  _ \\ / _ \\| \\ | |_   _|\n' +
        '| |_) | |_| | |_) | | | |  \\| | | |\n' +
        '|  __/|  _  |  __/| |_| | |\\  | | |\n' +
        '|_|   |_| |_|_|    \\___/|_| \\_| |_|\n' +
        '             PORTFOLIO v2.0';
      splash.classList.add('visible');
    }, 2550);

    setTimeout(function () {
      var barFill = document.querySelector('#boot-bar .bar-fill');
      var barEmpty = document.querySelector('#boot-bar .bar-empty');
      var barPct = document.querySelector('#boot-bar .bar-pct');
      if (!barFill || !barEmpty || !barPct) return;
      var total = 24;
      var step = 0;
      var barInterval = setInterval(function () {
        step++;
        barFill.textContent = '█'.repeat(step);
        barEmpty.textContent = '·'.repeat(Math.max(0, total - step));
        barPct.textContent = Math.round((step / total) * 100) + '%';
        if (step >= total) {
          clearInterval(barInterval);
          setTimeout(function () {
            var promptEl = document.getElementById('boot-prompt');
            if (promptEl) promptEl.classList.add('visible');
          }, 100);
        }
      }, 30);
    }, 2700);

    setTimeout(function () {
      if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(function () { overlay.style.display = 'none'; }, 600);
      }
    }, 4000);
  }

  function setupTypingObserver() {
    if (!window.IntersectionObserver) {
      restoreStaticContent();
      return;
    }

    var typingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var text = el.dataset.typing;
        if (!text || el.classList.contains('typed')) return;
        el.classList.add('typed', 'visible');
        el.textContent = '';
        var i = 0;
        var interval = setInterval(function () {
          el.textContent += text[i];
          i++;
          if (i >= text.length) clearInterval(interval);
        }, 30);
        typingObserver.unobserve(el);
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section-title[data-typing]').forEach(function (el) {
      typingObserver.observe(el);
    });
  }

  function setupLoadBarObserver() {
    var BAR_LEN = 16;
    if (!window.IntersectionObserver) {
       restoreStaticContent();
       return;
    }

    // Reset load bars programmatically to empty before observing
    document.querySelectorAll('[data-loadbar]').forEach(function(wrap) {
      var fill = wrap.querySelector('.load-bar-fill');
      var empty = wrap.querySelector('.load-bar-empty');
      var pct = wrap.querySelector('.load-bar-pct');
      if (fill && empty && pct) {
        fill.textContent = '';
        empty.textContent = '................';
        pct.textContent = '0%';
      }
    });

    function animateBar(wrap) {
      var fill = wrap.querySelector('.load-bar-fill');
      var empty = wrap.querySelector('.load-bar-empty');
      var pct = wrap.querySelector('.load-bar-pct');
      if (!fill || !empty || !pct) return;

      var step = 0;
      var total = BAR_LEN;
      var tick = setInterval(function () {
        step++;
        var filled = Math.round((step / total) * total);
        fill.textContent = '█'.repeat(filled);
        empty.textContent = '░'.repeat(Math.max(0, total - filled));
        pct.textContent = ' ' + Math.round((step / total) * 100) + '%';
        if (step >= total) clearInterval(tick);
      }, 50);
    }

    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        var wrap = card.querySelector('[data-loadbar]');
        if (wrap && !wrap.dataset.loaded) {
          wrap.dataset.loaded = '1';
          setTimeout(function () { animateBar(wrap); }, 200);
        }
        barObserver.unobserve(card);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.project-card[data-project]').forEach(function (el) {
      barObserver.observe(el);
    });
  }

  function copyText(btn, text) {
      if (copyTimeout) {
          clearTimeout(copyTimeout);
          copyTimeout = null;
      }

      function success() {
          btn.textContent = '[COPIADO!]';
          btn.classList.add('copied');
          copyTimeout = setTimeout(function () {
              btn.textContent = '[COPIAR]';
              btn.classList.remove('copied');
              copyTimeout = null;
          }, 2000);
      }

      function fallback() {
          var activeEl = document.activeElement;
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.top = '-9999px';
          textarea.style.left = '-9999px';
          textarea.setAttribute('readonly', '');
          document.body.appendChild(textarea);
          textarea.select();
          textarea.setSelectionRange(0, 99999);

          var successful = false;
          try {
              successful = document.execCommand('copy');
          } catch (err) {
              successful = false;
          }

          document.body.removeChild(textarea);
          if (activeEl && typeof activeEl.focus === 'function') {
              activeEl.focus();
          }

          if (successful) {
              success();
          } else {
              btn.textContent = '[ERRO]';
              btn.classList.remove('copied');
              copyTimeout = setTimeout(function () {
                  btn.textContent = '[COPIAR]';
                  copyTimeout = null;
              }, 2000);
          }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(success).catch(fallback);
      } else {
          fallback();
      }
  }

  function setupCopyEmail() {
      var btn = document.getElementById('copy-btn');
      if (!btn) return;
      btn.addEventListener('click', function () {
          copyText(btn, 'paulohponta@gmail.com');
      });
  }

  // --- Main Init ---
  try {
    var root = document.documentElement;
    var reduceMotion = shouldReduceMotion();

    var crtEl = document.getElementById('crt-turnon');
    var overlay = document.getElementById('boot-overlay');
    var bootScreen = document.getElementById('boot-screen');

    var skipBoot = safeSessionStorageGet('booted');

    if (skipBoot || reduceMotion) {
      skipBootImmediately(crtEl, overlay);
    } else {
      safeSessionStorageSet('booted', '1');
      runBootSequence(crtEl, overlay, bootScreen);
    }

    if (reduceMotion) {
      restoreStaticContent();
    } else {
      setupTypingObserver();
      setupLoadBarObserver();
    }

    setupCopyEmail();

    // Successful initialization: transition state classes and cancel failsafe
    root.classList.remove('no-js', 'js-loading');
    root.classList.add('js-ready');
    if (window.__portfolioBootFailsafe) {
      window.clearTimeout(window.__portfolioBootFailsafe);
    }
  } catch (error) {
    console.error('Portfolio initialization failed:', error);
    
    // Fallback safe state
    var root = document.documentElement;
    root.classList.remove('js-loading', 'js-ready');
    root.classList.add('no-js');
    
    var crt = document.getElementById('crt-turnon');
    var boot = document.getElementById('boot-overlay');
    if (crt) crt.style.display = 'none';
    if (boot) boot.style.display = 'none';
    
    restoreStaticContent();
    
    if (window.__portfolioBootFailsafe) {
      window.clearTimeout(window.__portfolioBootFailsafe);
    }
  }

})();
