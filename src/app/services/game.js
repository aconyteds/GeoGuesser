/**
  File contains all business logic for checking answers for the user
*/
define([
  "dojo/_base/array",
  "dojo/_base/lang",
  "dojo/_base/declare",
  "dijit/_WidgetBase"
], function(array, lang, declare, _WidgetBase) {

  var GameService = declare([_WidgetBase], {
    constructor: function() {
      this.inherited(arguments);
      this.incorrectAnswers = 0;
      this.totAnswered = 0;
      this.currQuestion = null;
    },
    postMixInProperties: function() {
      this.inherited(arguments);
      //We need a clone because we are going to destroy this thing over the course of the game
      var questions = lang.clone(this.questions);
      this.questions = questions;
    },
    postCreate: function(options) {
      this.inherited(arguments);
      return this;
    },
    getQuestion: function() {
      //Returns a question
      var questions = this.questions;
      if (this.incorrectAnswers < 3 && !!questions.length) {
        var random = this._getRandomInt(0, questions.length - 1);
        this.currQuestion = questions[random];
        //remove the question so it is not asked again
        questions.splice(random, 1);
      } else {
        //Game has eneded
        this.currQuestion = {
          task: "Game Over"
        };
      }

      return this.currQuestion;
    },
    getCurrQuestion: function() {
      return this.currQuestion;
    },
    getIncorrectCount: function() {
      return this.incorrectAnswers;
    },
    getAnswered: function() {
      return this.totAnswered;
    },
    submitAnswer: function(answer) {
      //Returns a whether the answer is correct or not
      var correct = answer.toString().toUpperCase() === this.currQuestion.answer.toString().toUpperCase();
      //if the answer is incorrect, we add 1 to the incorrect answers controller
      this.incorrectAnswers += !correct;
      this.totAnswered++;
      return correct;
    },
    increaseDifficulty: function() {
      //Increases the current difficult of the game (advanced feature)
    },
    _getRandomInt: function(min, max) {
      return Math.round(Math.random() * (max - min) + min); //The maximum is inclusive and the minimum is inclusive
    }
  });

  return GameService;
});
