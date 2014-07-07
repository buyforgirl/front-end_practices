/*
  created 07/05/14
  Xiaoli 
  code school jQuery - AJAX
*/

/*** Ajax level 1 Basic ***/
//Ajax - Asynchronous JavaScript And XML

//first ajax call
    $(".confirmation").on("click","button",function(){

        //$.ajax(url[, setings])
            //relative URL
        $.ajax("confirmation.html",{
            //runs only when server returns a successful response
            success: function(response) {
                $(".ticket").html(response).slideDown();
            }

        });

        //same as $.get(url, success)
        $.get("confirmation.html", function(response) {
            $(".ticket").html(response).slideDown();
        });

    });

//sending parameters with requests
	$.ajax("confirmation.html?confNum=1234",{
		//runs only when server returns a successful response
		success: function(response) {
			$(".ticket").html(response).slideDown();
		}

	});
	//equivalent to 
	$.ajax("confirmation.html?",{
		success: function(response) {
			$(".ticket").html(response).slideDown();
		},
		data: {"confNum" : 1234} //JS object

	});

//often the data in the request is dynamic
	//stored in html
	//<div class="ticket" data-confNum="1234">
	//in ajax
	$.ajax("confirmation.html?",{
		success: function(response) {
			$(".ticket").html(response).slideDown();
		},
		data: {"confNum" : $(".ticket").data("confNum")} //JS object

	});

//Ajax options
$(".confirmation").on("click","button",function(){

    $.ajax("confirmation.html",{

        success: function(response) {
            $(".ticket").html(response).slideDown();
        },

        //timeout, abort, or server error
        error: function(request, errorType, errorMessage) {
            console.log("Error:" + errorType + " with message: " + errorMessage);
        },
        timeout: 3000
    });

});

//event delegation - delegate ".view-boading-pass", let it be heard anytime
$(".confirmation").on("click", ".view-boarding-pass", function(){
    $(this).closest(".ticket").find("img").attr("src", "img/ticket.jpg");
});

/*** Ajax level 2 JS ***/
//JS objects
    //in application.js file, the doc ready is too big, use js to organize the code
//js object
var confirmation = {
    init: function(){
        //event handlers
        $(".confirmation").on("click","button", this.loadConfirmation);
        $(".confirmation").on("click", ".view-boarding-pass", this.showBoardingPass());
    },

    //wrap method in event handlers
    loadConfirmation: function(){
        $.ajax("confirmation.html",{ });
    },
    showBoardingPass: function(){
    }
};

$(document).ready(function(){
    confirmation.init();
});

//objects limited to 1 confirmation at a time
//JS function - capitalized
    function Vacation(destination){
       //init vacation to destination
    }

    $(document).ready(function(){
        //can have multiple vacations
        var paris = new Vacation("Paris");
        var london = new Vacation("London");
    });

//refactoring confirmation
    function Confirmation(el){
        this.el = el;

        //target to ticket that was clicked
        this.ticket = this.el.find(".ticket");

        //helper method
        this.loadConfirmation = function () {
            $.ajax("confirmation.html",{
                success: function(response) {
                    //remove hard-code ".ticket"
                    //$(".ticket").html(response).slideDown();
                    this.ticket.html(response).slideDown();
                }
            });
        }
        this.showBoardingPass = function () {}

        //event handler method
        this.el.on("click","button", this.loadConfirmation);
        this.el.on("click",".view-boarding-pass", this.showBoardingPass);
    }

    $(document).ready(function () {
        //create a new confirmation for each ticket
        var paris = new Confirmation($("#paris"));
        var london = new Confirmation($("#london"));
    })
// not working- jqyery change the value of "this"
    var confirmation = this;
    $.ajax("confirmation.html",{
        context:confirmation,
        success: function(response) {
            //this is not same in ajax, is ajax settings
            this.el.find(".ticket").html(response).slideDown();
        }
    });


/*** Ajax level 3 Forms ***/
//Forms
    $("form").on("submit", function (event) {
        //prevent browser from submitting
        event.preventDefault();
        $.ajax("/book", {
            type: "POST",
            //passing attributes from html
            data: {"destination": $("#destination").val(), "quantity": $("#quantity").val()}
            //better way: serialize() - merge all form fields for submission
            data: $("form").serialize(),
            success: function(result){
                console.log(result);
                $("form").remove();
                $("#vacation").hide().html(result).fadeIn();
            }
        });
    });
    //improve form attribute
    $("form").on("submit", function (event) {
        event.preventDefault();
        var form = $(this);
        $.ajax("/book", {
            type: "POST",
            data: form.serialize(),
            success: function(result){
                form.remove();
                $("#vacation").hide().html(result).fadeIn();
            }
        });
    });

//JSON - JS object notation
    $("form").on("submit", function (event) {
        event.preventDefault();
        var form = $(this);
        //$.ajax("/book", {
        //same with the form action in html - DRY
        $.ajax($("form").attr("action"),{
            type: "POST",
            data: form.serialize(),
            dataType:"json", //parse the results as JSON
            success: function(result){
                form.remove();

                var msg= $("<p></p>");
                msg.append("Destination" + result.location + ". ")
                    .append("Days" + result.quantity + ". ");

                $("#vacation").hide().html(msg).fadeIn();
            },
            contentType: "application/json" //ask the server to respond with JSON

        });
    });

/*** Ajax level 4 Utility methods ***/

//.each(collection, function(<index>, <object>){});
    success: function(result){
        $.each(result, function(index, city){
            var favorite = $('.favorite-'+ index); //<div class='favorite-0'>
            favorite.find('p').html(city.name);
            favorite.find('img').attr('src',city.image);
        });
    }

//$.map(collection, function(<item>, <index>){});
//map returns an array modified by what is returned in the function passed as an argument
    $.getJSON('/status', function (result) {
        //store what returned from map
        var statusElement = $.map(result, function(status, i){
            var listItem= $('<li></li>');
            $('<h3>'+status.name+'</h3>').appendTo(listItem);
            $('<p>'+status.status+'</p>').appendTo(listItem);
            return listItem;
        });
        $('.status-list').html(statusElement);
    });

//.detach() removes an element from the DOM, preserving all data and events.
    //useful to minimize DOM insertions with multiple html elements
    $('.status-list').detach()     //removes the list from DOM
                     .html(statusElement)   //modified and reinserted into the status elements
                     .appendTo('.status');