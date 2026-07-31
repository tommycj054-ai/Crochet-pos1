let products = JSON.parse(localStorage.getItem("products")) || [];

let cart = [];

let eventData = JSON.parse(localStorage.getItem("eventData")) || {
    active:false,
    startingCash:0,
    cashSales:0,
    cardSales:0
};



// SAVE

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


    updateDashboard();


    if(page==="inventory"){
        displayInventory();
    }


    if(page==="checkout"){
        displayCheckout();
    }


    if(page==="barcodes"){
        loadBarcodeList();
    }


    if(page==="event"){
        updateEvent();
    }

}





// BARCODE CREATOR

function generateBarcode(){

    return "CR" + Date.now();

}







// ADD PRODUCT

function addProduct(){


let barcode =
document.getElementById("barcode").value;


if(barcode===""){

    barcode = generateBarcode();

}



let product = {

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


alert("Added");


};



reader.readAsDataURL(file);



}

else{


products.push(product);

saveProducts();

}



}








// INVENTORY

function displayInventory(){


let box =
document.getElementById("inventoryList");


box.innerHTML="";



products.forEach(p=>{


box.innerHTML += `


<div class="product">


<img src="${p.photo || ''}">


<h3>${p.name}</h3>


<p>
Price: $${p.price}
</p>


<p>
Stock: ${p.stock}
</p>



<svg id="bar-${p.id}"></svg>



<button onclick="addStock(${p.id})">
➕ Stock
</button>



<button onclick="removeStock(${p.id})">
➖ Stock
</button>



</div>


`;



setTimeout(()=>{

JsBarcode(
"#bar-"+p.id,
p.barcode
);


},100);



});


}






function addStock(id){


let amount =
Number(prompt("Add amount"));



let p =
products.find(x=>x.id===id);


p.stock += amount;


saveProducts();


displayInventory();


}



function removeStock(id){


let amount =
Number(prompt("Remove amount"));



let p =
products.find(x=>x.id===id);


p.stock -= amount;


if(p.stock<0){

p.stock=0;

}


saveProducts();


displayInventory();


}








// CHECKOUT


function displayCheckout(){


let box =
document.getElementById("productButtons");


box.innerHTML="";



products.forEach(p=>{


box.innerHTML += `


<button onclick="addToCart(${p.id})">

${p.name}

<br>

$${p.price}

</button>


`;


});


}





function addToCart(id){


let p =
products.find(x=>x.id===id);


let item =
cart.find(x=>x.id===id);



if(item){

item.qty++;

}

else{


cart.push({

id:p.id,

name:p.name,

price:p.price,

qty:1

});


}



displayCart();


}





function displayCart(){


let box =
document.getElementById("cart");


box.innerHTML="";


let total=0;



cart.forEach(i=>{


total+=i.price*i.qty;


box.innerHTML += `


<div class="cartItem">

${i.name}

x${i.qty}

</div>


`;


});


document.getElementById("cartTotal")
.innerHTML=total.toFixed(2);


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



    showPaymentPopup(total);

}




function showPaymentPopup(total){


    let popup = document.createElement("div");


    popup.innerHTML = `

    <div class="paymentBox">

    <h2>
    Payment
    </h2>


    <h3>
    Total: $${total.toFixed(2)}
    </h3>


    <button onclick="finishPayment('cash',${total})">

    💵 CASH

    </button>


    <button onclick="finishPayment('card',${total})">

    💳 CARD

    </button>


    </div>

    `;


    popup.id="paymentPopup";


    document.body.appendChild(popup);


}




function finishPayment(type,total){


    if(type==="cash"){

        eventData.cashSales += total;

    }


    if(type==="card"){

        eventData.cardSales += total;

    }



    saveEvent();


    saveProducts();



    cart=[];


    displayCart();


    displayCheckout();


    updateEvent();



    document.getElementById("paymentPopup")
    .remove();



    alert("Sale Complete");


}











// EVENT MODE


function startEvent(){


let cash =
Number(
prompt("Starting cash amount")
);



eventData.active=true;

eventData.startingCash=cash;

eventData.cashSales=0;

eventData.cardSales=0;


saveEvent();


updateEvent();


}





function updateEvent(){


document.getElementById("startingCash")
.innerHTML =
eventData.startingCash;



document.getElementById("cashSales")
.innerHTML =
eventData.cashSales.toFixed(2);



document.getElementById("cardSales")
.innerHTML =
eventData.cardSales.toFixed(2);



document.getElementById("eventTotal")
.innerHTML =
(
eventData.cashSales+
eventData.cardSales
).toFixed(2);


}





function endEvent(){


alert(

"Total Sales: $" +

(
eventData.cashSales+
eventData.cardSales

).toFixed(2)

);



eventData.active=false;


saveEvent();


}








// BARCODE PRINTING


function loadBarcodeList(){


let select =
document.getElementById("barcodeSelect");


select.innerHTML="";



products.forEach(p=>{


select.innerHTML += `


<option value="${p.id}">

${p.name}

</option>


`;

});


}







function printOneBarcode(){


let id =
Number(
document.getElementById("barcodeSelect").value
);



let p =
products.find(x=>x.id===id);



let area =
document.getElementById("barcodePrintArea");



area.innerHTML = `


<h2>${p.name}</h2>


<svg id="printOne"></svg>


<p>${p.barcode}</p>


`;



JsBarcode(
"#printOne",
p.barcode
);



window.print();


}





function printAllBarcodes(){


let area =
document.getElementById("barcodePrintArea");


area.innerHTML="";



products.forEach((p,index)=>{


area.innerHTML += `


<h2>${p.name}</h2>


<svg id="print-${index}"></svg>


<p>${p.barcode}</p>


<hr>


`;



setTimeout(()=>{


JsBarcode(
"#print-"+index,
p.barcode
);


},100);



});



setTimeout(()=>{

window.print();

},500);



}








// DASHBOARD


function updateDashboard(){


let a =
document.getElementById("totalProducts");


let b =
document.getElementById("totalStock");



if(a){

a.innerHTML=products.length;

}



let total=0;


products.forEach(p=>{

total+=p.stock;

});



if(b){

b.innerHTML=total;

}


}



updateDashboard();

updateEvent();