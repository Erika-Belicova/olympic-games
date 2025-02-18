import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, Observable, of, take, tap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public numberOfEntries$: Observable<number | null> = of(null); // observable for number of entries
  public numberOfMedals$: Observable<number | null> = of(null); // observable for number of medals
  public numberOfAthletes$: Observable<number | null> = of(null); // observable for number of athletes
  public lineChartData$: Observable<{ name: string; series: { name: number; value: number; }[] }[] | null> | null = of(null); // observable for line chart data

  public error$: Observable<string | null> = of(null); // observable for errors
  private loadingState = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingState.asObservable();
  
  countryName: string = '';
  errorMessage: string = '';

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
              private olympicService: OlympicService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['name'];
    this.ensureValidOlympicsData();

    this.numberOfEntries$ = this.handleObservableError(
      this.olympicService.getNumberOfEntries(this.countryName),
      'Failed to load number of entries.',
      null
    );

    this.numberOfMedals$ = this.handleObservableError(
      this.olympicService.getNumberOfMedals(this.countryName),
      'Failed to load number the of medals.',
      null
    );

    this.numberOfAthletes$ = this.handleObservableError(
      this.olympicService.getNumberOfAthletes(this.countryName),
      'Failed to load number of athletes. ',
      null
    );

    this.lineChartData$ = this.handleObservableError(
      this.olympicService.fetchDataLineChart(this.countryName),
      'Failed to load line chart data. ',
      null
    );

    this.loading$ = this.olympicService.loading.pipe(delay(500)); // with 0.5 sec delay
    this.error$ = this.olympicService.error;
  }
  
  // ensures the data is valid and handles invalid URLs by redirecting
  ensureValidOlympicsData(): void {
    this.olympicService.getOlympics().pipe(take(1)).subscribe({
      next: (olympicsData) => { // check for existing country data
        if (olympicsData === null) { 
          this.errorMessage ='Error: Redirection failed. Please use the buttons to navigate the application. ';
          this.showErrorSnackBar(this.errorMessage);
          this.router.navigateByUrl('/not-found'); // navigate to not found page if no data
          return;
        }
      },
      error: () => {
        this.errorMessage = 'Error loading olympics data';
        this.showErrorSnackBar(this.errorMessage);
      }
    });
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
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
