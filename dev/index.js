/**
 * Méthodes utiles.
 */

/**
 * Ajoute un caractère au début de l'entrée d'un textinput.
 * @param  {Event} event l'évènement utilisateur ayant modifié le textinput.
 * @param  {string} char les caractères que l'on souhaite ajouter au début de l'entrée.
 */
addCharToTheBegin = (event, char) => {

    if (event.keyCode === 32 && event.target.value.length) {
        event.preventDefault();

        var elem = event.target,
            val = elem.value;

        if (val.slice(-1) !== char) {
            elem.value += ' '+char;
        }
    } else if (!event.target.value.length) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
        event.target.value = char;
    }
}

/**
 * Modifie la taille d'un textinput en fonction de la taille de son entrée.
 * @param  {Event} event l'évènement utilisateur ayant modifié le textinput.
 * @param  {number} defaultSize la taille par défaut du textinput (utlie quand la taille de l'entrée vaut 0).
 */
resizeInput = (event, defaultSize) => {
   
    if($(event.target).val().length != 1) {

        $(event.target).attr('size', $(event.target).val().length+1) // modifie la taille de l'input en fonction de la valeur courante
    } else {
        $(event.target).attr('size', defaultSize+1)
    }
}

// Retourne le code HTML d'un tag vide.
/**
 * Retourne l'html d'un tag vide de notre application.
 */
generateTag = () => {
    return $("#template-tag").clone().html()
}

/**
 * Génère le code HTML d'une publication
 * @pseudo {string} Le pseudo
 * @date {string} La date
 * @content {string} Le contenu
 * @tags {Array} Tableau de string contenent les tags de la publication
 */

 
/**
 * Retourne l'html d'une publication vide de notre application.
 * @param  {number} id l'id unique de la publication
 * @param  {string} pseudo le pseudo de l'émetteur de la publication (le @).
 * @param  {string} date la date d'émission de la publication.
 * @param  {string} content le contenu de la publication.
 * @param  {string} tags les tags de la publication (les #).
 */
generatePublication = (id, pseudo, date, content, tags) => {

    let p = $($("#template-publication").clone().html())
    $(p).find(".publication-pseudo").html(pseudo)
    $(p).find(".publication-date").html(date)
    $(p).find(".publication-content").html(content)
    $(p).find(".publication-id").html(id)
    for(t of tags) {
        $(p).find(".publication-tag").append($(`<a>${t} </a>`))
    }
    return p
}

/**
 * Début des handlers.
 * Chaque évènement utilisateur est listé ci-après.
 */

// modification du pseudo
$('body').on("keydown", ".pseudo", (event) => {
    addCharToTheBegin(event, "@")
    localStorage.setItem("pseudo", $(".pseudo").val())
})

// modification d'un tag du message
$('body').on("keydown", ".tag", (event) => {
    addCharToTheBegin(event, "#")
    resizeInput(event, 8)
})

// modification du textarea du message
$('body').on("keydown", "#publish-message", (event) => {
    // Rien à faire pour le moment
})

// modification du textarea des abonnements
$('body').on("input", "#subscriptions-textarea", (event) => {
    
    let val = $("#subscriptions-textarea").val()
    let subcriptionsArray = val.split(" ").filter(w => w.match(/^[#@]/))

    localStorage.setItem("subscriptions", val)
})

// bouton d'ajout de tag au message
$(".add-subscription-button").on("click", () => {
    
    let t = $('<input class="tag" type="text" minlength="3" maxlength="16" size="8" placeholder="#etiquette">')
    t.insertBefore(".add-subscription-button");
    let wtf = $('.container-add-subscriptions');
    let height = wtf[0].scrollHeight;
    wtf.scrollTop(height);
})

// bouton d'accueil du menu gauche
$("#button-home").on("click", () => {

    if(!$(".container-publish").is(":visible")) {
        $(".container-publish").show("slow")
        if($(".container-parameters").is(":visible")) {
            $(".container-parameters").hide("fast", () => {
                $(".container-timeline").show("fast")
            })
        }

        // Supprime les éléments du container présents
        $(".container-timeline").empty()

        // Peuple la timeline de l'utilisateur
        let timelineString = localStorage.getItem("timeline")
        if(timelineString) {
            let timeline = JSON.parse(timelineString)
            for(p of timeline) {

                // console.log(p)
                $(".container-timeline").append(generatePublication(p.id, p.pseudo, p.date, p.content, p.tags))
            }
        } else {
            console.log("No timeline found in Web Storage.")
        }
    }
})

// bouton publications du menu gauche
$("#button-publications").on("click", () => {


    $(".container-publish").hide("slow")

    if($(".container-parameters").is(":visible")) {

        $(".container-parameters").hide("fast", () => {
            $(".container-timeline").show("fast")
        })
    }

    // Supprime les éléments du container présents
    $(".container-timeline").empty()

    // Peuple les publications  de l'utilisateur
    let publicationsString = localStorage.getItem("publications")
    if(publicationsString) {
        let publications = JSON.parse(publicationsString)
        for(p of publications) {

            // console.log(p)
            $(".container-timeline").append(generatePublication(p.id, p.pseudo, p.date, p.content, p.tags))
        }
    } else {
        console.log("No publications found in Web Storage.")
    }
})

// bouton paramètres du menu gauche
$("#button-settings").on("click", () => {
    if($(".container-timeline").is(":visible")) {
        $(".container-publish").hide("fast", () => {
            $(".container-timeline").hide("fast", () => {
                $(".container-parameters").show("fast")
            })
        })
    }
})

// boutton "attach" du message
$("#attach-file").on("change", (e) => {

    let file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      // Display file content
      console.log(contents)
    };
    reader.readAsText(file);
})

// bouton "publier" du message
$("#button-publish").on("click", () => {
    alert("todo")
})

// bouton supprimer la publication
$('body').on("click", ".delete-publication-button", (event) => {
    
    // Supprime la publication du Web Storage
    if (typeof(Storage) !== "undefined") {

        // Cas où l'utilisateur est dans sa timeline
        if($(".container-publish").is(":visible")) {

            // Retrouve la timeline
            let timelineString = localStorage.getItem("timeline")
            if(timelineString) {

                let timelineOld = JSON.parse(timelineString)
                // console.log(timelineOld)
                let timelineNew = []
                for(p of timelineOld) {
                    if(p.id != $(event.target).closest(".publication").find(".publication-id").html()) {
                        timelineNew.push(p)
                    }
                }
                // console.log(timelineNew)

                // Sauvegarde la nouvelle timeline dans le Web Storage
                localStorage.setItem("timeline", JSON.stringify(timelineNew))
            } else {
                console.log("No timeline found in Web Storage.")
            }
        }       
        // Cas où l'utilisateur est dans ses publications
        else {

            // Retrouve les publications
            let publicationsString = localStorage.getItem("publications")
            if(publicationsString) {

                let publicationsOld = JSON.parse(publicationsString)
                // console.log(publicationsOld)
                let publicationsNew = []
                for(p of publicationsOld) {
                    if(p.id != $(event.target).closest(".publication").find(".publication-id").html()) {
                        publicationsNew.push(p)
                    }
                }
                // console.log(publicationsNew)

                // Sauvegarde la nouvelle timeline dans le Web Storage
                localStorage.setItem("publications", JSON.stringify(publicationsNew))
            } else {
                console.log("No publications found in Web Storage.")
            }
        }

        
    } else {
        console.log("Web Storage is not supported.")
    }

    // Supprime graphiquement
    $(event.target).closest(".publication").hide("slow", () => {
        $(event.target).closest(".publication").remove()
    })
})

// bouton modifier le pseudo
$("#button-modify-pseudo").on("click", () => {

    if($(".pseudo").prop( "disabled") == true) {
        
        $(".pseudo").prop( "disabled", false)
        $(".pseudo").css("color", "white")
        $(".pseudo").focus()
        $("#icon-modify-pseudo-button").removeClass()
        $("#icon-modify-pseudo-button").addClass("fa fa-check")
    }
    else {

        // sauvegarde le nouveau pseudo
        localStorage.setItem("pseudo",  $(".pseudo").val())

        $(".pseudo").prop( "disabled", true)
        $(".pseudo").css("color", "grey")
        $("#icon-modify-pseudo-button").removeClass()
        $("#icon-modify-pseudo-button").addClass("fa fa-cog")
    }
})

/**
 * Mise en place de la session, surtout via le Web Storage du navigateur si possible.
 */

$(document).ready(function() {

    // Test : génère des publications factices dans la timeline
    /*
    let timeline = []
    timeline.push({
        id: "pub1001",
        pseudo: "louis",
        date: "29/02/2020",
        content: "Contenu d'une publication",
        tags: ["#tests", "ubs"]
    })
    timeline.push({
        id: "pub1002",
        pseudo: "louis",
        date: "29/03/2020",
        content: "Test publication",
        tags: ["#tests", "ubs", "autre"]
    })
    localStorage.setItem("timeline", JSON.stringify(timeline))
    */
   
    // Test : génère des publications factices dans les publications de l'utilisateurs
    /*
    let publications = []
    publications.push({
        id: "pub1003",
        pseudo: "ford",
        date: "29/02/2020",
        content: "Ford publie 1",
        tags: ["#ford", "#ubs"]
    })
    publications.push({
        id: "pub1004",
        pseudo: "ford",
        date: "29/03/2020",
        content: "Ford publie 2",
        tags: ["#tests", "#ubs", "#chat"]
    })
    localStorage.setItem("publications", JSON.stringify(publications))
    */


    // On met un exemple de tag
    $(".keyword-container").append(generateTag())

    // Vérifie que le Web Storage est accessible
    if (typeof(Storage) !== "undefined") {
        
        // Retrouve le pseudo
        let pseudo = localStorage.getItem("pseudo")
        if(pseudo) {
            // console.log("Pseudo : " + pseudo)
            $(".pseudo").val(pseudo)
        } else {
            $(".pseudo").val("@anonyme")
        }

        // Retrouve la timeline
        let timelineString = localStorage.getItem("timeline")
        if(timelineString) {
            let timeline = JSON.parse(timelineString)
            for(p of timeline) {

                // console.log(p)
                $(".container-timeline").append(generatePublication(p.id, p.pseudo, p.date, p.content, p.tags))
            }
        } else {
            console.log("No timeline found in Web Storage.")
        }

        // Retrouve les abonnements
        let subscriptionsString = localStorage.getItem("subscriptions")
        if(subscriptionsString) {
            $("#subscriptions-textarea").val(subscriptionsString)
        } else {
            console.log("No subscriptions found in Web Storage.")
        }
    } else {
        console.log("Web Storage is not supported.")
    }
});