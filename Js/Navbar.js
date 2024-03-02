let latitude, longitude;
//  For menu icon
(() => {
    'use strict'
    document.querySelector('#navbarSideCollapse').addEventListener('click', () => {
        document.querySelector('.offcanvas-collapse').classList.toggle('open');
        document.getElementById('navbar').classList.toggle('open');
        document.getElementById('menu-icon').classList.toggle('toggle');
        var menuIcon = document.getElementById('menu-icon');
        if(menuIcon.classList.contains('toggle')){
            menuIcon.src="Assets/menu-icon.png";
        }
        else{
            menuIcon.src = "Assets/x-lg.svg";
        }
    })
})()

//  Displaying user real-time position 
document.addEventListener('DOMContentLoaded', function() {
    if(!document.getElementById('ubiPage').classList.contains('active')){
        navigator.geolocation.watchPosition((position) => {
            document.getElementById('latitude').innerHTML = `Latitud: ` + position.coords.latitude.toFixed(7);
            document.getElementById('longitude').innerHTML = `Longitud: ` + position.coords.longitude.toFixed(7);
            latitude = position.coords.latitude.toFixed(7);
            longitude =  position.coords.longitude.toFixed(7);
        });
    }
});

//  Depending of the status, a different message will be shown
function showAlert(message, status){
    if(status.toLowerCase() == 'error'){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500
        })
        Toast.fire({
            icon: 'warning',
            title: message
        })
    }
    else if(status.toLowerCase() == 'success'){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
    
        Toast.fire({
            icon: 'success',
            title: message
        })
    }
}