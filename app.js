"use strict";

// HTML-ELEMENT //
const sectionEl = document.getElementById("products");

const nameEl = document.getElementById("name");
const addressEl = document.getElementById("address");
const emailEl = document.getElementById("email");
const productIdEl = document.getElementById("productId");
const deliveryEl = document.getElementById("delivery-method");
const confirmButtonEl = document.getElementById("confirm");

let filterInputEl = document.getElementById("filterinput");



let succefullMessageEl = document.getElementById("successfull-msg");


// Hämta data från fake store API
fetch('https://fakestoreapi.com/products')


.then((data)=>{
  return data.json();
})
.then ((completedata)=>{

  //console.log(completedata[2].title);
  // document.getElementById('root').innerHTML=completedata[2].title; 

  let data1="";
  completedata.map((values)=>{
    data1+= // + lägger till alla produkterna
    `
    <div class="box-product">
    <h2 class="title">${values.title}</h2>
    <img src=${values.image} alt="img" class="images">
    <p class="description">${values.description}</p>
    <p class="category">- Category -<br>${values.category}</p>
    <p class="price">Price: ${values.price} €</p>
    <p id="rating">Rating: ${values.rating.rate}</p>
    <br>
    <hr>
    <br>
    <button onclick= "addToCart('${values.id}', '${values.title.replace("'","")}', '${values.price}', '${values.image}')" class="button"><span>Add to cart</span></button>
    </div>
    `
 
  });
  //console.log(completedata);
  document.getElementById("products").innerHTML = data1; // Visar all info på hemsidan
});


function buyProduct(){

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const address = addressEl.value.trim();
  const delivery = deliveryEl.value.trim();

  if(!name || !email || !address || !delivery){ 
      console.log("Name, Email, Deliver-method or Address is missing");




      return;
  }
  const productId = productsInCartList.map(item => {
      return { "stringValue": item.id }
   
  });

  const data = {
      "fields": {
          "Name": {
              "stringValue": name
          },
          "Email": {
              "stringValue": email
          },
          "Address": {
            "stringValue": address
          },
          "Shipping": {
            "stringValue": delivery
          },
          "ProductId": {
              "arrayValue": {
                  "values": productId
              }
          }
      }
  }

  fetch("https://firestore.googleapis.com/v1/projects/test-api-4f641/databases/(default)/documents/buyers", {

  method: "POST",
  headers: {

    "Content-type": "application/json"
          },

  body: JSON.stringify(data)

})
.then(res => res.json())
.then(data => console.log(data));


// Succefull sned order message
let succefullMessageEl = 
`
<p id="successfull-msg">  <i class='bx bxs-badge-check bx-sm'></i><br>"Successfully send order"</p>
<br>
`
document.getElementById("successfull-msg").innerHTML = succefullMessageEl;


// 5 seconds timeout

setTimeout(() => {
  document.location.reload();
}, 5000);

console.log(data)

// Local Storage Clear funktion
localStorage.clear();

}

let productsInCartList = JSON.parse(localStorage.getItem("product")) || []

// Funktion för köp-knappen
function addToCart (id, title, price, image) {

  productsInCartList.push({
    id,
    title,
    price,
    image,
  });

// Sparar produkterna i localStorage
  localStorage.setItem("product", JSON.stringify(productsInCartList));

  displaycart();
  console.log(productsInCartList);
}


function displaycart(a) {
  let i = 0;
  let total=0;
  document.getElementById("count").innerHTML=productsInCartList.length;
  if(productsInCartList.length==0){
    document.getElementById("cartItem").innerHTML = "Your cart is empty";
    document.getElementById("total").innerHTML = "€ ";
  } else {
    document.getElementById("cartItem").innerHTML = productsInCartList.map((items) =>
    {
      var {image, title, price} = items;
      total += parseFloat(price);
      document.getElementById("total").innerHTML = "€ "+total+"";
      return(
        `<div class='cart-item'>
          <p>${title}</p>

          <div class='row-img'>
          <img class='img-icon' src=${image}>
          </div>

          <h2> € ${price}</h2>` +
          "<i class='bx bxs-trash-alt bx-sm' onclick='deleteItem("+ (i++) +")'></i></div>"
        
      );
    }).join('');
  }
  }
  displaycart();


  function deleteItem(a){
    productsInCartList.splice(a,1);

    // Tar bort och laddar om carten i localStorage
    localStorage.setItem("product", JSON.stringify(productsInCartList));
    location.reload()
    displaycart();
  }


function filterProducts(){
  let filterValue = filterInputEl.value.toUpperCase();
  let item = sectionEl.querySelectorAll(".box-product") // här kan det bli fel
  //console.log(filterValue);

  for (let j = 0; j<item.length; j++) {
    let span = item[j].querySelector(".category") // Här kan man ändra om man vill till titel eller andra klasser
    
    // Matchar med första bokstaven i kategorin 
    if(span.innerHTML.toUpperCase().indexOf(filterValue) > -1){
      item[j].style.display = "initial"; 
    }else{
      item[j].style.display = "none";
    }
  }
}




// EVENTLYSSNARE //
confirmButtonEl.addEventListener("click", buyProduct);
filterInputEl.addEventListener("keyup",filterProducts);











   

 



