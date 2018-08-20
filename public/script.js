import { Comment } from './comments.js';
import { Weather } from './weather_box.js';

var STORAGE_ID = 'weather';

var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(weather_posts.w_data));
}
var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
}
var weather_posts = { "w_data": getFromLocalStorage() };

// console.log("weather_posts",weather_posts);
var source = $('#weather-template').html();
var template = Handlebars.compile(source);


var convertToCelcium = function (main_temp) {
    return (main_temp - 273);
}
var convertToFahrenheit = function (main_temp) {
    return 1.8 * (main_temp - 273) + 32;
}

var addComment = function (comment, id_answer) {
    // for (let i = 0; i < weather_posts.w_data.length; i++) {
    //      
    weather_posts.w_data.map((item) => {
        if (item.id === id_answer) {
            item.comments.push(new Comment(item.comments.length, comment));
        }
    })
}
// }

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
    saveToLocalStorage();
    // console.log("Append",weather_posts );
    var newHTML = template(weather_posts);
    $('.answers').append(newHTML);
}
//-----------START----------------
if (weather_posts.w_data.length) {
    AppendData();
}
//------------------------------

var guidPostId = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // then to call it, plus stitch in '4' in the third group
    let guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
}

var saveToObj = function (data) {
    let id = guidPostId();
    let temp_C = Math.round(convertToCelcium(data.main.temp));
    let temp_F = Math.round(convertToFahrenheit(data.main.temp));
    let date = new Date();
    let date_time = date.getHours() + ":"
        + date.getMinutes() + " on " + date.getDate() + "/" +
        (date.getMonth() + 1) + "/" + date.getFullYear();
    // let weather_posts = getFromLocalStorage();
    // console.log("date_time", date_time);
    console.log("weather_post", weather_posts);
    weather_posts.w_data.push(new Weather(id, data.name, temp_C, temp_F, date_time));
}

var fetch = function (city_name) {
    $.ajax({
        method: "GET",
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city_name
            + '&appid=0d56cc322ea663bf00369beddf3f9f61',
        success: function (data) {
            if (data) {  
                saveToObj(data);
                // saveToLocalStorage();
                AppendData();
            }
            else {
                $('.answers').append("Check city name");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("uncorrect City Name");
            // AppendData();
            console.log(textStatus);
        }
    });
};


//Insert new search
$('.search').on('click', function () {
  
    var title = $('input').val();
    fetch(title);
})

$('.answers').on('click', '.add-comment', function () {
    let comment = $(this).parent().parent().find('input').val();
    let id_answer = $(this).closest('.answer').data().id;

    if (comment) {
        addComment(comment, id_answer);
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
