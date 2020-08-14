document.addEventListener("DOMContentLoaded", (e) => {
    document.querySelector('.score').innerHTML = randomNum();
    fetch("/kitten/image")
        .then(obj => {
            if (!obj.ok) {
                throw obj;
            }
            return obj.json();
        })
        .then(obj => {
            document.getElementById("catpic").setAttribute("src", obj.src);
        })
        .catch(error => {
            error.json()
                .then(err => {
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
                    document.querySelector('.score').innerHTML = randomNum();
                    document.getElementById("cc").innerHTML = ""
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
                    return res.json()
                })
                .then(obj => {
                    let currScore = document.querySelector('.score').innerHTML;
                    let parsed = parseInt(currScore) 
                    document.querySelector('.score').innerHTML = parsed += 1;
                })

        })
    
        document.getElementById('downvote')
        .addEventListener('click', (e) => {
            fetch('/kitten/downvote', options)
                .then(res => {
                    if (!res.ok) {
                        alert("Something went Wrong");
                    }
                    return res.json();
                })
                .then(res => {
                    let currScore = document.querySelector('.score').innerHTML;
                    let parsed = parseInt(currScore) 
                    document.querySelector('.score').innerHTML = parsed -= 1;
                })
        });
    
    let form = document.querySelector(".comment-form")
    let submitButton = document.getElementById("submit-button")
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        let comment = formData.get('user-comment');
        let JSONComment = JSON.stringify({ comment: comment });
        let commentOptions = {
            method: 'POST',
            headers: {
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
                    del.innerHTML = "delete";
                    newComment.innerHTML = `${comment} --- ${getTime()} ---`;
                    newComment.appendChild(del);
                    ul.appendChild(newComment);
                })
                document.getElementById("user-comment").value = '';
            })
    })

    document.querySelector(".comments")
        .addEventListener('click', (e) => {
            let button = e.target;
            if (button.tagName === 'BUTTON') {

                let delComment = button.getAttribute("id")
                console.log(delComment)
                let delOptions = {
                    method: "DELETE",
                }
                fetch(`/kitten/comments/${delComment}`, delOptions)
                    .then(res => {
                        if (!res.ok) {
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
                            let del = document.createElement('button');
                            del.setAttribute('class', 'Delete');
                            del.setAttribute("style", "text-align:right")
                            del.setAttribute('id', i)
                            del.innerHTML = "delete";
                            newComment.innerHTML = `${comment} --- ${getTime()} ---`;
                            newComment.appendChild(del);
                            ul.appendChild(newComment);
                        })
                        document.getElementById("user-comment").value = '';
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })

    function randomNum() {
        return Math.floor(Math.random()*4000)
    }
    
    function getTime() {
        let time = new Date();
        let day = function() {
            switch(time.getDay()) {
                case 0: return 'Sunday'
                case 1: return 'Monday';
                case 2: return 'Tuesday';
                case 3: return 'Wednesday';
                case 4: return 'Thursday';
                case 5: return 'Friday';
                case 6: return 'Saturday'
            }
        }    
        let hour = time.getHours();
        let minute = time.getMinutes();
        return day() + " " + hour + ":" + minute 
    }

});