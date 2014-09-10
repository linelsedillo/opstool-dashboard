
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

            this.widget = null;  // the displayed widget in sDashboard.
            this.buttonMeasurements = null;
            this.measurementsBusy = null;

        },

        refreshData:function(){
            var self = this;
            var dfd = AD.sal.Deferred();
            
            // request our Assignment data
            AD.comm.service.get({ url:this.options.config.urlAssignments})
            .fail(function(err){
                console.log(err);
                dfd.reject(err);
            })
            .then(function(assignments) {
              
            
                // build our HTML Structure for the widget
                var builderLoc = $('.opsDashboard-widget-list-builder');
                
                builderLoc.append(can.view(self.options.templateDOM, {id:self.options.id, assignments:assignments } ));
                
                // find the lists & graph area, busy icon
                self.widget = builderLoc.find('.gmaGraph-'+self.options.id);
                self.widget.find('.assignment-item').click( function(ev) {
                  self.assignmentClicked(ev,$(this));
                });

                self.buttonMeasurements = self.widget.find('.button-measurements');
                self.buttonMeasurements.hide();

                self.measurementsBusy = new AD.widgets.ad_icon_busy(self.widget.find('.measurements-busy'));

                
                

                // tell sDashboard about the widget content
                dfd.resolve({ 
                    widgetTitle : self.options.title, //Title of the widget
                    widgetId: self.options.id, //unique id for the widget
                    widgetContent: self.widget
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
          
          var url = this.options.config.urlMeasurements.replace('[nodeId]', nodeId);

          self.buttonMeasurements.hide();
          self.measurementsBusy.show();

          var label = AD.lang.label.getLabel('[gatheringMeasurements]');
          self.widget.find('.opstool-dashboard-measurementname').html(label);

          AD.comm.service.get({ url:url, params:{nodeId:nodeId}})
          .fail(function(err){
            console.log('Failed in getting Measurements for node:'+nodeId+'  url['+url+']');
            console.log(err);
          })
          .then(function(measurements) {
            var measurementsList = self.widget.find('.measurements-list');

            // remove the existing entries
            measurementsList.find('li').remove();

            // add the new ones ...
            measurements.forEach(function(measurement) {
              measurementsList.append(can.view(self.options.templateMeasurementItem, {measurement:measurement } ));
              
            });

            measurementsList.find('li').click(function(ev){

                self.measurementClicked(ev, $(this));
            });


            // update with new text:
            var label = AD.lang.label.getLabel('[choose a measurement ...]');
            self.widget.find('.opstool-dashboard-measurementname').html(label);

            self.buttonMeasurements.show();
            self.measurementsBusy.hide();

          });
          // retrieve the measurements for this nodeId
          // build it into the 'measurements' button list
          
        },



        /*
         *  @function measurementClicked
         *
         *  process the choice of a measuement:
         *      display chosen measurement name above graph
         *      show busy icon while loading report data
         *      Call for report data on measurement id
         *      update chart when data returns:
         *
         */
        measurementClicked:function(ev, $el) {

            // display chosen measurement name above graph
            var measurementName = $el.text();
            var measurementID = $el.attr('measurementId');

            this.widget.find('.opstool-dashboard-measurementname').html('['+measurementID+'] '+ measurementName);
            // show busy icon 
            // call for report data
            // update chart when data returns

        },


        '.assignment-item click': function ($el, ev) {
            console.log("li clicked");
          
            ev.preventDefault();
        },


    });


});