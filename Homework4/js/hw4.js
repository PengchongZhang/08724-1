$(function() {
    $(document).ready(function() {
        $.getJSON("http://csw08724.appspot.com/breeds.ajax", function(data){
            $.each(data, function(index, eachObject){
                $("<option></option>", {
                    "id": eachObject.id,
                    "value": eachObject.id,
                    text: eachObject.name
                }).appendTo("#select");
            });

            loadSection(1);
            $("#select").on("change", function(event) {
                loadSection(event.target.value);
            });

        });

    });
    function loadSection(id) {
        $.getJSON("http://csw08724.appspot.com/breed.ajax",{"id": id})
            .done(function(data){
            $("#breed-name").text(data.name);
            $("#description").text(data.description);
            $("#origins").text(data.origins);
            $("#rightForYou").text(data.rightForYou);
            $(".content_right").empty();
            var rootUrl = "http://csw08724.appspot.com/";
            $("<img>",{
                "src": rootUrl + data.imageUrl
            }).appendTo($(".content_right"));
            $.each(data.extraImageUrls, function(index, eachObject) {
               $("<img>",{
                "src": rootUrl + eachObject
            }).appendTo($(".content_right")); 
        });
        var i=0;
        var root = document.querySelector('.content_right');
        var els = root.querySelectorAll(':not(:first-child)');
        for (i=0; i < els.length; i++) {
            els[i].classList.add('is-hidden');
        }
        root.addEventListener('transitionend', function() {
            root.insertBefore(root.querySelector(':first-child.is-hidden'), null);
        });
        setInterval(function() {
            root.querySelector(':first-child').classList.add('is-hidden');
            root.querySelector(':nth-child(2)').classList.remove('is-hidden');
            }, 6000)
        });
    }
});


