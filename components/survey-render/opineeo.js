// ---------------- compact opineeo widget ----------------
class o {
    constructor(p = {}) {
        this.v = '1.0.0';
        this.survey = p.surveyData;
        this.customCSS = p.customCSS || '';
        this.onComplete = p.onComplete || (() => { });
        this.onClose = p.onClose || (() => { });
        this.autoClose = p.autoClose || 0;
        this.container = null;
        this.token = p.token || '';
        this.responseToken = p.responseToken || '';
        this.surveyId = p.surveyId || '';
        this.userId = p.userId || '';
        this.extraInfo = p.extraInfo || '';
        this.branding = p.branding || false;
        this.position = p.position || 'inline'; // 'inline', 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        this.feedbackLabel = p.feedbackLabel || 'Give Feedback';
        //this.apiUrl = 'https://app.opineeo.com/api/survey/v0';
        this.apiUrl = 'http://localhost:3000/api/survey/v0';
        this.i = 0;
        this.done = !1;
        this.s = !1;                 // submitting
        this.r = {};                 // responses
        this.ot = {};                // "other" text
        this.scopeClass = null;
        this.loading = !1;
        this.error = null;
        this.opened = this.position === 'inline'; // For anchored positions, start closed
    }

    async mount(id) {
        this.container = document.getElementById(id);
        if (!this.container) return;
        this.injectCSS();
        // Ensure container is visible
        this.container.style.display = 'block';

        // For inline mode, fetch data immediately. For anchored mode, fetch when opened
        if (this.position === 'inline') {
            if (!this.survey && this.token && this.surveyId) await this.fetchSurveyData();
            if (!this.token || !this.surveyId) this.branding = true;
            if (!this.survey) this.error = 'Survey not found';
            this.initializeScopeClass();
            this.addCustomStyles();
        }

        this.render();
        ['click', 'input'].forEach(t => this.container.addEventListener(t, e => this[`on${t[0].toUpperCase()}${t.slice(1)}`](e)));
    }

    async fetchSurveyData() {
        this.loading = !0; this.render();
        try {
            const url = `${this.apiUrl}?surveyId=${encodeURIComponent(this.surveyId)}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` }
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch survey data');
            const data = await res.json();
            const sv = data?.data;
            this.responseToken = sv.responseToken;
            this.branding = sv.branding;
            if (data?.success && sv) {
                this.survey = sv;
                if (sv.style) this.customCSS = sv.style;
            }
            else throw new Error('Invalid survey data received');

        } catch (e) { console.error('Error fetching survey data:', e); this.error = e.message || 'Failed to load survey'; }
        finally { this.loading = !1; }
    }

    injectCSS() {
        // Only inject the style if it doesn't already exist in the document
        if (document.getElementById('opineeo-style')) return;
        const styleElement = document.createElement('style');
        styleElement.id = 'opineeo-style';
        styleElement.textContent = `:root{--sv-primary-color:currentColor;--sv-secondary-bg:rgba(0,0,0,.1);--sv-secondary-border:rgba(0,0,0,.2);--sv-text-color:inherit}.sv{position:relative;display:flex;flex-direction:column;justify-content:space-between;background:transparent;color:inherit;min-width:300px;min-height:300px;font:inherit;overflow:hidden;padding:16px;border-radius:8px}.sv-anchored{position:fixed!important;z-index:9999!important;padding:16px 24px!important;background:var(--bg-secondary, #fff)!important;box-shadow:0 4px 24px rgba(0,0,0,.15);max-width:400px;width:90vw;max-height:90vh;overflow-y:auto;border-radius:12px}.sv-top-right{top:20px!important;right:20px!important;bottom:auto!important;left:auto!important}.sv-top-left{top:20px!important;left:20px!important;bottom:auto!important;right:auto!important}.sv-bottom-right{bottom:20px!important;right:20px!important;top:auto!important;left:auto!important}.sv-bottom-left{bottom:20px!important;left:20px!important;top:auto!important;right:auto!important}.sv-feedback-btn{position:fixed;z-index:9998;padding:8px 16px;background:var(--bg-secondary, #fff);color:inherit;border:1px solid rgba(0,0,0,.1);border-radius:8px;cursor:pointer;font:inherit;font-size:13px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,.08);transition:all .2s ease;backdrop-filter:blur(10px)}.sv-feedback-btn:hover{box-shadow:0 4px 12px rgba(0,0,0,.12);border-color:rgba(0,0,0,.15);transform:translateY(-1px)}.sv-feedback-btn.btn-top-right,.sv-feedback-btn.btn-bottom-right{right:20px}.sv-feedback-btn.btn-top-left,.sv-feedback-btn.btn-bottom-left{left:20px}.sv-feedback-btn.btn-top-right,.sv-feedback-btn.btn-top-left{top:20px}.sv-feedback-btn.btn-bottom-right,.sv-feedback-btn.btn-bottom-left{bottom:20px}.x{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;opacity:.7;cursor:pointer;font-size:24px;color:inherit;z-index:999}.x:hover{opacity:1}.body{margin-bottom:1rem;overflow:hidden;transition:opacity .3s ease}.qc{width:100%;height:100%;}.qt{font-weight:600;margin-bottom:.5rem;font-size:18px;text-align:start}.qd{opacity:.8;margin-bottom:1rem;font-size:16px;text-align:start}.qs{margin-bottom:1rem;font-size:20px}.opts{margin-top:1.8rem;display:flex;flex-direction:column;align-items:flex-start}.req{color:#ef4444;font-size:1.2rem}.ft{display:flex;flex-direction:column}.nav{display:flex}.btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font:inherit;transition:all .2s ease}.btno{margin-right:.5rem;background:#262626;border:1px solid var(--sv-secondary-border);color:#fff}.btno:hover{background:rgba(0,0,0,.15);border-color:rgba(0,0,0,.3)}.btnp{border:1px solid rgba(0,0,0,.3);background:#8881DF;color:#fff}.btnp:hover{opacity:.7}.btn:disabled{opacity:.5;cursor:not-allowed}.spinner{animation:spin 1s linear infinite}.qtc{position:relative;overflow:hidden;min-height:200px;width:100%;height:auto}.qtc .qc{position:relative;width:100%;height:auto}.q-exit-right{animation:oR .3s ease-out forwards}.q-enter-right{animation:iR .4s ease-out forwards}.q-exit-left{animation:oL .3s ease-out forwards}.q-enter-left{animation:iL .4s ease-out forwards}.brand{margin-top:1rem;font-size:.75rem;opacity:.7;text-align:start}.brand a{color:inherit}.rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer}.txt{width:100%;padding:.5rem;border:1px solid currentColor;border-radius:6px;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}.stars{display:flex;justify-content:center;gap:.5rem}.star-btn{padding:.25rem;background:none;border:none;cursor:pointer;border-radius:50%;transition:all .2s ease;display:flex;align-items:center;justify-content:center;outline:0}.star-btn:hover{transform:scale(1.1)}.star-btn.star-sel{background-color:transparent}.star-svg{width:30px;height:30px;transition:all .2s ease}.star-btn:hover .star-svg{transform:scale(1.1)}.star-btn:not(.star-sel) .star-svg{opacity:.3}.ltxt{width:100%}.ta{width:100%;min-height:6rem;resize:none;border:1px solid currentColor;border-radius:6px;padding:.5rem;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}.cc{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;min-height:250px;position:relative}.ca{margin-bottom:2rem;position:relative}.sc-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;position:relative;animation:scaleIn .6s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 8px 25px rgba(16,185,129,.3)}.sc-circle::before{content:'';position:absolute;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);opacity:.3;animation:pulse 2s infinite}.sc-check{position:relative;width:24px;height:24px;transform:rotate(45deg);z-index:2}.cs{position:absolute;width:5px;height:25px;background-color:#fff;left:15px;top:-3px;border-radius:2px;animation:checkmarkStem .4s ease-in-out .3s both}.ck{position:absolute;width:15px;height:5px;background-color:#fff;left:4px;top:17px;border-radius:2px;animation:checkmarkKick .4s ease-in-out .5s both}@keyframes spin{to{transform:rotate(360deg)}}@keyframes oR{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-100%);opacity:0}}@keyframes iR{0%{transform:translateX(100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes oL{0%{transform:translateX(0);opacity:1}100%{transform:translateX(100%);opacity:0}}@keyframes iL{0%{transform:translateX(-100%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes p{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(6px)}}@keyframes a{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.1);opacity:.1}}@keyframes checkmarkStem{0%{height:0}100%{height:25px}}@keyframes checkmarkKick{0%{width:0}100%{width:15px}}@media(max-width:400px){.sv{max-width:100%;}.qt{font-size:16px}.star{font-size:20px}}`;
        document.head.appendChild(styleElement);
        this.t = 1;
    }

    initializeScopeClass() {
        if (!this.scopeClass) {
            const id = this.survey?.id || ('widget-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6));
            this.scopeClass = 'sv-scope-' + id.replace(/[^a-zA-Z0-9-_]/g, '-');
        }
    }

    addCustomStyles() {
        if (!this.customCSS) return;
        this.initializeScopeClass();
        const styleId = 'sv-custom-styles-' + this.scopeClass.replace('sv-scope-', '');
        document.getElementById(styleId)?.remove();
        const sels = ['sv', 'qt', 'qd', 'qc', 'opts', 'qs', 'btn', 'btno', 'btnp', 'rad', 'chk', 'txt', 'ta', 'stars', 'star-btn', 'star-svg', 'star-sel', 'x', 'body', 'ft', 'nav', 'brand', 'ltxt', 'req', 'ok', 'cc', 'ca', 'sc-circle', 'sc-check'];
        let css = this.customCSS;
        sels.forEach(c => css = css.replace(new RegExp(`\\.${c}\\b`, 'g'), `.${this.scopeClass} .${c}`));
        const st = document.createElement('style');
        st.id = styleId; st.textContent = css; document.head.appendChild(st);
    }

    render() {
        if (!this.container) return;
        if (this.scopeClass) this.container.className = this.scopeClass;

        // If anchored and not opened, show feedback button
        if (this.position !== 'inline' && !this.opened) {
            this.container.innerHTML = `<button class="sv-feedback-btn btn-${this.position}" data-a="open-survey">${this.feedbackLabel}</button>`;
            return;
        }

        const qs = this.survey?.questions || [], last = this.i >= qs.length;
        const positionClass = this.position !== 'inline' ? ` sv-anchored sv-${this.position}` : '';
        const closeBtn = this.position !== 'inline' ? `<button class="x" data-a="close" aria-label="Close">&times;</button>` : '';
        const head = `<div class="sv${positionClass}">` + closeBtn;
        const load = this.loading ? `<div class="cc"><div class="ca">${this.getSLoadingIcon()}</div>` : '';
        const unavailableFeedback = this.error || (!this.survey && !this.loading) ? `<div class="cc"><div class="ca">${this.getUnavailableIcon()}</div><p>Survey not available</p></div>` : '';
        const body = qs.length ? (this.done || last ? this.renderDone() : `<div class="qtc">${this.renderQuestionCard(qs[this.i])}</div>`)
            + `<div class="ft">${this.done ? '' : `<div class="nav">${this.i > 0 ? `<button class="btn btno" data-a="prev">${this.getPrevArrowIcon()}</button>` : ''}<button class="btn btnp" data-a="next" ${this.s ? 'disabled' : ''}>${this.s ? this.getSpinnerIcon() : (this.i === qs.length - 1 ? this.getSendIcon() : this.getNextArrowIcon())}</button></div>`}</div>` : '';
        const footer = (this.branding ? '<div class="brand">Powered by <a href="https://opineeo.com" target="_blank"><b>Opineeo</b></a></div>' : '') + '</div>';
        this.container.innerHTML = head + load + unavailableFeedback + body + footer;
        this.focusInput();
    }

    // icons
    getPrevArrowIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>'; }
    getNextArrowIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground, rgba(255,255,255,.7))" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>'; }
    getSendIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground, rgba(255,255,255,.7))" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'; }
    getSpinnerIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground, rgba(255,255,255,.7))" stroke-width="2" class="spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'; }
    getSLoadingIcon() {
        return `<div style="display: flex; align-items: center; justify-content: center; width: 80px; height: 80px; margin: 0 auto;">
            <div style="width: 60px; height: 60px; border: 4px solid rgba(0,0,0,0.1); border-top: 4px solid var(--primary, #3b82f6); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        </div>`;
    }
    getUnavailableIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M12 15h.01"/><path d="M12 7v4"/></svg>`;
    }

    renderQuestionCard(q) {
        return `<div class="body"><div class="qc"><h2 class="qt">${q.title}${q.required ? ' <span class="req">*</span>' : ''}</h2>${q.description && q.format !== 'STATEMENT' ? `<p class="qd">${q.description}</p>` : ''}<div class="opts">${this.renderQuestion(q)}</div></div></div>`;
    }

    resp(id, v, optId, isOther) {
        const o = { questionId: id, isOther };
        const t = typeof v;
        if (t === 'string') o.textValue = v; else if (t === 'number') o.numberValue = v; else if (t === 'boolean') o.booleanValue = v;
        if (optId != null) o.optionId = optId;
        return o;
    }

    renderQuestion(q) {
        const v = this.r[q.id];
        if (q.format === 'YES_NO') {
            const picked = v?.booleanValue === !0 ? 'yes' : v?.booleanValue === !1 ? 'no' : null;
            return this.radioList(q.id, [{ id: 'yes', text: q.yesLabel || 'Yes' }, { id: 'no', text: q.noLabel || 'No' }], picked);
        }
        if (q.format === 'SINGLE_CHOICE') {
            const cur = v?.optionId;
            return q.options.map(o => {
                const sel = cur === o.id;
                return `<label class="rad"><input type="radio" name="q_${q.id}" value="${o.id}" ${sel ? 'checked' : ''} data-a="set" data-q="${q.id}"><span>${o.text}</span></label>` + (o.isOther ? `<div class="other" ${sel ? '' : 'hidden'}><input class="txt" type="text" placeholder="Please specify…" value="${this.ot[q.id] || ''}" data-a="other" data-q="${q.id}"></div>` : '');
            }).join('');
        }
        if (q.format === 'MULTIPLE_CHOICE') {
            const sel = v?.optionId ? v.optionId.split(',') : [];
            const hasOther = sel.some(id => q.options.find(x => x.id === id)?.isOther);
            return q.options.map(o => {
                const on = sel.includes(o.id);
                return `<label class="chk"><input type="checkbox" value="${o.id}" ${on ? 'checked' : ''} data-a="toggle" data-q="${q.id}"><span>${o.text}</span></label>` + (o.isOther ? `<div class="other" ${hasOther ? '' : 'hidden'}><input class="txt" type="text" placeholder="Please specify…" value="${this.ot[q.id] || ''}" data-a="other" data-q="${q.id}"></div>` : '');
            }).join('');
        }
        if (q.format === 'STAR_RATING') {
            const n = v?.numberValue || 0;
            return `<div class="stars" data-q="${q.id}" data-a="stars">` + [1, 2, 3, 4, 5].map(k => `<button class="star-btn${k <= n ? ' star-sel' : ''}" data-star="${k}" aria-label="${k} star"><svg class="star-svg" width="24" height="24" viewBox="0 0 24 24" fill="${k <= n ? '#fbbf24' : 'none'}" stroke="${k <= n ? '#fbbf24' : 'currentColor'}" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg></button>`).join('') + `</div>`;
        }
        if (q.format === 'LONG_TEXT') return `<div class="ltxt"><textarea class="ta" data-a="setText" data-q="${q.id}">${v?.textValue || ''}</textarea></div>`;
        if (q.format === 'STATEMENT') return `<p class="qs">${q.description || ''}</p>`;
        return '<p class="qd">Unsupported question type</p>';
    }

    radioList(qid, items, picked) {
        return items.map(it => `<label class="rad"><input type="radio" name="q_${qid}" value="${it.id}" ${picked === it.id ? 'checked' : ''} data-a="set" data-q="${qid}"><span>${it.text}</span></label>`).join('');
    }

    renderDone() {
        if (this.autoClose > 0) setTimeout(() => this.close(), this.autoClose);
        return '<div class="cc"><div class="ca"><div class="sc-circle"><div class="sc-check"><div class="cs"></div><div class="ck"></div></div></div></div></div>';
    }

    transitionToNext() { if (this.i < this.survey.questions.length - 1) this.transitionToQuestion(this.i + 1, 'right'); }
    transitionToPrevious() { if (this.i > 0) this.transitionToQuestion(this.i - 1, 'left'); }

    transitionToQuestion(targetIdx, dir) {
        if (!this.container) return;
        const qc = this.container.querySelector('.qtc');
        if (!qc) { this.i = targetIdx; this.render(); return; }
        const exit = dir === 'right' ? 'q-exit-right' : 'q-exit-left';
        const enter = dir === 'right' ? 'q-enter-right' : 'q-enter-left';
        qc.classList.add(exit);
        setTimeout(() => {
            this.i = targetIdx;
            const newQ = this.survey.questions[this.i]; if (!newQ) return;
            qc.innerHTML = this.renderQuestionCard(newQ);
            qc.classList.remove(exit); qc.classList.add(enter);
            setTimeout(() => qc.classList.remove(enter), 400);
            this.render(); this.focusInput();
        }, 300);
    }

    async handleSubmit() {
        this.s = !0; this.render();
        try {
            const payload = await this.pack();
            if (this.token && this.responseToken) {
                try {
                    const res = await fetch(this.apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.token}` },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json();
                    if (!res.ok) console.error('Failed to submit survey response: ' + data.error);
                } catch (e) { console.error('Submission error:', e); }
            }
            this.onComplete(payload);
            this.done = !0;
        } catch (e) { console.error('Submission error:', e); }
        finally { this.s = !1; this.render(); }
    }

    async onClick(ev) {
        if (!this.container) return;
        const el = ev.target, a = el.dataset.a || el.closest('[data-a]')?.dataset.a; if (!a) return;

        // Handle opening the survey for anchored positions
        if (a === 'open-survey') {
            this.opened = true;
            if (!this.survey && this.token && this.surveyId) {
                await this.fetchSurveyData();
            }
            if (!this.token || !this.surveyId) this.branding = true;
            if (!this.survey) this.error = 'Survey not found';
            this.initializeScopeClass();
            this.addCustomStyles();
            this.render();
            return;
        }

        // Close should always work, regardless of survey state
        if (a === 'close') return this.close();

        // Guard clause: if survey is destroyed, ignore other clicks
        if (!this.survey) return;
        if (a === 'prev') return this.transitionToPrevious();
        if (a === 'next') {
            const q = this.survey.questions[this.i];
            if (!this.isValidQuestion(q)) return this.shake();
            return this.i === this.survey.questions.length - 1 ? this.handleSubmit() : this.transitionToNext();
        }
        if (a === 'set') {
            const qid = el.dataset.q || el.closest('[data-q]')?.dataset.q;
            const q = this.survey.questions.find(x => x.id === qid);
            const opt = q?.options?.find(x => x.id === el.value);
            this.r[qid] = q?.format === 'YES_NO' ? this.resp(qid, el.value === 'yes', void 0, !1) : this.resp(qid, void 0, el.value, !!opt?.isOther);
            if (!opt?.isOther) delete this.ot[qid];
            return this.render();
        }
        if (a === 'toggle') {
            const qid = el.dataset.q || el.closest('[data-q]')?.dataset.q;
            const q = this.survey.questions.find(x => x.id === qid);
            const opt = q?.options?.find(x => x.id === el.value);
            const list = this.r[qid]?.optionId ? this.r[qid].optionId.split(',') : [];
            const i = list.indexOf(el.value);
            if (i > -1) { list.splice(i, 1); if (opt?.isOther) delete this.ot[qid]; } else list.push(el.value);
            const hasOther = list.some(id => q?.options?.find(x => x.id === id)?.isOther);
            this.r[qid] = this.resp(qid, void 0, list.join(','), hasOther);
            return this.render();
        }
        if (a === 'stars') {
            const btn = el.closest('.star-btn'); if (!btn) return;
            const qid = el.closest('[data-q]').dataset.q;
            this.r[qid] = this.resp(qid, +btn.dataset.star, void 0, !1);
            return this.render();
        }
    }

    onInput(ev) {
        // Guard clause: if survey is destroyed, ignore input
        if (!this.survey || !this.container) return;
        const el = ev.target, a = el.dataset.a; if (!a) return;
        const qid = el.dataset.q;
        if (a === 'other') this.ot[qid] = el.value;
        if (a === 'setText') this.r[qid] = this.resp(qid, el.value, void 0, !1);
    }

    shake() {
        if (!this.container) return;
        const q = this.container.querySelector('.qc'); if (!q) return;
        q.style.animation = 'p .25s ease'; setTimeout(() => q.style.animation = '', 250);
    }

    isValidQuestion(q) {
        const r = this.r[q.id];
        return !q.required || (r && (!r.isOther || (this.ot[q.id] && this.ot[q.id].trim() !== '')));
    }

    focusInput() {
        if (!this.container || !this.survey || !this.survey.questions) return;
        const q = this.survey.questions[this.i];
        setTimeout(() => {
            if (!this.container) return;
            (q?.format === 'LONG_TEXT' ? this.container.querySelector('.ta') : this.container.querySelector('.other:not([hidden]) .txt'))?.focus();
        }, 30);
    }

    close() {
        // Destroy completely for all positions
        this.destroy();
        this.onClose();
        // Remove the widget from DOM
        // For anchored positions, the container is inside a custom element that's added to body
        // We need to remove the custom element itself
        if (this.container) {
            const customElement = this.container.parentNode; // opineeo-survey element
            if (customElement && customElement.parentNode) {
                customElement.parentNode.removeChild(customElement);
            }
        }
    }

    destroy() {
        // Remove event listeners
        if (this.container) {
            ['click', 'input'].forEach(t => this.container.removeEventListener(t, e => this[`on${t[0].toUpperCase()}${t.slice(1)}`](e)));
        }
        // Clear container content
        if (this.container) {
            this.container.innerHTML = '';
        }
        // Reset all state
        this.container = null;
        this.survey = null;
        this.r = {};
        this.ot = {};
        this.i = 0;
        this.done = false;
        this.s = false;
        this.loading = false;
        this.error = null;
    }

    async pack() {
        const responses = Object.keys(this.r).map(k => {
            const v = this.r[k];
            const q = this.survey.questions.find(x => x.id === k);

            let textValue = v.textValue || '';
            let answers = null;

            // Add textValue for YES_NO, SINGLE_CHOICE, MULTIPLE_CHOICE
            if (q) {
                if (q.format === 'YES_NO') {
                    if (typeof v.booleanValue === 'boolean') {
                        textValue = v.booleanValue
                            ? (q.yesLabel || 'Yes')
                            : (q.noLabel || 'No');
                    }
                } else if (q.format === 'MULTIPLE_CHOICE') {
                    // For MULTIPLE_CHOICE, optionId is a comma-separated string of IDs
                    const selectedOptionIds = v.optionId
                        .split(',')
                        .map(id => id.trim())
                        .filter(id => !!id);

                    // Defensive: ensure q.options is an array
                    const optionsArray = Array.isArray(q.options) ? q.options : [];

                    // Find all selected options by id
                    const selectedOptions = selectedOptionIds
                        .map(optionId => optionsArray.find(opt => opt.id === optionId))
                        .filter(opt => !!opt);

                    // Create answers array with optionId, textValue, and isOther for each selected option
                    answers = selectedOptions.map(opt => {
                        const answer = {
                            optionId: opt.id,
                            textValue: opt.text || '',
                            isOther: opt.isOther || false
                        };

                        // If this is an "Other" option and user provided text, use that as textValue
                        if (opt.isOther && this.ot && this.ot[k]) {
                            answer.textValue = this.ot[k];
                        }

                        return answer;
                    });

                    // Set textValue to empty for multiple choice since we're using answers array
                    textValue = '';

                } else if (q.format === 'SINGLE_CHOICE') {
                    // SINGLE_CHOICE: optionId is string
                    const selectedOption = q.options.find(opt => opt.id === v.optionId);
                    textValue = selectedOption ? selectedOption.text : '';
                }
            }


            // If isOther and has other text, override textValue
            if (v.isOther && this.ot[k] && q.format !== 'MULTIPLE_CHOICE') {
                textValue = this.ot[k];
            }

            const response = {
                ...v,
                textValue,
                questionTitle: q?.title || '',
                questionFormat: q?.format || ''
            };

            // Add answers array for multiple choice questions
            if (q?.format === 'MULTIPLE_CHOICE' && answers) {
                response.answers = answers;
            }

            return response;
        });

        const payload = {
            responseToken: this.responseToken,
            surveyId: this.surveyId,
            responses: responses
        };

        if (this.userId) {
            payload.userId = this.userId;
        }

        if (this.extraInfo) {
            payload.extraInfo = this.extraInfo;
        }

        return payload;
    }
}

window.initSurveyWidget = i => new o(i);

// ---------------- compact web component wrapper (light DOM) ----------------
(() => {
    if (customElements.get('opineeo-survey')) return;

    function resolveHandler(path) {

        if (!path) return null;
        let ctx = window;
        for (const key of path.split('.')) {
            ctx = ctx?.[key];
        }
        return typeof ctx === 'function' ? ctx : null;
    }

    class OpineeoSurveyElement extends HTMLElement {
        static get observedAttributes() {
            return ['survey-id', 'token', 'auto-close', 'user-id', 'extra-info', 'custom-css', 'oncomplete', 'onclose', 'survey', 'position', 'feedback-label'];
        }

        constructor() {
            super();
            this._id = 'opn-' + Math.random().toString(36).slice(2);
            this._widget = null;
            this._surveyData = undefined;
            this._customCSS = undefined;
        }

        connectedCallback() {
            if (!this._mounted) {
                const c = document.createElement('div');
                c.id = this._id;
                this.appendChild(c);
                this._mounted = true;
            }
            this._mount();
        }
        disconnectedCallback() { this._widget?.destroy?.(); this._widget = null; }
        attributeChangedCallback() { if (this._mounted) this._mount(); }

        get surveyData() { return this._surveyData; }
        set surveyData(v) { this._surveyData = v; if (this._mounted) this._mount(); }
        get customCSS() { return this._customCSS; }
        set customCSS(v) { this._customCSS = v; if (this._mounted) this._mount(); }

        _mount() {
            const onCompName = this.getAttribute('oncomplete');
            const onClosName = this.getAttribute('onclose');
            const onCompFn = resolveHandler(onCompName);
            const onClosFn = resolveHandler(onClosName);

            // Parse survey data from survey attribute
            let surveyDataFromAttr = null;
            const surveyAttr = this.getAttribute('survey');
            if (surveyAttr) {
                try {
                    surveyDataFromAttr = JSON.parse(surveyAttr);
                } catch (e) {
                    console.warn('Invalid JSON in survey attribute:', e);
                }
            }

            const opts = {
                surveyId: this.getAttribute('survey-id') || '',
                token: this.getAttribute('token') || '',
                autoClose: +(this.getAttribute('auto-close') || 0),
                userId: this.getAttribute('user-id') || '',
                extraInfo: this.getAttribute('extra-info') === '',
                surveyData: surveyDataFromAttr || this._surveyData,
                customCSS: this.getAttribute('custom-css') || this._customCSS,
                position: this.getAttribute('position') || 'inline',
                feedbackLabel: this.getAttribute('feedback-label') || 'Give Feedback',
                onComplete: (data) => {
                    onCompFn?.(data, this);
                    this.dispatchEvent(new CustomEvent('complete', { detail: data }));
                },
                onClose: () => {
                    onClosFn?.(this);
                    this.dispatchEvent(new Event('close'));
                    // The widget's close() method handles DOM removal
                }
            };
            this._widget = new o(opts);
            this._widget.mount(this._id);
        }
    }

    customElements.define('opineeo-survey', OpineeoSurveyElement);
})();
