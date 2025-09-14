/**
 * Vanilla JavaScript Survey Widget
 * A standalone survey widget that can be embedded in third-party websites
 */

class SurveyWidget {
    constructor(options = {}) {
        this.surveyId = options.surveyId;
        this.surveyData = options.surveyData;
        this.testMode = options.testMode || false;
        this.onComplete = options.onComplete || (() => { });
        this.onError = options.onError || (() => { });
        this.onClose = options.onClose || (() => { });
        this.container = null;
        this.survey = null;
        this.currentQuestionIndex = 0;
        this.responses = [];
        this.otherText = {};
        this.isLoading = true;
        this.isSubmitting = false;
        this.isCompleted = false;
        this.requiredError = null;

        this.init();
    }

    async init() {
        try {
            if (this.surveyData) {
                this.survey = this.surveyData;
                this.isLoading = false;
                // Only render if container is available
                if (this.container) {
                    this.render();
                }
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
            // In a real implementation, this would make an API call
            // For now, we'll use the surveyData if provided
            if (this.surveyData) {
                this.survey = this.surveyData;
            } else {
                throw new Error("Survey loading not implemented in vanilla version");
            }
            this.isLoading = false;
            // Only render if container is available
            if (this.container) {
                this.render();
            }
        } catch (error) {
            this.onError(error.message || "Failed to load survey");
        }
    }

    render() {
        if (!this.container) {
            console.error("SurveyWidget: Container not set, cannot render");
            return;
        }

        if (this.isLoading) {
            this.renderLoading();
            return;
        }

        if (this.isCompleted) {
            this.renderCompleted();
            return;
        }

        if (!this.survey) {
            this.renderError("Survey not found");
            return;
        }

        if (this.survey.status !== 'published' && !this.testMode) {
            this.renderError("This survey is not available");
            return;
        }

        this.renderSurvey();
    }

    renderLoading() {
        if (!this.container) {
            console.error("SurveyWidget: Container not set, cannot render loading state");
            return;
        }
        this.container.innerHTML = `
            <div class="survey-loading">
                <div class="survey-spinner"></div>
            </div>
        `;
    }

    renderError(message) {
        if (!this.container) {
            console.error("SurveyWidget: Container not set, cannot render error state");
            return;
        }
        this.container.innerHTML = `
            <div class="survey-error">
                <p class="survey-error-message">${message}</p>
            </div>
        `;
    }

    renderCompleted() {
        if (!this.container) {
            console.error("SurveyWidget: Container not set, cannot render completed state");
            return;
        }

        const widgetStyle = this.survey?.style || this.getDefaultStyle();

        // Get the correct widget reference for event handlers
        const widgetRef = this.widgetId ? `window.${this.widgetId}` : 'window.surveyWidget';

        this.container.innerHTML = `
            <div class="survey-widget" style="min-width: 300px; min-height: 300px;">
                <div class="survey-card" style="
                    --survey-bg-color: ${widgetStyle.backgroundColor === 'transparent' ? 'transparent' : widgetStyle.backgroundColor};
                    --survey-text-color: ${widgetStyle.textColor};
                    --survey-button-bg: ${widgetStyle.buttonBackgroundColor};
                    --survey-button-text: ${widgetStyle.buttonTextColor};
                    --survey-font-family: ${widgetStyle.fontFamily};
                    --survey-border: ${widgetStyle.border};
                    --survey-border-radius: ${widgetStyle.borderRadius};
                    --survey-margin: ${widgetStyle.margin};
                    --survey-padding: ${widgetStyle.padding};
                    --survey-title-size: ${widgetStyle.titleFontSize};
                    --survey-body-size: ${widgetStyle.bodyFontSize};
                    --survey-accent-color: ${widgetStyle.accentColor || '#3b82f6'};
                    --survey-error-color: ${widgetStyle.errorColor || '#ef4444'};
                    --survey-border-color: ${widgetStyle.borderColor || '#d1d5db'};
                    background-color: var(--survey-bg-color);
                    font-family: var(--survey-font-family);
                    border: var(--survey-border);
                    border-radius: var(--survey-border-radius);
                    margin: var(--survey-margin);
                    padding: var(--survey-padding);
                ">
                    <div class="survey-close-btn" onclick="${widgetRef}.handleClose()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6L6 18"/>
                            <path d="M6 6l12 12"/>
                        </svg>
                    </div>
                    
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
                    
                    <div class="survey-footer">
                        <div class="survey-branding">
                            <div class="survey-branding-text">
                                <p>Powered by <a href="https://opineeo.com" target="_blank" style="color: var(--survey-text-color);"><strong>Opineeo</strong></a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add completion styles
        this.addCompletionStyles();

        // Auto-close after 5 seconds
        setTimeout(() => {
            this.handleClose();
        }, 8000);
    }

    addCompletionStyles() {
        if (document.getElementById('survey-completion-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'survey-completion-styles';
        styles.textContent = `
            /* Completion container */
            .completion-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                min-height: 250px;
                position: relative;
            }

            /* Completion animation */
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


            /* Animations */
            @keyframes scaleIn {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.3;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.1;
                }
            }

            @keyframes checkmarkStem {
                0% {
                    height: 0;
                }
                100% {
                    height: 25px;
                }
            }

            @keyframes checkmarkKick {
                0% {
                    width: 0;
                }
                100% {
                    width: 15px;
                }
            }

            @keyframes fadeInUp {
                0% {
                    opacity: 0;
                    transform: translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Responsive adjustments */
            @media (max-width: 400px) {
                .success-circle {
                    width: 60px;
                    height: 60px;
                }
                
                .success-circle::before {
                    width: 80px;
                    height: 80px;
                }
                
                .checkmark-stem {
                    width: 2px;
                    height: 10px;
                    left: 7px;
                    top: 3px;
                }
                
                .checkmark-kick {
                    width: 6px;
                    height: 2px;
                    left: 4px;
                    top: 9px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    renderSurvey() {
        if (!this.container) return;

        if (!this.survey?.questions || this.survey.questions.length === 0) {
            this.renderError("No questions available");
            return;
        }

        const currentQuestion = this.survey.questions[this.currentQuestionIndex];

        if (!currentQuestion) {
            this.renderError("Question not found");
            return;
        }

        const isLastQuestion = this.currentQuestionIndex === this.survey.questions.length - 1;
        const isFirstQuestion = this.currentQuestionIndex === 0;

        const widgetStyle = this.survey.style || this.getDefaultStyle();

        // Get the correct widget reference for event handlers
        const widgetRef = this.widgetId ? `window.${this.widgetId}` : 'window.surveyWidget';

        this.container.innerHTML = `
            <div class="survey-widget" style="min-width: 300px; min-height: 300px;">
                <div class="survey-card" style="
                    --survey-bg-color: ${widgetStyle.backgroundColor === 'transparent' ? 'transparent' : widgetStyle.backgroundColor};
                    --survey-text-color: ${widgetStyle.textColor};
                    --survey-button-bg: ${widgetStyle.buttonBackgroundColor};
                    --survey-button-text: ${widgetStyle.buttonTextColor};
                    --survey-font-family: ${widgetStyle.fontFamily};
                    --survey-border: ${widgetStyle.border};
                    --survey-border-radius: ${widgetStyle.borderRadius};
                    --survey-margin: ${widgetStyle.margin};
                    --survey-padding: ${widgetStyle.padding};
                    --survey-title-size: ${widgetStyle.titleFontSize};
                    --survey-body-size: ${widgetStyle.bodyFontSize};
                    --survey-accent-color: ${widgetStyle.accentColor || '#3b82f6'};
                    --survey-error-color: ${widgetStyle.errorColor || '#ef4444'};
                    --survey-border-color: ${widgetStyle.borderColor || '#d1d5db'};
                    --survey-outline-bg: ${widgetStyle.outlineButtonBg || 'rgba(255, 255, 255, 0.8)'};
                    --survey-outline-text: ${widgetStyle.outlineButtonText || '#374151'};
                    --survey-outline-hover-bg: ${widgetStyle.outlineButtonHoverBg || '#f9fafb'};
                    --survey-outline-hover-border: ${widgetStyle.outlineButtonHoverBorder || '#9ca3af'};
                    --survey-input-border: ${widgetStyle.inputBorder || '#d1d5db'};
                    --survey-input-radius: ${widgetStyle.inputRadius || '0.375rem'};
                    --survey-input-bg: ${widgetStyle.inputBg || 'transparent'};
                    background-color: var(--survey-bg-color);
                    font-family: var(--survey-font-family);
                    border: var(--survey-border);
                    border-radius: var(--survey-border-radius);
                    margin: var(--survey-margin);
                    padding: var(--survey-padding);
                ">
                    <div class="survey-close-btn" onclick="${widgetRef}.handleClose()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6L6 18"/>
                            <path d="M6 6l12 12"/>
                        </svg>
                    </div>
                    
                    <div class="survey-content">
                        <div class="question-transition-container">
                            ${this.renderQuestion(currentQuestion, widgetStyle, widgetRef)}
                        </div>
                    </div>
                    
                    <div class="survey-footer">
                        <div class="survey-navigation">
                            <button class="survey-btn survey-btn-outline survey-btn-previous" 
                                    onclick="${widgetRef}.handlePrevious()" 
                                    ${isFirstQuestion ? 'disabled' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m15 18-6-6 6-6"/>
                                </svg>
                            </button>
                            
                            <button class="survey-btn survey-btn-primary survey-btn-next" 
                                    onclick="${widgetRef}.handleNext()" 
                                    ${this.isSubmitting ? 'disabled' : ''}>
                                ${this.isSubmitting ? this.getSpinnerIcon() : (isLastQuestion ? this.getSendIcon() : this.getNextArrowIcon())}
                            </button>
                        </div>
                        
                        <div class="survey-branding">
                            <div class="survey-branding-text">
                                <p>Powered by <a href="https://opineeo.com" target="_blank" style="color: var(--survey-text-color);"><strong>Opineeo</strong></a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS animations
        this.addStyles();
    }

    renderQuestion(question, style, widgetRef = 'window.surveyWidget') {
        if (!question) return '';

        const currentResponse = this.responses.find(r => r.questionId === question.id);
        const isRequired = question.required;
        const hasError = this.requiredError === question.id;

        let questionContent = `
            <div class="question-container ${hasError ? 'question-error' : ''}">
                <h2 class="question-title">
                    ${question.title} ${isRequired ? '<span class="question-required">*</span>' : ''}
                </h2>
                
                ${question.description && question.format !== 'STATEMENT' ? `
                    <p class="question-description">
                        ${question.description}
                    </p>
                ` : ''}
                
                <div class="question-options">
                    ${this.renderQuestionOptions(question, currentResponse, style, widgetRef)}
                </div>
            
            </div>
        `;

        return questionContent;
    }

    renderQuestionOptions(question, currentResponse, style, widgetRef = 'window.surveyWidget') {
        switch (question.format) {
            case 'YES_NO':
                return this.renderYesNoOptions(question, currentResponse, widgetRef);

            case 'SINGLE_CHOICE':
                return this.renderSingleChoiceOptions(question, currentResponse, widgetRef);

            case 'MULTIPLE_CHOICE':
                return this.renderMultipleChoiceOptions(question, currentResponse, widgetRef);

            case 'STAR_RATING':
                return this.renderStarRatingOptions(question, currentResponse, widgetRef);

            case 'LONG_TEXT':
                return this.renderLongTextOptions(question, currentResponse, widgetRef);

            case 'STATEMENT':
                return this.renderStatementOptions(question);

            default:
                return '<p>Unsupported question format</p>';
        }
    }

    renderYesNoOptions(question, currentResponse, widgetRef = 'window.surveyWidget') {
        const yesValue = currentResponse?.booleanValue === true ? 'true' : '';
        const noValue = currentResponse?.booleanValue === false ? 'false' : '';

        return `
            <div class="yes-no-options">
                <label class="radio-option">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="true" 
                           ${yesValue ? 'checked' : ''}
                           onchange="${widgetRef}.handleResponseChange('${question.id}', true, undefined, false)">
                    <span class="radio-option-text">${question.yesLabel || 'Yes'}</span>
                </label>
                
                <label class="radio-option">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="false" 
                           ${noValue ? 'checked' : ''}
                           onchange="${widgetRef}.handleResponseChange('${question.id}', false, undefined, false)">
                    <span class="radio-option-text">${question.noLabel || 'No'}</span>
                </label>
            </div>
        `;
    }

    renderSingleChoiceOptions(question, currentResponse, widgetRef = 'window.surveyWidget') {
        // Filter out "Other" option from main loop to avoid duplication
        const regularOptions = question.options.filter(option => !option.isOther);
        let optionsHtml = regularOptions.map(option => {
            const isChecked = currentResponse?.optionId === option.id;
            return `
                <label class="radio-option">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="${option.id}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="${widgetRef}.handleResponseChange('${question.id}', '${option.id}', '${option.id}', false)">
                    <span class="radio-option-text">${option.text}</span>
                </label>
            `;
        }).join('');

        // Add "Other" option if it exists
        const otherOption = question.options.find(opt => opt.isOther);
        if (otherOption) {
            const isOtherSelected = currentResponse?.optionId === otherOption.id;
            optionsHtml += `
                <label class="radio-option">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="${otherOption.id}" 
                           ${isOtherSelected ? 'checked' : ''}
                           onchange="${widgetRef}.handleResponseChange('${question.id}', '${otherOption.id}', '${otherOption.id}', false)">
                    <span class="radio-option-text">${otherOption.text}</span>
                </label>
                
                ${isOtherSelected ? `
                    <div class="other-input">
                        <input type="text" 
                               class="other-input-field"
                               placeholder="Please specify..." 
                               value="${this.otherText[question.id] || ''}"
                               oninput="${widgetRef}.handleOtherTextChangeImmediate('${question.id}', this.value)">
                    </div>
                ` : ''}
            `;
        }

        return optionsHtml;
    }

    renderMultipleChoiceOptions(question, currentResponse, widgetRef = 'window.surveyWidget') {
        const selectedOptions = currentResponse?.optionId?.split(',') || [];

        // Filter out "Other" option from main loop to avoid duplication
        const regularOptions = question.options.filter(option => !option.isOther);
        let optionsHtml = regularOptions.map((option, index) => {
            const optionId = option.id || `option_${index}`;
            const isChecked = selectedOptions.includes(optionId);

            return `
                <label class="checkbox-option">
                    <input type="checkbox" 
                           value="${optionId}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="${widgetRef}.handleMultipleChoiceChange('${question.id}', '${optionId}', this.checked)">
                    <span class="checkbox-option-text">${option.text}</span>
                </label>
            `;
        }).join('');

        // Add "Other" option if it exists
        const otherOption = question.options.find(opt => opt.isOther);
        if (otherOption) {
            const otherOptionId = otherOption.id || `option_other`;
            const isOtherSelected = selectedOptions.includes(otherOptionId);

            optionsHtml += `
                <label class="checkbox-option">
                    <input type="checkbox" 
                           value="${otherOptionId}" 
                           ${isOtherSelected ? 'checked' : ''}
                           onchange="${widgetRef}.handleMultipleChoiceChange('${question.id}', '${otherOptionId}', this.checked)">
                    <span class="checkbox-option-text">${otherOption.text}</span>
                </label>
                
                ${isOtherSelected ? `
                    <div class="other-input">
                        <input type="text" 
                               class="other-input-field"
                               placeholder="Please specify..." 
                               value="${this.otherText[question.id] || ''}"
                               oninput="${widgetRef}.handleOtherTextChangeImmediate('${question.id}', this.value)">
                    </div>
                ` : ''}
            `;
        }

        return optionsHtml;
    }

    renderStarRatingOptions(question, currentResponse, widgetRef = 'window.surveyWidget') {
        const rating = currentResponse?.numberValue || 0;

        return `
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(starValue => `
                    <button type="button" 
                            class="star-rating-button ${starValue <= rating ? 'star-selected' : ''}"
                            onclick="${widgetRef}.handleResponseChange('${question.id}', ${starValue})">
                        <svg class="star-rating-star" width="24" height="24" viewBox="0 0 24 24" fill="${starValue <= rating ? '#fbbf24' : 'none'}" stroke="${starValue <= rating ? '#fbbf24' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="
                            color: ${starValue <= rating ? '#fbbf24' : '#d1d5db'};
                        ">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                        </svg>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderLongTextOptions(question, currentResponse, widgetRef = 'window.surveyWidget') {
        return `
            <div class="long-text-input">
                <textarea 
                    class="long-text-textarea"
                    placeholder=""
                    oninput="${widgetRef}.handleResponseChange('${question.id}', this.value, undefined, false, true)"
                >${currentResponse?.textValue || ''}</textarea>
            </div>
        `;
    }

    renderStatementOptions(question) {
        return `
            <div class="statement-content">
                <p class="statement-text">${question.description}</p>
            </div>
        `;
    }

    handleResponseChange(questionId, value, optionId, isOther = false, skipRender = false) {
        const existingIndex = this.responses.findIndex(r => r.questionId === questionId);
        const finalOptionId = optionId || (existingIndex >= 0 ? this.responses[existingIndex].optionId : undefined);

        const newResponse = {
            questionId,
            optionId: finalOptionId,
            textValue: typeof value === 'string' ? value : undefined,
            numberValue: typeof value === 'number' ? value : undefined,
            booleanValue: typeof value === 'boolean' ? value : undefined,
            isOther
        };

        if (existingIndex >= 0) {
            this.responses[existingIndex] = newResponse;
        } else {
            this.responses.push(newResponse);
        }

        // Clear otherText if "Other" option is deselected
        if (!isOther) {
            delete this.otherText[questionId];
        }

        // Clear required error if user provides a response
        if (this.requiredError === questionId) {
            this.requiredError = null;
        }

        // Only re-render if not skipping (for oninput to prevent focus loss)
        if (!skipRender) {
            this.render();
        }
    }

    handleMultipleChoiceChange(questionId, optionId, checked) {
        const existingResponse = this.responses.find(r => r.questionId === questionId);

        if (existingResponse) {
            const currentOptions = existingResponse.optionId ? existingResponse.optionId.split(',') : [];

            if (checked) {
                if (!currentOptions.includes(optionId)) {
                    currentOptions.push(optionId);
                }
            } else {
                const filteredOptions = currentOptions.filter(id => id !== optionId);
                existingResponse.optionId = filteredOptions.length > 0 ? filteredOptions.join(',') : undefined;
            }

            if (checked) {
                existingResponse.optionId = currentOptions.join(',');
            }
        } else if (checked) {
            this.responses.push({ questionId, optionId });
        }

        // Check if this is the "Other" option being deselected
        const currentQuestion = this.survey.questions[this.currentQuestionIndex];
        const isOtherOption = currentQuestion?.options.find(opt => (opt.id || `option_${currentQuestion.options.indexOf(opt)}`) === optionId)?.isOther;

        if (isOtherOption && !checked) {
            delete this.otherText[questionId];
        }

        // Clear required error if user provides a response
        if (this.requiredError === questionId) {
            this.requiredError = null;
        }

        this.render();
    }

    handleOtherTextChange(questionId, value) {
        this.otherText[questionId] = value;
        this.handleResponseChange(questionId, value, undefined, true);
    }

    handleOtherTextChangeImmediate(questionId, value) {
        this.otherText[questionId] = value;
        this.handleResponseChange(questionId, value, undefined, true, true);
    }

    handleClose() {
        this.onClose();
        this.unmount();
    }

    handleNext() {
        if (!this.survey?.questions || this.survey.questions.length === 0) {
            this.onError("No questions available");
            return;
        }

        const currentQuestion = this.survey.questions[this.currentQuestionIndex];

        if (currentQuestion?.required) {
            const hasResponse = this.responses.some(r => r.questionId === currentQuestion.id);
            if (!hasResponse) {
                this.requiredError = currentQuestion.id;
                this.render();
                return;
            }
        }

        // Clear any previous required error
        this.requiredError = null;

        const isLastQuestion = this.currentQuestionIndex === this.survey.questions.length - 1;

        if (isLastQuestion) {
            this.handleSubmit();
        } else {
            this.transitionToNext();
        }
    }

    handlePrevious() {
        if (this.currentQuestionIndex > 0) {
            this.transitionToPrevious();
        }
    }

    transitionToNext() {
        this.transitionToQuestion(this.currentQuestionIndex + 1, 'right');
    }

    transitionToPrevious() {
        this.transitionToQuestion(this.currentQuestionIndex - 1, 'left');
    }

    transitionToQuestion(targetIndex, direction) {
        if (!this.container) return;

        const questionContainer = this.container.querySelector('.question-transition-container');
        if (!questionContainer) {
            // Fallback to direct render if transition container not found
            this.currentQuestionIndex = targetIndex;
            this.render();
            return;
        }

        // Add exit animation class
        const exitClass = direction === 'right' ? 'question-exit-right' : 'question-exit-left';
        questionContainer.classList.add(exitClass);

        // Wait for exit animation to complete, then update and enter
        setTimeout(() => {
            this.currentQuestionIndex = targetIndex;
            const newQuestion = this.survey.questions[this.currentQuestionIndex];

            if (newQuestion) {
                const widgetStyle = this.survey.style || this.getDefaultStyle();
                const widgetRef = this.widgetId ? `window.${this.widgetId}` : 'window.surveyWidget';

                questionContainer.innerHTML = this.renderQuestion(newQuestion, widgetStyle, widgetRef);

                // Remove exit class and add enter class
                questionContainer.classList.remove(exitClass);
                const enterClass = direction === 'right' ? 'question-enter-right' : 'question-enter-left';
                questionContainer.classList.add(enterClass);

                // Remove enter class after animation completes
                setTimeout(() => {
                    questionContainer.classList.remove(enterClass);
                }, 300);
            }
        }, 200);
    }

    async handleSubmit() {
        if (this.testMode) {
            this.onComplete(this.responses);
            return;
        }

        this.isSubmitting = true;
        this.render();

        try {
            // Simulate a brief submission delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Here you would implement the actual submission logic
            this.onComplete(this.responses);

            // Set completed state
            this.isCompleted = true;
        } catch (error) {
            this.onError(error.message || "Failed to submit survey");
        } finally {
            this.isSubmitting = false;
            // Re-render to update the UI after submission
            this.render();
        }
    }


    getDefaultStyle() {
        return {
            backgroundColor: "transparent",
            textColor: "#222222",
            buttonBackgroundColor: "#222222",
            buttonTextColor: "#ffffff",
            margin: "16px 0px",
            padding: "16px",
            border: "1px solid #222222",
            borderRadius: "6px",
            titleFontSize: "18px",
            bodyFontSize: "16px",
            fontFamily: "Inter",
            accentColor: "#3b82f6",
            errorColor: "#ef4444",
            borderColor: "#d1d5db",
            outlineButtonBg: "rgba(255, 255, 255, 0.8)",
            outlineButtonText: "#374151",
            outlineButtonHoverBg: "#f9fafb",
            outlineButtonHoverBorder: "#9ca3af",
            inputBorder: "#d1d5db",
            inputRadius: "0.375rem",
            inputBg: "#ffffff"
        };
    }

    getNextArrowIcon() {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                </svg>`;
    }

    getSendIcon() {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"/>
                    <path d="M22 2 11 13"/>
                </svg>`;
    }

    getSpinnerIcon() {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>`;
    }

    addStyles() {
        if (document.getElementById('survey-widget-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'survey-widget-styles';
        styles.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Question transition animations */
            @keyframes slideOutRight {
                0% { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateX(50%); 
                    opacity: 0; 
                }
            }
            
            @keyframes slideInRight {
                0% { 
                    transform: translateX(-50%); 
                    opacity: 0; 
                }
                100% { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }
            
            @keyframes slideOutLeft {
                0% { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateX(-50%); 
                    opacity: 0; 
                }
            }
            
            @keyframes slideInLeft {
                0% { 
                    transform: translateX(50%); 
                    opacity: 0; 
                }
                100% { 
                    transform: translateX(0); 
                    opacity: 1; 
                }
            }
            
            .survey-widget * {
                box-sizing: border-box;
            }
            
            /* Main widget container */
            .survey-widget {
                min-width: 300px;
                min-height: 300px;
            }
            
            /* Card container */
            .survey-card {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                max-width: 300px;
                min-height: 300px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
                position: relative;
            }
            
            /* Close button */
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
                transition: all 0.2s ease;
                z-index: 10;
                opacity: 0.7;
            }
            
            .survey-close-btn:hover {
                opacity: 1;
            }
            
            .survey-close-btn svg {
                color: var(--survey-text-color, #222222);
                transition: all 0.2s ease;
            }
            
            /* Content area */
            .survey-content {
                padding: 0.5rem;
                margin-bottom: 1rem;
                overflow: hidden;
                position: relative;
            }
            
            /* Question transition container */
            .question-transition-container {
                position: relative;
                overflow: hidden;
                min-height: 200px;
                width: 100%;
                height: auto;
            }
            
            /* Ensure question content stays within bounds during transitions */
            .question-transition-container .question-container {
                position: relative;
                width: 100%;
                height: auto;
            }
            
            /* Transition animation classes */
            .question-exit-right {
                animation: slideOutRight 0.2s ease-out forwards;
            }
            
            .question-enter-right {
                animation: slideInRight 0.3s ease-out forwards;
            }
            
            .question-exit-left {
                animation: slideOutLeft 0.2s ease-out forwards;
            }
            
            .question-enter-left {
                animation: slideInLeft 0.3s ease-out forwards;
            }
            
            /* Footer area */
            .survey-footer {
                padding: 0.5rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-top: 0;
            }
            
            /* Navigation buttons */
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
                transition: opacity 0.2s;
            }
            
            .survey-btn svg {
                flex-shrink: 0;
            }
            
            .spinner {
                animation: spin 1s linear infinite;
            }
            
            .survey-btn-outline {
                margin-right: 0.5rem;
                border: 1px solid var(--survey-button-bg, #222222);
                background-color: var(--survey-button-bg, #222222);
                color: var(--survey-button-text, #ffffff);
                opacity: 0.7;
            }
            
            .survey-btn-outline:hover:not(:disabled) {
                background-color: var(--survey-button-bg, #222222);
                border-color: var(--survey-button-bg, #222222);
                opacity: 0.5;
            }
            
            .survey-btn-outline svg {
                color: var(--survey-button-text, #ffffff);
            }
            
            .survey-btn-primary {
                border: none;
                background-color: var(--survey-button-bg, #222222);
                color: var(--survey-button-text, #ffffff);
            }
            
            .survey-btn-primary:hover:not(:disabled) {
                opacity: 0.9;
            }
            
            .survey-btn-primary svg {
                color: var(--survey-button-text, #ffffff);
            }
            
            .survey-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .survey-btn:not(:disabled):hover {
                opacity: 0.9;
            }
            
            /* Branding */
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
            }
            
            /* Loading state */
            .survey-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .survey-spinner {
                width: 2rem;
                height: 2rem;
                border: 2px solid #e5e7eb;
                border-top: 2px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            /* Error state */
            .survey-error {
                text-align: center;
                padding: 2rem;
                color: #6b7280;
            }
            
            .survey-error-message {
                margin: 0;
            }
            
            /* Question elements */
            .question-container {
                width: 100%;
                height: 100%;
                padding: 0 4px; /* Add padding to prevent shake from cutting off */
            }
            
            .question-title {
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: var(--survey-text-color, #222222);
                font-size: var(--survey-title-size, 18px);
            }
            
            .question-description {
                opacity: 0.8;
                margin-bottom: 1rem;
                color: var(--survey-text-color, #222222);
                font-size: var(--survey-body-size, 16px);
            }
            
            .question-options {
                margin-top: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
            }
            
            .question-required {
                color: var(--survey-error-color, #ef4444);
                font-size: 1.5rem;
            }
            
            /* Question error state */
            .question-container.question-error {
                animation: shake 0.5s ease-in-out;
            }
            
            .question-error-message {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.75rem;
                padding: 0.75rem;
                background-color: rgba(239, 68, 68, 0.1);
                border: 1px solid var(--survey-error-color, #ef4444);
                border-radius: 0.375rem;
                color: var(--survey-error-color, #ef4444);
                font-size: 0.875rem;
                font-weight: 500;
            }
            
            .question-error-message svg {
                flex-shrink: 0;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            
            /* Radio options */
            .radio-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
            }
            
            .radio-option input[type="radio"] {
                margin: 0;
                accent-color: var(--survey-accent-color, #3b82f6);
            }
            
            .radio-option-text {
                font-size: var(--survey-body-size, 1rem);
                color: var(--survey-text-color, #222222);
            }
            
            /* Checkbox options */
            .checkbox-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
            }
            
            .checkbox-option input[type="checkbox"] {
                margin: 0;
                accent-color: var(--survey-accent-color, #3b82f6);
            }
            
            .checkbox-option-text {
                font-size: var(--survey-body-size, 1rem);
                color: var(--survey-text-color, #222222);
            }
            
            /* Other input */
            .other-input {
                margin-top: 0.5rem;
            }
            
            .other-input-field {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid var(--survey-input-border, #d1d5db);
                border-radius: var(--survey-input-radius, 0.375rem);
                font-size: var(--survey-body-size, 1rem);
                color: var(--survey-text-color, #222222);
                background-color: var(--survey-input-bg, #ffffff);
            }
            
            /* Star rating */
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
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                outline: none;
            }
            
            .star-rating-button:hover {
                transform: scale(1.1);
            }
            
            .star-rating-button:focus {
                outline: none;
            }
            
            .star-rating-button.star-selected {
                background-color: transparent;
            }
            
            .star-rating-star {
                width: 30px;
                height: 30px;
                transition: all 0.2s ease;
            }
            
            .star-rating-button:hover .star-rating-star {
                transform: scale(1.1);
            }
            
            /* Long text input */
            .long-text-input {
                width: 100%;
            }
            
            .long-text-textarea {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid var(--survey-input-border, #d1d5db);
                border-radius: var(--survey-input-radius, 0.375rem);
                font-size: var(--survey-body-size, 0.75rem);
                color: var(--survey-text-color, #222222);
                background-color: var(--survey-input-bg, transparent);
                resize: none;
                min-height: 6rem;
            }
            
            /* Statement */
            .statement-content {
                text-align: left;
            }
            
            .statement-text {
                font-size: var(--survey-title-size, 1.125rem);
                font-weight: 500;
                margin-bottom: 1rem;
                color: var(--survey-text-color, #222222);
            }
            
            /* Yes/No options */
            .yes-no-options {
                width: 100%;
            }
        `;
        document.head.appendChild(styles);
    }

    // Public API methods
    mount(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        // Render after container is set
        this.render();
    }

    unmount() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.container = null;
    }

    getResponses() {
        return this.responses;
    }

    setSurveyData(surveyData) {
        this.surveyData = surveyData;
        this.survey = surveyData;
        this.isLoading = false;
        // Reset to first question when new survey data is set
        this.currentQuestionIndex = 0;
        this.responses = [];
        this.otherText = {};
        this.isCompleted = false;

        // Only render if container is available
        if (this.container) {
            this.render();
        }
    }

    setContainer(container) {
        this.container = container;
        // Render after container is set
        if (this.container) {
            this.render();
        }
    }

    goToQuestion(index) {
        if (this.survey?.questions && index >= 0 && index < this.survey.questions.length) {
            const direction = index > this.currentQuestionIndex ? 'right' : 'left';
            this.transitionToQuestion(index, direction);
        } else {
            console.error('Invalid question index:', index);
        }
    }

    getCurrentQuestionIndex() {
        return this.currentQuestionIndex;
    }

    getTotalQuestions() {
        return this.survey?.questions?.length || 0;
    }

}

// Global initialization function
window.initSurveyWidget = function (options) {
    const widget = new SurveyWidget(options);

    // Create a unique global reference for this widget
    const widgetId = 'surveyWidget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    window[widgetId] = widget;

    // Store the widget ID for event handlers
    widget.widgetId = widgetId;

    return widget;
};

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', function () {
    const surveyElements = document.querySelectorAll('[data-survey-widget]');
    surveyElements.forEach((element, index) => {
        const surveyId = element.getAttribute('data-survey-id');
        const testMode = element.getAttribute('data-test-mode') === 'true';

        const widget = new SurveyWidget({
            surveyId,
            testMode,
            onComplete: (responses) => {
                console.log('Survey completed:', responses);
            },
            onError: (error) => {
                console.error('Survey error:', error);
            },
            onClose: () => {
                console.log('Survey closed');
            }
        });

        // Create a unique global reference for this widget
        const widgetId = 'surveyWidget_auto_' + index + '_' + Date.now();
        window[widgetId] = widget;
        widget.widgetId = widgetId;

        // Set container and render
        widget.setContainer(element);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SurveyWidget;
}
