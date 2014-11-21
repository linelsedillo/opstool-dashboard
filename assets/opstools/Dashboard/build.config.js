module.exports={
    // map: {
    // },
    // paths: {
    // },
    shim : {
        //// Don't include our labels in our production.js
        'site/labels/opstool-Dashboard.js' : { packaged:false, ignore:true },

        //// or these external libraries:
        'js/datatables/media/js/jquery.dataTables.min.js' : {packaged:false },
        'js/sDashboard/sDashboard.css': {packaged:false },
        'js/Flotr2/flotr2.min.js' : {packaged:false },
        'js/sDashboard/jquery-sDashboard.js' : {packaged:false }
    }
    // ext: {
    //     js: "js",
    //     css: "css",
    //     less: "steal/less/less.js",
    //     coffee: "steal/coffee/coffee.js",
    // }
};
    


