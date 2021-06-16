


const canvas = document.getElementById('the-canvas')
const ctx = canvas.getContext("2d")

//Instanciar a img
const img = new Image(); 
img.src = './images/pista.jpg' 

// // Redenrizar a img
// img.addEventListener ("load", () => {
// 	ctx.drawImage(img)// últimos 2 parâmetros (opcionais) são o tamanho da img.
// });

// img.onload = () => {
// 	ctx.drawImage(img, 0, 200, 90, 50)
// });

window.addEventListener("load", () => {
    
    let roadY = 0;

	ctx.drawImage(img, 0, roadY, 500, 500) 
	console.log(canvas)
	console.log(ctx)
})




