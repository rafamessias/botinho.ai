class o {
    constructor(o = {}) {
        this.surveyId = o.surveyId;
        this.surveyData = o.surveyData;
        this.testMode = o.testMode || false;
        this.onComplete = o.onComplete || (() => { });
        this.onError = o.onError || (() => { });
        this.onClose = o.onClose || (() => { });
        this.autoClose = o.autoClose || false;
        this.container = null;
        this.survey = null;
        this.i = 0;
        this.r = [];
        this.ot = {};
        this.l = true;
        this.s = false;
        this.c = false;
        this.e = null;
        this.init();
    }

    async init() {
        try {
            if (this.surveyData) {
                this.survey = this.surveyData;
                this.l = false;
                if (this.container) this.render();
            } else if (this.surveyId) {
                await this.loadSurvey();
            } else {
                this.onError("Either surveyId or surveyData must be provided");
            }
        } catch (error) {
            this.onError(error.message || "Failed to initialize survey");
        }
    }

    async loadSurvey() {
        try {
            if (this.surveyData) {
                this.survey = this.surveyData;
            } else {
                throw new Error("Survey loading not implemented in vanilla version");
            }
            this.l = false;
            if (this.container) this.render();
        } catch (error) {
            this.onError(error.message || "Failed to load survey");
        }
    }

    render() {
        if (!this.container) return;
        if (this.l) { this.renderLoading(); return; }
        if (this.c) { this.renderCompleted(); return; }
        if (!this.survey) { this.renderError("Survey not found"); return; }
        if (this.survey.status !== 'published' && !this.testMode) { this.renderError("This survey is not available"); return; }
        this.renderSurvey();
    }

    renderLoading() {
        if (!this.container) return;
        this.container.innerHTML = '<div class="sw-loading"><div class="sw-spinner"></div></div>';
    }

    renderError(message) {
        if (!this.container) return;
        this.container.innerHTML = '<div class="sw-error"><p class="sw-error-msg">' + message + '</p></div>';
    }

    renderCompleted() {
        if (!this.container) return;
        const style = this.survey?.style || this.getDefaultStyle();
        const ref = this.widgetId ? 'window.' + this.widgetId : 'window.surveyWidget';
        this.container.innerHTML = '<div class="sw" style="min-width:300px;min-height:300px;"><div class="sc" style="' + this.getStyleVariables(style) + '"><div class="x" onclick="' + ref + '.handleClose()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></div><div class="cc"><div class="ca"><div class="sc-circle"><div class="sc-check"><div class="cs"></div><div class="ck"></div></div></div></div></div><div class="sf"> ' + this.renderBranding() + '</div></div></div>';
        this.addCompletionStyles();
        if (this.autoClose) setTimeout(() => this.handleClose(), 8000);
    }

    addCompletionStyles() {
        if (document.getElementById('sw-completion-styles')) return;
        const s = document.createElement('style');
        s.id = 'sw-completion-styles';
        s.textContent = '.cc{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;min-height:250px;position:relative}.ca{margin-bottom:2rem;position:relative}.sc-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;position:relative;animation:scaleIn .6s cubic-bezier(.68,-.55,.265,1.55);box-shadow:0 8px 25px rgba(16,185,129,.3)}.sc-circle::before{content:"";position:absolute;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);opacity:.3;animation:pulse 2s infinite}.sc-check{position:relative;width:24px;height:24px;transform:rotate(45deg);z-index:2}.cs{position:absolute;width:5px;height:25px;background-color:white;left:15px;top:-3px;border-radius:2px;animation:checkmarkStem .4s ease-in-out .3s both}.ck{position:absolute;width:15px;height:5px;background-color:white;left:4px;top:17px;border-radius:2px;animation:checkmarkKick .4s ease-in-out .5s both}@keyframes scaleIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.1);opacity:.1}}@keyframes checkmarkStem{0%{height:0}100%{height:25px}}@keyframes checkmarkKick{0%{width:0}100%{width:15px}}@media(max-width:400px){.sc-circle{width:60px;height:60px}.sc-circle::before{width:80px;height:80px}.cs{width:2px;height:10px;left:7px;top:3px}.ck{width:6px;height:2px;left:4px;top:9px}}';
        document.head.appendChild(s);
    }

    renderSurvey() {
        if (!this.container) return;
        if (!this.survey?.questions || this.survey.questions.length === 0) { this.renderError("No questions available"); return; }
        const q = this.survey.questions[this.i];
        if (!q) { this.renderError("Question not found"); return; }
        const last = this.i === this.survey.questions.length - 1;
        const first = this.i === 0;
        const style = this.survey.style || this.getDefaultStyle();
        const ref = this.widgetId ? 'window.' + this.widgetId : 'window.surveyWidget';
        this.container.innerHTML = '<div class="sw" style="min-width:300px;min-height:300px;"><div class="sc" style="' + this.getStyleVariables(style) + '"><div class="x" onclick="' + ref + '.handleClose()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></div><div class="sc-content"><div class="qtc">' + this.renderQuestion(q, style, ref) + '</div></div><div class="sf"><div class="sn"><button class="btn btn-outline btn-prev" onclick="' + ref + '.handlePrevious()" ' + (first ? 'disabled' : '') + '><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button><button class="btn btn-primary btn-next" onclick="' + ref + '.handleNext()" ' + (this.s ? 'disabled' : '') + '>' + (this.s ? this.getSpinnerIcon() : (last ? this.getSendIcon() : this.getNextArrowIcon())) + '</button></div>' + this.renderBranding() + '</div></div></div></div>';
        this.addStyles();
    }

    renderBranding() {
        return '<div class="sb"><div class="sb-text"><p>Powered by <a href="https://opineeo.com" target="_blank"><strong>Opineeo</strong></a></p></div></div>'
    }

    renderQuestion(q, style, ref = 'window.surveyWidget') {
        if (!q) return '';
        const resp = this.r.find(r => r.questionId === q.id);
        const req = q.required;
        const err = this.e === q.id;
        return '<div class="qc' + (err ? ' qc-error' : '') + '"><h2 class="qt">' + q.title + (req ? ' <span class="qr">*</span>' : '') + '</h2>' + (q.description && q.format !== 'STATEMENT' ? '<p class="qd">' + q.description + '</p>' : '') + '<div class="opts">' + this.renderQuestionOptions(q, resp, style, ref) + '</div></div>';
    }

    renderQuestionOptions(q, resp, style, ref = 'window.surveyWidget') {
        switch (q.format) {
            case 'YES_NO': return this.renderYesNoOptions(q, resp, ref);
            case 'SINGLE_CHOICE': return this.renderSingleChoiceOptions(q, resp, ref);
            case 'MULTIPLE_CHOICE': return this.renderMultipleChoiceOptions(q, resp, ref);
            case 'STAR_RATING': return this.renderStarRatingOptions(q, resp, ref);
            case 'LONG_TEXT': return this.renderLongTextOptions(q, resp, ref);
            case 'STATEMENT': return this.renderStatementOptions(q);
            default: return '<p>Unsupported question format</p>';
        }
    }

    renderYesNoOptions(q, resp, ref = 'window.surveyWidget') {
        const yes = resp?.booleanValue === true ? 'true' : '';
        const no = resp?.booleanValue === false ? 'false' : '';
        return '<div class="yno"><label class="rad"><input type="radio" name="q_' + q.id + '" value="true" ' + (yes ? 'checked' : '') + ' onchange="' + ref + '.handleResponseChange(\'' + q.id + '\',true,undefined,false)"><span class="rad-text">' + (q.yesLabel || 'Yes') + '</span></label><label class="rad"><input type="radio" name="q_' + q.id + '" value="false" ' + (no ? 'checked' : '') + ' onchange="' + ref + '.handleResponseChange(\'' + q.id + '\',false,undefined,false)"><span class="rad-text">' + (q.noLabel || 'No') + '</span></label></div>';
    }

    renderSingleChoiceOptions(q, resp, ref = 'window.surveyWidget') {
        const reg = q.options.filter(opt => !opt.isOther);
        let html = reg.map(opt => {
            const sel = resp?.optionId === opt.id;
            return '<label class="rad"><input type="radio" name="q_' + q.id + '" value="' + opt.id + '" ' + (sel ? 'checked' : '') + ' onchange="' + ref + '.handleResponseChange(\'' + q.id + '\',\'' + opt.id + '\',\'' + opt.id + '\',false)"><span class="rad-text">' + opt.text + '</span></label>';
        }).join('');
        const other = q.options.find(opt => opt.isOther);
        if (other) {
            const sel = resp?.optionId === other.id;
            html += '<label class="rad"><input type="radio" name="q_' + q.id + '" value="' + other.id + '" ' + (sel ? 'checked' : '') + ' onchange="' + ref + '.handleResponseChange(\'' + q.id + '\',\'' + other.id + '\',\'' + other.id + '\',true)"><span class="rad-text">' + other.text + '</span></label>' + (sel ? '<div class="oi"><input type="text" class="oif" placeholder="Specify..." value="' + (this.ot[q.id] || '') + '" oninput="' + ref + '.handleOtherTextChangeImmediate(\'' + q.id + '\',this.value)"></div>' : '');
        }
        return html;
    }

    renderMultipleChoiceOptions(q, resp, ref = 'window.surveyWidget') {
        const sel = resp?.optionId?.split(',') || [];
        const reg = q.options.filter(opt => !opt.isOther);
        let html = reg.map((opt, idx) => {
            const id = opt.id || 'option_' + idx;
            const chk = sel.includes(id);
            return '<label class="chk"><input type="checkbox" value="' + id + '" ' + (chk ? 'checked' : '') + ' onchange="' + ref + '.handleMultipleChoiceChange(\'' + q.id + '\',\'' + id + '\',this.checked)"><span class="chk-text">' + opt.text + '</span></label>';
        }).join('');
        const other = q.options.find(opt => opt.isOther);
        if (other) {
            const id = other.id || 'option_other';
            const chk = sel.includes(id);
            html += '<label class="chk"><input type="checkbox" value="' + id + '" ' + (chk ? 'checked' : '') + ' onchange="' + ref + '.handleMultipleChoiceChange(\'' + q.id + '\',\'' + id + '\',this.checked)"><span class="chk-text">' + other.text + '</span></label>';
            if (chk) {
                html += '<div class="oi"><input type="text" class="oif" placeholder="Specify..." value="' + (this.ot[q.id] || '') + '" oninput="' + ref + '.handleOtherTextChangeImmediate(\'' + q.id + '\',this.value)"></div>';
            }
        }
        return html;
    }

    renderStarRatingOptions(q, resp, ref = 'window.surveyWidget') {
        const rating = resp?.numberValue || 0;
        return '<div class="stars">' + [1, 2, 3, 4, 5].map(star => '<button type="button" class="star-btn' + (star <= rating ? ' star-sel' : '') + '" onclick="' + ref + '.handleResponseChange(\'' + q.id + '\',' + star + ')"><svg class="star-svg" width="24" height="24" viewBox="0 0 24 24" fill="' + (star <= rating ? '#fbbf24' : 'none') + '" stroke="' + (star <= rating ? '#fbbf24' : 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg></button>').join('') + '</div>';
    }

    renderLongTextOptions(q, resp, ref = 'window.surveyWidget') {
        return '<div class="ltxt"><textarea class="ltxt-ta" placeholder="" oninput="' + ref + '.handleResponseChange(\'' + q.id + '\',this.value,undefined,false,true)">' + (resp?.textValue || '') + '</textarea></div>';
    }

    renderStatementOptions(q) {
        return '<div class="stmt"><p class="stmt-text">' + q.description + '</p></div>';
    }

    handleResponseChange(qid, val, optId, isOther = false, skipRender = false) {
        const idx = this.r.findIndex(r => r.questionId === qid);
        const finalOptId = optId || (idx >= 0 ? this.r[idx].optionId : undefined);
        const newResp = { questionId: qid, optionId: finalOptId, textValue: typeof val === 'string' ? val : undefined, numberValue: typeof val === 'number' ? val : undefined, booleanValue: typeof val === 'boolean' ? val : undefined, isOther };
        if (idx >= 0) this.r[idx] = newResp; else this.r.push(newResp);
        if (!isOther) delete this.ot[qid];
        if (this.e === qid) this.e = null;
        if (!skipRender) this.render();

        // Focus for single choice "Other" option
        if (isOther && optId) {
            const q = this.survey.questions[this.i];
            const isOtherOption = q?.options.find(opt => opt.id === optId)?.isOther;
            if (isOtherOption) this.f('.oif');
        }
    }

    handleMultipleChoiceChange(qid, optId, checked) {
        const resp = this.r.find(r => r.questionId === qid);
        if (resp) {
            const opts = resp.optionId ? resp.optionId.split(',') : [];
            if (checked) {
                if (!opts.includes(optId)) opts.push(optId);
                resp.optionId = opts.join(',');
            } else {
                const filtered = opts.filter(id => id !== optId);
                resp.optionId = filtered.length > 0 ? filtered.join(',') : undefined;
            }
        } else if (checked) {
            this.r.push({ questionId: qid, optionId: optId });
        }
        const q = this.survey.questions[this.i];
        const isOther = q?.options.find(opt => (opt.id || 'option_' + q.options.indexOf(opt)) === optId)?.isOther;
        if (isOther && !checked) delete this.ot[qid];
        if (this.e === qid) this.e = null;
        this.render();
        if (checked && isOther) this.f('.oif');
    }

    f(s) { setTimeout(() => this.container.querySelector(s)?.focus(), 0) }

    handleOtherTextChange(qid, val) {
        this.ot[qid] = val;
        this.handleResponseChange(qid, val, undefined, true);
    }

    handleOtherTextChangeImmediate(qid, val) {
        this.ot[qid] = val;
        this.handleResponseChange(qid, val, undefined, true, true);
    }

    handleClose() {
        this.onClose();
        this.unmount();
    }

    handleNext() {
        if (!this.survey?.questions || this.survey.questions.length === 0) { this.onError("No questions available"); return; }
        const q = this.survey.questions[this.i];
        if (q?.required) {
            const hasResp = this.r.some(r => r.questionId === q.id);
            if (!hasResp) { this.e = q.id; this.render(); return; }
        }
        this.e = null;
        const last = this.i === this.survey.questions.length - 1;
        if (last) this.handleSubmit(); else this.transitionToNext();
    }

    handlePrevious() {
        if (this.i > 0) this.transitionToPrevious();
    }

    transitionToNext() {
        this.transitionToQuestion(this.i + 1, 'right');
    }

    transitionToPrevious() {
        this.transitionToQuestion(this.i - 1, 'left');
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
            if (newQ) {
                const style = this.survey.style || this.getDefaultStyle();
                const ref = this.widgetId ? 'window.' + this.widgetId : 'window.surveyWidget';
                qc.innerHTML = this.renderQuestion(newQ, style, ref);
                qc.classList.remove(exitClass);
                const enterClass = dir === 'right' ? 'q-enter-right' : 'q-enter-left';
                qc.classList.add(enterClass);
                setTimeout(() => qc.classList.remove(enterClass), 300);

                // Focus for long text questions
                if (newQ.format === 'LONG_TEXT') this.f('.ltxt-ta');
            }
        }, 200);
    }

    async handleSubmit() {
        if (this.testMode) { this.onComplete(this.r); return; }
        this.s = true;
        this.render();
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.onComplete(this.r);
            this.c = true;
        } catch (error) {
            this.onError(error.message || "Failed to submit survey");
        } finally {
            this.s = false;
            this.render();
        }
    }

    getDefaultStyle() {
        return { backgroundColor: "transparent", textColor: "inherit", buttonBackgroundColor: "currentColor", buttonTextColor: "inherit", margin: "16px 0px", padding: "16px", border: "none", borderRadius: "6px", titleFontSize: "inherit", bodyFontSize: "inherit", fontFamily: "inherit", accentColor: "currentColor", errorColor: "#ef4444", borderColor: "transparent", outlineButtonBg: "transparent", outlineButtonText: "inherit", outlineButtonHoverBg: "rgba(0,0,0,.05)", outlineButtonHoverBorder: "transparent", inputBorder: "rgba(0,0,0,.2)", inputRadius: ".375rem", inputBg: "inherit", shadowColor: "rgba(0,0,0,.1)" };
    }

    getStyleVariables(style) {
        // Only set CSS variables if custom styles are provided, otherwise inherit from page
        const vars = [];
        if (style.backgroundColor && style.backgroundColor !== "transparent") vars.push('--sw-bg:' + style.backgroundColor);
        if (style.textColor && style.textColor !== "inherit") vars.push('--sw-text:' + style.textColor);
        if (style.buttonBackgroundColor && style.buttonBackgroundColor !== "currentColor") vars.push('--sw-btn-bg:' + style.buttonBackgroundColor);
        if (style.buttonTextColor && style.buttonTextColor !== "inherit") vars.push('--sw-btn-text:' + style.buttonTextColor);
        if (style.fontFamily && style.fontFamily !== "inherit") vars.push('--sw-font:' + style.fontFamily);
        if (style.borderRadius && style.borderRadius !== "6px") vars.push('--sw-radius:' + style.borderRadius);
        if (style.margin && style.margin !== "16px 0px") vars.push('--sw-margin:' + style.margin);
        if (style.padding && style.padding !== "16px") vars.push('--sw-padding:' + style.padding);
        if (style.titleFontSize && style.titleFontSize !== "inherit") vars.push('--sw-title:' + style.titleFontSize);
        if (style.bodyFontSize && style.bodyFontSize !== "inherit") vars.push('--sw-body:' + style.bodyFontSize);
        if (style.accentColor && style.accentColor !== "currentColor") vars.push('--sw-accent:' + style.accentColor);
        if (style.errorColor && style.errorColor !== "#ef4444") vars.push('--sw-error:' + style.errorColor);
        if (style.inputBorder && style.inputBorder !== "rgba(0,0,0,.2)") vars.push('--sw-input-border:' + style.inputBorder);
        if (style.shadowColor) vars.push('--sw-shadow:' + style.shadowColor);

        // Only use CSS variables when explicit custom styles are provided, otherwise inherit
        let baseStyle = '';
        if (vars.length > 0) {
            // Use CSS variables only when custom styles exist
            baseStyle = 'font-family:var(--sw-font,inherit);color:var(--sw-text,inherit);background-color:var(--sw-bg,inherit);border-radius:var(--sw-radius,6px);margin:var(--sw-margin,16px 0px);padding:var(--sw-padding,16px)';
            // Add accent color support for form elements
            if (style.accentColor && style.accentColor !== "currentColor") {
                baseStyle += ';accent-color:var(--sw-accent,' + style.accentColor + ')';
            }
            return vars.join(';') + ';' + baseStyle;
        } else {
            // Pure inheritance when no custom styles
            return 'font-family:inherit;color:inherit;background-color:inherit;border-radius:6px;margin:16px 0px;padding:16px';
        }
    }

    getNextArrowIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
    }

    getSendIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';
    }

    getSpinnerIcon() {
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
    }

    addStyles() {
        if (document.getElementById('sw-styles')) return;
        const s = document.createElement('style');
        s.id = 'sw-styles';
        s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideOutRight{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-50%);opacity:0}}@keyframes slideInRight{0%{transform:translateX(50%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes slideOutLeft{0%{transform:translateX(0);opacity:1}100%{transform:translateX(50%);opacity:0}}@keyframes slideInLeft{0%{transform:translateX(-50%);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}.sw{min-width:300px;min-height:300px;font-family:inherit;color:inherit}.sw *{box-sizing:border-box;color:inherit;font-family:inherit}.sc{box-shadow:0 10px 25px -5px var(--sw-shadow,rgba(0,0,0,.1)),0 10px 10px -5px var(--sw-shadow,rgba(0,0,0,.04));max-width:300px;min-height:300px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;position:relative;border:none}.x{position:absolute;top:.25rem;right:.25rem;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s ease;z-index:10;opacity:.7;background:transparent;border:0}.x:hover{opacity:1}.x svg{color:currentColor;transition:all .2s ease}.sc-content{padding:.5rem;margin-bottom:1rem;overflow:hidden;position:relative}.qtc{position:relative;overflow:hidden;min-height:200px;width:100%;height:auto}.qtc .qc{position:relative;width:100%;height:auto}.q-exit-right{animation:slideOutRight .2s ease-out forwards}.q-enter-right{animation:slideInRight .3s ease-out forwards}.q-exit-left{animation:slideOutLeft .2s ease-out forwards}.q-enter-left{animation:slideInLeft .3s ease-out forwards}.sf{padding:.5rem;display:flex;flex-direction:column;justify-content:space-between;padding-top:0}.sn{display:flex;width:100%;justify-content:flex-start}.btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:.375rem;cursor:pointer;transition:all .2s ease;font:inherit;color:inherit}.btn svg{flex-shrink:0}.spinner{animation:spin 1s linear infinite}.btn-outline{margin-right:.5rem;border:none;background-color:transparent;opacity:.7;box-shadow:0 2px 4px -1px var(--sw-shadow,rgba(0,0,0,.1)),0 1px 2px -1px var(--sw-shadow,rgba(0,0,0,.06))}.btn-outline:hover:not(:disabled){opacity:.9;box-shadow:0 4px 6px -1px var(--sw-shadow,rgba(0,0,0,.1)),0 2px 4px -1px var(--sw-shadow,rgba(0,0,0,.06))}.btn-primary{border:none;background-color:currentColor;color:white;box-shadow:0 4px 6px -1px var(--sw-shadow,rgba(0,0,0,.1)),0 2px 4px -1px var(--sw-shadow,rgba(0,0,0,.06))}.btn-primary:hover:not(:disabled){opacity:.9;box-shadow:0 6px 8px -1px var(--sw-shadow,rgba(0,0,0,.15)),0 4px 6px -1px var(--sw-shadow,rgba(0,0,0,.1))}.btn:disabled{opacity:.5;cursor:not-allowed}.btn:not(:disabled):hover{opacity:.9}.sb{margin-top:1.5rem;width:100%;display:flex;justify-content:flex-start}.sb-text{display:flex;align-items:center;font-size:.75rem;color:inherit;opacity:.7}.sw-loading{display:flex;align-items:center;justify-content:center;padding:2rem}.sw-spinner{width:2rem;height:2rem;border:2px solid currentColor;border-top:2px solid transparent;border-radius:50%;opacity:.3;animation:spin 1s linear infinite}.sw-error{text-align:center;padding:2rem;color:inherit;opacity:.7}.sw-error-msg{margin:0}.qc{width:100%;height:100%;padding:0 4px}.qt{font-weight:600;margin-bottom:.5rem;color:inherit;font-size:inherit}.qd{opacity:.8;margin-bottom:1rem;color:inherit;font-size:inherit}.opts{margin-top:1rem;padding-bottom:4px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}.qr{color:var(--sw-error,#ef4444);font-size:1.2rem}.qc-error{animation:shake .5s ease-in-out}.rad,.chk{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;cursor:pointer;color:inherit}.rad input[type="radio"],.chk input[type="checkbox"]{margin:0;accent-color:var(--sw-accent,currentColor);color:inherit}.rad-text,.chk-text{font-size:inherit;color:inherit;font-family:inherit}.oi{margin-top:.5rem}.oif{width:100%;padding:.5rem;border:1px solid var(--sw-input-border,rgba(0,0,0,.2));border-radius:.375rem;font-size:inherit;color:inherit;background-color:inherit;font-family:inherit}.stars{display:flex;justify-content:center;gap:.5rem}.star-btn{padding:.25rem;background:none;border:none;cursor:pointer;border-radius:50%;transition:all .2s ease;display:flex;align-items:center;justify-content:center;outline:none}.star-btn:hover{transform:scale(1.1)}.star-btn:focus{outline:none}.star-btn.star-sel{background-color:transparent}.star-svg{width:30px;height:30px;transition:all .2s ease;color:inherit}.star-btn:hover .star-svg{transform:scale(1.1)}.star-btn:not(.star-sel) .star-svg{opacity:.3}.ltxt{width:100%}.ltxt-ta{width:100%;padding:.5rem;border:1px solid var(--sw-input-border,rgba(0,0,0,.2));border-radius:.375rem;font-size:inherit;color:inherit;background-color:inherit;resize:none;min-height:6rem;font-family:inherit}.stmt{text-align:left}.stmt-text{font-size:inherit;font-weight:500;margin-bottom:1rem;color:inherit}.yno{width:100%}';
        document.head.appendChild(s);
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error('Container with id "' + containerId + '" not found');
        this.render();
    }

    unmount() {
        if (this.container) this.container.innerHTML = '';
        this.container = null;
    }

    getResponses() { return this.r; }

    setSurveyData(surveyData) {
        this.surveyData = surveyData;
        this.survey = surveyData;
        this.l = false;
        this.i = 0;
        this.r = [];
        this.ot = {};
        this.c = false;
        if (this.container) this.render();
    }

    setContainer(container) {
        this.container = container;
        if (this.container) this.render();
    }

    goToQuestion(index) {
        if (this.survey?.questions && index >= 0 && index < this.survey.questions.length) {
            const dir = index > this.i ? 'right' : 'left';
            this.transitionToQuestion(index, dir);
        } else {
            console.error('Invalid question index:', index);
        }
    }

    getCurrentQuestionIndex() { return this.i; }

    getTotalQuestions() { return this.survey?.questions?.length || 0; }
}

window.initSurveyWidget = function (options) {
    const widget = new o(options);
    const widgetId = 'surveyWidget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    window[widgetId] = widget;
    widget.widgetId = widgetId;
    return widget;
};

document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('[data-survey-widget]');
    elements.forEach((element, index) => {
        const surveyId = element.getAttribute('data-survey-id');
        const testMode = element.getAttribute('data-test-mode') === 'true';
        const widget = new o({ surveyId, testMode, onComplete: (responses) => { console.log('Survey completed:', responses); }, onError: (error) => { console.error('Survey error:', error); }, onClose: () => { console.log('Survey closed'); } });
        const widgetId = 'surveyWidget_auto_' + index + '_' + Date.now();
        window[widgetId] = widget;
        widget.widgetId = widgetId;
        widget.setContainer(element);
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = o;
}
