/**
 * Ultra-Minimal Survey Widget
 * Lightweight survey widget with essential functionality
 */

class SurveyWidgetMinimal {
    constructor(options = {}) {
        this.survey = options.surveyData;
        this.container = null;
        this.currentIndex = 0;
        this.responses = [];
        this.onComplete = options.onComplete || (() => { });
        this.onClose = options.onClose || (() => { });
        this.isCompleted = false;

        if (this.survey) this.render();
    }

    render() {
        if (!this.container) return;

        const question = this.survey.questions[this.currentIndex];

        this.container.innerHTML = `
            <div class="survey-widget">
                <div class="survey-card">
                    <div class="survey-close-btn" onclick="window.swMinimal.close()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6L6 18"/>
                            <path d="M6 6l12 12"/>
                        </svg>
                    </div>
                    
                    ${this.isCompleted || this.currentIndex >= this.survey.questions.length ? `
                        ${this.renderComplete()}
                    ` : `
                        <div class="survey-content">
                        <div class="question-container">
                            <h2 class="question-title">
                                ${question.title}
                                ${question.required ? '<span class="question-required">*</span>' : ''}
                            </h2>
                            ${question.description && question.format !== 'STATEMENT' ? `<p class="question-description">${question.description}</p>` : ''}
                            <div class="question-options">
                                ${this.renderQuestion(question)}
                            </div>
                        </div>
                    </div>
                    `}

                   
                    
                    <div class="survey-footer">
                     ${!this.isCompleted ? `
                        <div class="survey-navigation">
                            ${this.currentIndex > 0 ? `
                                <button class="survey-btn survey-btn-outline" onclick="window.swMinimal.prev()">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m15 18-6-6 6-6"/>
                                    </svg>
                                </button>
                            ` : ''}
                            <button class="survey-btn survey-btn-primary" onclick="window.swMinimal.next()">
                                ${this.currentIndex === this.survey.questions.length - 1 ? `
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m22 2-7 20-4-9-9-4Z"/>
                                        <path d="M22 2 11 13"/>
                                    </svg>
                                ` : `
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                `}
                            </button>
                        </div>
                        ` : ''}

                        <div class="survey-branding">
                            <div class="survey-branding-text">
                                <p>Powered by <a href="https://opineeo.com" target="_blank"><strong>Opineeo</strong></a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .survey-widget {
                    min-width: 300px;
                    min-height: 300px;
                    color: inherit;
                    font-family: inherit;
                }
                
                .survey-card {
                    background: transparent;
                    color: #222222;
                    border: 1px solid #222222;
                    border-radius: 6px;
                    margin: 16px 0px;
                    padding: 16px;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
                    max-width: 300px;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                    position: relative;
                }
                
                .survey-close-btn {
                    position: absolute;
                    top: 0.25rem;
                    right: 0.25rem;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0.7;
                    background: transparent;
                    border: none;
                    color: inherit;
                }
                
                .survey-close-btn:hover {
                    opacity: 1;
                }
                
                .survey-content {
                    padding: 0.5rem;
                    margin-bottom: 1rem;
                    overflow: hidden;
                    position: relative;
                }
                
                .question-container {
                    width: 100%;
                    height: 100%;
                    padding: 0 4px;
                }
                
                .question-title {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: inherit;
                    font-size: 18px;
                }
                
                .question-description {
                    opacity: 0.8;
                    margin-bottom: 1rem;
                    color: inherit;
                    font-size: 16px;
                }
                
                .question-options {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                }
                
                .question-required {
                    color: #ef4444;
                    font-size: 1.5rem;
                }
                
                .survey-footer {
                    padding: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding-top: 0;
                }
                
                .survey-navigation {
                    display: flex;
                    width: 100%;
                    justify-content: flex-start;
                }
                
                .survey-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font: inherit;
                }
                
                .survey-btn svg {
                    flex-shrink: 0;
                }
                
                .survey-btn-outline {
                    margin-right: 0.5rem;
                    border: 1px solid #222222;
                    background: #222222;
                    color: #ffffff;
                    opacity: 0.7;
                }
                
                .survey-btn-outline:hover:not(:disabled) {
                    opacity: 0.5;
                }
                
                .survey-btn-outline svg {
                    color: inherit;
                }
                
                .survey-btn-primary {
                    border: none;
                    background: #222222;
                    color: #ffffff;
                }
                
                .survey-btn-primary:hover:not(:disabled) {
                    opacity: 0.9;
                }
                
                .survey-btn-primary svg {
                    color: inherit;
                }
                
                .survey-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .survey-btn:not(:disabled):hover {
                    opacity: 0.9;
                }
                
                .survey-branding {
                    margin-top: 1.5rem;
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                }
                
                .survey-branding-text {
                    display: flex;
                    align-items: center;
                    font-size: 0.75rem;
                    color: #6b7280;
                    opacity: 0.7;
                }
                
                .survey-branding-text a {
                    color: inherit;
                }
                
                .radio-option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                }
                
                .radio-option input[type="radio"] {
                    margin: 0;
                    accent-color: #3b82f6;
                }
                
                .radio-option-text {
                    font-size: 16px;
                    color: inherit;
                }
                
                .checkbox-option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                }
                
                .checkbox-option input[type="checkbox"] {
                    margin: 0;
                    accent-color: #3b82f6;
                }
                
                .checkbox-option-text {
                    font-size: 16px;
                    color: inherit;
                }
                
                .star-rating {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .star-rating-button {
                    padding: 0.25rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    outline: none;
                    color: inherit;
                }
                
                .star-rating-button:hover {
                    transform: scale(1.1);
                }
                
                .star-rating-button:focus {
                    outline: none;
                }
                
                .star-rating-button.star-selected {
                    background: transparent;
                }
                
                .star-rating-star {
                    width: 24px;
                    height: 24px;
                }
                
                .star-rating-button:hover .star-rating-star {
                    transform: scale(1.1);
                }
                
                .long-text-input {
                    width: 100%;
                }
                
                .long-text-textarea {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 16px;
                    color: inherit;
                    background: transparent;
                    resize: none;
                    min-height: 6rem;
                    font: inherit;
                }
                
                .statement-content {
                    text-align: left;
                }
                
                .statement-text {
                    font-size: 18px;
                    font-weight: 500;
                    margin-bottom: 1rem;
                    color: inherit;
                }
                
                .yes-no-options {
                    width: 100%;
                }
                
                .error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    text-align: center;
                    padding: 0.5rem;
                    background: rgba(254,226,226,0.8);
                    border-radius: 0.5rem;
                    border: 1px solid rgba(252,165,165,0.5);
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
                
                @media (max-width: 400px) {
                    .survey-card {
                        max-width: 100%;
                        margin: 8px;
                        padding: 16px;
                    }
                    .star-rating-star {
                        width: 20px;
                        height: 20px;
                    }
                    .question-title {
                        font-size: 16px;
                    }
                }

                .completion-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                width: 100%;
                height: 100%;
                position: relative;
            }

            .completion-animation {
                margin-bottom: 2rem;
                position: relative;
            }

            /* Success circle */
            .success-circle {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981, #059669);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }

            .success-circle::before {
                content: '';
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10b981, #059669);
                opacity: 0.3;
                animation: pulse 2s infinite;
            }

            /* Success checkmark */
            .success-checkmark {
                position: relative;
                width: 24px;
                height: 24px;
                transform: rotate(45deg);
                z-index: 2;
            }

            .checkmark-stem {
                position: absolute;
                width: 5px;
                height: 25px;
                background-color: white;
                left: 15px;
                top: -3px;
                border-radius: 2px;
                animation: checkmarkStem 0.4s ease-in-out 0.3s both;
            }

            .checkmark-kick {
                position: absolute;
                width: 15px;
                height: 5px;
                background-color: white;
                left: 4px;
                top: 17px;
                border-radius: 2px;
                animation: checkmarkKick 0.4s ease-in-out 0.5s both;
            }
            </style>
        `;

        // Focus the appropriate input after rendering
        this.focusInput();
    }

    renderQuestion(question) {
        switch (question.format) {
            case 'YES_NO':
                return this.renderYesNo(question);
            case 'SINGLE_CHOICE':
                return this.renderSingleChoice(question);
            case 'MULTIPLE_CHOICE':
                return this.renderMultipleChoice(question);
            case 'STAR_RATING':
                return this.renderStarRating(question);
            case 'LONG_TEXT':
                return this.renderLongText(question);
            case 'STATEMENT':
                return this.renderStatement(question);
            default:
                return '<p class="error">Unsupported question type</p>';
        }
    }

    renderYesNo(question) {
        const current = this.getResponse(question.id);
        return `
            <div class="yes-no-options">
                <label class="radio-option">
                    <input type="radio" name="q_${question.id}" value="yes" ${current === 'yes' ? 'checked' : ''} onchange="window.swMinimal.setResponse('${question.id}', 'yes')">
                    <span class="radio-option-text">${question.yesLabel || 'Yes'}</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q_${question.id}" value="no" ${current === 'no' ? 'checked' : ''} onchange="window.swMinimal.setResponse('${question.id}', 'no')">
                    <span class="radio-option-text">${question.noLabel || 'No'}</span>
                </label>
            </div>
        `;
    }

    renderSingleChoice(question) {
        const current = this.getResponse(question.id);
        const otherText = this.getResponse(`${question.id}_other`);
        return question.options.map(option => `
            <label class="radio-option">
                <input type="radio" name="q_${question.id}" value="${option.id}" ${current === option.id ? 'checked' : ''} onchange="window.swMinimal.setResponse('${question.id}', '${option.id}'); window.swMinimal.render();">
                <span class="radio-option-text">${option.text}</span>
            </label>
            ${option.isOther ? `
                <div class="other-input-container" style="margin-left: 1.5rem; margin-top: 0.5rem; ${current === option.id ? '' : 'display: none;'}">
                    <input type="text" class="other-text-input" placeholder="Please specify..." value="${otherText || ''}" oninput="window.swMinimal.setResponse('${question.id}_other', this.value)" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 16px; color: inherit; background: transparent;">
                </div>
            ` : ''}
        `).join('');
    }

    renderMultipleChoice(question) {
        const current = this.getResponse(question.id);
        const selected = current ? current.split(',') : [];
        const otherText = this.getResponse(`${question.id}_other`);
        return question.options.map(option => `
            <label class="checkbox-option">
                <input type="checkbox" value="${option.id}" ${selected.includes(option.id) ? 'checked' : ''} onchange="window.swMinimal.toggleMultiple('${question.id}', '${option.id}'); window.swMinimal.render();">
                <span class="checkbox-option-text">${option.text}</span>
            </label>
            ${option.isOther ? `
                <div class="other-input-container" style="margin-left: 1.5rem; margin-top: 0.5rem; ${selected.includes(option.id) ? '' : 'display: none;'}">
                    <input type="text" class="other-text-input" placeholder="Please specify..." value="${otherText || ''}" oninput="window.swMinimal.setResponse('${question.id}_other', this.value)" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 16px; color: inherit; background: transparent;">
                </div>
            ` : ''}
        `).join('');
    }

    renderStarRating(question) {
        const current = this.getResponse(question.id) || 0;
        return `
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(star => `
                    <button type="button" class="star-rating-button ${star <= current ? 'star-selected' : ''}" 
                            onclick="window.swMinimal.setResponse('${question.id}', ${star}); window.swMinimal.render();"
                            onmouseover="window.swMinimal.hoverStar('${question.id}', ${star})"
                            onmouseout="window.swMinimal.unhoverStar('${question.id}')">
                        <svg class="star-rating-star" width="24" height="24" viewBox="0 0 24 24" fill="${star <= current ? '#fbbf24' : 'none'}" stroke="${star <= current ? '#fbbf24' : '#d1d5db'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                        </svg>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderLongText(question) {
        const current = this.getResponse(question.id) || '';
        return `
            <div class="long-text-input">
                <textarea class="long-text-textarea" placeholder="" autofocus oninput="window.swMinimal.setResponse('${question.id}', this.value)">${current}</textarea>
            </div>
        `;
    }

    renderStatement(question) {
        return `
            <div class="statement-content">
                <p class="statement-text">${question.description}</p>
            </div>
        `;
    }

    renderComplete() {
        this.isCompleted = true;
        this.onComplete(this.responses);
        setTimeout(() => this.onClose(), 3000);
        return `
        <div class="completion-container">
                    <div class="completion-animation">
                        <div class="success-circle">
                            <div class="success-checkmark">
                                <div class="checkmark-stem"></div>
                                <div class="checkmark-kick"></div>
                            </div>
                        </div>
                </div>
        </div>
    `;
    }

    setResponse(questionId, value) {
        const existing = this.responses.find(r => r.questionId === questionId);
        if (existing) {
            existing.value = value;
        } else {
            this.responses.push({ questionId, value });
        }

        // Hide error if user provides an answer
        this.hideRequiredError();
    }

    toggleMultiple(questionId, optionId) {
        const existing = this.responses.find(r => r.questionId === questionId);
        const current = existing ? (existing.value || '').split(',').filter(Boolean) : [];

        if (current.includes(optionId)) {
            const filtered = current.filter(id => id !== optionId);
            if (filtered.length) {
                existing.value = filtered.join(',');
            } else {
                this.responses.splice(this.responses.findIndex(r => r.questionId === questionId), 1);
            }
        } else {
            current.push(optionId);
            if (existing) {
                existing.value = current.join(',');
            } else {
                this.responses.push({ questionId, value: current.join(',') });
            }
        }

        // Hide error if user provides an answer
        this.hideRequiredError();
    }

    getResponse(questionId) {
        return this.responses.find(r => r.questionId === questionId)?.value || null;
    }

    next() {
        const question = this.survey.questions[this.currentIndex];
        if (question.required && !this.getResponse(question.id)) {
            this.showRequiredError(question.id);
            return;
        }
        this.hideRequiredError();
        this.currentIndex++;
        this.render();
    }

    showRequiredError(questionId) {
        const questionContainer = this.container.querySelector('.question-container');
        if (questionContainer) {
            // Add shake animation
            questionContainer.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                questionContainer.style.animation = '';
            }, 500);
        }
    }

    hideRequiredError() {
        // No-op since we only use shake animation
    }

    prev() {
        this.currentIndex--;
        this.render();
    }

    hoverStar(questionId, starValue) {
        const starButtons = this.container.querySelectorAll('.star-rating-button');
        starButtons.forEach((button, index) => {
            const starNum = index + 1;
            const svg = button.querySelector('.star-rating-star');
            if (starNum <= starValue) {
                svg.setAttribute('fill', '#fbbf24');
                svg.setAttribute('stroke', '#fbbf24');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', '#d1d5db');
            }
        });
    }

    unhoverStar(questionId) {
        const current = this.getResponse(questionId) || 0;
        const starButtons = this.container.querySelectorAll('.star-rating-button');
        starButtons.forEach((button, index) => {
            const starNum = index + 1;
            const svg = button.querySelector('.star-rating-star');
            if (starNum <= current) {
                svg.setAttribute('fill', '#fbbf24');
                svg.setAttribute('stroke', '#fbbf24');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', '#d1d5db');
            }
        });
    }

    focusInput() {
        // Focus the first visible input after a short delay to ensure DOM is ready
        setTimeout(() => {
            const question = this.survey.questions[this.currentIndex];

            // For long text questions, focus the textarea
            if (question.format === 'LONG_TEXT') {
                const textarea = this.container.querySelector('.long-text-textarea');
                if (textarea) {
                    textarea.focus();
                    return;
                }
            }

            // For other questions with text inputs, focus the first visible "other" input
            const otherInput = this.container.querySelector('.other-text-input');
            if (otherInput && otherInput.offsetParent !== null) { // Check if visible
                otherInput.focus();
                return;
            }
        }, 50);
    }

    close() {
        this.onClose();
        this.container.innerHTML = '';
    }

    mount(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    }
}

// Initialize the widget
window.initSurveyWidgetMinimal = (options) => {
    window.swMinimal = new SurveyWidgetMinimal(options);
    return window.swMinimal;
};
