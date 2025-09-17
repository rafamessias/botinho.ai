class o {
    constructor(o = {}) {
        this.survey = o.surveyData;
        this.customCSS = o.customCSS || '';
        this.onComplete = o.onComplete || (() => { });
        this.onClose = o.onClose || (() => { });
        this.autoClose = o.autoClose || 0;
        this.container = null;
        this.i = 0;
        this.done = !1;
        this.s = !1;   // submitting state
        this.r = {};   // responses map: qid -> resp object
        this.ot = {};  // "other" free-text map: qid -> string
        this.scopeClass = null;
    }

    mount(id) {
        this.container = document.getElementById(id);
        if (!this.container || !this.survey) return;
        this.injectCSS();
        this.render();
        this.container.addEventListener("click", (e) => this.onClick(e));
        this.container.addEventListener("input", (e) => this.onInput(e));
    }

    injectCSS() {
        if (this.t) return;
        const s = document.createElement("style");
        // Identical visuals; shorter names & trimmed props. Keyframes: pop->p, appear->a
        s.textContent =
            ".sv{position:relative;display:flex;flex-direction:column;justify-content:space-between;background:transparent;color:inherit;margin:16px 0;padding:16px;min-width:300px;min-height:300px;font:inherit;overflow:hidden}" +
            ".x{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;opacity:.7;cursor:pointer;font-size:24px;color:inherit;z-index:999}.x:hover{opacity:1}" +
            ".body{padding:.5rem;margin-bottom:1rem;overflow:hidden;transition:opacity .3s ease}.qc{width:100%;height:100%;padding:0 4px}" +
            ".qt{font-weight:600;margin-bottom:.5rem;font-size:18px}.qd{opacity:.8;margin-bottom:1rem;font-size:16px}.qs{margin-bottom:1rem;font-size:20px}" +
            ".opts{margin-top:1.8rem;display:flex;flex-direction:column;align-items:flex-start}.req{color:#ef4444;font-size:1.2rem}" +
            ".ft{padding:.5rem;display:flex;flex-direction:column}.nav{display:flex}" +
            ".btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font:inherit}" +
            ".btno{margin-right:.5rem;background:currentColor;opacity:.7}.btno:hover{opacity:.5}" +
            ".btnp{border:0;background:currentColor}.btnp:hover{opacity:.9}.btn:disabled{opacity:.5;cursor:not-allowed}" +
            ".spinner{animation:spin 1s linear infinite}" +
            ".qtc{position:relative;overflow:hidden;min-height:200px;width:100%;height:auto}.qtc .qc{position:relative;width:100%;height:auto}" +
            ".q-exit-right{animation:oR .3s ease-out forwards}.q-enter-right{animation:iR .4s ease-out forwards}" +
            ".q-exit-left{animation:oL .3s ease-out forwards}.q-enter-left{animation:iL .4s ease-out forwards}" +
            ".brand{margin-top:1rem;font-size:.75rem;opacity:.7}.brand a{color:inherit}" +
            ".rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer}" +
            ".txt{width:100%;padding:.5rem;border:1px solid currentColor;border-radius:6px;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}" +
            ".stars{display:flex;justify-content:center;gap:.5rem}" +
            ".star-btn{padding:.25rem;background:none;border:none;cursor:pointer;border-radius:50%;transition:all .2s ease;display:flex;align-items:center;justify-content:center;outline:0}" +
            ".star-btn:hover{transform:scale(1.1)}.star-btn.star-sel{background-color:transparent}" +
            ".star-svg{width:30px;height:30px;transition:all .2s ease}.star-btn:hover .star-svg{transform:scale(1.1)}.star-btn:not(.star-sel) .star-svg{opacity:.3}" +
            ".ltxt{width:100%}.ta{width:100%;min-height:6rem;resize:none;border:1px solid currentColor;border-radius:6px;padding:.5rem;font-size:16px;background:transparent;box-sizing:border-box;color:inherit;font-family:inherit}" +
            ".cc{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;min-height:250px;position:relative}" +
            ".ca{margin-bottom:2rem;position:relative}" +
            ".sc-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;position:relative;animation:scaleIn .6s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 8px 25px rgba(16,185,129,.3)}" +
            ".sc-circle::before{content:'';position:absolute;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);opacity:.3;animation:pulse 2s infinite}" +
            ".sc-check{position:relative;width:24px;height:24px;transform:rotate(45deg);z-index:2}" +
            ".cs{position:absolute;width:5px;height:25px;background-color:#fff;left:15px;top:-3px;border-radius:2px;animation:checkmarkStem .4s ease-in-out .3s both}" +
            ".ck{position:absolute;width:15px;height:5px;background-color:#fff;left:4px;top:17px;border-radius:2px;animation:checkmarkKick .4s ease-in-out .5s both}" +
            "@keyframes spin{to{transform:rotate(360deg)}}" +
            "@keyframes oR{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-100%);opacity:0}}" +
            "@keyframes iR{0%{transform:translateX(100%);opacity:0}100%{transform:translateX(0);opacity:1}}" +
            "@keyframes oL{0%{transform:translateX(0);opacity:1}100%{transform:translateX(100%);opacity:0}}" +
            "@keyframes iL{0%{transform:translateX(-100%);opacity:0}100%{transform:translateX(0);opacity:1}}" +
            "@keyframes p{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(6px)}}" +
            "@keyframes a{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}" +
            "@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}" +
            "@keyframes pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.1);opacity:.1}}" +
            "@keyframes checkmarkStem{0%{height:0}100%{height:25px}}" +
            "@keyframes checkmarkKick{0%{width:0}100%{width:15px}}" +
            "@media(max-width:400px){.sv{max-width:100%;margin:8px;padding:16px}.qt{font-size:16px}.star{font-size:20px}}";
        document.head.appendChild(s);
        this.t = 1;
        this.initializeScopeClass();
        this.addCustomStyles();
    }

    initializeScopeClass() {
        if (!this.scopeClass) {
            // Create unique scope ID for this survey instance
            const scopeId = this.survey?.id || ('widget-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6));
            this.scopeClass = 'sv-scope-' + scopeId.replace(/[^a-zA-Z0-9-_]/g, '-');
        }
    }

    addCustomStyles() {
        if (!this.customCSS) return;

        // Ensure scope class is initialized
        this.initializeScopeClass();

        const styleId = 'sv-custom-styles-' + this.scopeClass.replace('sv-scope-', '');

        // Remove existing custom styles for this specific survey if they exist
        const existingCustomStyles = document.getElementById(styleId);
        if (existingCustomStyles) {
            existingCustomStyles.remove();
        }

        // Scope the CSS to this specific survey instance by adding the scope class before each selector
        const cssSelectors = [
            // Main selectors
            'sv', 'qt', 'qd', 'qc', 'opts', 'qs',
            // Button selectors
            'btn', 'btno', 'btnp',
            // Input selectors
            'rad', 'chk', 'txt', 'ta',
            // Star rating selectors
            'stars', 'star-btn', 'star-svg', 'star-sel',
            // Other UI elements
            'x', 'body', 'ft', 'nav', 'brand', 'ltxt', 'req',
            // Completion elements
            'ok', 'cc', 'ca', 'sc-circle', 'sc-check'
        ];

        let scopedCSS = this.customCSS;
        cssSelectors.forEach(selector => {
            const regex = new RegExp(`\\.${selector}\\b`, 'g');
            scopedCSS = scopedCSS.replace(regex, `.${this.scopeClass} .${selector}`);
        });

        // Create and inject new custom styles
        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = scopedCSS;
        document.head.appendChild(styleElement);
    }

    render() {
        if (!this.container) return;
        // Apply scope class to container for CSS scoping
        if (this.scopeClass) {
            this.container.className = this.scopeClass;
        }
        const qs = this.survey.questions, last = this.i >= qs.length;
        this.container.innerHTML =
            '<div class="sv">'
            + '<button class="x" data-a="close">×</button>'
            + (this.done || last ? this.renderDone() : '<div class="qtc">' + this.renderQuestionCard(qs[this.i]) + '</div>')
            + '<div class="ft">'
            + (this.done ? '' : '<div class="nav">' + (this.i > 0 ? '<button class="btn btno" data-a="prev">' + this.getPrevArrowIcon() + '</button>' : '') + '<button class="btn btnp" data-a="next" ' + (this.s ? 'disabled' : '') + '>' + (this.s ? this.getSpinnerIcon() : (this.i === qs.length - 1 ? this.getSendIcon() : this.getNextArrowIcon())) + '</button></div>')
            + '<div class="brand">Powered by <a href="https://opineeo.com" target="_blank"><b>Opineeo</b></a></div>'
            + '</div></div>';
        this.focusInput();
    }

    // ---------- Icons ----------

    getPrevArrowIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>'; }
    getNextArrowIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>'; }
    getSendIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'; }
    getSpinnerIcon() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'; }


    renderQuestionCard(q) {
        return '<div class="body"><div class="qc"><h2 class="qt">' + q.title + (q.required ? ' <span class="req">*</span>' : '') + '</h2>'
            + (q.description && q.format !== 'STATEMENT' ? '<p class="qd">' + q.description + '</p>' : '')
            + '<div class="opts">' + this.renderQuestion(q) + '</div></div></div>';
    }

    resp(id, anyVal, optId, isOther) {
        const o = { questionId: id, isOther };
        if (typeof anyVal === "string") o.textValue = anyVal;
        else if (typeof anyVal === "number") o.numberValue = anyVal;
        else if (typeof anyVal === "boolean") o.booleanValue = anyVal;
        if (optId != null) o.optionId = optId;
        return o;
    }

    renderQuestion(q) {
        const v = this.r[q.id];
        if (q.format === 'YES_NO') {
            const picked = v?.booleanValue === !0 ? "yes" : v?.booleanValue === !1 ? "no" : null;
            return this.radioList(q.id, [{ id: "yes", text: q.yesLabel || "Yes" }, { id: "no", text: q.noLabel || "No" }], picked);
        }
        if (q.format === 'SINGLE_CHOICE') {
            const cur = v?.optionId;
            return q.options.map(o => {
                const sel = cur === o.id;
                return '<label class="rad"><input type="radio" name="q_' + q.id + '" value="' + o.id + '" ' + (sel ? 'checked' : '') + ' data-a="set" data-q="' + q.id + '"><span>' + o.text + '</span></label>'
                    + (o.isOther ? '<div class="other" ' + (sel ? '' : 'hidden') + '><input class="txt" type="text" placeholder="Please specify…" value="' + (this.ot[q.id] || '') + '" data-a="other" data-q="' + q.id + '"></div>' : '');
            }).join('');
        }
        if (q.format === 'MULTIPLE_CHOICE') {
            const sel = v?.optionId ? v.optionId.split(',') : [];
            const hasOther = sel.some(id => q.options.find(x => x.id === id)?.isOther);
            return q.options.map(o => {
                const on = sel.includes(o.id);
                return '<label class="chk"><input type="checkbox" value="' + o.id + '" ' + (on ? 'checked' : '') + ' data-a="toggle" data-q="' + q.id + '"><span>' + o.text + '</span></label>'
                    + (o.isOther ? '<div class="other" ' + (hasOther ? '' : 'hidden') + '><input class="txt" type="text" placeholder="Please specify…" value="' + (this.ot[q.id] || '') + '" data-a="other" data-q="' + q.id + '"></div>' : '');
            }).join('');
        }
        if (q.format === 'STAR_RATING') {
            const n = v?.numberValue || 0;
            return '<div class="stars" data-q="' + q.id + '" data-a="stars">' + [1, 2, 3, 4, 5].map(k => '<button class="star-btn' + (k <= n ? ' star-sel' : '') + '" data-star="' + k + '" aria-label="' + k + ' star">' + '<svg class="star-svg" width="24" height="24" viewBox="0 0 24 24" fill="' + (k <= n ? '#fbbf24' : 'none') + '" stroke="' + (k <= n ? '#fbbf24' : 'currentColor') + '" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>' + '</button>').join('') + '</div>';
        }
        if (q.format === 'LONG_TEXT') {
            return '<div class="ltxt"><textarea class="ta" data-a="setText" data-q="' + q.id + '">' + (v?.textValue || '') + '</textarea></div>';
        }
        if (q.format === 'STATEMENT') {
            return '<p class="qs">' + (q.description || '') + '</p>';
        }
        return '<p class="qd">Unsupported question type</p>';
    }

    radioList(qid, items, picked) {
        return items.map(it =>
            '<label class="rad"><input type="radio" name="q_' + qid + '" value="' + it.id + '" ' + (picked === it.id ? 'checked' : '') + ' data-a="set" data-q="' + qid + '"><span>' + it.text + '</span></label>'
        ).join('');
    }

    renderDone() {
        if (this.autoClose > 0) { setTimeout(() => this.close(), this.autoClose); }
        return '<div class="cc"><div class="ca"><div class="sc-circle"><div class="sc-check"><div class="cs"></div><div class="ck"></div></div></div></div></div>';
    }

    transitionToNext() {
        if (this.i < this.survey.questions.length - 1) this.transitionToQuestion(this.i + 1, 'right');
    }
    transitionToPrevious() {
        if (this.i > 0) this.transitionToQuestion(this.i - 1, 'left');
    }

    transitionToQuestion(targetIdx, dir) {
        if (!this.container) return;
        const qc = this.container.querySelector('.qtc');
        if (!qc) { this.i = targetIdx; this.render(); return; }

        const exitClass = dir === 'right' ? 'q-exit-right' : 'q-exit-left';
        qc.classList.add(exitClass);

        setTimeout(() => {
            this.i = targetIdx;
            const newQ = this.survey.questions[this.i];
            if (!newQ) return;
            qc.innerHTML = this.renderQuestionCard(newQ);
            qc.classList.remove(exitClass);
            const enterClass = dir === 'right' ? 'q-enter-right' : 'q-enter-left';
            qc.classList.add(enterClass);
            setTimeout(() => qc.classList.remove(enterClass), 400);
            // Update next button icon
            const nextBtn = this.container.querySelector('[data-a="next"]');
            if (nextBtn) nextBtn.innerHTML = this.i === this.survey.questions.length - 1 ? this.getSendIcon() : this.getNextArrowIcon();
            this.focusInput();
        }, 300);
    }

    async handleSubmit() {
        this.s = !0;
        this.render();
        try {
            await new Promise(r => setTimeout(r, 1000));
            this.onComplete(this.pack());
            this.done = !0;
        } catch (err) {
            console.error('Submission error:', err);
        } finally {
            this.s = !1;
            this.render();
        }
    }

    onClick(ev) {
        const el = ev.target;
        const a = el.dataset.a || el.closest("[data-a]")?.dataset.a;
        if (!a) return;

        if (a === "close") { this.close(); return; }

        if (a === "prev") { this.transitionToPrevious(); return; }

        if (a === "next") {
            const q = this.survey.questions[this.i];
            if (q.required && !this.r[q.id]) { this.shake(); return; }
            if (this.i === this.survey.questions.length - 1) {
                this.handleSubmit();
            } else {
                this.transitionToNext();
            }
            return;
        }

        if (a === "set") {
            const qid = el.dataset.q || el.closest("[data-q]")?.dataset.q;
            const q = this.survey.questions.find(x => x.id === qid);
            const opt = q?.options?.find(x => x.id === el.value);
            if (q?.format === "YES_NO") {
                this.r[qid] = this.resp(qid, el.value === "yes", void 0, !1);
            } else {
                this.r[qid] = this.resp(qid, void 0, el.value, !!opt?.isOther);
                if (!opt?.isOther) delete this.ot[qid];
            }
            this.render(); return;
        }

        if (a === "toggle") {
            const qid = el.dataset.q || el.closest("[data-q]")?.dataset.q;
            const q = this.survey.questions.find(x => x.id === qid);
            const opt = q?.options?.find(x => x.id === el.value);
            const list = this.r[qid]?.optionId ? this.r[qid].optionId.split(",") : [];
            const pos = list.indexOf(el.value);
            if (pos > -1) { list.splice(pos, 1); if (opt?.isOther) delete this.ot[qid]; } else { list.push(el.value); }
            const hasOther = list.some(id => q?.options?.find(x => x.id === id)?.isOther);
            this.r[qid] = this.resp(qid, void 0, list.join(","), hasOther);
            this.render(); return;
        }

        if (a === "stars") {
            const btn = el.closest(".star-btn"); if (!btn) return;
            const qid = el.closest("[data-q]").dataset.q;
            this.r[qid] = this.resp(qid, +btn.dataset.star, void 0, !1);
            this.render(); return;
        }
    }

    onInput(ev) {
        const el = ev.target, a = el.dataset.a;
        if (a === "other") { const qid = el.dataset.q; this.ot[qid] = el.value; }
        if (a === "setText") { const qid = el.dataset.q; this.r[qid] = this.resp(qid, el.value, void 0, !1); }
    }

    shake() {
        const q = this.container.querySelector(".qc");
        if (!q) return;
        q.style.animation = "p .25s ease";
        setTimeout(() => q.style.animation = "", 250);
    }

    focusInput() {
        const q = this.survey.questions[this.i];
        setTimeout(() => {
            if (q?.format === "LONG_TEXT") { this.container.querySelector(".ta")?.focus(); }
            else { this.container.querySelector(".other:not([hidden]) .txt")?.focus(); }
        }, 30);
    }

    close() {
        if (this.container) this.container.style.display = "none";
        this.onClose();
    }

    pack() {
        return Object.keys(this.r).map(k => {
            const v = this.r[k];
            const q = this.survey.questions.find(x => x.id === k);
            const response = v.isOther && this.ot[k] ? { ...v, textValue: this.ot[k] } : v;
            return { ...response, questionTitle: q?.title || '' };
        });
    }
}

window.initSurveyWidget = (i) => new o(i);
