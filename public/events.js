document.addEventListener("DOMContentLoaded", (e)=> {
    fetch("/kitten/image")
        .then(obj => {
            if(!obj.ok){
                throw obj;
            }
            return obj.json();
        })
        .then(obj => {
            document.getElementById("catpic").setAttribute("src", obj.src);
        })
        .catch(error => {
            error.json()
            .then(err=> { 
                document.querySelector(".error")
                    .innerHTML = err.message;
            })
        })
        
    document.getElementById('new-pic')
        .addEventListener('click', (e) => {
            document.querySelector('.error').innerHTML = '';
            document.querySelector('.loader')     
            .innerHTML = "Loading...";
            fetch("/kitten/image")
            .then(obj => {
                if (!obj.ok) {
                    throw obj;
                }
                return obj.json()
            })
            .then(obj => {
                document.getElementById("catpic")
                .setAttribute('src', obj.src);
                document.querySelector('.loader')
                    .innerHTML = "<br>";
            }).catch(error => {
                error.json()
                .then(error => {
                    document.querySelector('.error')
                    .innerHTML = error.message;
                })
            })
        })
        
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    document.getElementById('upvote')
        .addEventListener('click', (e) => {
              fetch('/kitten/upvote', options)
              .then(res => {
                  if (!res.ok) {
                      alert('something went wrong!')
                    }
                return res.json()})
              .then(obj => {
                document.querySelector('.score').innerHTML = obj.score;
              })

        })
    document.getElementById('downvote')
        .addEventListener('click', (e) => {
            fetch('/kitten/downvote', options)
            .then(res => {
                if(!res.ok){
                    alert("Something went Wrong");
                }
                return res.json();
            })
            .then(res => {
                document.querySelector('.score').innerHTML = res.score
            })
        });
    let form = document.querySelector(".comment-form")
    let submitButton = document.getElementById("submit-button")
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        let comment = formData.get('user-comment');
        let JSONComment = JSON.stringify({comment: comment});
        let commentOptions = {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSONComment
        };
        fetch('/kitten/comments', commentOptions)
            .then(res => {
                if (!res.ok) {
                    alert('something went wrong');
                };
                return res.json();
            }).then(res => {
                let div = document.querySelector('.comments')
                div.innerHTML = ""
                let ul = document.createElement('ul')
                div.appendChild(ul)
                res.comments.forEach((comment, i) => {
                    let newComment = document.createElement('li')
                    let del = document.createElement('button');
                    del.setAttribute('class', 'Delete');
                    del.setAttribute("style", "text-align:right")
                    del.setAttribute('id', i)
                    del.innerHTML = "Delete";
                    newComment.innerHTML = `${comment} --- `;
                    newComment.appendChild(del);
                    ul.appendChild(newComment);
                })
                document.getElementById("user-comment").value = '';
            })
    })

    document.querySelector(".comments")
    .addEventListener('click', (e) =>{
        let button = e.target;
        if (button.tagName === 'BUTTON') {
        
        let delComment = button.getAttribute("id")
        console.log(delComment)
        // let JSONDelComment = JSON.stringify(delComment)
        let delOptions = {
            method: "DELETE",
            // headers:{
            //     "Content-Type": "application/json"
            // },
            // body: JSONDelComment
        }
        fetch(`/kitten/comments/${delComment}`, delOptions)
            .then(res => {
                if(!res.ok){
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then(res => {
                let div = document.querySelector('.comments')
                div.innerHTML = ""
                let ul = document.createElement('ul')
                div.appendChild(ul)
                res.comments.forEach((comment, i) => {
                    let newComment = document.createElement('li')
                    newComment.setAttribute('class', i)
                    let del = document.createElement('button');
                    del.setAttribute('class', 'Delete');
                    del.innerHTML = "Delete";
                    newComment.innerHTML = comment
                    ul.appendChild(newComment);
                    newComment.appendChild(del);
                })
                document.getElementById("user-comment").value = '';
            }).catch(err => {
                console.log(err)
            })
            }
        })

 });