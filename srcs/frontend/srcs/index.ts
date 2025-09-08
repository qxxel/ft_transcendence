// function greeter(person) {
//   return "Hello, " + person;
// }
 
// let user = "Jane User";
 
// document.body.textContent = greeter(user);

console.log("Le front tourne !");

const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
if (ctx) {
  ctx.fillStyle = "blue";
  ctx.fillRect(50, 50, 100, 100);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(200, 200, 50, 0, Math.PI * 2);
  ctx.fill();
}