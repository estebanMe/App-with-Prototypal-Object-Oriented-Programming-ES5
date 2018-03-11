'use strict';
const appConfig = {
    myForm: document.getElementById("myForm"),
    borderDanger: "1px solid red",
    formStateModify: "modify",
    nameLocalStorage: "localListEmployee", //Storage
    indexCounter: "indexCounter" //tabla de indices
}

function MyApp() { //Clase MyApp
    this.listOfEmployee = [];
}

//Metodo publico de la clase myApp, sera la que se encargará de interactuar con la aplicación y sus eventos
MyApp.prototype.initialize = function() {

    this.printTableHtml();

    function validateForm() { // metodo privado que devolverá True o False
        for (var i = 0; i < appConfig.myForm.length; i++) {
            if (appConfig.myForm.elements[i].tagName !== "BUTTON") {
                if (appConfig.myForm.elements[i].value == null || /^\s*$/.test(appConfig.myForm.elements[i].value)) {
                    appConfig.myForm.elements[i].style.border = appConfig.borderDanger;
                    appConfig.myForm.elements[i].focus();
                    return;
                } else {
                    appConfig.myForm.elements[i].style.border = "";
                }
            }
        }
        return true;
    }

    // Escucho el evento submit del formulario, tanto si es para modificar o agregar un nuevo registro
    appConfig.myForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm()) { //Preguntamos el valor de la validación del formulario.
            if (this.className == appConfig.formStateModify) {
                //Realizamos una modificación
                var newEmployee = new Employee(this.elements["name"].value, this.elements["lastName"].value, this.elements["age"].value, this.elements["phone"].value, this.elements["speciality"].value);
                newEmployee.saveModifiedEmployee(this.elements["idEmployee"].value, app.getDataStorage());
                app.printTableHtml();
                app.resetFormModified(appConfig.myForm);
            } else {
                //Realizamos el alta de un nuevo empleado
                var newEmployee = new Employee(this.elements["name"].value, this.elements["lastName"].value, this.elements["age"].value, this.elements["phone"].value, this.elements["speciality"].value);
                var newRegister = newEmployee.prepareRegister();
                newEmployee.saveEmployee(app.getDataStorage(), newRegister);
                app.printTableHtml();
                app.resetForm(appConfig.myForm);
            }
        }
    }, false);

    // Escucho el evento de los botones editar o eliminar de la tabla HTML
    document.addEventListener('click', function(event) {
        this.listOfEmployee = app.getDataStorage(); //nos aseguramos de traer lo ultimo del LocalStorage
        var targetBtn = event.target;

        if (targetBtn.classList.contains('edit')) {
            var idEmployee = event.target.parentNode.getAttribute("data-id");
            appConfig.myForm.setAttribute("class", "modify");
            var editEmployee = new Employee();
            editEmployee.editEmployee(idEmployee, this.listOfEmployee);
        }
        if (targetBtn.classList.contains('remove')) {
            var idEmployee = event.target.parentNode.getAttribute("data-id");
            var removeEmployee = new Employee();
            removeEmployee.removeEmployee(idEmployee, this.listOfEmployee);
            app.printTableHtml();
        }
        if (targetBtn.classList.contains('cancel')) {
            app.resetForm(appConfig.myForm);
        }
    }, false);
}



//Retorno el array de objetos del localStorage
MyApp.prototype.getDataStorage = function() {
    var storedList = localStorage.getItem(appConfig.nameLocalStorage);
    var listOfEmployee;
    if (storedList == null) {
        listOfEmployee = [];
    } else {
        listOfEmployee = JSON.parse(storedList);
    }
    return listOfEmployee;
}

//Creo e imprimo el tbody con cada row y sus respectivas celdas
MyApp.prototype.printTableHtml = function() {
    this.listOfEmployee = this.getDataStorage();
    var tbody = document.querySelector("#listEmploye tbody");
    tbody.innerHTML = "";
    for (var i = 0; i < this.listOfEmployee.length; i++) {
        var row = tbody.insertRow(i),
            idCell = row.insertCell(0),
            nameCell = row.insertCell(1),
            lastNameCell = row.insertCell(2),
            ageCell = row.insertCell(3),
            phoneCell = row.insertCell(4),
            specialtyCell = row.insertCell(5),
            removeCell = row.insertCell(6),
            editCell = row.insertCell(7);

        idCell.innerHTML = this.listOfEmployee[i].id;
        nameCell.innerHTML = this.listOfEmployee[i].name;
        lastNameCell.innerHTML = this.listOfEmployee[i].lastName;
        ageCell.innerHTML = this.listOfEmployee[i].age;
        phoneCell.innerHTML = this.listOfEmployee[i].phone;
        specialtyCell.innerHTML = this.listOfEmployee[i].speciality;

        var btnRemove = document.createElement("button"),
            btnEdit = document.createElement("button");
        btnRemove.type = 'button';
        btnEdit.type = 'button';
        btnRemove.setAttribute('data-id', this.listOfEmployee[i].id);
        btnEdit.setAttribute('data-id', this.listOfEmployee[i].id);

        btnRemove.innerHTML = "<i class='glyphicon glyphicon-remove remove'></i>";
        btnEdit.innerHTML = "<i class='glyphicon glyphicon-pencil edit'></i>";

        removeCell.appendChild(btnRemove);
        editCell.appendChild(btnEdit);
        tbody.appendChild(row);
    }
}

MyApp.prototype.resetForm = function(form) {
    form.reset();
}

MyApp.prototype.resetFormModified = function(form) {
    this.resetForm(form);
    var btnCancel = document.getElementById("cancel");
    if (btnCancel !== null) btnCancel.remove(btnCancel);
    form.removeAttribute("class");
    var contentNumberId = document.getElementById("contentNumberEmployee");
    contentNumberId.classList.add("hidden");
}