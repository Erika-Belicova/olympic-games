import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { single } from 'src/app/pages/home/data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | null> = of(null); // observable for raw data
  public pieChartData$: Observable<{ name: string; value: number }[]> = of([]); // observable for pie chart data

  // configuration for ngx-charts
  single: any[] = [];
  view: [number, number] = [700, 400];

  // options for ngx-charts
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme: string = 'cool';

  constructor(private olympicService: OlympicService) {
    Object.assign(this, { single });
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
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
