var thumbUp = document.getElementsByClassName("fa-caret-square-up");
var thumbDown = document.getElementsByClassName("fa-caret-square-down");
var trash = document.getElementsByClassName("fa-trash-alt");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.parentNode.childNodes[6].innerText
                console.log("name",name)
        const url = this.parentNode.parentNode.parentNode.childNodes[3].innerText
                console.log("url",url)
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)
                console.log("thumbUp", thumbUp)
        fetch('thumbUp', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'url': url,
            'thumbCount':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.parentNode.childNodes[6].innerText
        const url = this.parentNode.parentNode.parentNode.childNodes[3].innerText
        const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)
        fetch('thumbsDown', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'url': url,
            'thumbCount':thumbDown
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[6].innerText
        console.log("name", name)
        const url = this.parentNode.parentNode.childNodes[3].innerText
        console.log("url", url)
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'url': url
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
