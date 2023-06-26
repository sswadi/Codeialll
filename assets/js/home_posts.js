{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/createPost',
                data: newPostForm.serialize(), //converts the form  data into json
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                }, 
                error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    //method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
                <small>
                    <a class="delete-post-button" href="/destroy/${ post.id }">X</a>
                </small>
            
            POST:  ${ post.content }
            <br>
            <small>
                NAME: ${ post.user.name }
            </small>
        </p>
       <div class="post-comments">
            
                <form action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Type here to add comment..." required>
                     <input type="hidden" name="post" value="${ post._id }">
                    <input type="submit" value="Add Comment">
                </form>
            
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                    
                </ul>
            </div>
        </div>
    </li>`);
    }

    createPost();
}
