define([
  "doh/runner",
  "dojo/_base/array",
  "dojo/_base/lang",
  "app/services/game"
], function(doh, array, lang, GameService) {
  doh.register("Game", [{
    name: "initializeGame",
    setUp: function() {
      var questions = {
        base: [{
          task: "question1"
        }, {
          task: "question2"
        }]
      };
      this.game = new GameService({
        questions: questions
      });
      this.questions = questions;
    },
    runTest: function() {
      console.log(this.game);
      doh.assertEqual(this.game.questions, this.questions);
      doh.assertEqual(0, this.game.getAnswered());
      doh.assertEqual(0, this.game.getIncorrectCount());
    }
  }, {
    name: "GetQuestion",
    setUp: function() {
      this.tasks = "123456789".split("").sort();
      this.game = new GameService({
        questions: array.map(this.tasks, function(value) {
          return {
            task: value
          };
        })
      });
    },
    runTest: function() {
      var usedQuestions = [];
      //Iterate through all of the tasks to get all the answers out
      array.forEach(this.tasks, lang.hitch(this, function(task) {
        usedQuestions.push(this.game.getQuestion().task);
      }));
      //Make sure we have random questions, should not match the original input 1:258,117,479.1713197 chance of false failure
      doh.assertNotEqual(this.tasks, usedQuestions);
      //Cheack that getCurrentQuestion works
      doh.assertEqual(this.game.getCurrQuestion().task, usedQuestions[usedQuestions.length - 1]);
      //Check that each question is only used once
      doh.assertEqual(this.tasks, usedQuestions.sort());
      //End of game should have "Game Over"
      doh.assertEqual("Game Over", this.game.getQuestion().task);
    }
  }, {
    name: "SubmitAnswer",
    setUp: function() {
      this.answer = 1;
      this.game = new GameService({
        questions: [{
          task: this.answer,
          answer: this.answer
        }]
      });

    },
    runTest: function() {
      this.game.getQuestion();
      doh.assertFalse(this.game.submitAnswer("wrong answer"));
      doh.assertEqual(1, this.game.getIncorrectCount());
      doh.assertTrue(this.game.submitAnswer(this.answer));
    }
  }]);
});
