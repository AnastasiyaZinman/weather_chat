var STORAGE_ID = 'weather';
var weather_posts = [];
var saveToLocalStorage = function (weather_posts) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(weather_posts));
  }
  var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }

$('button').on('click', function () {
    $('.answers').empty();
    var title = $('input').val();
    fetch(title);
})

var convertToCelcium = function(main_temp){
    return (main_temp-273);
}
var convertToFahrenheit = function(main_temp){
    return 1.8 * (main_temp - 273) + 32;
}
var addComment = function(comment, cur_btn){
    let id_answer = $(cur_btn).closest('.answer').data().id;
    let arrayFromLS = getFromLocalStorage();
    
    for (let i=0; i<arrayFromLS.length; i++){
        if (arrayFromLS[i].id === id_answer) {
        arrayFromLS[i].comments.push({"id":arrayFromLS[i].comments.length,"name":comment});
        }
    }
    console.log("return", arrayFromLS);
    return arrayFromLS;
}

var BindAddComment = function(){
    $('.add-comment').off();
    $('.add-comment').click(function () {
    let comment = $(this).parent().parent().find('input').val();
    saveToLocalStorage(addComment(comment, this));
    console.log(getFromLocalStorage());
    AppendData();
    })

}
var AppendData = function () {
    $('.answers').empty();
    let temperature = getFromLocalStorage();
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(temperature[0]);
    $('.answers').append(newHTML);
    BindAddComment();
  }
//-----------START----------------
  if(getFromLocalStorage().length){
    AppendData();  
  }
   //------------------------------

  var guidPostId = function (){
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    }
     
    // then to call it, plus stitch in '4' in the third group
    guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
  }

 var saveToObj = function(data){
  let id =  guidPostId();
  let temp_C = Math.round(convertToCelcium(data.main.temp));
  let temp_F = Math.round(convertToFahrenheit(data.main.temp));
  var date_time = new Date();
  let weather_posts = getFromLocalStorage(); 
  weather_posts.push({"id":id,"city": data.name,"tempC": temp_C, "tempF": temp_F,
  "date": date_time, "comments": []});
  return (weather_posts);
 }
//  var checkClassShow = function(){
//  console.log(   !$('.answer').hasClass("show"));
// if  (!$('.answer').hasClass("show"))
// $('.answer').toggleClass('show');
//  }

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

 