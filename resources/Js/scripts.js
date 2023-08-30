
const form = document.getElementById("transactionForm"); //Aqui guardamos en una variable el contenido del formulario

form.addEventListener("submit",function(event){          //Aqui se le agrega un detectador de evento al realizar "submit" es decir, al enviar el formulario
  event.preventDefault();                                //Con esta linea, evitamos que se recargue la pagina al hacer un "submit"
                                                         // es decir que cancela en comportamiento por defecto del navegador, es decir no recargar la pagina,con submit se manda la pagina al servidor y este devuelve otra nueva
  let transactionFormData = new FormData(form);         // aqui creamos un objeto que contenga los atributos de nuestro fomulario al enviar el formulario
                                                         //otra opcion para obtener esos datos en tiempo real de lo que se encuentra 
                                                       //en los formularios es utilizando el metodo .querySelector("#Id del input")
                                                        //ejemplo de nuestro caso: form.querySelector("#transcationCategory")
  let transactionObj = convertFormDataToTransactionObj(transactionFormData); // guardo en la vble. el objeto convertido del formData
  saveTransactionObj(transactionObj);              //antes de insertar la info en la tabla, lo guardamos en el localStorage
  InsertRowInTransactionTable(transactionObj);     //con esta funcion inserto el contenido del objeto creado previamente en una nueva fila de la tabla         
  form.reset();                                    // con reset, limpiamos y dejamos nuestro formulario a su estado inicial        

})

/*function insertCategory(category){                  //funcion para agregar una nueva categoria el select de categorias
  const selectElement = document.getElementById("transactionCategory"); //almaceno en una constante el elemento select del documento HTML
  let category = 


}*/

document.addEventListener("DOMContentLoaded",function(event){  //Se realiza esta funcion cuando apenas se carga el DOM,antes de parsearse, es decir antes q secargue css y js
                                                       //hacemos esto para que antes de que se carguen los demas elementos de la pagina
                                                       // se busquen en el localStore el contenido anterior almacenado para cargarlo en la tabla
let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];//aqui obtenemos y guardamos en la vble el contenido actual del localStorage convertido en array de objetos
transactionObjArr.forEach(function(elementArray){
InsertRowInTransactionTable(elementArray); 
})

})

function getNewTransactionId(){
let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1"; // obtiene el ultimo numero de transaccion almacenado en el local storage
                                                                        // en el caso de no haber nada almacenado, le asigna -1
let newTransactionId = JSON.parse(lastTransactionId) + 1;                 //Aqui se le suma 1 al ultimo Id almacenado (se convierte antes de string a objeto numero para sumarle ese 1)
localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId)); // Aqui seteamos a la nueva fila con el nuevo valor indentificador
return newTransactionId;                                                    //Por ultimo se retorna el numero nuevoo indetificador para la transaccion                    
}




function convertFormDataToTransactionObj(transactionFormData){  //Funcion que nos va a permitir convertir el objeto que contiene nuestro formulario
                                                           //es decir convertir el FormData en otro objeto para poder almacenarlo luego en el localStorage(ya que solo permite guardar strings)
  let transactionType = transactionFormData.get("transactionType"); //aqui guarda el contenido del formulario en su vble. correspondiente
  let transactionDescription = transactionFormData.get("transactionDescription");//Idem para los demas inputs
  let transactionAmount = transactionFormData.get("transactionAmount");
  let transactionCategory = transactionFormData.get("transactionCategory");
  let transactionId = getNewTransactionId();   //almacena un nuevo numero de transaccion para identificar a cada transaccion a partir de una funcion
  return{                                      //Aqui devolvera un objeto formado por los 4 elementos/claves con sus respectivos valores
     "transactionType": transactionType,"transactionDescription": transactionDescription,"transactionAmount": transactionAmount,"transactionCategory": transactionCategory,"transactionId":transactionId}
}

function InsertRowInTransactionTable(transactionObj){                //funcion para agregar los datos del formulario a la tabla
  let transactionTableRef = document.getElementById("transactionTable");  //Aqui guardamos una REFERENCIA a la tabla para luego agregarle las filas 
  let newTransactionRowRef = transactionTableRef.insertRow(-1);       // Aqui creo una fila nueva en la tabla en la ultima posicion

  newTransactionRowRef.setAttribute("data-transaction-id",transactionObj["transactionId"]); //Aqui le asigno un data atribute(atributo) a la fila
                                                                                           //el cual lo obtengo del identificador Id del objeto
                                                                                            //que se le esta pasando, esto para luego poder identificarlo y 
                                                                                            //eliminarlo de la tabla

  let newTypeCellRef = newTransactionRowRef.insertCell(0);           // Guardamos en esta variable una referencia a la posicion donder se guardara el siguiente elemento
  newTypeCellRef.textContent = transactionObj["transactionType"];    //Editamos el contenido en la posicion previa 

  newTypeCellRef = newTransactionRowRef.insertCell(1);                   //Continuamos de la misma manera con la siguiente posicion con
  newTypeCellRef.textContent = transactionObj["transactionDescription"]; //los siguientes elementos, editando su contenido respectivamente en cada posicion

  newTypeCellRef = newTransactionRowRef.insertCell(2); 
  newTypeCellRef.textContent = transactionObj["transactionAmount"];

  newTypeCellRef = newTransactionRowRef.insertCell(3); 
  newTypeCellRef.textContent = transactionObj["transactionCategory"];


  let newDeleteCell = newTransactionRowRef.insertCell(4);     //crea una celda para agregar el boton de eliminar 
  let deleteButton = document.createElement("button");       //indicamos que cree un nuevo boton en el HTML pasandole como parametro el tagname button
  deleteButton.textContent = "Eliminar";                     //le ponemos el contenido del boton
  deleteButton.setAttribute("class","waves-effect waves-light btn-small");//le agrego una clase de materialize CSS para cmabiarle el estilo al boton


  newDeleteCell.appendChild(deleteButton);                   //agregamos el boton en la celda de la columna eliminar con appendChild y le pasamos el boton q queremos agregar
  //Por el momento se o hace asi pero mas adelante se optimizara

  deleteButton.addEventListener("click", (event)=>{            //escucha de evento cuando se haga click en el boton eliminar de una fila determinada
   let transactionRow = event.target.parentNode.parentNode;   //aqui selecionamos el evento, obtenemos su target el HTML, luego se busca al padre 
                                                              //del boton eliminar de la fila determinada, que en este caso nos dara el td
                                                                //de la celda eliminar, aplicandole nuevamente el parentNode obtenemos el tag
                                                                //que lo mantiene, es decir el tr de toda la fila
                                                                // por ultimo teniendo la referencia a la fila, se la la guarda en una variable
                                                                //esto o guardo ademas en una variable
  let transactionId = transactionRow.getAttribute("data-transaction-id"); //Aqui guardamos en la variable el Id de la fila a eliminar

  transactionRow.remove();                                      //Aqui eliminamos de la tabla del HTML, la fila 
  deleteTransactionObj(transactionId);                              //Por ultimo elimino del localStorage la transaccion determinada, pasando como
                                                               //parametro el Id de la misma
   
  })

}

function deleteTransactionObj(transactionId){                       //funcion  para eliminar del localStorage una fila, pasandole su Id 
let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")); //Almaceno en una vble, el array de las transacciones, pero antes la parseo a array de objetos
let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId);//Aqui obtengo el indice de la transaccion
                                                                                                        //que es igual al Id que estamos buscando para eleminar
                                                            //IMPORTANTE!! -> Aqui cambie el "===" por el "==" ya que no coincidian los tipos de datos y no borraba bien del localStorage
transactionObjArr.splice(transactionIndexInArray, 1);        //Aqui elimino la transaccion pandandole la posicion del indice, y el otro parametro indica cuantas ocurrencias 
                                                           //eliminar del mismo.
let transactionArrayJSON = JSON.stringify(transactionObjArr); //Convierto nuevamente el array en String
localStorage.setItem("transactionData", transactionArrayJSON);  //Guardo el nuevo contenido del array en el localStorage                                                                                                                                                                              

}

function saveTransactionObj(transactionObj){                 //funcion para guardar el Objeto en el localStorage
let myTransactionArray = JSON.parse(localStorage.getItem("transactionData"))||[]; //obtenemos en primero lugar nuestro array ya almacenado en el LS y lo pasamos a Objeto
                                                                                   // el caso que el array sea nulo va a producirse un error
                                                                                  //es por eso que se le agrega el "||" or logico para que
                                                                                 //en el caso de ser nulo el array(en un princpio) se cree un
                                                                                 //array vacio para luego agregar el objeto(nuevo elemento)
myTransactionArray.push(transactionObj);                //agregamos el nuevo elemento en nuestro array de objetos
let transactionArrayJSON = JSON.stringify(myTransactionArray);   //Luego convertimos en String a nuestro Array para poder almancernarlo en el localStorage
localStorage.setItem("transactionData",transactionArrayJSON); //Aqui se guarda el array actualizado en el localStorage
}
