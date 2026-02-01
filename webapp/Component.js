sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("medical.inventory.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      var oData = {
        medicines: [
          { name: "Paracetamol", price: 20, stock: 50 },
          { name: "Crocin", price: 30, stock: 8 },
          { name: "Aspirin", price: 25, stock: 5 }
        ]
      };

      var oModel = new JSONModel(oData);
      this.setModel(oModel);
    }
  });
});
