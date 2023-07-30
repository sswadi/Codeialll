// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;  //this.toggler is used to represent the specific DOM element associated with the class instance
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click((e) => { //$(this.toggler) creates a jQuery object that allows us to attach the click event handler to that element
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            // This block of code uses jQuery's ajax method to send an HTTP POST request to the URL specified in the href attribute of this.toggler. 
            // The done function is a callback that will be executed when the AJAX request is successful. 
            // Inside the done callback, the data parameter represents the response data from the server.
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }

                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            
        });
    }
}
