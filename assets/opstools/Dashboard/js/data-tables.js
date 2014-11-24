
//Data for Staff Info Widgets
var dataSet = [
	['Trident','Internet Explorer 4.0'],
	['Trident','Internet Explorer 5.0'],
	['Trident','Internet Explorer 5.5'],
	['Trident','Internet Explorer 6'],
	['Trident','Internet Explorer 7'],
	['Trident','AOL browser (AOL desktop)'],
	['Gecko','Firefox 1.0'],
	['Gecko','Firefox 1.5'],
	['Gecko','Firefox 2.0'],
	['Gecko','Firefox 3.0'],
	['Gecko','Camino 1.0'],
	['Gecko','Camino 1.5'],
	['Gecko','Netscape 7.2'],
	['Gecko','Netscape Browser 8'],
	['Gecko','Netscape Navigator 9'],
	['Gecko','Mozilla 1.0'],
	['Gecko','Mozilla 1.1'],
	['Gecko','Mozilla 1.2'],
	['Gecko','Mozilla 1.3'],
	['Gecko','Mozilla 1.4'],
	['Gecko','Mozilla 1.5'],
	['Gecko','Mozilla 1.6'],
	['Gecko','Mozilla 1.7'],
	['Gecko','Mozilla 1.8'],
	['Gecko','Seamonkey 1.1'],
	['Gecko','Epiphany 2.20'],
	['Webkit','Safari 1.2'],
	['Webkit','Safari 1.3'],
	['Webkit','Safari 2.0'],
	['Webkit','Safari 3.0'],
	['Webkit','OmniWeb 5.5'],
	['Webkit','iPod Touch / iPhone'],
	['Webkit','S60'],
	['Presto','Opera 7.0'],
	['Presto','Opera 7.5'],
	['Presto','Opera 8.0'],
	['Presto','Opera 8.5'],
	['Presto','Opera 9.0'],
	['Presto','Opera 9.2'],
	['Presto','Opera 9.5'],
	['Presto','Opera for Wii'],
	['Presto','Nokia N800'],
	['Presto','Nintendo DS browser'],
	['KHTML','Konqureror 3.1'],
	['KHTML','Konqureror 3.3'],
	['KHTML','Konqureror 3.5'],
	['Tasman','Internet Explorer 4.5'],
	['Tasman','Internet Explorer 5.1'],
	['Tasman','Internet Explorer 5.2'],
	['Misc','NetFront 3.1'],
	['Misc','NetFront 3.4'],
	['Misc','Dillo 0.8'],
	['Misc','Links'],
	['Misc','Lynx'],
	['Misc','IE Mobile'],
	['Misc','PSP browser'],
	['Other browsers','All others']
];	
//END: Data for Staff Info Widgets

//Data for Account Analysis
var AccAnalysis = [
	['Trident','Internet','Win 95+','4','X','3','10.2','lorem'],
];	
//END: Data for Account Analysis

//Staf list
var stafflist = [
	['Suzie Billips'],
	['Sherri Tworek'],
	['Larue Gaspard'],
	['Debroah Nestle'],
	['Lillian Langston'],
	['Delphine Keach'],
	['Mirta Laver'],
	['Drucilla Venema'],
	['Danielle Park'],
	['Randall Fox'],
	['Randal Jacobs'],
	['Colleen Dunn'],
	['Gary Mills'],
	['Agnes Bishop'],
	['Gecko','Netscape Navigator 9'],
	['Derrick Washington'],
	['Ebony Ford'],
	['Lester Ferguson'],
	['Benny Rice'],
	['Lynette Conner'],
	['Stephen Mccormick'],
	['Bobby Allison'],
	['Kristy Lambert'],
	['Kelli Stewart'],
	['Ramiro Powell'],
	['Gerard Francis'],
	['Ignacio Romero'],
	['Albert Hardy'],
	['Chad Guzman'],
	['Jake Cain'],
	['Katrina Moore'],
	['Florence Gray'],
	['Derek Alvarado'],
	['Shari Hart'],
	['Sylvia Pope'],
	['Yolanda Simon'],
	['Jason Terry'],
	['Brandi Wells'],
	['Lucy Mathis'],
	['Tommie Keller'],
	['Estelle Neal'],
	['Stephanie Cunningham'],
	['Eric Matthews'],
	['Thelma Swanson'],
	['Pam Vaughn'],
	['Jody Black'],
	['Domingo Garner'],
	['Noel Montgomery'],
	['Roy Cohen'],
	['Rudolph Marshall'],
	['Sandra Poole'],
	['Gerardo George'],
	['Johnathan Banks'],
	['Troy Buchanan'],
	['Juanita Soto'],
	['Daniel Patrick'],
	['Lambert Mills']
];	
//END: Staf list
	
$(document).ready(function() {
	
	//tables for Staff Info Widgets		
			$('#demo').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
		
			$('#example').dataTable( {
				"scrollY":        "185px",
				"scrollCollapse": true,
				"paging":         false,
				"filter":			false,
				"data": dataSet,
				"columns": [
					{ "title": "Engine" },
					{ "title": "Browser" },
				]
			} );
	//END: tables for Staff Info Widgets
	
	//tablesfor Account Analysis	
			$('#acc').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="acc-anaylsis"></table>' );
		
			$('#acc-anaylsis').dataTable( {
				"scrollY":        "50px",
				"scrollCollapse": true,
				"paging":         false,
				"filter":			false,
				"data": AccAnalysis,
				"columns": [
					{ "title": "Engine" },
					{ "title": "Browser" },
					{ "title": "Platform" },
					{ "title": "Version" },
					{ "title": "Grade" },
					{ "title": "Sample" },
					{ "title": "Data" },
					{ "title": "Account" }
				]
			} );
	//END: tables for Account Analysis
	
	//Staf list	
			$('#stlist').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="stfflist"></table>' );
		
			$('#stfflist').dataTable( {
				"scrollY":        "185px",
				"scrollCollapse": true,
				"paging":         false,
				"filter":			false,
				"data": stafflist,
				"columns": [
					{ "title": "Staff Name" },
				]
			} );
	//END: Staf list						
});
		