/*
  created 07/05/14
  Xiaoli 
  code school jQuery - AJAX
*/

/*** Ajax level 1  ***/
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

/*** Ajax level 2 ***/
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

//