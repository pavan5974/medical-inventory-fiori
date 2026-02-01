sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/Dialog",
  "sap/m/Button",
  "sap/m/Input",
  "sap/m/VBox"
], function (Controller, MessageToast, JSONModel, Filter, FilterOperator, Dialog, Button, Input, VBox) {
  "use strict";

  return Controller.extend("medical.inventory.controller.Main", {

    onInit: function () {
      // Preload 10 medicines
      var data = {
        medicines: [
          { name: "Paracetamol", price: 20, stock: 50 },
          { name: "Crocin", price: 30, stock: 8 },
          { name: "Aspirin", price: 25, stock: 5 },
          { name: "Ibuprofen", price: 40, stock: 15 },
          { name: "Amoxicillin", price: 50, stock: 20 },
          { name: "Cough Syrup", price: 35, stock: 12 },
          { name: "Cetirizine", price: 18, stock: 30 },
          { name: "Vitamin C", price: 22, stock: 40 },
          { name: "Metformin", price: 45, stock: 10 },
          { name: "Omeprazole", price: 55, stock: 25 }
        ]
      };

      var oModel = new JSONModel(data);
      this.getView().setModel(oModel);

      // Load from localStorage if available
      var storedData = localStorage.getItem("medData");
      if (storedData) {
        oModel.setData(JSON.parse(storedData));
      }
    },

    saveLocal: function () {
      var data = this.getView().getModel().getData();
      localStorage.setItem("medData", JSON.stringify(data));
    },

    // SEARCH
    onSearch: function (oEvent) {
      var sValue = oEvent.getSource().getValue();
      var oTable = this.byId("medTable");
      var oBinding = oTable.getBinding("items");

      var aFilters = [];
      if (sValue) {
        aFilters.push(new Filter("name", FilterOperator.Contains, sValue));
      }
      oBinding.filter(aFilters);
    },

    // ADD MEDICINE DIALOG
    onOpenAddDialog: function () {
      var that = this;

      if (!this.oDialog) {
        this.oDialog = new Dialog({
          title: "Add Medicine",
          content: new VBox({
            items: [
              new Input(this.createId("addName"), { placeholder: "Medicine Name" }),
              new Input(this.createId("addPrice"), { placeholder: "Price", type: "Number" }),
              new Input(this.createId("addStock"), { placeholder: "Stock", type: "Number" })
            ]
          }),

          beginButton: new Button({
            text: "Save",
            press: function () {
              var name = that.byId("addName").getValue();
              var price = that.byId("addPrice").getValue();
              var stock = that.byId("addStock").getValue();

              // Validate inputs
              if (!name || !price || !stock) {
                MessageToast.show("Please fill all fields");
                return;
              }

              var oModel = that.getView().getModel();
              var aData = oModel.getProperty("/medicines");

              aData.push({
                name: name,
                price: parseFloat(price),
                stock: parseInt(stock)
              });

              oModel.setProperty("/medicines", aData);
              that.saveLocal();
              MessageToast.show("Medicine Added");

              // Clear input fields
              that.byId("addName").setValue("");
              that.byId("addPrice").setValue("");
              that.byId("addStock").setValue("");

              that.oDialog.close();
            }
          }),

          endButton: new Button({
            text: "Cancel",
            press: function () {
              that.oDialog.close();
            }
          })
        });

        this.getView().addDependent(this.oDialog);
      }

      this.oDialog.open();
    },

    // DELETE MEDICINE
    onDelete: function (oEvent) {
      var oModel = this.getView().getModel();
      var oItem = oEvent.getSource().getParent().getParent();
      var index = oItem.getBindingContext().getPath().split("/")[2];

      var aData = oModel.getProperty("/medicines");
      aData.splice(index, 1);
      oModel.setProperty("/medicines", aData);

      this.saveLocal();
      MessageToast.show("Deleted");
    },

    // EDIT (Dummy)
    onEdit: function () {
      MessageToast.show("Edit feature can be extended");
    }

  });
});
