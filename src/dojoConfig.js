window.dojoConfig = {
  baseUrl: ".",
  parseOnLoad: true,
  async: true,
  packages: [{
    name: "app",
    location: "app"
  }, {
    name: "widgets",
    location: "app/widgets"
  }, {
    name: "services",
    location: "app/services"
  }, {
    name: "configs",
    location: "app/configs"
  }, {
    name: "dojo",
    location: "/node_modules/dojo"
  }, {
    name: "dijit",
    location: "/node_modules/dijit"
  }, {
    name: "dojox",
    location: "/node_modules/dojox"
  }, {
    name: "esri",
    location: "/node_modules/arcgis-js-api"
  }, {
    name: "dgrid",
    location: "/node_modules/dgrid"
  }, {
    name: "dstore",
    location: "/node_modules/dstore"
  }, {
    name: "moment",
    location: "/node_modules/moment"
  }, {
    name: "jquery",
    location: "/node_modules/jquery/dist/",
    main: "jquery.min"
  }]
};
