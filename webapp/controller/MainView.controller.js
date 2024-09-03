sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
/**
 * 
 * @param {*} Controller 
 * @returns 
 */
function (Controller) {
    "use strict";
 
    return Controller.extend("alfa.listapp.controller.MainView", {
        onInit: function () { 
            var oJSONModel = new sap.ui.model.json.JSONModel(); 
            oJSONModel.loadData("./model/json/ListData.json");
            this.getView().setModel(oJSONModel);  
        },

        getGroupHeader: function (oGroup) {
            var groupHeaderListItem = new sap.m.GroupHeaderListItem({
                title : oGroup.key,
                upperCase : true
            }); 
            return groupHeaderListItem;
        },

        onShowSelectedItem : function(){
            var standardList = this.getView().byId("StandardList");
            var selectedItems = standardList.getSelectedItems();
            var i18nModel =  this.getView().getModel("i18n").getResourceBundle();
            
            if (selectedItems.length === 0) {
                sap.m.MessageToast.show(i18nModel.getText("noSelectedItems"));
            } else {
                var textMessage = i18nModel.getText("selectedItems")

                for( var item in selectedItems ) {
                    var context = selectedItems[item].getBindingContext();
                    var oContext = context.getObject();
                    textMessage = textMessage + " - " + oContext.Material
                }

                sap.m.MessageToast.show(textMessage);
            }
        },

        onDeleteSelectedItems : function() {
            var standardList = this.getView().byId("StandardList");
            var selectedItems = standardList.getSelectedItems();
            var i18nModel =  this.getView().getModel("i18n").getResourceBundle();
            
            if (selectedItems.length === 0) {
                sap.m.MessageToast.show(i18nModel.getText("noSelectedItems"));
            } else {
                var textMessage = i18nModel.getText("selectedItems");
                var model = this.getView().getModel();
                var products = model.getProperty("/Products");

                var arrayId = []; 

                for (var i in selectedItems){
                    var context = selectedItems[i].getBindingContext();
                    var oContext = context.getObject();
                    arrayId.push(oContext.Id);
                    textMessage = textMessage + " - " + oContext.Material;
                }

                products = products.filter(function(p){
                    return !arrayId.includes(p.Id);
                });

                model.setProperty("/Products", products);
                standardList.removeSelections();

                sap.m.MessageToast.show(textMessage);
            }
        },

        onDeleteItems : function(oEvent){

            var seletedRow = oEvent.getParameter("listItem");
            var context = seletedRow.getBindingContext();
            var splitPath = context.getPath().split("/");
            var indexSeletedRow =  splitPath[splitPath.length-1];
            var model =  this.getView().getModel();
            var products =  model.getProperty("/Products");
            products.splice(indexSeletedRow,1);
            model.refresh();

        }

    });
});
