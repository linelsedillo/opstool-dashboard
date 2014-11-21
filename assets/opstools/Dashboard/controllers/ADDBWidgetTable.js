
steal(
        // List your Controller's dependencies here:
        'appdev',
        'opstools/Dashboard/controllers/ADDBWidget.js',
        '//opstools/Dashboard/views/ADDBWidgetTable/ADDBWidgetTable.ejs',
function(){

    // Namespacing conventions:
    // AD.controllers.[application].[controller]
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};
    if (typeof AD.controllers.opstools.Dashboard == 'undefined') AD.controllers.opstools.Dashboard = {};
    AD.controllers.opstools.Dashboard.ADDBWidgetTable = AD.controllers.opstools.Dashboard.ADDBWidget.extend({


        init: function (element, options) {
            var self = this;
            options = AD.defaults({
                    templateDOM: '//opstools/Dashboard/views/ADDBWidgetTable/ADDBWidgetTable.ejs'
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

            AD.comm.service.get({ url:this.options.config.url})
            .fail(function(err){
console.log('Whoops!');
console.log(err);
            })
            .then(function(response){

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
                        widgetType:'table',
                        widgetContent: {
                            'aaData': data,
                            'aoColumns': columns
                        }
                    });

                }


            })





            return dfd;


        },


/*
        initDOM: function () {

            this.element.html(can.view(this.options.templateDOM, {} ));

        },
*/


        '.ad-item-add click': function ($el, ev) {

            ev.preventDefault();
        }


    });


});