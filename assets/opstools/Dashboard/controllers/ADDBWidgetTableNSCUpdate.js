
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

            // make this call using socket.get() so server can register our 
            // socket for callbacks.
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
                    var guid = $(this).attr('data-staff-guid');
                    var account = $(this).attr('data-staff-account');
                    var name = $(this).attr('data-staff-name');

                    var urlPaid = self.options.config.url_paid+'/'+guid;


                    AD.comm.socket.get({ url:urlPaid, params:{ account:account, name:name }})
                    .fail(function(err){
                        console.log(err);

                    })
                    .then(function(data){


                    })



                })



                AD.comm.socket.subscribe('NSCAlreadyPaid.created', function(key, msg) {


                    if (self.options.mode == 'notPaid') {

                        tableInstance.row('[data-row-staff-guid="'+msg.data.ren_guid+'"]')
                        .remove()
                        .draw();

                    } else {

                        tableInstance.row.add( [
                            msg.data.staff_account,
                            msg.data.account_name
                        ] ).draw();

                    }

                })



                var dataTableWrapper = theTable.parent();

                dfd.resolve({ 
                    widgetTitle : self.options.title, //Title of the widget
                    widgetId: self.options.id, //unique id for the widget
//                        widgetType:'table',
                    widgetContent: dataTableWrapper // theTable
                });

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