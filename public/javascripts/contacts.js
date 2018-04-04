/*function initTable(){
    
    $.get('contacts', function(contacts){
        $.each(contacts, function(){
            var entry = '';
            entry += '<tr>';
                $.each(this, function(){
                    entry+= '<td>' + this.this.prefix +
                });
            entry += '</tr>';
        });
    });
    
}
table
caption Contact List
thead
    tr 
        each val in ["Prefix", "First Name", "Last Name", "Street", "City", "State", "Zip", "Phone", "Email", "Contact By Phone", "Contact By Mail", "Contact By Email", "Latitude", "Longitude"]
            th #{val}
tbody
    each contact in contacts
        tr
            each property in contact
                td #{property}*/