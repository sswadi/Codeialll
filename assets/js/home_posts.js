{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: '/createPost',
                data: newPostForm.serialize(), //converts the form  data into json
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($('.delete-post-button', newPost));

                    //----5th July'23----

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                    //------
                }, 
                error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    //method to create a post in DOM
    let newPostDom = function(post){
        // CHANGE :: show the count of zero likes on this post
        return $(`<li id="post-${post._id}">
        <p>
                <small>
                    <a class="delete-post-button" href="/destroy/${ post._id }">X</a>
                </small>
            
            POST:  ${ post.content }
            <br>
            <small>
                NAME: ${ post.user.name }
            </small>

            // CHANGE:: Whenever we add/create a new post, it should show 0 likess

            <small>
                            
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                    0 Likes
                </a>
        
            </small>

            // ::
        </p>
       <div class="post-comments">
            
                <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
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


    //method to delete a post from DOM
    let deletePost = function(deleteLink){

        $(deleteLink).click(function(e){
            e.preventDefault();
        
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    // july 5th
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    //-----
                }, 
                error: function(error){
                    console.log(error.responseText);
                }
            })
        });

    }


    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}

