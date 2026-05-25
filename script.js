/* ═══════════════════════════════════════════════════════════════
   ISS TERMINAL — script.js
   Wires the DOM to TERM and CURRICULUM.
   Handles: input/output, history nav, tab completion,
            mode switching, mission progression.
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const termWrap    = document.getElementById('terminal-wrap');
  const termOutput  = document.getElementById('term-output');
  const termInput   = document.getElementById('term-input');
  const ps1Display  = document.getElementById('ps1-display');
  const btnFree     = document.getElementById('btn-free');
  const btnGuide    = document.getElementById('btn-guide');
  const panelFree   = document.getElementById('panel-free');
  const panelGuide  = document.getElementById('panel-guide');
  const missionTree = document.getElementById('mission-tree');
  const missionHud  = document.getElementById('mission-hud');
  const hudId       = document.getElementById('hud-id');
  const hudTitle    = document.getElementById('hud-title');
  const hudObj      = document.getElementById('hud-obj');
  const hudHintBtn  = document.getElementById('hud-hint-btn');
  const hudHint     = document.getElementById('hud-hint');
  const successBox  = document.getElementById('mission-success');
  const successMsg  = document.getElementById('ms-msg');
  const btnNext     = document.getElementById('ms-next');
  const btnDismiss  = document.getElementById('ms-dismiss');

  /* ── Mobile bar refs ── */
  const mobBtnFree      = document.getElementById('mob-btn-free');
  const mobBtnGuide     = document.getElementById('mob-btn-guide');
  const mobGuideCtrl    = document.getElementById('mob-guide-controls');
  const mobModulesBtn   = document.getElementById('mob-modules-btn');
  const mobDrawer       = document.getElementById('mob-drawer');
  const mobMissionTree  = document.getElementById('mob-mission-tree');
  const mobProgress     = document.getElementById('mob-mission-progress');

  /* ── Mobile drawer toggle ── */
  let drawerOpen = false;
  function setDrawer(open) {
    drawerOpen = open;
    mobDrawer.classList.toggle('open', open);
    const chevron = document.getElementById('mob-chevron');
    if (chevron) chevron.textContent = open ? '▴' : '▾';
  }
  mobModulesBtn && mobModulesBtn.addEventListener('click', () => setDrawer(!drawerOpen));

  // Close drawer when a mission is tapped
  document.addEventListener('click', (e) => {
    if (drawerOpen && e.target.closest('.mission-item') && e.target.closest('#mob-mission-tree')) {
      setDrawer(false);
    }
  });

  /* ── Mobile mode switching ── */
  function syncMobTabs(m) {
    if (!mobBtnFree) return;
    mobBtnFree.classList.toggle('active', m === 'free');
    mobBtnGuide.classList.toggle('active', m === 'guided');
    mobGuideCtrl.classList.toggle('hidden', m !== 'guided');
    if (m !== 'guided') setDrawer(false);
  }

  mobBtnFree && mobBtnFree.addEventListener('click', () => {
    btnFree.click(); // delegate to desktop button
  });
  mobBtnGuide && mobBtnGuide.addEventListener('click', () => {
    btnGuide.click(); // delegate to desktop button
  });
  const guideProgress = document.getElementById('guide-progress');

  /* ── State ── */
  let mode            = 'free';      // 'free' | 'guided'
  let currentMission  = null;        // mission object
  let missionIdx      = 0;
  let completed       = new Set();
  let histIdx         = -1;
  const localHist     = [];          // session command strings (for ↑/↓)

  /* ─────────────────────────────────────────────────────────
     OUTPUT UTILITIES
  ───────────────────────────────────────────────────────── */
  function appendLine(html, extraClass = '') {
    const div = document.createElement('div');
    div.className = 'term-line' + (extraClass ? ' ' + extraClass : '');
    div.innerHTML = html;
    termOutput.appendChild(div);
  }

  function scrollBottom() {
    termWrap.scrollTop = termWrap.scrollHeight;
  }

  function clearOutput() {
    termOutput.innerHTML = '';
  }

  function updatePS1() {
    ps1Display.innerHTML = TERM.getPromptHTML();
  }

  /* ─────────────────────────────────────────────────────────
     BOOT MESSAGE
  ───────────────────────────────────────────────────────── */
  function printBoot() {
    const lines = [
      `<span class="c-ice">ISS TERMINAL v1.0</span>  <span class="c-dim">— terminal.icestreams.io</span>`,
      `<span class="c-dim">Sandboxed Linux environment · no real system access</span>`,
      ``,
      `<span class="c-dim">Type </span><span class="c-ice">help</span><span class="c-dim"> for available commands.</span>`,
      `<span class="c-dim">Switch to </span><span class="c-ice">GUIDED</span><span class="c-dim"> mode in the sidebar for structured lessons.</span>`,
      ``,
    ];
    lines.forEach(l => appendLine(l));
    scrollBottom();
  }

  /* ─────────────────────────────────────────────────────────
     EXECUTE + RENDER
  ───────────────────────────────────────────────────────── */
  function runCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) { appendLine(''); return; }

    // Store in history
    localHist.push(trimmed);
    TERM.getState().cmdHist.push(trimmed);
    TERM.getState().execHist.push({ cmd: trimmed });
    histIdx = localHist.length;

    // Echo prompt + command
    appendLine(
      `<span class="c-dim">${ps1Display.innerHTML}</span><span class="c-cmd">${escHtml(trimmed)}</span>`,
      'tl-prompt'
    );

    // Execute
    const result = TERM.execute(trimmed);

    if (result === '__CLEAR__') {
      clearOutput();
      updatePS1();
      scrollBottom();
      return;
    }

    // vim command returns a sentinel string to open the editor overlay
    if (typeof result === 'string' && result.startsWith('__VIM__:')) {
      updatePS1();
      scrollBottom();
      openVim(result.slice(8));
      return;
    }

    if (Array.isArray(result)) {
      result.forEach(line => appendLine(typeof line === 'string' ? line : ''));
    }

    updatePS1();
    scrollBottom();

    // Check mission if in guided mode
    if (mode === 'guided' && currentMission && !completed.has(currentMission.id)) {
      checkCurrentMission();
    }
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ─────────────────────────────────────────────────────────
     VIM EDITOR
  ───────────────────────────────────────────────────────── */
  const vimOverlay    = document.getElementById('vim-overlay');
  const vimFilenameEl = document.getElementById('vim-filename');
  const vimLinesEl    = document.getElementById('vim-lines');
  const vimModeEl     = document.getElementById('vim-mode');
  const vimFileinfoEl = document.getElementById('vim-fileinfo');
  const vimStatusbar  = document.getElementById('vim-statusbar');
  const vimCmdprompt  = document.getElementById('vim-cmdprompt');
  const vimCmdtext    = document.getElementById('vim-cmdtext');

  let vim = null; // null when vim is closed

  function openVim(filePath) {
    const raw = TERM.readFile(filePath);
    const content = (raw === null) ? '' : raw;
    vim = {
      path:     filePath,
      filename: filePath.split('/').pop(),
      isNew:    raw === null,
      lines:    content === '' ? [''] : content.split('\n'),
      mode:     'normal',
      curLine:  0,
      curCol:   0,
      cmdBuf:   '',
      modified: false,
      lastKey:  '',
      statusMsg:'',
    };
    vimFilenameEl.textContent = vim.filename + (vim.isNew ? '  [New File]' : '');
    renderVim();
    vimOverlay.classList.remove('hidden');
    termInput.blur();
  }

  function closeVim() {
    vim = null;
    vimOverlay.classList.add('hidden');
    scrollBottom();
    termInput.focus();
  }

  function renderVim() {
    if (!vim) return;

    const editorHeight = document.getElementById('vim-editor-area').clientHeight;
    const lineHeight   = 22; // approximate px
    const visibleRows  = Math.max(8, Math.floor(editorHeight / lineHeight));

    const html = [];
    vim.lines.forEach((line, i) => {
      const isActive = i === vim.curLine;
      let contentHtml;

      if (isActive) {
        const col    = Math.min(vim.curCol, line.length);
        const before = escHtml(line.slice(0, col));
        const ch     = line.length === 0 || col === line.length ? ' ' : escHtml(line[col]);
        const after  = col < line.length ? escHtml(line.slice(col + 1)) : '';
        const cls    = vim.mode === 'insert' ? 'vim-cursor-insert' : 'vim-cursor-block';
        contentHtml  = `${before}<span class="${cls}">${ch}</span>${after}`;
      } else {
        contentHtml = escHtml(line) || '\u00a0';
      }

      html.push(
        `<div class="vim-line${isActive ? ' active-line' : ''}">` +
        `<span class="vim-line-number">${i + 1}</span>` +
        `<span class="vim-line-content">${contentHtml}</span>` +
        `</div>`
      );
    });

    // Tilde lines
    const tildes = Math.max(0, visibleRows - vim.lines.length);
    for (let i = 0; i < tildes; i++) {
      html.push(`<div class="vim-line"><span class="vim-tilde">~</span></div>`);
    }

    vimLinesEl.innerHTML = html.join('');

    // Scroll active line into view
    const activeEl = vimLinesEl.querySelector('.active-line');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });

    // Status bar
    const modeText = { normal: '-- NORMAL --', insert: '-- INSERT --', command: '' };
    vimModeEl.textContent     = modeText[vim.mode] || '';
    vimFileinfoEl.textContent = `${vim.filename}${vim.modified ? ' [+]' : ''}  ${vim.lines.length}L`;
    vimStatusbar.className    = 'mode-' + vim.mode;

    // Command / message bar
    if (vim.mode === 'command') {
      vimCmdprompt.textContent = ':';
      vimCmdtext.textContent   = vim.cmdBuf;
    } else if (vim.statusMsg) {
      vimCmdprompt.textContent = '';
      vimCmdtext.textContent   = vim.statusMsg;
    } else {
      vimCmdprompt.textContent = '';
      vimCmdtext.textContent   = '';
    }
  }

  // Vim keyboard handler — registered in capture phase so it wins over terminal input
  document.addEventListener('keydown', function (e) {
    if (!vim) return;
    e.preventDefault();
    e.stopPropagation();

    vim.statusMsg = ''; // clear any message on next key

    if      (vim.mode === 'normal')  vimNormal(e.key, e.ctrlKey);
    else if (vim.mode === 'insert')  vimInsert(e.key);
    else if (vim.mode === 'command') vimCommand(e.key);

    renderVim();
  }, true /* capture */);

  function vimNormal(key, ctrl) {
    const L = vim.lines.length;

    switch (key) {
      /* ── Enter modes ── */
      case 'i':
        vim.mode = 'insert'; vim.lastKey = ''; break;
      case 'a':
        vim.curCol = Math.min(vim.curCol + 1, vim.lines[vim.curLine].length);
        vim.mode = 'insert'; vim.lastKey = ''; break;
      case 'A':
        vim.curCol = vim.lines[vim.curLine].length;
        vim.mode = 'insert'; vim.lastKey = ''; break;
      case 'o':
        vim.lines.splice(vim.curLine + 1, 0, '');
        vim.curLine++; vim.curCol = 0;
        vim.mode = 'insert'; vim.modified = true; vim.lastKey = ''; break;
      case 'O':
        vim.lines.splice(vim.curLine, 0, '');
        vim.curCol = 0;
        vim.mode = 'insert'; vim.modified = true; vim.lastKey = ''; break;
      case ':':
        vim.mode = 'command'; vim.cmdBuf = ''; vim.lastKey = ''; break;

      /* ── Navigation ── */
      case 'h': case 'ArrowLeft':
        vim.curCol = Math.max(0, vim.curCol - 1); vim.lastKey = ''; break;
      case 'l': case 'ArrowRight':
        vim.curCol = Math.min(vim.lines[vim.curLine].length, vim.curCol + 1); vim.lastKey = ''; break;
      case 'j': case 'ArrowDown':
        if (vim.curLine < L - 1) { vim.curLine++; vim.curCol = Math.min(vim.curCol, vim.lines[vim.curLine].length); }
        vim.lastKey = ''; break;
      case 'k': case 'ArrowUp':
        if (vim.curLine > 0)     { vim.curLine--; vim.curCol = Math.min(vim.curCol, vim.lines[vim.curLine].length); }
        vim.lastKey = ''; break;
      case '0':
        vim.curCol = 0; vim.lastKey = ''; break;
      case '$':
        vim.curCol = vim.lines[vim.curLine].length; vim.lastKey = ''; break;
      case 'g':
        if (vim.lastKey === 'g') { vim.curLine = 0; vim.curCol = 0; vim.lastKey = ''; }
        else vim.lastKey = 'g';
        break;
      case 'G':
        vim.curLine = L - 1; vim.curCol = 0; vim.lastKey = ''; break;

      /* ── Editing ── */
      case 'd':
        if (vim.lastKey === 'd') {
          if (L > 1) { vim.lines.splice(vim.curLine, 1); vim.curLine = Math.min(vim.curLine, vim.lines.length - 1); }
          else        { vim.lines[0] = ''; }
          vim.curCol = 0; vim.modified = true; vim.lastKey = '';
        } else {
          vim.lastKey = 'd';
        }
        break;
      case 'u':
        vim.statusMsg = 'Already at oldest change'; vim.lastKey = ''; break; // simplified

      case 'Escape':
        vim.lastKey = ''; break;

      default:
        vim.lastKey = key;
    }
  }

  function vimInsert(key) {
    const line = vim.lines[vim.curLine];

    if (key === 'Escape') {
      vim.mode = 'normal';
      vim.curCol = Math.max(0, vim.curCol - 1);
      return;
    }
    if (key === 'Enter') {
      const before = line.slice(0, vim.curCol);
      const after  = line.slice(vim.curCol);
      vim.lines[vim.curLine] = before;
      vim.lines.splice(vim.curLine + 1, 0, after);
      vim.curLine++; vim.curCol = 0; vim.modified = true;
      return;
    }
    if (key === 'Backspace') {
      if (vim.curCol > 0) {
        vim.lines[vim.curLine] = line.slice(0, vim.curCol - 1) + line.slice(vim.curCol);
        vim.curCol--;
      } else if (vim.curLine > 0) {
        const prev = vim.lines[vim.curLine - 1];
        vim.curCol = prev.length;
        vim.lines[vim.curLine - 1] = prev + line;
        vim.lines.splice(vim.curLine, 1);
        vim.curLine--;
      }
      vim.modified = true;
      return;
    }
    if (key === 'ArrowLeft')  { vim.curCol = Math.max(0, vim.curCol - 1); return; }
    if (key === 'ArrowRight') { vim.curCol = Math.min(vim.lines[vim.curLine].length, vim.curCol + 1); return; }
    if (key === 'ArrowUp')    { if (vim.curLine > 0) { vim.curLine--; vim.curCol = Math.min(vim.curCol, vim.lines[vim.curLine].length); } return; }
    if (key === 'ArrowDown')  { if (vim.curLine < vim.lines.length - 1) { vim.curLine++; vim.curCol = Math.min(vim.curCol, vim.lines[vim.curLine].length); } return; }
    if (key === 'Tab') {
      vim.lines[vim.curLine] = line.slice(0, vim.curCol) + '  ' + line.slice(vim.curCol);
      vim.curCol += 2; vim.modified = true;
      return;
    }
    if (key.length === 1) {
      vim.lines[vim.curLine] = line.slice(0, vim.curCol) + key + line.slice(vim.curCol);
      vim.curCol++; vim.modified = true;
    }
  }

  function vimCommand(key) {
    if (key === 'Escape') { vim.mode = 'normal'; vim.cmdBuf = ''; return; }
    if (key === 'Backspace') {
      vim.cmdBuf = vim.cmdBuf.slice(0, -1);
      if (!vim.cmdBuf) vim.mode = 'normal';
      return;
    }
    if (key === 'Enter') { vimExecCommand(vim.cmdBuf); return; }
    if (key.length === 1) vim.cmdBuf += key;
  }

  function vimExecCommand(cmd) {
    cmd = cmd.trim();

    if (cmd === 'w' || cmd === 'w!') {
      const content = vim.lines.join('\n');
      const fname   = vim.filename;
      const lcount  = vim.lines.length;
      TERM.writeFile(vim.path, content);
      vim.modified  = false;
      vim.mode      = 'normal';
      vim.cmdBuf    = '';
      vim.statusMsg = `"${fname}" written, ${lcount}L`;
      if (mode === 'guided' && currentMission && !completed.has(currentMission.id)) {
        checkCurrentMission();
      }
      return;
    }

    if (cmd === 'q') {
      if (vim.modified) {
        vim.mode = 'normal'; vim.cmdBuf = '';
        vim.statusMsg = 'E37: No write since last change (add ! to override, or use :wq)';
        return;
      }
      closeVim();
      return;
    }

    if (cmd === 'q!') {
      closeVim();
      return;
    }

    if (cmd === 'wq' || cmd === 'wq!' || cmd === 'x') {
      const content   = vim.lines.join('\n');
      const lineCount = vim.lines.length;
      const fname     = vim.filename;
      TERM.writeFile(vim.path, content);
      if (mode === 'guided' && currentMission && !completed.has(currentMission.id)) {
        checkCurrentMission();
      }
      closeVim();
      appendLine(`<span class="c-dim">"${escHtml(fname)}" written, ${lineCount}L</span>`);
      scrollBottom();
      return;
    }

    // Unknown command
    vim.mode      = 'normal';
    vim.cmdBuf    = '';
    vim.statusMsg = `E492: Not an editor command: ${cmd}`;
  }

  /* ─────────────────────────────────────────────────────────
     INPUT HANDLING
  ───────────────────────────────────────────────────────── */
  termInput.addEventListener('keydown', function (e) {

    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      histIdx = localHist.length;
      runCommand(val);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        termInput.value = localHist[histIdx] || '';
        setTimeout(() => termInput.setSelectionRange(termInput.value.length, termInput.value.length), 0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < localHist.length - 1) {
        histIdx++;
        termInput.value = localHist[histIdx] || '';
      } else {
        histIdx = localHist.length;
        termInput.value = '';
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const { matches, prefix } = TERM.tabComplete(termInput.value);
      if (matches.length === 1) {
        const base = termInput.value.slice(0, termInput.value.length - prefix.length);
        termInput.value = base + matches[0];
      } else if (matches.length > 1) {
        appendLine(
          `<span class="c-dim">${ps1Display.innerHTML}</span><span class="c-cmd">${escHtml(termInput.value)}</span>`,
          'tl-prompt'
        );
        appendLine(matches.map(m => `<span class="c-ice">${escHtml(m)}</span>`).join('  '));
        scrollBottom();
      }
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearOutput();
      scrollBottom();
      return;
    }

    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      appendLine(`<span class="c-dim">${ps1Display.innerHTML}</span><span class="c-cmd">${escHtml(termInput.value)}</span><span class="c-dim">^C</span>`, 'tl-prompt');
      termInput.value = '';
      histIdx = localHist.length;
      scrollBottom();
      return;
    }

  });

  // Keep focus on input when clicking terminal
  termWrap.addEventListener('click', () => termInput.focus());
  document.addEventListener('keydown', function (e) {
    if (vim) return; // vim captures all input in its own listener
    if (e.target === termInput) return;
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      termInput.focus();
    }
  });

  /* ─────────────────────────────────────────────────────────
     MODE SWITCHING
  ───────────────────────────────────────────────────────── */
  btnFree.addEventListener('click', () => {
    mode = 'free';
    btnFree.classList.add('active');    btnFree.setAttribute('aria-selected','true');
    btnGuide.classList.remove('active');btnGuide.setAttribute('aria-selected','false');
    panelFree.classList.remove('hidden');
    panelGuide.classList.add('hidden');
    missionHud.classList.add('hidden');
    syncMobTabs('free');
    termInput.focus();
  });

  btnGuide.addEventListener('click', () => {
    mode = 'guided';
    btnGuide.classList.add('active');   btnGuide.setAttribute('aria-selected','true');
    btnFree.classList.remove('active'); btnFree.setAttribute('aria-selected','false');
    panelGuide.classList.remove('hidden');
    panelFree.classList.add('hidden');
    buildMissionTree();
    if (!currentMission) selectMission(0);
    else showHUD(currentMission);
    syncMobTabs('guided');
    termInput.focus();
  });

  /* ─────────────────────────────────────────────────────────
     MISSION SYSTEM
  ───────────────────────────────────────────────────────── */
  function buildMissionTree() {
    // Group missions by module, preserving order
    const modules = {};
    const moduleOrder = [];
    CURRICULUM.forEach(m => {
      if (!modules[m.module]) { modules[m.module] = []; moduleOrder.push(m.module); }
      modules[m.module].push(m);
    });

    missionTree.innerHTML = '';
    moduleOrder.forEach((modName, modIdx) => {
      const missions = modules[modName];
      const modDiv = document.createElement('div');
      modDiv.className = 'mission-module';

      // Check if this module contains the active or any complete mission
      const hasActive = missions.some(m => currentMission && currentMission.id === m.id);

      // First module open by default; others closed; always open if has active mission
      const isOpen = modIdx === 0 || hasActive;
      if (isOpen) modDiv.classList.add('open');

      // Module header (clickable)
      const head = document.createElement('div');
      head.className = 'module-head' + (hasActive ? ' has-active' : '');

      const headText = document.createElement('span');
      headText.textContent = modName;

      const chevron = document.createElement('span');
      chevron.className = 'module-chevron';
      chevron.textContent = '▶';

      head.appendChild(headText);
      head.appendChild(chevron);

      head.addEventListener('click', () => {
        modDiv.classList.toggle('open');
      });

      modDiv.appendChild(head);

      // Mission list container (collapsible)
      const missionList = document.createElement('div');
      missionList.className = 'module-missions';

      missions.forEach(m => {
        const item = document.createElement('div');
        item.className = 'mission-item'
          + (completed.has(m.id) ? ' complete' : '')
          + (currentMission && currentMission.id === m.id ? ' active' : '');
        item.dataset.id = m.id;

        const dot = document.createElement('div');
        dot.className = 'mi-status';
        const label = document.createElement('div');
        label.className = 'mi-label';
        label.textContent = `${m.id}: ${m.title}`;

        item.appendChild(dot);
        item.appendChild(label);
        item.addEventListener('click', () => {
          const idx = CURRICULUM.findIndex(x => x.id === m.id);
          if (idx !== -1) selectMission(idx);
        });
        missionList.appendChild(item);
      });

      modDiv.appendChild(missionList);
      missionTree.appendChild(modDiv);
    });

    guideProgress.textContent = `${completed.size} / ${CURRICULUM.length}`;

    // Mirror into mobile drawer
    if (mobMissionTree) {
      mobMissionTree.innerHTML = '';
      missionTree.querySelectorAll('.mission-module').forEach(mod => {
        const clone = mod.cloneNode(true);
        mobMissionTree.appendChild(clone);
        // collapsible headers
        clone.querySelector('.module-head').addEventListener('click', () => {
          clone.classList.toggle('open');
        });
        // mission item clicks
        clone.querySelectorAll('.mission-item').forEach(item => {
          item.addEventListener('click', () => {
            const idx = CURRICULUM.findIndex(x => x.id === item.dataset.id);
            if (idx !== -1) { selectMission(idx); setDrawer(false); }
          });
        });
      });
      if (mobProgress) mobProgress.textContent = `${completed.size} / ${CURRICULUM.length}`;
    }
  }

  function selectMission(idx) {
    missionIdx = Math.max(0, Math.min(idx, CURRICULUM.length - 1));
    currentMission = CURRICULUM[missionIdx];
    showHUD(currentMission);
    buildMissionTree();

    // Print mission intro to terminal
    const s = currentMission;
    appendLine('');
    appendLine(`<span class="c-ice">╔══ ${escHtml(s.id)}: ${escHtml(s.title)} ══</span>`);
    appendLine(`<span class="c-dim">${escHtml(s.brief)}</span>`);
    appendLine(`<span class="c-ice">OBJECTIVE: </span><span class="c-cmd">${escHtml(s.objective)}</span>`);
    appendLine('');
    scrollBottom();
    termInput.focus();
  }

  function showHUD(mission) {
    if (!mission) { missionHud.classList.add('hidden'); return; }
    missionHud.classList.remove('hidden');
    hudId.textContent    = mission.id;
    hudTitle.textContent = mission.title;
    hudObj.textContent   = mission.objective;
    hudHint.textContent  = mission.hint;
    hudHint.classList.remove('visible');
    hudHintBtn.textContent = '[ HINT ]';
  }

  hudHintBtn.addEventListener('click', () => {
    const visible = hudHint.classList.toggle('visible');
    hudHintBtn.textContent = visible ? '[ HIDE ]' : '[ HINT ]';
  });

  function checkCurrentMission() {
    if (!currentMission || completed.has(currentMission.id)) return;
    const state = TERM.getState();
    const vfs   = TERM.getVFS();
    try {
      if (currentMission.check(state, vfs)) {
        completeMission(currentMission);
      }
    } catch(e) { /* check fn error — silently skip */ }
  }

  function completeMission(mission) {
    completed.add(mission.id);
    buildMissionTree();

    // Show success overlay
    // Split success on \n for multi-line
    const lines = mission.success.split('\n').map(l => `<p>${escHtml(l) || '&nbsp;'}</p>`).join('');
    successMsg.innerHTML = lines;

    const isLast = missionIdx >= CURRICULUM.length - 1;
    btnNext.textContent  = isLast ? 'View Summary' : 'Next Mission →';
    successBox.classList.remove('hidden');
    termInput.blur();
  }

  btnNext.addEventListener('click', () => {
    successBox.classList.add('hidden');
    if (missionIdx < CURRICULUM.length - 1) {
      selectMission(missionIdx + 1);
    } else {
      showSummary();
    }
    termInput.focus();
  });

  btnDismiss.addEventListener('click', () => {
    successBox.classList.add('hidden');
    termInput.focus();
  });

  function showSummary() {
    appendLine('');
    appendLine(`<span class="c-ok">╔══════════════════════════════════════╗</span>`);
    appendLine(`<span class="c-ok">║  ALL MISSIONS COMPLETE               ║</span>`);
    appendLine(`<span class="c-ok">╚══════════════════════════════════════╝</span>`);
    appendLine(`<span class="c-dim">You've covered: navigation, files, text processing, permissions, scripting.</span>`);
    appendLine(`<span class="c-dim">Switch to FREE mode and explore on your own.</span>`);
    appendLine(`<span class="c-ice">Next steps: try writing a .sh script, explore /etc, practice grep pipelines.</span>`);
    appendLine('');
    scrollBottom();
  }

  /* ─────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────── */
  TERM.initCanvas();
  updatePS1();
  printBoot();
  termInput.focus();

})();
