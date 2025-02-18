import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';
import { Participation } from '../models/Participation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar) {}

  loadInitialData() {
    this.loading$.next(true); // loading start
    this.error$.next(null); // clear previous errors

    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.loading$.next(false); // loading end
      }),
      catchError((error) => {
        this.olympics$.next(null);
        return this.handleError(error, 'Failed to load the Olympic data.', []);
      }),
      finalize(() => this.loading$.next(false)) // loading end
    );
  }

  getOlympics(): Observable<OlympicCountry[] | null> {
    return this.olympics$.asObservable();
  }

  get loading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  get error(): Observable<string | null> {
    return this.error$.asObservable();
  }

  // fetch number of JOs
  fetchNumberOfJOs() {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => {
        return this.getUniqueYearsOfJOs(data);
      }),
      catchError((error) => this.handleError(error, 'Failed to fetch the number of JOs.', null))
    );
  }

  private getUniqueYearsOfJOs(data: OlympicCountry[] | null): number | null {
    if (!data) return null; // return null if no data
    const yearsOfAllJOs = data.flatMap((country) =>
      country.participations
        .map((participation) => participation.year)
        .filter(year => year != null && !isNaN(year))
  );
    return new Set(yearsOfAllJOs).size; // provides the number of unique years of all JOs
  }

  // fetch data for pie chart
  fetchData() {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => 
        data 
          ? data.map((country) => ({
              name: country.country,
              value: this.calculateMedals(country.participations),
          }))
          : [] // return empty array if data is null
      ),
      catchError((error) => this.handleError(error, 'Failed to fetch the pie chart data.', null))
    );
  }

  // sum of medals per country
  private calculateMedals(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  // get number of entries for the country
  getNumberOfEntries(countryName: string) {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => {
        const entries = this.getParticipationsOfCountry(data, countryName);
        return typeof entries === 'number' && !isNaN(entries) ? entries : null;
      }),
      catchError((error) => this.handleError(error, 'Failed to get the number of entries.', null))
    );
  }

  private getParticipationsOfCountry(data: OlympicCountry[] | null, countryName: string): number | null {
    if (!data || !countryName) return null; // return 0 if no data
    const country = data.find((country) => country.country === countryName); // find the country
    const participationCount = country ? country.participations.length : null; // count the number of participations present
    return participationCount !== null && !isNaN(participationCount) ? participationCount : null;
  }

  // get number of medals for the country
  getNumberOfMedals(countryName: string) {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => {
        return this.getMedalsOfCountry(data, countryName);
      }),
      catchError((error) => this.handleError(error, 'Failed to get the number of medals for the country.', null))
    );
  }

  private getMedalsOfCountry(data: OlympicCountry[] | null, countryName: string): number {
    if (!data || !countryName) return 0; // return 0 if no data
    const country = data.find((country) => country.country === countryName); // find the country
    return country ? this.calculateMedals(country.participations) : 0; // count the number medals per participation of the country
  }

  // get number of athletes for the country
  getNumberOfAthletes(countryName: string) {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => {
        let athletes = this.getAthletesOfCountry(data, countryName);
        if (athletes === null || isNaN(athletes) || athletes < 0) {
          athletes = null;
        }
        return athletes;
      }),
      catchError((error) => this.handleError(error, 'Failed to get number the of athletes for the country.', null))
    );
  }

  private getAthletesOfCountry(data: OlympicCountry[] | null, countryName: string): number | null {
    if (!data || !countryName) return null; // return 0 if no data
    const country = data.find((country) => country.country === countryName); // find the country
    // sum up the total number of athletes from each participation of the country
    return country ? country.participations.reduce((total, participation) => total + participation.athleteCount, 0) : null;
  }

  // fetch data for line chart
  fetchDataLineChart(countryName: string): Observable<{ name: string; series: { name: number; value: number }[] }[]> {
    return this.olympics$.asObservable().pipe(
      map((data: OlympicCountry[] | null) => { 
        if (!data) return []; // empty array if data not found
        const country = data.find((country) => country.country === countryName); // find the country
        const lineChartData = country ? country.participations.map((participation) => ({
          name: participation.year,
          value: participation.medalsCount,
        }))
        : [];
        const formattedData = country ? [{ name: country.country, series: lineChartData }] : []; // correct formatting for the line chart
        return formattedData;
      }),
      catchError((error) => this.handleError(error, 'Failed to fetch line chart data.', []))
    );
  }

  private handleError<T>(error: unknown, message: string, fallbackValue: T): Observable<T> {
    let errMessage = this.getErrorMessage(error, message);
    this.error$.next(errMessage); // update error$
    this.displayErrorMessage(errMessage); // display with snack-bar
    return of(fallbackValue);
  }
  
  private getErrorMessage(error: unknown, message: string): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'No internet connection found. Please check your connection to the internet.';
        case 404:
          return 'The data could not be found.';
        case 500:
        case 502:
        case 503:
          return 'The server is currently unavailable. Please try again later.';
        default:
          return `${message} (Status: ${error.status} - ${error.statusText})`;
      }
    } else if (error instanceof Error) {
      return `An error occurred: ${error.message}`;
    } else {
      return 'An unexpected error has occurred.';
    }
  }
  
  private displayErrorMessage(message: string): void {
    console.error(message);
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
