class Weather {
    constructor (id, cityName, tempC, tempF, date){
        this.id = id;
        this.cityName = cityName;
        this.tempC = tempC;
        this.tempF = tempF,
        this.date = date,
        this.comments = []; 
    }
}
export {Weather};