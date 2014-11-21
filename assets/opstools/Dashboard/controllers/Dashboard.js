
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/Dashboard/controllers/WidgetList.js',

        'js/sDashboard/sDashboard.css',
        'js/datatables/media/js/jquery.dataTables.min.js',
        'js/Flotr2/flotr2.min.js'

)
.then(
        'js/sDashboard/jquery-sDashboard.js',
        'opstools/Dashboard/dashboard.css',
        'OpsPortal/classes/OpsTool.js',

        '//opstools/Dashboard/views/Dashboard/Dashboard.ejs',
        '//opstools/Dashboard/views/Dashboard/Mockup.ejs',
function(){


    AD.Control.OpsTool.extend('Dashboard', {


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/Dashboard/views/Dashboard/Dashboard.ejs',
                    templateMock: '//opstools/Dashboard/views/Dashboard/Mockup.ejs',
                    resize_notification: 'Dashboard.resize',
                    tool:null   // the parent opsPortal Tool() object
            }, options);
            this.options = options;

            // Call parent init
            AD.classes.opsportal.OpsTool.prototype.init.apply(this, arguments);


            this.dataSource = this.options.dataSource; 

            this.initDOM();


            this.element.find('.ot-dashboard-button-mockup').click(function(){
                self.showMockup();
            })

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


        showMockup:function() {
            this.element.html(can.view(this.options.templateMock, {} ));
        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});