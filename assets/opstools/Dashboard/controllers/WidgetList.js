
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/Dashboard/controllers/ADDBWidgetTable.js',
        'opstools/Dashboard/controllers/ADDBWidgetTableNSCUpdate.js',
        'opstools/Dashboard/controllers/ADDBWidgetGmaGraph.js',
        '//opstools/Dashboard/views/WidgetList/WidgetList.ejs',
        '//opstools/Dashboard/views/WidgetList/WidgetDiv.ejs',
function(){


    // define the known widgetTypes here:
    var widgetTypes = {
        'table': function() { return AD.controllers.opstools.Dashboard.ADDBWidgetTable; },
        'tableUpdateNSC': function() { return AD.controllers.opstools.Dashboard.ADDBWidgetTableNSCUpdate; },
        'gmaGraph': function() { return AD.controllers.opstools.Dashboard.ADDBWidgetGmaGraph;}

    }


    // Namespacing conventions:
    // AD.controllers.[application].[controller]
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};
    if (typeof AD.controllers.opstools.Dashboard == 'undefined') AD.controllers.opstools.Dashboard = {};
    AD.controllers.opstools.Dashboard.WidgetList = AD.classes.UIController.extend({
    // AD.Control.extend('Dashboard.WidgetList', {

        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/Dashboard/views/WidgetList/WidgetList.ejs',
                    templateWidgetDiv:'//opstools/Dashboard/views/WidgetList/WidgetDiv.ejs'
            }, options);
            this.options = options;

            // Call parent init
            AD.classes.UIController.apply(this, arguments);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();

            this.initList();


        },



        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));


            this.widgetListArea = this.element.find('.opsDashboard-widget-list');

            // attach ADDBWidget
            new AD.controllers.opstools.Dashboard.ADDBWidget(this.element.find('.widget-option'));

        },



        initList:function() {
            var self = this;

            AD.comm.service.get({ url:'/opsdashboard/widget'})
            .fail(function(err){
console.error('Dang!  Error trying to load /opsdashboard/widget  :');
console.log(err);
            })
            .then(function(definitions){

                // foreach definition
                definitions.forEach(function(definition){


                    // verity info:
                    definition.type = definition.type || 'table';


                    // create a div & attach the ADDBWidget()
                    self.widgetListArea.append(can.view(self.options.templateWidgetDiv, { widget:definition}));


                    // if we know the given type of widget then create an instance of it
                    var types = definition.type.split('.');
                    if (widgetTypes[types[0]]) {
                        var widget = widgetTypes[types[0]]();


                        new widget(self.widgetListArea.find('.widget-id-'+definition.id), definition);

                    }


                })
                    
            })
        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});