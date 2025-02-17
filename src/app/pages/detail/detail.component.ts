import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public numberOfEntries$: Observable<number> = of(0); // observable for number of entries
  public numberOfMedals$: Observable<number> = of(0); // observable for number of medals
  public numberOfAthletes$: Observable<number> = of(0); // observable for number of athletes
  public lineChartData$: Observable<{ name: string; series: { name: number; value: number; }[] }[] | null> = of([]); // observable for line chart data

  countryName: string = '';

  // configuration for line chart
  animations: boolean = false;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = false;
  colorScheme: string = 'cool';
  trimXAxisTicks: boolean = true;
  autoScale: boolean = true;
  rotateXAxisTicks: boolean = true;

  constructor(private route: ActivatedRoute, 
              private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['name'];
    this.numberOfEntries$ = this.olympicService.getNumberOfEntries(this.countryName);
    this.numberOfMedals$ = this.olympicService.getNumberOfMedals(this.countryName);
    this.numberOfAthletes$ = this.olympicService.getNumberOfAthletes(this.countryName);
    this.lineChartData$ = this.olympicService.fetchDataLineChart(this.countryName);
  }

  formatValuesToString(value: number): string {
    // show only ticks of the games and number of medals
    if ( (value % 1 === 0 && value < 2000 ) || value % 4 === 0) {
      return value.toString(); // format integer to string
    }
    else {
      return '';
    }
  }
}
