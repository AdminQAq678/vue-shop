var express=require('express');

var app=express()

app.listen(8090,()=>{
	console.log("listen");

}

)
var path=require('path');

app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
});
app.use(express.static(path.join(__dirname,'/')));

