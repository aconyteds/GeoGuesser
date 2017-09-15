require([
    "jquery",
    "esri/Map",
    "esri/views/MapView",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/on",
    "dojo/topic",

    "app/Router",
    "widgets/Game/Intro",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",

    "dojo/domReady!"
  ],
  function($, EsriMap, MapView, domConstruct, query, on, topic,
    Router, Intro, QueryTask, Query) {
    "use strict";

    var map = new EsriMap({
      basemap: "topo"
    });
    var view = new MapView({
      map: map,
      container: "viewDiv",
      center: [-99.00244140625095, 40.770093305172075],
      zoom: 4
    });

    //Create a query task to get states
    var stateQueryTask = new QueryTask({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0"
    });

    view.on("click", function(event) {
      //Handle Querying states
      var stateQuery = new Query();
      stateQuery.geometry = event.mapPoint;
      stateQuery.distance = 1;
      stateQuery.units = "miles";
      stateQuery.spatialRelationship = "intersects";
      stateQuery.outFields = ["STATE_NAME"];

      stateQueryTask.execute(stateQuery).then(function(results) {
        //anyone wanting to know what state the user just clicked on can see it on this channel
        topic.publish("query/state", results.features[0].attributes.STATE_NAME);
      });

      //TODO: Handle Querying cities
    });
    //Add the intro to the page
    new Intro().placeAt("gameContainer");
    //Initialize the router
    new Router();
    //First time the view is done loading, we want to do our final initializations and remove the loader
    on.once(view, "layerview-create", function() {
      //Map has finished loading, let the user play
      domConstruct.destroy(query("loader.loader")[0]);
    });

  });
//# sourceMappingURL=main.js.map
