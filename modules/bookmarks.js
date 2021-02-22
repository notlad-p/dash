// fetch api data 
async function getApiData(api) {
  let response = await fetch(api);

  let data = await response.json();

  return data;
}

// *****Edit Bookmarks*****

// add bookmark
const addIcon = document.querySelector('.add-icn');
const bookmarkAdd = document.querySelector('.bookmark-add');
const bookmarkContainer = document.querySelector('.bookmarks');

// display add form 
addIcon.addEventListener('click', function displayAddBookmark() {
  bookmarkAdd.style.display = 'block';
});

// add bookmark when done button is clicked
const bookmarkForm = document.querySelector('.edit-form');
const bookmarkDone = document.querySelector('.bm-submit');
const bookmarkUrl = document.querySelector('.add-bookmark-link');
const bookmarkTitle = document.querySelector('.add-bookmark-title');
const bookExit = document.querySelector('#book-exit');

// exit add view when form is not clicked on
bookmarkAdd.addEventListener('mousedown', function(e){
  if(!bookmarkForm.contains(e.target)) {
    bookmarkTitle.value = '';
    bookmarkUrl.value = '';
    bookmarkAdd.style.display = 'none';
  }
});

// exit add view when X is clicked
bookExit.addEventListener('click', function(){
  bookmarkTitle.value = '';
  bookmarkUrl.value = '';
  bookmarkAdd.style.display = 'none';
});

// IndexedDB: Store Bookmark info
// One DB for all bookmarks
// Walkthrough: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage

let db;

function handleDB() {
  let request = window.indexedDB.open('bookmarks_db', 1);

  request.onerror = function() {
    console.error('Database failed to open');
  };
  
  request.onsuccess = function() {
    console.log('Database opened');
  
    // store opened database in db variable
    db = request.result;

    // display the bookmarks alread in the database
    displayData();
  };

  request.onupgradeneeded = function(e) {
    let db = e.target.result;

    // Create an objectScore to store bookmarks
    let objectStore = db.createObjectStore('bookmarks_os', {keyPath: 'id', autoIncrement: true});

    // Define what data items the objectStore will contain
    objectStore.createIndex('title', 'title', {unique: false});
    objectStore.createIndex('link', 'link', {unique: false});
    objectStore.createIndex('image', 'image', {unique: false});

    console.log('Database setup complete');
  };

  bookmarkForm.addEventListener('submit', function(e) {
    e.preventDefault();
  });
  
  bookmarkDone.addEventListener('click', function addBookmark(e) {
    if (bookmarkUrl.value == '' || bookmarkTitle.value == '') {
      return;
    }
    // if(!/(http(s?)):\/\//i.test(bookmarkUrl.value)) {
    //   bookmarkUrl.value = `https://${bookmarkUrl.value}`
    //   console.log(bookmarkUrl.value);
    // }
    bookmarkAdd.style.display = 'none';
  
    addData();
  });

  async function addData() {
    let apiUrl = bookmarkUrl.value.concat('');
    
    apiUrl = /(http(s?)):\/\//i.test(apiUrl) ?
    apiUrl.replace(/(http(s?)):\/\//i, '') :
    apiUrl;
    
    let bmImage = await getApiData(`http://favicongrabber.com/api/grab/${apiUrl}`)
    .then(data => {
      return data.icons[0].src;
    })
    .catch(err => console.error(err));
    
    let newItem = {title: bookmarkTitle.value, link: bookmarkUrl.value, image: bmImage};
  
    let transaction = db.transaction(['bookmarks_os'], 'readwrite');
  
    let objectStore = transaction.objectStore('bookmarks_os');
  
    let request = objectStore.add(newItem);
  
    request.onsuccess = function() {
      bookmarkTitle.value = '';
      bookmarkUrl.value = '';
    };
  
    transaction.oncomplete = function() {
      console.log('Transaction Completed');
  
      displayData();
    };
  
    transaction.onerror = function() {
      console.log('Transaction not complete');
    };
  }
  
  function displayData() {
    while (bookmarkContainer.firstChild) {
      bookmarkContainer.removeChild(bookmarkContainer.firstChild);
    }
  
    let objectStore = db.transaction('bookmarks_os').objectStore('bookmarks_os');
  
    objectStore.openCursor().onsuccess = function(e) {
      let cursor = e.target.result;
  
      if(cursor) {
        const bookmark = document.createElement('a');
        bookmark.href = /(http(s?)):\/\//i.test(bookmarkUrl.value) ?
        `https://${cursor.value.link}` :
        cursor.value.link;
        // bookmark.href = `https://${cursor.value.link}`;
        bookmark.setAttribute('class', 'b-mark');
        bookmark.setAttribute('data-id', cursor.value.id);
        bookmark.innerHTML = `<img src="${cursor.value.image}" alt="bookmark image" class="b-mark-img">
        <p class="b-mark-title">${cursor.value.title}</p>`;
        // delete button
        const deleteBtn = document.createElement('img');
        deleteBtn.src = 'img/icons/edit/delete.png';
        deleteBtn.setAttribute('class', 'b-mark-delete');

        bookmark.appendChild(deleteBtn);

        let over;
        bookmark.onmouseenter = function() {
          over = setTimeout(function() {
            deleteBtn.style.display = 'block';
          }, 750);
        };

        bookmark.onmouseleave = function() {
          clearTimeout(over);
          deleteBtn.style.display = 'none';
        };

        deleteBtn.onclick = deleteItem;

        bookmark.onclick = function(e) {
          if (e.target == deleteBtn) {
            e.preventDefault();
          }
        };
  
        bookmarkContainer.appendChild(bookmark);
  
        cursor.continue();
      }
    };
  }

  function deleteItem(e) {
    // retrieve the name of the bookmark to delete
    let bookmarkId = Number(e.target.parentNode.getAttribute('data-id'));

    // open a database transaction and delete the bookmark using the id from above
    let transaction = db.transaction(['bookmarks_os'], 'readwrite');
    let objectStore = transaction.objectStore('bookmarks_os');
    let request = objectStore.delete(bookmarkId);

    // report that the data item has been deleted
    transaction.oncomplete = function() {
      // delete parent of icon
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      console.log('bookmark ' + bookmarkId + ' deleted.');
    };
  }
}

export { handleDB };