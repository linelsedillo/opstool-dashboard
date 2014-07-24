// Dependencies
steal(
    "opstools/Dashboard/controllers/ADDBWidgetTable.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_ADDBWidgetTable';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.Dashboard.ADDBWidgetTable ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.Dashboard.ADDBWidgetTable($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.Dashboard , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.Dashboard.ADDBWidgetTable, ' :=> should have been defined ');
        });


    });


});