
// Sert à modifier la taille d'un input en fonction de son contenu.
resizeInput = (event) => {
    if($(event.target).val().length != 0) {
        $(event.target).attr('size', $(event.target).val().length)
    } else {
        $(event.target).attr('size', 4)
    }   
}
$('body').on("input", ".tag", (event) => {
    resizeInput(event)
})

$(document).ready(function() {
    $(":input").val("")
});

// Ajoute une entrée type abonnement
$(".add-subscription-button").on("click", () => {
    
    let t = $($(".keyword-container").clone().eq(0))
    t.insertBefore(".add-subscription-button");
    let wtf = $('.container-add-subscriptions');
    let height = wtf[0].scrollHeight;
    wtf.scrollTop(height);
})