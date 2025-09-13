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
        this.container = null;
        this.survey = null;
        this.currentQuestionIndex = 0;
        this.responses = [];
        this.otherText = {};
        this.isLoading = true;
        this.isSubmitting = false;

        this.init();
    }

    async init() {
        try {
            if (this.surveyData) {
                this.survey = this.surveyData;
                this.isLoading = false;
                this.render();
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
            this.render();
        } catch (error) {
            this.onError(error.message || "Failed to load survey");
        }
    }

    render() {
        if (this.isLoading) {
            this.renderLoading();
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
        this.container.innerHTML = `
            <div class="survey-loading" style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
                <div class="spinner" style="width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
        `;
    }

    renderError(message) {
        this.container.innerHTML = `
            <div class="survey-error" style="text-align: center; padding: 2rem; color: #6b7280;">
                <p>${message}</p>
            </div>
        `;
    }

    renderSurvey() {
        const currentQuestion = this.survey.questions[this.currentQuestionIndex];
        const isLastQuestion = this.currentQuestionIndex === this.survey.questions.length - 1;
        const isFirstQuestion = this.currentQuestionIndex === 0;

        const widgetStyle = this.survey.style || this.getDefaultStyle();

        this.container.innerHTML = `
            <div class="survey-widget" style="min-width: 300px; min-height: 300px;">
                <div class="survey-card" style="
                    background-color: ${widgetStyle.backgroundColor === 'transparent' ? 'transparent' : widgetStyle.backgroundColor};
                    font-family: ${widgetStyle.fontFamily};
                    border: ${widgetStyle.border};
                    border-radius: ${widgetStyle.borderRadius};
                    margin: ${widgetStyle.margin};
                    padding: ${widgetStyle.padding};
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    max-width: 300px;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                ">
                    <div class="survey-content" style="padding: 0.5rem; margin-bottom: 1rem;">
                        ${this.renderQuestion(currentQuestion, widgetStyle)}
                    </div>
                    
                    <div class="survey-footer" style="padding: 0.5rem; display: flex; flex-direction: column; justify-content: space-between; padding-top: 0;">
                        <div class="survey-navigation" style="display: flex; width: 100%; justify-content: flex-start;">
                            <button class="survey-btn survey-btn-outline" 
                                    onclick="window.surveyWidget.handlePrevious()" 
                                    ${isFirstQuestion ? 'disabled' : ''}
                                    style="
                                        display: flex;
                                        align-items: center;
                                        gap: 0.5rem;
                                        margin-right: 0.5rem;
                                        padding: 0.5rem 1rem;
                                        border: 1px solid #d1d5db;
                                        background: white;
                                        border-radius: 0.375rem;
                                        cursor: pointer;
                                        ${isFirstQuestion ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                                    ">
                                ←
                            </button>
                            
                            <button class="survey-btn survey-btn-primary" 
                                    onclick="window.surveyWidget.handleNext()" 
                                    ${this.isSubmitting ? 'disabled' : ''}
                                    style="
                                        display: flex;
                                        align-items: center;
                                        gap: 0.5rem;
                                        padding: 0.5rem 1rem;
                                        background-color: ${widgetStyle.buttonBackgroundColor};
                                        color: ${widgetStyle.buttonTextColor};
                                        border: none;
                                        border-radius: 0.375rem;
                                        cursor: pointer;
                                        ${this.isSubmitting ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                                    ">
                                ${this.isSubmitting ? '⏳' : (isLastQuestion ? '✓ Complete' : '→ Continue')}
                            </button>
                        </div>
                        
                        <div class="survey-branding" style="margin-top: 1.5rem; width: 100%; display: flex; justify-content: flex-start;">
                            <div style="display: flex; align-items: center; font-size: 0.75rem; color: #6b7280;">
                                <p>Powered by <strong>Opineeo</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS animations
        this.addStyles();
    }

    renderQuestion(question, style) {
        if (!question) return '';

        const currentResponse = this.responses.find(r => r.questionId === question.id);
        const isRequired = question.required;

        let questionContent = `
            <div class="question-container">
                <h2 class="question-title" style="
                    color: ${style.textColor};
                    font-size: ${style.titleFontSize};
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                ">
                    ${question.title}
                </h2>
                
                ${question.description && question.format !== 'STATEMENT' ? `
                    <p class="question-description" style="
                        color: ${style.textColor};
                        font-size: ${style.bodyFontSize};
                        opacity: 0.8;
                        margin-bottom: 1rem;
                    ">
                        ${question.description}
                    </p>
                ` : ''}
                
                <div class="question-options" style="margin-top: 1rem; display: flex; flex-direction: column; justify-content: center; align-items: flex-start;">
                    ${this.renderQuestionOptions(question, currentResponse, style)}
                </div>
                
                ${isRequired ? '<span style="color: #ef4444; font-size: 0.75rem;">* Required</span>' : ''}
            </div>
        `;

        return questionContent;
    }

    renderQuestionOptions(question, currentResponse, style) {
        switch (question.format) {
            case 'YES_NO':
                return this.renderYesNoOptions(question, currentResponse);

            case 'SINGLE_CHOICE':
                return this.renderSingleChoiceOptions(question, currentResponse);

            case 'MULTIPLE_CHOICE':
                return this.renderMultipleChoiceOptions(question, currentResponse);

            case 'STAR_RATING':
                return this.renderStarRatingOptions(question, currentResponse);

            case 'LONG_TEXT':
                return this.renderLongTextOptions(question, currentResponse);

            case 'STATEMENT':
                return this.renderStatementOptions(question);

            default:
                return '<p>Unsupported question format</p>';
        }
    }

    renderYesNoOptions(question, currentResponse) {
        const yesValue = currentResponse?.booleanValue === true ? 'true' : '';
        const noValue = currentResponse?.booleanValue === false ? 'false' : '';

        return `
            <div class="yes-no-options">
                <label class="radio-option" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="true" 
                           ${yesValue ? 'checked' : ''}
                           onchange="window.surveyWidget.handleResponseChange('${question.id}', true, undefined, false)"
                           style="margin: 0;">
                    <span style="font-size: 1rem;">${question.yesLabel || 'Yes'}</span>
                </label>
                
                <label class="radio-option" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="false" 
                           ${noValue ? 'checked' : ''}
                           onchange="window.surveyWidget.handleResponseChange('${question.id}', false, undefined, false)"
                           style="margin: 0;">
                    <span style="font-size: 1rem;">${question.noLabel || 'No'}</span>
                </label>
            </div>
        `;
    }

    renderSingleChoiceOptions(question, currentResponse) {
        let optionsHtml = question.options.map(option => {
            const isChecked = currentResponse?.optionId === option.id;
            return `
                <label class="radio-option" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="${option.id}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="window.surveyWidget.handleResponseChange('${question.id}', '${option.id}', '${option.id}', false)"
                           style="margin: 0;">
                    <span style="font-size: 1rem;">${option.text}</span>
                </label>
            `;
        }).join('');

        // Add "Other" option if it exists
        const otherOption = question.options.find(opt => opt.isOther);
        if (otherOption) {
            const isOtherSelected = currentResponse?.optionId === otherOption.id;
            optionsHtml += `
                <label class="radio-option" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="radio" 
                           name="question_${question.id}" 
                           value="${otherOption.id}" 
                           ${isOtherSelected ? 'checked' : ''}
                           onchange="window.surveyWidget.handleResponseChange('${question.id}', '${otherOption.id}', '${otherOption.id}', false)"
                           style="margin: 0;">
                    <span style="font-size: 1rem;">${otherOption.text}</span>
                </label>
                
                ${isOtherSelected ? `
                    <div class="other-input" style="margin-top: 0.5rem;">
                        <input type="text" 
                               placeholder="Please specify..." 
                               value="${this.otherText[question.id] || ''}"
                               onchange="window.surveyWidget.handleOtherTextChange('${question.id}', this.value)"
                               style="
                                   width: 100%;
                                   padding: 0.5rem;
                                   border: 1px solid #d1d5db;
                                   border-radius: 0.375rem;
                                   font-size: 1rem;
                               ">
                    </div>
                ` : ''}
            `;
        }

        return optionsHtml;
    }

    renderMultipleChoiceOptions(question, currentResponse) {
        const selectedOptions = currentResponse?.optionId?.split(',') || [];

        let optionsHtml = question.options.map((option, index) => {
            const optionId = option.id || `option_${index}`;
            const isChecked = selectedOptions.includes(optionId);

            return `
                <label class="checkbox-option" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="checkbox" 
                           value="${optionId}" 
                           ${isChecked ? 'checked' : ''}
                           onchange="window.surveyWidget.handleMultipleChoiceChange('${question.id}', '${optionId}', this.checked)"
                           style="margin: 0;">
                    <span style="font-size: 1rem;">${option.text}</span>
                </label>
            `;
        }).join('');

        // Add "Other" option if it exists
        const otherOption = question.options.find(opt => opt.isOther);
        if (otherOption) {
            const otherOptionId = otherOption.id || `option_other`;
            const isOtherSelected = selectedOptions.includes(otherOptionId);

            optionsHtml += `
                <label class="checkbox-option" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                    <input type="checkbox" 
                           value="${otherOptionId}" 
                           ${isOtherSelected ? 'checked' : ''}
                           onchange="window.surveyWidget.handleMultipleChoiceChange('${question.id}', '${otherOptionId}', this.checked)"
                           style="margin: 0;">
                    <span style="font-size: 1rem;">${otherOption.text}</span>
                </label>
                
                ${isOtherSelected ? `
                    <div class="other-input" style="margin-top: 0.5rem;">
                        <input type="text" 
                               placeholder="Please specify..." 
                               value="${this.otherText[question.id] || ''}"
                               onchange="window.surveyWidget.handleOtherTextChange('${question.id}', this.value)"
                               style="
                                   width: 100%;
                                   padding: 0.5rem;
                                   border: 1px solid #d1d5db;
                                   border-radius: 0.375rem;
                                   font-size: 1rem;
                               ">
                    </div>
                ` : ''}
            `;
        }

        return optionsHtml;
    }

    renderStarRatingOptions(question, currentResponse) {
        const rating = currentResponse?.numberValue || 0;

        return `
            <div class="star-rating" style="display: flex; justify-content: center; gap: 0.5rem;">
                ${[1, 2, 3, 4, 5].map(starValue => `
                    <button type="button" 
                            onclick="window.surveyWidget.handleResponseChange('${question.id}', ${starValue})"
                            style="
                                padding: 0.25rem;
                                background: none;
                                border: none;
                                cursor: pointer;
                                border-radius: 50%;
                                transition: background-color 0.2s;
                            "
                            onmouseover="this.style.backgroundColor = '#f3f4f6'"
                            onmouseout="this.style.backgroundColor = 'transparent'">
                        <span style="
                            font-size: 2rem;
                            color: ${starValue <= rating ? '#fbbf24' : '#d1d5db'};
                        ">★</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    renderLongTextOptions(question, currentResponse) {
        return `
            <div class="long-text-input">
                <textarea 
                    placeholder=""
                    onchange="window.surveyWidget.handleResponseChange('${question.id}', this.value)"
                    style="
                        width: 100%;
                        padding: 0.5rem;
                        border: 1px solid #d1d5db;
                        border-radius: 0.375rem;
                        font-size: 1rem;
                        resize: none;
                        min-height: 6rem;
                    "
                >${currentResponse?.textValue || ''}</textarea>
            </div>
        `;
    }

    renderStatementOptions(question) {
        return `
            <div class="statement-content" style="text-align: left;">
                <p style="font-size: 1.125rem; font-weight: 500; margin-bottom: 1rem;">${question.description}</p>
            </div>
        `;
    }

    handleResponseChange(questionId, value, optionId, isOther = false) {
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

        this.render();
    }

    handleOtherTextChange(questionId, value) {
        this.otherText[questionId] = value;
        this.handleResponseChange(questionId, value, undefined, true);
    }

    handleNext() {
        const currentQuestion = this.survey.questions[this.currentQuestionIndex];

        if (currentQuestion?.required) {
            const hasResponse = this.responses.some(r => r.questionId === currentQuestion.id);
            if (!hasResponse) {
                this.showToast("This question is required", "error");
                return;
            }
        }

        const isLastQuestion = this.currentQuestionIndex === this.survey.questions.length - 1;

        if (isLastQuestion) {
            this.handleSubmit();
        } else {
            this.currentQuestionIndex++;
            this.render();
        }
    }

    handlePrevious() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.render();
        }
    }

    async handleSubmit() {
        if (this.testMode) {
            this.onComplete(this.responses);
            this.showToast("Survey completed (Test Mode)", "success");
            return;
        }

        this.isSubmitting = true;
        this.render();

        try {
            // Here you would implement the actual submission logic
            this.onComplete(this.responses);
            this.showToast("Survey completed successfully!", "success");
        } catch (error) {
            this.onError(error.message || "Failed to submit survey");
        } finally {
            this.isSubmitting = false;
        }
    }

    showToast(message, type = "info") {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 0.375rem;
            z-index: 1000;
            font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
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
            fontFamily: "Inter"
        };
    }

    addStyles() {
        if (document.getElementById('survey-widget-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'survey-widget-styles';
        styles.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .survey-widget * {
                box-sizing: border-box;
            }
            
            .survey-widget input[type="radio"],
            .survey-widget input[type="checkbox"] {
                accent-color: #3b82f6;
            }
            
            .survey-widget button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .survey-widget button:not(:disabled):hover {
                opacity: 0.9;
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
        this.render();
    }

    unmount() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    getResponses() {
        return this.responses;
    }

    setSurveyData(surveyData) {
        this.surveyData = surveyData;
        this.survey = surveyData;
        this.isLoading = false;
        this.render();
    }
}

// Global initialization function
window.initSurveyWidget = function (options) {
    const widget = new SurveyWidget(options);
    window.surveyWidget = widget; // Make it globally accessible for event handlers
    return widget;
};

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', function () {
    const surveyElements = document.querySelectorAll('[data-survey-widget]');
    surveyElements.forEach(element => {
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
            }
        });

        widget.container = element;
        widget.render();
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SurveyWidget;
}
