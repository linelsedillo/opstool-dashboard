// Dependencies
steal(
    "opstools/Dashboard/controllers/ADDBWidget.js"
)

// Initialization
.then(function(){

    // the div to attach the controller to
    var divID = 'test_ADDBWidget';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.Dashboard.ADDBWidget ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.Dashboard.ADDBWidget($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.Dashboard , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.Dashboard.ADDBWidget, ' :=> should have been defined ');
        });


    });


});