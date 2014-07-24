
steal(
        // List your Controller's dependencies here:
        'appdev',
        '/opstools/Dashboard/controllers/ADDBWidget.js',
//        'opstools/Dashboard/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        'opstools/Dashboard/views/ADDBWidgetTableNSCUpdate/ADDBWidgetTableNSCUpdate.ejs',
function(){

    // Namespacing conventions:
    // AD.controllers.[application].[controller]
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};
    if (typeof AD.controllers.opstools.Dashboard == 'undefined') AD.controllers.opstools.Dashboard = {};
    AD.controllers.opstools.Dashboard.ADDBWidgetTableNSCUpdate = AD.controllers.opstools.Dashboard.ADDBWidget.extend({


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    mode:'notPaid',
                    templateTable: '//opstools/Dashboard/views/ADDBWidgetTableNSCUpdate/Table.ejs',
            }, options);
            this.options = options;

            // Call parent init
            AD.controllers.opstools.Dashboard.ADDBWidget.prototype.init.apply(this, [element, options]);


            this.dataSource = this.options.dataSource; // AD.models.Projects;

//            this.initDOM();


        },



        refreshData:function() {
            var self = this;
            var dfd = AD.sal.Deferred();

/*
{
    widgetId : "id123",
    widgetTitle: "Widget Title",
    widgetType : "table",
    widgetContent : {
        "aaData" : [[0,2],[2,4],[4,6],[6,8]],
        "aoColumns" : [{
                "sTitle" : "Col A"
            },{
                "sTitle: : "Col B"
            }
        ]
    }
}

*/
            // prepare the column information:
            var fields = this.options.config.fields;
            this.options.config.fields = this.options.config.fields || ['no', 'fields', 'given'];
            var columns = [];
            this.options.config.fields.forEach(function(field){
                columns.push({ 'sTitle': field })
            });


            var data = [];

            AD.comm.socket.get({ url:this.options.config.url})
            .fail(function(err){
console.log('Whoops!');
console.log(err);
            })
            .then(function(response){

                var builderLoc = $('.opsDashboard-widget-list-builder');
                builderLoc.append(can.view(self.options.templateTable, {id:self.options.id, fields:fields, data:response, mode:self.options.mode } ))
            
                var theTable = builderLoc.find('.widget-'+self.options.id);


                // assign DataTable to our table:
                var tableInstance = theTable.DataTable({id:'skippy-'+self.options.id});

                theTable.find('button').click(function(atr1, atr2, atr3) {
                    var staffNumber = $(this).attr('data-staff-number');

                    var urlPaid = self.options.config.url_paid+'/'+staffNumber;


                    AD.comm.socket.get({ url:urlPaid })
                    .fail(function(err){
                        console.log(err);

                    })
                    .then(function(data){


                    })



                })



                io.socket.on('nscalreadypaid', function(msg){


                    if (msg.verb == 'created') {

                        if (self.options.mode == 'notPaid') {

                            tableInstance.row('[data-row-staff-number="'+msg.data.staff_account+'"]')
                            .remove()
                            .draw();

                        } else {
console.log( 'socket msg:');
console.log(msg);
                            AD.comm.service.get({
                                url:'/opsdashboard/nscstaffinfo',
                                params:{ accounts:msg.data.staff_account }
                            })
                            .fail(function(err){
                                console.log('Error requesting nscstaffinfo:');
                                console.error(err); 
                            })
                            .then(function(allStaff){

                                tableInstance.row.add( [
                                    allStaff[0].staff_number,
                                    allStaff[0].account_name
                                ] ).draw();
                            })
                            

                        }


                    }



                })

                var dataTableWrapper = theTable.parent();

                dfd.resolve({ 
                    widgetTitle : self.options.title, //Title of the widget
                    widgetId: self.options.id, //unique id for the widget
//                        widgetType:'table',
                    widgetContent: dataTableWrapper // theTable
                });
/*

                if (response.length) {

                    response.forEach(function(row){

                        var rowData = [];

                        fields.forEach(function( field){

                            if( row[field] ) {
                                rowData.push(row[field]);
                            }

                        });

                        data.push(rowData);


                    })


                    dfd.resolve({ 
                        widgetTitle : self.options.title, //Title of the widget
                        widgetId: self.options.id, //unique id for the widget
//                        widgetType:'table',
                        widgetContent: self.element.find('.widget-'+self.options.id)
                    });

                }

*/
            });





            return dfd;


        },


/*
        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));

        },
*/


        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        },


    });


});