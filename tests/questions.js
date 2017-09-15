define([
  "doh/runner",
  "dojo/_base/array",
  "app/configs/questions"
], function(doh, array, questions) {
  doh.register("Questions", [{
      name: "TestConfig",
      setUp: function() {
        this.questions = questions;
      },
      runTest: function() {
        for (var i in this.questions) {
          var difficulty = this.questions[i];
          doh.assertNotEqual(0, difficulty.length);
          array.forEach(difficulty, function(question) {
            doh.assertNotEqual("", question.task);
            doh.assertEqual(3, question.hints.length);
            doh.assertNotEqual("", question.answer);
            doh.assertTrue(!!question.type);
          });
        }
        // ...
      },
      tearDown: function() {}
    },
    // ...
  ]);
});
