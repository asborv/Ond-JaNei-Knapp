// category HTML-element

let jaKnapp = document.getElementById("jaKnapp");
const neiKnapp = document.getElementById("neiKnapp");



// category funksjonar

function flyttElementTilfeldig(e, element) {

    // Set høgaste moglege x- og y-verdiar for element
    const xMax = window.innerWidth - element.getBoundingClientRect().width;
    const yMax = window.innerHeight - element.getBoundingClientRect().height;

    // Finn tilfeldige koordinatar for element innan det gyldige området
    const x = Math.floor(Math.random() * xMax);
    const y = Math.floor(Math.random() * yMax);

    // Kopier element
    jaKnapp = element.cloneNode(true);

    // Set position og koordinater
    jaKnapp.style.position = "absolute";
    jaKnapp.style.left = `${x}px`;
    jaKnapp.style.top = `${y}px`;

    // Legg det nye elementet til i dokumentet
    document.body.appendChild(jaKnapp);

    // Dersom gamalt element ikkje er i main-elementet, slett det.
    if (!element.closest("main")) return element.remove();

    // Element i main-elementet må vere der for å halde ved strukturen
    element.style.visibility = "hidden";
    element.removeAttribute("id");
}

function vurderAvstand(e, element = jaKnapp, maalDiff = 150) {

    // Finn posisjonen til musepeikaren
    // link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const musX = e.clientX;
    const musY = e.clientY;

    // Finn nærmaste hjørne til musepeikaren
    // link https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
    const elementPos = element.getBoundingClientRect();

    const elementXRef = elementPos.x - musX < -elementPos.width / 2
        ? elementPos.x + elementPos.width
        : elementPos.x;
        
    const elementYRef = elementPos.y - musY < -elementPos.height / 2
        ? elementPos.y + elementPos.height
        : elementPos.y;
    
    
        // Brukar Pythagoras for å finne avstand mellom musepeikar og element
    const diff = Math.sqrt((musX - elementXRef) ** 2 + (musY - elementYRef) ** 2);
    if (diff < maalDiff) {
        flyttElementTilfeldig(e, element);
    }
}



// category event listeners

document.body.addEventListener("mousemove", vurderAvstand);