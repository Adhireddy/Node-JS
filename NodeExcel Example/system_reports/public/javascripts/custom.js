	$.fn.extend({
				treed: function (o) {
				  
				  var openedClass = 'glyphicon-minus-sign';
				  var closedClass = 'glyphicon-plus-sign';
				  
				  if (typeof o != 'undefined'){
					if (typeof o.openedClass != 'undefined'){
					openedClass = o.openedClass;
					}
					if (typeof o.closedClass != 'undefined'){
					closedClass = o.closedClass;
					}
				  };
				  
					//initialize each of the top levels
					var tree = $(this);
					tree.addClass("tree");
					tree.find('li').has("ul").each(function () {
						var branch = $(this); //li with children ul
						branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
						branch.addClass('branch');
						branch.on('click', function (e) {
							if (this == e.target) {
								var icon = $(this).children('i:first');
								icon.toggleClass(openedClass + " " + closedClass);
								$(this).children().children().toggle();
							}
						})
						branch.children().children().toggle();
					});
					//fire event from the dynamically added icon
				  tree.find('.branch .indicator').each(function(){
					$(this).on('click', function () {
						$(this).closest('li').click();
					});
				  });
					//fire event to open branch if the li contains an anchor instead of text
					tree.find('.branch>a').each(function () {
						$(this).on('click', function (e) {
							$(this).closest('li').click();
							e.preventDefault();
						});
					});
					//fire event to open branch if the li contains a button instead of text
					tree.find('.branch>button').each(function () {
						$(this).on('click', function (e) {
							$(this).closest('li').click();
							e.preventDefault();
						});
					});
				}
			});

			//Initialization of treeviews
			$(function() {	
				var resdata=$('#resultdata').val();		
                var data = jQuery.parseJSON(resdata.replace(/\n/g,"\\n"));
			    var categories = {},
				groupBy = "category_name",
				ul = $('<ul id="activityPaganation">');

				for (var i = 0; i < data.length; i++) 
				{
					if (!categories[data[i][groupBy]])
						categories[data[i][groupBy]] = [];
					categories[data[i][groupBy]].push(data[i]);
				};

				for (key in categories) 
				{
					if (categories.hasOwnProperty(key)) 
					{
						var li = $('<li style="list-style-type:none;margin-top:10px;padding-right:20px;">').text(key);
						if (categories[key].length)
						{
							var ul_inner = $('<ul>');
							for (var i = 0; i < categories[key].length; i++) 
							{
							
								$('<li>').html('<a href="#" data-page="'+categories[key][i].id+'">'+categories[key][i].menu_name+'</a>').appendTo(ul_inner);
							}
							li.append(ul_inner);
						}
						li.appendTo('#tree1');
					}
				}							
				$('#tree1').treed();
				});
				$(function () {
   $("input[name='dispaly_status[]']").click(function() {

	  var data =this.id;
	  var check_box_id='#'+data;
	  var arr = data.split('_');
	  var textbox_id= '#cpatext_'+arr[1];	
	   if ($(this).is(':checked')==true){
	  var cpation='#field_caption_'+arr[1];
    	var caption_val=$(cpation).val();
   
	   $(textbox_id).val(caption_val);
	   
	}
	else{
	  $(textbox_id).val('');
	}

 });
    $("input[name='search_status[]']").click(function() {

	  var data =this.id;
	  var check_box_id='#'+data;
	  var arr = data.split('_');
	  var textbox_id= '#searchtext_'+arr[2];	
	   if ($(this).is(':checked')==true){
	    var searhcval='1';
	   $(textbox_id).val(searhcval);
	   
	}
	else{
	  $(textbox_id).val('');
	}


 });
});
	$.ajax({
  url: '/',
  complete: function(data) {
  }
});
$(document).ready(function(){
$('#tree1').on("click", "li a", function(e) {
                e.preventDefault();     
            var page = $(this).attr('data-page');
 $('#hidden_menu').val(page)
  $('#excelDataTable tbody').remove();          


    $(this).find('i').toggleClass('glyphicon-list').toggleClass('glyphicon-plus');
	$(this).removeClass('data_list');
	$(this).addClass('add_data');
  listing(page);
 
 });
 $(document).on('click', 'td a.edit', function (e) {
    e.preventDefault();
    var rowid = $(this).attr('value');
   var menu_id=$('#hidden_menu').val();
	$('#searchbox').empty();
	 $('#data_message').empty();
    $(this).find('i').toggleClass('glyphicon-list').toggleClass('glyphicon-plus');
	  $(this).removeClass('add_data');
   	      $(this).addClass('data_list');
		  var dataString = 'menu_id='+ menu_id + '&rowid='+ rowid
	 $.ajax({
		  method: "post",
		  url: "/editdata/",
		  data: dataString,

		  success: function(response){	
		
		   $('#datalist_div').empty();
		   $('#datalist_div').append(response);
		  $('input[name="row_id"]').val(rowid);
		  }
	});
	
	
}); 
$(document).on('click', 'td a.delete', function (e) {
    e.preventDefault();
    var rowid = $(this).attr('value');
   var menu_id=$('#hidden_menu').val();
	$('#searchbox').empty();
	 $('#data_message').empty();
    $(this).find('i').toggleClass('glyphicon-list').toggleClass('glyphicon-plus');
	  $(this).removeClass('add_data');
   	      $(this).addClass('data_list');
		  var dataString = 'menu_id='+ menu_id + '&rowid='+ rowid
		  
	 $.ajax({
		  method: "post",
		  url: "/deletedata/",
		  data: dataString,

		  success: function(response){	

		          listing(menu_id);
		   $('#datalist_div').empty();
		   $('#datalist_div').append(response);
		  $('input[name="row_id"]').val(rowid);
		  }
	});
	
	
}); 
 $(".nav").on("click", "#adduserli", function(event){
    var page = $(this).attr('data-page');
 $('#hidden_menu').val(page);
  $('#excelDataTable tbody').remove();

   $('#userdata').empty();
   $('#user_message').empty(); 
 
   $.ajax({
		  method: "get",
		  url: "/addnewuser",
		  success: function(response){	
		 
				$('#main_div').hide();
				$('#table_data').hide();
				
			    $('#userbox').show();
				$('#userdata').append(response);
	
		   }
    });
  });
 $(".nav").on("click", "#addcatg", function(event){
  $('#excelDataTable tbody').remove();

   $('#categorydata').empty();
   $('#catg_message').empty(); 
 
   $.ajax({
		  method: "get",
		  url: "/addcategory",
		  success: function(response){	
				$('#main_div').hide();
				$('#table_data').hide();
				
			    $('#categorybox').show();
				$('#categorydata').append(response);
	
		   }
    });
  });
});
$("#categorybox").on("click",".addcatg" ,function(){
			
									var name = $("#name").val();
									var dataString = 'name='+ name;
									if(name=='')
										{
										
										 $('#catg_message').html('Please Fill Fields');
										}
										else
										{
										
										$.ajax({
												method: "post",
												url: "/api/insertcategory",
												data: dataString,
												cache: false,
														success: function(result){
														 $("#addcatgform")[0].reset();

														 $('#catg_message').html('Category Added Successfully');
														}
														});
													
										
												}
										return false;
						});
$("#userbox").on("click",".user_submit" ,function(){
					
									var name = $("#name").val();
									var email = $("#email").val();
									var password = $("#password").val();
									var user_role = $("#user_role").val();
									var dataString = 'name='+ name + '&email='+ email + '&password='+ password + '&user_role='+ user_role;
									if(name==''||email==''||password==''||user_role=='')
										{
										
										 $('#user_message').html('Please Fill All Fields');
										}
										else
										{
										if (validateEmail(email)) {
																$.ajax({
															method: "post",
															url: "/api/register",
															data: dataString,
															cache: false,
																	success: function(result){
																	 $("#adduserform")[0].reset();

																	 $('#user_message').html('User Inserted Successfully');
																	}
																	});
													}
													else
													{
														 $('#user_message').html('Wrong Email format');
													}
										
												}
										return false;
						});
 $('.iconchange').on("click",".user_list" ,function(){
    $(this).find('i').toggleClass('glyphicon-plus').toggleClass('glyphicon-list');
	$('a.user_list').removeClass('user_list');
    $(this).addClass('add_user');    
	 $.ajax({
		  method: "get",
		  url: "/list_user",
		  success: function(response){	
		   $('#userdata').empty();
		 $('#userdata').append(response);
		  }
	});
});
 $('.iconchange').on("click",".add_user" ,function(){
    $(this).find('i').toggleClass('glyphicon-plus').toggleClass('glyphicon-list');
	$(this).removeClass('add_user');
	$(this).addClass('user_list');
	 $.ajax({
		  method: "get",
		  url: "/addnewuser",
		  success: function(response){	
		   $('#userdata').empty();
		   $('#userdata').append(response);
		  }
	});
});
 $('.iconchange').on("click",".add_data" ,function(){
    var menu_id=$('#hidden_menu').val();
	$('#searchbox').empty();
	 $('#data_message').empty();
    $(this).find('i').toggleClass('glyphicon-list').toggleClass('glyphicon-plus');
	  $(this).removeClass('add_data');
   	      $(this).addClass('data_list');
	 $.ajax({
		  method: "get",
		  url: "/addnewdata/"+menu_id,

		  success: function(response){	
		
		   $('#datalist_div').empty();
		   $('#datalist_div').append(response);
		      
		  }
	});
});

 $('.iconchange').on("click",".data_list" ,function(){
 data_listing();
});

function data_listing()
{
  var page=$('#hidden_menu').val();
  $('#searchbox').empty();
   $('#datalist_div').empty();
   $('#data_message').empty();
   
   $(this).find('i').toggleClass('glyphicon-list').toggleClass('glyphicon-plus');
	$(this).removeClass('data_list');
	$(this).addClass('add_data');
	listing(page);

}
function addAllColumnHeaders(myList, selector) {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  for (var i = 0; i < myList.length; i++) {
    var rowHash = myList[i];

    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
		
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);
   headerTr$.append($('<th/>').html('Edit'));
    headerTr$.append($('<th/>').html('Delete'));
  return columnSet;
}
$("#table_data").on("click",".data_submit" ,function(){
					             var datarr = [];
								 var fieldarr = [];
								  $('input[name="fielddata[]"]').each(function(){
										datarr.push($(this).val());
									});
								
								    $('input[name="field_name[]"]').each(function(){
										  fieldarr.push($(this).val());
										});

		
									var table_name =   $('input[name="table_name"]').val();
									var table_id =   $('input[name="table_id"]').val();
									var dataString ='datarr='+ datarr + '&tablename='+ table_name + '&fieldarr='+ fieldarr;
									$.ajax({
												method: "post",
												url: "/inserttabledata",
												data:dataString,
												cache: false,
														success: function(result){
														      $("#adddataform")[0].reset();
															  $('#data_message').html('Data Inserted Successfully');
														}
														});
												
										return false;

									
						});
$("#table_data").on("click",".data_edit" ,function(){
					             var datarr = [];
								 var fieldarr = [];
								  $('input[name="fielddata[]"]').each(function(){
										datarr.push($(this).val());
									});
								
								    $('input[name="field_name[]"]').each(function(){
										  fieldarr.push($(this).val());
										});

		
									var table_name =   $('input[name="table_name"]').val();
									var table_id =   $('input[name="table_id"]').val();
									var row_id =   $('input[name="row_id"]').val();
									var dataString ='datarr='+ datarr + '&tablename='+ table_name + '&fieldarr='+ fieldarr + '&rowid='+ row_id;
									$.ajax({
												method: "post",
												url: "/edittabledata",
												data:dataString,
												cache: false,
														success: function(result){
																	 data_listing();			
														    alert('Updated');
														}
														});
												
										return false;

									
						});
$("#searchbox").on("click",".search_submit" ,function(){
				                var search_val_array = [];
								 var search_field_array = [];
								  $('input[name="search_value[]"]').each(function(){
										search_val_array.push($(this).val());
									});
								
								    $('input[name="search_field[]"]').each(function(){
										  search_field_array.push($(this).val());
										});

									var table_name = $("#search_table_name").val();
									var table_id = $("#search_table_id").val();
									var dataString ='datarr='+ search_val_array + '&tablename='+ table_name + '&fieldarr='+ search_field_array;
								    $.ajax({
												method: "post",
												url: "/searchdata",
												data:dataString,
												cache: false,
														success: function(result){
														 if (result == '[]') {
														 $('#datalist_div').empty();
														   $('#datalist_div').html('<div class="message_div"><h4>No data available</h4></div>');
																
															}
															else
															{

															 $('#datalist_div').empty();
															
														      tableresponse(result);
															}
														}
														});
									
								
												
										return false;
									
						});
						
						 
function listing(page)
{

$('#searchbox').empty();
$('#datalist_div').empty();
 $('#data_message').empty();
$.ajax({
  method: "get",
  url: "/api/"+page,
  success: function(response){
		if(response==1)
		{
			$('#main_div').hide();
			$('#adduser').hide();
			$('#userbox').hide();
			$('#table_data').show();
		    $('#datalist_div').append('<h4>No data Available</h4>')
		}
		else
		{
			tableresponse(response);
			 $.ajax({
			  method: "get",
			  url: "/searchbox/"+page,
			  success: function(response){
			  $('#searchbox').append(response);
				 }
			  });
	 }
  }
  
 });
}
function tableresponse(response)
{
   var selector='#datalist_div';
  
  $(selector).append('<table class="table table-striped table-bordered "  id="data"><thead id="table_head">' );
var myList = JSON.parse(response);
 var columns = addAllColumnHeaders(myList, '#table_head');

 $('#hidden_number').val(columns.length); 
  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr/>');
	 
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
	  
      row$.append($('<td/>').html(cellValue));
	 
    }
	 
	row$.append($('<td/>').html('<a href="#" value="'+myList[i][columns[0]]+'" class="edit" ><i class="glyphicon glyphicon-pencil"></i></a>'));
	row$.append($('<td/>').html('<span class="delete"><a value="'+myList[i][columns[0]]+'"  class="delete" href="#"><i class="glyphicon glyphicon-trash"></i></a></span>'));
	$('#main_div').hide();
	$('#adduser').hide();
	$('#userbox').hide();
	$('#table_data').show();

  $(selector).append( '</table>' );
   $('#data').append(row$);
 
     }
	   $('#data').after('<div id="nav"></div>');
    var rowsShown = 25;
    var rowsTotal = $('#data tbody tr').length;
    var numPages = rowsTotal/rowsShown;
    for(i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $('#nav').append('<div class="pagination"><a href="#" rel="'+i+'">'+pageNum+'</a></div> ');
    }
    $('#data tbody tr').hide();
    $('#data tbody tr').slice(0, rowsShown).show();
    $('#nav a:first').addClass('active');
    $('#nav a').bind('click', function(){

        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#data tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
        css('display','table-row').animate({opacity:1}, 300);
    });
	
}
function validateEmail(sEmail) {
var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
if (filter.test(sEmail)) {
return true;
}
else {
return false;
}
}
$("#data_submit").on("click",".ex_data_submit" ,function(){

	var table_name = $("#table_name").val();
	var menu_name = $("#menu_name").val();
	var dataString ='&tablename='+ table_name+ '&menu_name='+ menu_name;
	$.ajax({
			method: "post",
			url: "/check/data_exist",
			data: dataString,
			cache: false,
					success: function(result){
						if(result== '1' )
						{
							 $('#exist_message').html('Table Name or Menu Name Exist');
						}
						else
						{
							
							 $( "#dataupload" ).submit();
						}
					
					}
			});
});