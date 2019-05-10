function calcTip (){
    var subtotal = document.getElementById('subtotal').value;
	let tip = document.getElementById('tip').value;
    let totalElem = document.getElementById('total');
    let total = 0;
	if(subtotal && tip) {
        subtotal = parseFloat(subtotal)
        total = subtotal + subtotal*parseFloat(tip)/100;
    }
	totalElem.innerHTML = '$' + total;
}