// category HTML-element

let jaKnapp = document.getElementById("jaKnapp");
const neiKnapp = document.getElementById("neiKnapp");
const onsdskapTypeValg = document.getElementById("ondskapType");



// category funksjonar

function flyttElementTilfeldig(e, element) {

    // Fjernar fokus frå jaKnapp dersom fokusert
    if (document.activeElement === element) element.blur();
    
    // Set høgaste moglege x- og y-verdiar for element
    // link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const xMax = window.innerWidth - element.getBoundingClientRect().width;
    const yMax = window.innerHeight - element.getBoundingClientRect().height;

    // Finn tilfeldige koordinatar for element innan det gyldige området
    const x = Math.floor(Math.random() * xMax);
    const y = Math.floor(Math.random() * yMax);

    // ? Kopier element berre dersom under <main>? elles berre endre style?
    if (element.closest("main")) {
        // Kopier element
        jaKnapp = element.cloneNode(true);

        // Legg det nye elementet til i dokumentet og set position
        document.body.appendChild(jaKnapp);
        jaKnapp.style.position = "absolute";
        
        // Element i main-elementet må vere der for å halde ved strukturen
        element.style.visibility = "hidden";
        element.removeAttribute("id");
    }

    // Set nye koordinater
    jaKnapp.style.left = `${x}px`;
    jaKnapp.style.top = `${y}px`;
}

function vurderAvstand(e, element) {

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

    return diff;
}

function sorterDist(e, ...elementArr) {
    
    // Lagar objekt med avstand frå musepeikar til kvart element i elementArr
    distArr = elementArr.map(element => {
        return {
            element: element,
            dist: vurderAvstand(e, element, reaksjonsFunksjon = null)
        }
    });

    // Sorterer distArr
    distArr.sort((a, b) => a.dist - b.dist);

    return distArr;
}

function skiftMetode(e, element = document.body, hendelseArr = [vurderFlyttKnapp, byttKnapper]) {

    // Hentar den nye metoden frå <select>
    const nyMetode = e.target.value;
    
    // Finn riktig hendele basert på nyMetode
    // Må alltid stemme med element i hendelseArr
    let nyHendelse;
    switch (nyMetode) {
        case "flytt":
            // Set tilbake teksten på knappane
            jaKnapp.innerHTML = "Ja!";
            neiKnapp.innerHTML  = "Nei";
            nyHendelse = vurderFlyttKnapp // ? endre funksjonsstruktur?
            break;
        case "bytt":
            nyHendelse = byttKnapper
            break;
        default:
            throw new Error("Denne ondskapen finst ikkje!");
    }

    // Fjernar alle noverane hendelsar
    hendelseArr.forEach(hendelse => element.removeEventListener("mousemove", hendelse));
    // Legg til riktig hendelse
    element.addEventListener("mousemove", nyHendelse);
}

function byttKnapper(e) {
    
    // Set neiKnapp til knappen nærmast musepeikaren, jaKnapp motsett
    const [nyNeiKnapp, nyJaKnapp] = sorterDist(e, jaKnapp, neiKnapp);
    
    // Set riktig tekst på knappane
    nyNeiKnapp.element.innerHTML = "Nei";
    nyJaKnapp.element.innerHTML = "Ja!";

    // Ordnar med fokus via tastatur
    jaKnapp.addEventListener("focus", e => jaKnapp.innerHTML = "Nei");
    jaKnapp.addEventListener("focusout", e => jaKnapp.innerHTML = "Ja!");
    neiKnapp.addEventListener("focus", e => neiKnapp.innerHTML = "Nei");
    neiKnapp.addEventListener("focusout", e => neiKnapp.innerHTML = "Ja!");
}

function vurderFlyttKnapp(e, element = jaKnapp, maalDiff = 150, reaksjonsFunksjon = flyttElementTilfeldig) {
    
    const diff = vurderAvstand(e, element);
    
    // Forsøker berre å køyre dersom reaksjonsFunksjon er definert
    if (diff < maalDiff && reaksjonsFunksjon) {
        reaksjonsFunksjon(e, element);
    }
}



// category event listeners

document.body.addEventListener("mousemove", vurderFlyttKnapp);
onsdskapTypeValg.addEventListener("change", skiftMetode);