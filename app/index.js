import "./styles/normalize.css";
import "./styles/style.css";
import portraits from './images/portraits.png';

function component() {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = "Hello webpack";
  // Add the image to our existing div.
  var myIcon = new Image();
  myIcon.src = portraits;
  console.log(Crafty.getVersion())

  element.appendChild(myIcon);
  return element;
}

document.body.appendChild(component());
