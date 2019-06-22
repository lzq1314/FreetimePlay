// -------------------------------
// Demos
// -------------------------------

$(document).ready(
	function() {


    //Create an expression that excludes execution if parent matches certain class
    jQuery.expr[':'].noparents = function(a,i,m){
    	return jQuery(a).parents(m[3]).length < 1;
    };

    //Exclude tab-right and tab-left from having tabdrop option,
    //But include in all others.
   $('.nav-tabs').filter(':noparents(.tab-right, .tab-left)').tabdrop();

	prettyPrint(); //Apply Code Prettifier

	$('.popovers').popover({container: 'body', trigger: 'hover', placement: 'top'}); //bootstrap's popover
	$('.tooltips').tooltip(); //bootstrap's tooltip
	$(".bootstrap-switch").bootstrapSwitch();

	// Custom Checkboxes
	$('.icheck input').iCheck({
		checkboxClass: 'icheckbox_minimal-blue',
		radioClass: 'iradio_minimal-blue'
	});


    $('ul.scrollthis').slimscroll({height: '280px'}); // Add slimscroll to topnav messeges and notifications

    
	//Demo Background Pattern

	$(".demo-blocks").click(function(){
		$('.layout-boxed').css('background',$(this).css('background'));
		return false;
	});


/* 
* Test Locations
* Austin lat/long: 30.2676,-97.74298
* Austin WOEID: 2357536
*/
$(document).ready(function() {
  
});

});

