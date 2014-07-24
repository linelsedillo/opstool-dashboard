
steal(
        // List your Controller's dependencies here:
        'appdev',
        '/opstools/Dashboard/controllers/WidgetList.js',

        '/js/sDashboard/sDashboard.css',
        '/js/datatables/media/js/jquery.dataTables.min.js',
        '/js/Flotr2/flotr2.min.js'

).then(
        '/js/sDashboard/jquery-sDashboard.js',

//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        '/opstools/Dashboard/views/Dashboard/Dashboard.ejs',
function(){

    // OpsTool Namespacing conventions:
    // AD.controllers.opstools.[application].Tool
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};
    if (typeof AD.controllers.opstools.Dashboard == 'undefined') AD.controllers.opstools.Dashboard = {};
    AD.controllers.opstools.Dashboard.Tool = AD.classes.opsportal.OpsTool.extend({


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/Dashboard/views/Dashboard/Dashboard.ejs',
                    resize_notification: 'Dashboard.resize',
                    tool:null   // the parent opsPortal Tool() object
            }, options);
            this.options = options;

            // Call parent init
            AD.classes.opsportal.OpsTool.prototype.init.apply(this, arguments);


            this.dataSource = this.options.dataSource; 

            this.initDOM();


            AD.comm.hub.subscribe('opsDashboard.widget.add', function(tag, data){
                self.addWidget(data.definition);
            })

        },


        addWidget:function(definition){

            this.dashboard.sDashboard("addWidget",definition);
        },



        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));

            // add the list of Widgets to the Page:
            new AD.controllers.opstools.Dashboard.WidgetList( this.element.find('.opsDashboard-widgets'));

            this.dashboard = this.element.find("#dashboard-col1").sDashboard();

            this.dashboard.bind("sdashboardstatechanged", function(e,data) {   

                // when this is a widgetRemoved event, notify our WidgetList that
                // a widget should show back up in the list:
                if (data.triggerAction=="widgetRemoved") {
                    AD.comm.hub.publish('opsDashboard.widget.removed', data.affectedWidget); 
                }  

            });

            var allEvents = $.data(this.dashboard, 'events');
            console.log('allEvents:');
            console.log(allEvents);


        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },


    });


});