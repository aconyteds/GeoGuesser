define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",

  "dojo/text!./Intro.html"
], function(declare, _WidgetBase, _TemplatedMixin,
  templateString) {
  var Intro = declare([_WidgetBase, _TemplatedMixin], {
    templateString: templateString
  });

  return Intro;
});
