// Dependencies
steal(
    "opstools/Dashboard/controllers/ADDBWidgetGmaGraph.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_ADDBWidgetGmaGraph';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.Dashboard.ADDBWidgetGmaGraph ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.Dashboard.ADDBWidgetGmaGraph($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.Dashboard , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.Dashboard.ADDBWidgetGmaGraph, ' :=> should have been defined ');
        });


    });


});