'use strict';

function Employee(name, lastName, age, phone, speciality) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.phone = phone;
    this.speciality = speciality;
}

Employee.prototype.prepareRegister = function() {
    var newEmployee = {
        id: this.generateNumberEmployee(),
        name: this.name,
        lastName: this.lastName,
        age: this.age,
        phone: this.phone,
        speciality: this.speciality
    };
    return newEmployee;
}


Employee.prototype.saveEmployee = function(arrayObj, newEmployee) {
    arrayObj.push(newEmployee);
    localStorage.setItem(appConfig.nameLocalStorage, JSON.stringify(arrayObj));
}

Employee.prototype.saveModifiedEmployee = function(idEmployee, listOfEmployee) {
    var indexObj = this.getEmployee(idEmployee, listOfEmployee);

    listOfEmployee[indexObj].id = idEmployee;
    listOfEmployee[indexObj].name = this.name;
    listOfEmployee[indexObj].lastName = this.lastName;
    listOfEmployee[indexObj].age = this.age;
    listOfEmployee[indexObj].phone = this.phone;
    listOfEmployee[indexObj].speciality = this.speciality;
    localStorage.setItem(appConfig.nameLocalStorage, JSON.stringify(listOfEmployee));
}


Employee.prototype.removeEmployee = function(idEmployee, listOfEmployee) {
    var indexObj = this.getEmployee(idEmployee, listOfEmployee);
    if (indexObj === undefined) {
        return;
    } else {
        listOfEmployee.splice(indexObj, 1);
        localStorage.setItem(appConfig.nameLocalStorage, JSON.stringify(listOfEmployee));
    }
}

Employee.prototype.editEmployee = function(idEmployee, listEmployee) {
    //Creamos un boton Cancel para cancelar la edición.
    var btnCancel = document.createElement("button");
    btnCancel.type = 'button';
    btnCancel.innerHTML = 'Cancelar';
    btnCancel.id = 'cancel';
    btnCancel.classList = 'cancel btn btn-danger';
    var tag = document.getElementById("submit");
    if (tag.nextElementSibling) {
        return;
    } else {
        tag.parentNode.insertBefore(btnCancel, tag.nextSibling);
    }


    //Obtenemos el indice del objeto en el arrayObj y lo guardamos en una variable
    var indexObj = this.getEmployee(idEmployee, listEmployee);

    //Poblamos el formulario con las pripiedades del objeto que queremos editar
    appConfig.myForm.elements["idEmployee"].value = listEmployee[indexObj].id;
    appConfig.myForm.elements["name"].value = listEmployee[indexObj].name;
    appConfig.myForm.elements["lastName"].value = listEmployee[indexObj].lastName;
    appConfig.myForm.elements["age"].value = listEmployee[indexObj].age;
    appConfig.myForm.elements["phone"].value = listEmployee[indexObj].phone;
    appConfig.myForm.elements["speciality"].value = listEmployee[indexObj].speciality;

    //Hacemos visible el divContent idEmployee del form en el HTML
    var contentNumberId = document.getElementById("contentNumberEmployee");
    contentNumberId.classList.remove("hidden");
    document.getElementById("idEmployee").type = "text";

    //Escuchamos el evento del boton 'Cancel' del formulario
    btnCancel.addEventListener("click", function() {
        btnCancel.remove(btnCancel);
        appConfig.myForm.removeAttribute("class");
        var contentNumberId = document.getElementById("contentNumberEmployee");
        contentNumberId.classList.add("hidden");
        document.getElementById("idEmployee").type = "hidden";
    });
}

//Retorno el indice que ocupa un idEmployee en el array de objetos
Employee.prototype.getEmployee = function(idEmployee, listOfEmployee) {
    var indexObj;
    for (var i = 0; i < listOfEmployee.length; i++) {
        if (listOfEmployee[i].id == idEmployee) {
            indexObj = i;
            break;
        }
    }
    return indexObj;
}


Employee.prototype.generateNumberEmployee = function() {
    var n = localStorage.getItem(appConfig.indexCounter);
    if (n === null) {
        n = 0;
    }
    n++;
    localStorage.setItem(appConfig.indexCounter, n);
    return n;
}