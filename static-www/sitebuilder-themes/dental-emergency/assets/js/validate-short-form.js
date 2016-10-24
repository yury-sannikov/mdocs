$().ready(function() {
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
