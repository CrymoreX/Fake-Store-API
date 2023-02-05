"use-strict";

// HTML-ELEMENT //

const nameAdminEl = document.getElementById("nameadmin");
const addressAdminEl = document.getElementById("addressadmin");
const emailAdminEl = document.getElementById("emailadmin");
const productidAdminEl = document.getElementById("productidadmin");
const shippingAdminEl = document.getElementById("shipping-method");



const containerEl = document.getElementById("admin");


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
        <input type="button" value="Update order" class="button" onClick="updateBuyer('${product.name}')">
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

}


// Funktionen för att uppdatera en order -- Funkar!

function updateBuyer(name){

    const nameAdmin = nameAdminEl.value;
    const emailAdmin = emailAdminEl.value;
    const addressAdmin = addressAdminEl.value;
    const productidAdmin = productidAdminEl.value;
    const shippingAdmin = shippingAdminEl.value;
    
    


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
}
