const CACHE_NAME = "crochet-pos-v1";


const files = [

"./",
"./index.html",
"./style.css",
"./app.js",
"./manifest.json"

];



self.addEventListener(
"install",
event=>{


event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>{

return cache.addAll(files);

})

);


});





self.addEventListener(
"fetch",
event=>{


event.respondWith(


caches.match(event.request)

.then(response=>{


return response || fetch(event.request);


})


);


});