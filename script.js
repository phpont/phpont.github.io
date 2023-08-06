// JavaScript
var texts = [
    { id: 'typed-text-header', text: 'Seja Bem Vindo' },
    { id: 'typed-text-experiences', text: 'Experiências' },
    { id: 'typed-text-skills', text: 'Habilidades' },
    { id: 'typed-text-contact', text: 'Contato' }
  ];
  var i = 0;
  
  function typeWriter() {
    if (i < texts.length) {
      var j = 0;
      var currentText = texts[i];
  
      function typeCharacter() {
        if (j < currentText.text.length) {
          document.getElementById(currentText.id).innerHTML += currentText.text.charAt(j);
          j++;
          setTimeout(typeCharacter, 100);
        } else {
          i++;
          typeWriter();
        }
      }
  
      typeCharacter();
    }
  }
  
  window.onload = typeWriter;


var sections = document.querySelectorAll('header, .experiences, .skills, .contact');


sections.forEach(function(section) {
  section.addEventListener('click', function() {
    section.scrollIntoView({ behavior: 'smooth' });
  });
});


