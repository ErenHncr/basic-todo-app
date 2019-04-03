//Tüm Elementleri Seçme
const form=document.querySelector("#todo-form");
const todoInput=document.querySelector("#todo");
const toDoList=document.querySelector(".list-group");
const firstCardBody=document.querySelectorAll(".card-body")[0];
const secondCardBody=document.querySelectorAll(".card-body")[1];
const filter=document.querySelector("#filter");
const clearButton=document.querySelector("#clear-todos");

eventListeners();
function eventListeners(e){ //Tüm eventListener lar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){
    
    if(confirm("Tümünü Silmek İstediğinize Emin Misiniz ?")){
        // Arayüzden todoları temizleme
        // toDoList.innerHTML=""; //Yavaş
        while(toDoList.firstElementChild!=null){
            toDoList.removeChild(toDoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
    

}

function filterTodos(e){

    const filterValue=e.target.value.toLowerCase();
    const listItems=document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        
        if(text.indexOf(filterValue)===-1){ //Indexof alan boş olduğunda değeri 0 olarak döndürür
            //Bulamadığında
            listItem.setAttribute("style","display:none !important");
            
        }
        else{
            
            listItem.setAttribute("style","display:block");
        }

    });
}

function deleteTodo(e){
    if(e.target.className==="fa fa-remove")
    {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi.");
    }
}

function deleteTodoFromStorage(deleteTodo){
   let todos=getTodosFromStorage();
   todos.forEach(function(todo,index){
        if(todo===deleteTodo){
            todos.splice(index,1); //Arrayden değeri silebiliriz
        }
   });
   localStorage.setItem("todos",JSON.stringify(todos));

}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){   
        addTodoToUI(todo);
    });

}

function addTodo(e){
    const newToDo=todoInput.value.trim();
    
    if(newToDo==""){
        showAlert("danger","Lütfen bir todo girin...");
        /*<div class="alert alert-danger" role="alert">
                        This is a danger alert with . Give it a click if you like.
                      </div>
        */

    }else{
        if(checkLocalStorage(newToDo)){
            addTodoToUI(newToDo);
            addTodoStorage(newToDo);
            showAlert("success",`"${newToDo}" başarıyla eklendi...`);
        }
        else{
            showAlert("danger",`"${newToDo}" listenizde bulunmaktadır. Lütfen farklı bir todo giriniz ...`);
            todoInput.value="";
        }
    }

    e.preventDefault();
}

function checkLocalStorage(newToDo){
    const todos=getTodosFromStorage();
    let check=0;
    todos.forEach(function(todo){
        if(newToDo.toLowerCase()==todo.toLowerCase()){
            check++;
        }        
    });
    
    return !(check>0); // Girilen değer todolistte yoksa true döner
}

function getTodosFromStorage(){ //Storagedan bütün todoları alır
    let todos;
    if(localStorage.getItem("todos")===null){
        todos=[];
    }else{
        todos=JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoStorage(newTodo){
    let todos=getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
    
}

function showAlert(type,message){
    const alert=document.createElement("div");
    alert.className=`alert alert-${type}`;
    alert.textContent=message;
    firstCardBody.appendChild(alert);

    //setTimeOut

    setTimeout(function(){ //Window Objesi Elementi
        alert.remove();
    },1500);

}

function addTodoToUI(newToDo){ //String Değerini list item olarak UI'ye ekleyecek
    // List Item Oluşturma
    const listItem = document.createElement("li");
    listItem.className="list-group-item d-flex justify-content-between";

    // Link Oluşturma
    const link = document.createElement("a");
    link.href="#";
    link.className="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    // Text Node Ekleme
    listItem.appendChild(document.createTextNode(newToDo));

    listItem.appendChild(link);
    toDoList.appendChild(listItem);
    todoInput.value="";

}