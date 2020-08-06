const textarea = document.querySelector('textarea#importCode'),
      importButton = document.querySelector('#import-button'),
      importForm = document.querySelector('form#import-list'),
      listContainer = document.querySelector('.list-container'),
      codeToCopy = document.querySelector('code#copyCode');

const filterForm = document.querySelector('form#filter-courses'),
      input = document.querySelector('#courseCode'),
      output = document.getElementById('output'),
      countLabel = document.getElementById('count');

// EVENT LISTENERS //

// automatically copy the code upon clicking
codeToCopy.addEventListener('click', (e) => copyOnCLick(codeToCopy));

// import the html from TalentLMS and create table
importForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addToDOM(textarea.value);
    makeTablefromList();
});
importForm.addEventListener('keyup', (e) => {
    if (e.which == 13) {
        addToDOM(textarea.value);
        makeTablefromList();
    }
});

// filter the table based on the course code
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterRows(input.value);  
})
filterForm.addEventListener('keyup', (e) => {
    filterRows(input.value);
})

// FUNCTIONS //

// Add the imported HTML to the DOM
function addToDOM(html) {
    listContainer.innerHTML = html;
    document.querySelector('hr').classList.remove('hidden');
    filterForm.classList.remove('hidden');
    codeToCopy.classList.remove('clicked');
    document.querySelector('details').open = false;
    return false;
}
// Make a table from list
function makeTablefromList() {
    let nodeList = document.querySelectorAll('ul li a'),
        list = Array.from(nodeList),
        data = list.map(el => extractInfo(el)).filter(el => el != null);
    
    output.innerHTML = json2Table(data);
    countLabel.innerText = `Showing ${data.length} courses.`;
    return false;
}

// Extract information from list items and return as an object
function extractInfo(item) {
    let regex = /(?:(?:\d+%\d+%|Completed(?: | )|Not passed(?: | )|)(?:(?: | )Restricted|)([A-Z]{2,7}(?:-\d\d\d)(?:-PB|)) (?:- |)(.+(?= \(.+\))|.+)|(?:\d+%\d+%|Completed(?: | )|)(.+) \(([A-Z]{2,7}-.+)\))/;
    try {
        let match = item.text.match(regex);
        if (match[1] != undefined) {
            return {
                code: match[1],
                title: match[2], 
                url: item.href
            }
        } else {
            return {
                code: match[4],
                title: match[3], 
                url: item.href
            }
        }   
    } 
    catch {
        return null;
    }
}

// Make HTML table from JSON data
function json2Table(json) {
    if (json[0] == undefined) {
        let errorMessage = `
            <div class="alert alert-danger" role="alert">
                You didn't enter valid html. Please try again.
            </div>
        `;
        return errorMessage;
    }
    let cols = Object.keys(json[0]);
  
    //Map over columns, make headers,join into string
    let headerRow = cols
      .map(col => `<th>${col}</th>`)
      .join("");
  
    //map over array of json objs, for each row(obj) map over column values,
    //and return a td with the value of that object for its column
    //take that array of tds and join them
    //then return a row of the tds
    //finally join all the rows together
    let rows = json
      .map(row => {
        let tds = cols.map(col => `<td>${row[col]}</td>`).join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");
  
    //build the table
    const table = `
      <table class="table table-striped">
          <thead>
              <tr>${headerRow}</tr>
          <thead>
          <tbody>
              ${rows}
          <tbody>
      <table>`;
  
    return table;
}

function filterRows(query) {
    if (query == undefined) {
        query = input.value;
    }
    let regex = new RegExp(query, 'i'),
        rows = document.querySelectorAll('#output table tbody tr'),
        count = 0;
    

    rows.forEach(row => {
        if (regex.test(row.firstChild.textContent)) {
            row.classList.remove('d-none');
            count++;
       } else {
            row.classList.add('d-none');
       }
    })
    countLabel.innerText = `Showing ${count} courses.`;
}

// Copy on click
function copyOnCLick (code) {
    const el = document.createElement('textarea');
    el.value = code.innerText;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    code.classList.add('clicked');
  };
