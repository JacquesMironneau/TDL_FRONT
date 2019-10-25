const input = document.getElementById("task-content");
const submit = document.getElementById("task-add");
const orderby_choice = document.getElementById("orderby_select");
const orderby_button = document.getElementById("orderby_button");
//const url = 'http://crabrave.ddns.net:51001/';
const url = 'http://172.26.122.7:51002';

submit.addEventListener('click', () =>{
    console.log(input.value);
// Test only TODO Remove this
    const request = new XMLHttpRequest();
    console.log("HERE ");

    request.open('GET', url + "api-tdl/add?content=" +input.value +"&isdone=f", true);
    request.send(null);
    console.log("HERE ");

    request.onreadystatechange = () => {
        console.log(request.status);
        if (request.readyState === 4 && request.status === 201)
        {
            console.log("HERE kun");
            getData();
        }
    }
});

// This is working (TODO doc)
const getData = () => {
    const request = new XMLHttpRequest();
    request.open('GET', url+"api-tdl/getAllSorted?orderby="+ orderby_choice.value, true);
    
    request.send(null);
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200)
        {
            const insertPlace = document.getElementById('tdl-content');
            //Delete the previous data to add every new ones
            while (insertPlace.hasChildNodes())
                    insertPlace.removeChild(insertPlace.childNodes[0]);
            console.log(request.response);


            const t = JSON.parse(request.response);
            t.forEach((x) =>
            {
                const div = document.createElement("DIV");
                div.className = "row mt-lg-1 mt-sm-3 mt-xl-2 mt-xs-3";
                let task =  document.createElement('P');
                let btn = document.createElement("BUTTON");

                insertPlace.appendChild(div);

                btn.innerHTML = "Remove";
                btn.className = "col-lg-1 btn-danger col-sm-2";



                btn.addEventListener('click',() =>{
                    const request = new XMLHttpRequest();
                    request.open('GET', url+"api-tdl/deleteSingle?content=" + x.content + "&isdone=" + x.isdone, true);
                    request.send(null);

                    //redisplay data when one is deleted
                    request.onreadystatechange = () => {
                        if (request.readyState === 4 && request.status === 200) getData();
                    };
                });
                task.innerText = x.content;
                task.className = "col-lg-6 col-sm-10";

                //TODO add some content (checkbox for instance)
                div.appendChild(task);
                div.appendChild(btn);

            })
        }
    };
};

//Get data when refresh/ first connection
getData();

//Get categories of task from db
const request = new XMLHttpRequest();
    request.open('GET', url+"api-tdl/getCategories", true);
    request.send(null);
    request.onreadystatechange = () => {
        if (request.readyState === 4 && request.status === 200)
        {
            let insertPlace = document.getElementById('category_name_list');
            const t = JSON.parse(request.response);
            t.forEach(x =>
            {
                let option = document.createElement("option");
                option.value = x.content;
                option.label = x.content;

                insertPlace.appendChild(option);
            })
        }
    };
