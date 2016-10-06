# Widgets

## Book Online widget

### Set up

src/data/practice.json should have widget enabled
```
  "widgets": {
    "bookonline": true
  }
```

In a form page should be a reference to widget code below form
```
  script(type='text/javascript' src='/assets/widgets/bookonline/index.js' data-accountid=practice.mdocsAccount)
```

Appointment form should have the following items

- form with class _js-bookonline-form_
- data-callback attribute with function name to get success/failure callbacks
- input names. name, email, phone are required
  - 'firstname' * or fullname
  - 'lastname' * or fullname
  - 'fullname' * or first / last
  - 'isnew'
  - 'email' *
  - 'phone' *
  - 'zip'
  - 'comment'
  - 'description'
  - 'systype'
  - 'dob'
  - 'visitdate'
- submit element with class _js-bookonline-submit_

Appointment form might have validation

```
$(' # makeappointmentform').validate({
  rules: {
    name: 'required',
    email: {
      required: true,
      email: true
    }
  },
  messages: {
    name: "Please specify patient name",
    email: {
      email: "Patient email address must be in the format of name@domain.com"
    }
  }
});
```
