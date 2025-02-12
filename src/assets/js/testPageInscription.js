document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app');
    const templates = [
        document.querySelector('#question1'),
        document.querySelector('#question2'),
        document.querySelector('#question3'),
        document.querySelector('#question4'),
        document.querySelector('#question5'),
        document.querySelector('#question6'),
        document.querySelector('#question7'),
        document.querySelector('#question8'),
        document.querySelector('#question9'),

        // Add more questions as needed
        document.querySelector('#question10')
    ];
    
    let currentQuestion = 0;

    function showNextQuestion() {
        if (currentQuestion < templates.length) {
            app.innerHTML = '';
            const content = templates[currentQuestion].content.cloneNode(true);
            app.appendChild(content);
            const nextButton = app.querySelector('.submit-btn');
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    currentQuestion++;
                    showNextQuestion();
                });
            }
        }
    }

    showNextQuestion();
});
