// ======= Formulaire contact =======
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if(form){
        form.addEventListener('submit', function(e){
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            const formMessage = document.getElementById('formMessage');

            if(name && email && message){
                formMessage.innerHTML = '<div class="alert alert-success">Merci pour votre message !</div>';
                form.reset();
            } else {
                formMessage.innerHTML = '<div class="alert alert-danger">Veuillez remplir tous les champs.</div>';
            }
        });
    }
});
