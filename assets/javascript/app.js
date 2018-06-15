
//   ____    ____  _       ____  _____ __ __    ___  ____  
//  |    \  /    || |     /    |/ ___/|  |  |  /  _]|    \ 
//  |  o  )|  o  || |    |  o  (   \_ |  |  | /  [_ |  D  )
//  |    < |     || |___ |     |\__  ||  _  ||    _]|    / 
//  |  o  \|  _  ||     ||  _  |/  \ ||  |  ||   [_ |    \ 
//  |      |  |  ||     ||  |  |\    ||  |  ||     ||  .  \
//  |_____/|__|__||_____||__|__| \___||__|__||_____||__|\_|
                                                        
// *******Trivia Game pseudo code*******
// Start button to start game and timer
// Timer counting down once started (15-20 sec)
// Show only one question until the player answers it or their time runs out
// Trivia questions with 4 multiple choice answers; only one answer per question
// Correct answer: 
//      show a screen congratulating them for choosing the right option. After a few seconds, display the next question -- do this without user input.
// wrong answers and time-outs:
//      If the player runs out of time, tell the player that time's up and display the correct answer. Wait a few seconds, then show the next question.
//      If the player chooses the wrong answer, tell the player they selected the wrong option and then display the correct answer. Wait a few seconds, then show the next question.
// When games ends show total correct and incorrect answer totals, and an option to restart game (without reloading the page)



$(document).ready(function() {
    //Create Variables
    let currentQuestion;
    let correctAnswer;
    let incorrectAnswer;
    let unanswered;
    let seconds;
    let gameTime;
    let answered;
    let userGuess;
    let gameAlerts = {
        correct: "Good Job! That's correct!",
        incorrect: "Nope, that's incorrect.",
        endTime: "Times up!",
    }
    

    // Questions, possible answers, and correct answer in object array
    let questions = [{
        question: 'What is the first thing you do before approaching any emergency situation?',
        answers: ['Check the area for danger', 
                  'Call 911', 
                  'Shout for help', 
                  'Find a licensed physician'],
        answer: 0
    }
    ,{
        question: 'When should personal protective equipment such as gloves and/or CPR barrier devices be used?',
        answers: ['Only when the casualty is bleeding', 
                  'Only when the casualty appears to be ill', 
                  'Only when the casualty does not appear to be young and healthy', 
                  'Every time with everyone'],
        answer: 3
    },{
        question: 'After determining an adult casualty is unresponsive, quickly check for a pulse (no more than 10 seconds), then:',
        answers: ['Activate EMS and retrieve an AED if available', 
                  'Tap and shout', 
                  'Open the casualty’s airway', 
                  'Begin effective chest compressions'],
        answer: 0
    },{
        question: 'What must you obtain from a conscious, adult casualty before you give any first aid assistance?',
        answers: ['Proof of insurance', 
                  'A medical history', 
                  'Consent', 
                  'Their wallet'],
        answer: 2
    },{
        question: 'An individual begins to complain of prolonged chest pain, numbness on the left side, and breathing difficulty.  For what emergency should this person be treated?',
        answers: ['Indigestion', 
                  'Asthma attack', 
                  'Heart Attack', 
                  'Stroke'],
        answer: 2
    },{
        question: 'The “Universal Signal” for choking is:',
        answers: ['Casualty exclaims, “I’m choking!”', 
                  'Casualty clutches at his/her heart', 
                  'Casualty grasps at your throat', 
                  'Casualty places his/her hands at or around his/her throat'],
        answer: 3
    },{
        question: 'Once CPR has begun, which of the following situations will legally allow a rescuer to stop?',
        answers: ['The casualty’s ribs break', 
                  'The casualty vomits', 
                  '15 minutes have elapsed since CPR was initiated', 
                  'None of the above'],
        answer: 3
    },{
        question: 'Without oxygen, brain death will usually begin within:',
        answers: ['30 seconds', 
                  '1 hour or more', 
                  '4 to 6 minutes', 
                  '6 to 10 minutes'],
        answer: 2
    },{
        question: 'During CPR, the chest of the Adult should be compressed:',
        answers: ['1/2” ', 
                  '1"', 
                  'At least 2"', 
                  'At least 8” deep'],
        answer: 2
    }
    ,{
        question: 'The Rescue Breath to Chest Compression ratio for Adult CPR (one rescuer) is:',
        answers: ['15 breaths every 2 compressions', 
                  '2 breaths every 30 compressions', 
                  '1 breath every 5 compressions', 
                  '5 breaths every 1 compression'],
        answer: 1
    }];

    // Functions for Game //////////////////////////////////////////////////////////////////////////////////////////////


    function renderGame() {
        currentQuestion = 0;
        correctAnswer = 0;
        incorrectAnswer = 0;
        unanswered = 0;
        $('#quiz-question-page').show();
        $('#quiz-answer-page').hide();
        $('#quiz-intro-page').hide();
        newQuestion();
    }

    function newQuestion() {
        answered = true;
        //sets new question
        $('#game-alert').empty();
        $('#correct-answer-text').empty();
        $('#question').html('<h2>' + questions[currentQuestion].question + '</h2>');
        //sets anwswers in buttons
        for (let i = 0; i < 4; i++) {
            let possibleAnswers = $('<button>');
            possibleAnswers.text(questions[currentQuestion].answers[i]);
            possibleAnswers.attr({'data-ninja':i});
            possibleAnswers.addClass('answer-button list-group-item list-group-item-action list-group-item-primary font-weight-bold text-white');
            $('#answer-list').append(possibleAnswers);
        }

        gameTimer();

        //clicking an answer will pause the time and setup answerPage
        $('.answer-button').on('click', function() {
            userGuess = $(this).data('ninja');
            clearInterval(gameTime);
            answerPage();
        });
    }

    function gameTimer(){
        seconds = 16;
        answered = true;
        gameTime = setInterval(countDown, 1000);
    }
    
    function countDown(){
        seconds--;
        $('#time-remaining').html('Time Remaining: ' + seconds);
        $("#progressBar")[0].value = 16 - seconds;


        if (seconds <= 0){
            clearInterval(gameTime);
            answered = false;
            answerPage();
        }
    }


    function answerPage() {
        $('#question').empty();
        $('#answer-list').empty();
    
        let correctAnswerText = questions[currentQuestion].answers[questions[currentQuestion].answer];
        let correctAnswerData = questions[currentQuestion].answer;

        //checks to see correct, incorrect, or unanswered
        if ((userGuess === correctAnswerData) && (answered === true)){
            correctAnswer++;
            $('#game-alert').html(gameAlerts.correct);
        } else if ((userGuess !== correctAnswerData) && (answered === true)){
            incorrectAnswer++;
            $('#game-alert').html(gameAlerts.incorrect);
            $('#correct-answer-text').html('The correct answer was: ' + correctAnswerText);
        } else {
            unanswered++;
            $('#game-alert').html(gameAlerts.endTime);
            $('#correct-answer-text').html('The correct answer was: ' + correctAnswerText);
            answered = true;
        }
        
        if (currentQuestion === (questions.length - 1)){
            setTimeout(gameOver, 3000)
        } else{
            currentQuestion++;
            setTimeout(newQuestion, 3000);
        }	
    }

    
    function gameOver() {

        $('#quiz-question-page').hide();
        $('#quiz-answer-page').hide();
        $('#quiz-game-over-page').show();

        $('#quiz-game-over-page').html(`
        <div class="jumbotron shadow text-center quiz-game-over-page">
            <h1 class="display-4" id="game-over-title">Finished!</h1>
            <p class="lead">Here are your results.</p>
            <hr class="my-4">
            <h2>Correct Answers: ${correctAnswer}</h2>
            <h2>Incorrect Answers: ${incorrectAnswer}</h2>
            <h2>Unanswered: ${unanswered}</h2>
            <button class="btn btn-primary btn-lg mt-3" role="button" id="restart-button">Restart Quiz</button>
        </div>
        
        `);

        $('#restart-button').on('click', function(){
            // $('#quiz-intro-page').hide();
            $('#quiz-game-over-page').hide();
            // $('#quiz-question-page').show();
            renderGame();
        });
    }




    // End Functions for Game //////////////////////////////////////////////////////////////////////////////////////////////

    $('#start-button').on('click', function(){
        $('#quiz-intro-page').hide();
        $('#quiz-question-page').show();
        renderGame();
    });


    

    $('#quiz-intro-page').show();
    $('#quiz-question-page').hide();
    
    
});