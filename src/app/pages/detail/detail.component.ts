import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public numberOfEntries$: Observable<number> = of(0); // observable for number of entries
  public numberOfMedals$: Observable<number> = of(0); // observable for number of medals
  public numberOfAthletes$: Observable<number> = of(0); // observable for number of athletes
  public lineChartData$: Observable<{ year: number; value: number }[] | null> = of([]); // observable for line chart data

  countryName: string = '';

  // configuration for line chart
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medals';
  timeline: boolean = true;
  //colorScheme: string = 'cool';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['name'];
  }
}
