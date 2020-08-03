let textarea = document.querySelector('textarea#importCode'),
    importButton = document.querySelector('#import-button'),
    importForm = document.querySelector('form#import-list'),
    listContainer = document.querySelector('.list-container');

let filterForm = document.querySelector('form#filter-courses'),
    input = document.querySelector('#courseCode'),
    output = document.getElementById('output'),
    count = document.getElementById('count');

importForm.addEventListener('submit', (e) => {
    e.preventDefault();
    listContainer.innerHTML = textarea.value;
    document.querySelector('hr').classList.remove('hidden');
    filterForm.classList.remove('hidden');
    document.querySelector('details').open = false;
    return false;
});



filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let nodeList = document.querySelectorAll('ul li a'),
        list = Array.from(nodeList);
        code = input.value;
    // console.log(code);

    let data = list.map(el => extractInfo(el, code)).filter(el => el != null);
    output.innerHTML = json2Table(data);
    count.innerText = `Showing ${data.length} courses.`;
    return false;
})

function extractInfo(item, code) {
    let regexString = `(${code}-\\d\\d\\d(?:-PB|))(?: - | )(.+|)(?: |)\\(\\1\\)$`;
    
    let regex = new RegExp(regexString, 'm');
    try {
        let match = item.text.match(regex);
        return {
            code: match[1],
            title: match[2] == '' ? 'Playback Ticket Activity' : match[2], 
            url: item.href
        }
    } 
    catch {
        return null;
    }
}

function json2Table(json) {
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