import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/OlympicCountry';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { catchError, delay, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public numberOfJOs$: Observable<number | null> = of(null); // observable for number of JOs
  public olympics$: Observable<OlympicCountry[] | null> = of(null); // observable for raw data
  public pieChartData$: Observable<{ name: string; value: number }[] | null> = of(null); // observable for pie chart data

  public error$: Observable<string | null> = of(null); // observable for errors
  private loadingState = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingState.asObservable();

  errorMessage: string = "";

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
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  
    this.olympics$ = this.handleObservableError(
      this.olympicService.getOlympics(),
      'Failed get Olympic data.',
      null
    );

    this.numberOfJOs$ = this.handleObservableError(
      this.olympicService.fetchNumberOfJOs(),
      'Failed to get the number of JOs.',
      null
    );

    this.pieChartData$ = this.handleObservableError(
      this.olympicService.fetchData(),
      'Failed to get the pie chart data.',
      null
    );

    this.loading$ = this.olympicService.loading.pipe(delay(500)); // with 0.5 sec delay
    this.error$ = this.olympicService.error;
  }

  onSelect(data: { name: string, value: number }): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    // on click the country name is used as a route paramter to navigate to detail page
    try {
      this.router.navigateByUrl(`detail/${data.name}`);
    } catch (error) {
      console.error('Error while trying to navigate to detail page:', error);
      this.snackBar.open('An error occurred while trying to open details. ', 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  private handleObservableError<T>(observable$: Observable<T>, errorMessage: string, fallbackValue: T): Observable<T> {
    this.loadingState.next(true); // start loading
    return observable$.pipe(
      catchError(() => {
        this.errorMessage = errorMessage;
        this.showErrorSnackBar(errorMessage);
        this.loadingState.next(false); // end loading
        return of(fallbackValue);
      }),
      tap(() => { 
        this.loadingState.next(false); // end loading
        this.errorMessage = ''; // reset error message
      })
    );
  }
  
  showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
