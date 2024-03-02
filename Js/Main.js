let flagSelected = false;
const btnUploadFile = document.getElementById('btnUploadFile');
const btnSaveFile = document.getElementById('btnSaveFile');
const sourceFile = document.getElementById('sourceFile');
const UbicationTag = document.getElementById('UbicationTag');
const bytesToMB = bytes => bytes / (1024 ** 2);
let randomName = () => (parseInt(Math.random() * (999999999999 - 100000000) + 100000000)).toString();
let ubications = [];
const limitCharTag = document.getElementById("limitCharTag");
const txtArea = document.getElementById('txtArea');
const limitChartxt = document.getElementById('limitChartxt');

// document.addEventListener('DOMContentLoaded', function () {
//     if ((localStorage.getItem('ubications'))) {
//         ubications = JSON.parse(localStorage.getItem('ubications'));
//     }
//     limitCharTag.textContent = 0 + "/" + 20;
// });

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

function TmpFile(file_Name, file_type, route_file) {
    this.file_Name = file_Name;
    this.file_type = file_type;
    this.route_file = route_file;
}

//  When a radio button is selected
$("input[name=file]").change(function () {
    if (($(this).val()) === 'txt') {
        $("#formFile").attr("disabled", "");
        btnUploadFile.innerText = 'Siguiente';
    } else {
        $("#formFile").removeAttr("disabled");
        btnUploadFile.innerText = 'Guardar archivo';
    }
});

//Upload File function
btnUploadFile.addEventListener('click', function () {
    //  In the case that the text option is selected, the process will be different of the file process
    if (($('input:radio[name=file]:checked').val()) === 'txt') {
        btnUploadFile.setAttribute('disabled', '');
        btnUploadFile.innerHTML =
            ` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>Cargando...</span>`;
        setTimeout(function () {
            $('#modal').modal('hide');
            $('#secondModal').modal('show');
            btnUploadFile.removeAttribute('disabled');
            btnUploadFile.innerHTML = '';
            btnUploadFile.innerText = 'Subir archivo';
        }, 1500);
        //  It won't have a name, it's a text after all
        paintModal(null, 'txt', null);
        return;
    }
    //  File validation will be done first (file size and extension file)
    if (fileValidation()) {
        var filename = randomName();
        var file_data = $('#formFile').prop('files')[0];
        let file_type = document.querySelector('input[name=file]:checked').value;
        var form_data = new FormData();
        form_data.append("file", file_data);
        form_data.append("filename", filename);
        form_data.append("action", "upload_file");

        $.ajax({
            url: "https://garrapanchar.onrender.com/upload", // Assuming you have an Express route for file upload
            type: "POST",
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            success: function (response) {
                if (response.success) {
                    btnUploadFile.setAttribute('disabled', '');
                    btnUploadFile.innerHTML =
                        ` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Cargando...</span>`;
                    setTimeout(function () {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Archivo subido correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        $('#modal').modal('hide');
                        $('#secondModal').modal('show');
                        btnUploadFile.removeAttribute('disabled');
                        btnUploadFile.innerHTML = '';
                        btnUploadFile.innerText = 'Subir archivo';
                    }, 1500);
                    console.log(response.filename, response.fileType, null)
                    paintModal(response.filename, response.fileType, null,response.fileUrl);

                } else {
                    console.log("Hubo un error en la subida del archivo.");
                }
            }
        });
    }
});

//  Before saving the file, the empty input validation occurs
btnSaveFile.addEventListener('click', function () {
    let text = '';
    let file_name = '', tag = '';
    let file_type = '', route_file = '';
    tag = UbicationTag.value;
    if (tag.length != 0) {
        if (tag.length >= 20) {
            showAlert("La etiqueta debe tener máximo 20 caracteres", "error");
            UbicationTag.focus();
            return;
        }
        //  In the case where the text was selected
        if ($("#txtAreaDiv").css("display") === 'block') {
            text = $("#txtArea").val();
            file_name = randomName();
            file_type = 'txt';
        } else {
            let tmp_file = JSON.parse(localStorage.getItem('ActualFile'));
            localStorage.removeItem('ActualFile');
            file_name = tmp_file.file_Name;
            file_type = tmp_file.file_type;
            route_file = tmp_file.route_file;
        }
      
        tmp_ubication = new Ubication(file_name, tag, file_type,
            latitude, longitude, route_file, text);
            
            var form_data = new FormData();
            form_data.append("file_name", file_name);
            form_data.append("tag", tag);
            form_data.append("file_type", file_type);
            form_data.append("latitude", latitude);
            form_data.append("longitude", longitude);
            form_data.append("route_file", route_file);
            form_data.append("text", text);

            $.ajax({
                url: 'https://garrapanchar.onrender.com/upload_file', 
                type: 'POST',
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                success: function(response) {
                    // Manejar la respuesta del servidor si es necesario
                    console.log('Datos guardados en la base de datos:', response);
                },
                error: function(xhr, status, error) {
                    // Manejar los errores si la solicitud falla
                    console.error('Error al guardar datos en la base de datos:', error);
                }
            });

        console.log(tmp_ubication);
        //  The new location is saved
        ubications.push(tmp_ubication);
        localStorage.setItem('ubications', JSON.stringify(ubications));
        $('#secondModal').modal('hide');
        showAlert('Datos guardados correctamente', 'success');
        // setTimeout(function () { window.location.href = "view.html"; }, 2500);
    }
    else {
        showAlert("Debe ingresar una etiqueta", "error");
        UbicationTag.focus();
    }
});

//  File size and extension file validations
const fileValidation = function () {
    let file_type = document.querySelector('input[name=file]:checked').value;
    var fileInput = document.getElementById('formFile');
    var file_data = $('#formFile').prop('files')[0];
    var filePath = fileInput.value;
    // console.log(bytesToMB(file_data.size));
    let allowedExtensions;
    switch (file_type) {
        case '3DObj':
            allowedExtensions = /(.gltf|.glb)$/i;
            if (!allowedExtensions.exec(filePath)) {
                showAlert('Debes ingresar una extensión válida (.gltf, .glb)', 'error');
                fileInput.value = '';
                return false;
            }
            else if (bytesToMB(file_data.size) > 50) {
                showAlert('El tamaño del archivo rebasa los 50MB, escoge un archivo más pequeño.', 'error');
                fileInput.value = '';
                return false;
            }
            break;
        case 'img':
            allowedExtensions = /(.jpg|.png|.jpeg|.gif)$/i;
            if (!allowedExtensions.exec(filePath)) {
                showAlert('Debes ingresar una extensión válida (.png, .jpg, .jpeg, .gif)', 'error');
                fileInput.value = '';
                return false;
            }
            else if (bytesToMB(file_data.size) > 10) {
                showAlert('El tamaño del archivo rebasa los 10MB, escoge una imagen más pequeña.', 'error');
                fileInput.value = '';
                return false;
            }
            break;
        case 'video':
            allowedExtensions = /(.mp4)$/i;
            if (!allowedExtensions.exec(filePath)) {
                showAlert('Debes ingresar una extensión válida (.mp4)', 'error');
                fileInput.value = '';
                return false;
            }
            else if (bytesToMB(file_data.size) > 25) {
                showAlert('El tamaño del archivo rebasa los 25MB, escoge un video más pequeño.', 'error');
                fileInput.value = '';
                return false;
            }
            break;
    }
    return true;
}

//  Depending of the file type, the second modal will show it.
function paintModal(fileName, file_type, path,fileUrl) {
    let route_file = '';
    let tmp_file;
    //  The modal will be different in the case that a text will be shown
    if (file_type != 'txt') {
        if (flagSelected) {
            flagSelected = false;
            route_file = path;
        } else {
            route_file = fileUrl;
            console.log(route_file);
        }

        tmp_file = new TmpFile(fileName, file_type, route_file);
        localStorage.setItem('ActualFile', JSON.stringify(tmp_file));
        $('#txtAreaDiv').css("display", "none");
        $('#limitChartxt').css("display", "none");
    } else {
        $('#selectedTag').remove();
        $('#sourceFile').remove();
        $('#tagLabel').text("Etiqueta para el texto: ");
        $('#txtAreaDiv').css("display", "block");
        $('#limitChartxt').css("display", "block");
    }
    let file = '';
    switch (file_type) {
        case '3DObj':
            file = `<div id="div3D">
                        <model-viewer src="${route_file}" camera-controls auto-rotate disable-zoom></model-viewer>
                    </div>`;
            document.getElementById('sourceFile').innerHTML = file;
            break;
        case 'img':
            file = `<img src="${route_file}" class="rounded mx-auto d-block" alt="Saved image" id="savedImg" width="150px">`;
            document.getElementById('sourceFile').innerHTML = file;
            break;
        case 'video':
            file = `<div class="ratio ratio-16x9">
                        <video controls>
                        <source src="${route_file}" type="video/mp4">
                        Tu navegador no soporta la etiqueta video.
                        </video>
                    </div>`
            document.getElementById('sourceFile').innerHTML = file;
            break;
    }
   
}

//  To display the list of the server files.
document.getElementById('btnViewFiles').addEventListener('click', function () {
    var folder_name = '../Files';
    var action = 'fetch_files';
    $.ajax({
        url: "./PHP/ServerMethods.php",
        method: "POST",
        data: {
            action: action,
            folder_name: folder_name
        },
        success: function (data) {
            $("#file_list").html(data);
            $("#fileListModal").modal("show");
        }
    })
})

//  In the case that a server file is selected
$(document).on('click', '.select_file', function () {
    var path = $(this).attr("id");
    var file_type = $(this).attr("value");
    flagSelected = true;
    $('#fileListModal').modal('hide');
    btnUploadFile.setAttribute('disabled', '');
    showAlert("Archivo seleccionado", "success");
    btnUploadFile.innerHTML =
        ` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span>Cargando...</span>`;
    setTimeout(function () {
        $('#modal').modal('hide');
        $('#secondModal').modal('show');
        btnUploadFile.removeAttribute('disabled');
        btnUploadFile.innerHTML = '';
        btnUploadFile.innerText = 'Subir archivo';
    }, 1500);
    paintModal('"' + randomName() + '"', file_type, path);
})

//  Limit Character fossr the ubication tag
UbicationTag.addEventListener('input', function () {
    limitChar(UbicationTag, limitCharTag, 20);
});

//  limit Character for the textArea
document.getElementById('txtArea').addEventListener('input', function () {
    limitChar(txtArea, limitChartxt, 200);
})

//  Limit characters of an input
function limitChar(input, result, limit) {
    var textLength = input.value.length;
    result.textContent = textLength + "/" + limit;

    if (textLength > limit) {
        input.style.borderColor = "#ff2851";
        result.style.color = "#ff2851";
    }
    else {
        input.style.borderColor = "#b2b2b2";
        result.style.color = "#737373";
    }
}