/**
 * Ultra-Minimal Survey Widget (≤5KB min target)
 * – Unicode icons (×, ←, →, ★/☆)
 * – Delegated events (no inline handlers)
 * – Compact CSS (one-line), compact templates
 * – Responses as map { id: value }
 */

class SurveyWidgetMinimalV2 {
    constructor(opt = {}) {
        this.survey = opt.surveyData;
        this.onComplete = opt.onComplete || (() => { });
        this.onClose = opt.onClose || (() => { });
        this.container = null;
        this.i = 0;
        this.done = false;
        this.r = {}; // responses map: id -> response object
        this.ot = {}; // other text map: id -> text
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container || !this.survey) return;
        this.injectCSS();
        this.render();
        // Delegation: clicks and inputs
        this.container.addEventListener('click', (e) => this.onClick(e));
        this.container.addEventListener('input', (e) => this.onInput(e));
    }

    injectCSS() {
        if (this._cssInjected) return;
        const css = `.sv{min-width:300px;min-height:300px;font:inherit;color:inherit}.card{position:relative;display:flex;flex-direction:column;justify-content:space-between;background:transparent;color:inherit;border:1px solid currentColor;border-radius:6px;margin:16px 0;padding:16px;max-width:300px;min-height:300px;box-shadow:0 8px 12px rgba(0,0,0,.08)}.x{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:inherit;opacity:.7;cursor:pointer;font-size:24px}.x:hover{opacity:1}.body{padding:.5rem;margin-bottom:1rem;overflow:hidden;transition:opacity 0.3s ease}.qc{width:100%;height:100%;padding:0 4px}.qt{font-weight:600;margin-bottom:.5rem;font-size:18px}.qd{opacity:.8;margin-bottom:1rem;font-size:16px}.qs{margin-bottom:1rem;font-size:20px}.opts{margin-top:1.8rem;display:flex;flex-direction:column;align-items:flex-start}.req{color:#ef4444;font-size:1.2rem}.ft{padding:.5rem;display:flex;flex-direction:column}.nav{display:flex}.btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font:inherit}.btno{margin-right:.5rem;background:currentColor;color:inherit;opacity:.7}.btno:hover{opacity:.5}.btnp{border:0;background:currentColor;color:inherit}.btnp:hover{opacity:.9}.brand{margin-top:1rem;font-size:.75rem;opacity:.7;color:inherit}.brand a{color:inherit}.rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer;color:inherit}.txt{width:100%;padding:.5rem;border:1px solid currentColor;border-radius:6px;font-size:16px;background:transparent;color:inherit}.stars{display:flex;gap:.25rem;justify-content:center}.star{border:0;background:none;cursor:pointer;font-size:40px;line-height:1;color:inherit}.ltxt{width:100%}.ta{width:100%;min-height:6rem;resize:none;border:1px solid currentColor;border-radius:6px;padding:.5rem;font-size:16px;background:transparent;box-sizing:border-box;color:inherit}.ok{display:flex;align-items:center;justify-content:center;height:195px;font-size:90px;opacity:0;animation:appear 0.6s ease-out 0.2s forwards}.ok span{width:100px;height:100px;display:flex;align-items:center;justify-content:center;border-radius:100px;background:#10b981;color:white;font-size:60px}@keyframes pop{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}@keyframes appear{0%{opacity:0;transform:scale(0.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@media(max-width:400px){.card{max-width:100%;margin:8px;padding:16px}.qt{font-size:16px}.star{font-size:20px}}`;
        const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
        this._cssInjected = 1;
    }

    // ---------- Rendering ----------
    render() {
        if (!this.container) return;
        const qs = this.survey.questions, last = this.i >= qs.length;
        this.container.innerHTML =
            `<div class="sv"><div class="card">
          <button class="x" data-action="close">×</button>
          ${this.done || last ? this.renderDone() : this.renderQuestionCard(qs[this.i])}
          <div class="ft">
            ${!this.done ? `<div class="nav">
              ${this.i > 0 ? `<button class="btn btno" data-action="prev">≺</button>` : ''}
              <button class="btn btnp" data-action="next">${this.i === qs.length - 1 ? '⋗' : '≻'}</button>
            </div>`: ''}
            <div class="brand">Powered by <a href="https://opineeo.com" target="_blank"><strong>Opineeo</strong></a></div>
          </div>
        </div></div>`;
        this.focusInput();
    }

    renderQuestionCard(q) {
        return `<div class="body">
        <div class="qc">
          <h2 class="qt">${q.title}${q.required ? ` <span class="req">*</span>` : ''}</h2>
          ${q.description && q.format !== 'STATEMENT' ? `<p class="qd">${q.description}</p>` : ''}
          <div class="opts">${this.renderQuestion(q)}</div>
        </div>
      </div>`;
    }

    resp(qid, val, opt, isO) {
        return { questionId: qid, optionId: opt, textValue: typeof val === 'string' ? val : undefined, numberValue: typeof val === 'number' ? val : undefined, booleanValue: typeof val === 'boolean' ? val : undefined, isOther: isO };
    }

    renderQuestion(q) {
        const r = this.r[q.id];
        if (q.format === 'YES_NO') {
            const v = r?.booleanValue === true ? 'yes' : r?.booleanValue === false ? 'no' : null;
            return this.radioList(q.id, [
                { id: 'yes', text: q.yesLabel || 'Yes' },
                { id: 'no', text: q.noLabel || 'No' }
            ], v);
        }
        if (q.format === 'SINGLE_CHOICE') {
            const sel = r?.optionId;
            return q.options.map(o => {
                const isSel = sel === o.id;
                return `<label class="rad"><input type="radio" name="q_${q.id}" value="${o.id}" ${isSel ? 'checked' : ''} data-action="set" data-qid="${q.id}">
           <span>${o.text}</span></label>` +
                    (o.isOther ? `<div class="other" ${isSel ? '' : 'hidden'}>
            <input class="txt" type="text" placeholder="Please specify…" value="${this.ot[q.id] || ''}" data-action="other" data-qid="${q.id}">
          </div>`: '');
            }).join('');
        }
        if (q.format === 'MULTIPLE_CHOICE') {
            const sel = r?.optionId ? r.optionId.split(',') : [];
            const hasOther = sel.some(oid => q.options.find(o => o.id === oid)?.isOther);
            return q.options.map(o => {
                const isSel = sel.includes(o.id);
                return `<label class="chk"><input type="checkbox" value="${o.id}" ${isSel ? 'checked' : ''} data-action="toggle" data-qid="${q.id}">
           <span>${o.text}</span></label>` +
                    (o.isOther ? `<div class="other" ${hasOther ? '' : 'hidden'}>
            <input class="txt" type="text" placeholder="Please specify…" value="${this.ot[q.id] || ''}" data-action="other" data-qid="${q.id}">
          </div>`: '');
            }).join('');
        }
        if (q.format === 'STAR_RATING') {
            const n = r?.numberValue || 0;
            return `<div class="stars" data-qid="${q.id}" data-action="stars">
          ${[1, 2, 3, 4, 5].map(k => `<button class="star" data-star="${k}" aria-label="${k} star">${k <= n ? '★' : '☆'}</button>`).join('')}
        </div>`;
        }
        if (q.format === 'LONG_TEXT') {
            return `<div class="ltxt"><textarea class="ta" data-action="setText" data-qid="${q.id}">${r?.textValue || ''}</textarea></div>`;
        }
        if (q.format === 'STATEMENT') {
            return `<p class="qs">${q.description || ''}</p>`;
        }
        return `<p class="qd">Unsupported question type</p>`;
    }


    radioList(qid, items, v) {
        return items.map(it =>
            `<label class="rad"><input type="radio" name="q_${qid}" value="${it.id}" ${v === it.id ? 'checked' : ''} data-action="set" data-qid="${qid}">
         <span>${it.text}</span></label>`
        ).join('');
    }

    renderDone() {
        // callback + auto-close (keep behavior)
        if (!this._fired) {
            this._fired = 1;
            this.onComplete(this.pack());
            setTimeout(() => this.onClose(), 2500);
        }
        return `<div class="ok"><span>✓</span></div>`;
    }

    // ---------- Events ----------
    onClick(e) {
        const t = e.target;
        const a = t.dataset.action || t.closest('[data-action]')?.dataset.action;
        if (!a) return;

        if (a === 'close') { this.close(); return; }
        if (a === 'prev') { this.i--; this.render(); return; }
        if (a === 'next') {
            const q = this.survey.questions[this.i];
            if (q.required && !this.r[q.id]) { this.shake(); return; }
            this.i++; if (this.i >= this.survey.questions.length) this.done = true;
            this.render(); return;
        }
        if (a === 'set') { // radio/yes-no
            const qid = (t.dataset.qid || t.closest('[data-qid]')?.dataset.qid);
            const q = this.survey.questions.find(q => q.id === qid);
            const opt = q?.options?.find(o => o.id === t.value);
            if (q?.format === 'YES_NO') {
                this.r[qid] = this.resp(qid, t.value === 'yes', undefined, false);
            } else {
                this.r[qid] = this.resp(qid, undefined, t.value, opt?.isOther || false);
                if (!opt?.isOther) delete this.ot[qid];
            }
            this.render(); return;
        }
        if (a === 'toggle') { // checkbox multi
            const qid = (t.dataset.qid || t.closest('[data-qid]')?.dataset.qid);
            const q = this.survey.questions.find(q => q.id === qid);
            const opt = q?.options?.find(o => o.id === t.value);
            const cur = this.r[qid]?.optionId ? this.r[qid].optionId.split(',') : [];
            const i = cur.indexOf(t.value);
            if (i > -1) {
                cur.splice(i, 1);
                if (opt?.isOther) delete this.ot[qid];
            } else {
                cur.push(t.value);
            }
            // Check if any selected option is "Other"
            const hasOther = cur.some(oid => q?.options?.find(o => o.id === oid)?.isOther);
            this.r[qid] = this.resp(qid, undefined, cur.join(','), hasOther);
            this.render(); return;
        }
        if (a === 'stars') { // container handles star click
            const btn = t.closest('.star'); if (!btn) return;
            const qid = t.closest('[data-qid]').dataset.qid;
            this.r[qid] = this.resp(qid, Number(btn.dataset.star), undefined, false);
            this.render(); return;
        }
    }

    onInput(e) {
        const t = e.target; const a = t.dataset.action;
        if (a === 'other') {
            const qid = t.dataset.qid;
            this.ot[qid] = t.value;
        }
        if (a === 'setText') {
            const qid = t.dataset.qid;
            this.r[qid] = this.resp(qid, t.value, undefined, false);
        }
    }

    shake() {
        const q = this.container.querySelector('.qc');
        if (!q) return;
        q.style.animation = 'pop .25s ease';
        setTimeout(() => q.style.animation = '', 250);
    }

    focusInput() {
        const q = this.survey.questions[this.i];
        setTimeout(() => {
            if (q?.format === 'LONG_TEXT') this.container.querySelector('.ta')?.focus();
            else this.container.querySelector('.other:not([hidden]) .txt')?.focus();
        }, 30);
    }

    close() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        this.onClose();
    }

    pack() {
        // Convert responses to proper format with other text
        return Object.keys(this.r).map(k => {
            const r = this.r[k];
            if (r.isOther && this.ot[k]) {
                return { ...r, textValue: this.ot[k] };
            }
            return r;
        });
    }
}

window.initSurveyWidgetMinimalV2 = (opt) => new SurveyWidgetMinimalV2(opt);
