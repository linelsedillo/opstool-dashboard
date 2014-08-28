
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/Dashboard/controllers/ADDBWidget.js',
//        'opstools/Dashboard/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        'opstools/Dashboard/views/ADDBWidgetGmaGraph/ADDBWidgetGmaGraph.ejs',
function(){

    // Namespacing conventions:
    // AD.controllers.[application].[controller]
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};
    if (typeof AD.controllers.opstools.Dashboard == 'undefined') AD.controllers.opstools.Dashboard = {};
    AD.controllers.opstools.Dashboard.ADDBWidgetGmaGraph = AD.controllers.opstools.Dashboard.ADDBWidget.extend({


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/Dashboard/views/ADDBWidgetGmaGraph/ADDBWidgetGmaGraph.ejs',
                    templateMeasurementItem: '//opstools/Dashboard/views/ADDBWidgetGmaGraph/measurement-item.ejs'
            }, options);
            this.options = options;

            // Call parent init
            AD.controllers.opstools.Dashboard.ADDBWidget.prototype.init.apply(this, arguments);


            this.dataSource = this.options.dataSource; // AD.models.Projects;



        },

        refreshData:function(){
            var self = this;
            var dfd = AD.sal.Deferred();
            
            // request our Assignment data
            AD.comm.service.get({ url:this.options.config.urlAssignments})
            .fail(function(err){
              
            })
            .then(function(assignments) {
              
            
                // build our HTML Structure
                var builderLoc = $('.opsDashboard-widget-list-builder');
                
                builderLoc.append(can.view(self.options.templateDOM, {id:self.options.id, assignments:assignments } ));
                
                var myStuff = builderLoc.find('.gmaGraph-'+self.options.id);
                myStuff.find('.assignment-item').click( function(ev) {
                  self.assignmentClicked(ev,$(this));
                });
                // find the lists & graph area, busy icon

                // tell sDashboard about the widget content
              
                dfd.resolve({ 
                    widgetTitle : self.options.title, //Title of the widget
                    widgetId: self.options.id, //unique id for the widget
                    widgetContent: myStuff
                });
            });
          
          

            

//            dfd.resolve({ 
//                            widgetTitle : this.options.title, //Title of the widget
//                            widgetId: this.options.id, //unique id for the widget
//                            widgetContent: "Some Random Content" //content for the widget
//                        });

            return dfd;
        },

        assignmentClicked:function(ev, $el) {
          console.log($el);
          var nodeId=$el.attr('nodeId');
          console.log(nodeId);
          var self = this;
          
          AD.comm.service.get({ url:this.options.config.urlMeasurements})
          .fail(function(err){
            console.log('Failed in getting urlMeasurements');
            console.log(err);
          })
          .then(function(measurements) {
            var measurementsList = self.element.find('.measurements-list');
            measurementsList.find('li').remove();
            measurements.forEach(function(measurement) {
              measurementsList.append(can.view(self.options.templateMeasurementItem, {measurement:measurement } ));
              
            });
          });
          // retrieve the measurements for this nodeId
          // build it into the 'measurements' button list
          
        },


        '.assignment-item click': function ($el, ev) {
            console.log("li clicked");
          
            ev.preventDefault();
        },


    });


});