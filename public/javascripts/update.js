$(document).ready( function() {
    var states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];    
    for(var i = 0; i < states.length; i++){
        var value = "<option>" + states[i] +" </option>" 
        $("[name = state]").append(value);
    }
    
    populateFields();
});

function populateFields(){

    $("input[name = prefix]").filter( function(){
        return ($(this).val() == contact.prefix); 
    }).prop('checked', true);
    $("input[name = first]").val(contact.first);
    $("input[name = last]").val(contact.last);
    $("input[name = street]").val(contact.street);
    $("input[name = city]").val(contact.city);
    $("[name = state]").val(contact.state).change();
    $("input[name = zip]").val(contact.zip);
    $("input[name = phone]").val(contact.phone);
    $("input[name = email]").val(contact.email);
    if(contact.contactphone == "No"){
        $("input[name = contactphone]").prop('checked', false);
    }

    if(contact.contactmail == "No"){
        $("input[name = contactmail]").prop('checked', false);
    }

    if(contact.contactemail == "None"){
        $("input[name = contactemail]").prop('checked', false);
    }

    
}