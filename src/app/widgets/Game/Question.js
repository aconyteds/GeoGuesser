define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/dom-construct",
  "dojo/Evented",
  "dojo/topic",

  "dijit/ProgressBar",
  "dojo/_base/lang",
  "services/game",

  "dojo/text!./Question.html"
  //Include items only in the template
], function(declare, _WidgetBase, _TemplatedMixin, domConstruct, Evented, topic,
  ProgressBar, lang, gameService,
  templateString) {

  var Question = declare([_WidgetBase, _TemplatedMixin, Evented], {
    templateString: templateString,
    baseClass: "question",
    constructor: function() {
      this.inherited(arguments);
      this._currHint = 0;
      //Default time to answer questions, overridable by the constructor
      this.timeout = 30;
      //The amount of points a question is worth
      this.pointValue = 1000;
    },
    postMixInProperties: function() {
      this.inherited(arguments);
      //Setup the placeholder with the first character capitalized
      this.placeholder = this.question.type.charAt(0).toUpperCase() + this.question.type.substr(1);
    },
    postCreate: function() {
      this.inherited(arguments);
      //do question stuff here
      //Add the first hint
      this._addHint();
      //Initialize the timer
      this._initTimer();
      //Add a handler which watches for layer inputs
      this._addLayerHandlers();
    },
    _addHint: function() {
      //Checks the current hint value and returns the next in the list
      if (this._currHint < this.question.hints.length) {
        domConstruct.create("li", {
          innerHTML: this.question.hints[this._currHint++]
        }, this.hintContainer);
      }
    },
    _initTimer: function() {
      //How long the user has to answer the question
      var timer = new ProgressBar({
        style: "width:100%",
        value: 100
      }, this.timer);
      timer.startup();
      //How long the user has to answer the question
      var seconds = this.timeout * 1000,
        //The amount of time remaning
        timeRemaining = seconds,
        //The amount of time between "ticks", want 100 equal increments
        increment = seconds / 100;
      //The interval function that updates the hints and the progress bar
      var interval = setInterval(lang.hitch(this, function() {
        timeRemaining -= increment;
        if (timeRemaining >= 0) {
          var percent = (timeRemaining / seconds) * 100;
          //on 75 or 50 percent we want to add a hint
          if (percent === 75 || percent === 50) {
            this._addHint();
          }
          //Update the progress bar
          timer.set("value", percent);
        } else {
          //Times up, submit whatever answer the user has
          this._answer();
        }
      }), increment);
      //Add these to the object so they can be destroyed later
      this.timer = timer;
      this.interval = interval;
    },
    _answer: function(event) {
      //If we are passing in an event, this is an on click event
      event && event.preventDefault();
      var answer = this.answer.value;
      //Lets the parent know the user has answered
      this.emit("answer", {
        answer: answer,
        score: this.pointValue * (this.timer.get("value") / 100)
      });
      //This question is done now, remove it
      this.destroy();
    },
    _addLayerHandlers: function() {
      //Function will add topic listeners when the user clicks on the map
      this.topic = topic.subscribe("query/" + this.question.type, lang.hitch(this, function(result) {
        this.answer.value = result;
      }));
    },
    destroy: function() {
      //Cleanup
      this.timer && this.timer.destroy();
      this.interval && clearInterval(this.interval);
      this.topic.remove();
      this.inherited(arguments);
    }
  });

  return Question;
});
