const input = document.getElementById("task-content");
const submit = document.getElementById("task-add");
const url = 'http://crabrave.ddns.net:51001/';

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

// This is working (TODO doc )
const getData = () => {

    const request = new XMLHttpRequest();
    request.open('GET', url+"api-tdl/taskAll", true);
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
                let checkbox = document.createElement("INPUT");
                checkbox.type="checkbox";
                checkbox.name="name";
                checkbox.value="value";
                checkbox.checked = x.isdone;
                checkbox.id="id";

                checkbox.className = "col-lg-1 styled col-sm-2";
                insertPlace.appendChild(div);
                div.appendChild(checkbox);

                checkbox.addEventListener('input', () => {
                    const request = new XMLHttpRequest();
                    let tmp = (!x.isdone) ? 't' : 'f';
                    console.log(x.isdone);
                    request.open('GET', url + "api-tdl/changeCheck?content=" + x.content + "&isdone=" + tmp, true);
                    request.send(null);

                    //redisplay data when one is deleted
                    request.onreadystatechange = () => {
                        if (request.readyState === 4 && request.status === 200) getData();
                    };
                });
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



