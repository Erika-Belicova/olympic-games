import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { faAward } from '@fortawesome/free-solid-svg-icons'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public numberOfJOs$: Observable<number | null> = of(0); // observable for number of JOs
  public olympics$: Observable<OlympicCountry[] | null> = of(null); // observable for raw data
  public pieChartData$: Observable<{ name: string; value: number }[] | null> = of([]); // observable for pie chart data

  // configuration for ngx-charts
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme: string = 'cool';
  maxLabelLength: string = '15';
  animations: boolean = false;

  medalIcon = faAward; // medal icon from awesome fonts

  constructor(private olympicService: OlympicService, 
              private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.numberOfJOs$ = this.olympicService.fetchNumberOfJOs();
    this.pieChartData$ = this.olympicService.fetchData();
  }

  onSelect(data: { name: string, value: number }): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    // on click the country name is used as a route paramter to navigate to detail page
    this.router.navigateByUrl(`detail/${data.name}`);
  }
}
