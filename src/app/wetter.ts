import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
providedIn: 'root'
})
export class WetterService {
private http = inject(HttpClient);

getStadt(stadt: string) {
const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(stadt)}&count=1&language=de&format=json`;

return this.http.get(url);


}

getWetter(latitude: number, longitude: number) {
const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;


return this.http.get(url);


}
}
