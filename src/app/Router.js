define([
  "dojo/router",
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dojo/dom-construct",

  "widgets/game/Intro",
  "widgets/game/Game"
], function(router, declare, _WidgetBase, domConstruct,
  Intro, Game) {
  var Router = declare([_WidgetBase], {
    postCreate: function() {
      //Into screen
      router.register("/init", this._init);
      //New game handler, initializes a game
      router.register("/new", this._newGame);

      router.startup();
    },
    _init: function() {
      domConstruct.empty("gameContainer");
      new Intro().placeAt("gameContainer");
    },
    _newGame: function() {
      domConstruct.empty("gameContainer");
      new Game().placeAt("gameContainer");
    }
  });

  return Router;
});
