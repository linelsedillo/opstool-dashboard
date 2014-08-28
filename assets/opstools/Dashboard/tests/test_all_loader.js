    // Dependencies
    steal(
        "../../appdev/appdev.js"
    )

    // Initialization
    .then(function(){

        mocha.setup({
            ui: 'bdd',
            timeout: 9000,
            reporter: 'html'
        });
        expect = chai.expect;
        assert = chai.assert;

    })
    .then(
        // load our tests here
        "opstools/Dashboard/tests/controller_ADDBWidgetGmaGraph.js",
        "opstools/Dashboard/tests/controller_ADDBWidgetTable.js",
        "opstools/Dashboard/test/controller_ADDBWidget.js",
        "opstools/Dashboard/test/controller_WidgetList.js"
    )
    .then(function() {
        // Execute the tests
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    })