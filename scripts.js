var Contacts = {

    index: window.localStorage.getItem("Contacts:index"),
    $table: document.getElementById("addressbook-table"),
    $form: document.getElementById("addressbook-form"),
    $button_cancel: document.getElementById("addressbook-cancel"),
    $button_add: document.getElementById("addressbook-add"),

    //Initialises the table, sets up localStorage and creates form with its necessary actions
    init: function() {
    	if (!Contacts.index) {
            window.localStorage.setItem("Contacts:index", Contacts.index = 1);
        }
        Contacts.$form.reset();
        Contacts.$button_cancel.addEventListener("click", function(event) {
        	Contacts.$form.reset();
        	Contacts.$form.id_entry.value = 0;
            document.getElementById("addDiv").style.display = "none";
            document.getElementById("formDiv").style.display = "none";

        }, true);
        Contacts.$form.addEventListener("submit", function(event) {
            var entry = {
                id: parseInt(this.id_entry.value),
                names: this.names.value, //identified as names because it messes up with function name
                phone: this.phone.value,
                address: this.address.value,
                email: this.email.value
            };
            if (entry.id == 0) { // add
                Contacts.storeAdd(entry);
                Contacts.tableAdd(entry);
            }
            else { // edit
                Contacts.storeEdit(entry);
                Contacts.tableEdit(entry);
            }

            this.reset();
            this.id_entry.value = 0;
            event.preventDefault();
        }, true);

        if (window.localStorage.length - 1) {
            var contacts_list = [], i, key;
            for (i = 0; i < window.localStorage.length; i++) {
                key = window.localStorage.key(i);
                if (/Contacts:\d+/.test(key)) {
                    contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
                }
            }

            if (contacts_list.length) {
                contacts_list
                    .sort(function(a, b) {
                        return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                    })
                    .forEach(Contacts.tableAdd);
            }
        }

        Contacts.$table.addEventListener("click", function(event) {
            var op = event.target.getAttribute("data-op");
            if (/muokkaa|poista/.test(op)) {
                var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
                if (op == "muokkaa") {
                    document.getElementById("editDiv").style.display = "block";
                    document.getElementById("formDiv").style.display ="block";
                    Contacts.$form.names.value    = entry.names;
                    Contacts.$form.address.value  = entry.address;
                    Contacts.$form.email.value    = entry.email;
                    Contacts.$form.phone.value    = entry.phone;
                    Contacts.$form.id_entry.value = entry.id;
                }
                else if (op == "poista") {
                    if (confirm('Haluatko varmasti poistaa henkilön "'+ entry.names +'" tiedot?')) {
                        Contacts.storeRemove(entry);
                        Contacts.tableRemove(entry);
                    }
                }
                event.preventDefault();
            }
        }, true);
    },

        storeAdd: function(entry) {
        entry.id = Contacts.index;
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
        window.localStorage.setItem("Contacts:index", ++Contacts.index);
    },
        storeEdit: function(entry) {
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
    },
        storeRemove: function(entry) {
        window.localStorage.removeItem("Contacts:"+ entry.id);
    },

        tableAdd: function(entry) {
        var $tr = document.createElement("tr"), $td, key;
        for (key in entry) {
            if (entry.hasOwnProperty(key)) {
                $td = document.createElement("td");
                $td.appendChild(document.createTextNode(entry[key]));
                $tr.appendChild($td);
            }
        }
        $td = document.createElement("td");
        $td.innerHTML = '<a data-op="muokkaa" data-id="'+ entry.id +'">Muokkaa</a> | <a data-op="poista" data-id="'+ entry.id +'">Poista</a>';
        $tr.appendChild($td);
        $tr.setAttribute("id", "entry-"+ entry.id);
        Contacts.$table.appendChild($tr);
        document.getElementById("addDiv").style.display = "none";
        document.getElementById("formDiv").style.display = "none"; 
    },
        tableEdit: function(entry) {
        var $tr = document.getElementById("entry-"+ entry.id), $td, key;
        $tr.innerHTML = "";
        for (key in entry) {
            if (entry.hasOwnProperty(key)) {
                $td = document.createElement("td");
                $td.appendChild(document.createTextNode(entry[key]));
                $tr.appendChild($td);
            }
        }
        $td = document.createElement("td");
        $td.innerHTML = '<a data-op="muokkaa" data-id="'+ entry.id +'">Muokkaa</a> | <a data-op="poista" data-id="'+ entry.id +'">Poista</a>';
        $tr.appendChild($td);
        document.getElementById("addDiv").style.display = "none";
        document.getElementById("formDiv").style.display = "none";
        
    },
        tableRemove: function(entry) {
        Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
    },


};

Contacts.init();

function revealForm() {
 document.getElementById("formDiv").style.display = "block"; 
 document.getElementById("addDiv").style.display = "block";
}
