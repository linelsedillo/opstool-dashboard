
steal(
        // List your Controller's dependencies here:
        'appdev',
        'appdev/widgets/ad_icon_busy',
        '//opstools/Dashboard/views/ADDBWidget/ADDBWidget.ejs',
function(){

    // Namespacing conventions:
    // AD.controllers.[application].[controller]
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};
    if (typeof AD.controllers.opstools.Dashboard == 'undefined') AD.controllers.opstools.Dashboard = {};
    AD.controllers.opstools.Dashboard.ADDBWidget = AD.classes.UIController.extend({


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/Dashboard/views/ADDBWidget/ADDBWidget.ejs',
                    id:'Widget 1',
                    title:'Widget 1'
            }, options);
            this.options = options;

            // Call parent init
            AD.classes.UIController.apply(this, arguments);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.inProcess = false;

            this.initDOM();

            AD.comm.hub.subscribe('opsDashboard.widget.removed', function(tag,data){
                if (data.widgetId == self.options.id) {
                    self.element.show();
                }
            })

        },



        initDOM: function () {
            var self = this;
//            this.element.html(can.view(this.options.templateDOM, {} ));
            this.busyIcon = new AD.widgets.ad_icon_busy(this.element.find('.busy'));
            this.element.click(function() {

                // prevent double clicks!
                if (self.inProcess == false) {

                    self.inProcess = true;
                    self.busyIcon.show();
                    self.refreshData()
                    .fail(function(err){

                        self.inProcess = false;
                        self.busyIcon.hide();
    // TODO: indicate an error here!  Some exclamation icon?

                    })
                    .then(function(data){

                        AD.comm.hub.publish('opsDashboard.widget.add', {
                            definition:data
                        });
                        self.busyIcon.hide();
                        self.element.hide();
                        self.inProcess = false;

                    })  

                }

            });
        },



        refreshData:function(){
            var dfd = AD.sal.Deferred();

            console.error(' no refreshData method implented!');

            dfd.resolve({ 
                            widgetTitle : this.options.title, //Title of the widget
                            widgetId: this.options.id, //unique id for the widget
                            widgetContent: "Some Random Content" //content for the widget
                        });

            return dfd;
        },



        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});