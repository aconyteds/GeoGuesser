define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",

  "dojo/_base/lang",
  "dojo/Evented",
  "dojo/on",
  "dojo/dom-attr",
  "dojo/dom-style",
  "dojo/dom-construct",

  "services/game",
  "widgets/Game/Question",
  "configs/questions",

  "dojo/text!./Game.html",
  "dojo/text!./Feedback.html",

  //included in template
  "dijit/form/Button"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  lang, Evented, on, domAttr, domStyle, domConstruct,
  GameService, Question, questions,
  templateString, feedbackTemplate) {
  //Feedback element which displays the results of a question to a user
  var Feedback = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: feedbackTemplate,
    constructor: function() {
      this.inherited(arguments);
      //Color of the alert box
      this.alertColor = "danger";
    },
    postMixInProperties: function() {
      this.inherited(arguments);
      //Check if they got the answer wrong
      if (this.correct) {
        //They were right, give them good vibes
        this.alertColor = "success";
        this.feedback = "Correct! " + this.score + " points scored!";
      } else {
        //They were wrong, give them the right answer
        this.feedback = "Incorrect, the correct answer was " + this.question.answer + ".";
      }
    },
    nextQuestion: function(event) {
      //Event emitter, lets the parent know to continue
      this.emit("next-question");
    }
  });

  var Game = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: templateString,
    baseClass: "main-game",
    currentScore: 0,
    constructor: function() {
      this.inherited(arguments);
      //Set the score to 0
      this.currentScore = 0;
      //Initialize a new instance of the game service
      this._game = new GameService({
        questions: questions.easy
      });
    },
    postCreate: function() {
      this.inherited(arguments);
      //Get the first Question, Game has started
      this.getQuestion();
    },
    getQuestion: function() {
      //Retrieves a random question
      var question = this._game.getQuestion();
      //Check that the question doesn't have the end condition
      if (question.task !== "Game Over") {
        //Create a new Question Widget based on the retrieved question
        var currQuestion = new Question({
          question: question
        }).placeAt(this.questionContainer);
        //When the user answers, we need to verify it, only happens once
        on.once(currQuestion, "answer", lang.hitch(this, this.answer));
      } else {
        //Game is over, final Score Screen
        this.gameOver();
      }
      //Return the question we got in case it is relevant
      return question;
    },
    answer: function(props) {
      //User wants to answer the question
      var correct = this._game.submitAnswer(props.answer);
      //Check whether the answer was correct
      if (correct) {
        //It was, so we need to update the score
        this.currentScore += props.score;
        domAttr.set(this.scoreContainer, "innerHTML", this.currentScore);
      } else {
        //It wasn't, update the wrong answer tracker
        domAttr.set(this.incorrectContainer, "innerHTML", this._game.getIncorrectCount());
      }
      //Give the user feedback regardless
      this._provideFeedback({
        correct: correct,
        score: props.score,
        question: this._game.getCurrQuestion()
      });
    },
    _provideFeedback: function(props) {
      //Create the Feedback interface object
      var feedback = new Feedback({
        correct: props.correct,
        score: props.score,
        question: props.question
      }).placeAt(this.questionContainer);
      //When the user is ready to continue, they hit the button
      var fbHandler = feedback.on("next-question", lang.hitch(this, function() {
        //We remove the event handler, since it should only occur once
        fbHandler.remove();
        //Get rid of the feedback
        feedback.destroy();
        //New question time
        this.getQuestion();
      }));
    },
    gameOver: function() {
      //Create the final Score screen
      domStyle.set(this.gameDetails, {
        display: "none"
      });
      //Calculate the highest possible score
      var maxScore = this._game.getAnswered() * 1000,
        //Get the user's average
        overall = (this.currentScore / maxScore) * 100,
        //Default to the worst possible option, glass half empty I guess
        highlight = "danger";
      //Change the score higlight color based on their percentage
      if (overall > 80) {
        highlight = "success";
      } else if (overall > 60) {
        highlight = "warning";
      }
      //Create an element to display dynamic feedback
      domConstruct.create("div", {
        innerHTML: "Game Over! You answered <i>" + this._game.getIncorrectCount() + "</i> questions incorretly, and eneded with a total score of <b class='text-" + highlight + "'>" + this.currentScore + "</b>"
      }, this.questionContainer);
      //Create a button to play again
      domConstruct.create("a", {
        innerHTML: "Sweet!",
        className: "btn btn-primary",
        href: "#/init",
        onclick: lang.hitch(this, function() {
          this.destroy();
        })
      }, domConstruct.create("div", {
        className: "text-center"
      }, this.questionContainer));
    }
  });

  return Game;
});
