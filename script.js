const text = "Paulo Henrique Pontarolo"; // O texto que você quer que apareça
let index = 0;

function type() {
  const mainTitle = document.getElementById("main-title");
  mainTitle.innerHTML = text.slice(0, index);

  if (index < text.length) {
    index++;
  } else {
    document.querySelector('header').classList.add('active'); // Ativa o subtítulo
    return;
  }

  setTimeout(type, 45); // Velocidade de digitação
}

window.addEventListener('load', () => {
  type();
});
