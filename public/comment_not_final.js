import { Comment } from './comments.js';
import { Weather } from './weather_box.js';



var saveToLocalStorage = function (weather_posts) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(weather_posts));
}
var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}

var STORAGE_ID = 'weather';
var weather_posts = getFromLocalStorage();
var source = $('#weather-template').html();
var template = Handlebars.compile(source);


var convertToCelcium = function (main_temp) {
    return (main_temp - 273);
}
var convertToFahrenheit = function (main_temp) {
    return 1.8 * (main_temp - 273) + 32;
}

var guidPostId = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    // then to call it, plus stitch in '4' in the third group
    let guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
}

var addComment = function (comment, cur_btn) {
    let id_answer = $(cur_btn).closest('.answer').data().id;
    let arrayFromLS = getFromLocalStorage();

    for (let i = 0; i < arrayFromLS.length; i++) {
        if (arrayFromLS[i].id === id_answer) {
            // arrayFromLS[i].comments.push({"id":arrayFromLS[i].comments.length,"text":comment});
            arrayFromLS[i].comments.push(new Comment(arrayFromLS[i].comments.length, comment));
        }
    }
    console.log("return", arrayFromLS);
    return arrayFromLS;
}

// var BindAddComment = function () {
//     // $('.add-comment').off();
//     $('.add-comment').click(function () {
//         let comment = $(this).parent().parent().find('input').val();
//         if (comment) {
//             saveToLocalStorage(addComment(comment, this));
//             console.log(getFromLocalStorage());
//             AppendData();
//         }
//         else {
//             alert("Your comment is empty");
//         }
//     })

// }
var AppendData = function () {
    $('.answers').empty();
    let temperature = { "weather_posts": weather_posts };
    console.log("temperature", temperature);
    var newHTML = template(temperature);
    $('.answers').append(newHTML);
    // BindAddComment();
}
//-----------START----------------
// if (getFromLocalStorage().length) {
//     AppendData();
// }
//------------------------------


var saveToObj = function (data) {
    let id = guidPostId();
    let temp_C = Math.round(convertToCelcium(data.main.temp));
    let temp_F = Math.round(convertToFahrenheit(data.main.temp));
    let date = new Date();
    let date_time = date.getHours() + ":"
        + date.getMinutes() + " on " + date.getDate() + "/" +
        (date.getMonth() + 1) + "/" + date.getFullYear();
    console.log("date_time", date_time);
    console.log("weather_post", weather_posts);
    weather_posts.push(new Weather(id, data.name, temp_C, temp_F, date_time));
    return (weather_posts);
}

var fetch = function (city_name) {
    $.ajax({
        method: "GET",
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city_name
            + '&appid=0d56cc322ea663bf00369beddf3f9f61',
        success: function (data) {
            if (data) {
                let temperature = saveToObj(data);
                saveToLocalStorage(temperature);
                AppendData();
            }
            else {
                $('.answers').append("Check city name");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("uncorrect City Name");
            AppendData();
            console.log(textStatus);
        }
    });
};


//Insert new search
$('.search').on('click', function () {
    $('.answers').empty();
    var title = $('input').val();
    fetch(title);
})

$('.answers').on('click','.add-comment',function () {
    let comment = $(this).parent().parent().find('input').val();
    if (comment) {
        saveToLocalStorage(addComment(comment, this));
        console.log(getFromLocalStorage());
        AppendData();
    }
    else {
        alert("Your comment is empty");
    }
})

//Insert new Comment
// $('.search').on('click', function () {
   //Pick up the information you want
   //send to a function that would push it (parentid,comment)
   //The same function should also savetolocalstorage every time
   // **** all functions that change data (add/remove) should call every time the savetolocalstorage

// })
