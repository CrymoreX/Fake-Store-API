"use-strict";

// HTML-ELEMENT //

const nameAdminEl = document.getElementById("nameadmin");
const addressAdminEl = document.getElementById("addressadmin");
const emailAdminEl = document.getElementById("emailadmin");
const productidAdminEl = document.getElementById("productidadmin");
const shippingAdminEl = document.getElementById("shipping-method");
const containerEl = document.getElementById("admin");
const adminFormEl = document.getElementById("adminform");
const saveButtonEl = document.getElementById("save");

fetch("https://firestore.googleapis.com/v1/projects/test-api-4f641/databases/(default)/documents/buyers")

.then( res => res.json())
.then( data => adminProducts(data));


function adminProducts (orders) {

    console.log(orders);

    const order = orders.documents

    for (let product of order) {

        containerEl.innerHTML += `
        <div class="order-box">
        <ul>
        <li>${"id: " + product.name}</li>
        <hr>
        <br>
        <li>${"Name: " + product.fields.Name.stringValue}</li>
        <li>${"Email: " + product.fields.Email.stringValue}</li>
        <li>${"Address: " + product.fields.Address.stringValue}</li>
        <li>${"Shipping: " + product.fields.Shipping.stringValue}</li>
        <li>${"Product Id's: " + product.fields.ProductId.arrayValue.values.map(value => value.stringValue)}</li>
        </ul>
        <br>
        <input type="button" value="Delete order" class="button" onClick="deleteBuyer('${product.name}')">
        <input type="button" value="Update order" class="button" onClick="editOrder('${product.name}')">
        <br>
        </div>
`
    }
}

// Funktionen för att ta bort en order -- Funkar!

function deleteBuyer(name){
        console.log("Succefully deleted buyer!");
        
        fetch("https://firestore.googleapis.com/v1/" + name, {

        method: "DELETE"

    })

    .then(res => res.json())
    .then(data => console.log(data));

    setTimeout(() => {
      document.location.reload();
    }, 1000);


}


// FUNKTION EXTRA FÖR ATT SPARA/UPPDATERA //

  function editOrder(name) {

    const nameInput = document.getElementById("nameadmin");
    const emailInput = document.getElementById("emailadmin");
    const productIdsInput = document.getElementById("productidadmin");
    const addressInput = document.getElementById("addressadmin");
    const shippingInput = document.getElementById("shipping-method");
    const userIdInput = document.getElementById("userId");


    let url = "https://firestore.googleapis.com/v1/" + name;

    fetch("https://firestore.googleapis.com/v1/" + name)
    .then (res => res.json())
    .then (data => assignValue(data));

  

    function assignValue(data) {
      
      localStorage.setItem("userId", name);
      console.log(localStorage.getItem("userId"));

      userIdInput.value = localStorage.getItem("userId");  
      nameInput.value = data.fields.Name.stringValue;
      emailInput.value = data.fields.Email.stringValue;
      productIdsInput.value = data.fields.ProductId.arrayValue.values.map(value => value.stringValue);
      shippingInput.value = data.fields.Shipping.stringValue;
      addressInput.value = data.fields.Address.stringValue;
      
      console.log(nameInput.value);
      console.log(productIdsInput.value);

      //let name = nameInput.value; 

      //updateBuyer(name);
    
      function updateBuyer(){

      
      console.log(nameInput.value);
      
      const userIdAdmin = userIdInput.value;
      console.log(userIdInput);
      const nameAdmin = nameInput.value;
      const emailAdmin = emailInput.value;
      const addressAdmin = addressInput.value;
      const productidAdmin = productIdsInput.value;
      const shippingAdmin = shippingInput.value;
      
      const body = JSON.stringify(
  
          { "fields": {
              "ProductId": {
                "arrayValue": {
                  "values": [
                    {
                      "stringValue": productidAdmin
                    },
                  ]
                }
              },
              "Name": {
                "stringValue": nameAdmin
              },
              "Email": {
                "stringValue": emailAdmin
              },
              "Shipping": {
                  "stringValue": shippingAdmin
                },
              "Address": {
                "stringValue": addressAdmin
              }
            
      }})
          
  
          fetch("https://firestore.googleapis.com/v1/" + name, {
  
          method: "PATCH",
          headers: {
      
              "Content-Type": "application/json",
      
          },
      
          body: body
      
      })
     
          .then(res => res.json())
          .then(data => console.log(data));
          console.log("Update complete!");
  
           setTimeout(() => {
             document.location.reload();
           }, 1000);

    }
  

    saveButtonEl.addEventListener("click", updateBuyer);
  

  }}
  