function go_home(){
    $.get("/home", function(data, status){});
}

function go_mailer(){
    $.get("/mailer", function(data, status){});
}

function go_contacts(){
    $.get("/contacts", function(data, status){});
}