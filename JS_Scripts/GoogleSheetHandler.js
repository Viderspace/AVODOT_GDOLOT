

// const scriptURL ="https://script.google.com/macros/s/AKfycbzAGUPKG8DAwFM03Hpa2AoHOLOylwfrI4S1APy5mQLDGcEkk095C_Y_nccoWDT7vEiOtA/exec";

const scriptURL="https://script.google.com/macros/s/AKfycbxtqC2B8SBCjzdex10KgHUf_sy_jjqmgu7I5bSQdi0MGktZ3EgVXN3p6OJDqsTADwPhUQ/exec";

const form = document.forms['contact-form']


form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST',
        body:  new FormData(form)})
        .then(response => alert("ההרשמה התקבלה בהצלחה"))
        .then(() => { window.location.reload(); })
        .catch(error => console.error('Error!', error.message))
})
