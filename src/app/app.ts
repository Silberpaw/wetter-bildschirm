import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WetterService } from './wetter';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Subscription } from 'rxjs';
registerLocaleData(localeDe);

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  city = 'Berlin';
  temperature: number | null = null;
  condition = 'Wetter wird geladen ...';
  humidity: number | null = null;
  windSpeed: number | null = null;
  loading = false;
  weatherIcon = '🌤️';
  weatherDescription = 'Wetter wird geladen ...';
  errorMessage = '';
  forecast: any[] = [];

  private wetterService = inject(WetterService);
  private searchId = 0;
  constructor() {
    this.searchCity();
  }

  getWeatherDescription(code: number): { icon: string; text: string } {
    if (code === 0) return { icon: '☀️', text: 'Klarer Himmel' };
    if (code === 1) return { icon: '🌤️', text: 'Überwiegend klar' };
    if (code === 2) return { icon: '⛅', text: 'Teilweise bewölkt' };
    if (code === 3) return { icon: '☁️', text: 'Bewölkt' };
    if (code === 45 || code === 48) return { icon: '🌫️', text: 'Neblig' };
    if (code >= 51 && code <= 57) return { icon: '🌦️', text: 'Nieselregen' };
    if (code >= 61 && code <= 67) return { icon: '🌧️', text: 'Regen' };
    if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Schnee' };
    if (code >= 80 && code <= 82) return { icon: '🌧️', text: 'Regenschauer' };
    if (code >= 85 && code <= 86) return { icon: '🌨️', text: 'Schneeschauer' };
    if (code >= 95 && code <= 99) return { icon: '⛈️', text: 'Gewitter' };

    return { icon: '🌡️', text: 'Unbekannter Wetterzustand' };
  }

  searchCity() {
    const currentSearchId = ++this.searchId;
    const cityName = this.city.trim();
      console.log('Stadtsuche wurde aufgerufen');


    if (!cityName) {
      this.errorMessage = 'Bitte gib einen Stadtnamen ein.';
      return;
    }

    this.loading = true;
    console.log('Gesuchter Stadtname:', cityName);
    this.errorMessage = '';
    this.condition = 'Wetter wird geladen ...';

    this.wetterService.getStadt(cityName).subscribe({
      next: (response: any) => {
        if (currentSearchId !== this.searchId) return;
        const location = response.results?.[0];

        if (!location) {
          this.loading = false;
          this.errorMessage = 'Stadt nicht gefunden.';
          this.condition = 'Keine Wetterdaten verfügbar';
          this.forecast = [];
          return;
        }

        this.city = location.name;

        this.wetterService
          .getWetter(location.latitude, location.longitude)
          .subscribe({
            next: (data: any) => {
              if (currentSearchId !== this.searchId) return;
              this.temperature = data.current.temperature_2m;
              this.humidity = data.current.relative_humidity_2m;
              this.windSpeed = data.current.wind_speed_10m;

              const currentWeather = this.getWeatherDescription(
                data.current.weather_code
              );

              this.weatherIcon = currentWeather.icon;
              this.weatherDescription = currentWeather.text;
              this.condition = currentWeather.text;

              this.forecast = (data.daily?.time ?? []).map(
                (date: string, index: number) => {
                  const dailyWeather = this.getWeatherDescription(
                    data.daily.weather_code[index]
                  );

                  return {
                    date: date,
                    icon: dailyWeather.icon,
                    description: dailyWeather.text,
                    maxTemp: data.daily.temperature_2m_max[index],
                    minTemp: data.daily.temperature_2m_min[index]
                  };
                }
              );

              this.loading = false;
            },
            error: () => {
              this.errorMessage =
                'Wetterdaten konnten nicht geladen werden.';
              this.loading = false;
            }
          });
      },
      error: () => {
        this.errorMessage =
          'Stadtsuche fehlgeschlagen. Bitte versuche es erneut.';
        this.loading = false;
      }
    });
  }
}
