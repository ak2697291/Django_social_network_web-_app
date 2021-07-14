document.addEventListener('DOMContentLoaded', function(){
   
    document.querySelector("#profile").style.display = "none";
    document.querySelector("#following-section").style.display = "none";
    document.querySelector("#paginationuser-post").style.display = "none";
    document.querySelector("#paginationfollow-post").style.display = "none";
    
        
 window.onload = function(){
     
document.querySelector('#add_post').onsubmit = function(){
    
    console.log(document.querySelector('#post_body').value);
    console.log(document.querySelector('#username').value);
fetch('/newpost' , {
    method: 'POST',
    body: JSON.stringify({
    post_body: document.querySelector('#post_body').value
    
    })
})
.then(response => response.json())
.then(result => {
    console.log(result);
})


}}
var section = "allposts";

function posts(page_no,section,postUser){
fetch('/allposts',{method:'POST',body: JSON.stringify({page_no:page_no,section:section,postUser:postUser})})
.then(response => response.json())
.then(posts =>{
    console.log(posts);
    if(posts){
        posts.forEach(element => {
            console.log(element);
            const item = document.createElement('div');
            var item1="",item2="",item3="",item4="",item5="";
            var date = new Date(element.timestamp);
            date = date.toUTCString();
            item1 = `<h5 class = "users" style="cursor:pointer;">${element.user}</h5>`;
            item2 = `<div class = "Edit" style="color:#1380FF; cursor:pointer;" id = edit${element.post_id}>Edit</div>`;
            item3 = `<div>${element.post_data}</div><div>${date}</div>`;
            
        
            let result = [];
          
             fetch('/check_like_post' , {
                    method: 'PUT',
                    body: JSON.stringify({
                    post_id: element.post_id,
                    username: element.user
                    
                    })
                })
                .then(response => response.json())
                .then(data => {
                           result.push(data[0]);
                           
                                 })
              
               
            
                setTimeout(function(){
                    console.log(result);
                
                 

                
                if(result[0]=="True")
                {
                    item4 = `<div id="${element.post_id}" class="like" data-like = ${element.like_count}><i  class="fa fa-heart" style="color:red;cursor:pointer;"> ${element.like_count}</i></div>`;
                    

                }
                else if(result[0]=="False"){
                    
                    item4 = `<div id="${element.post_id}"  class="like" data-like = ${element.like_count}><i class="fa fa-heart-o" style="color:red;cursor:pointer;" > ${element.like_count} </i>  </div>`;
                  
                }
                else{
                    item4 = `<div>we got an error here</div>`
                    
                }
                item5 = `<div>comment</div>` 
            
                    item.innerHTML = `<div class="post" id=post${element.post_id} style="border: 1px solid #CED4DA; margin-left:100px;margin-right:100px; margin-bottom:20px; padding:20px;border-radius:20px;;">`+item1+item2+item3+item4+item5+`</div>`;
                     document.querySelector(`#${section}`).append(item);
                      
                     
                
            }, 500);

          

            
        });




                 setTimeout(function(){
                 var edits = document.querySelectorAll('.Edit');
                 console.log(edits);
                 edits.forEach(element =>{
                      element.onclick = function(){
                          const postId = element.parentElement.id;
                          
                          const mainelement = document.createElement('div');
                           mainelement.innerHTML = document.querySelector(`#${postId}`).innerHTML;
                         
                          console.log(mainelement);
                          const creator = mainelement.childNodes[0].innerHTML;
                          const postData = mainelement.childNodes[2].innerHTML;
                          const actual_post_id=mainelement.childNodes[4].id;
                          console.log(actual_post_id);
                          console.log(postData);

                          if(creator == document.querySelector("#username").value)
                          {
                              var editPost = document.createElement('div');
                              document.querySelector(`#${postId}`).innerHTML = "";
                              editPost.innerHTML = `<form id="edit_post">
                              <textarea class="form-control"  value="" id="edit_post_body">${postData}</textarea>
                              
                              <input type="submit" value="Edit" id="edit_button" class="btn btn-primary">
                          </form>`;
                          document.querySelector(`#${postId}`).append(editPost);
                           
                          document.querySelector(`#edit_post`).onsubmit = function(){
                                    var editData = document.querySelector('#edit_post_body').value;
                                    console.log(editData);
                                    
                                    mainelement.childNodes[2].innerHTML = editData;
                                    
                                    document.querySelector(`#${postId}`).innerHTML = "";
                                    console.log(mainelement);
                                    document.querySelector(`#${postId}`).innerHTML = mainelement.innerHTML;
                                    fetch('/edit_post',{method:'POST',body:JSON.stringify({post_id:actual_post_id,post_data:editData})})
                                    .then(Response=>Response.json())
                                    .then(data => console.log(data));
                                    return false;
                            
                          }




                          }
                       
                      }
                 })
                 }, 500)


       
       
        setTimeout(function(){
           const likes = document.querySelectorAll('.like');
           var user=  document.querySelector('#username').value;
           likes.forEach(element=>{
            
               element.onclick = function(){
                if(user){
                   console.log(this.dataset.like);
                   const childi =  element.childNodes[0];
                   const classname = childi.className;
                  console.log(element.id);
                  if(classname == "fa fa-heart-o")
                  {
                      childi.className = "fa fa-heart";

                      childi.innerHTML = parseInt(this.dataset.like)+1;
                      this.dataset.like = parseInt(this.dataset.like)+1;
                      fetch('/new_like',{
                          method:'POST',
                          body:JSON.stringify({
                              post_id: element.id

                          })
                      }).then(response=> response.json())
                      .then(result => console.log(result));
                  }
                  else if(classname == "fa fa-heart")
                  {
                    childi.className = "fa fa-heart-o";

                    
                    childi.innerHTML = parseInt(this.dataset.like) - 1;
                    this.dataset.like = parseInt(this.dataset.like) - 1;
                    fetch('/unlike',{
                        method:'PUT',
                        body:JSON.stringify({
                            post_id: element.id

                        })
                    }).then(response=> response.json())
                    .then(result => console.log(result));
                  }

               }
               
            }
           }
           )
         


           const users = document.querySelectorAll(".users");
           
            users.forEach(person =>{
                if(section == "allposts"){
                   person.onclick = function(){
                       section = "user-post";
                    Pages_arrangement(section,person.innerHTML);
                    document.querySelector("#profile").style.display = "block";
                    document.querySelector("#allpost").style.display = "none";

                    document.querySelector("#following-section").style.display = "none";
                    document.querySelector("#paginationuser-post").style.display = "block";
                    document.querySelector("#paginationfollow-post").style.display = "none";
                    document.querySelector("#paginationallposts").style.display = "none";
                    
                    
                    let follow = [];
                    fetch('/follow_count' , {
                        method: 'PUT',
                        body: JSON.stringify({
                        username: person.innerHTML
                        
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                               follow.push(data);
                               
                                     })

                 setTimeout(function(){
               
                 
                   const itemOne = document.createElement('div');
                         itemOne.innerHTML = `<div class="profile-card" style = "margin:20px;">
                         <h5 class="card-header">${person.innerHTML}</h5>
                         <div class="card-body">
                         <div><span>Followers:</span><span id = "followers">${follow[0][0]}</span></div>
                         <div><span>Following:</span><span id = "following">${follow[0][1]}</span></div>
                          <a class="btn btn-primary" id="follow-btn">Follow</a>
                         </div>
                       </div>`;
                       document.querySelector('#profile-section').append(itemOne);
                       
                       if(person.innerHTML == document.querySelector('#username').value)
                    {      
                            var button = document.querySelector('#follow-btn');
                            button.className = "btn btn-primary disabled";
                    }
                    else{
                        let check = [];
                        fetch('/follow_check',{
                            method: 'POST',
                            body: JSON.stringify({
                                user: person.innerHTML,
                                friend: document.querySelector('#username').value
                            })
                        })
                        .then(Response =>Response.json())
                        .then(data=>check.push(data[0]))
                        setTimeout(function(){
                           if(check[0]=="true")
                           document.querySelector('#follow-btn').innerHTML = "Unfollow";
                           else
                           document.querySelector('#follow-btn').innerHTML = "Follow";

                        },50)
                        
                        var fol = document.querySelector('#follow-btn');
                        
                        fol.onclick = function(){
                            if(fol.innerHTML=="Follow")
                            {      
                                var friends = document.querySelector('#followers');
                                
                                friends.innerHTML = parseInt(friends.innerHTML)+1;
                                fol.innerHTML = "Unfollow";
                                fetch('/follow_add',{
                                    method: 'POST',
                                    body: JSON.stringify({
                                        user: person.innerHTML,
                                        friend: document.querySelector('#username').value
                                    })
                                })
                                .then(Response =>Response.json())
                                .then(data=>console.log(data))
                            }
                            else if(fol.innerHTML =="Unfollow")
                            {
                                var friends = document.querySelector('#followers');
                                friends.innerHTML = parseInt(friends.innerHTML)-1;
                                fol.innerHTML = "Follow";
                                fetch('/follow_remove',{
                                    method: 'POST',
                                    body: JSON.stringify({
                                        user: person.innerHTML,
                                        friend: document.querySelector('#username').value
                                    })
                                })
                                .then(Response =>Response.json())
                                .then(data=>console.log(data))
                            }
                        }
                    }
                    
 
                    },100);

                    

                   }
                }
                
            });
        



        },500);

        
    
    }
})

}

function Pages_arrangement(section,postUser){
const page = document.createElement('div');
var current_page = 1;
posts(1,section,postUser);
page.innerHTML = `<nav aria-label="Page navigation example">
<ul class="pagination justify-content-end">
  <li class="page-item disabled">
    <a class="page-link"  tabindex="-1" aria-disabled="true" style="cursor:pointer;">Previous</a>
  </li>
  <li class="page-item">
    <a class="page-link" aria-disabled ="false" style="cursor:pointer;">Next</a>
  </li>
</ul>
</nav>`;

     
    
document.querySelector(`#pagination${section}`).append(page);



const items = document.querySelectorAll(".page-link");
items.forEach(item =>{
    item.onclick = function(){
        document.querySelector(`#${section}`).innerHTML = "";
       if(item.innerHTML=="Previous")
       {
           if(current_page>1)
           {
               current_page = current_page -1;
               posts(current_page,section,postUser);
           }
           if(current_page>1)
           {
               item.parentElement.className = "page-item";
           }
           else{
               current_page = current_page -1;
            item.parentElement.className = "page-item disabled";
           }
       }
       else if(item.innerHTML == "Next")
       {    
             current_page = current_page + 1;
             posts(current_page,section,postUser);
             var pre = document.querySelector('.page-item ');
             console.log(pre);
             pre.className = "page-item";
             
       }
    }
})
}

    Pages_arrangement(section,"0");



document.querySelector("#nav_following").onclick = function(){
    section = "follow-post";
    document.querySelector("#following-section").style.display = "block";
    document.querySelector("#profile").style.display = "none";
    document.querySelector("#allpost").style.display = "none";
    document.querySelector("#paginationuser-post").style.display = "none";
    document.querySelector("#paginationfollow-post").style.display = "block";
    document.querySelector("#paginationallposts").style.display = "none";
    Pages_arrangement(section,"0");
}


});

