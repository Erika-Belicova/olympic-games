import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | null> = of(null); // observable for raw data
  public pieChartData$: Observable<{ name: string; value: number }[]> = of([]); // observable for pie chart data

  // configuration for ngx-charts
  view: [number, number] = [700, 400];

  // options for ngx-charts
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme: string = 'cool';

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.fetchData();
  }

  // fetch data for pie chart
  fetchData(): void {
    this.pieChartData$ = this.olympicService.loadInitialData().pipe(
      map((data) => 
        data 
          ? data.map((country) => ({
              name: country.country,
              value: this.calculateMedals(country.participations),
          }))
          : [] // return empty array if data is null
      ),
      catchError((error) => {
        console.error('Error while fetching data:', error);
        return of([]); // return empty array in case of error
      })
    );
  }

  // sum of medals per country
  private calculateMedals(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  onSelect(data: { name: string, value: number }): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: { name: string, value: number }): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: { name: string, value: number }): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
