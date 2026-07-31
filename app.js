let products = JSON.parse(localStorage.getItem("products")) || [];

let cart = [];

let eventData = JSON.parse(localStorage.getItem("eventData")) || {
    cashSales:0,
    cardSales:0
};




// SAVE DATA

function saveProducts(){

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


function saveEvent(){

    localStorage.setItem(
        "eventData",
        JSON.stringify(eventData)
    );

}




// PAGE SWITCH

function showPage(page){

    document.querySelectorAll(".page")
    .forEach(p=>p.classList.add("hidden"));


    document.getElementById(page)
    .classList.remove("hidden");



    if(page==="checkout"){

        displayCheckout();

    }


    if(page==="inventory"){

        displayInventory();

    }


    if(page==="barcodes"){

        loadBarcodeList();

    }

}




// CREATE BARCODE

function generateBarcode(){

    return "CR" + Date.now();

}







// ADD PRODUCT

function addProduct(){


let barcode =
document.getElementById("barcode").value;


if(barcode===""){

    barcode=generateBarcode();

}



let product={


id:Date.now(),

name:
document.getElementById("name").value,


price:
Number(document.getElementById("price").value),


size:
document.getElementById("size").value,


barcode:barcode,


stock:
Number(document.getElementById("stock").value),


photo:""


};




let file =
document.getElementById("photo").files[0];



if(file){


let reader=new FileReader();


reader.onload=function(){


product.photo=reader.result;


products.push(product);


saveProducts();


alert("Product Added");


};



reader.readAsDataURL(file);


}

else{


products.push(product);

saveProducts();


}



}









// CHECKOUT PRODUCTS WITH PHOTOS


function displayCheckout(){


let box =
document.getElementById("productButtons");


box.innerHTML="";



products.forEach(p=>{


box.innerHTML += `


<div class="productButton"
onclick="addToCart(${p.id})">


<img src="${p.photo || ''}">


<h3>${p.name}</h3>


<p>
$${p.price}
</p>


<p>
Stock: ${p.stock}
</p>


</div>


`;

});


}









// ADD TO CART


function addToCart(id){


let product =
products.find(p=>p.id===id);



if(product.stock<=0){

alert("Out of stock");

return;

}




let item =
cart.find(c=>c.id===id);



if(item){

    item.qty++;

}

else{


cart.push({

id:product.id,

name:product.name,

price:product.price,

qty:1

});


}



displayCart();


}








// DISPLAY CART


function displayCart(){


let box =
document.getElementById("cart");


box.innerHTML="";



let total=0;



cart.forEach(item=>{


total += item.price * item.qty;



box.innerHTML += `


<div class="cartItem">


<h3>${item.name}</h3>


<p>
$${item.price} × ${item.qty}
</p>



<button onclick="changeQty(${item.id},1)">
➕
</button>



<button onclick="changeQty(${item.id},-1)">
➖
</button>



<button class="removeCart"
onclick="removeFromCart(${item.id})">

🗑 Remove

</button>


</div>


`;



});



document.getElementById("cartTotal")
.innerHTML =
total.toFixed(2);


}









// CHANGE QUANTITY


function changeQty(id,amount){


let item =
cart.find(c=>c.id===id);



item.qty += amount;



if(item.qty<=0){

removeFromCart(id);

}

else{

displayCart();

}


}








// REMOVE ONE ITEM


function removeFromCart(id){


cart =
cart.filter(
item=>item.id!==id
);


displayCart();


}








// CLEAR CART


function clearCart(){


if(confirm("Clear cart?")){


cart=[];


displayCart();


}


}









// COMPLETE SALE


function completeSale(){


if(cart.length===0){

alert("Cart is empty");

return;

}



let total=0;



cart.forEach(item=>{


let product =
products.find(
p=>p.id===item.id
);



product.stock -= item.qty;



total += item.price * item.qty;



});



saveProducts();



let payment =
prompt(
"Type CASH or CARD"
);



if(payment){


payment =
payment.toLowerCase();



if(payment==="cash"){

eventData.cashSales += total;

}



if(payment==="card"){

eventData.cardSales += total;

}



saveEvent();


}



cart=[];


displayCart();


displayCheckout();


alert("Sale Complete");


}









// INVENTORY DISPLAY


function displayInventory(){


let box =
document.getElementById("inventoryList");


box.innerHTML="";



products.forEach(p=>{


box.innerHTML += `


<div class="product">


<img src="${p.photo || ''}">


<h2>
${p.name}
</h2>


<p>
Stock: ${p.stock}
</p>


<p>
Barcode: ${p.barcode}
</p>


</div>


`;

});


}







// DASHBOARD


function updateDashboard(){


let p =
document.getElementById("totalProducts");


let s =
document.getElementById("totalStock");



if(p){

p.innerHTML=products.length;

}



let total=0;



products.forEach(x=>{

total+=x.stock;

});



if(s){

s.innerHTML=total;

}


}





updateDashboard();