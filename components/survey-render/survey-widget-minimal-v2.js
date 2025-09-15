class t {
    constructor(o = {}) {
        this.survey = o.surveyData;
        this.onComplete = o.onComplete || (() => { });
        this.onClose = o.onClose || (() => { });
        this.container = null;
        this.i = 0;
        this.done = !1;
        this.r = {};   // responses map: qid -> resp object
        this.ot = {};  // "other" free-text map: qid -> string
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
        s.textContent = ".sv{min-width:300px;min-height:300px;font:inherit;color:inherit}.card{position:relative;display:flex;flex-direction:column;justify-content:space-between;background:transparent;color:inherit;border:1px solid currentColor;border-radius:6px;margin:16px 0;padding:16px;max-width:300px;min-height:300px;box-shadow:0 8px 12px rgba(0,0,0,.08)}.x{position:absolute;top:4px;right:4px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;opacity:.7;cursor:pointer;font-size:24px}.x:hover{opacity:1}.body{padding:.5rem;margin-bottom:1rem;overflow:hidden;transition:opacity .3s ease}.qc{width:100%;height:100%;padding:0 4px}.qt{font-weight:600;margin-bottom:.5rem;font-size:18px}.qd{opacity:.8;margin-bottom:1rem;font-size:16px}.qs{margin-bottom:1rem;font-size:20px}.opts{margin-top:1.8rem;display:flex;flex-direction:column;align-items:flex-start}.req{color:#ef4444;font-size:1.2rem}.ft{padding:.5rem;display:flex;flex-direction:column}.nav{display:flex}.btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:6px;cursor:pointer;font:inherit}.btno{margin-right:.5rem;background:currentColor;opacity:.7}.btno:hover{opacity:.5}.btnp{border:0;background:currentColor}.btnp:hover{opacity:.9}.brand{margin-top:1rem;font-size:.75rem;opacity:.7}.rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer}.txt{width:100%;padding:.5rem;border:1px solid currentColor;border-radius:6px;font-size:16px;background:transparent;box-sizing:border-box}.stars{display:flex;gap:.25rem;justify-content:center}.star{border:0;background:none;cursor:pointer;font-size:40px;line-height:1}.ltxt{width:100%}.ta{width:100%;min-height:6rem;resize:none;border:1px solid currentColor;border-radius:6px;padding:.5rem;font-size:16px;background:transparent;box-sizing:border-box}.ok{display:flex;align-items:center;justify-content:center;height:195px;font-size:90px;opacity:0;animation:a .6s ease-out .2s forwards}.ok span{width:100px;height:100px;display:flex;align-items:center;justify-content:center;border-radius:100px;background:#10b981;color:#fff;font-size:60px}@keyframes p{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}@keyframes a{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}@media(max-width:400px){.card{max-width:100%;margin:8px;padding:16px}.qt{font-size:16px}.star{font-size:20px}}";
        document.head.appendChild(s);
        this.t = 1;
    }

    render() {
        if (!this.container) return;
        const qs = this.survey.questions, last = this.i >= qs.length;
        this.container.innerHTML =
            '<div class="sv"><div class="card">'
            + '<button class="x" data-a="close">×</button>'
            + (this.done || last ? this.renderDone() : this.renderQuestionCard(qs[this.i]))
            + '<div class="ft">'
            + (this.done ? '' : '<div class="nav">' + (this.i > 0 ? '<button class="btn btno" data-a="prev">≺</button>' : '') + '<button class="btn btnp" data-a="next">' + (this.i === qs.length - 1 ? '⋗' : '≻') + '</button></div>')
            + '<div class="brand">Powered by <a href="https://opineeo.com" target="_blank"><b>Opineeo</b></a></div>'
            + '</div></div></div>';
        this.focusInput();
    }

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
            return '<div class="stars" data-q="' + q.id + '" data-a="stars">' + [1, 2, 3, 4, 5].map(k => '<button class="star" data-star="' + k + '" aria-label="' + k + ' star">' + (k > n ? '☆' : '★') + '</button>').join('') + '</div>';
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
        if (!this.o) { this.o = 1; this.onComplete(this.pack()); setTimeout(() => this.onClose(), 2500); }
        return '<div class="ok"><span>✓</span></div>';
    }

    onClick(ev) {
        const el = ev.target;
        const a = el.dataset.a || el.closest("[data-a]")?.dataset.a;
        if (!a) return;

        if (a === "close") { this.close(); return; }

        if (a === "prev") { this.i--; this.render(); return; }

        if (a === "next") {
            const q = this.survey.questions[this.i];
            if (q.required && !this.r[q.id]) { this.shake(); return; }
            this.i++; if (this.i >= this.survey.questions.length) this.done = !0;
            this.render(); return;
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
            const btn = el.closest(".star"); if (!btn) return;
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
            return v.isOther && this.ot[k] ? { ...v, textValue: this.ot[k] } : v;
        });
    }
}

window.initSurveyWidgetMinimalV2 = (i) => new t(i);
