sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],

/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller 
 * @param {typeof sap.ui.model.Filter} Filter 
 * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
 */

function (Controller, Filter, FilterOperator) {
    "use strict";

    function onInit(){
        
        var oJSONModel = new sap.ui.model.json.JSONModel();
        var oView = this.getView();
        var i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

        oJSONModel.loadData("./model/json/Countries.json", false);
        oJSONModel.attachRequestCompleted(function (oEventModel){
            console.log(JSON.stringify(oJSONModel.getData()));
        }); 
        oView.setModel(oJSONModel);

        var oJSONModelEmployees = new sap.ui.model.json.JSONModel();
        oJSONModelEmployees.loadData("./model/json/Employees.json", false);
        oView.setModel(oJSONModelEmployees, "jsonEmployees");        

    };

    function onFilter(){
        var oJSON = this.getView().getModel().getData(); 
        var filters = [];

        if (oJSON.EmployeeId !== "") {
            filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId ));
        };

        if (oJSON.CountryKey !== "") {
            filters.push(new Filter("Country", FilterOperator.EQ,oJSON.CountryKey ));
        };

        var oList = this.getView().byId("tableEmployee");
        var oBinding = oList.getBinding("items");
        oBinding.filter(filters);

    };

    function onClearFilter(){
        var oModel = this.getView().getModel();
        oModel.setProperty("/EmployeeId", "");
        oModel.setProperty("/CountryKey", "");

        var filters = [];
        var oList = this.getView().byId("tableEmployee");
        var oBinding = oList.getBinding("items");
        oBinding.filter(filters); 

    };
 
    function showPostalCode(oEvent) {
        //var itemPressed = oEvent.getSource();
        //var oContext =  itemPressed.getBindingContext("jsonEmployees");
        //var objectContext = oContext.getObject(); 

        var objectContext = oEvent.getSource().getBindingContext("jsonEmployees").getObject(); 
        
        sap.m.MessageToast.show(objectContext.PostalCode);
    };

    var Main = Controller.extend("fiori.employees.controller.MainView", {} );

    Main.prototype.onValidate = function() {
        var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();
            if (valueEmployee.length === 6 ) {
                inputEmployee.setDescription("OK");
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            } else {
                inputEmployee.setDescription("Not OK");
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            };
    };

    Main.prototype.onInit = onInit;
    Main.prototype.onFilter = onFilter;
    Main.prototype.onClearFilter = onClearFilter;
    Main.prototype.showPostalCode = showPostalCode;

    return Main;

});
