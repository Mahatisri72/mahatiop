const domain = 'https://openday.kumaraguru.in/api/v1';
const cardsPerPage = 30;
let currentPage = 1;
let totalPages = 0;

function fetchDepartments() {
    fetch(`${domain}/departments/`)
        .then(response => response.json())
        .then(res => {
            const data = res;
            let depts = '';

            data.forEach(depart => {
                depts += `
                    <div style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://picsum.photos/id/${depart.id}/300/200);"
                         onclick="clicked(this);" id="${depart.id}" class="depts">
                        <h3>${depart.name}</h3>
                    </div>`;
            });

            document.getElementById('alldepartments').innerHTML = depts;
            totalPages = Math.ceil(data.length / cardsPerPage); 
            displayPage(currentPage);
            updatePagination();
        })
        .catch(err => {
            document.getElementById('alldepartments').innerHTML = `<div style="text-align: center; color: red;"><h2>Error! Some Error in Fetching Data</h2><h4>Error Details: ${err}</h4></div>`;
        });
}
const search = () => {
    const searchbox = document.getElementById('search-dept').value.toUpperCase();
    const storeitems = document.getElementById('alldepartments');
    const depts = document.querySelectorAll('.depts');
    const dname = storeitems.getElementsByTagName('h3');

    for (let i = 0; i < dname.length; i++) {
        let match = depts[i].getElementsByTagName('h3')[0];
        let textvalue = match.textContent;
        if (textvalue.toUpperCase().indexOf(searchbox) > -1) {
            depts[i].style.display = '';
        } else {
            depts[i].style.display = 'none';
        }
    }
    if (searchbox === '') {
        pagin();
    }
};
function displayPage(page) {
    const dataContainer = document.getElementById('alldepartments');
    const cards = Array.from(dataContainer.getElementsByClassName('depts'));
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;

    cards.forEach((card, index) => {
        card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
    });
}

function updatePagination() {
    const pageNumbers = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            updatePagination();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
            updatePagination();
        }
    });
}
function clicked(item) {
    const id = item.id;
    const url = `${domain}/department/${id}`;

    fetch(url)
        .then(response => response.json())
        .then(res => {
            const depname = `<h1>Department Name: ${res.name}</h1>`;
            const departimage = `<img src="https://picsum.photos/id/${id}/200/300" alt="department${id}">`;
            const descp = `<h2>Description: ${res.description}</h2><br><h2>Block: ${res.block}</h2><br><h2>Link: <a href="${res.link}">${res.link}</a></h2>`;

            localStorage.setItem('depname', depname);
            localStorage.setItem('descp', descp);
            localStorage.setItem('departimage', departimage);

            window.location.href = 'description.html';
        })
        .catch(err => console.log('Error:', err));
}
fetchDepartments();

