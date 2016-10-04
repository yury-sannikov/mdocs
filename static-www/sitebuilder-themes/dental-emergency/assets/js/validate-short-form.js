$().ready(function() {
	// Submit form	   
	$.validator.setDefaults({
		submitHandler: function() {
			console.log($("#cname").val());
			$.ajax({
				type: "POST",
				url: "/php/contact-form-sidebar.php",
				data: "fullname=" + $("#cname").val() + "&email=" + $("#cemail").val() + "&message=" + $("#message").val(), 
				success: function(html){
					$('#contact-form-short').empty().html(html);						
				}
			});	 
		}
	});	 
	// Validate signup form on keyup and submit
	$("#ContactFormSidebar").validate({
		rules: {
			fullname: "required",
			email: {
				required: true,
				email: true
			},
			message: "required"
		},
		messages: {
			fullname: "Please enter your name",
			email: "Please enter a valid email address",
			message: "Please enter a short message"
		}		
	});
});