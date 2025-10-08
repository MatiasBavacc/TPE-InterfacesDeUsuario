/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("snowmanCanvas");
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext("2d");

// Función para dibujar el muñeco (tu código actual)
function drawSnowman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpiar canvas
    
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"; 
    ctx.fillStyle = "rgba(255, 255, 255, 1)";

    //Cuerpo 
    ctx.beginPath(); 
    ctx.moveTo(200, 200); 
    ctx.arc(200, 200, 50, 0, Math.PI * 2, true); // Círculo cabeza

    ctx.moveTo(200, 300); ctx.arc(200, 300, 75, 0, Math.PI * 2, true); // Círculo cuerpo 
    ctx.moveTo(200, 425); 
    ctx.arc(200, 425, 100, 0, Math.PI * 2, true); // Círculo base 
    ctx.fill(); ctx.closePath();

    //Cara 
    ctx.beginPath(); 
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; 
    ctx.moveTo(172, 185); // esquina exterior (izquierda) 
    ctx.lineTo(185, 190); // punta interior (centro del rostro) 
    ctx.lineTo(172, 195); // esquina inferior izquierda 
    ctx.closePath(); 
    ctx.fill(); // Ojo derecho (triángulo) 

    ctx.beginPath(); 
    ctx.moveTo(228, 185); // esquina exterior (derecha) 
    ctx.lineTo(215, 190); // punta interior (centro del rostro) 
    ctx.lineTo(228, 195); // esquina inferior derecha 
    ctx.fill(); 

    ctx.moveTo(200, 210); 
    ctx.arc(200, 210, 10, 0, Math.PI, false); // Boca 
    ctx.closePath(); 
    ctx.fill(); 

    //Brazos 
    ctx.strokeStyle = "rgba(71, 55, 19, 1)"; 
    ctx.beginPath(); 
    ctx.moveTo(160, 250); 
    ctx.lineTo(240, 250); // Brazos 
    ctx.closePath(); 

    ctx.beginPath(); 
    ctx.moveTo(160, 250); 
    ctx.lineTo(130, 220); // Brazo izquierdo 
    ctx.closePath();
    ctx.stroke(); 

    ctx.beginPath(); 
    ctx.moveTo(240, 250); 
    ctx.lineTo(270, 220); // Brazo derecho 
    ctx.closePath(); 
    ctx.stroke(); 

    //Botones 
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; 
    ctx.beginPath(); 
    ctx.moveTo(200, 260); 
    ctx.arc(200, 260, 7, 0, Math.PI * 2, true); // Botón 1 

    ctx.moveTo(200, 300); 
    ctx.arc(200, 300, 7, 0, Math.PI * 2, true); // Botón 2 

    ctx.moveTo(200, 340); 
    ctx.arc(200, 340, 7, 0, Math.PI * 2, true); // Botón 3 
    ctx.closePath(); 

    ctx.fill();
}

// Cargar y dibujar imágenes (gorro y zanahoria)
const peluca = new Image();
peluca.src = "image/gorrito.png"; // ruta de tu imagen del gorro

const zanahoria = new Image();
zanahoria.src = "image/zanahoria.png"; // ruta de tu imagen de la nariz

// Esperar a que las imágenes carguen antes de dibujar
peluca.onload = zanahoria.onload = () => {
    drawSnowman();

    // Dibujar gorro
    ctx.drawImage(peluca, 150, 100, 100, 70); 
    // (x, y, width, height) ajusta según necesites

    // Dibujar nariz (zanahoria)
    ctx.drawImage(zanahoria, 190, 185, 50, 30); 
    // (x, y, width, height) ajusta según necesites
};
