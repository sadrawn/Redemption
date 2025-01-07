const amaliyat = '433+22+449+65+445+446+433+439+438+65+445+436+21+453+22+65+437+445+20+445+21+453+81';
let res = amaliyat.split('+');
let as = '';
for (let i = 0; i < res.length; i++) {
    as += String.fromCharCode(res[i]);
}
console.log(as);