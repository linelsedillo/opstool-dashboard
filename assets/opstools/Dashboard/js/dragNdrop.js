$(document).ready(function() {
	
		//Drag and drop
			$(".gridster ul").gridster({
				widget_base_dimensions: [90, 10],
				widget_margins: [5, 5],
				min_cols: 12,
				avoid_overlapped_widgets: true,
				resize: {
				enabled: false,
			
          }
        }).data('gridster');
		var gridster = $(".gridster ul").gridster().data('gridster');
	
		<!--sets the draggable-->
		$(".sglwidgets").draggable({
			helper:'clone',
			cursor: "move",
			cursorAt: { top: 0, left: 20 },
		
			helper: function( event ) {	
					var c = $(this).children(".title").children().attr("class") ;
					return  "<i class='"+c+"' style='font-size:40px;color:#f1f1f1;background-color:#191c23;padding:5px 5px;display:block'></i>";
				  }
		});
		
			
		<!--sets the droppable-->
		$(".gridster ").droppable({
			accept:".toogle",
			
			drop: function (event, ui) {
				var droppedWidget = $(ui.draggable).clone(true);
				$(ui.draggable).removeClass("toogle");

				//Test if a value of the dropped widget matched or not
				if( $(droppedWidget).find(".big").html()){
					
					boxWidth = 10;
					boxHeight = 15;
				}
				
				else if ( $(droppedWidget).find(".medium").html()){
					
					
					boxWidth = 4;
					boxHeight =	16;
				}

				else if ( $(droppedWidget).find(".large").html()){
					
					boxWidth = 11;
					boxHeight =	22;
				}

				
				else if( $(droppedWidget).find(".small").html()){
					
					boxWidth = 3;
					boxHeight = 16;
				}
				
				else {
					boxWidth = 2;
					boxHeight = 2;
					
				}

				//Add the widget depending on the value

				var widget = gridster.add_widget(droppedWidget, boxWidth,boxHeight);
				
				widget.dblclick(function (widget) {
					$("li").addClass("toogle");
					widget = gridster.remove_widget(this);
					
				});				

			}
		});
		<!--/sets the droppable-->	
		
		<!--FadeIN FadeOut of Pane-->
		var parent = 	
		$(".fa-cog").click(function () {
		   $(this).next('.config').fadeIn('slow');
		});
		
		$(".fa-close").click(function () {
		   $(this).parent('.config').fadeOut('slow');
		});
		<!--/Closing: FadeIN FadeOut of Pane-->

	//D4 BARCHARTS
		var data = [
		  { x : '2010', y : 5 },
		  { x : '2011', y : 15 },
		  { x : '2012', y : 20 }
		];
		
	  
	  var columnChart = d4.charts.column().width(300).height(200);
	  var clone = columnChart.clone();
	  
	  d3.select('#clone')
		.datum(data)
		.call(clone);
	  //END: D4 BARCHARTS CLOSED

	//Charts for Account Analysis
		var accAnalysis = [
		  { y : '2010', x : 5 },
		  { y : '2011', x : 15 },
		  { y : '2012', x : 20 }
		];
		
	  
	  var accAnalysisChart = d4.charts.row().width(880).height(220);
	  var clone = accAnalysisChart.clone();
	  
	  d3.select('#accAnalysisChart')
		.datum(accAnalysis)
		.call(clone);
	  //END: Charts for Account Analysis
	   
});