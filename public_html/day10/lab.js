function cbChange(e) {
    console.log(e.checked);
    const c = e.checked;
    const fw = c?'bold':'';
    const color = c?'green':'';
    const td = c?'underline':'';
    let text = document.getElementById('text');
    text.style.fontWeight = fw;
    text.style.color = color;
    text.style.textDecoration = td;
}
function btClick() {
    let text = document.getElementById('text');
    let fs = window.getComputedStyle(text, null).getPropertyValue('font-size');
    setInterval(function () {
        fs = parseInt(fs) + 2;
        text.style.fontSize = fs + 'px';
    }, 500);
}