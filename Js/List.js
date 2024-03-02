let ubications = [];
const cards = document.getElementById('cards');
const fragment = document.createDocumentFragment();
const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;

// Ubication object
function Ubication(id, tag, file_type, latitude, longitude, route_file, text) {
    this.id = id;
    this.tag = tag;
    this.file_type = file_type;
    this.latitude = latitude;
    this.longitude = longitude;
    this.route_file = route_file;
    this.text = text;
}
const loadUbicationsFromServer = async () => {
    try {
      const response = await fetch('https://garrapanchar.onrender.com/ubications');
      if (!response.ok) {
        throw new Error('Error al obtener la lista de ubicaciones');
      }
      const data = await response.json();
      ubications = data;
      paintCards();
    } catch (error) {
      console.error(error);
      showAlert("Error al obtener la lista de ubicaciones", "error");
    }
  };
  
 
  document.addEventListener('DOMContentLoaded', () => {
    loadUbicationsFromServer();
  });

const paintCards = function(){
    var file;
    Object.values(ubications).forEach(ubication => {
        //  So the text can't be displayed on the next cards
        var text = templateCard.querySelector('.card-text');
        if(templateCard.contains(text)){
            templateCard.querySelector('.card-body').removeChild(text);
        }
        templateCard.querySelector('h3').textContent = "Etiqueta: " + ubication.tag;
        templateCard.querySelector('h5').textContent = "Tipo: " + ubication.tipo;
        templateCard.getElementById('latitude').textContent = "Latitud: " + ubication.latitud;
        templateCard.getElementById('longitude').textContent = "Longitude: " + ubication.longitud;
        templateCard.querySelector('.btn-danger').dataset.id = ubication.url;
        var file_type = ubication.tipo;
        switch(file_type){
            case '3DObj':
                file = `<div id="div3D" class="card-img-top">
                            <model-viewer src="${ubication.url}" camera-controls auto-rotate disable-zoom></model-viewer>
                        </div>`;
                break;
            case 'img':
                file = `<img src="${ubication.url}" class="rounded mx-auto d-block card-img-top" alt="Saved image" id="savedImg" width="150px">`;
                break;
            case 'video':
                file = `<div class="ratio ratio-16x9 card-img-top">
                            <video controls>
                            <source src="${ubication.url}" type="video/mp4">
                            Tu navegador no soporta la etiqueta video.
                            </video>
                        </div>`
                break;
            case 'txt':
                newDiv = document.createElement("p");
                newDiv.setAttribute("class", "card-text");
                newDiv.innerHTML = ubication.text;
                var parent = templateCard.querySelector('.card-body');
                parent.insertBefore(newDiv, templateCard.querySelector('h5'));
                file = '';
                break;
        }
        if(file_type != 'txt'){
            templateCard.getElementById('file_view').innerHTML = file;

        }else{
            templateCard.getElementById('file_view').innerHTML = '';
        }

        
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);
}